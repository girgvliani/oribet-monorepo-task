import type { ComponentType } from 'react'
import type { seoType } from '@oribet/core/types/seo.type'

export interface RouteConfig {
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>
  seo?: seoType
  private?: boolean
}

export interface AppConfig {
  routes: RouteConfig[]
}
