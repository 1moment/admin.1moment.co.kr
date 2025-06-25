import * as React from "react";
import { format } from "date-fns/format";
import { useParams } from "react-router";
import * as Sentry from "@sentry/react";

import { Button, LinkButton } from "@/components/ui/button.tsx";
import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { Text } from "@/components/ui/text.tsx";
import { CalendarIcon, ReceiptTextIcon } from "lucide-react";
import { Link } from "@/components/ui/link.tsx";

import {
  useOrder,
  useOrderMessagePrint,
  useOrderUpdateMutation,
  useReserve,
} from "@/hooks/use-orders.tsx";
import { Badge, DeliveryStatusBadge } from "@/components/ui/badge.tsx";
import { useAdminUsers } from "@/hooks/use-admin-users.tsx";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "@/components/ui/dialog.tsx";
import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from "@/components/ui/listbox.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select} from "@/components/ui/select.tsx";
import {useDeliveryMethods} from "@/hooks/use-delivery-methods.tsx";

function Order() {
  const params = useParams<{ "order-id": string }>();

  const orderId = Number(params["order-id"]);
  const { data: adminUsers } = useAdminUsers();
  const { data: order, refetch } = useOrder(orderId);
  const { data: { items: deliveryMethods } } = useDeliveryMethods({ currentPage: 1, pageSize: 100 });
  const { mutate: updateOrder, isPending: isOrderUpdating } =
    useOrderUpdateMutation(order.id);
  const { mutate: print, isPending } = useOrderMessagePrint();
  const { mutate: reserve } = useReserve();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isEditingDeliveryStatus, setIsEditingDeliveryStatus] =
    React.useState(false);

  return (
    <React.Fragment>
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heading>주문 #{orderId}</Heading>
            <Badge>{order.status}</Badge>
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

        <div>
          <Button
            isLoading={isPending}
            onClick={() => {
              print([order.id]);
            }}
          >
            발주서 프린트
          </Button>
        </div>
      </div>
      <div className="mt-10 p-4 bg-white sm:rounded-xl">
        <Subheading>주문정보</Subheading>
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
                    {orderProduct.productItem.title}
                  </Link>
                  &nbsp;{orderProduct.quantity}개
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
                    <Link
                      className="underline"
                      to={`/points/${order.point.id}`}
                    >
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
      </div>

      <div className="mt-10 p-4 bg-white sm:rounded-xl">
        <div className="flex justify-between items-start">
          <Subheading>배송정보</Subheading>
          <div className="flex gap-3">
            <Button onClick={() => setIsEditingDeliveryStatus(true)}>
              배송상태 변경
            </Button>
            {order.deliveryStatus === "PENDING" && (
              <Button onClick={() => setIsEditing(true)}>수정</Button>
            )}
          </div>
        </div>
        <DescriptionList className="mt-4">
          <DescriptionTerm>보내는 사람</DescriptionTerm>
          <DescriptionDetails>
            {order.senderName} / {order.senderPhoneNumber}
          </DescriptionDetails>

          <DescriptionTerm>배송방법</DescriptionTerm>
          <DescriptionDetails>{order.deliveryMethod.title}</DescriptionDetails>

          <DescriptionTerm>배송상태</DescriptionTerm>
          <DescriptionDetails>
            <DeliveryStatusBadge deliveryStatus={order.deliveryStatus} />
            {order.deliveryStatus === "PENDING" && (
              <React.Fragment>
                {order.deliveryMethod?.type === "QUICK" && (
                  <div key="quick" className="mt-2 flex gap-3">
                    <Button
                      onClick={() => {
                        reserve({
                          partner: "doobalhero",
                          orderIds: [order.id],
                        });
                      }}
                    >
                      두발히어로(퀵) 수동 배차
                    </Button>
                    <Button
                      onClick={() => {
                        reserve({
                          partner: "kakao-mobility",
                          orderIds: [order.id],
                        });
                      }}
                    >
                      카카오모빌리티(퀵) 수동 배차
                    </Button>
                  </div>
                )}
                {order.deliveryMethod?.type === "DELIVERY" && (
                  <div key="delivery" className="mt-2 flex gap-3">
                    <Button
                      onClick={() => {
                        reserve({ partner: "cj", orderIds: [order.id] });
                      }}
                    >
                      CJ 대한통운 택배 수동 배차
                    </Button>
                    <Button>우체국 택배 수동 배차</Button>
                  </div>
                )}
              </React.Fragment>
            )}
          </DescriptionDetails>

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
            {order.messageCardText && (
              <div className="mt-2">
                <LinkButton
                  color="zinc"
                  to={`https://www.1moment.co.kr/message-card?secret=f1d80654-3f7e-49e0-a43e-8678dbb47220&order_id=${orderId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  메세지 카드 문구 프린트
                </LinkButton>
              </div>
            )}
          </DescriptionDetails>
        </DescriptionList>
      </div>

      <div className="mt-10 p-4 bg-white sm:rounded-xl">
        <Subheading>출고</Subheading>
        <DescriptionList className="mt-4">
          <DescriptionTerm>작업 담당자</DescriptionTerm>
          <DescriptionDetails>
            {order.workAssignment?.adminUserId
              ? adminUsers.find(
                  (u) => u.id === order.workAssignment?.adminUserId,
                ).name
              : "-"}
          </DescriptionDetails>

          <DescriptionTerm>사진</DescriptionTerm>
          <DescriptionDetails>
            {order.imageUrl && <img src={order.imageUrl} alt="" />}
          </DescriptionDetails>
        </DescriptionList>
      </div>

      <div className="mt-10 p-4 bg-white sm:rounded-xl">
        <Subheading>결제정보</Subheading>
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
      </div>

      <Dialog open={isEditing} onClose={setIsEditing}>
        <DialogTitle>배송 정보 수정</DialogTitle>
        <DialogBody>
          <form
            id="order-shipment-form"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const data = Object.fromEntries(formData.entries());

              updateOrder({
                ...data,
                deliveryMethodId: Number(data.deliveryMethodId),
                isAnonymous: data.isAnonymous === 'on',
              }, {
                onSuccess() {
                  refetch();
                  alert("배송정보을 수정하였습니다.");
                  setIsEditing(false);
                },
              });
            }}
          >
            <div className="flex gap-3">
              <Field>
                <Label>보내는 사람</Label>
                <Input name="senderName" defaultValue={order.senderName} />
              </Field>
              <Field>
                <Label>연락처</Label>
                <Input name="senderPhoneNumber" defaultValue={order.senderPhoneNumber} />
              </Field>
              <Field>
                <Label>익명여부</Label>
                <div className="mt-5 flex items-center justify-center">
                  <Checkbox name="isAnonymous" defaultChecked={order.isAnonymous} />
                </div>
              </Field>
            </div>

            <div className="mt-5 flex gap-4">
              <Field>
                <Label>배송희망일</Label>
                <Input name="deliveryDate" type="date" defaultValue={format(new Date(order.deliveryDate), 'yyyy-MM-dd')}/>
              </Field>
              <Field>
                <Label>시간대</Label>
                <Select name="receivingTime" defaultValue={order.receivingTime}>
                  <option value="QUICK">QUICK</option>
                  <option value="MORNING">MORNING</option>
                  <option value="AFTERNOON">AFTERNOON</option>
                  <option value="EVENING">EVENING</option>
                  <option value="ANYTIME">ANYTIME</option>
                </Select>
              </Field>
            </div>

            <div className="mt-5 flex gap-3">
              <Field>
                <Label>받는 사람</Label>
                <Input name="receiverName" defaultValue={order.receiverName} />
              </Field>

              <Field>
                <Label>연락처</Label>
                <Input name="receiverPhoneNumber" defaultValue={order.receiverPhoneNumber} />
              </Field>
            </div>

            <div className="mt-5">
              <Field>
                <Label>배송방법</Label>
                <Select name="deliveryMethodId" defaultValue={order.deliveryMethod.id}>
                  {deliveryMethods.map((deliveryMethod) => (
                      <option
                          value={deliveryMethod.id}
                          key={`delivery-method-${deliveryMethod.id}`}
                      >
                        {deliveryMethod.title}
                      </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="mt-5">
              <Field>
                <Label>배송지</Label>
                <Input name="receiverZipCode" defaultValue={order.receiverZipCode} placeholder="우편번호" />
              </Field>

            </div>
            <div className="mt-2">
              <Field>
                <Input name="receiverAddress" defaultValue={order.receiverAddress} placeholder="주소" />
              </Field>
            </div>
            <div className="mt-2">
              <Input name="receiverAddressDetail" defaultValue={order.receiverAddressDetail} placeholder="상세주소" />
            </div>

            <div className="mt-5">
              <Field>
                <Label>메시지카드 텍스트</Label>
                <Textarea name="messageCardText" defaultValue={order.messageCardText} />
              </Field>
            </div>
          </form>
        </DialogBody>
        <DialogActions>
          <Button plain disabled={isOrderUpdating} onClick={() => setIsEditing(false)}>
            닫기
          </Button>
          <Button type="submit" isLoading={isOrderUpdating} form="order-shipment-form">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditingDeliveryStatus}
        onClose={setIsEditingDeliveryStatus}
      >
        <DialogTitle>배송 상태 변경</DialogTitle>
        <DialogBody>
          <form
            id="order-delivery-status-form"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              updateOrder(Object.fromEntries(formData.entries()) as any, {
                onSuccess() {
                  refetch();
                  alert("배송 상태가 변경되었습니다.");
                  setIsEditingDeliveryStatus(false);
                },
              });
            }}
          >
            <Field>
              <Label>배송상태</Label>
              <Listbox
                name="deliveryStatus"
                defaultValue={order.deliveryStatus}
              >
                <ListboxOption value="PENDING">
                  <ListboxLabel>
                    <DeliveryStatusBadge deliveryStatus="PENDING" />
                  </ListboxLabel>
                </ListboxOption>
                <ListboxOption value="WAITING">
                  <ListboxLabel>
                    <DeliveryStatusBadge deliveryStatus="WAITING" />
                  </ListboxLabel>
                </ListboxOption>
                <ListboxOption value="DELIVERING">
                  <ListboxLabel>
                    <DeliveryStatusBadge deliveryStatus="DELIVERING" />
                  </ListboxLabel>
                </ListboxOption>
                <ListboxOption value="DELIVERED">
                  <ListboxLabel>
                    <DeliveryStatusBadge deliveryStatus="DELIVERED" />
                  </ListboxLabel>
                </ListboxOption>
                <ListboxOption value="CANCELED">
                  <ListboxLabel>
                    <DeliveryStatusBadge deliveryStatus="CANCELED" />
                  </ListboxLabel>
                </ListboxOption>
                <ListboxOption value="FAILED">
                  <ListboxLabel>
                    <DeliveryStatusBadge deliveryStatus="FAILED" />
                  </ListboxLabel>
                </ListboxOption>
              </Listbox>
            </Field>
          </form>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            disabled={isOrderUpdating}
            onClick={() => setIsEditingDeliveryStatus(false)}
          >
            닫기
          </Button>
          <Button
            type="submit"
            isLoading={isOrderUpdating}
            form="order-delivery-status-form"
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">주문정보 불러오는 중...</div>
          }
        >
          <Order />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
