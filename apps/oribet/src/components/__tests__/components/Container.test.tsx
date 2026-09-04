import { BoxContainer as Container } from '@oribet/ui'
import { render, screen } from '../../../testUtils/render'

test('renders children in the container', () => {
  render(<Container>Test Child</Container>)
  expect(screen.getByText('Test Child')).toBeInTheDocument()
})
