import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPreview() {
  return (
    <section className="section bg-navy text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-md text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-white/90 text-lg mb-8">
              We're here to serve you. Contact Iten Municipality for inquiries, feedback, 
              or assistance with municipal services.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Visit Us</h3>
                  <p className="text-white/80">
                    Iten Municipality Offices<br />
                    Iten Town, Elgeyo Marakwet County<br />
                    Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Call Us</h3>
                  <p className="text-white/80">
                    [Official Phone Number]<br />
                    [Alternative Number]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email Us</h3>
                  <p className="text-white/80">
                    info@iten.go.ke<br />
                    municipalmanager@iten.go.ke
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Office Hours</h3>
                  <p className="text-white/80">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 12:00 PM<br />
                    Sunday & Public Holidays: Closed
                  </p>
                </div>
              </div>
            </div>

            <Link href="/contact" className="btn btn-secondary">
              Contact Form & More Information
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Enquiry</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-secondary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
