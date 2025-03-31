import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button.tsx";

function Banners({ currentTab }) {
  const [searchParams] = useSearchParams();

  const {
    data: { items },
  } = useSuspenseQuery<{ items: Banner[] }>({
    queryKey: ["banners", { status: "PUBLISHED", position: currentTab }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("status", "PUBLISHED");
      params.set("position", currentTab);
      const response = await apiClient(`/admin/banners?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });

  const {
    data: { items: draftItems },
  } = useSuspenseQuery<{ items: Banner[] }>({
    queryKey: ["banners", { status: "DRAFT", position: currentTab }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("status", "DRAFT");
      params.set("position", currentTab);
      const response = await apiClient(`/admin/banners?${params.toString()}`);
      const result = await response.json();
      return result;
    },
  });

  return (
    <div>
      <div className="mt-10 flex flex-col gap-10">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                식별자
              </TableHeader>
              <TableHeader className="">타이틀</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                순서
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                상태
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                링크
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                생성일
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="text-center tabular-nums">
                  <Link
                    className="underline tabular-nums"
                    to={`/banners/${banner.id}`}
                  >
                    {banner.id}
                  </Link>
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.sequence}</TableCell>
                <TableCell>{banner.status}</TableCell>
                <TableCell>{banner.link}</TableCell>
                <TableCell className="text-center tabular-nums">
                  {format(new Date(banner.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <section className="mt-10">
        <Subheading>DRAFT</Subheading>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                식별자
              </TableHeader>
              <TableHeader className="">타이틀</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                순서
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                상태
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                링크
              </TableHeader>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                생성일
              </TableHeader>
            </TableRow>
          </TableHead>
          {draftItems?.length > 0 ? (
            <TableBody>
              {draftItems?.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="text-center tabular-nums">
                    <Link
                      className="underline tabular-nums"
                      to={`/banners/${banner.id}`}
                    >
                      {banner.id}
                    </Link>
                  </TableCell>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell>{banner.sequence}</TableCell>
                  <TableCell>{banner.status}</TableCell>
                  <TableCell>{banner.link}</TableCell>
                  <TableCell className="text-center tabular-nums">
                    {format(new Date(banner.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell className="h-10" colSpan={7}>항목 없음</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </section>
    </div>
  );
}

export default function BannersPage() {
  const [searchParams] = useSearchParams();

  const currentTab = searchParams.get("tab") || "TOP";

  return (
    <React.Fragment>
      <Heading className="mb-8">배너</Heading>
      <div>
        <Button
          plain
          to={{ search: "?tab=TOP" }}
          data-active={currentTab === "TOP" ? "" : undefined}
        >
          상단
        </Button>
        <Button
          plain
          to={{ search: "?tab=MIDDLE" }}
          data-active={currentTab === "MIDDLE" ? "" : undefined}
        >
          중간
        </Button>
        <Button
          plain
          to={{ search: "?tab=BOTTOM" }}
          data-active={currentTab === "BOTTOM" ? "" : undefined}
        >
          하단
        </Button>
      </div>
      <React.Suspense
        fallback={<div className="p-8 text-center">목록을 불러오는 중...</div>}
      >
        <Banners currentTab={currentTab} />
      </React.Suspense>
    </React.Fragment>
  );
}
