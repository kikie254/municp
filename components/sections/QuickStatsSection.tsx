import { Users, MapPin, Building, Trophy } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '[Population]',
    label: 'Population',
    description: 'Residents served'
  },
  {
    icon: MapPin,
    value: '[Area] km²',
    label: 'Coverage Area',
    description: 'Square kilometers'
  },
  {
    icon: Building,
    value: '8+',
    label: 'Departments',
    description: 'Service departments'
  },
  {
    icon: Trophy,
    value: 'World Class',
    label: 'Athletics Hub',
    description: 'Home of Champions'
  }
]

export default function QuickStatsSection() {
  return (
    <section className="section-sm bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-navy" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
