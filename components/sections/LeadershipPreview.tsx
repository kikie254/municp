import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function LeadershipPreview() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            Municipal Leadership
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated team leading Iten Municipality towards excellence in service delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          {/* Municipal Manager */}
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
              {/* Placeholder - Replace with actual photo */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">Photo</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">[Municipal Manager Name]</h3>
            <p className="text-accent font-medium mb-2">Municipal Manager</p>
            <p className="text-gray-600 text-sm">
              Leading strategic planning and operational excellence
            </p>
          </div>

          {/* Board Chair */}
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
              {/* Placeholder - Replace with actual photo */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">Photo</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">[Board Chair Name]</h3>
            <p className="text-accent font-medium mb-2">Municipal Board Chair</p>
            <p className="text-gray-600 text-sm">
              Providing governance oversight and strategic direction
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/about/leadership" className="btn-primary">
            Meet the Full Leadership Team
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
