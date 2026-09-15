import * as React from "react"
import { Toaster as HotToaster, toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: "!bg-card !text-card-foreground !border !border-border !shadow-lg !rounded-xl",
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
        },
        success: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--primary-foreground))',
          },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--destructive-foreground))',
          },
        },
      }}
    />
  )
}

export const showSuccess = (msg: string) => {
  toast.success(msg)
}

export const showError = (msg: string) => {
  toast.error(msg)
}

export const showInfo = (msg: string) => {
  toast(msg, {
    icon: 'ℹ️',
  })
}

export { toast }
