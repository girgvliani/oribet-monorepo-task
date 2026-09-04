import { AppConfig } from '../../redux/types/types'

export const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || '',
  socketUrl: import.meta.env.VITE_SOCKET_URL || '',
  airCrashSlug: import.meta.env.VITE_AIRCRASH_SLUG || '',
  sportBookLibrarySrc: import.meta.env.VITE_SPORT_BOOK_LIBRARY_SRC || '',
}
