import { useEffect, useState } from 'react'
import './Toast.css'

import iconOk from '../../assets/iconOk.svg'
import iconFecharPeq from '../../assets/iconFecharPeq.svg'

interface ToastProps {
  isVisible: boolean
  onClose: () => void
  title: string
  message: string
  duration?: number
}

export function Toast({
  isVisible,
  onClose,
  title,
  message,
  duration = 4000,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Handle open/close with animation
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender && !isClosing) {
      setIsClosing(true)
      setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 300)
    }
  }, [isVisible])

  // Auto dismiss
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShouldRender(false)
      setIsClosing(false)
      onClose()
    }, 300)
  }

  if (!shouldRender) return null

  return (
    <div className={`toast ${isClosing ? 'toast--closing' : ''}`}>
      <div className="toast__header">
        <div className="toast__title">
          <img src={iconOk} alt="" className="toast__icon-ok" />
          <span>{title}</span>
        </div>
        <button className="toast__close" onClick={handleClose}>
          <img src={iconFecharPeq} alt="Fechar" className="toast__icon-close" />
        </button>
      </div>
      <div className="toast__content">
        <p>{message}</p>
      </div>
    </div>
  )
}
