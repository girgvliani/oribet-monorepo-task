import {
  ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { zIndex, duration } from '../../tokens'

/** Duration in ms for JS timeouts — must match CSS animation duration */
const MODAL_ANIMATION_MS = 200

interface CustomModalProps {
  children: ReactNode
  open: boolean
  onClose: () => void
  fullScreen?: string
  customStyle?: React.CSSProperties
  className?: string
  shouldBeScreenHeight?: boolean
  /** Inset the backdrop + modal from the top (e.g. to keep a fixed header visible/tappable). */
  insetTop?: string
  /** Inset the backdrop + modal from the bottom (e.g. to keep a fixed bottom nav visible). */
  insetBottom?: string
  testId?: string
}

const CustomModal = ({
  children,
  open,
  onClose,
  className,
  fullScreen,
  customStyle = {},
  shouldBeScreenHeight,
  insetTop,
  insetBottom,
  testId,
}: CustomModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  // Whether the press that produced the current click started on the backdrop itself.
  const pressStartedOnBackdrop = useRef(false)

  // Focus trap
  useEffect(() => {
    if (open && modalRef.current) {
      previousFocusRef.current = document.activeElement as HTMLElement
      modalRef.current.focus()
    }
    return () => {
      if (!open && previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
    }
  }, [open])

  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !modalRef.current) return

    const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableEls.length === 0) return

    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        lastEl.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus()
        e.preventDefault()
      }
    }
  }, [])

  // Handle opening/closing with animation
  useEffect(() => {
    if (open) {
      setShouldRender(true)
      // Small delay to ensure DOM is ready before triggering animation
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    } else {
      setIsVisible(false)
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, MODAL_ANIMATION_MS)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Body scroll lock
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [open])

  // Record where the press started so a text-selection drag that begins inside the
  // modal and releases on the backdrop doesn't close it. (Chrome fires `click` on the
  // common ancestor of mousedown/mouseup — the backdrop — even though the press began
  // inside the modal.)
  const handleBackdropMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    pressStartedOnBackdrop.current = e.target === backdropRef.current
  }, [])

  // Close only when the press both started and ended on the backdrop itself.
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current && pressStartedOnBackdrop.current) {
        onClose()
      }
    },
    [onClose]
  )

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!shouldRender) return null

  return createPortal(
    <Backdrop
      ref={backdropRef}
      data-testid={testId ? `${testId}.backdrop` : undefined}
      $isVisible={isVisible}
      $insetTop={insetTop}
      $insetBottom={insetBottom}
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
      className={className}
    >
      <ModalContainer
        ref={modalRef}
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        $isVisible={isVisible}
        $fullScreen={fullScreen}
        $shouldBeScreenHeight={shouldBeScreenHeight}
        style={customStyle}
      >
        {children}
      </ModalContainer>
    </Backdrop>,
    document.body
  )
}

export default CustomModal

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Backdrop = styled.div<{ $isVisible: boolean; $insetTop?: string; $insetBottom?: string }>`
  position: fixed;
  top: ${({ $insetTop }) => $insetTop || '0'};
  left: 0;
  right: 0;
  bottom: ${({ $insetBottom }) => $insetBottom || '0'};
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} ${duration.normal} ease-out
    forwards;
`

const ModalContainer = styled.div<{
  $isVisible: boolean
  $fullScreen?: string
  $shouldBeScreenHeight?: boolean
}>`
  position: absolute;
  top: ${({ $shouldBeScreenHeight }) => ($shouldBeScreenHeight ? '0' : '50%')};
  left: 50%;
  transform: ${({ $shouldBeScreenHeight }) =>
    $shouldBeScreenHeight ? 'translateX(-50%)' : 'translate(-50%, -50%)'};
  width: ${({ $fullScreen }) => $fullScreen || 'auto'};
  ${({ $shouldBeScreenHeight }) =>
    $shouldBeScreenHeight &&
    `
    bottom: 0;
    height: 100%;
  `}
  outline: none;

  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} ${duration.normal} ease-out
    forwards;
`
