import { SearchX } from 'lucide-react'

type EmptyStateProps = {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <section className="state-panel" aria-live="polite">
      <SearchX size={34} aria-hidden="true" />
      <h2>No Pokemon found</h2>
      <p>Try another name or remove a type filter.</p>
      <button type="button" className="primary-button" onClick={onClearFilters}>
        Clear filters
      </button>
    </section>
  )
}
