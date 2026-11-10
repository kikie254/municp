import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative h-[600px] lg:h-[700px] flex items-center">
      {/* Background Image - Replace with actual Iten landscape photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564769625392-651b2f6e6e9b?q=80&w=2000')`,
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              County Government of Elgeyo Marakwet
            </span>
          </div>
          
          <h1 className="heading-xl text-white mb-6">
            ITEN MUNICIPALITY
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/95 mb-8 font-medium">
            A Town of Choice for Sports, Tourism and Investment
          </p>
          
          <p className="text-lg text-white/90 mb-10 max-w-2xl">
            Welcome to the official website of Iten Municipality, home of world-class athletes 
            and a hub of economic opportunity in the heart of the Kenyan highlands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/about" className="btn-primary">
              About Iten Municipality
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/publications" className="btn-secondary">
              Latest Publications
            </Link>
            <Link href="/discover" className="btn-accent">
              Discover Iten
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
