import Link from 'next/link'
import { Trophy, Mountain, Building, Users } from 'lucide-react'

const highlights = [
  {
    icon: Trophy,
    title: 'Home of Champions',
    description: 'World-renowned high-altitude training center for elite athletes'
  },
  {
    icon: Mountain,
    title: 'Scenic Beauty',
    description: 'Breathtaking landscapes and perfect climate for tourism'
  },
  {
    icon: Building,
    title: 'Investment Hub',
    description: 'Growing economy with opportunities in tourism and sports industries'
  },
  {
    icon: Users,
    title: 'Welcoming Community',
    description: 'Rich cultural heritage and warm hospitality'
  }
]

export default function DiscoverItenPreview() {
  return (
    <section className="section bg-gradient-to-br from-accent-50 to-accent-100">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            Discover Iten
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Experience the town that has produced more world-class runners than anywhere else on Earth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent-100 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/discover" className="btn-accent">
            Explore Iten
          </Link>
          <Link href="/discover#tourism" className="btn-secondary">
            Tourism & Attractions
          </Link>
          <Link href="/discover#investment" className="btn-primary">
            Investment Opportunities
          </Link>
        </div>
      </div>
    </section>
  )
}
