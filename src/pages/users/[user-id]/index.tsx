import * as React from "react";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";

import { useParams, useSearchParams } from "react-router";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import {
  FileUserIcon,
  MailIcon,
  PhoneIcon,
  TagIcon,
} from "lucide-react";
import { Link } from "@/components/ui/link.tsx";
import { useUser } from "@/hooks/use-users.tsx";
import { useOrders } from "@/hooks/use-orders.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  OrderStatusBadge,
  DeliveryStatusBadge,
} from "@/components/ui/badge.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { useUserCoupons } from "@/hooks/use-coupons.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { usePoints } from "@/hooks/use-points.tsx";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/use-reviews.tsx";
import { Rating } from "@/components/ui/rating.tsx";

export default function Page() {
  const params = useParams<{ "user-id": string }>();

  return (
    <React.Fragment>
      <div className="mt-6 grid grid-cols-5 gap-x-3">
        <div className="col-span-3 flex flex-col gap-5">
          <Sentry.ErrorBoundary
            fallback={(errorData) => <p>{errorData.error.message}</p>}
          >
            <Orders />
          </Sentry.ErrorBoundary>
          <Sentry.ErrorBoundary
            fallback={(errorData) => <p>{errorData.error.message}</p>}
          >
            <Reviews />
          </Sentry.ErrorBoundary>
          <Sentry.ErrorBoundary
            fallback={(errorData) => <p>{errorData.error.message}</p>}
          >
            <Coupons />
          </Sentry.ErrorBoundary>
          <Sentry.ErrorBoundary
            fallback={(errorData) => <p>{errorData.error.message}</p>}
          >
            <Points />
          </Sentry.ErrorBoundary>
        </div>
        <div className="col-span-2 flex flex-col gap-5">
          <Sentry.ErrorBoundary
            fallback={(errorData) => <p>{errorData.error.message}</p>}
          >
            <User />
          </Sentry.ErrorBoundary>
        </div>
      </div>
    </React.Fragment>
  );
}

function User() {
  const params = useParams<{ "user-id": string }>();

  const userId = Number(params["user-id"]);
  const { data: user } = useUser(userId);

  return (
    <React.Fragment>
      <div className="p-4 bg-white rounded-xl">
        <div>
          <Subheading>기본정보</Subheading>
          <DescriptionList>
            <DescriptionTerm>
              <MailIcon width={16} height={16} />
            </DescriptionTerm>
            <DescriptionDetails>{user.email}</DescriptionDetails>

            <DescriptionTerm>
              <PhoneIcon width={16} height={16} />
            </DescriptionTerm>
            <DescriptionDetails>{user.phoneNumber}</DescriptionDetails>

            {user.name && (
              <React.Fragment>
                <DescriptionTerm>
                  <FileUserIcon width={16} height={16} />
                </DescriptionTerm>
                <DescriptionDetails>{user.name}</DescriptionDetails>
              </React.Fragment>
            )}

            <DescriptionTerm>
              <TagIcon width={16} height={16} />
            </DescriptionTerm>
            <DescriptionDetails>{user.level}</DescriptionDetails>
          </DescriptionList>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl">
        <DescriptionList>
          <DescriptionTerm>개인정보 수집 및 이용안내 동의여부</DescriptionTerm>
          <DescriptionDetails>{user.agreePrivacy && "✅"}</DescriptionDetails>

          <DescriptionTerm>서비스 이용약관 동의여부</DescriptionTerm>
          <DescriptionDetails>{user.agreeTermsUse && "✅"}</DescriptionDetails>

          <DescriptionTerm>이메일 수신 동의 동의여부</DescriptionTerm>
          <DescriptionDetails>
            {user.agreeReceptionEmail && "✅"}
          </DescriptionDetails>

          <DescriptionTerm>SMS 수신 동의 동의여부</DescriptionTerm>
          <DescriptionDetails>
            {user.agreeReceptionSms && "✅"}
          </DescriptionDetails>

          <DescriptionTerm>가입일</DescriptionTerm>
          <DescriptionDetails>
            {format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm:ss')}
          </DescriptionDetails>

          <DescriptionTerm>리프레쉬토큰</DescriptionTerm>
          <DescriptionDetails className="break-all">
            {user.refreshToken}
          </DescriptionDetails>
        </DescriptionList>
      </div>

      <div className="p-4 bg-white rounded-xl">
        <div>
          <Subheading>기념일</Subheading>
        </div>
        {user.anniverSaries.length > 0 ? (
          <ul className="flex flex-col divide-y divide-gray-200">
            {user.anniverSaries.map((anniverSary) => (
              <li key={`anniverSary-${anniverSary.id}`} className="py-3">
                <p>{anniverSary.title}</p>
                <p>
                  {format(new Date(anniverSary.date), "yyyy-MM-dd")}&nbsp; (
                  {anniverSary.type === "REPEAT" && "반복"}
                  {anniverSary.type === "DDAY" && "일회성"})
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>등록된 기념일이 없습니다</p>
        )}
      </div>
    </React.Fragment>
  );
}

function Orders() {
  const params = useParams<{ "user-id": string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const ordersPage = Number(searchParams.get("ordersPage") || 1);
  const userId = Number(params["user-id"]);
  const {
    data: { items: orders, meta },
  } = useOrders({ userId, currentPage: ordersPage });

  return (
    <div className="p-4 bg-white rounded-xl">
      <Subheading className="">주문정보</Subheading>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeader>주문ID</TableHeader>
            <TableHeader>주문상태</TableHeader>
            <TableHeader>배송상태</TableHeader>
            <TableHeader>결제금액</TableHeader>
            <TableHeader>주문일자</TableHeader>
          </TableRow>
        </TableHead>
        {orders.length > 0 ? (
          <TableBody>
            {orders.map((order) => (
              <TableRow key={`order-${order.id}`}>
                <TableCell>
                  <Link to={`/orders/${order.id}`}>{order.id}</Link>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge orderStatus={order.status} />
                </TableCell>
                <TableCell>
                  <DeliveryStatusBadge deliveryStatus={order.deliveryStatus} />
                </TableCell>
                <TableCell>
                  {Number(order.totalProductPrice).toLocaleString("ko-KR")}원
                </TableCell>
                <TableCell className="tabular-nums">
                  {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                주문 정보가 없습니다
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination className="mt-8">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationList>
          {generatePagination(meta.totalPages, meta.page).map((page) => (
            <PaginationPage
              key={`ordersPage-${page}`}
              onClick={() => {
                setSearchParams((searchParams) => {
                  searchParams.set("ordersPage", `${page}`);
                  return searchParams;
                });
              }}
              current={page === ordersPage}
            >
              {page}
            </PaginationPage>
          ))}
        </PaginationList>
        <PaginationNext>다음</PaginationNext>
      </Pagination>
    </div>
  );
}

function Reviews() {
  const params = useParams<{ "user-id": string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setPage] = React.useState(1);
  const userId = Number(params["user-id"]);
  const {
    data: { items: reviews, meta },
  } = useReviews({ userId, currentPage });

  return (
    <div className="p-4 bg-white rounded-xl">
      <Subheading className="">작성한 리뷰</Subheading>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeader>내용</TableHeader>
            <TableHeader>주문번호</TableHeader>
          </TableRow>
        </TableHead>
        {reviews.length > 0 ? (
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={`order-${review.id}`}>
                <TableCell>
                  <Rating rating={review.ratingScore} />
                  <p className="mt-2 font-semibold">{review.title}</p>
                  <p className="mt-1 whitespace-pre-wrap">
                    {review.description}
                  </p>
                  {review.images.length > 0 && (
                    <ul>
                      {review.images.map((image) => (
                        <li key={`review-image-${image.id}`}>
                          <img
                            src={image.imageUrl}
                            width={100}
                            height={100}
                            alt=""
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 font-semibold">
                    {review.orderItem.order.title}
                  </p>
                </TableCell>
                <TableCell>
                  <Link
                    className="underline"
                    to={`/orders/${review.orderItem.order.id}`}
                  >
                    {review.orderItem.order.id}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                리뷰 정보가 없습니다
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination className="mt-8">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationNext>다음</PaginationNext>
      </Pagination>
    </div>
  );
}

function Coupons() {
  const params = useParams<{ "user-id": string }>();
  const userId = Number(params["user-id"]);

  const [currentPage, setPage] = React.useState(1);
  const {
    data: { items: coupons, meta },
  } = useUserCoupons({ currentPage, userId });

  return (
    <div className="p-4 bg-white rounded-xl">
      <Subheading className="">발급쿠폰</Subheading>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeader className="text-center">쿠폰ID</TableHeader>
            <TableHeader className="text-center">쿠폰명</TableHeader>
            <TableHeader className="text-center">할인금액</TableHeader>
            <TableHeader className="text-center">만료여부</TableHeader>
            <TableHeader className="text-center">사용여부</TableHeader>
            <TableHeader className="text-center">발급일</TableHeader>
          </TableRow>
        </TableHead>
        {coupons.length > 0 ? (
          <TableBody>
            {coupons.map((userCoupon) => (
              <TableRow key={`coupon-${userCoupon.id}`}>
                <TableCell className="text-center">
                  <Link
                    className="underline"
                    to={`/coupons/${userCoupon.coupon.id}`}
                  >
                    {userCoupon.coupon.id}
                  </Link>
                </TableCell>
                <TableCell>{userCoupon.coupon.title}</TableCell>
                <TableCell className="text-right">
                  {Number(userCoupon.coupon.discountAmount).toLocaleString(
                    "ko-KR",
                  )}
                  원
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Checkbox checked={userCoupon.isUsed} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Checkbox checked={userCoupon.coupon.isExpired} />
                  </div>
                </TableCell>
                <TableCell className="tabular-nums text-center">
                  {format(
                    new Date(userCoupon.createdAt),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>쿠폰 발급 내역이 없습니다</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination className="mt-8 flex justify-between">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationNext>다음</PaginationNext>
      </Pagination>
    </div>
  );
}

function Points() {
  const params = useParams<{ "user-id": string }>();
  const userId = Number(params["user-id"]);

  const [currentPage, setPage] = React.useState(1);
  const {
    data: { items: points, meta },
  } = usePoints({ currentPage, userId });

  return (
    <div className="p-4 bg-white rounded-xl">
      <Subheading className="">적립금</Subheading>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeader className="text-center">내용</TableHeader>
            <TableHeader className="text-center">금액</TableHeader>
            <TableHeader className="text-center">사용한 주문</TableHeader>
            <TableHeader className="text-center">적립일</TableHeader>
          </TableRow>
        </TableHead>
        {points.length > 0 ? (
          <TableBody>
            {points.map((point) => (
              <TableRow key={`coupon-${point.id}`}>
                <TableCell>{point.note}</TableCell>
                <TableCell className="text-right">
                  {Number(point.amount).toLocaleString("ko-KR")}
                </TableCell>
                <TableCell className="text-center">
                  {point.orders.map((order) => (
                    <Link
                      key={`link-order-${order.id}`}
                      className="underline"
                      to={`/orders/${order.id}`}
                    >
                      {order.id}
                    </Link>
                  ))}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {format(new Date(point.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell className="text-center" colSpan={4}>
                적립금 내역이 없습니다
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <Pagination className="mt-8 flex justify-between">
        <Button
          disabled={currentPage <= 1}
          onClick={() => {
            setPage((page) => page - 1);
          }}
        >
          이전
        </Button>
        <Button
          disabled={meta.totalPages <= currentPage}
          onClick={() => {
            setPage((page) => page + 1);
          }}
        >
          다음
        </Button>
      </Pagination>
    </div>
  );
}
