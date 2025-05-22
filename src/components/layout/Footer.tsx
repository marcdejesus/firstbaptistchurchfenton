export function Footer() {
  return (
    <footer className="bg-primary/30 text-primary-foreground py-8 text-center">
      <div className="container mx-auto px-4 space-y-4">
        <div>
          <h3 className="text-md font-semibold mb-1">Contact Information</h3>
          <p className="text-sm">860 N. Leroy St. | Fenton, MI 48430</p>
          <p className="text-sm">810.629.9427</p>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-1">Office Schedule</h3>
          <p className="text-sm">Monday - Thursday | 10:00AM to 04:00 PM</p>
          <p className="text-sm">Sunday | 10:30 AM to 12:00 PM</p>
        </div>
        <div>
          <p className="text-sm">
            &copy; 2025 First Baptist of Fenton. All Rights Reserved.
          </p>
          <p className="text-xs mt-1">
            Web Design | De Jesus Digital Solutions
          </p>
          <p className="text-xs mt-1">
            First Baptist Church Fenton, Fenton, Michigan.
          </p>
        </div>
      </div>
    </footer>
  );
}
