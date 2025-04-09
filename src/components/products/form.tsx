import type { ProductMutationData } from "@/hooks/use-products";

import * as React from "react";

import { Button } from "@/components/ui/button.tsx";
import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Editor } from "@/components/ui/editor.tsx";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

import { useProductContentBlocks } from "@/hooks/use-product-content-blocks.tsx";
import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { PencilIcon, UnplugIcon } from "lucide-react";
import { Link } from "@/components/ui/link.tsx";

import { useCategories } from "@/hooks/use-categories.tsx";

export default function ProductForm({
  handleSubmit,
  product,
  isLoading,
}: {
  handleSubmit: (data: ProductMutationData) => void;
  product?: Product;
  isLoading?: boolean;
}) {
  const {
    data: { items: productContentBlocks },
  } = useProductContentBlocks({
    isUsed: true
  });
  const { mutate: fileUpload } = useFileUploadMutation();

  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    product?.imageUrl,
  );
  const [content, setContent] = React.useState<string | undefined>(
    product?.content,
  );

  // productItem도 식별할 수 있게 uid라는 프로퍼티를 생성함
  const [productItems, setProductItems] = React.useState(
    product?.items?.map((item) => ({
      ...item,
      uid: crypto.randomUUID(),
    })) || [],
  );
  const [categories, setCategories] = React.useState<ProductCategory[]>(
    product?.categories.map((productCategory) => ({
      ...productCategory.category,
    })) || [],
  );

  const [editingOption, setEditingOption] = React.useState<string>();
  const [openCategoriesDialog, setOpenCategoriesDialog] = React.useState(false);

  return (
    <React.Fragment>
      <form
        id="product-form"
        className="divide-y divide-gray-900/10"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);

          handleSubmit({
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            description: formData.get("description") as string,
            imageUrl: imageUrl as string,
            content: content as string,
            topContentBlockId:
              Number(formData.get("topContentBlockId")) || null,
            bottomContentBlockId:
              Number(formData.get("bottomContentBlockId")) || null,
            status: formData.get("status") as string,
            items: productItems.map(({ uid, ...rest }) => rest),
            categoryIds: categories.map((category) => category.id),
          });
        }}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>기본정보</Subheading>
            <Text>상품에 대한 기본 정보</Text>
          </div>

          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <FieldGroup>
              <Field>
                <Label>
                  상품명&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input name="title" defaultValue={product?.title} />
              </Field>

              <Field>
                <Label>
                  SLUG&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input name="slug" defaultValue={product?.slug} />
              </Field>

              <Field>
                <Label>설명</Label>
                <Input name="description" defaultValue={product?.description} />
              </Field>

              <Field>
                <Label>
                  PC 이미지&nbsp;<span className="text-red-400">*</span>
                </Label>
                {imageUrl && <img src={imageUrl} alt="" />}
                <Input
                  className="mt-3"
                  type="file"
                  accept="image/*"
                  onChange={({ target, currentTarget: { files } }) => {
                    if (files?.[0]) {
                      fileUpload(files[0], {
                        onSuccess(data) {
                          setImageUrl(data.url);
                        },
                        onSettled() {
                          target.value = "";
                        },
                      });
                    }
                  }}
                />
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>내용</Subheading>
            <Text>상품 상세에서 내용</Text>
          </div>

          <FieldGroup className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <Field>
              <Label>상단내용</Label>
              <Select
                name="topContentBlockId"
                defaultValue={product?.topContentBlockId}
              >
                <option value="">없음</option>
                {productContentBlocks.map((productContentBlock) => (
                  <option
                    key={`pcb-top-${productContentBlock.id}`}
                    value={productContentBlock.id}
                  >
                    {productContentBlock.title}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>내용</Label>
              <Editor
                name="content"
                content={product?.content}
                onUpdate={({ editor }) => setContent(editor.getHTML())}
              />
            </Field>

            <Field>
              <Label>하단내용</Label>
              <Select
                name="bottomContentBlockId"
                defaultValue={product?.bottomContentBlockId}
              >
                <option value="">없음</option>
                {productContentBlocks.map((productContentBlock) => (
                  <option
                    key={`pcb-bottom-${productContentBlock.id}`}
                    value={productContentBlock.id}
                  >
                    {productContentBlock.title}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>사용여부</Subheading>
            <Text>상품에 대한 기본 정보</Text>
          </div>

          <FieldGroup className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <Field>
              <Label>상태</Label>
              <Select name="status" defaultValue={product?.status || "DRAFT"}>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </Select>
            </Field>
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>옵션</Subheading>
            <Text>상품에서 구매할 수 있는 옵션</Text>
          </div>
          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2 ">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>옵션명</TableHeader>
                  <TableHeader className="text-center">할인전가격</TableHeader>
                  <TableHeader className="text-center">가격</TableHeader>
                  <TableHeader>재고</TableHeader>
                  <TableHeader className="w-1 whitespace-nowrap">
                    &nbsp;
                  </TableHeader>
                </TableRow>
              </TableHead>
              {Array.isArray(productItems) && productItems.length > 0 ? (
                <TableBody>
                  {productItems.map((productItem) => (
                    <TableRow key={productItem.uid}>
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
                        <Button
                          color="yellow"
                          onClick={() => setEditingOption(productItem.uid)}
                        >
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
                    <TableCell colSpan={5} className="h-20 text-center">
                      생성한 옵션이 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <div className="mt-4 flex justify-end">
              <Button
                color="zinc"
                onClick={() => setEditingOption(crypto.randomUUID())}
              >
                추가
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>카테고리</Subheading>
            <Text>상품에서 구매할 수 있는 옵션</Text>
          </div>
          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2 ">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>카테고리명</TableHeader>
                  <TableHeader>SLUG</TableHeader>
                  <TableHeader className="w-1 whitespace-nowrap">
                    &nbsp;
                  </TableHeader>
                </TableRow>
              </TableHead>
              {Array.isArray(categories) && categories.length > 0 ? (
                <TableBody>
                  {categories.map((productCategory) => (
                    <TableRow key={productCategory.id}>
                      <TableCell>
                        <Link
                          className="flex underline"
                          to={`/product-categories/${productCategory.id}`}
                          target="_blank"
                        >
                          {productCategory.title}
                        </Link>
                      </TableCell>
                      <TableCell>{productCategory.slug}</TableCell>
                      <TableCell>
                        <Button
                          color="red"
                          onClick={() => {
                            setCategories((prev) =>
                              prev.filter(
                                (category) =>
                                  category.id !== productCategory.id,
                              ),
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
                    <TableCell colSpan={4}>
                      <div className="h-20 flex items-center justify-center">
                        연결된 카테고리가 없습니다.
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <div className="mt-4 flex justify-end">
              <Button
                color="zinc"
                onClick={() => setOpenCategoriesDialog(true)}
              >
                추가
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            저장
          </Button>
        </div>
      </form>

      <OptionDialog
        uid={editingOption}
        option={productItems.find((item) => item.uid === editingOption)}
        onSubmit={(productItem) => {
          const uid = editingOption;
          setProductItems((prev) => {
            const arr = prev.map((item) => ({ ...item }));
            if (!productItem) {
              return arr.filter((item) => item.uid !== uid);
            }

            if (arr.find((item) => item.uid === uid)) {
              return arr.map((item) => (item.uid === uid ? productItem : item));
            }
            return [...arr, productItem];
          });
        }}
        onClose={() => setEditingOption(undefined)}
      />

      <CategoriesDialog
        open={openCategoriesDialog}
        onSelect={(selectedCategory) =>
          setCategories((prev) => [...prev, selectedCategory])
        }
        onClose={() => setOpenCategoriesDialog(false)}
      />
    </React.Fragment>
  );
}

function OptionDialog({ uid, option, onSubmit, onClose }) {
  return (
    <Dialog open={!!uid} onClose={onClose}>
      <DialogTitle>상품 옵션</DialogTitle>
      <DialogBody>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            if (!formData.get("title")) {
              return alert("옵션명을 입력해주세요");
            }

            if (!formData.get("price")) {
              return alert("가격을 입력해주세요");
            }

            if (!formData.get("quantityInStock")) {
              return alert("재고를 입력해주세요");
            }

            onSubmit({
              uid,
              title: formData.get("title"),
              originPrice: Number(formData.get("originPrice")),
              price: Number(formData.get("price")),
              quantityInStock: Number(formData.get("quantityInStock")),
            });
            onClose();
          }}
        >
          <FieldGroup>
            <Field>
              <Label>
                옵션명&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input name="title" defaultValue={option?.title} />
            </Field>

            <Field>
              <Label>할인 전 가격</Label>
              <Input
                type="number"
                name="originPrice"
                defaultValue={option?.originPrice}
              />
            </Field>

            <Field>
              <Label>
                가격&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input type="number" name="price" defaultValue={option?.price} />
            </Field>

            <Field>
              <Label>
                재고&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input
                name="quantityInStock"
                defaultValue={option?.quantityInStock}
              />
            </Field>
          </FieldGroup>
          <div className="mt-6 flex items-center justify-between">
            <div>
              {option && (
                <Button
                  color="red"
                  onClick={() => {
                    onSubmit();
                    onClose();
                  }}
                >
                  삭제
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button plain onClick={onClose}>
                취소
              </Button>
              <Button type="submit">저장</Button>
            </div>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
}

function CategoriesDialog({ open, onSelect, onClose }) {
  const {
    data: { items: categories },
  } = useCategories({ status: "PUBLISHED", limit: 100 });

  const [selectedCategory, setSelectedCategory] =
    React.useState<ProductCategory>();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>카테고리 선택</DialogTitle>
      <DialogDescription>상품에 카테고리를 연결합니다</DialogDescription>
      <DialogBody>
        <Select
          value={selectedCategory?.id}
          onChange={(event) => {
            setSelectedCategory(
              categories.find(
                (category) =>
                  category.id === Number.parseInt(event.target.value),
              ),
            );
          }}
        >
          {categories.map((category) => (
            <option key={`category-${category.id}`} value={category.id}>
              {category.title}
            </option>
          ))}
        </Select>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          취소
        </Button>
        <Button
          disabled={!selectedCategory}
          onClick={() => {
            onSelect(selectedCategory);
            onClose();
          }}
        >
          선택
        </Button>
      </DialogActions>
    </Dialog>
  );
}
