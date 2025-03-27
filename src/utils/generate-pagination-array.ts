export function generatePagination(
    totalPages: number,
    currentPage: number,
    displayLimit = 10
): number[] {
  if (totalPages <= displayLimit) {
    // 전체 페이지가 displayLimit 이하라면 모두 보여줌
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfLimit = Math.floor(displayLimit / 2);

  let startPage = Math.max(currentPage - halfLimit, 1);
  let endPage = startPage + displayLimit - 1;

  // 마지막 페이지를 초과한 경우 수정
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = totalPages - displayLimit + 1;
  }

  return Array.from({ length: displayLimit }, (_, i) => startPage + i);
}
