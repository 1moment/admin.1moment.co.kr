import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
import { addDays } from "date-fns/addDays";

import { useSearchParams } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Link } from "@/components/ui/link.tsx";
import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
  useOrderAssignment,
  useOrders,
  useOrderShipment,
} from "@/hooks/use-orders.tsx";
import {
  OrderStatusBadge,
  DeliveryStatusBadge,
  DeliveryReceivingTimeBadge,
} from "@/components/ui/badge.tsx";
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import UserContext from "../../contexts/user-context.ts";
import { useAdminUsers } from "@/hooks/use-admin-users.tsx";
import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";

const timeOrder = {
  QUICK: 0,
  MORNING: 1,
  AFTERNOON: 2,
  EVENING: 3,
  ANYTIME: 4,
};
const currentDate = new Date();
function Worksheet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = React.use(UserContext);

  const deliveryMethodType = searchParams.get("deliveryMethodType") || "";
  const deliveryDate =
    searchParams.get("deliveryDate") || format(currentDate, "yyyy-MM-dd");

  const {
    data: { items, meta },
    refetch,
  } = useOrders({
    currentPage: 1,
    limit: 1000,
    status: "ORDERED",
    deliveryDate,
    deliveryMethodType,
  });

  return (
    <React.Fragment>
      <div className="mt-8 py-4 bg-white border border-gray-100 rounded-xl">
        <form className="px-4 items-end flex justify-between">
          <input
            type="hidden"
            name="deliveryMethodType"
            value={deliveryMethodType}
          />
          <div className="flex items-center justify-center gap-3">
            <Field className="shrink-0 w-16">
              <Label>배송일</Label>
            </Field>
            <Input
              key={`date-${deliveryDate}`}
              type="date"
              name="deliveryDate"
              onBlur={() => console.log("fefe")}
              // onInput={(e) => e.target.form.submit()}
              defaultValue={deliveryDate}
            />
            <Button type="submit" className="shrink-0">
              조회
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-8 py-4 bg-white border border-gray-100 rounded-xl">
        <Table className="px-4 overflow-x-auto">
          <TableHead>
            <TableRow>
              <TableHeader className="text-center">주문번호</TableHeader>
              <TableHeader className="text-center">수령인</TableHeader>
              <TableHeader>주문상품</TableHeader>
              <TableHeader>사진</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .sort(
                (a, b) =>
                  timeOrder[a.receivingTime] - timeOrder[b.receivingTime],
              )
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-center">
                    <Link className="underline" to={`/orders/${order.id}`}>
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p>{order.receiverName}</p>
                    <p>{order.receiverPhoneNumber}</p>
                  </TableCell>
                  <TableCell>
                    <ul className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <li
                          key={`item-${item.id}`}
                          className="flex items-center gap-3"
                        >
                          <img
                            width={48}
                            height={48}
                            className="rounded"
                            alt=""
                            src={`${item.product.imageUrl}?width=96`}
                          />
                          <Link
                            className="whitespace-break-spaces"
                            to={`/products/${item.product.id}`}
                          >
                            {item.productItem.title}
                            &nbsp;{item.quantity}개
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <FileInput
                      orderId={order.id}
                      imageUrl={order.shipment?.imageUrl}
                      refetch={refetch}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}

function FileInput({ orderId, imageUrl: _imageUrl, refetch }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { mutate: fileUpload } = useFileUploadMutation();
  const { mutate: attachImageToOrder } = useOrderShipment(orderId);

  const [imageUrl, setImageUrl] = React.useState(_imageUrl);
  const [isPending, setIsPending] = React.useState(false);

  return (
    <React.Fragment>
      <div className="flex flex-col items-center gap-3">
        {imageUrl && (
          <picture>
            <source
              srcSet={`${imageUrl}?width=100 1x, ${imageUrl}?width=200 2x`}
            />
            <img src={`${imageUrl}?width=100`} alt="" className="rounded" />
          </picture>
        )}
        <Button
          isLoading={isPending}
          onClick={() => {
            fileInputRef.current!.click();
          }}
        >
          {imageUrl ? "이미지 변경" : "이미지 첨부"}
        </Button>
      </div>
      <Input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={({ target, currentTarget: { files } }) => {
          if (files?.[0]) {
            setIsPending(true);
            fileUpload(files[0], {
              onSuccess(data) {
                attachImageToOrder(
                  { imageUrl: data.url },
                  {
                    onSuccess(data) {
                      setImageUrl(data.imageUrl);
                    },
                    onSettled() {
                      setIsPending(false);
                    },
                  },
                );
              },
              onError() {
                setIsPending(false);
              },
              onSettled() {
                target.value = "";
              },
            });
          }
        }}
      />
    </React.Fragment>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Heading>출고</Heading>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">주문 목록을 불러오는 중...</div>
          }
        >
          <Worksheet />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
