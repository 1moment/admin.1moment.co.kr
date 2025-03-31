import * as React from "react";
import * as Sentry from "@sentry/react";
import { apiClient } from "@/utils/api-client.ts";

import { useParams } from "react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset";
import { Text } from "@/components/ui/text";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/ui/table.tsx";
import { Link } from "@/components/ui/link.tsx";
import { Editor } from "@/components/ui/editor.tsx";
import {PencilIcon, UnplugIcon} from "lucide-react";

function Product() {
  const params = useParams<{ "product-id": string }>();
  const [isEdit, setIsEdit] = React.useState(false);

  const productId = params["product-id"];
  const queryClient = useQueryClient();
  const { data: product } = useSuspenseQuery<Product>({
    queryKey: ["products", productId],
    async queryFn() {
      const response = await apiClient(`/admin/products/${productId}`);
      const result = await response.json();
      return result;
    },
  });

  const {
    data: { items: productContentBlocks },
  } = useSuspenseQuery<{ items: ProductContentBlock[] }>({
    queryKey: ["product-content-blocks", { isUsed: true }],
    async queryFn() {
      const response = await apiClient("/admin/product-content-blocks");
      const result = await response.json();
      return result;
    },
  });

  const { mutate } = useMutation<
    ProductCategory,
    any,
    Pick<Partial<ProductCategory>, "title" | "slug" | "status" | "parentId">
  >({
    mutationFn: async (data) => {
      const result = await apiClient(
        `/admin/product-categories/${params["product-category-id"]}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      return result.json();
    },
    onSuccess: () => {
      // 성공 이후 데이터 다시 불러옴 (캐시된 데이터 갱신)
      queryClient.invalidateQueries({
        queryKey: ["product-categories", params["product-category-id"]],
      });
    },
    onError: (error) => {
      console.error("업데이트 실패: ", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const status = formData.get("status") as string;

    const patchData = {
      title,
      slug,
      status,
    };

    mutate(patchData);
  };

  console.log(product);

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>상품 상세</Heading>
        <div className="flex gap-3">
          {isEdit ? (
            <React.Fragment>
              <Button
                key="submit-button"
                color="white"
                onClick={() => setIsEdit(false)}
              >
                취소
              </Button>
              <Button
                key="submit-button"
                color="green"
                type="submit"
                form="product-form"
              >
                저장
              </Button>
            </React.Fragment>
          ) : (
            <Button
              key="edit-button"
              color="white"
              onClick={() => setIsEdit(true)}
            >
              수정
            </Button>
          )}
        </div>
      </div>
      <Divider className="mt-3 mb-6" />
      <form id="product-form">
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>기본정보</Subheading>
            <Text>현재 카테고리의 기본 정보</Text>
          </div>
          <div>
            <FieldGroup>
              <Field>
                <Label>상품명</Label>
                <Input
                  name="title"
                  defaultValue={product.title}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>SLUG</Label>
                <Input
                  name="slug"
                  defaultValue={product.slug}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>설명</Label>
                <Input
                  name="description"
                  defaultValue={product.description}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>상태</Label>
                <Select
                  name="status"
                  defaultValue={product.status}
                  disabled={!isEdit}
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </Select>
              </Field>

              <Field>
                <Label>PC 이미지</Label>
                <img src={product.imageUrl} alt="" />
                <Input type="file" />
              </Field>
            </FieldGroup>
          </div>
        </section>

        <Divider className="my-10" />

        <section className="">
          <div className="space-y-1">
            <Subheading>내용</Subheading>
            <Text>상품 상세에서 사용될 내용</Text>
          </div>
          <div>
            <FieldGroup>
              <Field>
                <Label>내용</Label>
                <Editor content={product.content} />

                {/*<Textarea*/}
                {/*  name="content"*/}
                {/*  defaultValue={product.content}*/}
                {/*  readOnly={!isEdit}*/}
                {/*  rows={4}*/}
                {/*/>*/}
              </Field>

              <Field>
                <Label>상단내용</Label>
                <Select defaultValue={product.topContentBlockId} readOnly={!isEdit}>
                  <option value="">없음</option>
                  {productContentBlocks.map((productContentBlock) => (
                    <option value={productContentBlock.id}>
                      {productContentBlock.title}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>하단내용</Label>
                <Select defaultValue={product.bottomContentBlockId} readOnly={!isEdit}>
                  <option value="">없음</option>
                  {productContentBlocks.map((productContentBlock) => (
                      <option value={productContentBlock.id}>
                        {productContentBlock.title}
                      </option>
                  ))}
                </Select>
              </Field>
            </FieldGroup>
          </div>
        </section>
        {/*<section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">*/}
        {/*  <div className="space-y-1">*/}
        {/*    <Subheading>부모</Subheading>*/}
        {/*    <Text>PUBLISHED: 11<br/>DRAFT: 22</Text>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <Select name="status" defaultValue={productCategory.status}>*/}
        {/*      <option value="PUBLISHED">PUBLISHED</option>*/}
        {/*      <option value="DRAFT">DRAFT</option>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*</section>*/}
      </form>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <div>
            <Subheading>옵션</Subheading>
          </div>
          <div>
            <Button>추가</Button>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="w-1 whitespace-nowrap text-center">
                식별자
              </TableHeader>
              <TableHeader>옵션명</TableHeader>
              <TableHeader className="text-center">할인전가격</TableHeader>
              <TableHeader className="text-center">가격</TableHeader>
              <TableHeader>재고</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap">
                &nbsp;
              </TableHeader>
            </TableRow>
          </TableHead>
          {product.items.length > 0 ? (
            <TableBody>
              {product.items.map((productItem) => (
                <TableRow key={productItem.id}>
                  <TableCell>{productItem.id}</TableCell>
                  <TableCell>{productItem.title}</TableCell>
                  <TableCell className="text-center">
                    {productItem.originPrice
                      ? `${productItem.originPrice.toLocaleString("ko-KR")}원`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {productItem.price.toLocaleString("ko-KR")}원
                  </TableCell>
                  <TableCell>{productItem.quantityInStock}</TableCell>

                  <TableCell>
                    <Button plain>
                      <PencilIcon data-slot="icon" />
                      수정
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>연결된 카테고리가 없습니다.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <div>
            <Subheading>연결된 카테고리</Subheading>
          </div>
          <div>
            <Button>추가</Button>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="w-1 whitespace-nowrap">식별</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap">
                카테고리ID
              </TableHeader>
              <TableHeader>SLUG</TableHeader>
              <TableHeader>카테고리명</TableHeader>
              <TableHeader className="w-1 whitespace-nowrap">
                &nbsp;
              </TableHeader>
            </TableRow>
          </TableHead>
          {product.categories.length > 0 ? (
            <TableBody>
              {product.categories.map((productCategory) => (
                <TableRow key={productCategory.id}>
                  <TableCell>{productCategory.id}</TableCell>
                  <TableCell>
                    <Link
                      className="flex justify-center underline"
                      to={`/product-categories/${productCategory.category.id}`}
                    >
                      {productCategory.category.id}
                    </Link>
                  </TableCell>
                  <TableCell>{productCategory.category.slug}</TableCell>
                  <TableCell>{productCategory.category.title}</TableCell>
                  <TableCell>
                    <Button color="red">
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
                <TableCell>연결된 카테고리가 없습니다.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </section>
    </React.Fragment>
  );
}

export default function ProductPage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">상품 정보를 불러오는 중...</div>
          }
        >
          <Product />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
