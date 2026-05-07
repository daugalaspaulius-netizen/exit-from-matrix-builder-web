"use client"

type ErrorAlertProps = {
  message?: string
  className?: string
}

export function ErrorAlert({ message, className = "mb-6" }: ErrorAlertProps) {
  if (!message) {
    return null
  }

  return (
    <div className={`${className} p-3 rounded-md bg-destructive/20 border border-destructive/50 text-destructive text-sm`}>
      {message}
    </div>
  )
}

