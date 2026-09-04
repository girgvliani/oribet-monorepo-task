type Mergeable = Record<string, unknown>

const isPlainObject = (v: unknown): v is Mergeable =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export function deepMerge<T extends Mergeable>(base: T, override: Mergeable): T {
  const result: Mergeable = { ...base }
  for (const key of Object.keys(override)) {
    const baseVal = (base as Mergeable)[key]
    const overVal = override[key]
    if (isPlainObject(baseVal) && isPlainObject(overVal)) {
      result[key] = deepMerge(baseVal, overVal)
    } else if (overVal !== undefined) {
      result[key] = overVal
    }
  }
  return result as T
}
