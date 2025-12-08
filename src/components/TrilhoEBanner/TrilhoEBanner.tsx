import { SportRail } from '../SportRail'
import { BannerCarousel } from '../BannerCarousel'
import './TrilhoEBanner.css'

export function TrilhoEBanner() {
  return (
    <section className="trilho-e-banner">
      <SportRail />
      <BannerCarousel />
    </section>
  )
}

