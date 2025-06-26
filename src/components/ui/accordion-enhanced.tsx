import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  disabled?: boolean
  defaultOpen?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  type?: "single" | "multiple"
  className?: string
  collapsible?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, type = "single", className, collapsible = true }, ref) => {
    const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
      const defaultOpen = new Set<string>()
      items.forEach(item => {
        if (item.defaultOpen) {
          defaultOpen.add(item.id)
        }
      })
      return defaultOpen
    })

    const toggleItem = (itemId: string) => {
      setOpenItems(prev => {
        const newOpenItems = new Set(prev)
        
        if (type === "single") {
          // Close all items first
          newOpenItems.clear()
          
          // Open the clicked item if it wasn't already open (or if collapsible is false)
          if (!prev.has(itemId) || !collapsible) {
            newOpenItems.add(itemId)
          }
        } else {
          // Multiple mode - toggle the clicked item
          if (newOpenItems.has(itemId)) {
            newOpenItems.delete(itemId)
          } else {
            newOpenItems.add(itemId)
          }
        }
        
        return newOpenItems
      })
    }

    const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleItem(itemId)
      }
    }

    return (
      <div ref={ref} className={cn("accordion", className)}>
        {items.map((item, index) => {
          const isOpen = openItems.has(item.id)
          
          return (
            <div key={item.id} className="accordion-item">
              <button
                type="button"
                className={cn(
                  "accordion-trigger focus-ring transition-colors",
                  {
                    "opacity-50 cursor-not-allowed": item.disabled
                  }
                )}
                onClick={() => !item.disabled && toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                disabled={item.disabled}
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${item.id}`}
                id={`accordion-trigger-${item.id}`}
              >
                <span>{item.title}</span>
                <ChevronDown 
                  className={cn(
                    "accordion-icon transition-transform",
                    isOpen && "rotate-180"
                  )} 
                  size={20}
                  aria-hidden="true"
                />
              </button>
              
              <div
                className={cn(
                  "accordion-content transition-all duration-300 ease-in-out",
                  isOpen ? "expanded" : "max-h-0"
                )}
                id={`accordion-content-${item.id}`}
                aria-labelledby={`accordion-trigger-${item.id}`}
                role="region"
              >
                <div className="accordion-content-inner">
                  {item.content}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

Accordion.displayName = "Accordion"

export { Accordion } 