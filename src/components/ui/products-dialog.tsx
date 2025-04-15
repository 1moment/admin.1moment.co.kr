import React from "react";
import { generatePagination } from "@/utils/generate-pagination-array.ts";

import * as Headless from "@headlessui/react";
import { Dialog, DialogBody, DialogTitle } from "@/components/ui/dialog.tsx";
import { Strong, Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Pagination,
  PaginationList,
  PaginationPage,
} from "@/components/ui/pagination.tsx";
import { Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Divider } from "@/components/ui/divider.tsx";

import { useProducts } from "@/hooks/use-products.tsx";

export default function ProductsDialog({
  selectedProducts,
  searchOptions,
  open,
  setOpen,
  onSelect,
}) {
  return (
    <Dialog open={open} onClose={setOpen} size="2xl">
      <DialogTitle>상품 목록</DialogTitle>
      <DialogBody>
        <React.Suspense>
          <Products
            selectedProducts={selectedProducts}
            searchOptions={searchOptions}
            onSelect={onSelect}
          />
        </React.Suspense>
      </DialogBody>
    </Dialog>
  );
}
function Products({ selectedProducts, searchOptions, onSelect }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [query, setQuery] = React.useState("");

  const {
    data: { items: products, meta },
  } = useProducts({
    status: "PUBLISHED",
    ...(searchOptions || {}),
    query,
    queryType: "title",
    currentPage,
  });

  return (
    <React.Fragment>
      <form
        className="mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(event.currentTarget.title.value);
        }}
      >
        <Headless.Field className="flex items-center gap-3">
          <Label className="shrink-0">검색어</Label>
          <Input name="title" />
          <Button type="submit" className="shrink-0">
            조회
          </Button>
        </Headless.Field>
      </form>
      <Divider />
      {products.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {products.map((product) => (
            <li
              key={`products-${product.id}`}
              className="py-2 flex items-center gap-3"
            >
              <img
                className="object-contain w-20 h-20"
                src={product.imageUrl}
                alt=""
              />
              <div className="grow">
                <Text>{product.slug}</Text>
                <Strong>{product.title}</Strong>
              </div>
              <Button
                color="sky"
                disabled={selectedProducts.includes(product.id)}
                onClick={() => onSelect(product)}
              >
                {selectedProducts.includes(product.id) ? "선택됨" : "선택"}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center">
        <Pagination className="mt-8 p-4">
          <PaginationList>
            {generatePagination(meta.totalPages, meta.page).map((page) => (
              <PaginationPage
                key={`page-${page}`}
                onClick={() => {
                  setCurrentPage(page);
                }}
                current={page === currentPage}
              >
                {page}
              </PaginationPage>
            ))}
          </PaginationList>
        </Pagination>
      </div>
    </React.Fragment>
  );
}
