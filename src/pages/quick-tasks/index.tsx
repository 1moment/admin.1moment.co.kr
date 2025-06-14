import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { useSearchParams } from "react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  DeliveryReceivingTimeBadge, QuickTaskBadge,
} from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationPage,
} from "@/components/ui/pagination.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@/components/ui/link.tsx";

import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Select } from "@/components/ui/select.tsx";
import {
  useQuickTaskDeleteMutation,
  useQuickTasks,
} from "@/hooks/use-quick-tasks.tsx";
function QuickTasks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const status = searchParams.get("status");

  const {
    data: { items, meta },
    refetch,
  } = useQuickTasks({ currentPage, status });

  const { isPending, mutate: removeQuickTask } = useQuickTaskDeleteMutation();

  return (
    <div className="mt-10 py-4 bg-white sm:rounded-xl">
      <form className="px-4 items-end flex">
        <div className="grow flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>배송상태</Label>
            </Field>
            <Select
                key={`status-${status}`}
                className="max-w-48"
                name="status"
                defaultValue={status || ''}
            >
              <option value="">선택</option>
              <option value="PENDING">대기중(PENDING)</option>
              <option value="RECEIPTED">배송대기(RECEIPTED)</option>
              <option value="ASSIGNED">배정됨(ASSIGNED)</option>
              <option value="DELIVERING">배송중(DELIVERING)</option>
              <option value="REQUESTED">요청됨(REQUESTED)</option>
              <option value="CANCELED">취소됨(CANCELED)</option>
              <option value="REQUEST_FAILED">요청실패(REQUEST_FAILED)</option>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="shrink-0"
          color="zinc"
        >
          조회
        </Button>
      </form>

      <hr className="mt-4 border-zinc-500/10" />

      <Table className="mt-4 px-4 max-w-[100%]">
        <TableHead>
          <TableRow>
            <TableHeader className="text-center">주문번호</TableHeader>
            <TableHeader className="text-center">배송번호</TableHeader>
            <TableHeader className="text-center">배송사</TableHeader>
            <TableHeader className="text-center">배송상태</TableHeader>
            <TableHeader className="text-center">시간대</TableHeader>
            <TableHeader className="text-center">배정시간</TableHeader>
            <TableHeader className="text-center">배송자</TableHeader>
            <TableHeader className="text-center">배송자 연락처</TableHeader>
            <TableHeader className="text-center">배송시작시간</TableHeader>
            <TableHeader className="text-center">배송완료시간</TableHeader>
            <TableHeader className="text-center">
              estimated devliery at
            </TableHeader>
            <TableHeader className="text-center">
              estimated pick up at
            </TableHeader>
            <TableHeader />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((quickTask) => (
            <TableRow key={quickTask.id}>
              <TableCell className="text-center">
                <Link className="underline" to={`/orders/${quickTask.orderId}`}>
                  {quickTask.orderId}
                </Link>
              </TableCell>
              <TableCell className="tabular-nums">
                {quickTask.partnerOrderId}
              </TableCell>
              <TableCell className="text-center">
                {quickTask.partner.name}
              </TableCell>
              <TableCell className="text-center">
                <QuickTaskBadge deliveryStatus={quickTask.status} />
              </TableCell>
              <TableCell className="text-center">
                <DeliveryReceivingTimeBadge
                  receivingTime={quickTask.receivingTime}
                />
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {quickTask.assignedAt &&
                  format(new Date(quickTask.assignedAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell className="text-center">
                {quickTask.driverName}
              </TableCell>
              <TableCell className="text-center">
                {quickTask.driverPhoneNumber}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {quickTask.deliveryStartedAt &&
                  format(
                    new Date(quickTask.deliveryStartedAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {quickTask.deliveryCompletedAt &&
                  format(
                    new Date(quickTask.deliveryCompletedAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {quickTask.estimatedDeliveryAt &&
                  format(
                    new Date(quickTask.estimatedDeliveryAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {quickTask.estimatedPickUpAt &&
                  format(
                    new Date(quickTask.estimatedPickUpAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
              </TableCell>
              <TableCell>
                <Button
                  color="red"
                  disabled={isPending}
                  onClick={() => {
                    removeQuickTask(quickTask.id, {
                      onSuccess() {
                        refetch();
                        alert("제거 완료");
                      },
                    });
                  }}
                >
                  삭제
                </Button>
              </TableCell>
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
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.set("page", `${page}`);
                  return params;
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
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={<div className="p-8 text-center">불러오는 중...</div>}
        >
          <Heading>퀵 배송 현황</Heading>
          <QuickTasks />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
