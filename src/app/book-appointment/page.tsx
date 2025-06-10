"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Counselor {
  id: string;
  name: string;
  title: string;
  experience: string;
  calendarId: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  counselorId: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: string;
}

export default function BookAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCounselor, setSelectedCounselor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: ""
  });

  // Fetch counselors on component mount
  useEffect(() => {
    fetchCounselors();
  }, []);

  // Fetch available time slots when date or counselor changes
  useEffect(() => {
    if (selectedDate && selectedCounselor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedCounselor]);

  const fetchCounselors = async () => {
    try {
      const response = await fetch('/api/counselors');
      const data = await response.json();
      setCounselors(data);
    } catch (error) {
      console.error('Error fetching counselors:', error);
      // Fallback to default counselor
      setCounselors([{
        id: "sarah-halsey",
        name: "Sarah Halsey",
        title: "Counseling Ministry Leader",
        experience: "20+ Years Experience",
        calendarId: "sarah@firstbaptistchurch.org"
      }]);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedCounselor) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/availability?counselorId=${selectedCounselor}&date=${dateStr}`);
      const data = await response.json();
      setAvailableSlots(data.timeSlots || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedCounselor || !selectedTime || 
        !formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingData: BookingData = {
        counselorId: selectedCounselor,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        reason: formData.reason
      };

      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setBookingComplete(true);
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred while booking your appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <Link href="/counseling" className="inline-flex items-center text-accent hover:text-accent/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Counseling
          </Link>
        </div>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-lora font-bold text-primary-foreground mb-4">
              Appointment Booked Successfully!
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Your counseling appointment has been scheduled. You will receive a confirmation email shortly.
            </p>
            <div className="bg-white/70 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3">Appointment Details:</h3>
              <div className="space-y-2 text-left">
                <p><strong>Counselor:</strong> {counselors.find(c => c.id === selectedCounselor)?.name}</p>
                <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Duration:</strong> 60 minutes</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/counseling">
                <Button variant="outline" size="lg">
                  Return to Counseling Page
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg">
                  Go to Home Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Link href="/counseling" className="inline-flex items-center text-accent hover:text-accent/80 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Counseling
        </Link>
        <h1 className="text-4xl md:text-5xl font-lora font-bold text-primary-foreground mb-4">
          Book Your Appointment
        </h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Schedule a confidential counseling session. Select your preferred date, counselor, and time slot.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Date, Counselor & Time Selection */}
        <div className="space-y-6">
          {/* Date Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-accent" />
                Select Date
              </CardTitle>
              <CardDescription>Choose your preferred appointment date</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || !isWeekday(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-2">
                Appointments available Monday through Friday
              </p>
            </CardContent>
          </Card>

          {/* Counselor Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-accent" />
                Select Counselor
              </CardTitle>
              <CardDescription>Choose your preferred counselor</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a counselor" />
                </SelectTrigger>
                <SelectContent>
                  {counselors.map((counselor) => (
                    <SelectItem key={counselor.id} value={counselor.id}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{counselor.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {counselor.title} • {counselor.experience}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-accent" />
                Available Times
              </CardTitle>
              <CardDescription>
                {selectedDate && selectedCounselor 
                  ? `Available slots for ${format(selectedDate, "MMMM d, yyyy")}`
                  : "Select a date and counselor to see available times"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading available times...</div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className="text-sm"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              ) : selectedDate && selectedCounselor ? (
                <p className="text-center text-muted-foreground py-4">
                  No available times for this date. Please select another date.
                </p>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Please select a date and counselor first.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Information */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-accent" />
                Contact Information
              </CardTitle>
              <CardDescription>Please provide your details for the appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="reason">Brief Description (Optional)</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Briefly describe what you'd like to discuss (optional)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary & Submit */}
          <Card className="shadow-lg border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDate && selectedCounselor && selectedTime ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Counselor:</span>
                    <span className="font-semibold">
                      {counselors.find(c => c.id === selectedCounselor)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">60 minutes</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Complete the form above to see your appointment summary
                </p>
              )}
              
              <Button 
                onClick={handleBookAppointment}
                disabled={loading || !selectedDate || !selectedCounselor || !selectedTime || 
                         !formData.firstName || !formData.lastName || !formData.email}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By booking an appointment, you agree to our confidentiality policy. 
                You will receive a confirmation email with appointment details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 