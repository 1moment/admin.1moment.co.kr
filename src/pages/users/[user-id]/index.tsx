import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";

import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { Text } from "@/components/ui/text.tsx";
import { CalendarIcon, PhoneIcon, ReceiptTextIcon } from "lucide-react";
import { Link } from "@/components/ui/link.tsx";
import { useUser } from "@/hooks/use-users.tsx";
import { useOrders } from "@/hooks/use-orders.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { OrderStatusBadge, DeliveryStatusBadge } from "@/components/ui/badge.tsx";

function User() {
  const params = useParams<{ "user-id": string }>();

  const userId = Number(params["user-id"]);
  const { data: user } = useUser(userId);

  console.log(user);
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div>
          <div>
            <Heading>{user.email}</Heading>
          </div>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center gap-2">
              <PhoneIcon
                className="text-zinc-500 dark:text-zinc-400"
                width={16}
                height={16}
              />
              {user.phoneNumber}
            </div>

            <div className="flex items-center gap-2">
              <ReceiptTextIcon
                className="text-zinc-500 dark:text-zinc-400"
                width={16}
                height={16}
              />
              {/*<Text>{Number(order.totalPaymentAmount).toLocaleString()}원</Text>*/}
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon
                className="text-zinc-500 dark:text-zinc-400"
                width={16}
                height={16}
              />
              <Text>
                {/*{format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")}*/}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function Orders() {
  const params = useParams<{ "user-id": string }>();

  const userId = Number(params["user-id"]);
  const {
    data: { items: orders, meta },
  } = useOrders({ userId });

  return (
    <div className="mt-10 p-4 bg-white rounded-xl">
      <Subheading className="">주문정보</Subheading>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeader>주문ID</TableHeader>
            <TableHeader>주문상태</TableHeader>
            <TableHeader>배송상태</TableHeader>
            <TableHeader>결제 금액</TableHeader>
          </TableRow>
        </TableHead>
        {orders.length > 0 ? (
          <TableBody>
            {orders.map((order) => (
              <TableRow key={`order-${order.id}`}>
                <TableCell>
                  <Link to={`/orders/${order.id}`}>{order.id}</Link>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge orderStatus={order.status} />
                </TableCell>
                <TableCell>
                  <DeliveryStatusBadge deliveryStatus={order.deliveryStatus} />
                </TableCell>
                <TableCell>
                  {Number(order.totalProductPrice).toLocaleString("ko-KR")}원
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell>주문 정보가 없습니다</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
}

export default function UserPage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">주문정보 불러오는 중...</div>
          }
        >
          <User />
        </React.Suspense>
      </Sentry.ErrorBoundary>

      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <React.Suspense>
          <Orders />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
