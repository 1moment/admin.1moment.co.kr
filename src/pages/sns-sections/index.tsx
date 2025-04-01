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
import { useSnsSections } from "../../hooks/use-sns-sections.tsx";
import {Button} from "@/components/ui/button.tsx";

function PublishedSnsSections() {
  const {
    data: { items },
  } = useSnsSections({ status: "PUBLISHED", limit: 100 });

  return (
    <div>
      <SnsSectionsTable items={items} />
    </div>
  );
}

function SnsSectionsTable({ items }: { items: SnsSection[] }) {
  return (
    <Table>
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
            <TableCell>
              <div className="flex ">
                <img
                  className="w-20 h-20"
                  width={80}
                  height={80}
                  src={snsSection.imageUrl}
                  alt=""
                />
              </div>
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
  );
}

export default function SnsSectionsPage() {
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading className="mb-8">인스타그램 섹션</Heading>
        <div>
          <Button to="/sns-sections/create">추가</Button>
        </div>
      </div>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <Subheading>PUBLISHED</Subheading>
        <React.Suspense
          fallback={
            <div className="p-8 text-center">목록을 불러오는 중...</div>
          }
        >
          <PublishedSnsSections />
        </React.Suspense>
      </Sentry.ErrorBoundary>

      {/*<Sentry.ErrorBoundary*/}
      {/*    fallback={(errorData) => <p>{errorData.error.message}</p>}*/}
      {/*>*/}
      {/*    <Subheading className="mt-10">Draft</Subheading>*/}
      {/*    <React.Suspense*/}
      {/*        fallback={*/}
      {/*            <div className="p-8 text-center">목록을 불러오는 중...</div>*/}
      {/*        }*/}
      {/*    >*/}
      {/*        <DraftSnsSections />*/}
      {/*    </React.Suspense>*/}
      {/*</Sentry.ErrorBoundary>*/}
    </React.Fragment>
  );
}
