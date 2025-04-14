import type { ProductAdditionalGroupMutationData } from "@/hooks/use-product-addtional-groups";

import * as React from "react";

import { Button } from "@/components/ui/button.tsx";
import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Label,
} from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

import { UnplugIcon } from "lucide-react";
import { Link } from "react-router";
import ProductsDialog from "@/components/ui/products-dialog.tsx";

export default function ProductAdditionalGroupForm({
  handleSubmit,
  productAdditionalGroup,
  fieldErrors,
  isLoading,
}: {
  handleSubmit: (data: ProductAdditionalGroupMutationData) => void;
  productAdditionalGroup?: ProductAdditionalGroup;
  fieldErrors?: Record<string, string>;
  isLoading?: boolean;
}) {
  const [openProductsDialog, setOpenProductsDialog] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>(
    productAdditionalGroup?.groupItems.map((groupItem) => groupItem.product) ||
      [],
  );

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
            productIds: JSON.parse(formData.get("productIds") as string),
          });
        }}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>기본정보</Subheading>
          </div>

          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <FieldGroup>
              <Field>
                <Label>
                  그룹명&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input
                  name="title"
                  defaultValue={productAdditionalGroup?.title}
                  invalid={!!fieldErrors?.title}
                />
                {fieldErrors?.title && (
                  <ErrorMessage>{fieldErrors.title}</ErrorMessage>
                )}
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>상품</Subheading>
            <Text>그룹에 연결된 추가상품</Text>
          </div>
          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2 ">
            <input
              type="hidden"
              name="productIds"
              value={JSON.stringify(products.map((product) => product.id))}
            />

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader className="w-1 whitespace-nowrap text-center">
                    이미지
                  </TableHeader>
                  <TableHeader>상품명</TableHeader>
                  <TableHeader className="w-1 whitespace-nowrap">
                    &nbsp;
                  </TableHeader>
                </TableRow>
              </TableHead>
              {Array.isArray(products) && products.length > 0 ? (
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="w-24">
                        <img className="block" src={product.imageUrl} alt="" />
                      </TableCell>
                      <TableCell>
                        <Link
                          className="flex underline"
                          to={`/products/${product.id}`}
                          target="_blank"
                        >
                          {product.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="red"
                          onClick={() => {
                            setProducts((prev) =>
                              prev.filter((p) => p.id !== product.id),
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
                        연결된 상품이 없습니다.
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <div className="mt-4 flex justify-end">
              <Button color="zinc" onClick={() => setOpenProductsDialog(true)}>
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

      <ProductsDialog
        selectedProducts={products.map((product) => product.id)}
        open={openProductsDialog}
        setOpen={setOpenProductsDialog}
        searchOptions={{
          isAdditional: true,
        }}
        onSelect={(product) => {
          setProducts((prev) => {
            const newArr = [...prev];
            newArr.push(product);
            return newArr;
          });
          setOpenProductsDialog(false);
        }}
      />
    </React.Fragment>
  );
}
