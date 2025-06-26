import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumbs = React.forwardRef<HTMLDivElement, BreadcrumbsProps>(
  ({ items, className }, ref) => {
    return (
      <nav ref={ref} className={cn("breadcrumbs", className)} aria-label="Breadcrumb">
        {items.map((item, index) => (
          <div key={index} className="breadcrumb-item">
            {item.current ? (
              <span className="breadcrumb-current" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <Link href={item.href} className="breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            
            {index < items.length - 1 && (
              <ChevronRight className="breadcrumb-separator" aria-hidden="true" />
            )}
          </div>
        ))}
      </nav>
    )
  }
)

Breadcrumbs.displayName = "Breadcrumbs"

export { Breadcrumbs } 