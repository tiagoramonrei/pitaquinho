import { useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { TrilhoEBanner } from '../../components/TrilhoEBanner'
import { ContentTabs } from '../../components/ContentTabs'
import { PromotionSection } from '../../components/PromotionSection'
import { OffersSection } from '../../components/OffersSection'
import { LiveSection } from '../../components/LiveSection'
import { EscadinhaSection } from '../../components/EscadinhaSection'
import { PreMatchSection } from '../../components/PreMatchSection'
import { TreasureSection } from '../../components/TreasureSection'
import { WinningNowSection } from '../../components/WinningNowSection'
import './Home.css'

export function Home() {
  const [isVariant2, setIsVariant2] = useState(false)
  const [isVariant3, setIsVariant3] = useState(false)

  useEffect(() => {
    // Detecta hash #v2, #/2 ou #v3, #/3 na URL
    const checkHash = () => {
      const hash = window.location.hash
      setIsVariant2(hash === '#v2' || hash === '#/2')
      setIsVariant3(hash === '#v3' || hash === '#/3')
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  return (
    <div className={`home ${isVariant3 ? '' : 'home--no-dividers'}`}>
      <Header />
      <TrilhoEBanner />
      <ContentTabs />
      {isVariant2 ? (
        <>
          <OffersSection />
          <PromotionSection />
        </>
      ) : (
        <>
      <PromotionSection />
      <OffersSection />
        </>
      )}
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

