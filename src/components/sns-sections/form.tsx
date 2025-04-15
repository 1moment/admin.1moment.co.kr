import type { SnsSectionMutationData } from "@/hooks/use-sns-sections.tsx";

import * as React from "react";
import { format } from "date-fns/format";

import { Subheading } from "@/components/ui/heading.tsx";
import { Strong, Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";
import ProductsDialog from "@/components/ui/products-dialog.tsx";

export default function SnsSectionForm({
  snsSection,
  onSubmit,
}: {
  snsSection?: SnsSection;
  onSubmit: (data: SnsSectionMutationData) => void;
}) {
  const [openProductsDialog, setOpenProductsDialog] = React.useState(false);
  const { mutate: fileUpload } = useFileUploadMutation();

  const [isProductsModalOpen, setIsProductsModalOpen] = React.useState(false);
  const [product, setProduct] = React.useState<Product | null>(
    snsSection?.product || null,
  );
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    snsSection?.imageUrl,
  );

  const submitHandler = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      onSubmit({
        displayedHandlerName: formData.get("displayedHandlerName") as string,
        imageUrl: formData.get("imageUrl") as string,
        sequence: Number(formData.get("sequence")),
        productId: Number(formData.get("productId")),
      });
    },
    [onSubmit],
  );

  return (
    <React.Fragment>
      <form
        id="promotion-sections-form"
        className="divide-y divide-gray-900/10"
        onSubmit={submitHandler}
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
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>연결된 상품</Subheading>
          </div>

          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <FieldGroup>
              <Field>
                <Input type="hidden" name="productId" value={product?.id} />
                <div className="flex items-center  justify-between gap-3">
                  <Text>
                    {product ? product.title : "연결된 상품이 없습니다."}
                  </Text>
                  <Button
                    plain
                    className="py-0 leading-[inherit]"
                    onClick={() => setOpenProductsDialog(true)}
                  >
                    선택
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-1">
          <Button type="submit">저장</Button>
        </div>
      </form>
      <ProductsDialog
        selectedProducts={product ? [product.id] : []}
        open={openProductsDialog}
        onSelect={(product) => {
          setProduct(product);
          setOpenProductsDialog(false);
        }}
        setOpen={() => setOpenProductsDialog(false)}
      />
    </React.Fragment>
  );
}
