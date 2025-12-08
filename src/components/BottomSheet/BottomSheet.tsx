import { useEffect, useState, useRef, type ReactNode } from 'react'
import './BottomSheet.css'

import iconAccordion from '../../assets/iconAccordion.png'
import iconFechar from '../../assets/iconFechar.svg'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  titleIcon?: string
  children: ReactNode
  footerContent?: ReactNode
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  footerContent,
}: BottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Check scroll position
  const handleScroll = () => {
    if (!bodyRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = bodyRef.current
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setShowScrollIndicator(!isAtBottom)
  }

  // Check if content is scrollable on mount/update
  useEffect(() => {
    if (shouldRender && bodyRef.current) {
      const { scrollHeight, clientHeight } = bodyRef.current
      const hasScroll = scrollHeight > clientHeight
      setShowScrollIndicator(hasScroll)
    }
  }, [shouldRender, children])

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender && !isClosing) {
      // Trigger closing animation when isOpen becomes false
      setIsClosing(true)
      setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 300)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShouldRender(false)
      setIsClosing(false)
      onClose()
    }, 300) // Match animation duration
  }

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [shouldRender])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    if (shouldRender) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div className="bottom-sheet__container">
      {/* Overlay - separate from bottom sheet for independent animation */}
      <div 
        className={`bottom-sheet__overlay ${isClosing ? 'bottom-sheet__overlay--closing' : ''}`} 
        onClick={handleClose}
      />
      
      {/* Bottom Sheet */}
      <div
        className={`bottom-sheet ${isClosing ? 'bottom-sheet--closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="bottom-sheet__header">
          <div className="bottom-sheet__title">
            {titleIcon && (
              <img src={titleIcon} alt="" className="bottom-sheet__title-icon" />
            )}
            <span>{title}</span>
          </div>
          <button className="bottom-sheet__close" onClick={handleClose}>
            <img src={iconFechar} alt="Fechar" className="bottom-sheet__close-icon" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="bottom-sheet__body-wrapper">
          <div 
            className="bottom-sheet__body"
            ref={bodyRef}
            onScroll={handleScroll}
          >
            {children}
          </div>
          <div 
            className={`bottom-sheet__scroll-indicator ${showScrollIndicator ? '' : 'bottom-sheet__scroll-indicator--hidden'}`}
          />
        </div>

        {/* Footer - Fixed */}
        {footerContent && (
          <div className="bottom-sheet__footer">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable sub-components for mission content
interface MissionObjectiveProps {
  text: string
  completed?: boolean
}

export function MissionObjective({ text, completed = false }: MissionObjectiveProps) {
  return (
    <div className="mission-objective">
      <div className={`mission-objective__radio ${completed ? 'mission-objective__radio--completed' : ''}`}>
        {completed && <span className="mission-objective__check">✓</span>}
      </div>
      <span className="mission-objective__text">{text}</span>
    </div>
  )
}

interface MissionInfoRowProps {
  label: string
  value: string
}

export function MissionInfoRow({ label, value }: MissionInfoRowProps) {
  return (
    <div className="mission-info-row">
      <span className="mission-info-row__label">{label}</span>
      <span className="mission-info-row__value">{value}</span>
    </div>
  )
}

interface MissionFaqItemProps {
  question: string
  answer?: string
  isOpen?: boolean
  onClick?: () => void
}

export function MissionFaqItem({ question, onClick }: MissionFaqItemProps) {
  return (
    <button className="mission-faq-item" onClick={onClick}>
      <span className="mission-faq-item__question">{question}</span>
      <img src={iconAccordion} alt="" className="mission-faq-item__icon" />
    </button>
  )
}

interface MissionTimerProps {
  text: string
}

export function MissionTimer({ text }: MissionTimerProps) {
  return (
    <div className="mission-timer">
      <div className="mission-timer__dot" />
      <span className="mission-timer__text">{text}</span>
    </div>
  )
}
