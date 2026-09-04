import { CustomMinimalButton } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('CustomMinimalButton renders correctly', () => {
  render(<CustomMinimalButton>Test</CustomMinimalButton>)
  expect(screen.getByText('Test')).toBeInTheDocument()
})

test('CustomMinimalButton shows loader when loading', () => {
  render(<CustomMinimalButton loading={true}>Test</CustomMinimalButton>)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

test('CustomMinimalButton calls onClick when clicked', () => {
  const handleClick = vi.fn()
  render(<CustomMinimalButton onClick={handleClick}>Click Me</CustomMinimalButton>)
  fireEvent.click(screen.getByText('Click Me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
