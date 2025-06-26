import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: "small" | "medium" | "large"
  backdropBlur?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    className,
    size = "medium",
    backdropBlur = true,
    closeOnOverlayClick = true,
    closeOnEscape = true
  }, ref) => {
    // Handle escape key
    React.useEffect(() => {
      if (!closeOnEscape || !isOpen) return
      
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    // Prevent body scroll when modal is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = ''
        }
      }
    }, [isOpen])

    // Focus management
    React.useEffect(() => {
      if (isOpen) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        const modal = document.querySelector('.modal-content')
        const elements = modal?.querySelectorAll(focusableElements) as NodeListOf<HTMLElement>
        
        if (elements?.length) {
          elements[0]?.focus()
        }
      }
    }, [isOpen])

    if (!isOpen) return null

    const sizeClasses = {
      small: "max-w-md",
      medium: "max-w-2xl", 
      large: "max-w-4xl"
    }

    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose()
      }
    }

    return (
      <div 
        ref={ref}
        className={cn(
          "modal-overlay open",
          backdropBlur && "backdrop-blur"
        )}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div className={cn(
          "modal-content animate-scale-in",
          sizeClasses[size],
          className
        )}>
          {title && (
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
              <button
                type="button"
                className="modal-close focus-ring"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          )}
          
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = "Modal"

export { Modal } 