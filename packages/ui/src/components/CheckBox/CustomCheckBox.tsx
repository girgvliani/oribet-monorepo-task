import { ChangeEvent } from 'react'
import styled from 'styled-components'

interface ICustomCheckBox {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  testId?: string
}

const CustomCheckBox = ({ onChange, checked, testId }: ICustomCheckBox) => {
  return (
    <CheckboxWrapper>
      <HiddenCheckbox
        type="checkbox"
        data-testid={testId}
        checked={checked}
        onChange={(e) => onChange && onChange(e)}
      />
      <StyledCheckbox $checked={checked}>
        {checked && (
          <CheckIcon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </CheckIcon>
        )}
      </StyledCheckbox>
    </CheckboxWrapper>
  )
}

export default CustomCheckBox

const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const StyledCheckbox = styled.div<{ $checked?: boolean }>`
  width: 14px;
  height: 14px;
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ $checked, theme }) => ($checked ? theme.colors.success : theme.colors.surface.hover)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  ${({ $checked, theme }) =>
    $checked &&
    `
    background: ${theme.colors.success};
    border-color: ${theme.colors.success};
  `}
`

const CheckIcon = styled.svg`
  width: 10px;
  height: 10px;
  fill: none;
  stroke: ${({ theme }) => theme.colors.bg.primary};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`
