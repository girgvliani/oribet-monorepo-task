import 'styled-components'
import type { AppTheme } from '@oribet/ui'

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
