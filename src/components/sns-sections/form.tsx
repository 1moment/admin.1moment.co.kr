import * as React from "react";
import { format } from "date-fns/format";

import { Subheading } from "@/components/ui/heading.tsx";
import { Strong, Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Radio, RadioField, RadioGroup } from "@/components/ui/radio.tsx";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "@/components/ui/dialog.tsx";

import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";
import { useProducts } from "@/hooks/use-products.tsx";

export default function SnsSectionForm({
  snsSection,
  onSubmit,
}: {
  snsSection?: SnsSection;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { mutate: fileUpload } = useFileUploadMutation();

  const [isProductsModalOpen, setIsProductsModalOpen] = React.useState(false);
  const [product, setProduct] = React.useState<Product | null>(
    snsSection?.product || null,
  );
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    snsSection?.imageUrl,
  );
  console.log("상품!!!", product);
  return (
    <form
      id="promotion-category-form"
      className="mt-8 p-4 border border-gray-100 rounded shadow"
      onSubmit={onSubmit}
    >
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>기본정보</Subheading>
          <Text>현재 섹션의 기본 정보</Text>
        </div>
        <div>
          <FieldGroup>
            <Field>
              <Label>
                핸들러&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input
                name="displayedHandlerName"
                defaultValue={snsSection?.displayedHandlerName}
              />
            </Field>

            <Field>
              <Label>
                이미지&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input type="hidden" name="imageUrl" defaultValue={imageUrl} />
              <img src={imageUrl} alt="" />
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

            <Field>
              <Label>
                연결된 상품&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input type="hidden" name="productId" value={product?.id} />
              <div className="flex items-center  justify-between gap-3">
                <Text>
                  {product ? product.title : "연결된 상품이 없습니다."}
                </Text>
                <Button
                  plain
                  className="py-0 leading-[inherit]"
                  onClick={() => setIsProductsModalOpen(true)}
                >
                  선택
                </Button>
              </div>
            </Field>

            <Field>
              <Label>순서</Label>
              <Input name="sequence" defaultValue={snsSection?.sequence} />
            </Field>

            {snsSection?.createdAt && (
              <Field>
                <Label>생성일</Label>
                <Text>
                  {format(
                    new Date(snsSection.createdAt),
                    "yyyy-MM-dd hh:mm:ss",
                  )}
                </Text>
              </Field>
            )}
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-1">
            <Button type="submit">저장</Button>
          </div>
        </div>
      </section>
      <ProductsModal
        isOpen={isProductsModalOpen}
        onSelect={setProduct}
        onClose={() => setIsProductsModalOpen(false)}
      />
    </form>
  );
}

function ProductsModal({ isOpen, onSelect, onClose }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>();

  const {
    data: { items: products },
  } = useProducts({ currentPage });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>상품 목록</DialogTitle>
      <DialogBody>
        <RadioGroup
          value={selectedProduct?.id ? String(selectedProduct.id) : ""}
          onChange={(value) => {
            setSelectedProduct(
              products.find((product) => product.id === Number(value)),
            );
          }}
        >
          {products.map((product) => (
            <RadioField
              key={product.id}
              checked={product.id === selectedProduct?.id}
            >
              <Radio value={String(product.id)} />
              <Label className="flex items-center gap-3">
                <img
                  className="rounded"
                  width={40}
                  height={40}
                  src={product.imageUrl}
                  alt=""
                />
                <div>
                  <Strong>{product.title}</Strong>
                  <Text>{product.description}</Text>
                </div>
              </Label>
            </RadioField>
          ))}
        </RadioGroup>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => onClose(false)}>
          닫기
        </Button>
        <Button
          disabled={!selectedProduct}
          onClick={() => {
            onSelect(selectedProduct);
            onClose(false);
          }}
        >
          선택
        </Button>
      </DialogActions>
    </Dialog>
  );
}
