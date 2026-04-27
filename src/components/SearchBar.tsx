import { Search, X } from 'lucide-react'

type SearchBarProps = {
  value: string
  resultCount: number
  isLoading: boolean
  onChange: (value: string) => void
  onClear: () => void
}

export function SearchBar({
  value,
  resultCount,
  isLoading,
  onChange,
  onClear,
}: SearchBarProps) {
  return (
    <div className="search-control">
      <label className="search-input-wrap">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Search Pokemon by name</span>
        <input
          type="search"
          value={value}
          placeholder="Search by name"
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>

      <button
        type="button"
        className="icon-button"
        aria-label="Clear search"
        disabled={value.length === 0}
        onClick={onClear}
      >
        <X size={18} aria-hidden="true" />
      </button>

      <span className="search-count" aria-live="polite">
        {isLoading ? 'Loading' : `${resultCount} found`}
      </span>
    </div>
  )
}
