import { Header } from '../../components/Header'
import { TrilhoEBanner } from '../../components/TrilhoEBanner'
import { ContentTabs } from '../../components/ContentTabs'
import { PromotionSection } from '../../components/PromotionSection'
import { PromotionSection02 } from '../../components/PromotionSection02'
import { OffersSection } from '../../components/OffersSection'
import { LiveSection } from '../../components/LiveSection'
import { EscadinhaSection } from '../../components/EscadinhaSection'
import { PreMatchSection } from '../../components/PreMatchSection'
import { TreasureSection } from '../../components/TreasureSection'
import { WinningNowSection } from '../../components/WinningNowSection'
import './Home.css'

interface HomeProps {
  version?: '01' | '02'
}

export function Home({ version = '01' }: HomeProps) {
  return (
    <div className="home">
      <Header />
      <TrilhoEBanner />
      <ContentTabs />
      {version === '01' ? <PromotionSection /> : <PromotionSection02 />}
      <OffersSection />
      <LiveSection />
      <EscadinhaSection />
      <PreMatchSection />
      <TreasureSection />
      <WinningNowSection />
      
      {/* Outros componentes serão adicionados aqui */}
      <main className="home__content">
        {/* Placeholder para próximos componentes */}
      </main>
    </div>
  )
}

