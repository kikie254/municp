import { Eye, Target, Heart } from 'lucide-react'

export default function VisionMissionSection() {
  return (
    <section className="section bg-navy text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-white mb-4">
            Our Vision, Mission & Values
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Guiding principles that direct our commitment to the people of Iten
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vision */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-white">Our Vision</h3>
            <p className="text-white/90 text-center">
              To be a world-class municipality with high quality of life, sustainable development, 
              and a thriving community that celebrates our athletic heritage and economic potential.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-white">Our Mission</h3>
            <p className="text-white/90 text-center">
              To enhance the livelihoods of households through integration of socio-economic development, 
              environmental protection, and inclusive, effective service delivery for all residents.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-white">Core Values</h3>
            <ul className="text-white/90 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                <span>Integrity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                <span>Transparency</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                <span>Efficiency</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                <span>Innovation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                <span>Inclusivity</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
