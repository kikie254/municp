import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Building2, 
  Coins, 
  PencilRuler, 
  Briefcase, 
  Leaf, 
  Hammer, 
  Droplet, 
  Users,
  Phone,
  Mail
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Municipal Departments',
  description: 'Explore the departments of Iten Municipality and the services they provide to our community.',
}

const departments = [
  {
    id: 'administration',
    icon: Building2,
    name: 'Administration & Human Resources',
    description: 'Personnel management, staff development, and general administrative services',
    functions: [
      'Human resource management and development',
      'Staff recruitment and training',
      'Administrative coordination',
      'Office management',
      'Records management',
      'Policy implementation'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'administration@iten.go.ke'
    }
  },
  {
    id: 'finance',
    icon: Coins,
    name: 'Finance & Accounting',
    description: 'Financial management, budgeting, revenue collection, and fiscal reporting',
    functions: [
      'Budget preparation and management',
      'Revenue collection and accounting',
      'Financial reporting and auditing',
      'Procurement and supply chain management',
      'Asset management',
      'Expenditure control'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'finance@iten.go.ke'
    }
  },
  {
    id: 'planning',
    icon: PencilRuler,
    name: 'Planning & Development',
    description: 'Urban planning, development control, and spatial planning services',
    functions: [
      'Urban and spatial planning',
      'Development control and approvals',
      'Building plan approvals',
      'Strategic planning',
      'Project planning and monitoring',
      'GIS and mapping services'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'planning@iten.go.ke'
    }
  },
  {
    id: 'revenue',
    icon: Briefcase,
    name: 'Revenue & Licensing',
    description: 'Business permits, licenses, and revenue administration',
    functions: [
      'Business permits and licenses',
      'Trade licenses issuance',
      'Market fee collection',
      'Parking fee administration',
      'Revenue enforcement',
      'Taxpayer services'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'revenue@iten.go.ke'
    }
  },
  {
    id: 'health',
    icon: Leaf,
    name: 'Public Health & Environment',
    description: 'Public health services, environmental management, and sanitation',
    functions: [
      'Public health promotion',
      'Environmental health inspections',
      'Waste management coordination',
      'Food safety and hygiene',
      'Disease prevention and control',
      'Environmental conservation'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'health@iten.go.ke'
    }
  },
  {
    id: 'infrastructure',
    icon: Hammer,
    name: 'Infrastructure & Public Works',
    description: 'Roads, drainage, public buildings, and infrastructure development',
    functions: [
      'Road construction and maintenance',
      'Drainage system development',
      'Public building construction',
      'Infrastructure project management',
      'Street lighting',
      'Municipal facilities maintenance'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'infrastructure@iten.go.ke'
    }
  },
  {
    id: 'water',
    icon: Droplet,
    name: 'Water & Sanitation',
    description: 'Water supply coordination and sanitation services',
    functions: [
      'Water supply coordination',
      'Sanitation services',
      'Sewerage system management',
      'Water quality monitoring',
      'Public toilet management',
      'Storm water management'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'water@iten.go.ke'
    }
  },
  {
    id: 'community',
    icon: Users,
    name: 'Community Services',
    description: 'Social services, community development, and civic engagement',
    functions: [
      'Community development programs',
      'Social services coordination',
      'Sports and recreation',
      'Cultural activities',
      'Youth empowerment',
      'Public participation facilitation'
    ],
    contact: {
      phone: '[Department Phone]',
      email: 'community@iten.go.ke'
    }
  }
]

export default function DepartmentsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-navy text-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="heading-lg mb-6">
              Municipal Departments
            </h1>
            <p className="text-xl text-white/90">
              Dedicated teams working together to deliver quality services and drive 
              sustainable development for our community.
            </p>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="section">
        <div className="container-custom">
          <div className="space-y-12">
            {departments.map((dept, index) => {
              const Icon = dept.icon
              const isEven = index % 2 === 0
              
              return (
                <div 
                  key={dept.id}
                  className={`card ${isEven ? 'md:ml-0' : 'md:ml-auto'} md:max-w-5xl`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                    {/* Icon and Title */}
                    <div className="md:col-span-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
                            <Icon className="w-8 h-8 text-navy" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-navy mb-2">
                            {dept.name}
                          </h2>
                          <p className="text-gray-600">
                            {dept.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Functions */}
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-lg mb-3">Key Functions:</h3>
                      <ul className="space-y-2">
                        {dept.functions.map((func, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-navy mt-2 flex-shrink-0"></span>
                            <span>{func}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-bold text-lg mb-4">Contact Department</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Phone</div>
                            <div className="font-medium">{dept.contact.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Email</div>
                            <a 
                              href={`mailto:${dept.contact.email}`}
                              className="font-medium text-navy hover:text-navy-700"
                            >
                              {dept.contact.email}
                            </a>
                          </div>
                        </div>
                      </div>
                      <Link 
                        href={`/departments/${dept.id}`}
                        className="btn-primary w-full mt-4"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* General Contact */}
      <section className="section bg-navy text-white">
        <div className="container-custom text-center">
          <h2 className="heading-sm text-white mb-4">
            Need Help Finding the Right Department?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Contact our main reception and we'll direct you to the appropriate department 
            for your needs.
          </p>
          <Link href="/contact" className="btn btn-secondary">
            Contact Municipal Office
          </Link>
        </div>
      </section>
    </div>
  )
}
