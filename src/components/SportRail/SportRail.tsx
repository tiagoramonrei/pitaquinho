import { useState, useEffect } from 'react'
import './SportRail.css'

// Importando ícones dos assets
import iconCassino from '../../assets/iconCassino.png'
import iconPromocao from '../../assets/iconPromocao.png'
import iconFutebol from '../../assets/iconFutebol.png'
import iconBasquete from '../../assets/iconBasquete.png'
import iconVirtuais from '../../assets/iconVirtuais.png'
import iconF1 from '../../assets/iconF1.png'
import iconTenis from '../../assets/iconTenis.png'
import iconEsoccer from '../../assets/iconEsoccer.png'
import iconFutebolAmericano from '../../assets/iconFutebolAmericano.png'
import iconVolei from '../../assets/iconVolei.png'
import iconTenisMesa from '../../assets/iconTenisMesa.png'
import iconValorant from '../../assets/iconValorant.png'
import iconEbasketball from '../../assets/iconEbasketball.png'
import iconHandebol from '../../assets/iconHandebol.png'
import iconBaisebol from '../../assets/iconBaisebol.png'
import iconDota from '../../assets/iconDota.png'
import iconLoL from '../../assets/iconLoL.png'

interface SportItem {
  icon: string
  label: string
}

const sports: SportItem[] = [
  { icon: iconCassino, label: 'Cassino' },
  { icon: iconPromocao, label: 'Promoções' },
  { icon: iconFutebol, label: 'Futebol' },
  { icon: iconBasquete, label: 'Basquete' },
  { icon: iconVirtuais, label: 'Virtuais' },
  { icon: iconF1, label: 'F1' },
  { icon: iconTenis, label: 'Tênis' },
  { icon: iconEsoccer, label: 'Esoccer' },
  { icon: iconFutebolAmericano, label: 'Fut. Americano' },
  { icon: iconVolei, label: 'Vôlei' },
  { icon: iconTenisMesa, label: 'Tênis Mesa' },
  { icon: iconValorant, label: 'Valorant' },
  { icon: iconEbasketball, label: 'Ebasketball' },
  { icon: iconHandebol, label: 'Handebol' },
  { icon: iconBaisebol, label: 'Beisebol' },
  { icon: iconDota, label: 'Dota 2' },
  { icon: iconLoL, label: 'LoL' },
]

export function SportRail() {
  const [gap, setGap] = useState(12)

  useEffect(() => {
    const calculateGap = () => {
      const itemWidth = 56
      const paddingLeft = 12
      const viewportWidth = window.innerWidth
      const minGap = 8
      const maxGap = 24

      // Tenta encontrar o número de itens que resulta em um gap válido
      // Começamos com mais itens e vamos reduzindo até encontrar um gap aceitável
      for (let fullItems = 8; fullItems >= 1; fullItems--) {
        // Calcula o gap necessário para mostrar fullItems completos + 50% do próximo
        // Fórmula: paddingLeft + fullItems * itemWidth + fullItems * gap + 0.5 * itemWidth = viewportWidth
        const calculatedGap = (viewportWidth - paddingLeft - (fullItems + 0.5) * itemWidth) / fullItems
        
        // Se o gap está dentro do range aceitável, usa esse valor
        if (calculatedGap >= minGap && calculatedGap <= maxGap) {
          setGap(calculatedGap)
          return
        }
      }
      
      // Fallback: usa gap padrão
      setGap(12)
    }

    calculateGap()
    window.addEventListener('resize', calculateGap)
    return () => window.removeEventListener('resize', calculateGap)
  }, [])

  return (
    <div className="sport-rail">
      <div className="sport-rail__list" style={{ gap: `${gap}px` }}>
        {sports.map((sport, index) => (
          <button key={index} className="sport-rail__item">
            <div className="sport-rail__icon">
              <img src={sport.icon} alt={sport.label} />
            </div>
            <span className="sport-rail__label">{sport.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

