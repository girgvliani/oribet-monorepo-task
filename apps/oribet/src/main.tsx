import ReactDOM from 'react-dom/client'
import React, { useEffect, useState } from 'react'
import { AppFingerprintProvider } from '@oribet/modules/fingerprint'
import { consumeAdminToken } from '@oribet/core/util/consumeAdminToken'
import { registerChunkErrorReload } from '@oribet/core/util/chunkReload'
import reportWebVitals from './reportWebVitals'

consumeAdminToken()
// Auto-recover from stale dynamically-imported chunks after a deploy (see chunkReload).
registerChunkErrorReload()

const ClientApp = React.lazy(() => import('./ClientApp'))

const App = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  if (!isClient) return null
  return (
    <AppFingerprintProvider>
      <ClientApp />
    </AppFingerprintProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

reportWebVitals()
