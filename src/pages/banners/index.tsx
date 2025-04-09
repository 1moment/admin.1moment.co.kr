import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
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
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import { useBanners } from "@/hooks/use-banners.tsx";

function Banners() {
  const [searchParams] = useSearchParams();

  const position = searchParams.get("position") || "TOP";
  const status = searchParams.get("status") || "PUBLISHED";
  const {
    data: { items },
  } = useBanners({
    status,
    position,
  });

  return (
    <div className="py-4 bg-white rounded-xl">
      <div className="px-4">
        <LinkButton
          plain
          to={{ search: "?position=TOP" }}
          data-active={position === "TOP" ? "" : undefined}
        >
          상단
        </LinkButton>
        <LinkButton
          plain
          to={{ search: "?position=MIDDLE" }}
          data-active={position === "MIDDLE" ? "" : undefined}
        >
          중간
        </LinkButton>
        <LinkButton
          plain
          to={{ search: "?position=BOTTOM" }}
          data-active={position === "BOTTOM" ? "" : undefined}
        >
          하단
        </LinkButton>
      </div>

      <Navbar>
        <NavbarSection>
          <NavbarItem
            to={`?status=PUBLISHED${position ? `&position=${position}` : ""}`}
            current={status === "PUBLISHED"}
          >
            PUBLISHED
          </NavbarItem>
          <NavbarItem
            to={`?status=DRAFT${position ? `&position=${position}` : ""}`}
            current={status === "DRAFT"}
          >
            DRAFT
          </NavbarItem>
        </NavbarSection>
      </Navbar>
      <hr className="border-zinc-500/10" />
      <div className="flex flex-col gap-10">
        <Table className="px-4">
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
    </div>
  );
}

export default function BannersPage() {
  return (
    <React.Fragment>
      <div className="flex items-start justify-between ">
        <Heading className="mb-8">배너</Heading>
        <div>
          <LinkButton to="/banners/create" color="zinc">
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
          <Banners />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
