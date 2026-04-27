import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  currentPage: number
  pageCount: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <nav className="pagination" aria-label="Pokemon pages">
      <button
        type="button"
        className="pagination-button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={18} aria-hidden="true" />
        Previous
      </button>

      <span className="pagination-status" aria-live="polite">
        {firstItem}-{lastItem} of {totalItems}
        <span>Page {currentPage} of {pageCount}</span>
      </span>

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  )
}
