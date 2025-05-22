export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary/30 text-primary-foreground py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {currentYear} First Baptist of Fenton. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          First Baptist Church Fenton, Fenton, Michigan.
        </p>
      </div>
    </footer>
  );
}
