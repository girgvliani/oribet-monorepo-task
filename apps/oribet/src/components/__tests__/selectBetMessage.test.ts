import { describe, expect, it } from 'vitest'
import { selectBetMessage } from '@oribet/modules/bonus-modals/select-bet-message'

describe('selectBetMessage', () => {
  it('both bounds present → between', () => {
    const msg = selectBetMessage({ minBet: '0.2', maxBet: '5' })
    expect(msg.key).toBe('bonusMoney.invalidBonusBet')
    expect(msg.params).toEqual({ minBet: '0.2', maxBet: '5' })
  })

  it('min present, max = 0 → at least (min only)', () => {
    const msg = selectBetMessage({ minBet: '0.2', maxBet: 0 })
    expect(msg.key).toBe('bonusMoney.invalidBonusBetMin')
    expect(msg.params).toEqual({ minBet: '0.2' })
  })

  it('min present, max = "0" string → at least (min only)', () => {
    const msg = selectBetMessage({ minBet: 5, maxBet: '0' })
    expect(msg.key).toBe('bonusMoney.invalidBonusBetMin')
    expect(msg.params).toEqual({ minBet: '5' })
  })

  it('min missing, max present → at most (max only)', () => {
    const msg = selectBetMessage({ minBet: 0, maxBet: '5' })
    expect(msg.key).toBe('bonusMoney.invalidBonusBetMax')
    expect(msg.params).toEqual({ maxBet: '5' })
  })

  it('min == max → exactly', () => {
    const msg = selectBetMessage({ minBet: '5', maxBet: 5 })
    expect(msg.key).toBe('bonusMoney.invalidBonusBetExact')
    expect(msg.params).toEqual({ minBet: '5' })
  })

  it('neither bound present → generic', () => {
    expect(selectBetMessage({}).key).toBe('bonusMoney.invalidBonusBetGeneric')
    expect(selectBetMessage({ minBet: 0, maxBet: 0 }).key).toBe('bonusMoney.invalidBonusBetGeneric')
  })

  it('trims trailing zeros in interpolated values', () => {
    const msg = selectBetMessage({ minBet: '0.2000', maxBet: '5.0000' })
    expect(msg.params).toEqual({ minBet: '0.2', maxBet: '5' })
  })
})
