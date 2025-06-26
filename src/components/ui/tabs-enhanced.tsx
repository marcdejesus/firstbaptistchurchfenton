import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

export interface TabsProps {
  items: TabItem[]
  defaultActiveTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
  orientation?: "horizontal" | "vertical"
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    items, 
    defaultActiveTab, 
    activeTab: controlledActiveTab,
    onTabChange,
    className,
    orientation = "horizontal"
  }, ref) => {
    const [internalActiveTab, setInternalActiveTab] = React.useState(
      defaultActiveTab || items[0]?.id || ""
    )
    
    const activeTab = controlledActiveTab ?? internalActiveTab
    
    const handleTabChange = (tabId: string) => {
      if (!controlledActiveTab) {
        setInternalActiveTab(tabId)
      }
      onTabChange?.(tabId)
    }

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
      const currentIndex = items.findIndex(item => item.id === tabId)
      let nextIndex = currentIndex

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          break
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          event.preventDefault()
          nextIndex = 0
          break
        case 'End':
          event.preventDefault()
          nextIndex = items.length - 1
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleTabChange(tabId)
          return
      }

      // Skip disabled tabs
      while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
        if (nextIndex < items.length - 1) {
          nextIndex++
        } else {
          nextIndex = 0
        }
      }

      if (!items[nextIndex]?.disabled) {
        handleTabChange(items[nextIndex].id)
      }
    }

    const activeContent = items.find(item => item.id === activeTab)?.content

    return (
      <div 
        ref={ref}
        className={cn("tabs", className)}
        data-orientation={orientation}
      >
        <div 
          className="tabs-list" 
          role="tablist"
          aria-orientation={orientation}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeTab === item.id}
              aria-controls={`tabpanel-${item.id}`}
              id={`tab-${item.id}`}
              disabled={item.disabled}
              className={cn(
                "tabs-trigger focus-ring transition-colors",
                {
                  "active": activeTab === item.id,
                  "opacity-50 cursor-not-allowed": item.disabled
                }
              )}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              tabIndex={activeTab === item.id ? 0 : -1}
            >
              {item.icon && (
                <span className="mr-2" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>

        <div 
          className={cn(
            "tabs-content active animate-fade-in",
            "focus-ring"
          )}
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {activeContent}
        </div>
      </div>
    )
  }
)

Tabs.displayName = "Tabs"

export { Tabs } 