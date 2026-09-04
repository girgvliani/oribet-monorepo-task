import { getRanks } from '../../util/UserProfileHelper'
import { getLocalizedString, getCanonicalString, type LocalizedString } from '../../util/appUtil'
import { useTheme } from 'styled-components'
import { IRankInfo } from '../../types/common.type'

interface UserRankData {
  // `rank` may be a plain name string, a per-language name map, or the full rank
  // object ({ id, name, min_level, ... }); the rank object may also live on `rankData`
  // itself with the name at `.name`. We normalize all of these below.
  rank?: unknown
  name?: unknown
  level?: number
  progress?: number
}

/**
 * Extract the rank-name value (string or per-language map) from the various shapes the
 * backend may send, so it can be resolved for display (active language) and matched
 * against the English-keyed theme art.
 */
const resolveRankNameSource = (rankData: UserRankData | undefined): LocalizedString => {
  let source: unknown = rankData?.rank
  // `rank` is itself a full rank object → its name field holds the (localized) name.
  if (source && typeof source === 'object' && 'name' in (source as Record<string, unknown>)) {
    source = (source as Record<string, unknown>).name
  }
  // No usable `.rank` → the rank object is `rankData` itself (name at `.name`).
  if (source === undefined || source === null || source === '') {
    source = rankData?.name
  }
  return source as LocalizedString
}

const useUserRankInfo = (rankData: UserRankData | undefined, ranksInfo: IRankInfo[]) => {
  const theme = useTheme()
  const ranks = getRanks(theme)

  const rankNameSource = resolveRankNameSource(rankData)
  // Theme art (background/img/progress) is keyed by the ENGLISH rank name; match the
  // canonical value, case-insensitive to tolerate casing drift.
  const artKey = getCanonicalString(rankNameSource).toLowerCase()

  // Resolve the rank tier. If it can't be matched (blank/unknown rank), fall back to
  // the first (lowest) tier so a rank is always shown.
  const matchedIndex = artKey ? ranks.findIndex(item => item.name.toLowerCase() === artKey) : -1
  const rankIndex = matchedIndex >= 0 ? matchedIndex : 0
  const srcInfo = ranks[rankIndex]

  const localizedRankName = (index: number): string =>
    getLocalizedString(ranksInfo?.[index]?.name) || ranks[index]?.name || ''

  // Display: active-language name; fall back to the resolved tier's name when blank.
  const currentRankName = getLocalizedString(rankNameSource) || localizedRankName(rankIndex)

  const nextRankName = rankIndex + 1 < ranks.length ? localizedRankName(rankIndex + 1) : ''

  const getMaxRankLevel = () => {
    const byName = ranksInfo?.find(
      (rank: IRankInfo) => getLocalizedString(rank.name) === currentRankName
    )?.max_level
    return byName ?? ranksInfo?.[rankIndex]?.max_level
  }

  return {
    currentRankName,
    nextRankName,
    level: rankData?.level ?? 0,
    progress: rankData?.progress ?? 0,
    maxLevel: getMaxRankLevel() || 0,
    srcInfo,
  }
}

export default useUserRankInfo
