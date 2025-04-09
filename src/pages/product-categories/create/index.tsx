import * as React from "react";
import { useNavigate } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import ProductCategoryForm from "@/components/product-categories/form.tsx";

import { useCategoryCreateMutation } from "@/hooks/use-categories.tsx";

function ProductCategoryCreate() {
  const navigate = useNavigate();
  const { mutate: updateCategory } = useCategoryCreateMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateCategory(
      {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        status: formData.get("status") as "PUBLISHED" | "DRAFT",
        imageUrl: formData.get("imageUrl") as string,
        mobileImageUrl: formData.get("mobileImageUrl") as string,
        parentId: Number(formData.get("parentId")) || undefined,
        seq: Number(formData.get("seq")),
      },
      {
        onSuccess(data) {
          alert("상품 카테고리를 추가하였습니다");
          navigate(`/product-categories/${data.id}`);
        },
        onError(error) {
          alert(error.message);
        },
      },
    );
  };

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>상품 카테고리 추가</Heading>
      </div>
      <ProductCategoryForm handleSubmit={handleSubmit} />
    </React.Fragment>
  );
}

export default function ProductCategoryCreatePage() {
  return <ProductCategoryCreate />;
}
