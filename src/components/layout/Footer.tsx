
export function Footer() {
  return (
    <footer className="bg-primary/30 text-primary-foreground py-8 text-center md:text-left">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Contact Information */}
          <div className="w-full md:w-1/3 space-y-1">
            <h3 className="text-md font-semibold mb-1">Contact Information</h3>
            <p className="text-sm">860 N. Leroy St. | Fenton, MI 48430</p>
            <p className="text-sm">810.629.9427</p>
          </div>

          {/* Copyright and Credits - Moved to center */}
          <div className="w-full md:w-1/3 space-y-1 md:text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} First Baptist of Fenton. All Rights Reserved.
            </p>
            <p className="text-xs mt-1">
              Web Design | De Jesus Digital Solutions
            </p>
            <p className="text-xs mt-1">
              First Baptist Church Fenton, Fenton, Michigan.
            </p>
          </div>

          {/* Office Schedule - Moved to right */}
          <div className="w-full md:w-1/3 space-y-1 md:text-right">
            <h3 className="text-md font-semibold mb-1">Office Schedule</h3>
            <p className="text-sm">Monday - Thursday | 10:00AM to 04:00 PM</p>
            <p className="text-sm">Sunday | 10:30 AM to 12:00 PM</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
