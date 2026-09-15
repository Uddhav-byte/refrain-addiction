import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onChange, ...props }, ref) => {
    const [isInternalChecked, setIsInternalChecked] = React.useState(defaultChecked || false)
    const isChecked = checked !== undefined ? checked : isInternalChecked

    const toggle = () => {
      if (props.disabled) return
      const newValue = !isChecked
      if (checked === undefined) {
        setIsInternalChecked(newValue)
      }
      onChange?.(newValue)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={toggle}
        ref={ref}
        className={cn(
          "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-primary" : "bg-input",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            isChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
