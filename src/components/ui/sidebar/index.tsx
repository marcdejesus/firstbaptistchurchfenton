"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, useSidebar } from "./context"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "./constants"

// Re-export everything
export { SidebarProvider, useSidebar } from "./context"
export type { SidebarContext } from "./context"
export { Sidebar, SidebarInset } from "./sidebar-main"
export {
  SidebarTrigger,
  SidebarRail, 
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "./sidebar-components"
export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar-menu"

// Enhanced SidebarProvider that includes TooltipProvider
export const SidebarRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SidebarProvider
        defaultOpen={defaultOpen}
        open={openProp}
        onOpenChange={setOpenProp}
        ref={ref}
        className={className}
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarProvider>
    )
  }
)
SidebarRoot.displayName = "SidebarRoot" 