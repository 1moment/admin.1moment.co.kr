import * as React from "react";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";

import { useParams, useSearchParams } from "react-router";

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
import {
  OrderStatusBadge,
  DeliveryStatusBadge,
} from "@/components/ui/badge.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";

function User() {
  const params = useParams<{ "user-id": string }>();

  const userId = Number(params["user-id"]);
  const { data: user } = useUser(userId);

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
  const [searchParams, setSearchParams] = useSearchParams();

  const ordersPage = Number(searchParams.get("ordersPage") || 1);
  const userId = Number(params["user-id"]);
  const {
    data: { items: orders, meta },
  } = useOrders({ userId, currentPage: ordersPage });

  return (
    <div className="mt-10 p-4 bg-white rounded-xl">
      <Subheading className="">주문정보</Subheading>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeader>주문ID</TableHeader>
            <TableHeader>주문상태</TableHeader>
            <TableHeader>배송상태</TableHeader>
            <TableHeader>결제금액</TableHeader>
            <TableHeader>주문일자</TableHeader>
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
                <TableCell className="tabular-nums">
                  {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")}
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
      <Pagination className="mt-8">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationList>
          {generatePagination(meta.totalPages, meta.page).map((page) => (
            <PaginationPage
              key={`ordersPage-${page}`}
              onClick={() => {
                setSearchParams((searchParams) => {
                  searchParams.set("ordersPage", `${page}`);
                  return searchParams;
                });
              }}
              current={page === ordersPage}
            >
              {page}
            </PaginationPage>
          ))}
        </PaginationList>
        <PaginationNext>다음</PaginationNext>
      </Pagination>
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
