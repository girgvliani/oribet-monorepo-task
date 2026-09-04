import { Snackbar as SnackBar } from '@oribet/ui'
import { render, screen } from '../../../testUtils/render'

test('SnackBar renders its children', () => {
  render(
    <SnackBar>
      <div>Child Component</div>
    </SnackBar>
  )

  expect(screen.getByText('Child Component')).toBeInTheDocument()
})
