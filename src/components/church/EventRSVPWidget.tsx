import * as React from "react"
import { Calendar, Clock, MapPin, Users, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  description?: string
  capacity?: number
  currentAttendees?: number
}

export interface EventRSVPWidgetProps {
  event: EventData
  onRSVP: (eventId: string, response: "attending" | "maybe" | "declined") => Promise<void>
  onShare?: (eventId: string) => void
  className?: string
}

const EventRSVPWidget = React.forwardRef<HTMLDivElement, EventRSVPWidgetProps>(
  ({ event, onRSVP, onShare, className }, ref) => {
    const [rsvpStatus, setRsvpStatus] = React.useState<"attending" | "maybe" | "declined" | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)

    const handleRSVP = async (response: "attending" | "maybe" | "declined") => {
      setIsLoading(true)
      
      try {
        await onRSVP(event.id, response)
        setRsvpStatus(response)
        setShowSuccess(true)
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000)
      } catch (error) {
        console.error("RSVP failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const attendancePercentage = event.capacity && event.currentAttendees 
      ? (event.currentAttendees / event.capacity) * 100 
      : 0

    return (
      <div 
        ref={ref}
        className={cn("event-rsvp-widget animate-slide-in-up", className)}
      >
        <div className="event-rsvp-content">
          {showSuccess && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-green-500 text-white p-2 rounded-full animate-bounce">
                <Check className="w-4 h-4" />
              </div>
            </div>
          )}
          
          <h3 className="event-rsvp-title">{event.title}</h3>
          
          <div className="event-rsvp-details">
            <div className="event-rsvp-detail">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="event-rsvp-detail">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="event-rsvp-detail">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            {event.capacity && (
              <div className="event-rsvp-detail">
                <Users className="w-4 h-4" />
                <span>{event.currentAttendees || 0} / {event.capacity}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm opacity-90 mb-4">{event.description}</p>
          )}

          {/* Attendance Progress Bar */}
          {event.capacity && event.currentAttendees && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Registration Progress</span>
                <span>{Math.round(attendancePercentage)}% Full</span>
              </div>
              <div className="loading-bar">
                <div 
                  className="loading-bar-progress"
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="event-rsvp-actions">
            {rsvpStatus ? (
              <div className="flex items-center gap-2 text-sm animate-fade-in">
                <Check className="w-4 h-4 text-green-300" />
                <span>
                  You&apos;re {rsvpStatus === "attending" ? "attending" : 
                    rsvpStatus === "maybe" ? "maybe attending" : "not attending"}
                </span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleRSVP("attending")}
                  disabled={isLoading}
                  className={cn(
                    "event-rsvp-button primary hover-lift",
                    isLoading && "animate-pulse"
                  )}
                >
                  {isLoading ? (
                    <div className="loading-spinner loading-spinner-small" />
                  ) : (
                    "I'll Be There"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRSVP("maybe")}
                  disabled={isLoading}
                  className="event-rsvp-button hover-lift"
                >
                  Maybe
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRSVP("declined")}
                  disabled={isLoading}
                  className="event-rsvp-button hover-lift"
                >
                  Can't Make It
                </button>
              </>
            )}
          </div>

          {onShare && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => onShare(event.id)}
                className="text-xs text-white/80 hover:text-white transition-colors underline"
              >
                Share this event
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
)

EventRSVPWidget.displayName = "EventRSVPWidget"

export { EventRSVPWidget } 