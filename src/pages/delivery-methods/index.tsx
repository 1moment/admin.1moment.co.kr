import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";
import { generatePagination } from "@/utils/generate-pagination-array.ts";
import { useSearchParams } from "react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Field, Label } from "@/components/ui/fieldset";
import { Select } from "@/components/ui/select";
import {
  useDeliveryMethods,
  useDeliveryMethodUpdateMutation,
} from "@/hooks/use-delivery-methods";
import DeliveryMethodFormModal from "@/components/delivery-methods/form-modal.tsx";
function DeliveryMethods() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [editingItem, setEditingItem] = React.useState(null);
  const currentPage = Number(searchParams.get("page") || 1);
  const isHidden = searchParams.get("isHidden");

  const {
    data: { items, meta },
    refetch,
  } = useDeliveryMethods({ currentPage });

  const { isPending: isUpdating, mutate: updateDeliveryMethod } =
    useDeliveryMethodUpdateMutation();

  return (
    <div className="mt-10 py-4 bg-white sm:rounded-xl">
      

      <hr className="mt-4 border-zinc-500/10" />

      <Table className="mt-4 px-4 max-w-[100%]">
        <TableHead>
          <TableRow>
            <TableHeader className="text-center">배송명</TableHeader>
            <TableHeader className="text-center">배송방식</TableHeader>
            <TableHeader className="text-center">배송가능일</TableHeader>
            <TableHeader className="text-center">기본</TableHeader>
            <TableHeader className="text-center">추가금액</TableHeader>
            <TableHeader className="text-center">할인금액</TableHeader>
            <TableHeader />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((deliveryMethod) => (
            <TableRow key={deliveryMethod.id}>
              <TableCell>{deliveryMethod.title}</TableCell>
              <TableCell className="text-center">
                {deliveryMethod.type}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                <ul>
                  {deliveryMethod.availableDates.map((date) => (
                    <li key={date}>{format(new Date(date), "yyyy-MM-dd")}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="text-center">
                {deliveryMethod.isDefault && "✅"}
              </TableCell>
              <TableCell className="tabular-nums text-right">
                {Number(deliveryMethod.addedPrice).toLocaleString("ko-KR")}원
              </TableCell>
              <TableCell className="tabular-nums text-right">
                {Number(deliveryMethod.discountedPrice).toLocaleString("ko-KR")}
                원
              </TableCell>
              <TableCell>
                <Button onClick={() => setEditingItem(deliveryMethod)}>
                  수정
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeliveryMethodFormModal
        title="배송방법 수정"
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        deliveryMethod={editingItem}
        onSubmit={(data) => {
          updateDeliveryMethod(data, {
            onSuccess() {
              refetch();
              alert('수정이 완료되었습니다');
              setEditingItem(null);
            },
            onError(error) {
              console.log(error)
            }
          });
        }}
      />
    </div>
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
          fallback={<div className="p-8 text-center">불러오는 중...</div>}
        >
          <Heading>배송방법</Heading>
          <DeliveryMethods />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
