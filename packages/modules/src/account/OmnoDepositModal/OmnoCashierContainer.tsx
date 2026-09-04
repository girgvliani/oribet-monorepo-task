import CashierSDK, { CashierEmitEvent, DeviceType } from '@omno-payment/checkout-js'
import { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'

interface OmnoCashierContainerProps {
  sessionId: string
  onPaymentSuccess?: () => void
}

const CONTAINER_ID = 'omno-cashier-container'

const OmnoCashierContainer: FC<OmnoCashierContainerProps> = ({ sessionId, onPaymentSuccess }) => {
  const cashierRef = useRef<CashierSDK | null>(null)

  useEffect(() => {
    const cashier = new CashierSDK({
      device: DeviceType.AUTO,
      baseUrl: 'https://checkout.omno.com',
    })
    cashierRef.current = cashier

    Object.values(CashierEmitEvent).forEach(event => {
      cashier.on(event, (data: any) => {
        console.log(`[OMNO Cashier] ${event}`, data)
        if (event === CashierEmitEvent.PAYMENT_SUCCESS) {
          onPaymentSuccess?.()
        }
      })
    })

    cashier.open({ sessionId, containerId: CONTAINER_ID })

    return () => {
      cashier.destroy()
      cashierRef.current = null
    }
  }, [sessionId])

  return <CashierWrapper id={CONTAINER_ID} />
}

export default OmnoCashierContainer

const CashierWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 500px;
  overflow: hidden;
  position: relative;

  & iframe {
    width: 100% !important;
    height: 100% !important;
    min-height: 500px;
    border: none;
  }
`
