import { CustomInput } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('CustomInput changes value on input', () => {
  const handleChange = vi.fn()
  render(<CustomInput onChange={handleChange} placeholder="Test Input" />)
  const input = screen.getByPlaceholderText('Test Input')
  fireEvent.change(input, { target: { value: 'New Value' } })
  expect(handleChange).toHaveBeenCalled()
})
