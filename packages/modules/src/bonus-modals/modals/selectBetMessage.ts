export interface BetBounds {
  minBet?: string | number
  maxBet?: string | number
}

export interface BetMessage {
  key: string
  defaultValue: string
  params: Record<string, string>
}

/** Trim trailing zeros for display: "0.2000" → "0.2", "5.0000" → "5". */
export const fmtBet = (v?: string | number): string => {
  const n = Number(v)
  return Number.isFinite(n) ? String(n) : String(v ?? '')
}

/** A bound is meaningful only when it's a finite number > 0 (0/missing = no limit). */
const hasBound = (v?: string | number): boolean => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0
}

/**
 * Pick the invalid-bet message based on which bounds are meaningful:
 * both → between (or exactly, when equal); min only → at least; max only → at most;
 * neither → generic. Pure so it can be unit-tested without i18n.
 */
export const selectBetMessage = ({ minBet, maxBet }: BetBounds): BetMessage => {
  const hasMin = hasBound(minBet)
  const hasMax = hasBound(maxBet)
  const min = fmtBet(minBet)
  const max = fmtBet(maxBet)

  if (hasMin && hasMax) {
    if (Number(minBet) === Number(maxBet)) {
      return {
        key: 'bonusMoney.invalidBonusBetExact',
        defaultValue: 'Your bet should be exactly {{minBet}} to play.',
        params: { minBet: min },
      }
    }
    return {
      key: 'bonusMoney.invalidBonusBet',
      defaultValue: 'Your bet was invalid. Please bet between {{minBet}} and {{maxBet}} to play.',
      params: { minBet: min, maxBet: max },
    }
  }
  if (hasMin) {
    return {
      key: 'bonusMoney.invalidBonusBetMin',
      defaultValue: 'Your bet should be at least {{minBet}} to play.',
      params: { minBet: min },
    }
  }
  if (hasMax) {
    return {
      key: 'bonusMoney.invalidBonusBetMax',
      defaultValue: 'Your bet should be at most {{maxBet}} to play.',
      params: { maxBet: max },
    }
  }
  return {
    key: 'bonusMoney.invalidBonusBetGeneric',
    defaultValue: 'Your bet was invalid. Please try a different amount.',
    params: {},
  }
}
