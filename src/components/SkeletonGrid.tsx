type SkeletonGridProps = {
  count?: number
}

export function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="pokemon-grid" aria-label="Loading Pokemon">
      {Array.from({ length: count }).map((_, index) => (
        <article className="pokemon-card skeleton-card" key={`skeleton-${index}`}>
          <span className="skeleton-line skeleton-number" />
          <span className="skeleton-artwork" />
          <span className="skeleton-line skeleton-name" />
          <span className="skeleton-type-row">
            <span />
            <span />
          </span>
        </article>
      ))}
    </div>
  )
}
