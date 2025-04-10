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
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import { Strong } from "@/components/ui/text.tsx";
import { LinkButton } from "@/components/ui/button.tsx";

import { usePromotionPages } from "@/hooks/use-promotion-pages.tsx";

function PublishedPromotionSections() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") || "PUBLISHED";
  const {
    data: { items },
  } = usePromotionPages({ status });

  return (
    <div className="bg-white rounded-xl">
      <Navbar className="px-4">
        <NavbarSection>
          <NavbarItem to="?status=PUBLISHED" current={status === "PUBLISHED"}>
            PUBLISHED
          </NavbarItem>
          <NavbarItem to="?status=DRAFT" current={status === "DRAFT"}>
            DRAFT
          </NavbarItem>
        </NavbarSection>
      </Navbar>
      <hr className="border-zinc-500/10" />
      <Table className="mt-3 px-4">
        <TableHead>
          <TableRow>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              식별자
            </TableHeader>
            <TableHeader>제목</TableHeader>
            <TableHeader>slug</TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              생성일
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              수정일
            </TableHeader>
          </TableRow>
        </TableHead>
        {Array.isArray(items) && items.length > 0 ? (
          <TableBody>
            {items?.map((promotionPage) => (
              <TableRow key={promotionPage.id}>
                <TableCell className="text-center tabular-nums">
                  <Link
                    className="underline tabular-nums"
                    to={`/promotion-pages/${promotionPage.id}`}
                  >
                    {promotionPage.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Strong>{promotionPage.title}</Strong>
                </TableCell>
                <TableCell>{promotionPage.slug}</TableCell>
                <TableCell className="text-center tabular-nums">
                  {format(
                    new Date(promotionPage.createdAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {format(
                    new Date(promotionPage.updatedAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
                <TableCell colSpan={5} className="text-center h-28">결과 없음</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
}

export default function PromotionSectionsPage() {
  return (
    <React.Fragment>
      <div className="mb-8 flex justify-between">
        <Heading>프로모션 페이지</Heading>
        <div>
          <LinkButton to="/promotion-pages/create" color="zinc">
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
          <PublishedPromotionSections />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
