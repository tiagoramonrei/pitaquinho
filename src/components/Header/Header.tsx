import './Header.css'
import logoRei from '../../assets/logoRei.svg'
import iconDeposito from '../../assets/iconDeposito.png'
import iconHamburguer from '../../assets/iconHamburguer.png'

export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        {/* Logo */}
        <div className="header__logo">
          <img src={logoRei} alt="Rei do Pitaco" />
        </div>

        {/* Saldo e Botões */}
        <div className="header__actions">
          {/* Saldo */}
          <div className="header__balance">
            <span className="header__balance-label">Saldo</span>
            <span className="header__balance-value">R$ 0,00</span>
          </div>

          {/* Botões */}
          <div className="header__buttons">
            <button className="header__btn header__btn--deposit" aria-label="Depositar">
              <img src={iconDeposito} alt="Depositar" />
            </button>
            <button className="header__btn header__btn--menu" aria-label="Menu">
              <img src={iconHamburguer} alt="Menu" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

