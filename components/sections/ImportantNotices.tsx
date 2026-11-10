import Link from 'next/link'
import { AlertCircle, Calendar, FileText, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

// Sample notices - will be replaced with database content
const notices = [
  {
    id: 1,
    title: 'Tender Notice: Road Maintenance and Rehabilitation',
    type: 'Tender',
    date: new Date('2026-11-09'),
    deadline: new Date('2026-11-30'),
    urgent: true
  },
  {
    id: 2,
    title: 'Public Notice: Business License Renewal Deadline',
    type: 'Public Notice',
    date: new Date('2026-11-08'),
    deadline: new Date('2026-12-15'),
    urgent: false
  },
  {
    id: 3,
    title: 'Tender: Supply and Delivery of Office Equipment',
    type: 'Tender',
    date: new Date('2026-11-05'),
    deadline: new Date('2026-11-25'),
    urgent: true
  }
]

export default function ImportantNotices() {
  return (
    <section className="section bg-amber-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="heading-md mb-2">
              Important Notices
            </h2>
            <p className="text-gray-600">
              Public notices, tenders, and official announcements
            </p>
          </div>
          <Link 
            href="/publications?category=notices" 
            className="hidden md:flex items-center text-navy hover:text-navy-700 font-medium"
          >
            View All Notices
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {notices.map((notice) => (
            <div 
              key={notice.id} 
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    {notice.urgent && (
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <Link 
                        href={`/publications/${notice.id}`}
                        className="font-bold text-lg text-gray-900 hover:text-navy transition-colors"
                      >
                        {notice.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {notice.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted: {format(notice.date, 'MMM dd, yyyy')}
                        </span>
                        {notice.deadline && (
                          <span className="font-medium text-red-600">
                            Deadline: {format(notice.deadline, 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/publications/${notice.id}`}
                  className="btn-secondary whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/publications?category=tenders" className="btn-accent">
            View All Tenders
          </Link>
        </div>
      </div>
    </section>
  )
}
