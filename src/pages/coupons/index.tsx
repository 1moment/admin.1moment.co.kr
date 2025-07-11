import * as React from "react";
import * as Sentry from "@sentry/react";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { format } from "date-fns/format";
import { useNavigate, useSearchParams } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Strong, Text } from "@/components/ui/text.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Link } from "@/components/ui/link";

import { useCouponCreateMutation, useCoupons } from "@/hooks/use-coupons.tsx";
import { Button } from "@/components/ui/button.tsx";
import CouponFormModal from "@/components/coupons/form-modal.tsx";
import { Field, Fieldset, Label, Legend } from "@/components/ui/fieldset.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";

function Coupons() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const queryType = searchParams.get("queryType");
  const query = searchParams.get("query");

  const {
    data: { items, meta },
  } = useCoupons({ currentPage, queryType, query });

  return (
    <React.Fragment>
      <form className="mb-8 p-4 items-end flex bg-white sm:rounded-xl">
        <Fieldset className="grow flex flex-col items-start justify-start gap-3">
          <Legend>검색조건</Legend>
          <div className="flex items-center justify-center gap-6">
            <Select
              className="max-w-48"
              name="queryType"
              defaultValue={searchParams.get("queryType") || "title"}
            >
              <option value="title">쿠폰명</option>
              <option value="userId">유저ID</option>
              <option value="couponId">쿠폰ID</option>
            </Select>
            <Input
              className="max-w-80"
              name="query"
              placeholder="검색어"
              defaultValue={searchParams.get("query") as string}
            />
          </div>
        </Fieldset>
        <Button type="submit">조회</Button>
      </form>

      <div className="bg-white rounded-xl">
        <Table className="px-4">
          <TableHead>
            <TableRow>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                식별자
              </TableHeader>
              <TableHeader>쿠폰명</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                코드
              </TableHeader>
              <TableHeader>할인가격</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                만료일
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                생성일
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex justify-center">
                    <Link
                      className="underline tabular-nums"
                      to={`/coupons/${coupon.id}`}
                    >
                      {coupon.id}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Strong>{coupon.title}</Strong>
                  <Text>{coupon.note}</Text>
                </TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  {Number(coupon.discountAmount).toLocaleString("ko-KR")}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {coupon.expirationDate
                    ? format(
                        new Date(coupon.expirationDate),
                        "yyyy-MM-dd hh:mm:ss",
                      )
                    : "-"}
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.createdAt), "yyyy-MM-dd HH:mm:SS")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="p-4">
          <PaginationPrevious>이전</PaginationPrevious>
          <PaginationList>
            {generatePagination(meta.totalPages, meta.page).map((page) => (
              <PaginationPage
                key={`page-${page}`}
                href={`?${new URLSearchParams({ ...searchParams, page }).toString()}`}
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
    </React.Fragment>
  );
}

export default function CouponsPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = React.useState(false);
  const { mutate } = useCouponCreateMutation();

  return (
    <React.Fragment>
      <div className="mb-8 flex items-start justify-between">
        <Heading className="mb-8">쿠폰</Heading>
        <Button onClick={() => setIsCreating(true)}>추가</Button>
      </div>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">쿠폰 목록을 불러오는 중...</div>
          }
        >
          <Coupons />
        </React.Suspense>
      </Sentry.ErrorBoundary>

      <CouponFormModal
        title="쿠폰 추가"
        open={isCreating}
        onClose={setIsCreating}
        onSubmit={(data) => {
          mutate(data, {
            async onSuccess(data) {
              navigate(`/coupons/${data.id}`);
              alert("쿠폰을 생성하였습니다");
            },
            async onError(error) {
              alert(error.message);
            },
          });
          // console.log('ffe', data);
        }}
      />
    </React.Fragment>
  );
}
