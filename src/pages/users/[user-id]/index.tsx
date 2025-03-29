import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";
import * as Sentry from "@sentry/react";

import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
    DescriptionDetails,
    DescriptionList,
    DescriptionTerm,
} from "@/components/ui/description-list";
import { Text } from "@/components/ui/text.tsx";
import { CalendarIcon, ReceiptTextIcon } from "lucide-react";
import { Link } from "@/components/ui/link.tsx";

function User() {
    const params = useParams<{ "user-id": string }>();

    const userId = params["user-id"];
    const { data: user } = useSuspenseQuery<User>({
        queryKey: ["users", userId],
        async queryFn() {
            const response = await apiClient(`/admin/users/${userId}`);
            const result = await response.json();

            if (result.error) {
                throw new Error(result.message);
            }

            return result;
        },
    });

    console.log(user);
    return (
        <React.Fragment>
            <div className="flex justify-between">
                <div>
                    <div>
                        <Heading>주문 #{userId}</Heading>
                    </div>
                    <div className="mt-2 flex gap-4">
                        <div className="flex items-center gap-2">
                            <ReceiptTextIcon
                                className="text-zinc-500 dark:text-zinc-400"
                                width={16}
                                height={16}
                            />
                            {/*<Text>{Number(order.totalPaymentAmount).toLocaleString()}원</Text>*/}
                        </div>

                        <div className="flex items-center gap-2">
                            <CalendarIcon
                                className="text-zinc-500 dark:text-zinc-400"
                                width={16}
                                height={16}
                            />
                            <Text>
                                {/*{format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")}*/}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            <Subheading className="mt-10">주문정보</Subheading>

        </React.Fragment>
    );
}

export default function UserPage() {
    return (
        <React.Fragment>
            <Sentry.ErrorBoundary fallback={(errorData) => <p>{errorData.error.message}</p>}>
                <React.Suspense
                    fallback={
                        <div className="p-8 text-center">주문정보 불러오는 중...</div>
                    }
                >
                    <User />
                </React.Suspense>
            </Sentry.ErrorBoundary>
        </React.Fragment>
    );
}
