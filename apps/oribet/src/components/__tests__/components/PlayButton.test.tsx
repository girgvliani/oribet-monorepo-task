import { PlayButton } from '@oribet/modules/game-card'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('PlayButton renders and triggers onClick', () => {
  const mockOnClick = vi.fn()
  render(<PlayButton onClick={mockOnClick} />)
  fireEvent.click(screen.getByRole('button'))
  expect(mockOnClick).toHaveBeenCalled()
})
