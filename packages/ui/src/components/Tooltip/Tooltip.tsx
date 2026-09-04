import { ReactNode, useState, useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { zIndex, fontSize, fontWeight, lineHeight } from '../../tokens'

interface TooltipProps {
  title: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  arrow?: boolean
}

const Tooltip = ({
  title,
  children,
  placement = 'bottom',
  arrow = false
}: TooltipProps) => {
  const tooltipId = useId()
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.right + 8
          break
      }

      // Keep tooltip within viewport
      const padding = 8
      if (left < padding) left = padding
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding
      }
      if (top < padding) top = padding
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding
      }

      setPosition({ top, left })
    }
  }, [isVisible, placement])

  if (!title) {
    return <>{children}</>
  }

  return (
    <>
      <TriggerWrapper
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </TriggerWrapper>
      {isVisible &&
        createPortal(
          <TooltipContainer
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={{ top: position.top, left: position.left }}
            $placement={placement}
          >
            {title}
            {arrow && <Arrow $placement={placement} />}
          </TooltipContainer>,
          document.body
        )}
    </>
  )
}

export default Tooltip

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const TriggerWrapper = styled.div`
  display: inline-flex;
`

const TooltipContainer = styled.div<{ $placement: string }>`
  position: fixed;
  z-index: ${zIndex.tooltip};
  background-color: ${({ theme }) => theme.colors.surface.hover};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
  white-space: nowrap;
  animation: ${fadeIn} 0.2s ease-in-out;
  pointer-events: none;
`

const Arrow = styled.div<{ $placement: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;

  ${({ $placement, theme }) => {
    const color = theme.colors.surface.hover
    switch ($placement) {
      case 'top':
        return `
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: ${color};
        `
      case 'bottom':
        return `
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-color: ${color};
        `
      case 'left':
        return `
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          border-left-color: ${color};
        `
      case 'right':
        return `
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          border-right-color: ${color};
        `
      default:
        return ''
    }
  }}
`
