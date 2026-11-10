import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Leadership', href: '/about/leadership' },
  { name: 'Departments', href: '/departments' },
  { name: 'Development Projects', href: '/development' },
]

const resources = [
  { name: 'Publications', href: '/publications' },
  { name: 'Tenders', href: '/publications?category=tenders' },
  { name: 'Public Notices', href: '/publications?category=notices' },
  { name: 'Reports & Documents', href: '/publications?category=reports' },
]

const services = [
  { name: 'Discover Iten', href: '/discover' },
  { name: 'Investment Opportunities', href: '/discover#investment' },
  { name: 'Tourism', href: '/discover#tourism' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Iten Municipality</h3>
            <p className="text-white/80 text-sm mb-4">
              County Government of Elgeyo Marakwet
            </p>
            <p className="text-white/70 text-sm mb-4">
              A Town of Choice for Sports, Tourism and Investment
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">
                  Iten Municipality Offices<br />
                  Iten Town, Kenya
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-white/80">[Official Phone]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@iten.go.ke" className="text-white/80 hover:text-white transition-colors">
                  info@iten.go.ke
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              {services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/70">
              Connect with us on social media
            </div>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/itenmunicipality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/itenmunicipality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/itenmunicipality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@itenmunicipality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-navy-900 border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <div>
              © {currentYear} Iten Municipality. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
