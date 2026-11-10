'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'About Us', 
    href: '/about',
    submenu: [
      { name: 'About Iten Municipality', href: '/about' },
      { name: 'Vision & Mission', href: '/about/vision-mission' },
      { name: 'Municipal Charter', href: '/about/charter' },
      { name: 'Leadership', href: '/about/leadership' },
      { name: 'Organizational Structure', href: '/about/structure' },
    ]
  },
  { name: 'Departments', href: '/departments' },
  { name: 'Development', href: '/development' },
  { 
    name: 'Publications', 
    href: '/publications',
    submenu: [
      { name: 'All Publications', href: '/publications' },
      { name: 'News & Updates', href: '/publications?category=news' },
      { name: 'Public Notices', href: '/publications?category=notices' },
      { name: 'Tenders', href: '/publications?category=tenders' },
      { name: 'Reports', href: '/publications?category=reports' },
    ]
  },
  { name: 'Discover Iten', href: '/discover' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-navy-800 text-white/80 text-sm">
        <div className="container-custom py-2">
          <div className="flex justify-between items-center">
            <div className="hidden md:block">
              <span className="mr-4">📞 [Official Phone]</span>
              <span>✉️ info@iten.go.ke</span>
            </div>
            <div className="flex gap-4">
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <nav className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-navy">IM</span>
            </div>
            <div className="hidden lg:block">
              <div className="text-white font-bold text-lg leading-tight">
                ITEN MUNICIPALITY
              </div>
              <div className="text-white/80 text-sm">
                County Government of Elgeyo Marakwet
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                  onMouseEnter={() => item.submenu && setOpenSubmenu(item.name)}
                >
                  <span className="flex items-center gap-1">
                    {item.name}
                    {item.submenu && <ChevronDown className="w-4 h-4" />}
                  </span>
                </Link>
                
                {/* Dropdown Menu */}
                {item.submenu && (
                  <div
                    className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2"
                    onMouseLeave={() => setOpenSubmenu(null)}
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-700">
          <div className="container-custom py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-md text-white ${
                    isActive(item.href) ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => !item.submenu && setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
