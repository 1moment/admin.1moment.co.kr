import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import { Link } from "@/components/ui/link";
import { Switch } from "@/components/ui/switch.tsx";

function ProductContentBlocks() {
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items },
  } = useSuspenseQuery<{ items: ProductContentBlock[] }>({
    queryKey: ["product-content-blocks", { page: currentPage }],
    async queryFn() {
      const params = new URLSearchParams();
      params.set("page", `${currentPage}`);
      const response = await apiClient(
        `/admin/product-content-blocks?${params.toString()}`,
      );
      const result = await response.json();
      return result;
    },
  });

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader className="">
              타이틀
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              사용여부
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              생성일
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              수정일
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((productContentBlock) => (
            <TableRow key={productContentBlock.id}>
              <TableCell className="text-center tabular-nums">
                <Link
                    className="underline tabular-nums"
                    to={`/product-content-blocks/${productContentBlock.id}`}
                >
                {productContentBlock.id}
                </Link>
              </TableCell>
              <TableCell>{productContentBlock.title}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Switch checked={productContentBlock.isUsed} />
                </div>
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(new Date(productContentBlock.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(new Date(productContentBlock.updatedAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}

export default function ProductContentBlocksPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">상세페이지 템플릿</Heading>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">목록을 불러오는 중...</div>
        }
      >
        <ProductContentBlocks />
      </React.Suspense>
    </React.Fragment>
  );
}
