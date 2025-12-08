import { Header } from '../../components/Header'
import { TrilhoEBanner } from '../../components/TrilhoEBanner'
import { ContentTabs } from '../../components/ContentTabs'
import { PromotionSection } from '../../components/PromotionSection'
import { OffersSection } from '../../components/OffersSection'
import { LiveSection } from '../../components/LiveSection'
import { EscadinhaSection } from '../../components/EscadinhaSection'
import { PreMatchSection } from '../../components/PreMatchSection'
import { WinningNowSection } from '../../components/WinningNowSection'
import './Home.css'

export function Home() {
  return (
    <div className="home">
      <Header />
      <TrilhoEBanner />
      <ContentTabs />
      <PromotionSection />
      <OffersSection />
      <LiveSection />
      <EscadinhaSection />
      <PreMatchSection />
      <WinningNowSection />
      
      {/* Outros componentes serão adicionados aqui */}
      <main className="home__content">
        {/* Placeholder para próximos componentes */}
      </main>
    </div>
  )
}

