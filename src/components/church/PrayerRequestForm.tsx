import * as React from "react"
import { Heart, Lock, Globe, Send, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PrayerRequestData {
  name: string
  email?: string
  request: string
  privacy: "public" | "pastors" | "anonymous"
  category?: string
  urgent?: boolean
}

export interface PrayerRequestFormProps {
  onSubmit: (data: PrayerRequestData) => Promise<void>
  className?: string
}

const PrayerRequestForm = React.forwardRef<HTMLFormElement, PrayerRequestFormProps>(
  ({ onSubmit, className }, ref) => {
    const [formData, setFormData] = React.useState<PrayerRequestData>({
      name: "",
      email: "",
      request: "",
      privacy: "pastors"
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const privacyOptions = [
      {
        value: "public" as const,
        label: "Share publicly",
        description: "This prayer request will be visible to our church community",
        icon: Globe
      },
      {
        value: "pastors" as const,
        label: "Pastors only",
        description: "Only our pastoral team will see this request",
        icon: Lock
      },
      {
        value: "anonymous" as const,
        label: "Anonymous",
        description: "Submit without sharing personal details",
        icon: Heart
      }
    ]

    const categories = [
      "Healing", "Family", "Work/Career", "Relationships", "Spiritual Growth", "Guidance", "Other"
    ]

    const validateForm = () => {
      const newErrors: Record<string, string> = {}
      
      if (!formData.request.trim()) {
        newErrors.request = "Please share your prayer request"
      }
      
      if (formData.privacy !== "anonymous" && !formData.name.trim()) {
        newErrors.name = "Please provide your name"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)
      
      try {
        await onSubmit(formData)
        setIsSubmitted(true)
        
        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            request: "",
            privacy: "pastors"
          })
          setIsSubmitted(false)
        }, 3000)
      } catch (error) {
        console.error("Failed to submit prayer request:", error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleInputChange = (field: keyof PrayerRequestData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    }

    if (isSubmitted) {
      return (
        <div className={cn("prayer-request-form animate-scale-in", className)}>
          <div className="prayer-request-header">
            <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500 animate-bounce" />
            <h3 className="prayer-request-title">Prayer Request Received</h3>
            <p className="prayer-request-subtitle">
              Thank you for sharing your prayer request. Our team will be praying for you.
            </p>
          </div>
        </div>
      )
    }

    return (
      <form 
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("prayer-request-form animate-slide-in-up", className)}
      >
        <div className="prayer-request-header">
          <Heart className="mx-auto mb-4 w-12 h-12 text-primary" />
          <h3 className="prayer-request-title">Share Your Prayer Request</h3>
          <p className="prayer-request-subtitle">
            We believe in the power of prayer and would be honored to pray with you.
          </p>
        </div>

        {/* Privacy Selection */}
        <div className="prayer-request-privacy">
          <div className="prayer-request-privacy-title">
            <Lock className="w-4 h-4" />
            Privacy Settings
          </div>
          <div className="prayer-request-privacy-options">
            {privacyOptions.map((option) => (
              <label 
                key={option.value}
                className={cn(
                  "flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover-lift",
                  formData.privacy === option.value 
                    ? "border-primary bg-orange-peel-lightest" 
                    : "border-border-light hover:border-orange-peel-light"
                )}
              >
                <input
                  type="radio"
                  name="privacy"
                  value={option.value}
                  checked={formData.privacy === option.value}
                  onChange={(e) => handleInputChange("privacy", e.target.value)}
                  className="sr-only"
                />
                <option.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-text-primary">{option.label}</div>
                  <div className="text-sm text-text-muted">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Name Field (conditional) */}
        {formData.privacy !== "anonymous" && (
          <div className="prayer-request-field animate-slide-in-up">
            <label className="form-label" htmlFor="name">
              Your Name {formData.privacy !== "anonymous" && <span className="text-error">*</span>}
            </label>
            <input
              id="name"
              type="text"
              className={cn(
                "input w-full focus-ring transition-colors",
                errors.name && "border-error animate-shake"
              )}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="How can we address you in our prayers?"
            />
            {errors.name && (
              <div className="text-error text-sm mt-1 animate-slide-in-up">{errors.name}</div>
            )}
          </div>
        )}

        {/* Email Field (optional) */}
        {formData.privacy !== "anonymous" && (
          <div className="prayer-request-field animate-slide-in-up delay-1">
            <label className="form-label" htmlFor="email">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              className="input w-full focus-ring transition-colors"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="For prayer updates (optional)"
            />
          </div>
        )}

        {/* Category Selection */}
        <div className="prayer-request-field animate-slide-in-up delay-2">
          <label className="form-label" htmlFor="category">
            Prayer Category (Optional)
          </label>
          <select
            id="category"
            className="input w-full focus-ring transition-colors"
            value={formData.category || ""}
            onChange={(e) => handleInputChange("category", e.target.value)}
          >
            <option value="">Select a category...</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Prayer Request Text */}
        <div className="prayer-request-field animate-slide-in-up delay-3">
          <label className="form-label" htmlFor="request">
            Your Prayer Request <span className="text-error">*</span>
          </label>
          <textarea
            id="request"
            className={cn(
              "input w-full min-h-32 focus-ring transition-colors",
              errors.request && "border-error animate-shake"
            )}
            value={formData.request}
            onChange={(e) => handleInputChange("request", e.target.value)}
            placeholder="Please share what's on your heart. We're here to pray with you..."
            rows={4}
          />
          {errors.request && (
            <div className="text-error text-sm mt-1 animate-slide-in-up">{errors.request}</div>
          )}
        </div>

        {/* Urgent Checkbox */}
        <div className="prayer-request-field animate-slide-in-up delay-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => handleInputChange("urgent", e.target.checked)}
              className="checkbox focus-ring"
            />
            <span className="text-sm">This is an urgent prayer request</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6 animate-slide-in-up delay-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "btn btn-primary btn-large flex items-center gap-2 min-w-48",
              "hover-lift focus-ring transition-all",
              isSubmitting && "animate-pulse"
            )}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner loading-spinner-small" />
                Sending Prayer...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Prayer Request
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-text-muted mt-4 animate-fade-in">
          Your prayer request will be handled with care and confidentiality according to your privacy preferences.
        </p>
      </form>
    )
  }
)

PrayerRequestForm.displayName = "PrayerRequestForm"

export { PrayerRequestForm } 