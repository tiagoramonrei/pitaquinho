import './Navbar.css'

import iconFooterHome from '../../assets/iconFooterHome.png'
import iconFooterBuscar from '../../assets/iconFooterBuscar.png'
import iconFooterAoVivo from '../../assets/iconFooterAoVivo.png'
import iconFooterMinhasApostas from '../../assets/iconFooterMinhasApostas.png'
import iconFooterCassino from '../../assets/iconFooterCassino.png'

interface NavItem {
  id: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { id: 'home', icon: iconFooterHome, label: 'Início' },
  { id: 'buscar', icon: iconFooterBuscar, label: 'Buscar' },
  { id: 'aovivo', icon: iconFooterAoVivo, label: 'Ao Vivo' },
  { id: 'apostas', icon: iconFooterMinhasApostas, label: 'Apostas' },
  { id: 'cassino', icon: iconFooterCassino, label: 'Cassino' },
]

export function Navbar() {
  // Por enquanto, o item ativo é fixo em "home"
  const activeItem = 'home'

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`navbar__item ${activeItem === item.id ? 'navbar__item--active' : ''}`}
          >
            <img src={item.icon} alt={item.label} className="navbar__icon" />
            <span className="navbar__label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

