import * as React from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { Breadcrumbs, BreadcrumbItem } from "../ui/breadcrumbs"
import { cn } from "@/lib/utils"

export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  showBreadcrumbs?: boolean
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  subtitle?: string
  variant?: "default" | "narrow" | "wide" | "hero"
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ 
    children, 
    className, 
    showBreadcrumbs = false, 
    breadcrumbs = [], 
    title, 
    subtitle,
    variant = "default"
  }, ref) => {
    const contentClasses = cn(
      "content-layout",
      {
        "content-layout-narrow": variant === "narrow",
        "content-layout-wide": variant === "wide",
      }
    )

    return (
      <div ref={ref} className={cn("page-layout", className)}>
        <header className="page-header">
          <Header />
        </header>

        <main className="page-main">
          {variant === "hero" ? (
            <>
              <section className="hero">
                <div className="hero-content">
                  {title && <h1 className="hero-title">{title}</h1>}
                  {subtitle && <p className="hero-subtitle">{subtitle}</p>}
                </div>
              </section>
              <div className={contentClasses}>
                {showBreadcrumbs && breadcrumbs.length > 0 && (
                  <Breadcrumbs items={breadcrumbs} />
                )}
                {children}
              </div>
            </>
          ) : (
            <div className={contentClasses}>
              {showBreadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
              )}
              
              {(title || subtitle) && (
                <div className="section-header">
                  {title && <h1 className="section-title">{title}</h1>}
                  {subtitle && <p className="section-subtitle">{subtitle}</p>}
                </div>
              )}
              
              {children}
            </div>
          )}
        </main>

        <footer className="page-footer">
          <Footer />
        </footer>
      </div>
    )
  }
)

PageLayout.displayName = "PageLayout"

export { PageLayout } 