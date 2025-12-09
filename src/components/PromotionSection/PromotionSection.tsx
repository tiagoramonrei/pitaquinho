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
    // Open bottom sheet if wasn't a drag
    if (dragDistance.current < 5) {
      setSelectedPromo(promo)
      setIsBottomSheetOpen(true)
    }
  }

  const handleActivateMission = () => {
    if (selectedPromo) {
      const promoId = selectedPromo.id
      const isAlreadyActivated = isMissionActivated(promoId)
      
      // Just close the bottom sheet
      setIsBottomSheetOpen(false)
      
      // If already activated (button is "Jogar"), just close without toast
      if (isAlreadyActivated) {
        setTimeout(() => {
          setSelectedPromo(null)
        }, 350)
        return
      }
      
      // If not activated, activate and show toast
      const target = promoId === '1' ? 50 : 20
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

  // Touch events removidos para usar scroll nativo

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
      >
        {promotions.map((promo) => {
          const isActivated = isMissionActivated(promo.id)
          const progress = getMissionProgress(promo.id)
          
          return (
            <div 
              key={promo.id} 
              className={`promo-card promo-card--clickable ${isActivated ? 'promo-card--activated' : ''}`}
              onClick={() => handlePromoClick(promo)}
            >
              <div className="promo-card__header">
                <span className="promo-card__type">
                  {isActivated && progress && promo.type === 'missao' ? (
                    <span className="promo-card__progress">
                      Progresso: <strong>R${progress.current}</strong> de <strong>R${progress.target}</strong>
                    </span>
                  ) : (
                    promo.type === 'missao' ? 'Missão' : 'Vantagem'
                  )}
                </span>
                <div className="promo-card__time">
                  {promo.hasTimer && <span className="promo-card__dot"></span>}
                  <span className="promo-card__time-label">{promo.timeLabel}</span>
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
      {selectedPromo && selectedPromo.type === 'missao' && (
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
              {isMissionActivated(selectedPromo.id) && (
                <div className="mission-progress">
                  <div className="mission-progress__header">
                    <span className="mission-progress__label">Progresso:</span>
                    <span className="mission-progress__value">
                      R${getMissionProgress(selectedPromo.id)?.current || 0} de R${getMissionProgress(selectedPromo.id)?.target || 50}
                    </span>
                  </div>
                  <div className="mission-progress__bar">
                    <div 
                      className="mission-progress__fill"
                      style={{ 
                        width: `${((getMissionProgress(selectedPromo.id)?.current || 0) / (getMissionProgress(selectedPromo.id)?.target || 50)) * 100}%` 
                      }}
                    />
                    <div 
                      className="mission-progress__dot"
                      style={{ 
                        left: `${((getMissionProgress(selectedPromo.id)?.current || 0) / (getMissionProgress(selectedPromo.id)?.target || 50)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
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

      {/* Vantagem Bottom Sheet - Rei Turbina */}
      {selectedPromo && selectedPromo.type === 'vantagem' && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={closeBottomSheet}
          title="Rei Turbina"
          titleIcon={selectedPromo.image}
        >
          {/* Como Funciona Section */}
          <div className="vantagem-section">
            <h3 className="vantagem-section__title">Entenda como funciona:</h3>
            <div className="vantagem-cards">
              <div className="vantagem-card">
                <div className="vantagem-card__number">1</div>
                <p className="vantagem-card__text">
                  Monte uma múltipla com pelo menos 3 seleções elegíveis, cada uma com odd mínima de 1.35, e o Rei Turbina começa a valer para você.
                </p>
              </div>
              <div className="vantagem-card">
                <div className="vantagem-card__number">2</div>
                <p className="vantagem-card__text">
                  Quanto mais seleções você adicionar ao seu bilhete, maior o bônus sobre o lucro final. O aumento pode chegar a até 200%, conforme a grade de eventos.
                </p>
              </div>
              <div className="vantagem-card">
                <div className="vantagem-card__number">3</div>
                <p className="vantagem-card__text">
                  O bônus é aplicado quando sua múltipla for vencedora, somado ao seu lucro. Você verá o percentual do Rei Turbina no betslip e o valor em reais ao inserir sua aposta.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="vantagem-faq">
            <MissionFaqItem 
              question="O que é o Rei Turbina?" 
              answer="É uma promoção que aumenta seus ganhos em apostas múltiplas. Quanto mais seleções válidas você tiver no bilhete, maior será o percentual extra aplicado sobre o lucro final, podendo chegar a até 200%."
              defaultOpen
            />
            <MissionFaqItem 
              question="Quais tipos de apostas são válidos?" 
              answer="Apenas apostas múltiplas (com 3 ou mais seleções) em eventos diferentes. Pode incluir pré-partida e ao vivo. Apostar via Criar Aposta é permitido, mas somente se as seleções forem de eventos diferentes."
            />
            <MissionFaqItem 
              question="Quais odds mínimas são necessárias?" 
              answer="Cada seleção precisa ter odd mínima de 1.35 para contar no cálculo do Rei Turbina."
            />
            <MissionFaqItem 
              question="E se eu tiver seleções com odds menores?" 
              answer="Seu bilhete ainda é válido para o Rei Turbina, mas as seleções abaixo de 1.35 não contam para o cálculo do aumento percentual."
            />
            <MissionFaqItem 
              question="O que acontece se um dos jogos for cancelado?" 
              answer="Se alguma seleção tiver odd 2.00 (evento anulado), o Rei Turbina será recalculado com base nas seleções restantes. Exemplo: se você apostou em 5 jogos para ter +15%, mas 1 foi anulado, seu bônus será ajustado para o percentual de 4 eventos."
            />
            <MissionFaqItem 
              question="E se eu usar apostas especiais ou bônus?" 
              answer="O Rei Turbina também vale para apostas feitas com dinheiro de bônus ou coroa do rei."
            />
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

