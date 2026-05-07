
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
      <div className={"min-h-screen bg-background matrix-grid flex items-center justify-center " + className}>
        <div className="text-center space-y-5">
          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-full border border-primary/15" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-ring" />
            <div
              className="absolute inset-2 rounded-full border-t border-secondary"
              style={{ animation: "spin-ring 1.8s linear infinite reverse" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            </div>
          </div>
          <p className="text-primary/80 text-xs tracking-[0.25em] uppercase font-mono">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={"py-16 flex items-center justify-center " + className}>
      <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
        <div
          className="w-4 h-4 rounded-full border-t-2 border-primary"
          style={{ animation: "spin-ring 1.2s linear infinite" }}
        />
        {message}
      </div>
    </div>
  )
}
