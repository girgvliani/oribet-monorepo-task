import { createContext, useContext } from 'react'

/**
 * Visual variant for the bonus dropdown (`BonusContainer`) and its cards / section
 * labels. `redesign` flattens the cards (no border, flat bg) and turns section labels
 * into chips — scoped to oribet-redesign so other brands keep the default look.
 */
export type BonusVariant = 'default' | 'redesign'

export const BonusVariantContext = createContext<BonusVariant>('default')

export const useBonusVariant = (): BonusVariant => useContext(BonusVariantContext)
