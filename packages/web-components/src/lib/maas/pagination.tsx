import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function generatePaginationRange(
  currentPage: number,
  totalPages: number,
): (number | '...')[] {
  const delta = 2;
  const range: (number | '...')[] = [];

  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: CategoryPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex h-10 w-10 items-center justify-center rounded border border-[#e0e0e0] bg-white disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }
        const pageNum = page as number;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`flex h-10 w-10 items-center justify-center rounded border text-sm font-semibold transition-colors ${
              currentPage === pageNum
                ? 'border-brand-primary bg-brand-primary text-white'
                : 'border-[#e0e0e0] bg-white text-black hover:bg-gray-50'
            }`}
          >
            {pageNum + 1}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex h-10 w-10 items-center justify-center rounded border border-[#e0e0e0] bg-white disabled:opacity-50"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
