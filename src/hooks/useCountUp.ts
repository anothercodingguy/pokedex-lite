import { useEffect, useState } from 'react'

type CountUpOptions = {
  decimals?: number
  duration?: number
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function roundToDecimals(value: number, decimals: number): number {
  const multiplier = 10 ** decimals
  return Math.round(value * multiplier) / multiplier
}

export function useCountUp(
  targetValue: number,
  { decimals = 0, duration = 650 }: CountUpOptions = {},
) {
  const [displayValue, setDisplayValue] = useState(() =>
    prefersReducedMotion() ? targetValue : 0,
  )

  useEffect(() => {
    let frameId = 0
    let startTime: number | null = null

    const updateValue = (timestamp: number) => {
      if (prefersReducedMotion()) {
        setDisplayValue(targetValue)
        return
      }

      startTime ??= timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const nextValue = roundToDecimals(targetValue * easedProgress, decimals)

      setDisplayValue(progress === 1 ? targetValue : nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue)
      }
    }

    frameId = window.requestAnimationFrame(updateValue)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [decimals, duration, targetValue])

  return displayValue
}
