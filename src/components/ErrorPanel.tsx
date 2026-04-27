import { AlertTriangle, RotateCcw } from 'lucide-react'

type ErrorPanelProps = {
  message: string
  onRetry: () => void
}

export function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <section className="state-panel error-panel" role="alert">
      <AlertTriangle size={34} aria-hidden="true" />
      <h2>Could not load Pokemon</h2>
      <p>{message}</p>
      <button type="button" className="primary-button" onClick={onRetry}>
        <RotateCcw size={16} aria-hidden="true" />
        Retry
      </button>
    </section>
  )
}
