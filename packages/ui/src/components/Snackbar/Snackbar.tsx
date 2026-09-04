import { SnackbarProvider } from 'notistack'
import { ReactNode } from 'react'

interface ISnackBar {
  children: ReactNode
}

const SnackBar = ({ children }: ISnackBar) => {
  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={2000}
    >
      {children}
    </SnackbarProvider>
  )
}

export default SnackBar
