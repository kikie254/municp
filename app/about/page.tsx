import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Iten Municipality',
  description: 'Learn about Iten Municipality, its history, governance, and commitment to serving the community of Elgeyo Marakwet County.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-navy text-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="heading-lg mb-6">
              About Iten Municipality
            </h1>
            <p className="text-xl text-white/90">
              Committed to excellence in service delivery and sustainable development 
              for the people of Iten and surrounding communities.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="section-sm bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Calendar className="w-8 h-8 text-navy" />
              </div>
              <div className="font-bold text-2xl text-navy mb-1">[Charter Year]</div>
              <div className="text-gray-600">Municipality Established</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <MapPin className="w-8 h-8 text-navy" />
              </div>
              <div className="font-bold text-2xl text-navy mb-1">[Area] km²</div>
              <div className="text-gray-600">Coverage Area</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Users className="w-8 h-8 text-navy" />
              </div>
              <div className="font-bold text-2xl text-navy mb-1">[Population]</div>
              <div className="text-gray-600">Residents Served</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Award className="w-8 h-8 text-navy" />
              </div>
              <div className="font-bold text-2xl text-navy mb-1">World Class</div>
              <div className="text-gray-600">Home of Champions</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose-custom space-y-6">
              <h2 className="heading-sm mb-4">Municipal Overview</h2>
              <p>
                Iten Municipality is a dynamic urban center within the County Government of Elgeyo Marakwet, 
                Kenya. Located in the scenic Rift Valley highlands at an elevation of approximately 2,400 
                meters (7,900 feet) above sea level, Iten has earned international recognition as the 
                "Home of Champions" for producing world-class long-distance runners.
              </p>
              <p>
                The municipality was formally chartered by the County Government of Elgeyo Marakwet, marking 
                a significant milestone in our administrative evolution and capacity to deliver enhanced 
                services to our residents. As a municipality, we exercise devolved functions and powers as 
                provided for in the Constitution of Kenya 2010 and the County Governments Act.
              </p>

              <h2 className="heading-sm mb-4 mt-8">Governance Structure</h2>
              <p>
                Iten Municipality operates under the framework established by the County Government of 
                Elgeyo Marakwet. Our governance structure includes:
              </p>
              <ul>
                <li>
                  <strong>Municipal Board:</strong> Provides policy direction and strategic oversight
                </li>
                <li>
                  <strong>Municipal Manager:</strong> Chief Executive Officer responsible for day-to-day 
                  administration and implementation of board decisions
                </li>
                <li>
                  <strong>Municipal Departments:</strong> Specialized teams delivering various municipal 
                  services
                </li>
                <li>
                  <strong>Community Participation Forums:</strong> Platforms for public engagement in 
                  municipal affairs
                </li>
              </ul>

              <h2 className="heading-sm mb-4 mt-8">Service Mandate</h2>
              <p>
                Our mandate encompasses a wide range of municipal functions aimed at improving the quality 
                of life for all residents:
              </p>
              <ul>
                <li>Urban planning and development control</li>
                <li>Infrastructure development and maintenance</li>
                <li>Revenue collection and financial management</li>
                <li>Public health and environmental sanitation</li>
                <li>Waste management services</li>
                <li>Water and sanitation services coordination</li>
                <li>Business licensing and regulation</li>
                <li>Community development and social services</li>
                <li>Municipal facilities management</li>
                <li>Public participation and civic engagement</li>
              </ul>

              <h2 className="heading-sm mb-4 mt-8">Strategic Focus Areas</h2>
              <p>
                Iten Municipality is committed to sustainable development across several key areas:
              </p>
              <ul>
                <li>
                  <strong>Infrastructure Development:</strong> Modern roads, drainage systems, and public 
                  facilities
                </li>
                <li>
                  <strong>Economic Development:</strong> Supporting local businesses and attracting 
                  investment
                </li>
                <li>
                  <strong>Sports & Tourism:</strong> Leveraging our athletics heritage for economic benefit
                </li>
                <li>
                  <strong>Environmental Sustainability:</strong> Protecting our natural resources and 
                  promoting green initiatives
                </li>
                <li>
                  <strong>Service Excellence:</strong> Efficient, transparent, and citizen-centered service 
                  delivery
                </li>
              </ul>

              <h2 className="heading-sm mb-4 mt-8">Our Commitment</h2>
              <p>
                We are committed to building a municipality that serves all residents with integrity, 
                efficiency, and transparency. Through strategic planning, prudent financial management, 
                and meaningful community engagement, we aim to create an environment where families thrive, 
                businesses prosper, and our unique athletic heritage continues to inspire the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-sm text-center mb-8">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Link href="/about/vision-mission" className="card hover:scale-105 transition-transform">
              <div className="card-body text-center">
                <h3 className="font-bold mb-2">Vision & Mission</h3>
                <p className="text-sm text-gray-600">
                  Our guiding principles and strategic direction
                </p>
              </div>
            </Link>
            <Link href="/about/charter" className="card hover:scale-105 transition-transform">
              <div className="card-body text-center">
                <h3 className="font-bold mb-2">Municipal Charter</h3>
                <p className="text-sm text-gray-600">
                  Official charter and legal framework
                </p>
              </div>
            </Link>
            <Link href="/about/leadership" className="card hover:scale-105 transition-transform">
              <div className="card-body text-center">
                <h3 className="font-bold mb-2">Leadership</h3>
                <p className="text-sm text-gray-600">
                  Meet our municipal leadership team
                </p>
              </div>
            </Link>
            <Link href="/about/structure" className="card hover:scale-105 transition-transform">
              <div className="card-body text-center">
                <h3 className="font-bold mb-2">Structure</h3>
                <p className="text-sm text-gray-600">
                  Organizational structure and departments
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
