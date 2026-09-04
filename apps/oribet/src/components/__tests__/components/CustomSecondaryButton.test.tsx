import { CustomSecondaryButton } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('CustomSecondaryButton renders correctly', () => {
  render(<CustomSecondaryButton>Test</CustomSecondaryButton>)
  expect(screen.getByText('Test')).toBeInTheDocument()
})

test('CustomSecondaryButton shows loader when loading', () => {
  render(<CustomSecondaryButton loading={true}>Test</CustomSecondaryButton>)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

test('CustomSecondaryButton calls onClick when clicked', () => {
  const handleClick = vi.fn()
  render(<CustomSecondaryButton onClick={handleClick}>Click Me</CustomSecondaryButton>)
  fireEvent.click(screen.getByText('Click Me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
