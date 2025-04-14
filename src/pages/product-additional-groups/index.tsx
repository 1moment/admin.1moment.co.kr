import * as React from "react";
import { useNavigate } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

import { LinkButton } from "@/components/ui/button.tsx";

import { useProductAdditionalGroups } from "@/hooks/use-product-addtional-groups.tsx";

function ProductCategoriesPage() {
  const navigate = useNavigate();
  const {
    data: { items: productAdditionalGroups },
  } = useProductAdditionalGroups();

  return (
    <div className="py-4 bg-white rounded-xl">
      <Table className="mt-4 px-4">
        <TableHead>
          <TableRow>
            <TableHeader>그룹명</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {productAdditionalGroups.map((productAdditionalGroup) => (
            <TableRow
              key={productAdditionalGroup.id}
              className="cursor-pointer"
              tabIndex={0}
              onClick={() => {
                navigate(
                  `/product-additional-groups/${productAdditionalGroup.id}`,
                );
              }}
            >
              <TableCell>{productAdditionalGroup.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <div className="mb-8 flex items-start justify-between">
        <Heading>추가 상품 그룹</Heading>
        <LinkButton to="/product-additional-groups/create">추가</LinkButton>
      </div>
      <React.Suspense
        fallback={<div className="p-8 text-center">목록을 불러오는 중...</div>}
      >
        <ProductCategoriesPage />
      </React.Suspense>
    </React.Fragment>
  );
}
