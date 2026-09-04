import { IconChevronDown } from '../../icons'
import { zIndex, fontSize, fontWeight, lineHeight } from '../../tokens'
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css, keyframes, useTheme } from 'styled-components'

export interface SelectChangeEvent {
  target: {
    value: string
  }
}

interface SelectOption {
  value: string
  renderer: () => ReactNode
}

interface SelectProps {
  value: string | string[]
  onChange?: (event: SelectChangeEvent) => void
  onOpen?: () => void
  onClose?: () => void
  data: SelectOption[]
  label?: string
  secondLabel?: string | ReactNode
  minWidth?: number
  multiple?: boolean
  displayEmpty?: boolean
  renderValue?: (value: string | string[]) => ReactNode
  className?: string
  children?: ReactNode
  IconComponent?: () => ReactNode | null
  header?: ReactNode
  footer?: ReactNode
  emptyMessage?: ReactNode
  /** Dropdown horizontal alignment relative to the trigger. `right` keeps an
   *  edge-anchored trigger's menu from overflowing the viewport. Defaults to `left`. */
  align?: 'left' | 'right'
  /** data-testid on the trigger; each option gets its own unique `${testId}.${value}`. */
  testId?: string
}

const Select = ({
  value,
  onChange,
  onOpen,
  onClose,
  data = [],
  label,
  secondLabel,
  minWidth,
  multiple = false,
  displayEmpty = false,
  renderValue,
  className,
  children,
  IconComponent,
  header,
  footer,
  emptyMessage,
  align = 'left',
  testId
}: SelectProps) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0, width: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Position the portalled dropdown BEFORE paint (layout effect) so it never renders
  // for a frame at the initial {0,0} corner — which, when the page is scrolled, lands
  // off-screen and looks like the dropdown "didn't open". Re-anchor on scroll/resize.
  useLayoutEffect(() => {
    if (!isOpen) return
    const updatePosition = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        right: document.documentElement.clientWidth - rect.right,
        width: rect.width
      })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleOpen = () => {
    setIsOpen(true)
    onOpen?.()
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  // Toggle on trigger click so an already-open (or wrongly-stuck-open) dropdown can
  // always be closed/reopened without a page refresh.
  const handleToggle = () => {
    if (isOpen) handleClose()
    else handleOpen()
  }

  const handleSelect = (itemValue: string) => {
    if (!multiple) {
      onChange?.({ target: { value: itemValue } })
      handleClose()
    } else {
      onChange?.({ target: { value: itemValue } })
    }
  }

  const renderDisplayValue = () => {
    if (renderValue) {
      return renderValue(value)
    }

    if (label || secondLabel) {
      return (
        <RenderLabelContainer>
          {label && <LabelKey>{label}</LabelKey>}
          {secondLabel && <LabelValue>{secondLabel}</LabelValue>}
        </RenderLabelContainer>
      )
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    const selectedItem = data.find((item) => item.value === value)
    return selectedItem ? selectedItem.renderer() : ''
  }

  const defaultIcon = () => (
    <ChevronIcon $isOpen={isOpen}>
      <IconChevronDown size={16} style={{ color: theme.colors.success }} />
    </ChevronIcon>
  )

  return (
    <>
      <SelectTrigger
        ref={triggerRef}
        onClick={handleToggle}
        data-testid={testId}
        $isOpen={isOpen}
        $minWidth={minWidth}
        className={`${className} ${isOpen ? 'selectOpen' : ''}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle() }
          if (e.key === 'Escape' && isOpen) { e.preventDefault(); handleClose() }
        }}
      >
        <SelectValue>{renderDisplayValue()}</SelectValue>
        {IconComponent ? IconComponent() : defaultIcon()}
      </SelectTrigger>

      {isOpen &&
        createPortal(
          <Dropdown
            ref={dropdownRef}
            $top={position.top}
            $left={position.left}
            $right={position.right}
            $width={position.width}
            $align={align}
            role="listbox"
            aria-multiselectable={multiple || undefined}
          >
            {header}
            {children ? (
              children
            ) : (
              <DropdownList>
                {data.length === 0 && emptyMessage ? (
                  emptyMessage
                ) : (
                  data.map((item, index) => {
                    const isSelected = multiple
                      ? Array.isArray(value) && value.includes(item.value)
                      : value === item.value
                    return (
                      <DropdownItem
                        key={index}
                        onClick={() => handleSelect(item.value)}
                        $isSelected={isSelected}
                        role="option"
                        aria-selected={isSelected}
                        data-testid={testId ? `${testId}.${String(item.value)}` : undefined}
                      >
                        {item.renderer()}
                      </DropdownItem>
                    )
                  })
                )}
              </DropdownList>
            )}
            {footer}
          </Dropdown>,
          document.body
        )}
    </>
  )
}

export default Select

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const SelectTrigger = styled.div<{ $isOpen: boolean; $minWidth?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.primary};
  box-shadow: ${({ theme }) => theme.colors.shadow.header};
  cursor: pointer;
  transition: border-color 0.3s ease-in-out, background 0.3s ease-in-out;
  min-width: ${({ $minWidth }) => ($minWidth ? `${$minWidth}px` : 'auto')};
  box-sizing: border-box;

  &:hover {
    background: ${({ theme }) => theme.colors.bg.secondary};
  }

  ${({ $isOpen, theme }) =>
    $isOpen &&
    css`
      background: ${({ theme }) => theme.colors.bg.secondary};
    `}
`

const SelectValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.normal};
  line-height: ${lineHeight.normal};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const RenderLabelContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0px;
  box-sizing: border-box;
  gap: 21px;
`

const LabelKey = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
`

const LabelValue = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
`

const Dropdown = styled.div<{
  $top: number
  $left: number
  $right: number
  $width: number
  $align: 'left' | 'right'
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $align, $left }) => ($align === 'right' ? 'auto' : `${$left}px`)};
  right: ${({ $align, $right }) => ($align === 'right' ? `${$right}px` : 'auto')};
  min-width: ${({ $width }) => $width}px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: ${({ theme }) => theme.colors.shadow.sidebar};
  z-index: ${zIndex.selectPortal};
  animation: ${fadeIn} 0.15s ease-out;
  max-height: 400px;
  overflow: auto;
  box-sizing: border-box;
`

const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
  transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.bg.primary : theme.colors.bg.secondary};
  border: 1px solid;
  border-color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.surface.border : theme.colors.bg.secondary};

  &:hover {
    background: ${({ theme }) => theme.colors.bg.primary};
    border-color: ${({ theme }) => theme.colors.surface.hover};
  }
`
