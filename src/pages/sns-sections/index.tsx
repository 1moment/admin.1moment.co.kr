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
import { LinkButton } from "@/components/ui/button.tsx";

import { useSnsSections } from "@/hooks/use-sns-sections.tsx";
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";

function PublishedSnsSections() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") || "PUBLISHED";
  const {
    data: { items },
  } = useSnsSections({ status });

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
            <TableHeader>핸들러</TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              이미지
            </TableHeader>
            <TableHeader className="w-1 whitespace-nowrap text-center">
              연결된 상품
            </TableHeader>
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
          {items?.map((snsSection) => (
            <TableRow key={snsSection.id}>
              <TableCell className="text-center tabular-nums">
                <Link
                  className="underline tabular-nums"
                  to={`/sns-sections/${snsSection.id}`}
                >
                  {snsSection.id}
                </Link>
              </TableCell>

              <TableCell>{snsSection.displayedHandlerName}</TableCell>
              <TableCell className="w-32">
                  <img
                    src={snsSection.imageUrl}
                    alt=""
                  />
              </TableCell>

              <TableCell>
                <Link
                  className="underline"
                  to={`/products/${snsSection.product.id}`}
                >
                  {snsSection.product.title}
                </Link>
              </TableCell>

              <TableCell>{snsSection.sequence}</TableCell>

              <TableCell className="text-center tabular-nums">
                {format(new Date(snsSection.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {format(new Date(snsSection.updatedAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SnsSectionsPage() {
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading className="mb-8">인스타그램 섹션</Heading>
        <div>
          <LinkButton to="/sns-sections/create">추가</LinkButton>
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
          <PublishedSnsSections />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
