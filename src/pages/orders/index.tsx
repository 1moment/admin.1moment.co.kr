import * as React from "react";
import { Heading } from "@/components/ui/heading.tsx";
import { useSearchParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Strong, Text } from "@/components/ui/text.tsx";
import { format } from "date-fns/format";
import { Rating } from "@/components/ui/rating.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import {Link} from "@/components/ui/link.tsx";

function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: Order[] }>({
    queryKey: [
      "orders",
      {
        page: currentPage,
      },
    ],
    queryFn: () => {
      return apiClient(`/admin/orders?${searchParams.toString()}&size=20`).then(
        (res) => res.json(),
      );
    },
  });

  return (
    <div>
      <Table className="mt-8">
        <TableHead>
          <TableRow>
            <TableHeader>주문번호</TableHeader>
            <TableHeader>주문상태</TableHeader>
            <TableHeader>구매자</TableHeader>
            <TableHeader>배송지</TableHeader>
            <TableHeader>주문일자</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((order) => (
            <TableRow key={order.id}>
              <TableCell><Link className="underline" to={`/orders/${order.id}`}>{order.id}</Link></TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {/*<p>{order}</p>*/}
              </TableCell>
              <TableCell>
                <Strong>{order.receiverName} / {order.receiverPhoneNumber}</Strong>
                <Text>({order.receiverZipCode}){order.receiverAddress}{order.recieverAddressDetail}</Text>
              </TableCell>
              <TableCell>{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-8">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationList>
          {generatePagination(meta.totalPages, meta.page).map((page) => (
            <PaginationPage
              key={`page-${page}`}
              onClick={() => {
                setSearchParams((searchParams) => {
                  searchParams.set("page", `${page}`);
                  return searchParams;
                });
              }}
              current={page === currentPage}
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

export default function Page() {
  return (
    <React.Fragment>
      <Heading>주문목록</Heading>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">주문 목록을 불러오는 중...</div>
        }
      >
        <Orders />
      </React.Suspense>
    </React.Fragment>
  );
}
