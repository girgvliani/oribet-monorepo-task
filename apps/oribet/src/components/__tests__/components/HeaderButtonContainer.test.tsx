import { HeaderButtonContainer } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('calls onClick when clicked', () => {
  const handleClick = vi.fn()
  render(<HeaderButtonContainer onClick={handleClick}>Click Me</HeaderButtonContainer>)
  fireEvent.click(screen.getByText('Click Me'))
  expect(handleClick).toHaveBeenCalled()
})
