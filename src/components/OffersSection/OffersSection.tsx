import { useState, useRef, useEffect } from 'react'
import './OffersSection.css'

import iconOfertasRei from '../../assets/iconOfertasRei.png'
import setaLink from '../../assets/setaLink.png'
import iconCombinada from '../../assets/iconCombinada.png'
import iconSuperAumentada from '../../assets/iconSuperAumentada.png'
import iconAumentada from '../../assets/iconAumentada.png'
import iconPechincha from '../../assets/iconPechincha.png'
import iconBoost from '../../assets/iconBoost.png'
import escudoBayerLeverkusen from '../../assets/escudoBayerLeverkusen.png'
import escudoBayerMunique from '../../assets/escudoBayerMunique.png'
import escudoPSG from '../../assets/escudoPSG.png'
import escudoLyon from '../../assets/escudoLyon.png'
import escudoCruzeiro from '../../assets/escudoCruzeiro.png'
import escudoPalmeiras from '../../assets/escudoPalmeiras.png'
import escudoFluminense from '../../assets/escudoFluminense.png'
import escudoBotafogo from '../../assets/escudoBotafogo.png'
import escudoBahia from '../../assets/escudoBahia.png'
import escudoManchesterCity from '../../assets/escudomanchesterCity.png'
import escudoLiverpool from '../../assets/escudoLiverpool.png'
import escudoBarcelonaGde from '../../assets/escudoBarcelonaGde.png'
import escudoBotafogoGde from '../../assets/escudoBotafogoGde.png'
import escudoFlamengoGde from '../../assets/escudoFlamengoGde.png'
import escudo76ersGde from '../../assets/escudo76ersGde.png'
import escudoWarriorsGde from '../../assets/escudoWarriosGde.png'
import escudoBullsGde from '../../assets/escudoBullsGde.png'
import escudoPistonsGde from '../../assets/escudoPistonsGde.png'
import iconBasquete from '../../assets/iconBasquete.png'
import playerJimmyButler from '../../assets/playerJimmyButler.png'
import playerLeBronJames from '../../assets/playerLeBronJames.png'
import playerLukaDoncic from '../../assets/playerLukaDoncic.png'
import playerStephenCurry from '../../assets/playerStephenCurry.png'
import playerRaphinha from '../../assets/playerRaphinha.png'
import playerArrascaeta from '../../assets/playerArrascaeta.png'
import playerLewa from '../../assets/playerLewa.png'
import playerYamal from '../../assets/playerYamal.png'
import iconFutebol from '../../assets/iconFutebol.png'
import iconEstatistica from '../../assets/iconEstatistica.png'
import arrowDown from '../../assets/arrowDown.png'
import iconBoostWhite from '../../assets/iconBoostWhite.svg'

interface FilterChip {
  id: string
  label: string
}

const filterChips: FilterChip[] = [
  { id: 'melhores', label: 'As melhores' },
  { id: 'combinadas', label: 'Combinadas' },
  { id: 'super-aumentada', label: 'Super Aumentada' },
  { id: 'aumentada', label: 'Aumentada' },
  { id: 'pechinchas', label: 'Pechinchas' },
]

interface OfferCard {
  id: string
  type: 'combinada' | 'super_aumentada' | 'aumentada' | 'pechincha'
  category: 'melhores' | 'combinadas' | 'super-aumentada' | 'aumentada' | 'pechinchas'
  title: string
  tagLabel: string
  tagColor: string
  tagIcon: string
  subtitle?: string
  date?: string
  oldOdd?: string
  newOdd: string
  // Para cards de combinada simples (times)
  events?: {
    team1: string
    team1Icon: string
    team2Icon: string
    market: string
  }[]
  // Para cards de combinada com jogadores
  playerEvents?: {
    icon: string
    name: string
    value?: string
    market: string
  }[]
  // Mostrar "Ver todos"
  showViewAll?: number
  // Para cards de jogador
  player?: {
    name: string
    team: string
    image: string
    stat: string
    statValue: string
    sportIcon?: string
  }
  // Para cards de time (super aumentada de time)
  teamStat?: {
    teamName: string
    teamIcon: string
    sportIcon?: string
    stat: string
    statValue: string
  }
}

const allOffers: OfferCard[] = [
  // === AS MELHORES (default) ===
  {
    id: '1',
    type: 'combinada',
    category: 'melhores',
    title: 'Chuva de gols na Europa!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'Múltipla com 3 eventos',
    oldOdd: '5.82x',
    newOdd: '6.75x',
    events: [
      { team1: 'Mais de 2.5', team1Icon: escudoManchesterCity, team2Icon: escudoLiverpool, market: 'Total de Gols' },
      { team1: 'Mais de 1.5', team1Icon: escudoBayerLeverkusen, team2Icon: escudoBayerMunique, market: 'Total de Gols' },
      { team1: 'Mais de 2.5', team1Icon: escudoPSG, team2Icon: escudoLyon, market: 'Total de Gols' },
    ],
  },
  {
    id: '2',
    type: 'super_aumentada',
    category: 'melhores',
    title: 'Tá voando!',
    tagLabel: 'Super aumentada',
    tagColor: '#88deff',
    tagIcon: iconSuperAumentada,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    oldOdd: '2.85x',
    newOdd: '3.50x',
    player: {
      name: 'Raphinha',
      team: 'Barcelona',
      image: playerRaphinha,
      stat: 'Finalizações ao gol',
      statValue: 'Mais de 1.5',
    },
  },
  {
    id: '3',
    type: 'aumentada',
    category: 'melhores',
    title: 'Artilheiro na área.',
    tagLabel: 'Aumentada',
    tagColor: '#fff5cd',
    tagIcon: iconAumentada,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    oldOdd: '1.75x',
    newOdd: '2.10x',
    player: {
      name: 'R. Lewandowski',
      team: 'Barcelona',
      image: playerLewa,
      stat: 'Marcar a qualquer momento',
      statValue: 'Sim',
    },
  },
  {
    id: '4',
    type: 'combinada',
    category: 'melhores',
    title: 'Jogo quente!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'Flamengo vs Cruzeiro',
    date: '11/09, 16:00',
    newOdd: '4.25x',
    playerEvents: [
      { icon: iconPechincha, name: 'M. Pereira', value: '7+ → 0.5+', market: 'Passes Certos' },
      { icon: escudoCruzeiro, name: 'Kaio Jorge', value: 'Sim', market: 'Para Marcar Gol' },
      { icon: escudoCruzeiro, name: 'Cruzeiro', value: '4.5+', market: 'Total de Escanteios' },
    ],
    showViewAll: 4,
  },
  {
    id: '5',
    type: 'pechincha',
    category: 'melhores',
    title: 'Craque demais.',
    tagLabel: 'Pechincha',
    tagColor: '#b1e8c9',
    tagIcon: iconPechincha,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    newOdd: '1.72x',
    player: {
      name: 'L. Yamal',
      team: 'Barcelona',
      image: playerYamal,
      stat: 'Finalizações ao gol',
      statValue: 'Mais de 0.5',
    },
  },

  // === COMBINADAS ===
  {
    id: 'comb-0a',
    type: 'combinada',
    category: 'combinadas',
    title: 'Chuva de gols na Europa!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'Múltipla com 3 eventos',
    oldOdd: '5.82x',
    newOdd: '6.75x',
    events: [
      { team1: 'Mais de 2.5', team1Icon: escudoManchesterCity, team2Icon: escudoLiverpool, market: 'Total de Gols' },
      { team1: 'Mais de 1.5', team1Icon: escudoBayerLeverkusen, team2Icon: escudoBayerMunique, market: 'Total de Gols' },
      { team1: 'Mais de 2.5', team1Icon: escudoPSG, team2Icon: escudoLyon, market: 'Total de Gols' },
    ],
  },
  {
    id: 'comb-0b',
    type: 'combinada',
    category: 'combinadas',
    title: 'Jogo quente!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'Flamengo vs Cruzeiro',
    date: '11/09, 16:00',
    newOdd: '4.25x',
    playerEvents: [
      { icon: iconPechincha, name: 'M. Pereira', value: '7+ → 0.5+', market: 'Passes Certos' },
      { icon: escudoCruzeiro, name: 'Kaio Jorge', value: 'Sim', market: 'Para Marcar Gol' },
      { icon: escudoCruzeiro, name: 'Cruzeiro', value: '4.5+', market: 'Total de Escanteios' },
    ],
    showViewAll: 4,
  },
  {
    id: 'comb-1',
    type: 'combinada',
    category: 'combinadas',
    title: 'Clássico francês!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'PSG vs Lyon',
    date: '12/09, 16:00',
    oldOdd: '6.35x',
    newOdd: '7.50x',
    playerEvents: [
      { icon: escudoPSG, name: 'PSG', value: 'Sim', market: 'Resultado Final' },
      { icon: escudoPSG, name: 'Mais de 2.5', market: 'Total de Gols' },
      { icon: escudoLyon, name: 'Lyon', value: '3.5+', market: 'Total de Escanteios' },
    ],
  },
  {
    id: 'comb-2',
    type: 'combinada',
    category: 'combinadas',
    title: 'Duelo brasileiro!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'Palmeiras vs Fluminense',
    date: '12/09, 21:30',
    oldOdd: '5.15x',
    newOdd: '6.20x',
    playerEvents: [
      { icon: escudoPalmeiras, name: 'Palmeiras', value: 'Sim', market: 'Resultado Final' },
      { icon: escudoPalmeiras, name: 'Mais de 1.5', market: 'Total de Gols' },
      { icon: escudoFluminense, name: 'Ambas Marcam', value: 'Sim', market: 'Gols' },
    ],
  },
  {
    id: 'comb-3',
    type: 'combinada',
    category: 'combinadas',
    title: 'Tripla campeã!',
    tagLabel: 'Combinadas',
    tagColor: '#f07d87',
    tagIcon: iconCombinada,
    subtitle: 'Múltipla com 3 eventos',
    oldOdd: '4.85x',
    newOdd: '5.75x',
    events: [
      { team1: 'Palmeiras', team1Icon: escudoPalmeiras, team2Icon: escudoFluminense, market: 'Resultado Final' },
      { team1: 'Botafogo', team1Icon: escudoBotafogo, team2Icon: escudoBahia, market: 'Resultado Final' },
      { team1: 'Man. City', team1Icon: escudoManchesterCity, team2Icon: escudoLiverpool, market: 'Resultado Final' },
    ],
  },

  // === SUPER AUMENTADA ===
  {
    id: 'super-0',
    type: 'super_aumentada',
    category: 'super-aumentada',
    title: 'Tá voando!',
    tagLabel: 'Super aumentada',
    tagColor: '#88deff',
    tagIcon: iconSuperAumentada,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    oldOdd: '2.85x',
    newOdd: '3.50x',
    player: {
      name: 'Raphinha',
      team: 'Barcelona',
      image: playerRaphinha,
      stat: 'Finalizações ao gol',
      statValue: 'Mais de 1.5',
    },
  },
  {
    id: 'super-1',
    type: 'super_aumentada',
    category: 'super-aumentada',
    title: 'El Clásico!',
    tagLabel: 'Super aumentada',
    tagColor: '#88deff',
    tagIcon: iconSuperAumentada,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    oldOdd: '2.45x',
    newOdd: '3.10x',
    teamStat: {
      teamName: 'Barcelona',
      teamIcon: escudoBarcelonaGde,
      stat: 'escanteios',
      statValue: 'Mais de 4.5',
    },
  },
  {
    id: 'super-2',
    type: 'super_aumentada',
    category: 'super-aumentada',
    title: 'Fogão em chamas!',
    tagLabel: 'Super aumentada',
    tagColor: '#88deff',
    tagIcon: iconSuperAumentada,
    subtitle: 'Botafogo vs Bahia',
    date: '12/09, 21:00',
    oldOdd: '1.55x',
    newOdd: '2.05x',
    teamStat: {
      teamName: 'Botafogo',
      teamIcon: escudoBotafogoGde,
      stat: 'gols',
      statValue: 'Mais de 1.5',
    },
  },
  {
    id: 'super-3',
    type: 'super_aumentada',
    category: 'super-aumentada',
    title: 'Mengão avassalador!',
    tagLabel: 'Super aumentada',
    tagColor: '#88deff',
    tagIcon: iconSuperAumentada,
    subtitle: 'Flamengo vs Cruzeiro',
    date: '12/09, 19:00',
    oldOdd: '2.70x',
    newOdd: '3.40x',
    teamStat: {
      teamName: 'Flamengo',
      teamIcon: escudoFlamengoGde,
      stat: 'gols',
      statValue: 'Mais de 2.5',
    },
  },
  {
    id: 'super-4',
    type: 'super_aumentada',
    category: 'super-aumentada',
    title: 'Craque em ação!',
    tagLabel: 'Super aumentada',
    tagColor: '#88deff',
    tagIcon: iconSuperAumentada,
    subtitle: 'Flamengo vs Cruzeiro',
    date: '12/09, 19:00',
    oldOdd: '3.20x',
    newOdd: '4.00x',
    player: {
      name: 'Arrascaeta',
      team: 'Flamengo',
      image: playerArrascaeta,
      stat: 'Finalizações ao gol',
      statValue: 'Mais de 4.5',
    },
  },

  // === AUMENTADA ===
  {
    id: 'aum-1',
    type: 'aumentada',
    category: 'aumentada',
    title: 'Artilheiro na área.',
    tagLabel: 'Aumentada',
    tagColor: '#fff5cd',
    tagIcon: iconAumentada,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    oldOdd: '1.75x',
    newOdd: '2.10x',
    player: {
      name: 'R. Lewandowski',
      team: 'Barcelona',
      image: playerLewa,
      stat: 'Marcar a qualquer momento',
      statValue: 'Sim',
    },
  },
  {
    id: 'aum-2',
    type: 'aumentada',
    category: 'aumentada',
    title: 'Cestinha garantido!',
    tagLabel: 'Aumentada',
    tagColor: '#fff5cd',
    tagIcon: iconAumentada,
    subtitle: '76ers vs Celtics',
    date: '13/09, 21:00',
    oldOdd: '1.85x',
    newOdd: '2.30x',
    teamStat: {
      teamName: '76ers',
      teamIcon: escudo76ersGde,
      sportIcon: iconBasquete,
      stat: 'pontos',
      statValue: 'Mais de 110.5',
    },
  },
  {
    id: 'aum-3',
    type: 'aumentada',
    category: 'aumentada',
    title: 'Splash Brothers!',
    tagLabel: 'Aumentada',
    tagColor: '#fff5cd',
    tagIcon: iconAumentada,
    subtitle: 'Warriors vs Lakers',
    date: '14/09, 22:30',
    oldOdd: '2.10x',
    newOdd: '2.65x',
    teamStat: {
      teamName: 'Warriors',
      teamIcon: escudoWarriorsGde,
      sportIcon: iconBasquete,
      stat: 'cestas de 3',
      statValue: 'Mais de 14.5',
    },
  },
  {
    id: 'aum-4',
    type: 'aumentada',
    category: 'aumentada',
    title: 'Chicago Fire!',
    tagLabel: 'Aumentada',
    tagColor: '#fff5cd',
    tagIcon: iconAumentada,
    subtitle: 'Bulls vs Heat',
    date: '15/09, 20:00',
    oldOdd: '1.65x',
    newOdd: '2.15x',
    teamStat: {
      teamName: 'Bulls',
      teamIcon: escudoBullsGde,
      sportIcon: iconBasquete,
      stat: 'rebotes',
      statValue: 'Mais de 42.5',
    },
  },
  {
    id: 'aum-5',
    type: 'aumentada',
    category: 'aumentada',
    title: 'Motor City!',
    tagLabel: 'Aumentada',
    tagColor: '#fff5cd',
    tagIcon: iconAumentada,
    subtitle: 'Pistons vs Cavaliers',
    date: '16/09, 19:30',
    oldOdd: '1.90x',
    newOdd: '2.45x',
    teamStat: {
      teamName: 'Pistons',
      teamIcon: escudoPistonsGde,
      sportIcon: iconBasquete,
      stat: 'assistências',
      statValue: 'Mais de 24.5',
    },
  },

  // === PECHINCHAS ===
  {
    id: 'pech-1',
    type: 'pechincha',
    category: 'pechinchas',
    title: 'Craque demais.',
    tagLabel: 'Pechincha',
    tagColor: '#b1e8c9',
    tagIcon: iconPechincha,
    subtitle: 'Barcelona vs Real Madrid',
    date: '11/09, 16:00',
    newOdd: '1.72x',
    player: {
      name: 'L. Yamal',
      team: 'Barcelona',
      image: playerYamal,
      stat: 'Finalizações ao gol',
      statValue: 'Mais de 0.5',
    },
  },
  {
    id: 'pech-2',
    type: 'pechincha',
    category: 'pechinchas',
    title: 'Bucket garantido!',
    tagLabel: 'Pechincha',
    tagColor: '#b1e8c9',
    tagIcon: iconPechincha,
    subtitle: 'Bulls vs Heat',
    date: '15/09, 20:00',
    newOdd: '1.65x',
    player: {
      name: 'Jimmy Butler',
      team: 'Miami Heat',
      image: playerJimmyButler,
      stat: 'Pontos',
      statValue: 'Mais de 19.5',
      sportIcon: iconBasquete,
    },
  },
  {
    id: 'pech-3',
    type: 'pechincha',
    category: 'pechinchas',
    title: 'O Rei em quadra!',
    tagLabel: 'Pechincha',
    tagColor: '#b1e8c9',
    tagIcon: iconPechincha,
    subtitle: 'Warriors vs Lakers',
    date: '14/09, 22:30',
    newOdd: '1.58x',
    player: {
      name: 'LeBron James',
      team: 'LA Lakers',
      image: playerLeBronJames,
      stat: 'Rebotes',
      statValue: 'Mais de 6.5',
      sportIcon: iconBasquete,
    },
  },
  {
    id: 'pech-4',
    type: 'pechincha',
    category: 'pechinchas',
    title: 'Mágica eslovena!',
    tagLabel: 'Pechincha',
    tagColor: '#b1e8c9',
    tagIcon: iconPechincha,
    subtitle: 'Warriors vs Lakers',
    date: '14/09, 22:30',
    newOdd: '1.75x',
    player: {
      name: 'Luka Dončić',
      team: 'LA Lakers',
      image: playerLukaDoncic,
      stat: 'Assistências',
      statValue: 'Mais de 7.5',
      sportIcon: iconBasquete,
    },
  },
  {
    id: 'pech-5',
    type: 'pechincha',
    category: 'pechinchas',
    title: 'Chef Curry!',
    tagLabel: 'Pechincha',
    tagColor: '#b1e8c9',
    tagIcon: iconPechincha,
    subtitle: 'Warriors vs Lakers',
    date: '14/09, 22:30',
    newOdd: '1.88x',
    player: {
      name: 'Stephen Curry',
      team: 'Golden State',
      image: playerStephenCurry,
      stat: 'Cestas de 3',
      statValue: 'Mais de 4.5',
      sportIcon: iconBasquete,
    },
  },
]

export function OffersSection() {
  const [isDragging, setIsDragging] = useState(false)
  const [activeFilter, setActiveFilter] = useState('melhores')
  const scrollRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const dragDistance = useRef(0)

  // Filtra ofertas baseado no chip ativo
  const filteredOffers = allOffers.filter(offer => offer.category === activeFilter)

  // Reset scroll position quando mudar o filtro
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0
    }
  }, [activeFilter])

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
    startX.current = e.touches[0].pageX
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    const x = e.touches[0].pageX
    dragDistance.current = startX.current - x
  }

  const handleTouchEnd = () => {
    const delta = dragDistance.current
    // Trigger snap before re-enabling scroll-snap for smoother transition
    snapToNearestCard(delta)
    // Small delay before re-enabling scroll-snap
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  return (
    <section id="section-ofertas" className="offers-section">
      {/* Header */}
      <div className="offers-section__header">
        <div className="offers-section__title">
          <img src={iconOfertasRei} alt="" className="offers-section__icon" />
          <span>Ofertas Imperdíveis</span>
        </div>
        <img src={setaLink} alt="Ver mais" className="offers-section__arrow" />
      </div>

      {/* Filter Chips */}
      <div className="offers-section__filters">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            className={`offers-section__chip ${activeFilter === chip.id ? 'offers-section__chip--active' : ''}`}
            onClick={() => setActiveFilter(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div 
        className={`offers-section__list ${isDragging ? 'offers-section__list--dragging' : ''}`}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredOffers.map((offer) => (
          <div key={offer.id} className={`offer-card offer-card--${offer.type.replace('_', '-')}`}>
            {/* Card Header */}
            <div className="offer-card__header">
              <h3 className="offer-card__title">{offer.title}</h3>
              <div className="offer-card__tag" style={{ color: offer.tagColor }}>
                <img src={offer.tagIcon} alt="" className="offer-card__tag-icon" />
                <span>{offer.tagLabel}</span>
              </div>
            </div>

            {/* Card Subheader */}
            <div className="offer-card__subheader">
              <span className="offer-card__subtitle">{offer.subtitle}</span>
              {offer.date && <span className="offer-card__date">{offer.date}</span>}
            </div>

            {/* Card Content - Events (for combinada type with teams) */}
            {offer.events && (
              <div className="offer-card__events">
                {offer.events.map((event, index) => (
                  <div key={index} className="offer-card__event">
                    <img src={event.team1Icon} alt="" className="offer-card__event-icon" />
                    <div className="offer-card__event-info">
                      <span className="offer-card__event-team">{event.team1}</span>
                      <span className="offer-card__event-dot">•</span>
                      <span className="offer-card__event-market">{event.market}</span>
                    </div>
                    <div className="offer-card__event-vs">
                      <span>vs</span>
                      <img src={event.team2Icon} alt="" className="offer-card__event-icon" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Card Content - Player Events (for combinada type with players) */}
            {offer.playerEvents && (
              <div className="offer-card__player-events">
                {offer.playerEvents.map((pEvent, index) => (
                  <div key={index} className="offer-card__player-event">
                    <img src={pEvent.icon} alt="" className="offer-card__player-event-icon" />
                    <div className="offer-card__player-event-info">
                      <span className="offer-card__player-event-name">{pEvent.name}</span>
                      <span className="offer-card__player-event-dot">•</span>
                      {pEvent.value && (
                        <>
                          <span className="offer-card__player-event-value">
                            {pEvent.value.includes('→') ? (
                              <>
                                <span className="offer-card__player-event-old-value">{pEvent.value.split('→')[0].trim()}</span>
                                <img src={iconBoostWhite} alt="" className="offer-card__player-event-arrow" />
                                <span className="offer-card__player-event-new-value">{pEvent.value.split('→')[1].trim()}</span>
                              </>
                            ) : (
                              pEvent.value
                            )}
                          </span>
                          <span className="offer-card__player-event-dot">•</span>
                        </>
                      )}
                      <span className="offer-card__player-event-market">{pEvent.market}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Card Content - Player (for player type) */}
            {offer.player && (
              <div className="offer-card__player">
                <div className="offer-card__player-avatar">
                  <img src={offer.player.image} alt={offer.player.name} className="offer-card__player-img" />
                  <div className="offer-card__player-badge offer-card__player-badge--sport">
                    <img src={offer.player.sportIcon || iconFutebol} alt="" />
                  </div>
                  <div className="offer-card__player-badge offer-card__player-badge--stat">
                    <img src={iconEstatistica} alt="" />
                  </div>
                </div>
                <div className="offer-card__player-info">
                  <span className="offer-card__player-name">{offer.player.name}</span>
                  <span className="offer-card__player-team">{offer.player.team}</span>
                </div>
                <div className="offer-card__player-stat">
                  <span className="offer-card__player-stat-value">{offer.player.statValue}</span>
                  <span className="offer-card__player-stat-label">{offer.player.stat}</span>
                </div>
              </div>
            )}

            {/* Card Content - Team Stat (for team-based super aumentada) */}
            {offer.teamStat && (
              <div className="offer-card__team-stat">
                <div className="offer-card__team-stat-avatar">
                  <img src={offer.teamStat.teamIcon} alt={offer.teamStat.teamName} className="offer-card__team-stat-icon" />
                  <div className="offer-card__team-stat-badge">
                    <img src={offer.teamStat.sportIcon || iconFutebol} alt="" />
                  </div>
                </div>
                <div className="offer-card__team-stat-info">
                  <span className="offer-card__team-stat-value">{offer.teamStat.statValue} {offer.teamStat.stat}</span>
                  <span className="offer-card__team-stat-name">{offer.teamStat.teamName}</span>
                </div>
              </div>
            )}

            {/* Card Footer */}
            <div className={`offer-card__footer ${offer.showViewAll ? 'offer-card__footer--with-viewall' : ''}`}>
              {offer.showViewAll && (
                <button className="offer-card__viewall">
                  <span>Ver todos ({offer.showViewAll})</span>
                  <img src={arrowDown} alt="" className="offer-card__viewall-icon" />
                </button>
              )}
              <div className="offer-card__button">
                <div className="offer-card__odds">
                  {offer.oldOdd && (
                    <>
                      <span className="offer-card__old-odd">{offer.oldOdd}</span>
                      <img src={iconBoost} alt="" className="offer-card__boost-icon" />
                    </>
                  )}
                  <span className="offer-card__new-odd">{offer.newOdd}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

