import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";

import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { Text } from "@/components/ui/text.tsx";
import { CalendarIcon, ReceiptTextIcon } from "lucide-react";
import { Link } from "@/components/ui/link.tsx";

function Coupon() {
  const params = useParams<{ "order-id": string }>();

  const orderId = params["order-id"];
  const { data: order } = useSuspenseQuery<Order>({
    queryKey: ["orders", orderId],
    async queryFn() {
      const response = await apiClient(`/admin/orders/${orderId}`);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
  });

  console.log(order);
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div>
          <div>
            <Heading>주문 #{orderId}</Heading>
          </div>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center gap-2">
              <ReceiptTextIcon
                className="text-zinc-500 dark:text-zinc-400"
                width={16}
                height={16}
              />
              <Text>{Number(order.totalPaymentAmount).toLocaleString()}원</Text>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon
                className="text-zinc-500 dark:text-zinc-400"
                width={16}
                height={16}
              />
              <Text>
                {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <Subheading className="mt-10">주문정보</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>주문자</DescriptionTerm>
        <DescriptionDetails>
          {order.user ? (
            <Link className="underline" to={`/users/${order.user.id}`}>
              {order.user.id}
            </Link>
          ) : (
            "비회원"
          )}
        </DescriptionDetails>

        <DescriptionTerm>주문한 상품</DescriptionTerm>
        <DescriptionDetails>
          <ul>
            {order.items.map((orderProduct) => (
              <li key={`product-${orderProduct.product.id}`}>
                <Link
                  className="underline"
                  to={`/products/${orderProduct.product.id}`}
                >
                  {orderProduct.product.title}
                </Link>
              </li>
            ))}
          </ul>
        </DescriptionDetails>

        <DescriptionTerm>주문 금액</DescriptionTerm>
        <DescriptionDetails>
          <p>상품금액: {order.totalProductPrice.toLocaleString("ko-KR")}원</p>
          <p>
            배송비:{" "}
            {Number(
              order.deliveryCost +
                order.deliveryMethod.addedPrice -
                order.deliveryMethod.discountedPrice,
            ).toLocaleString("ko-KR")}
            원
          </p>
          <div className="flex">
            쿠폰:&nbsp;
            {order.usedCouponDiscountedAmount > 0 ? (
              <div className="flex gap-1">
                <p>
                  {Number(-order.usedCouponDiscountedAmount).toLocaleString(
                    "ko-KR",
                  )}
                  원
                </p>
                {/* 쿠폰 정보가 없을 수 있음 */}
                {order.coupon && (
                  <Link
                    className="underline"
                    to={`/coupons/${order.coupon.coupon.id}`}
                  >
                    ({order.coupon.coupon.title})
                  </Link>
                )}
              </div>
            ) : (
              "-"
            )}
          </div>
          <div className="flex">
            포인트:&nbsp;
            {order.usedPointAmount > 0 ? (
              <div className="flex gap-1">
                <p>
                  {Number(-order.usedPointAmount).toLocaleString("ko-KR")}원
                </p>
                {order.point && (
                  <Link className="underline" to={`/points/${order.point.id}`}>
                    ({order.point.id})
                  </Link>
                )}
              </div>
            ) : (
              "-"
            )}
          </div>
        </DescriptionDetails>
      </DescriptionList>

      <Subheading className="mt-10">배송정보</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>보내는 사람</DescriptionTerm>
        <DescriptionDetails>
          {order.senderName} / {order.senderPhoneNumber}
        </DescriptionDetails>

        <DescriptionTerm>배송방법</DescriptionTerm>
        <DescriptionDetails>{order.deliveryMethod.title}</DescriptionDetails>

        <DescriptionTerm>배송희망일</DescriptionTerm>
        <DescriptionDetails>
          {format(new Date(order.deliveryDate), "yyyy-MM-dd")}
        </DescriptionDetails>

        <DescriptionTerm>희망시간대</DescriptionTerm>
        <DescriptionDetails>{order.receivingTime}</DescriptionDetails>

        <DescriptionTerm>받는 사람</DescriptionTerm>
        <DescriptionDetails>
          {order.receiverName} / {order.receiverPhoneNumber}
        </DescriptionDetails>

        <DescriptionTerm>배송지</DescriptionTerm>
        <DescriptionDetails>
          ({order.receiverZipCode}){order.receiverAddress}{" "}
          {order.receiverAddressDetail}
        </DescriptionDetails>

        {order.deliveryMessage && (
          <React.Fragment>
            <DescriptionTerm>배송메시지</DescriptionTerm>
            <DescriptionDetails>{order.deliveryMessage}</DescriptionDetails>
          </React.Fragment>
        )}

        <DescriptionTerm>메시지카드 텍스트</DescriptionTerm>
        <DescriptionDetails className="whitespace-pre">
          {order.messageCardText}
        </DescriptionDetails>
      </DescriptionList>

      <Subheading className="mt-10">결제정보</Subheading>
      <DescriptionList className="mt-4">
        <DescriptionTerm>결제ID</DescriptionTerm>
        <DescriptionDetails>{order.payment.id}</DescriptionDetails>

        <DescriptionTerm>결제수단</DescriptionTerm>
        <DescriptionDetails>{order.payment.method}</DescriptionDetails>

        <DescriptionTerm>결제금액</DescriptionTerm>
        <DescriptionDetails>
          {order.payment.amount.toLocaleString()}원
        </DescriptionDetails>

        <DescriptionTerm>결제상태</DescriptionTerm>
        <DescriptionDetails>{order.payment.status}</DescriptionDetails>

        <DescriptionTerm>결제시간</DescriptionTerm>
        <DescriptionDetails>
          {format(new Date(order.payment.paymentAt), "yyyy-MM-dd HH:mm:ss")}
        </DescriptionDetails>

        <DescriptionTerm>영수증</DescriptionTerm>
        <DescriptionDetails>
          <a
            className="underline"
            href={order.payment.receiptUrl}
            target="_blank"
            rel="noreferrer"
          >
            링크
          </a>
        </DescriptionDetails>
      </DescriptionList>
    </React.Fragment>
  );
}

export default function CouponPage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary fallback={(errorData) => <p>{errorData.error.message}</p>}>
        <React.Suspense
          fallback={
            <div className="p-8 text-center">주문정보 불러오는 중...</div>
          }
        >
          <Coupon />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
