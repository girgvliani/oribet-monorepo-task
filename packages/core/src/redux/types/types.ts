export interface AppConfig {
  apiUrl: string
  socketUrl: string
  giphySdkApiKey?: string
  airCrashSlug?: string
  chatSocketUrl?: string
  sportBookLibrarySrc?: string

  [key: string]: string | undefined
}
