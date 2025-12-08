import { useState, useRef, useEffect } from 'react'
import './BannerCarousel.css'

// Backgrounds
import bgMissao from '../../assets/bgMissao.png'
import bg1x2 from '../../assets/bg1x2.png'
import bgTorneio from '../../assets/bgTorneio.png'
import bgAumentada from '../../assets/bgAumentada.png'
import bgVirtuais from '../../assets/bgVirtuais.png'
import iconSaibaMais from '../../assets/iconSaibaMais.svg'
import iconBoostWhite from '../../assets/iconBoostWhite.svg'
import iconAumentada from '../../assets/iconAumentada.png'

interface Banner {
  id: number
  type: 'missao' | '1x2' | 'torneio' | 'aumentada' | 'virtuais'
  headerLeft: string
  headerRight: string
  showTimer?: boolean
  background: string
  title: string
  description: string
  buttonText?: string
  showInfoBtn?: boolean
  odds?: { team: string; value: string }[]
  oddBoosted?: { old: string; new: string }
}

const banners: Banner[] = [
  {
    id: 1,
    type: 'missao',
    headerLeft: 'Missão Rodada Grátis',
    headerRight: 'Termina em 3 dias',
    showTimer: true,
    background: bgMissao,
    title: 'Ganhe 40 rodadas!',
    description: 'Aposte R$100 no jogo SpaceMan e ganhe 40 rodadas grátis.',
    buttonText: 'Ativar Missão',
    showInfoBtn: true,
  },
  {
    id: 2,
    type: '1x2',
    headerLeft: 'Hoje, 17:00',
    headerRight: 'Champions League',
    background: bg1x2,
    title: 'Real x Barça',
    description: 'Está preparado para esse clássico? Aposte agora mesmo.',
    odds: [
      { team: 'Real Madrid', value: '1.78x' },
      { team: 'Empate', value: '3.50x' },
      { team: 'Barcelona', value: '2.10x' },
    ],
  },
  {
    id: 3,
    type: 'torneio',
    headerLeft: 'Torneio Diário',
    headerRight: 'Termina em 3 dias',
    showTimer: true,
    background: bgTorneio,
    title: 'R$10 Mil por dia!',
    description: 'Jogue o game Ratinho Sortudo e dispute prêmios todos os dias!',
    buttonText: 'Jogar Torneio',
    showInfoBtn: true,
  },
  {
    id: 4,
    type: 'aumentada',
    headerLeft: '11/09, 16:00',
    headerRight: 'Flamengo vs Racing',
    background: bgAumentada,
    title: 'Aumentada',
    description: 'Pedro\nMais de 3.5\nFinalizações ao gol',
    oddBoosted: { old: '3.87x', new: '4.50x' },
  },
  {
    id: 5,
    type: 'virtuais',
    headerLeft: 'Novidade no Rei',
    headerRight: 'Virtuais',
    background: bgVirtuais,
    title: 'Chegou Virtuais!',
    description: 'Jogos a todo minuto para você não parar de se divertir.',
    buttonText: 'Jogue Agora essa Novidade',
  },
]

const AUTO_PLAY_INTERVAL = 8000 // 8 segundos

export function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Função para iniciar o auto-play
  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    
    autoPlayRef.current = setInterval(() => {
      if (scrollRef.current) {
        const cardWidth = scrollRef.current.offsetWidth - 40 + 20
        const currentScroll = scrollRef.current.scrollLeft
        const currentIndex = Math.round(currentScroll / cardWidth)
        const nextIndex = (currentIndex + 1) % banners.length
        
        scrollRef.current.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth'
        })
      }
    }, AUTO_PLAY_INTERVAL)
  }

  // Auto-play: inicia quando o componente monta
  useEffect(() => {
    startAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  // Reseta a animação do bullet quando muda de banner
  useEffect(() => {
    setProgressKey(prev => prev + 1)
  }, [activeIndex])

  // Pausa o auto-play durante o drag
  const pauseAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }

  // Reinicia o auto-play após interação manual
  const resetAutoPlay = () => {
    setProgressKey(prev => prev + 1)
    startAutoPlay()
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const currentScrollLeft = scrollRef.current.scrollLeft
      const cardWidth = scrollRef.current.offsetWidth - 40 + 20
      const newIndex = Math.round(currentScrollLeft / cardWidth)
      setActiveIndex(Math.min(newIndex, banners.length - 1))
    }
  }

  // Centraliza no banner mais próximo
  const snapToNearestBanner = () => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.offsetWidth - 40 + 20
    const currentScroll = scrollRef.current.scrollLeft
    const nearestIndex = Math.round(currentScroll / cardWidth)
    const targetScroll = nearestIndex * cardWidth
    
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  // Drag to scroll para mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    pauseAutoPlay()
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    snapToNearestBanner()
    resetAutoPlay()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      snapToNearestBanner()
      resetAutoPlay()
    }
  }

  // Touch events para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    pauseAutoPlay()
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    snapToNearestBanner()
    resetAutoPlay()
  }

  return (
    <div className="banner-carousel">
      <div 
        className={`banner-carousel__list ${isDragging ? 'banner-carousel__list--dragging' : ''}`}
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="banner-card">
            {/* Header */}
            <div className="banner-card__header">
              <span className="banner-card__header-left">{banner.headerLeft}</span>
              <div className="banner-card__header-right">
                {banner.showTimer && <span className="banner-card__timer-dot" />}
                <span>{banner.headerRight}</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="banner-card__content"
              style={{ backgroundImage: `url(${banner.background})` }}
            >
              <div className={`banner-card__info ${banner.odds ? 'banner-card__info--full' : ''}`}>
                <div className="banner-card__text">
                  <h3 className="banner-card__title">
                    {banner.type === 'aumentada' && (
                      <img src={iconAumentada} alt="" className="banner-card__boost-icon" />
                    )}
                    {banner.title}
                  </h3>
                  <p className="banner-card__description">
                    {banner.description.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </p>
                </div>

                {/* Botões padrão */}
                {banner.buttonText && (
                  <div className="banner-card__buttons">
                    <button className="banner-card__btn">{banner.buttonText}</button>
                    {banner.showInfoBtn && (
                      <button className="banner-card__btn banner-card__btn--icon">
                        <img src={iconSaibaMais} alt="Saiba mais" />
                      </button>
                    )}
                  </div>
                )}

                {/* Odds 1x2 */}
                {banner.odds && (
                  <div className="banner-card__odds">
                    {banner.odds.map((odd, i) => (
                      <button key={i} className="banner-card__odd-btn">
                        <span className="banner-card__odd-team">{odd.team}</span>
                        <span className="banner-card__odd-value">{odd.value}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Odd aumentada */}
                {banner.oddBoosted && (
                  <button className="banner-card__boosted-btn">
                    <span className="banner-card__old-odd">{banner.oddBoosted.old}</span>
                    <img src={iconBoostWhite} alt="" className="banner-card__arrow" />
                    <span className="banner-card__new-odd">{banner.oddBoosted.new}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bullets */}
      <div className="banner-carousel__bullets">
        {banners.map((_, index) => (
          <span 
            key={index} 
            className={`banner-carousel__bullet ${index === activeIndex ? 'banner-carousel__bullet--active' : ''}`}
          >
            {index === activeIndex && (
              <span 
                key={progressKey}
                className="banner-carousel__bullet-progress" 
              />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

