interface Window {
  $crisp?: Array<Array<string | { [key: string]: any }>>
  LiveChatWidget: {
    on: (event: string, callback: (...args: any[]) => void) => void
    call: (method: string, params?: any[]) => void
  }
  dataLayer: any
  __STATUS_CODE__?: number
}
