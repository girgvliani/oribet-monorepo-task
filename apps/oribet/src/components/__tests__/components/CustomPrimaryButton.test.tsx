import { CustomPrimaryButton } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('CustomPrimaryButton renders correctly', () => {
  render(<CustomPrimaryButton>Test</CustomPrimaryButton>)
  expect(screen.getByText('Test')).toBeInTheDocument()
})

test('CustomPrimaryButton shows loader when loading', () => {
  render(<CustomPrimaryButton loading={true}>Test</CustomPrimaryButton>)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

test('CustomPrimaryButton calls onClick when clicked', () => {
  const handleClick = vi.fn()
  render(<CustomPrimaryButton onClick={handleClick}>Click Me</CustomPrimaryButton>)
  fireEvent.click(screen.getByText('Click Me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
