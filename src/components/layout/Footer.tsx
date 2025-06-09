import Link from 'next/link';
import { Facebook, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

// FBC Logo component (copied from Header.tsx)
const FBCLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="0" y="0" width="22" height="22" rx="3" fill="#707C87"/> {/* Top-left grey */}
    <rect x="26" y="0" width="34" height="22" rx="3" fill="#707C87"/> {/* Top-right grey */}
    <rect x="0" y="26" width="22" height="34" rx="3" fill="#707C87"/> {/* Bottom-left grey */}
    <rect x="26" y="26" width="34" height="22" rx="3" fill="currentColor"/> {/* Bottom-right orange, inherits from text-accent class */}
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-primary/30 text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Church Logo and Name */}
          <div className="space-y-4 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-2 text-xl font-lora font-semibold text-primary-foreground hover:text-accent transition-colors">
              <FBCLogo className="h-8 w-8 text-accent" />
              <span>First Baptist Church of Fenton</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 max-w-xs">
              A community of faith, hope, and love in the heart of Fenton.
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center md:justify-start space-x-4">
              <Link 
                href="https://www.facebook.com/pg/FBCfenton" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-accent transition-colors"
                aria-label="Visit our Facebook page (opens in new tab)"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCo8E0MoXuz_E5BvaROleSDQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-accent transition-colors"
                aria-label="Visit our YouTube channel (opens in new tab)"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-md font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-sm flex items-center justify-center md:justify-start">
                <MapPin className="mr-2 h-4 w-4 text-accent/80" />
                860 N. Leroy St., Fenton, MI 48430
              </p>
              <p className="text-sm flex items-center justify-center md:justify-start">
                <Phone className="mr-2 h-4 w-4 text-accent/80" />
                810.629.9427
              </p>
              <p className="text-sm flex items-center justify-center md:justify-start">
                <Mail className="mr-2 h-4 w-4 text-accent/80" />
                hello@firstbaptistchurch.org
              </p>
            </div>
          </div>

          {/* Office Schedule */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-md font-semibold mb-3 flex items-center justify-center md:justify-start">
              <Clock className="mr-2 h-4 w-4 text-accent" />
              Office Schedule
            </h3>
            <div className="space-y-1">
              <p className="text-sm">Monday - Thursday</p>
              <p className="text-sm">10:00 AM to 4:00 PM</p>
              <p className="text-sm mt-2">Sunday</p>
              <p className="text-sm">10:30 AM to 12:00 PM</p>
            </div>
          </div>

          {/* Copyright and Credits */}
          <div className="space-y-3 text-center md:text-left">
            <div className="space-y-2">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} First Baptist Church of Fenton
              </p>
              <p className="text-sm">All Rights Reserved.</p>
              <p className="text-xs mt-3 text-primary-foreground/70">
                Website Created by{" "}
                <a 
                  href="https://dejesusdigitalsolutions.com" 
                  className="hover:underline hover:text-accent transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  De Jesus Digital Solutions
                </a>
              </p>
            </div>
          </div>

        </div>
        
        {/* Bottom border */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center">
          <p className="text-xs text-primary-foreground/70">
            First Baptist Church Fenton, Fenton, Michigan.
          </p>
        </div>
      </div>
    </footer>
  );
}
