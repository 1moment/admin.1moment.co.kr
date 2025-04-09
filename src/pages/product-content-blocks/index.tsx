import * as React from "react";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";
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
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import { useProductContentBlocks } from "@/hooks/use-product-content-blocks.tsx";
import { LinkButton } from "@/components/ui/button.tsx";

function ProductContentBlocks() {
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const isUsed = searchParams.get("isUsed") || "true";
  const {
    data: { items },
  } = useProductContentBlocks({ isUsed, currentPage });

  return (
    <div className="py-4 bg-white rounded-xl">
      <Navbar>
        <NavbarSection>
          <NavbarItem to="?isUsed=true" current={isUsed === "true"}>
            사용중
          </NavbarItem>
          <NavbarItem to="?isUsed=false" current={isUsed === "false"}>
            사용안함
          </NavbarItem>
        </NavbarSection>
      </Navbar>
      <hr className="border-zinc-500/10" />
      <Table className="mt-4 px-4">
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader className="">타이틀</TableHeader>
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
                {format(
                  new Date(productContentBlock.createdAt),
                  "yyyy-MM-dd HH:mm:ss",
                )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(
                  new Date(productContentBlock.updatedAt),
                  "yyyy-MM-dd HH:mm:ss",
                )}
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
      <div className="mb-8 flex justify-between">
        <Heading>상세페이지 템플릿</Heading>
        <div>
          <LinkButton to="/product-content-blocks/create" color="zinc">
            추가
          </LinkButton>
        </div>
      </div>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">목록을 불러오는 중...</div>
          }
        >
          <ProductContentBlocks />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
