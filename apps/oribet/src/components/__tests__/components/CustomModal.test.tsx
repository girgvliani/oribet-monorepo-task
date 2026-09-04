import { CustomModal } from '@oribet/ui'
import { fireEvent, render, screen } from '../../../testUtils/render'

test('CustomModal opens and closes correctly', () => {
  const handleClose = vi.fn()
  const { rerender } = render(
    <CustomModal open={false} onClose={handleClose}>
      <div>Modal Content</div>
    </CustomModal>
  )

  // Modal should not be visible when open is false
  expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()

  // Rerender with open={true}
  rerender(
    <CustomModal open={true} onClose={handleClose}>
      <div>Modal Content</div>
    </CustomModal>
  )

  // Modal content should be visible
  expect(screen.getByText('Modal Content')).toBeInTheDocument()

  // Simulate closing modal
  fireEvent.keyDown(screen.getByText('Modal Content'), {
    key: 'Escape',
    code: 'Escape',
  })

  expect(handleClose).toHaveBeenCalledTimes(1)
})
