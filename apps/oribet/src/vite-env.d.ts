/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_CHAT_SOCKET_URL: string
  readonly VITE_GIPHY_SDK_API_KEY: string
  readonly VITE_AIRCRASH_SLUG: string
  readonly VITE_MODE: string
  readonly VITE_APP_NAME: string
  readonly VITE_SPORT_BOOK_LIBRARY_SRC: string
  readonly VITE_IS_DEMO: string
  readonly VITE_SB_CLIENT_ID: string
  readonly VITE_SB_CLIENT_NAME: string
}

declare module '@omno-payment/checkout-js' {
  enum CashierEmitEvent {
    IFRAME_OPENED = 'iframeOpened',
    IFRAME_CLOSED = 'iframeClosed',
    IFRAME_DESTROYED = 'iframeDestroyed',
    IFRAME_OPEN_REQUESTED = 'iframeOpenRequested',
    IFRAME_CLOSE_REQUESTED = 'iframeCloseRequested',
    CASHIER_LOADED = 'cashierLoaded',
    LIVE_CHAT_CLICKED = 'liveChatClicked',
    OVERLAY_CLICKED = 'overlayClicked',
    PAYMENT_SUCCESS = 'paymentSuccess',
    PAYMENT_FAILED = 'paymentFailed',
    PAYMENT_PENDING = 'paymentPending',
    PAYMENT_CANCELED = 'paymentCanceled',
    KYC_REQUIRED_FIELD_ERRORS = 'kycRequiredFieldErrors',
    KYC_REQUIRED_LEVEL_ERRORS = 'kycRequiredLevelErrors',
    ANALYTICS_EVENT = 'ANALYTICS_EVENT',
    UNKNOWN = 'unknown',
  }

  enum DeviceType {
    DESKTOP = 'DESKTOP',
    MOBILE = 'MOBILE',
    AUTO = 'AUTO',
  }

  interface CashierProperties {
    device?: DeviceType
    styles?: {
      modal?: {
        backgroundColor?: string
        width?: string
        height?: string
        borderRadius?: string
        zIndex?: number
      }
      mobile?: { backgroundColor?: string; zIndex?: number }
    }
    returnUrlAfterRedirection?: string
    baseUrl?: string
  }

  interface OpenCashierParameters {
    sessionId: string
    containerId?: string
    paymentAction?: 'DEPOSIT' | 'WITHDRAW'
  }

  class CashierSDK {
    constructor(options: CashierProperties)
    on(event: CashierEmitEvent, handler: (data: any) => void): void
    off(event: CashierEmitEvent, handler: (data: any) => void): void
    open(params: OpenCashierParameters): void
    close(): void
    reload(): void
    destroy(): void
    isOpen(): boolean
    getSessionId(): string | undefined
    getDeviceType(): DeviceType
  }

  export default CashierSDK
  export { CashierEmitEvent, DeviceType, CashierProperties, OpenCashierParameters }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
