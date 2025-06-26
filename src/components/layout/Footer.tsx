import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Church Logo and Name */}
          <div className="footer-section">
            <Link href="/" className="footer-logo">
              <Image
                src="/logo.svg"
                alt="First Baptist Church of Fenton Logo"
                width={56}
                height={56}
                className="h-14 w-14"
              />
              <div className="footer-logo-text">
                <span className="footer-logo-primary">First Baptist</span>
                <span className="footer-logo-secondary">Church of Fenton</span>
              </div>
            </Link>
            <p className="footer-description">
              A community of faith, hope, and love in the heart of Fenton.
            </p>
            
            {/* Social Media Links */}
            <div className="footer-social">
              <Link 
                href="https://www.facebook.com/pg/FBCfenton" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Visit our Facebook page (opens in new tab)"
              >
                <Facebook className="footer-social-icon" />
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCo8E0MoXuz_E5BvaROleSDQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Visit our YouTube channel (opens in new tab)"
              >
                <Youtube className="footer-social-icon" />
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Information</h3>
            <div className="space-y-2">
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span>860 N. Leroy St., Fenton, MI 48430</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span>810.629.9427</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span>hello@firstbaptistchurch.org</span>
              </div>
            </div>
          </div>

          {/* Office Schedule */}
          <div className="space-y-3 text-center">
            <h3 className="text-md font-semibold mb-3 flex items-center justify-center">
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
          <div className="space-y-3 text-center">
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
