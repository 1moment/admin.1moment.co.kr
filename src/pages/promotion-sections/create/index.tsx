import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";

import { useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset";
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
import { UnplugIcon } from "lucide-react";

function PromotionSectionCreate() {
    const { mutate: updateData } = useMutation<
        PromotionCategory,
        Error,
        Pick<Partial<PromotionSection>, "title" | "sequence">
    >({
        async mutationFn(data) {
            const result = await apiClient(
                `/admin/promotion-sections/${promotionSectionId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                },
            );

            return await result.json();
        },
    });

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
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data: Parameters<typeof updateData>[0] = {};
            const formData = new FormData(event.currentTarget);
            if (promotionSection.title !== formData.get("title")) {
                data.title = formData.get("title") as string;
            }

            if (promotionSection.sequence !== Number(formData.get("sequence"))) {
                data.sequence = Number(formData.get("sequence"));
            }

            updateData(data, {
                onSuccess(data) {
                    console.log(data);
                    alert("성공");
                },
                onError() {
                    alert("오류");
                },
            });
        },
        [promotionSection, updateData],
    );

    console.log(promotionSection);
    return (
        <React.Fragment>
            <div className="flex justify-between">
                <Heading>맞춤형 추천상품 섹션</Heading>
            </div>
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
                                    타이틀&nbsp;<span className="text-red-400">*</span>
                                </Label>
                                <Input name="title" defaultValue="" />
                            </Field>

                            <Field>
                                <Label>순서</Label>
                                <Input
                                    name="sequence"
                                    defaultValue=""
                                />
                            </Field>
                        </FieldGroup>

                        <div className="mt-6 flex justify-end gap-1">
                            <Button type="submit">저장</Button>
                        </div>
                    </div>
                </section>
            </form>

            <section className="mt-8 p-4 border border-gray-100 rounded shadow">
                <div className="flex justify-between">
                    <Subheading>연결된 상품</Subheading>
                    <div>
                        <Button>추가</Button>
                    </div>
                </div>
                <Table className="mt-8">
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
                                <TableCell colSpan={3}>연결된 상품이 없습니다</TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </section>
        </React.Fragment>
    );
}

export default function PromotionSectionCreatePage() {
    return (
        <React.Fragment>
            <Sentry.ErrorBoundary
                fallback={(errorData) => <p>{errorData.error.message}</p>}
            >
                <React.Suspense
                    fallback={
                        <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
                    }
                >
                    <PromotionSectionCreate />
                </React.Suspense>
            </Sentry.ErrorBoundary>
        </React.Fragment>
    );
}
