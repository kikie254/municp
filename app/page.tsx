import HeroSection from '@/components/sections/HeroSection'
import WelcomeSection from '@/components/sections/WelcomeSection'
import QuickStatsSection from '@/components/sections/QuickStatsSection'
import VisionMissionSection from '@/components/sections/VisionMissionSection'
import LeadershipPreview from '@/components/sections/LeadershipPreview'
import LatestNews from '@/components/sections/LatestNews'
import ImportantNotices from '@/components/sections/ImportantNotices'
import DepartmentsOverview from '@/components/sections/DepartmentsOverview'
import DiscoverItenPreview from '@/components/sections/DiscoverItenPreview'
import ContactPreview from '@/components/sections/ContactPreview'

export default function Home() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <QuickStatsSection />
      <VisionMissionSection />
      <LeadershipPreview />
      <DepartmentsOverview />
      <LatestNews />
      <ImportantNotices />
      <DiscoverItenPreview />
      <ContactPreview />
    </>
  )
}
