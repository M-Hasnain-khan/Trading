"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from "react"
import { cn } from "../lib/utils"

const DropdownMenuContext = createContext({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
})

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  return <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>{children}</DropdownMenuContext.Provider>
}

const DropdownMenuTrigger = React.forwardRef(({ children, asChild, className, ...props }, ref) => {
  const { open, setOpen } = useContext(DropdownMenuContext)
  const triggerRef = useRef(null)

  // Merge refs
  const handleRef = (el) => {
    if (ref) {
      if (typeof ref === "function") ref(el)
      else ref.current = el
    }
    triggerRef.current = el
  }

  const Comp = asChild ? React.cloneElement(children, { ref: handleRef }) : "button"

  if (asChild) {
    return React.cloneElement(children, {
      ref: handleRef,
      onClick: (e) => {
        e.preventDefault()
        setOpen(!open)
        children.props.onClick?.(e)
      },
      ...props,
    })
  }

  return (
    <Comp ref={handleRef} className={cn("", className)} onClick={() => setOpen(!open)} {...props}>
      {children}
    </Comp>
  )
})

DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(
  ({ children, className, align = "center", sideOffset = 4, ...props }, ref) => {
    const { open, setOpen } = useContext(DropdownMenuContext)
    const contentRef = useRef(null)
    const triggerRef = useRef(null)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [setOpen])

    useEffect(() => {
      if (open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + sideOffset,
          left: align === "center" ? rect.left + rect.width / 2 : rect.left,
        })
      }
    }, [open, align, sideOffset])

    if (!open) return null

    return (
      <div
        ref={contentRef}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-800 bg-gray-900 p-1 shadow-md animate-in fade-in-80 fixed",
          className,
        )}
        style={{
          top: `${position.top}px`,
          left: align === "center" ? `${position.left}px` : `${position.left}px`,
          transform: align === "center" ? "translateX(-50%)" : "none",
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)

DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-800 hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})

DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
