import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";
import { Heading } from "@/components/ui/heading.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { Button } from "@/components/ui/button.tsx";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { format } from "date-fns/format";
import { Link } from "@/components/ui/link.tsx";

function _Users({ couponId }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    data: { items, meta },
  } = useSuspenseQuery<{ items: userCoupon[] }>({
    queryKey: ["coupons", couponId, "users"],
    queryFn() {
      const query = new URLSearchParams();
      query.set("size", "10");
      query.set("page", `${currentPage}`);
      return apiClient(
        `/admin/coupons/${couponId}/users?${query.toString()}`,
      ).then((res) => res.json());
    },
  });

  return (
    <React.Fragment>
      <Table className="mt-8">
        <TableHead>
          <TableRow>
            <TableHeader>발급 ID</TableHeader>
            <TableHeader>회원 ID</TableHeader>
            <TableHeader>이메일</TableHeader>
            <TableHeader>발급일자</TableHeader>
            <TableHeader className="text-center">사용여부</TableHeader>
          </TableRow>
        </TableHead>
        {items?.length > 0 ? (
          <TableBody>
            {items.map((userCoupon) => (
              <TableRow key={`user-${userCoupon.id}`}>
                <TableCell>{userCoupon.id}</TableCell>
                <TableCell>
                  <Link className="underline" to={`/users/${userCoupon.user.id}`}>
                    {userCoupon.user.id}
                  </Link>
                </TableCell>
                <TableCell>{userCoupon.user.email}</TableCell>
                <TableCell>
                  <time dateTime={userCoupon.createdAt}>
                    {format(
                      new Date(userCoupon.createdAt),
                      "yyyy-MM-dd hh:mm:ss",
                    )}
                  </time>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Switch checked={userCoupon.isUsed} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell className="h-20">발급 이력이 없습니다</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <ul className="mt-4 flex gap-3">
        <li className="grow basis-0">
          <Button
            plain
            disabled={currentPage < 2}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <svg
              className="stroke-current"
              data-slot="icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            이전
          </Button>
        </li>
        {generatePagination(meta.totalPages, meta.page).map((page) => (
          <li key={`page-${page}`}>
            <Button
              plain
              className={clsx(
                "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg",
                currentPage === page &&
                  "before:bg-zinc-950/5 dark:before:bg-white/10",
              )}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          </li>
        ))}
        <li className="grow basis-0 flex justify-end">
          <Button
            plain
            disabled={currentPage >= meta.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
            <svg
              className="stroke-current"
              data-slot="icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </li>
      </ul>
    </React.Fragment>
  );
}

export default function Users({ couponId }) {
  return (
    <section className="mt-8 p-4 border border-gray-100 rounded shadow">
      <Heading>쿠폰 발급 현황</Heading>
      <React.Suspense fallback={<p>쿠폰을 불러오고있습니다</p>}>
        <_Users couponId={couponId} />
      </React.Suspense>
    </section>
  );
}
