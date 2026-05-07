"use client"

type LoadingStateProps = {
  message?: string
  fullScreen?: boolean
  className?: string
}

export function LoadingState({
  message = "Loading...",
  fullScreen = false,
  className = "",
}: LoadingStateProps) {
  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
        <div className="text-primary glow-cyan text-xl">{message}</div>
      </div>
    )
  }

  return <div className={`text-center text-muted-foreground py-12 ${className}`}>{message}</div>
}

