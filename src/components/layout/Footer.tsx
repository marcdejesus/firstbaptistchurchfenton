import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'Contact Information',
      items: [
        { icon: MapPin, text: '860 N. Leroy St., Fenton, MI 48430', href: 'https://goo.gl/maps/example' },
        { icon: Phone, text: '810.629.9427', href: 'tel:810-629-9427' },
        { icon: Mail, text: 'hello@firstbaptistchurch.org', href: 'mailto:hello@firstbaptistchurch.org' },
      ],
    },
    {
      title: 'Office Schedule',
      items: [
        { icon: Clock, text: 'Monday - Thursday: 10am - 4pm' },
        { icon: Clock, text: 'Sunday: 10:30am - 12pm' },
      ],
    },
  ];

  return (
    <footer className="footer bg-gray-800 text-white">
      <div className="footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="flex flex-wrap justify-between gap-8">

            {/* Church Logo and Social */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo.svg"
                  alt="First Baptist Church of Fenton Logo"
                  width={48}
                  height={48}
                />
                <div>
                  <span className="block font-bold text-lg">First Baptist</span>
                  <span className="block text-sm">Church of Fenton</span>
                </div>
              </Link>
              <p className="text-sm text-gray-400 mb-4">
                A community of faith, hope, and love.
              </p>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/pg/FBCfenton" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-6 w-6 hover:text-accent transition-colors" />
                </Link>
                <Link href="https://www.youtube.com/channel/UCo8E0MoXuz_E5BvaROleSDQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-6 w-6 hover:text-accent transition-colors" />
                </Link>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="w-full sm:w-1/2 md:w-1/3 lg:w-auto">
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.text} className="flex items-start">
                      <item.icon className="w-5 h-5 mr-3 mt-1 text-accent" />
                      {'href' in item && item.href ? (
                        <a href={item.href} className="hover:text-accent transition-colors text-sm">{item.text}</a>
                      ) : (
                        <span className="text-sm">{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} First Baptist Church of Fenton. All Rights Reserved.</p>
           <p className="text-xs mt-2">
                Website by <a href="https://dejesusdigitalsolutions.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">De Jesus Digital Solutions</a>
            </p>
        </div>
      </div>
    </footer>
  );
}
