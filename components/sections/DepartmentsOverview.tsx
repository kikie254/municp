import Link from 'next/link'
import { 
  Building2, 
  Coins, 
  PencilRuler, 
  Briefcase, 
  Leaf, 
  Hammer, 
  Droplet, 
  Users 
} from 'lucide-react'

const departments = [
  {
    icon: Building2,
    name: 'Administration & HR',
    description: 'Personnel management and administrative services',
    href: '/departments/administration'
  },
  {
    icon: Coins,
    name: 'Finance & Accounting',
    description: 'Financial management and revenue collection',
    href: '/departments/finance'
  },
  {
    icon: PencilRuler,
    name: 'Planning & Development',
    description: 'Urban planning and development control',
    href: '/departments/planning'
  },
  {
    icon: Briefcase,
    name: 'Revenue & Licensing',
    description: 'Business permits and revenue services',
    href: '/departments/revenue'
  },
  {
    icon: Leaf,
    name: 'Public Health & Environment',
    description: 'Health services and environmental management',
    href: '/departments/health'
  },
  {
    icon: Hammer,
    name: 'Infrastructure & Works',
    description: 'Roads, drainage and public infrastructure',
    href: '/departments/infrastructure'
  },
  {
    icon: Droplet,
    name: 'Water & Sanitation',
    description: 'Water supply and sanitation services',
    href: '/departments/water'
  },
  {
    icon: Users,
    name: 'Community Services',
    description: 'Social services and community development',
    href: '/departments/community'
  }
]

export default function DepartmentsOverview() {
  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            Our Departments
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dedicated teams working together to deliver quality municipal services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon
            return (
              <Link 
                key={dept.name}
                href={dept.href}
                className="card hover:scale-105 transition-transform"
              >
                <div className="card-body text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-navy" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {dept.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/departments" className="btn-primary">
            View All Departments
          </Link>
        </div>
      </div>
    </section>
  )
}
