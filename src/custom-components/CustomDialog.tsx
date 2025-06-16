"use client"

import React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"

interface DialogWrapperProps {
  trigger: React.ReactNode
  children: React.ReactNode
  showCloseButton?: boolean
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  trigger,
  children,
  showCloseButton = true,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default DialogWrapper