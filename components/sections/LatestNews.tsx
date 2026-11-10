import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

// Sample news data - will be replaced with database content
const newsItems = [
  {
    id: 1,
    title: 'Municipal Board Approves New Development Projects',
    excerpt: 'The Iten Municipal Board has approved several infrastructure development projects aimed at improving urban services...',
    category: 'Development',
    date: new Date('2026-11-08'),
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'
  },
  {
    id: 2,
    title: 'Public Participation Forum on Urban Planning',
    excerpt: 'Residents are invited to participate in the upcoming public forum on the Iten Municipality Urban Development Plan...',
    category: 'Community',
    date: new Date('2026-11-05'),
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
  },
  {
    id: 3,
    title: 'Iten Municipality Hosts International Athletics Delegation',
    excerpt: 'A delegation of international athletics coaches visited Iten to explore training facility partnerships...',
    category: 'Sports',
    date: new Date('2026-11-02'),
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800'
  }
]

export default function LatestNews() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="heading-md mb-2">
              Latest News & Updates
            </h2>
            <p className="text-gray-600">
              Stay informed about municipal developments and community events
            </p>
          </div>
          <Link 
            href="/publications?category=news" 
            className="hidden md:flex items-center text-navy hover:text-navy-700 font-medium"
          >
            View All News
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <article key={news.id} className="publication-card group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="responsive-img group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="card-body">
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <span className="badge-primary">{news.category}</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(news.date, 'MMM dd, yyyy')}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-navy transition-colors">
                  <Link href={`/publications/${news.id}`}>
                    {news.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {news.excerpt}
                </p>
                <Link 
                  href={`/publications/${news.id}`}
                  className="text-navy hover:text-navy-700 font-medium text-sm flex items-center"
                >
                  Read More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/publications?category=news" className="btn-primary">
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}
