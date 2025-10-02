import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Menu', href: '/menu/ala-carte', icon: '📋' },
    { label: 'Reserveren', href: '/contact/reserveren', icon: '📞' },
    { label: 'Locatie', href: '/contact/locatie', icon: '📍' },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50"
    >
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close menu"
        >
          ✕
        </button>
        
        <nav className="mt-8">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 p-4 rounded-lg text-lg font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Quick contact info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Direct Contact</h3>
          <a
            href="tel:013480139"
            className="block text-lg font-medium text-black hover:text-gray-700 mb-2"
          >
            013 480 139
          </a>
          <a
            href="mailto:info@bistro-bert.be"
            className="block text-black hover:text-gray-700"
          >
            info@bistro-bert.be
          </a>
        </div>
        
        {/* Opening hours */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Openingstijden</h3>
          <p className="text-black">
            Dinsdag - Zondag: 18:00 - 22:00
          </p>
          <p className="text-gray-600 text-sm">
            Maandag gesloten
          </p>
        </div>
      </div>
    </motion.div>
  );
}