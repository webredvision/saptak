"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/app/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="bg-[var(--rv-bg-white)] text-[var(--rv-black)] shadow-lg rounded-lg border border-[var(--rv-gray)]"
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}

      {/* Top-right viewport */}
      <ToastViewport className="fixed top-4 right-4 z-[1000] flex flex-col gap-2 w-80 max-w-[90vw] outline-none" />
    </ToastProvider>
  )
}
