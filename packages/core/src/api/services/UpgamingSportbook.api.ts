import instance from '../axios'

export interface SbConfigPayload {
  clientID: string
  clientName: string
  userToken: string
  lang: string
}

// Backend returns both shapes during rollout:
//  - `data` populated → use SBLoader.init with those fields
//  - `data` null → fall back to rendering `url` in an <iframe>
// Drop the iframe branch once backend always populates `data`.
export interface SbLaunchResponse {
  url: string
  data: SbConfigPayload | null
}

export type SbDevice = 'desktop' | 'mobile'

export const getSportbookToken = (device: SbDevice) =>
  instance.post<{ data: SbLaunchResponse }>('/upgaming/sportsbook/initialize', { device })
