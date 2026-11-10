import { Metadata } from 'next'
import { Eye, Target, Heart, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vision, Mission & Core Values',
  description: 'Discover the vision, mission, and core values that guide Iten Municipality in serving our community.',
}

export default function VisionMissionPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-navy to-navy-700 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-lg mb-6">
              Our Vision, Mission & Core Values
            </h1>
            <p className="text-xl text-white/90">
              Guiding principles that shape our commitment to excellence and community service
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-navy" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="heading-sm mb-4">Our Vision</h2>
                <div className="bg-navy-50 p-8 rounded-lg">
                  <p className="text-xl text-gray-800 italic font-medium">
                    "To be a world-class municipality with high quality of life, sustainable development, 
                    and a thriving community that celebrates our athletic heritage and economic potential."
                  </p>
                </div>
                <div className="mt-6 prose-custom">
                  <p>
                    Our vision reflects our aspiration to create a municipality that serves as a model of 
                    excellence in Kenya and beyond. We envision Iten as a place where:
                  </p>
                  <ul>
                    <li>Every resident enjoys a high quality of life with access to quality services</li>
                    <li>Economic opportunities abound for businesses and entrepreneurs</li>
                    <li>Our unique athletics heritage is preserved and leveraged for community benefit</li>
                    <li>Sustainable development practices protect our environment for future generations</li>
                    <li>Transparent governance builds trust and accountability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center">
                  <Target className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="heading-sm mb-4">Our Mission</h2>
                <div className="bg-accent-50 p-8 rounded-lg">
                  <p className="text-xl text-gray-800 italic font-medium">
                    "To enhance the livelihoods of households through integration of socio-economic development, 
                    environmental protection, and inclusive, effective service delivery for all residents."
                  </p>
                </div>
                <div className="mt-6 prose-custom">
                  <p>
                    Our mission statement defines our purpose and approach to serving the community. We achieve 
                    this mission through:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <strong>Socio-Economic Development:</strong> Supporting business growth, creating 
                        employment opportunities, and improving living standards
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <strong>Environmental Protection:</strong> Sustainable waste management, green spaces, 
                        and conservation initiatives
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <strong>Inclusive Service Delivery:</strong> Ensuring all residents have equal access 
                        to municipal services
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <strong>Effective Governance:</strong> Transparent, efficient, and accountable 
                        administration
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="heading-sm mb-6">Our Core Values</h2>
                <p className="text-gray-600 mb-8">
                  These fundamental principles guide our decisions, actions, and interactions with the community:
                </p>
                
                <div className="space-y-6">
                  {/* Integrity */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-navy">
                    <h3 className="text-xl font-bold text-navy mb-3">Integrity</h3>
                    <p className="text-gray-700">
                      We uphold the highest standards of honesty, ethics, and moral principles in all our 
                      operations. We are accountable for our actions and maintain transparency in our 
                      dealings with the public.
                    </p>
                  </div>

                  {/* Transparency */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-navy">
                    <h3 className="text-xl font-bold text-navy mb-3">Transparency</h3>
                    <p className="text-gray-700">
                      We believe in open governance and making information accessible to the public. Our 
                      decisions, processes, and financial management are conducted with full disclosure and 
                      accountability to the community we serve.
                    </p>
                  </div>

                  {/* Efficiency */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent">
                    <h3 className="text-xl font-bold text-accent mb-3">Efficiency</h3>
                    <p className="text-gray-700">
                      We optimize our resources and processes to deliver maximum value to residents. Through 
                      streamlined operations and modern technology, we ensure timely and cost-effective 
                      service delivery.
                    </p>
                  </div>

                  {/* Innovation */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent">
                    <h3 className="text-xl font-bold text-accent mb-3">Innovation</h3>
                    <p className="text-gray-700">
                      We embrace new ideas, technologies, and approaches to improve our services. We encourage 
                      creative problem-solving and continuous improvement in all aspects of municipal 
                      operations.
                    </p>
                  </div>

                  {/* Inclusivity */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-red-600 mb-3">Inclusivity</h3>
                    <p className="text-gray-700">
                      We recognize and respect the diversity of our community. We ensure that all residents, 
                      regardless of background, have equal access to municipal services and opportunities to 
                      participate in municipal affairs.
                    </p>
                  </div>

                  {/* Public Participation */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-red-600 mb-3">Public Participation</h3>
                    <p className="text-gray-700">
                      We value the input and involvement of our residents in decision-making processes. Through 
                      forums, consultations, and feedback mechanisms, we ensure that the community's voice 
                      shapes our priorities and actions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Live Our Values */}
      <section className="section bg-navy text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-sm text-white mb-6">Living Our Values Daily</h2>
            <p className="text-white/90 text-lg mb-12">
              These values are not just words—they guide every action we take and every decision we make 
              in service to the Iten community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-white/90">Commitment to transparency in all operations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-white/90">Dedication to serving our community</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-3xl font-bold mb-2">Every Voice</div>
                <div className="text-white/90">Matters in our decision-making process</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
