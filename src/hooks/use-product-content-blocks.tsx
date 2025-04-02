import {useSuspenseQuery} from "@tanstack/react-query";
import {apiClient} from "@/utils/api-client.ts";


export function useProductContentBlocks() {
    return useSuspenseQuery<{ items: ProductContentBlock[] }>({
        queryKey: ["product-content-blocks", { isUsed: true }],
        async queryFn() {
            const response = await apiClient("/admin/product-content-blocks");
            const result = await response.json();
            return result;
        },
    });
}