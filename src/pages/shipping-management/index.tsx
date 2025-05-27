import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";

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

import { useOrders, useOrderShipment } from "@/hooks/use-orders.tsx";
import { DeliveryReceivingTimeBadge } from "@/components/ui/badge.tsx";
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import UserContext from "../../contexts/user-context.ts";
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

  const deliveryMethodType =
    searchParams.get("deliveryMethodType") || "DELIVERY";
  const deliveryDate =
    searchParams.get("deliveryDate") || format(currentDate, "yyyy-MM-dd");

  const {
    data: { items, meta },
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
        <Navbar className="px-4">
          <NavbarSection>
            <NavbarItem
              to={`?deliveryMethodType=DELIVERY&deliveryDate=${deliveryDate}`}
              current={deliveryMethodType === "DELIVERY"}
            >
              택배
            </NavbarItem>
            <NavbarItem
              to={`?deliveryMethodType=QUICK,PICKUP&deliveryDate=${deliveryDate}`}
              current={deliveryMethodType === "QUICK,PICKUP"}
            >
              퀵 / 방문수령
            </NavbarItem>
          </NavbarSection>
        </Navbar>

        <hr className="mb-5 border-gray-100" />

        <Table className="px-4 overflow-x-auto">
          <TableHead>
            <TableRow>
              <TableHeader className="text-center">주문번호</TableHeader>
              <TableHeader className="text-center">수령인</TableHeader>
              {deliveryMethodType === "QUICK,PICKUP" && (
                <TableCell className="text-center">시간대</TableCell>
              )}
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
                  {deliveryMethodType === "QUICK,PICKUP" && (
                    <TableCell>
                      <div className="flex justify-center">
                        <DeliveryReceivingTimeBadge
                          receivingTime={order.receivingTime}
                        />
                      </div>
                    </TableCell>
                  )}
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
                    <FileInput orderId={order.id} imageUrl={order.imageUrl} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}

function FileInput({ orderId, imageUrl: _imageUrl }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { mutate: fileUpload } = useFileUploadMutation();
  const { mutate: attachImageToOrder } = useOrderShipment(orderId);

  const [imageUrl, setImageUrl] = React.useState(_imageUrl);
  const [isPending, setIsPending] = React.useState(false);

  return (
    <React.Fragment>
      <div className="flex flex-col items-center gap-3">
        {imageUrl && (
          <a href={imageUrl} target="_blank">
            <picture>
              <source
                srcSet={`${imageUrl}?width=100 1x, ${imageUrl}?width=200 2x`}
              />
              <img src={`${imageUrl}?width=100`} alt="" className="rounded" />
            </picture>
          </a>
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
