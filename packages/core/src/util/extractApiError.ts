type ApiErrorData = string | { error?: string | Record<string, string[]>; message?: string }
type ApiError = {
  response?: { data?: { data?: ApiErrorData; message?: string; error?: string } }
  message?: string
}

export const extractApiError = (
  error: unknown,
  fallback: string = 'Something went wrong'
): string => {
  const err = error as ApiError
  const data = err?.response?.data?.data

  if (data !== undefined && data !== null) {
    if (typeof data === 'string') return data
    if (typeof data.error === 'string') return data.error
    if (typeof data.message === 'string') return data.message
    if (data.error && typeof data.error === 'object') {
      const firstKey = Object.keys(data.error)[0]
      if (firstKey) {
        const val = data.error[firstKey]
        return Array.isArray(val) ? val[0] : String(val)
      }
    }
  }

  const message = err?.response?.data?.message
  if (typeof message === 'string') return message

  const errorField = err?.response?.data?.error
  if (typeof errorField === 'string') return errorField

  return err?.message || fallback
}

const pushMessages = (target: string[], value: unknown) => {
  if (Array.isArray(value)) {
    value.forEach(v => {
      if (typeof v === 'string' && v) target.push(v)
    })
  } else if (typeof value === 'string' && value) {
    target.push(value)
  }
}

/**
 * Collect ALL validation messages from a backend error response, e.g.
 * `{ data: { phone: ["The phone field is required."], phone_confirm_code: [...] } }`.
 * Handles fields directly on `data`, the nested `data.error` object variant, and
 * plain string forms. `exclude` skips field keys already surfaced inline on the form.
 * Returns de-duplicated messages in encounter order; empty when nothing is found.
 */
export const extractApiErrors = (
  error: unknown,
  opts: { exclude?: string[] } = {}
): string[] => {
  const err = error as ApiError
  const exclude = new Set(opts.exclude ?? [])
  const messages: string[] = []
  const data = err?.response?.data?.data

  if (typeof data === 'string') {
    pushMessages(messages, data)
  } else if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    // Field-array map lives either directly on `data` or nested under `data.error`.
    const source =
      record.error && typeof record.error === 'object'
        ? (record.error as Record<string, unknown>)
        : record
    Object.entries(source).forEach(([key, value]) => {
      if (exclude.has(key)) return
      pushMessages(messages, value)
    })
    pushMessages(messages, record.message)
  }

  pushMessages(messages, err?.response?.data?.message)
  pushMessages(messages, err?.response?.data?.error)

  return [...new Set(messages)]
}
