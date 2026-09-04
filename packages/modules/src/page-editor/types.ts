import type { ComponentType } from 'react'

export type AuthVisibility = 'always' | 'auth' | 'unauth'

export interface ModuleInstance {
  id: string
  moduleId: string
  /** When set, the module's `visible` prop drives auth-conditional rendering. */
  visible?: AuthVisibility
}

export interface ModuleSupports {
  /** Editor renders the visibility tri-state for instances of this module. */
  auth?: boolean
}

/** Standard prop bag passed to every module rendered by `EditablePage`. */
export interface ModuleProps {
  visible?: AuthVisibility
}

// Modules opt in to `ModuleProps` when they support auth-visibility; others
// ignore the prop. The registry stays permissive so we don't have to widen
// every module's signature for a prop most don't use.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ModuleRegistryEntry {
  moduleId: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>
  supports?: ModuleSupports
}

export type ModuleRegistry = Record<string, ModuleRegistryEntry>

export interface PageRegistryEntry {
  pageId: string
  label: string
  /** Module ids eligible to be added to this page from the picker. */
  allowedModules: string[]
  /** Default ordered instances when no override is stored. */
  defaultInstances: ModuleInstance[]
}

export type PageRegistry = Record<string, PageRegistryEntry>
