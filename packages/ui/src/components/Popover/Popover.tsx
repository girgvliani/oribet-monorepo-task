import { zIndex } from '../../tokens'
import {
  ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
  CSSProperties
} from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

type VerticalOrigin = 'top' | 'center' | 'bottom'
type HorizontalOrigin = 'left' | 'center' | 'right'

interface PopoverOrigin {
  vertical: VerticalOrigin
  horizontal: HorizontalOrigin
}

export interface PopoverProps {
  id?: string
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  children: ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  style?: CSSProperties
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  marginTop?: number
  marginLeft?: number
}

const Popover = ({
  id,
  open,
  anchorEl,
  onClose,
  children,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  style,
  className,
  marginTop = 0,
  marginLeft = 0,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby
}: PopoverProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)

  // Calculate position based on anchor element and origins
  const updatePosition = useCallback(() => {
    if (!anchorEl) return

    const anchorRect = anchorEl.getBoundingClientRect()
    let top = 0
    let left = 0

    // Calculate anchor point based on anchorOrigin
    switch (anchorOrigin.vertical) {
      case 'top':
        top = anchorRect.top
        break
      case 'center':
        top = anchorRect.top + anchorRect.height / 2
        break
      case 'bottom':
        top = anchorRect.bottom
        break
    }

    switch (anchorOrigin.horizontal) {
      case 'left':
        left = anchorRect.left
        break
      case 'center':
        left = anchorRect.left + anchorRect.width / 2
        break
      case 'right':
        left = anchorRect.right
        break
    }

    // Add margins
    top += marginTop
    left += marginLeft

    setPosition({ top, left })
  }, [anchorEl, anchorOrigin, marginTop, marginLeft])

  // Handle open/close animation
  useEffect(() => {
    if (open) {
      setShouldRender(true)
      updatePosition()
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 200) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [open, updatePosition])

  // Update position on scroll/resize
  useEffect(() => {
    if (!open) return

    const handleUpdate = () => updatePosition()

    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [open, updatePosition])

  // Handle click outside (but not on anchor - anchor handles its own toggle)
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Ignore clicks on anchor - let the anchor's onClick handle toggle
      if (anchorEl && anchorEl.contains(target)) {
        return
      }

      // Close if click is outside the popover
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose, anchorEl])

  // Handle escape key
  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!shouldRender) return null

  return createPortal(
    <PopoverContainer
      id={id}
      ref={popoverRef}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      $isVisible={isVisible}
      $top={position.top}
      $left={position.left}
      $transformOrigin={transformOrigin}
      style={style}
      className={className}
    >
      {children}
    </PopoverContainer>,
    document.body
  )
}

export default Popover

const getTransformOrigin = (origin: PopoverOrigin): string => {
  const vertical =
    origin.vertical === 'center' ? 'center' : origin.vertical === 'top' ? 'top' : 'bottom'
  const horizontal =
    origin.horizontal === 'center' ? 'center' : origin.horizontal === 'left' ? 'left' : 'right'
  return `${horizontal} ${vertical}`
}

const getTranslate = (origin: PopoverOrigin): string => {
  let x = '0'
  let y = '0'

  // Horizontal offset based on transformOrigin
  switch (origin.horizontal) {
    case 'left':
      x = '0'
      break
    case 'center':
      x = '-50%'
      break
    case 'right':
      x = '-100%'
      break
  }

  // Vertical offset based on transformOrigin
  switch (origin.vertical) {
    case 'top':
      y = '0'
      break
    case 'center':
      y = '-50%'
      break
    case 'bottom':
      y = '-100%'
      break
  }

  return `translate(${x}, ${y})`
}

const PopoverContainer = styled.div<{
  $isVisible: boolean
  $top: number
  $left: number
  $transformOrigin: PopoverOrigin
}>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  z-index: ${zIndex.popover};
  transform-origin: ${({ $transformOrigin }) => getTransformOrigin($transformOrigin)};
  transform: ${({ $transformOrigin }) => getTranslate($transformOrigin)};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.2s ease-out;
`
