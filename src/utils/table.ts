export const getPageNumbers = (
  currentPage: number,
  totalPages: number
): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (currentPage <= 4) {
    pages.push(2, 3, 4, 5);
    pages.push('...');
  } else if (currentPage >= totalPages - 3) {
    pages.push('...');
    pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
  } else {
    pages.push('...');
    pages.push(currentPage - 1, currentPage, currentPage + 1);
    pages.push('...');
  }

  pages.push(totalPages);
  return pages;
};
