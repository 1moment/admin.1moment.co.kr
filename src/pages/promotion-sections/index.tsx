import * as React from "react";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";
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
import usePromotionSections from "../../hooks/use-promotion-sections.tsx";

function PublishedPromotionSections() {
  const {
    data: { items },
  } = usePromotionSections({ status: "PUBLISHED", limit: 100 });

  return (
    <div>
      <PromotionSectionsTable items={items} />
    </div>
  );
}

function DraftPromotionSections() {
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const {
    data: { items },
  } = usePromotionSections({ status: "DRAFT", currentPage });

  return (
    <div>
      <PromotionSectionsTable items={items} />
    </div>
  );
}

function PromotionSectionsTable({ items }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader className="w-1 whitespace-nowrap text-center">
            식별자
          </TableHeader>
          <TableHeader>타이틀</TableHeader>
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
            <TableCell>{promotionSection.title}</TableCell>
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
  );
}

export default function PromotionSectionsPage() {
  return (
    <React.Fragment>
      <Heading className="mb-8">프로모션 섹션</Heading>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <Subheading>PUBLISHED</Subheading>
        <React.Suspense
          fallback={
            <div className="p-8 text-center">목록을 불러오는 중...</div>
          }
        >
          <PublishedPromotionSections />
        </React.Suspense>
      </Sentry.ErrorBoundary>

      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <Subheading className="mt-10">Draft</Subheading>
        <React.Suspense
          fallback={
            <div className="p-8 text-center">목록을 불러오는 중...</div>
          }
        >
          <DraftPromotionSections />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
