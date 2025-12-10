import { BottomSheet } from './BottomSheet'
import './ReiAntecipaBottomSheet.css'

import iconReiAntecipaFutebol from '../../assets/iconReiAntecipaFutebol.png'
import iconReiAntecipaBasquete from '../../assets/iconReiAntecipaBasquete.png'

interface ReiAntecipaBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  sport: 'futebol' | 'basquete'
}

export function ReiAntecipaBottomSheet({ isOpen, onClose, sport }: ReiAntecipaBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Rei Antecipa"
    >
      <div className="rei-antecipa-content">
        <img 
          src={sport === 'basquete' ? iconReiAntecipaBasquete : iconReiAntecipaFutebol} 
          alt="" 
          className="rei-antecipa-content__icon"
        />
        <div className="rei-antecipa-content__info">
          <h3 className="rei-antecipa-content__title">
            {sport === 'basquete' 
              ? 'Pagamento antecipado com 20 pontos de Vantagem'
              : 'Pagamento antecipado com 2 gols de Vantagem'
            }
          </h3>
          <p className="rei-antecipa-content__description">
            {sport === 'basquete'
              ? 'Receba antecipadamente o pagamento da sua aposta assim que o time em que você apostou abrir uma vantagem de 20 pontos, não importa o resultado final da partida.'
              : 'Receba antecipadamente o pagamento da sua aposta assim que o time em que você apostou abrir uma vantagem de 2 gols, não importa o resultado final da partida.'
            }
          </p>
        </div>
      </div>
    </BottomSheet>
  )
}
