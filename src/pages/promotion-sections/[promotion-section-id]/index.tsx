import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import * as Sentry from "@sentry/react";

import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { Strong, Text } from "@/components/ui/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@/components/ui/link.tsx";
import { ArrowLeftIcon, UnplugIcon } from "lucide-react";
import PromotionSectionsForm from "@/components/promotion-sections/form.tsx";
import {
  usePromotionSection,
  usePromotionSectionUpdateMutation,
} from "@/hooks/use-promotion-sections.tsx";
import ProductsDialog from "@/components/ui/products-dialog.tsx";

function PromotionSection() {
  const navigate = useNavigate();
  const params = useParams<{ "promotion-section-id": string }>();
  const [openProducts, setOpenProducts] = React.useState(false);

  const promotionSectionId = Number(params["promotion-section-id"]);
  const { data: promotionSection, refetch } =
    usePromotionSection(promotionSectionId);
  const { mutate: updateData } =
    usePromotionSectionUpdateMutation(promotionSectionId);

  const { mutate: removeSectionProduct } = useMutation<
    PromotionCategory,
    Error,
    { sectionId: number; productId: number }
  >({
    async mutationFn(data) {
      const result = await apiClient(
        `/admin/promotion-sections/${data.sectionId}/products/${data.productId}`,
        {
          method: "DELETE",
        },
      );

      return await result.json();
    },
  });

  const onSubmit = React.useCallback(
    (data) => {
      updateData(data, {
        onSuccess(data) {
          refetch();
          alert("수정하였습니다");
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [promotionSection, updateData],
  );

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{promotionSection.title}</Heading>
      </div>
      <PromotionSectionsForm
        promotionSection={promotionSection}
        onSubmit={onSubmit}
      />
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>연결된 상품</Subheading>
          <Text>상품에 대한 기본 정보</Text>
        </div>

        <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>상품ID</TableHeader>
                <TableHeader>상품이미지</TableHeader>
                <TableHeader>상품명</TableHeader>
                <TableHeader className="text-center">순서</TableHeader>
                <TableHeader className="w-1 whitespace-nowrap">
                  &nbsp;
                </TableHeader>
              </TableRow>
            </TableHead>
            {promotionSection.products.length > 0 ? (
              <TableBody>
                {promotionSection.products.map((product) => (
                  <TableRow key={`product-${product.id}`}>
                    <TableCell>
                      <Link
                        className="underline tabular-nums"
                        to={`/products/${product.product.id}`}
                      >
                        {product.product.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <img
                        width={80}
                        height={80}
                        src={product.product.imageUrl}
                        alt=""
                      />
                    </TableCell>
                    <TableCell>
                      <Strong>{product.product.title}</Strong>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      <Strong>{product.sequence}</Strong>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="red"
                        onClick={() => {
                          removeSectionProduct(
                            {
                              sectionId: promotionSection.id,
                              productId: product.product.id,
                            },
                            {
                              onSuccess() {
                                refetch();
                                alert("선택한 상품과 연결을 해제하였습니다");
                              },
                            },
                          );
                        }}
                      >
                        <UnplugIcon data-slot="icon" />
                        연결끊기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    연결된 상품이 없습니다
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpenProducts(true)}>추가</Button>
          </div>
        </div>
      </div>
      <ProductsDialog
        selectedProducts={promotionSection.products.map(
          (product) => product.product.id,
        )}
        open={openProducts}
        setOpen={setOpenProducts}
        onSelect={() => refetch()}
      />
    </React.Fragment>
  );
}

export default function PromotionSectionPage() {
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
          <PromotionSection />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
