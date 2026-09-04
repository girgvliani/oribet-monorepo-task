import { IconChevronDown } from '../../icons'
import { useClickOutside } from '../../hooks/useClickOutside'
import { zIndex, fontSize, fontWeight, lineHeight } from '../../tokens'
import { CSSProperties, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

interface SelectItem {
  value: string | number
  renderer: () => ReactNode
  searchLabel?: string
}

interface ICustomSelect {
  label?: string
  value: string
  onChange: (event: { target: { value: string } }) => void
  data: SelectItem[]
  searchable?: boolean
  isRequired?: boolean
  placeholder?: string
  error?: string
  testId?: string
  style?: CSSProperties
}

const CustomSelect = ({
  label,
  value,
  onChange,
  data = [],
  searchable,
  isRequired,
  placeholder,
  error,
  testId,
  style,
}: ICustomSelect) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedItem = data.find(item => String(item.value) === String(value))

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearch('')
  }, [])
  useClickOutside([selectRef], handleClose, isOpen)

  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearch('')
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }

  const handleSelect = (itemValue: string | number) => {
    onChange({ target: { value: String(itemValue) } })
    setIsOpen(false)
    setSearch('')
  }

  const filteredData = useMemo(() => {
    if (!searchable || !search) return data
    const q = search.toLowerCase()
    return data.filter(item => {
      if (item.searchLabel) return item.searchLabel.toLowerCase().includes(q)
      return String(item.value).toLowerCase().includes(q)
    })
  }, [data, search, searchable])

  return (
    <SelectWrapper ref={selectRef}>
      {label && (
        <Label>
          {label}
          {isRequired && <RequiredMark aria-hidden="true">*</RequiredMark>}
        </Label>
      )}
      <SelectButton
        type="button"
        data-testid={testId}
        onClick={handleOpen}
        $isOpen={isOpen}
        $error={!!error}
        style={style}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={!!error}
      >
        <SelectValue>
          {selectedItem ? (
            selectedItem.renderer()
          ) : placeholder ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            label
          )}
        </SelectValue>
        <ChevronIcon $isOpen={isOpen}>
          <IconChevronDown size={20} />
        </ChevronIcon>
      </SelectButton>

      {isOpen && (
        <DropdownMenu role="listbox">
          {searchable && (
            <SearchInput
              ref={searchInputRef}
              data-testid={testId ? `${testId}.search` : undefined}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          )}
          {filteredData.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSelect(item.value)}
              $isSelected={String(item.value) === String(value)}
              role="option"
              aria-selected={String(item.value) === String(value)}
              data-testid={testId ? `${testId}.${String(item.value)}` : undefined}
            >
              {item.renderer()}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}

      {error && (
        <ErrorContainer role="alert" data-testid={testId ? `${testId}-error` : undefined}>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}
    </SelectWrapper>
  )
}

export default CustomSelect

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
`

const Label = styled.span`
  padding: 0px 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  line-height: ${lineHeight.normal};
  text-transform: uppercase;
`

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  margin-left: 4px;
`

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const SelectButton = styled.button<{ $isOpen: boolean; $error?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-family: inherit;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.bg.primary};
  background: ${({ theme }) => theme.colors.bg.primary};
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.surface.hover};
  }

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      border-color: ${({ theme }) => theme.colors.surface.hover};
    `}

  ${({ $error }) =>
    $error &&
    css`
      border-color: ${({ theme }) => theme.colors.error};
    `}
`

const SelectValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.normal};
  line-height: ${lineHeight.normal};
  display: flex;
  align-items: center;
`

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-in-out;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: rotate(180deg);
    `}
`

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.secondary};
  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto;
  z-index: ${zIndex.modal};
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.surface.hover};
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.normal};
  outline: none;
  position: sticky;
  top: 0;
  z-index: 1;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`

const MenuItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.bg.primary : theme.colors.bg.secondary};

  &:hover {
    background: ${({ theme }) => theme.colors.bg.primary};
  }
`

const ErrorContainer = styled.div`
  border-radius: 8px;
  padding: 4px 16px;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
`

const ErrorText = styled.p`
  font-size: ${fontSize.sm};
  line-height: ${lineHeight.normal};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`
