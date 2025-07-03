import * as React from "react"
import { Breadcrumbs, BreadcrumbItem } from "../ui/breadcrumbs"
import { cn } from "@/lib/utils"

export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  subtitle?: string
  variant?: "default" | "narrow" | "wide"
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ 
    children, 
    className, 
    breadcrumbs, 
    title, 
    subtitle,
    variant = "default"
  }, ref) => {
    
    const containerClasses = cn(
      "container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16",
      {
        "max-w-4xl": variant === "narrow",
        "max-w-7xl": variant === "default",
        "max-w-full px-0 sm:px-0 lg:px-0": variant === "wide",
      },
      className
    );

    return (
      <main ref={ref} className={containerClasses}>
          {(title || subtitle || breadcrumbs) && (
            <div className="mb-12 text-center">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="justify-center mb-4" />}
              {title && <h1 className="text-4xl md:text-5xl font-heading font-bold">{title}</h1>}
              {subtitle && <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
            </div>
          )}
          {children}
      </main>
    )
  }
)

PageLayout.displayName = "PageLayout"

export { PageLayout } 