import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";

// 서버 응답 타입 정의
interface UploadResponse {
  url: string; // 업로드된 파일의 URL 예시
  fileName: string; // 업로드된 파일의 이름
  fileSize: number; // 업로드된 파일의 크기(bytes)
}

export default function useFileUploadMutation() {
  return useMutation<UploadResponse, Error, File>({
    async mutationFn(file) {
      const formData = new FormData();
      formData.set("file", file);

      const response = await apiClient("/admin/file-upload", {
        method: "POST",
        body: formData,
      });

      if (response.status === 413) {
        throw new Error("용량은 50MB로 제한되어있습니다");
      }
      if (!response.ok) {
        throw new Error("File upload failed");
      }

      return await response.json();
    },
  });
}
