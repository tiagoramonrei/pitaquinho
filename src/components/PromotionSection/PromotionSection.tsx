import { useState, useRef } from 'react'
import './PromotionSection.css'

import iconPromocao from '../../assets/iconPromocao.png'
import imgMissaoVerdao from '../../assets/imgMissaoVerdao.png'
import imgVantagemRei from '../../assets/imgVatagemReiTurnina.png'
import imgMissaoBrasileirao from '../../assets/imgMissaoBrasileirao.png'
import iconAccordion from '../../assets/iconAccordion.png'

import { 
  BottomSheet, 
  MissionObjective, 
  MissionInfoRow, 
  MissionFaqItem,
  MissionTimer 
} from '../BottomSheet'
import { Toast } from '../Toast'

interface Promotion {
  id: string
  type: 'missao' | 'vantagem'
  timeLabel: string
  hasTimer: boolean
  title: string
  description: string
  image: string
}

const promotions: Promotion[] = [
  {
    id: '1',
    type: 'missao',
    timeLabel: 'Termina em 3 dias',
    hasTimer: true,
    title: 'Aposte no Verdão!',
    description: 'Aposte R$50 no jogo do Palmeiras na Liberta e ganhe R$10 em créditos.',
    image: imgMissaoVerdao,
  },
  {
    id: '2',
    type: 'vantagem',
    timeLabel: 'Só no Rei',
    hasTimer: false,
    title: 'Fature até 200%!',
    description: 'Aposte em múltiplas e o Rei turbina o seu prêmio em até 200%.',
    image: imgVantagemRei,
  },
  {
    id: '3',
    type: 'missao',
    timeLabel: 'Termina em 3 dias',
    hasTimer: true,
    title: 'Tem brasileirão!',
    description: 'Ganhe 5 créditos de apostas no brasileirão. É apostar e ganhar.',
    image: imgMissaoBrasileirao,
  },
]

// Mission progress data
interface MissionProgress {
  current: number
  target: number
}

export function PromotionSection() {
  const [isDragging, setIsDragging] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null)
  const [activatedMissions, setActivatedMissions] = useState<Record<string, MissionProgress>>({})
  const [showToast, setShowToast] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const dragDistance = useRef(0)

  const handlePromoClick = (promo: Promotion) => {
    // Only open bottom sheet if it's a mission type and wasn't a drag
    if (promo.type === 'missao' && dragDistance.current < 5) {
      setSelectedPromo(promo)
      setIsBottomSheetOpen(true)
    }
  }

  const handleActivateMission = () => {
    if (selectedPromo) {
      const promoId = selectedPromo.id
      const target = promoId === '1' ? 50 : 20
      // Just close the bottom sheet - animation will handle the rest
      setIsBottomSheetOpen(false)
      // Update state and show toast after animation completes
      setTimeout(() => {
        setActivatedMissions(prev => ({
          ...prev,
          [promoId]: { current: 0, target }
        }))
        setSelectedPromo(null)
        setShowToast(true)
      }, 350)
    }
  }

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false)
    // Clear selected promo after animation completes
    setTimeout(() => {
      setSelectedPromo(null)
    }, 350)
  }

  const isMissionActivated = (promoId: string) => {
    return promoId in activatedMissions
  }

  const getMissionProgress = (promoId: string) => {
    return activatedMissions[promoId]
  }

  // Centraliza no card mais próximo com sensibilidade ao arraste
  const snapToNearestCard = (dragDelta: number = 0) => {
    if (!scrollRef.current) return
    const cardWidth = 304 + 8 // width + gap
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
    dragDistance.current = 0
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleMouseUp = () => {
    const delta = scrollRef.current ? scrollRef.current.scrollLeft - scrollLeft.current : 0
    setIsDragging(false)
    snapToNearestCard(delta)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    dragDistance.current = Math.abs(walk)
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      const delta = scrollRef.current ? scrollRef.current.scrollLeft - scrollLeft.current : 0
      setIsDragging(false)
      snapToNearestCard(delta)
    }
  }

  // Touch events para mobile - let native scroll handle the movement
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    dragDistance.current = 0
    startX.current = e.touches[0].pageX
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    const x = e.touches[0].pageX
    dragDistance.current = startX.current - x // Positivo = arrastou para esquerda (próximo)
  }

  const handleTouchEnd = () => {
    const delta = dragDistance.current
    setIsDragging(false)
    // Trigger snap after CSS scroll-snap-type is re-enabled
    setTimeout(() => {
      snapToNearestCard(delta)
    }, 50)
  }

  return (
    <section id="section-promocoes" className="promotion-section">
      <div className="promotion-section__header">
        <div className="promotion-section__title">
          <img src={iconPromocao} alt="" className="promotion-section__icon" />
          <span>Promoções</span>
        </div>
      </div>

      <div 
        className={`promotion-section__list ${isDragging ? 'promotion-section__list--dragging' : ''}`}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {promotions.map((promo) => {
          const isActivated = isMissionActivated(promo.id)
          const progress = getMissionProgress(promo.id)
          
          return (
            <div 
              key={promo.id} 
              className={`promo-card ${promo.type === 'missao' ? 'promo-card--clickable' : ''} ${isActivated ? 'promo-card--activated' : ''}`}
              onClick={() => handlePromoClick(promo)}
            >
              <div className="promo-card__header">
                <span className="promo-card__type">
                  {promo.type === 'missao' ? 'Missão' : 'Vantagem'}
                </span>
                <div className="promo-card__time">
                  {isActivated && progress ? (
                    <span className="promo-card__progress">
                      Progresso: <strong>R${progress.current}</strong> de <strong>R${progress.target}</strong>
                    </span>
                  ) : (
                    <>
                      {promo.hasTimer && <span className="promo-card__dot"></span>}
                      <span className="promo-card__time-label">{promo.timeLabel}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="promo-card__content">
                <div className="promo-card__image-wrapper">
                  <img src={promo.image} alt="" className="promo-card__image" />
                </div>
                <div className="promo-card__text">
                  <h3 className="promo-card__title">{promo.title}</h3>
                  <p className="promo-card__description">{promo.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mission Bottom Sheet */}
      {selectedPromo && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={closeBottomSheet}
          title={selectedPromo.title}
          titleIcon={selectedPromo.image}
          footerContent={
            <button className="bottom-sheet__btn-primary" onClick={handleActivateMission}>
              <span>{isMissionActivated(selectedPromo.id) ? 'Jogar' : 'Ativar Missão'}</span>
            </button>
          }
        >
          {/* Mission Description */}
          <p className="mission-description">{selectedPromo.description}</p>

          {/* Mission Box */}
          <div className="mission-box">
            <div className="mission-box__header">
              <MissionTimer text={selectedPromo.timeLabel} />
            </div>
            <div className="mission-box__content">
              <p className="mission-box__title">Objetivos da missão</p>
              <MissionObjective 
                text={selectedPromo.id === '1' 
                  ? 'Apostar R$50 no jogo do Palmeiras na Libertadores.' 
                  : 'Apostar R$20 em qualquer jogo do Brasileirão.'
                } 
              />
            </div>
          </div>

          {/* Mission Info Section */}
          <div className="mission-info-section">
            <div className="mission-info-header">
              <span className="mission-info-header__title">Informações sobre a Missão</span>
              <img src={iconAccordion} alt="" className="mission-info-header__icon" />
            </div>
            <div className="mission-info-rows">
              <MissionInfoRow label="Tipo de Aposta" value="Simples, Combinadas ou Criar Aposta" />
              <MissionInfoRow label="Valor Mínimo por Aposta" value={selectedPromo.id === '1' ? 'Pelo menos R$50' : 'Pelo menos R$20'} />
              <MissionInfoRow label="Odd Mínima por Aposta" value="3.00x" />
              <MissionInfoRow label="Valor do Bônus" value={selectedPromo.id === '1' ? '10' : '5'} />
              <MissionInfoRow label="Forma de Recebimento" value="Crédito de Aposta" />
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

      {/* Success Toast */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        title="Missão Ativada"
        message="Cumpra os objetivos para ganhar o seu bônus!"
      />
    </section>
  )
}

