import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
import { generatePagination } from "@/utils/generate-pagination-array.ts";

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
import { Strong, Text } from "@/components/ui/text.tsx";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Link } from "@/components/ui/link.tsx";
import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
  useOrderMessagePrint,
  useOrders,
  useReserve,
} from "@/hooks/use-orders.tsx";
import {
  OrderStatusBadge,
  DeliveryStatusBadge,
  DeliveryReceivingTimeBadge,
} from "@/components/ui/badge.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/ui/dropdown.tsx";
import { ChevronDownIcon } from "lucide-react";

function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const status = searchParams.get("status") as string;
  const deliveryMethodType = searchParams.get("deliveryMethodType");
  const deliveryStatus = searchParams.get("deliveryStatus") as string;
  const deliveryDate = searchParams.get("deliveryDate");
  const queryType = searchParams.get("queryType") as string;
  const query = searchParams.get("query") as string;

  const [checkedOrders, setCheckedOrders] = React.useState(new Set<number>());

  const {
    data: { items, meta },
  } = useOrders({
    currentPage,
    status,
    deliveryMethodType,
    deliveryStatus,
    deliveryDate,
    queryType,
    query,
  });
  const { mutate: print, isPending } = useOrderMessagePrint();
  const { mutate: reserve } = useReserve();

  React.useEffect(() => {
    setCheckedOrders(new Set());
  }, [currentPage]);

  return (
    <div className="mt-8 py-4 bg-white border border-gray-100 rounded-xl">
      <form className="px-4 items-end flex">
        <div className="grow flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-center gap-3">
            <Field className="shrink-0 w-16">
              <Label>빠른선택</Label>
            </Field>
            <div className="flex gap-6">
              <Link
                className="text-blue-400"
                to={{
                  search:
                    "?status=ORDERED&deliveryStatus=WAITING&deliveryMethodType=DELIVERY",
                }}
              >
                택배 배차 전
              </Link>
              <Link
                className="text-blue-400"
                to={{
                  search:
                    "?status=ORDERED&deliveryStatus=PENDING&deliveryMethodType=DELIVERY",
                }}
              >
                택배 배송 전
              </Link>
              <Link
                className="text-blue-400"
                to={{
                  search:
                    "?status=ORDERED&deliveryStatus=WAITING&deliveryMethodType=QUICK",
                }}
              >
                퀵 배송 전
              </Link>
              <Link
                className="text-blue-400"
                to={{
                  search:
                    "?status=ORDERED&deliveryStatus=PENDING&deliveryMethodType=QUICK",
                }}
              >
                퀵 배송 전
              </Link>
              <a
                className="text-blue-400"
                href="/orders?status=ORDERED&deliveryMethodType=PICKUP"
              >
                방문수령
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Field className="shrink-0 w-16">
              <Label>배송일</Label>
            </Field>
            <Input
              type="date"
              name="deliveryDate"
              defaultValue={deliveryDate}
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>주문상태</Label>
            </Field>
            <Select className="max-w-48" name="status" defaultValue={status}>
              <option value="">선택</option>
              <option value="PENDING">PENDING</option>
              <option value="ORDERED">ORDERED</option>
              <option value="CANCELED">CANCELED</option>
              <option value="CANCELREQUESTED">CANCELREQUESTED</option>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>배송상태</Label>
            </Field>
            <Select
              className="max-w-48"
              name="deliveryStatus"
              defaultValue={deliveryStatus}
            >
              <option value="">선택</option>
              <option value="WAITING">WAITING</option>
              <option value="PENDING">PENDING</option>
              <option value="DELIVERING">DELIVERING</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELED">CANCELED</option>
              <option value="FAILED">FAILED</option>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>배송방식</Label>
            </Field>
            <Select
              className="max-w-48"
              name="deliveryMethodType"
              defaultValue={deliveryMethodType}
            >
              <option value="">선택</option>
              <option value="DELIVERY">택배배송</option>
              <option value="QUICK">퀵배송</option>
              <option value="PICKUP">방문수령</option>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Field className="shrink-0 w-16">
              <Label>검색어</Label>
            </Field>
            <Select
              className="max-w-48"
              name="queryType"
              defaultValue={queryType}
            >
              <option value="orderNumber">주문번호</option>
              <option value="senderName">구매자</option>
              <option value="receiverName">받는사람</option>
            </Select>
            <Input
              className="max-w-80"
              name="query"
              defaultValue={query}
              placeholder="검색어"
            />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link className="text-blue-400" to="/orders">
            초기화
          </Link>
          <Button type="submit" className="shrink-0" color="zinc">
            조회
          </Button>
        </div>
      </form>

      <hr className="my-5 border-gray-100" />
      {checkedOrders.size > 0 && (
        <div className="mb-3 px-4 flex items-center justify-end gap-6">
          <p className="text-[14px] text-zinc-700">
            {checkedOrders.size}개 선택됨
          </p>

          <Dropdown>
            <DropdownButton className="flex items-center" outline>
              액션
              <ChevronDownIcon width={16} height={16} />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  print([...checkedOrders]);
                }}
              >
                발주서 프린트
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (confirm(`주문번호 ${[...checkedOrders].join(',')}를 두발히어로 배차 신청합니다`)) {
                    reserve({
                      partner: "doobalhero",
                      orderIds: [...checkedOrders],
                    }, {
                      onSuccess() {
                        setCheckedOrders(new Set());
                        alert('두발히어로 배차 신청이 완료되었습니다');
                      }
                    });
                  }
                }}
              >
                [퀵]두발히어로 배차
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (confirm(`주문번호 ${[...checkedOrders].join(',')}를 카카오모빌리티 배차 신청합니다`)) {
                    reserve({
                      partner: "kakao-mobility",
                      orderIds: [...checkedOrders],
                    }, {
                      onSuccess() {
                        setCheckedOrders(new Set());
                        alert('카카오모빌리티 배차 신청이 완료되었습니다');
                      }
                    });
                  }
                }}
              >
                [퀵]카카오모빌리티 배차
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (confirm(`주문번호 ${[...checkedOrders].join(',')}를 대한통운 배차 신청합니다`)) {
                    reserve({
                      partner: "cj",
                      orderIds: [...checkedOrders],
                    }, {
                      onSuccess() {
                        setCheckedOrders(new Set());
                        alert('대한통운 배차 신청이 완료되었습니다');
                      }
                    });
                  }
                }}
              >
                CJ 대한통운 배차
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}

      <Table className="px-4 overflow-x-auto">
        <TableHead>
          <TableRow>
            <TableHeader />
            <TableHeader>주문번호</TableHeader>
            <TableHeader>주문상태</TableHeader>
            <TableHeader>구매자</TableHeader>
            <TableHeader>구매항목</TableHeader>
            <TableHeader>보내는사람</TableHeader>
            <TableHeader>메시지카드</TableHeader>
            <TableHeader>배송일</TableHeader>
            <TableHeader className="text-center">배송방식</TableHeader>
            <TableHeader className="text-center">시간대</TableHeader>
            <TableHeader>배송상태</TableHeader>
            <TableHeader>배송지</TableHeader>
            <TableHeader>주문일자</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={checkedOrders.has(order.id)}
                  onChange={(checked) => {
                    setCheckedOrders((prev) => {
                      const newSet = new Set(prev);
                      if (checked) {
                        newSet.add(order.id);
                      } else {
                        newSet.delete(order.id);
                      }
                      return newSet;
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <Link className="underline" to={`/orders/${order.id}`}>
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>
                <OrderStatusBadge orderStatus={order.status} />
              </TableCell>
              <TableCell>
                {order.user ? (
                  <React.Fragment>
                    <Link className="underline" to={`/users/${order.user.id}`}>
                      {order.user.id}
                    </Link>
                    <p>{order.user.email}</p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>비회원</p>
                    <p>{order.nonMemberEmail}</p>
                  </React.Fragment>
                )}
              </TableCell>
              <TableCell>
                <ul>
                  {order.items.map((item) => (
                    <li key={`order-item-${item.id}`}>
                      {item.productItem.title}&nbsp;{item.quantity}개
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                {order.isAnonymous ? (
                  <p>익명</p>
                ) : (
                  <React.Fragment>
                    <p>{order.senderName}</p>
                    <p>{order.senderPhoneNumber}</p>
                  </React.Fragment>
                )}
              </TableCell>
              <TableCell>
                {order.messageCardText && (
                  <Link
                    color="zinc"
                    to={`https://www.1moment.co.kr/message-card?secret=f1d80654-3f7e-49e0-a43e-8678dbb47220&order_id=${order.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    메세지 카드 문구 프린트
                  </Link>
                )}
              </TableCell>
              <TableCell className="tabular-nums">
                {format(order.deliveryDate, "yyyy-MM-dd")}
              </TableCell>
              <TableCell>{order.deliveryMethod?.title}</TableCell>
              <TableCell className="text-center">
                <DeliveryReceivingTimeBadge
                  receivingTime={order.receivingTime}
                />
              </TableCell>
              <TableCell>
                <DeliveryStatusBadge deliveryStatus={order.deliveryStatus} />
              </TableCell>
              <TableCell>
                <Strong>
                  {order.receiverName} / {order.receiverPhoneNumber}
                </Strong>
                <Text>
                  ({order.receiverZipCode}){order.receiverAddress}
                  {order.recieverAddressDetail}
                </Text>
              </TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-8">
        <PaginationPrevious>이전</PaginationPrevious>
        <PaginationList>
          {generatePagination(meta.totalPages, meta.page).map((page) => (
            <PaginationPage
              key={`page-${page}`}
              onClick={() => {
                setSearchParams((searchParams) => {
                  searchParams.set("page", `${page}`);
                  return searchParams;
                });
              }}
              current={page === currentPage}
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

export default function Page() {
  return (
    <React.Fragment>
      <Heading>주문목록</Heading>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">주문 목록을 불러오는 중...</div>
          }
        >
          <Orders />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
