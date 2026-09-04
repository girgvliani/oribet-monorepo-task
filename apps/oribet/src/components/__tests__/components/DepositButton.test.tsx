import { DepositButton } from '@oribet/ui'
import { render, screen } from '../../../testUtils/render'

test('DepositButton renders children correctly', () => {
  render(<DepositButton>Deposit</DepositButton>)
  expect(screen.getByText('Deposit')).toBeInTheDocument()
})
