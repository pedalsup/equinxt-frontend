// components/ui/CustomButton.tsx

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Loader from "@/custom-components/loader"

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  icon?: React.ReactNode
  buttonTextClassName?: string
  iconClassName?: string
  layout?: "theme_black" | "theme_white" | "theme_black_full_width" | "danger" // etc. your custom layouts
}

export default function CustomButton({
  isLoading,
  disabled,
  icon,
  children,
  className,
  iconClassName,
  buttonTextClassName,
  layout,
  ...props
}: CustomButtonProps) {
  let layoutClasses = ""

  switch (layout) {
    case "theme_black":
      layoutClasses = `bg-primary_black text-white rounded-2xl py-4 px-14`
      break
    case "theme_white":
      layoutClasses = `bg-white text-black rounded-2xl py-4 px-14`
      break
    case "theme_black_full_width":
      layoutClasses = `bg-primary_black text-white rounded-2xl py-4 w-full`
      break
    case "danger":
      layoutClasses = `bg-orange-800 text-white rounded-2xl py-3`
      break
    default:
      layoutClasses = ""
  }

  return (
    <Button
      disabled={disabled || isLoading}
      className={cn(layoutClasses, className)}
      {...props}
    >
      {isLoading ? (
        <Loader background="black" fill="#fff" />
      ) : (
        <div className="flex items-center justify-center gap-x-2">
          {icon && <span className={cn("block", iconClassName)}>{icon}</span>}
          <span className={cn("text-base", buttonTextClassName)}>{children}</span>
        </div>
      )}
    </Button>
  )
}
