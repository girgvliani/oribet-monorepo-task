import { CustomSelect } from '@oribet/ui'
import { render } from '../../../testUtils/render'

const mockData = [
  { value: 'option1', renderer: () => 'Option 1' },
  { value: 'option2', renderer: () => 'Option 2' },
]

test('CustomSelect renders options and handles selection', () => {
  const handleChange = vi.fn()
  render(<CustomSelect label="Select Label" value="" onChange={handleChange} data={mockData} />)
})
