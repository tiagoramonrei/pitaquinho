import { useState, useRef, useEffect } from 'react'
import './BannerCarousel.css'
import { Toast } from '../Toast'
import { 
  BottomSheet, 
  MissionObjective, 
  MissionInfoRow, 
  MissionFaqItem,
  MissionTimer 
} from '../BottomSheet'
import iconAccordion from '../../assets/iconAccordion.png'

// Backgrounds
import bgMissao from '../../assets/bgMissao.png'
import bg1x2 from '../../assets/bg1x2.png'
import bgTorneio from '../../assets/bgTorneio.png'
import bgAumentada from '../../assets/bgAumentada.png'
import bgVirtuais from '../../assets/bgVirtuais.png'
import iconSaibaMais from '../../assets/iconSaibaMais.svg'
import iconBoostWhite from '../../assets/iconBoostWhite.svg'
import iconAumentada from '../../assets/iconAumentada.png'
import iconAtivo from '../../assets/iconAtivo.svg'
import imgMissaoRodadaGratis from '../../assets/imgMissaoRodadaGratis.png'

// Mission progress type
interface MissionProgress {
  current: number
  target: number
}

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
  const [activatedMissions, setActivatedMissions] = useState<Record<number, MissionProgress>>({})
  const [showToast, setShowToast] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const dragDistance = useRef(0)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleActivateMission = (bannerId: number, target: number) => {
    if (activatedMissions[bannerId]) return // Already activated
    
    setActivatedMissions(prev => ({
      ...prev,
      [bannerId]: { current: 0, target }
    }))
    setShowToast(true)
  }

  const isMissionActivated = (bannerId: number) => {
    return bannerId in activatedMissions
  }

  const getMissionProgress = (bannerId: number) => {
    return activatedMissions[bannerId]
  }

  const handleOpenMissionInfo = (banner: Banner) => {
    setSelectedBanner(banner)
    setIsBottomSheetOpen(true)
  }

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false)
    setTimeout(() => {
      setSelectedBanner(null)
    }, 350)
  }

  const handleActivateMissionFromBS = () => {
    if (selectedBanner) {
      const bannerId = selectedBanner.id
      const isAlreadyActivated = isMissionActivated(bannerId)
      
      setIsBottomSheetOpen(false)
      
      if (isAlreadyActivated) {
        setTimeout(() => {
          setSelectedBanner(null)
        }, 350)
        return
      }
      
      // Atualiza o estado imediatamente para o banner mudar
      setActivatedMissions(prev => ({
        ...prev,
        [bannerId]: { current: 0, target: 100 }
      }))
      setShowToast(true)
      
      setTimeout(() => {
        setSelectedBanner(null)
      }, 350)
    }
  }

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

  // Centraliza no banner mais próximo com sensibilidade ao arraste
  const snapToNearestBanner = (dragDelta: number = 0) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.offsetWidth - 40 + 20
    const currentScroll = scrollRef.current.scrollLeft
    const currentIndex = currentScroll / cardWidth
    
    let targetIndex: number
    // Se arrastou mais que 30px, muda para o próximo/anterior
    if (dragDelta > 30) {
      targetIndex = Math.ceil(currentIndex)
    } else if (dragDelta < -30) {
      targetIndex = Math.floor(currentIndex)
    } else {
      targetIndex = Math.round(currentIndex)
    }
    
    // Limita ao range válido
    const maxIndex = Math.max(0, Math.ceil((scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / cardWidth))
    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex))
    
    const targetScroll = targetIndex * cardWidth
    
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
    dragDistance.current = 0
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    const delta = dragDistance.current
    setIsDragging(false)
    snapToNearestBanner(delta)
    resetAutoPlay()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    dragDistance.current = -walk // Negativo porque walk é invertido
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      const delta = dragDistance.current
      setIsDragging(false)
      snapToNearestBanner(delta)
      resetAutoPlay()
    }
  }

  // Touch events para mobile
  const handleTouchStart = () => {
    pauseAutoPlay()
  }

  const handleTouchEnd = () => {
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
                    {banner.type === 'missao' && isMissionActivated(banner.id) ? (
                      <button 
                        className="banner-card__btn-activated"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenMissionInfo(banner)
                        }}
                      >
                        <div className="banner-card__btn-activated-left">
                          <img src={iconAtivo} alt="" className="banner-card__btn-activated-icon" />
                          <span>Acompanhar</span>
                        </div>
                        <div className="banner-card__btn-activated-divider" />
                        <div className="banner-card__btn-activated-right">
                          <span className="banner-card__btn-activated-label">Progresso</span>
                          <span className="banner-card__btn-activated-value">
                            R${getMissionProgress(banner.id)?.current || 0} de R${getMissionProgress(banner.id)?.target || 100}
                          </span>
                        </div>
                      </button>
                    ) : (
                      <>
                        <button 
                          className="banner-card__btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (banner.type === 'missao') {
                              handleActivateMission(banner.id, 100)
                            }
                          }}
                        >
                          {banner.buttonText}
                        </button>
                        {banner.showInfoBtn && (
                          <button 
                            className="banner-card__btn banner-card__btn--icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (banner.type === 'missao') {
                                handleOpenMissionInfo(banner)
                              }
                            }}
                          >
                            <img src={iconSaibaMais} alt="Saiba mais" />
                          </button>
                        )}
                      </>
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

      {/* Success Toast */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        title="Missão Ativada"
        message="Cumpra os objetivos para ganhar o seu bônus!"
      />

      {/* Mission Bottom Sheet */}
      {selectedBanner && selectedBanner.type === 'missao' && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={closeBottomSheet}
          title={selectedBanner.title}
          titleIcon={imgMissaoRodadaGratis}
          footerContent={
            <button className="bottom-sheet__btn-primary" onClick={handleActivateMissionFromBS}>
              <span>{isMissionActivated(selectedBanner.id) ? 'Jogar' : 'Ativar Missão'}</span>
            </button>
          }
        >
          {/* Mission Description */}
          <p className="mission-description">{selectedBanner.description}</p>

          {/* Mission Box */}
          <div className="mission-box">
            <div className="mission-box__header">
              <MissionTimer text={selectedBanner.headerRight} />
            </div>
            <div className="mission-box__content">
              {isMissionActivated(selectedBanner.id) && (
                <div className="mission-progress">
                  <div className="mission-progress__header">
                    <span className="mission-progress__label">Progresso:</span>
                    <span className="mission-progress__value">
                      R${getMissionProgress(selectedBanner.id)?.current || 0} de R${getMissionProgress(selectedBanner.id)?.target || 100}
                    </span>
                  </div>
                  <div className="mission-progress__bar">
                    <div 
                      className="mission-progress__fill"
                      style={{ 
                        width: `${((getMissionProgress(selectedBanner.id)?.current || 0) / (getMissionProgress(selectedBanner.id)?.target || 100)) * 100}%` 
                      }}
                    />
                    <div 
                      className="mission-progress__dot"
                      style={{ 
                        left: `${((getMissionProgress(selectedBanner.id)?.current || 0) / (getMissionProgress(selectedBanner.id)?.target || 100)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              <p className="mission-box__title">Objetivos da missão</p>
              <MissionObjective text="Apostar R$100 no jogo SpaceMan" />
            </div>
          </div>

          {/* Mission Info Section */}
          <div className="mission-info-section">
            <div className="mission-info-header">
              <span className="mission-info-header__title">Informações sobre a Missão</span>
              <img src={iconAccordion} alt="" className="mission-info-header__icon" />
            </div>
            <div className="mission-info-rows">
              <MissionInfoRow label="Tipo de Aposta" value="Jogo Crash" />
              <MissionInfoRow label="Valor Mínimo por Aposta" value="Pelo menos R$100" />
              <MissionInfoRow label="Valor do Bônus" value="40" />
              <MissionInfoRow label="Forma de Recebimento" value="Giros Grátis" />
              <MissionInfoRow label="Validade do Bônus" value="7 dias após o recebimento" />
            </div>

            {/* FAQ Section */}
            <div className="mission-faq">
              <MissionFaqItem question="Como posso participar da missão" />
              <MissionFaqItem question="Preciso ativar a missão para participar?" />
              <MissionFaqItem question="Quais jogos participam da promoção?" />
              <MissionFaqItem question="Quando recebo meu bônus?" />
              <MissionFaqItem question="Posso acumular essa missão com outras?" />
              <MissionFaqItem question="Termos e Condições" />
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

