'use client'

import Link from 'next/link'

export default function MinimalFooter() {
  const contactInfo = {
    address: 'Verboekt 121, 2430 Laakdal',
    phone: '013 480 139',
    email: 'info@bistro-bert.be'
  }

  return (
    <footer className="bg-black text-white py-32">
      <div className="container-dh">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Restaurant Name */}
          <div>
            <h2 className="text-[2.5rem] font-light mb-8 leading-[0.9]">Bistro Bert</h2>
            <p className="text-gray-400 text-[1rem] leading-relaxed max-w-md">
              Modern French cuisine in the heart of Laakdal.
            </p>
          </div>

          {/* Contact & Navigation */}
          <div>
            <div className="space-y-8">
              {/* Contact */}
              <div>
                <h3 className="text-[0.85rem] tracking-[0.2em] uppercase text-gray-400 mb-6">
                  Contact
                </h3>
                <div className="space-y-3">
                  <div className="text-gray-300 text-[1rem]">
                    {contactInfo.address}
                  </div>
                  <div>
                    <a
                      href={`tel:${contactInfo.phone.replace(new RegExp('[^\\d+]', 'g'), '')}`}
                      className="text-gray-300 hover:text-white transition-colors text-[1rem]"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-300 hover:text-white transition-colors text-[1rem]"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-[0.85rem] tracking-[0.2em] uppercase text-gray-400 mb-6">
                  Navigation
                </h3>
                <nav className="space-y-3">
                  <Link
                    href="/menu"
                    className="block text-gray-300 hover:text-white transition-colors text-[1rem]"
                  >
                    Menu
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-300 hover:text-white transition-colors text-[1rem]"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Ultra minimal */}
        <div className="mt-24 pt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="text-gray-500 text-[0.85rem]">
              © {new Date().getFullYear()} Bistro Bert. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}