import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, X } from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Menukaart', href: '/menu', icon: '📋' },
    { label: 'Over ons', href: '/over-ons', icon: 'ℹ️' },
    { label: 'Reserveren', href: '/contact', icon: '📞' },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black/60 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Navigation Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 mobile-nav-container"
      >
        <div className="h-full flex flex-col mobile-menu" style={{ padding: '24px' }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="self-end p-4 rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-burgundy focus:ring-offset-2 md:p-3"
            aria-label="Sluit menu"
          >
            <X className="w-8 h-8 md:w-6 md:h-6" />
          </button>
          
          {/* Navigation Items */}
          <nav className="mt-8 flex-1">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`mobile-nav-item flex items-center space-x-4 p-4 rounded-xl font-serif text-lg font-medium transition-all ${
                      pathname === item.href
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 active:scale-98'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Contact Information */}
          <div className="space-y-4 mt-8">
            {/* Quick Contact */}
            <div>
              <h3 className="font-semibold mb-3 font-serif text-lg">Direct Contact</h3>
              <div className="space-y-3">
                <a
                  href="tel:+3213480139"
                  className="flex items-center space-x-3 text-lg font-medium text-black hover:text-burgundy transition-colors mobile-nav-item"
                >
                  <Phone className="w-5 h-5 text-burgundy" />
                  <span>+32 13 48 01 39</span>
                </a>
                <a
                  href="mailto:info@bistro-bert.be"
                  className="flex items-center space-x-3 text-black hover:text-burgundy transition-colors mobile-nav-item"
                >
                  <Mail className="w-5 h-5 text-burgundy" />
                  <span>info@bistro-bert.be</span>
                </a>
              </div>
            </div>
            
            {/* Opening Hours */}
            <div>
              <h3 className="font-semibold mb-3 font-serif text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-burgundy" />
                Openingstijden
              </h3>
              <p className="text-black font-medium">
                Dinsdag–Zondag
              </p>
              <p className="text-burgundy font-semibold">
                10:00 - 22:00
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Maandag gesloten
              </p>
            </div>
            
            {/* Address */}
            <div>
              <h3 className="font-semibold mb-3 font-serif text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-burgundy" />
                Adres
              </h3>
              <p className="text-black">
                Verboekt 121<br />
                2430 Laakdal<br />
                België
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}