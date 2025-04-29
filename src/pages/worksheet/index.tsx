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

import { useOrders } from "@/hooks/use-orders.tsx";
import {
  OrderStatusBadge,
  DeliveryStatusBadge,
} from "@/components/ui/badge.tsx";

const currentDate = new Date();
function Worksheet() {
  const [searchParams, setSearchParams] = useSearchParams();

  const deliveryDate =
    searchParams.get("deliveryDate") || format(currentDate, "yyyy-MM-dd");

  const {
    data: { items, meta },
  } = useOrders({
    currentPage: 1,
    limit: 1000,
    status: "ORDERED",
    deliveryDate,
  });

  return (
    <div className="mt-8 py-4 bg-white border border-gray-100 rounded-xl">
      <form className="px-4 items-end flex">
        <div className="grow flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-center gap-3">
            <Field className="shrink-0 w-16">
              <Label>배송일</Label>
            </Field>
            <Input
              type="date"
              name="deliveryDate"
              defaultValue={deliveryDate}
            />
          </div>
        </div>

        <Button type="submit" className="shrink-0" color="zinc">
          조회
        </Button>
      </form>

      <hr className="my-5 border-gray-100" />

      <Table className="px-4 overflow-x-auto">
        <TableHead>
          <TableRow>
            <TableHeader>주문번호</TableHeader>
            <TableHeader>주문상태</TableHeader>
            <TableHeader>주문상품</TableHeader>
            <TableHeader>배송방식</TableHeader>
            <TableHeader>배정</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link className="underline" to={`/orders/${order.id}`}>
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>
                <OrderStatusBadge orderStatus={order.status} />
              </TableCell>
              <TableCell>
                <ul className="flex flex-col gap-2">
                  {order.items.map((item) => (
                    <li key={`item-${item.id}`}>
                      <div className="flex items-center gap-3">
                        <img
                          width={48}
                          height={48}
                          className="rounded"
                          src={item.product.imageUrl}
                        />
                        <Link to={`/products/${item.product.id}`}>
                          {item.productItem.title}
                        </Link>
                        {item.quantity}개
                      </div>
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                {order.deliveryMethod?.title}
                {order.receivingTime !== 'ANYTIME' && ` (${order.receivingTime})`}
              </TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Heading>작업계획서</Heading>
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
