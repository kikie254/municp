'use client'

import { Metadata } from 'next'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    
    // Simulate form submission
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-navy text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-lg mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white/90">
              We're here to serve you. Reach out with your questions, feedback, or service requests.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="heading-sm mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {/* Office Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Visit Us</h3>
                    <p className="text-gray-600">
                      Iten Municipality Offices<br />
                      Main Street<br />
                      Iten Town<br />
                      Elgeyo Marakwet County<br />
                      Kenya
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Call Us</h3>
                    <p className="text-gray-600">
                      Main Office: [Phone Number]<br />
                      Mobile: [Mobile Number]<br />
                      Emergency: [Emergency Number]
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Email Us</h3>
                    <p className="text-gray-600">
                      General Inquiries:<br />
                      <a href="mailto:info@iten.go.ke" className="text-navy hover:underline">
                        info@iten.go.ke
                      </a>
                      <br />
                      <br />
                      Municipal Manager:<br />
                      <a href="mailto:manager@iten.go.ke" className="text-navy hover:underline">
                        manager@iten.go.ke
                      </a>
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday:<br />
                      8:00 AM - 5:00 PM<br />
                      <br />
                      Saturday:<br />
                      8:00 AM - 12:00 PM<br />
                      <br />
                      Sunday & Public Holidays:<br />
                      Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-body">
                  <h2 className="heading-sm mb-6">Send us a Message</h2>
                  
                  {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                      Thank you for contacting us! We'll respond to your inquiry as soon as possible.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="label">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="label">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="label">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="label">Subject *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="input"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="services">Municipal Services</option>
                          <option value="licensing">Licensing & Permits</option>
                          <option value="complaint">Complaint/Feedback</option>
                          <option value="development">Development Projects</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="label">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="textarea"
                        placeholder="Please provide details of your inquiry..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full md:w-auto"
                    >
                      {status === 'sending' ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-sm bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-sm text-center mb-8">Find Us on the Map</h2>
          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">
              [Interactive map will be embedded here - Google Maps or similar]
            </p>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="section">
        <div className="container-custom">
          <h2 className="heading-sm text-center mb-8">Department Contacts</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Need to reach a specific department? View our complete directory of municipal departments 
            and their contact information.
          </p>
          <div className="text-center">
            <a href="/departments" className="btn-primary">
              View All Departments
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
