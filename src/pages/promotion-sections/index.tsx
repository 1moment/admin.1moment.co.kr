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
import { usePromotionSections } from "../../hooks/use-promotion-sections.tsx";
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import {Strong, Text} from "@/components/ui/text.tsx";
import {LinkButton} from "@/components/ui/button.tsx";

function PublishedPromotionSections() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") || "PUBLISHED";
  const {
    data: { items },
  } = usePromotionSections({ status, limit: 100 });

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
            <TableHeader>내용</TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              순서
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
          {items?.map((promotionSection) => (
            <TableRow key={promotionSection.id}>
              <TableCell className="text-center tabular-nums">
                <Link
                  className="underline tabular-nums"
                  to={`/promotion-sections/${promotionSection.id}`}
                >
                  {promotionSection.id}
                </Link>
              </TableCell>
              <TableCell>
                <Strong>{promotionSection.title}</Strong>
                <Text>{promotionSection.description}</Text>
              </TableCell>
              <TableCell className="text-center">
                {promotionSection.sequence}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(
                  new Date(promotionSection.createdAt),
                  "yyyy-MM-dd HH:mm:ss",
                )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(
                  new Date(promotionSection.updatedAt),
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

export default function PromotionSectionsPage() {
  return (
    <React.Fragment>
      <div className="mb-8 flex justify-between">
        <Heading>프로모션 섹션</Heading>
        <div>
          <LinkButton to="/promotion-sections/create" color="zinc">
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
