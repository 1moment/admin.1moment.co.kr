import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
import { addDays } from "date-fns/addDays";

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
import { Link } from "@/components/ui/link.tsx";
import { Field, Label } from "@/components/ui/fieldset.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import { useOrderAssignment, useOrders } from "@/hooks/use-orders.tsx";
import {
  OrderStatusBadge,
  DeliveryStatusBadge,
  DeliveryReceivingTimeBadge,
} from "@/components/ui/badge.tsx";
import { Navbar, NavbarItem, NavbarSection } from "@/components/ui/navbar.tsx";
import UserContext from "../../contexts/user-context.ts";
import { useAdminUsers } from "@/hooks/use-admin-users.tsx";

const timeOrder = {
  QUICK: 0,
  MORNING: 1,
  AFTERNOON: 2,
  EVENING: 3,
  ANYTIME: 4,
};
const currentDate = new Date();
function Worksheet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = React.use(UserContext);
  console.log(currentUser);

  const deliveryMethodType =
    searchParams.get("deliveryMethodType") || "DELIVERY";
  const deliveryDate =
    searchParams.get("deliveryDate") ||
    format(
      deliveryMethodType === "DELIVERY" ? addDays(currentDate, 1) : currentDate,
      "yyyy-MM-dd",
    );

  const {
    data: { items, meta },
    refetch,
  } = useOrders({
    currentPage: 1,
    limit: 1000,
    status: "ORDERED",
    deliveryDate,
    deliveryMethodType,
  });
  const { mutate: _workAssign } = useOrderAssignment();

  const { data: adminUsers } = useAdminUsers();

  const workAssign = React.useCallback(
    (data) => {
      _workAssign(data, {
        onSuccess() {
          refetch();
        },
      });
    },
    [_workAssign, refetch],
  );

  return (
    <React.Fragment>
      <div className="mt-8 py-4 bg-white border border-gray-100 rounded-xl">
        <form className="px-4 items-end flex justify-between">
          <input
            type="hidden"
            name="deliveryMethodType"
            value={deliveryMethodType}
          />
          <div className="flex items-center justify-center gap-3">
            <Field className="shrink-0 w-16">
              <Label>배송일</Label>
            </Field>
            <Input
              key={`date-${deliveryDate}`}
              type="date"
              name="deliveryDate"
              onBlur={() => console.log("fefe")}
              // onInput={(e) => e.target.form.submit()}
              defaultValue={deliveryDate}
            />
            <Button type="submit" className="shrink-0">
              조회
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-8 py-4 bg-white border border-gray-100 rounded-xl">
        <Navbar className="px-4">
          <NavbarSection>
            <NavbarItem
              to="?deliveryMethodType=DELIVERY"
              current={deliveryMethodType === "DELIVERY"}
            >
              택배
            </NavbarItem>
            <NavbarItem
              to="?deliveryMethodType=QUICK,PICKUP"
              current={deliveryMethodType === "QUICK,PICKUP"}
            >
              퀵 / 방문수령
            </NavbarItem>
          </NavbarSection>
        </Navbar>

        <hr className="mb-5 border-gray-100" />

        <Table className="px-4 overflow-x-auto">
          <TableHead>
            <TableRow>
              <TableHeader className="text-center">주문번호</TableHeader>
              {deliveryMethodType.includes("QUICK") && (
                <TableHeader className="text-center">시간대</TableHeader>
              )}
              <TableHeader className="text-center">담당자</TableHeader>
              <TableHeader>주문상품</TableHeader>
              <TableHeader>배송방식</TableHeader>
              <TableHeader>주문상태</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .sort(
                (a, b) =>
                  timeOrder[a.receivingTime] - timeOrder[b.receivingTime],
              )
              .sort((a, b) => {
                if (a.workAssignment && !b.workAssignment) return 1;
                if (!a.workAssignment && b.workAssignment) return -1;
              })
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-center">
                    <Link className="underline" to={`/orders/${order.id}`}>
                      {order.id}
                    </Link>
                  </TableCell>
                  {deliveryMethodType.includes("QUICK") && (
                    <TableCell>
                      <div className="flex justify-center">
                        <DeliveryReceivingTimeBadge
                          receivingTime={order.receivingTime}
                        />
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    {order.workAssignment ? (
                      <React.Fragment>
                        {currentUser.id ===
                        order.workAssignment?.adminUserId ? (
                          <Button
                            color="orange"
                            onClick={() => {
                              workAssign({
                                orderId: order.id,
                                adminUserId: null,
                              });
                            }}
                          >
                            배정 취소
                          </Button>
                        ) : (
                          <p>
                            {
                              adminUsers.find(
                                (au) =>
                                  au.id === order.workAssignment.adminUserId,
                              ).name
                            }
                          </p>
                        )}
                      </React.Fragment>
                    ) : (
                      currentUser.groups.includes("florist") && (
                        <Button
                          onClick={() => {
                            workAssign({
                              orderId: order.id,
                              adminUserId: currentUser.id,
                            });
                          }}
                        >
                          배정받기
                        </Button>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <ul className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <li key={`item-${item.id}`}>
                          <div className="flex items-center gap-3">
                            <img
                              width={48}
                              height={48}
                              className="rounded"
                              alt=""
                              src={item.product.imageUrl}
                            />
                            <Link to={`/products/${item.product.id}`}>
                              {item.productItem.title}
                            </Link>
                            {item.quantity}개
                          </div>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{order.deliveryMethod?.title}</TableCell>
                  <TableCell>
                    <OrderStatusBadge orderStatus={order.status} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Heading>작업계획서</Heading>
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
          <Worksheet />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
