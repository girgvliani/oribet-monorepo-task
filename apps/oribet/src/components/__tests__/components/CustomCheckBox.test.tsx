import { CustomCheckBox } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('toggles check state on click', () => {
  const handleChange = vi.fn()
  render(<CustomCheckBox onChange={handleChange} />)
  fireEvent.click(screen.getByRole('checkbox'))
  expect(handleChange).toHaveBeenCalled()
})
