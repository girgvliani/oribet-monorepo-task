/**
 * Completeness linter (`pnpm idmap:lint`).
 *
 * The coverage gate (generate.ts) catches REGISTERED ids that weren't wired. This
 * linter catches the other gap: interactive elements that were never added to the
 * registry at all. It statically scans in-scope module dirs for interactive
 * elements lacking a `data-testid` / `testId=` and reports them.
 *
 * It is heuristic (regex, not a real JSX parser) — opt out a false positive with an
 * inline `// idmap-ignore: <reason>` on or just above the element's opening line.
 *
 * Usage: tsx tools/idmap/lint.ts [--dir=packages/modules/src/<area> ...]
 * Exit code 1 if any unignored findings (for CI).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')

/** Default scan scope: production modules, templates, app shells, and UI primitives. */
const DEFAULT_DIRS = [
  'packages/modules/src',
  'packages/templates/src',
  'packages/ui/src',
  'apps/oribet/src',
]

/** Dirs/files excluded — demo/dev-only tools, tests, non-interactive. */
const EXCLUDE = [
  /\/theme-switcher\//,
  /\/page-editor\//,
  /\/__tests__\//,
  /\.test\.tsx?$/,
  /\.stories\.tsx?$/,
]

/** Component names that are inherently interactive. */
const INTERACTIVE_COMPONENT =
  /^(Custom(Primary|Secondary|Minimal|Bonus|Deposit)Button|CustomInput|CustomCheckBox|CustomSelect|CustomModal|Select|ActionButton|MethodCard|OribetPagination|PlayButton|GameModeToggle|SectionButton|HeaderButtonContainer)$/

/** Native interactive tag names. */
const INTERACTIVE_TAG = /^(button|input|textarea|select|a)$/

/** Components that apply their own data-testid internally (default a registry id),
 *  so call sites need not pass one — don't flag them. */
const SELF_TAGGING = new Set([
  'SidebarMenuItem',
  'GameCard',
  'ProviderCardItem',
  // oribet-redesign self-tagging forks
  'OribetSidebarMenuItem',
  'OribetProviderCard',
])

const HAS_TESTID = /\b(data-testid|testId)\b/

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    const full = join(dir, name)
    if (EXCLUDE.some(re => re.test(full.replace(/\\/g, '/') + '/'))) continue
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (/\.(tsx|jsx)$/.test(name)) out.push(full)
  }
  return out
}

type Finding = { file: string; line: number; text: string }

/** Extract an opening JSX tag's full text starting at `<`, honoring strings/braces. */
function readOpeningTag(src: string, start: number): { text: string; end: number } {
  let depth = 0
  let i = start + 1
  let quote: string | null = null
  for (; i < src.length; i++) {
    const c = src[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') quote = c
    else if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) break
  }
  return { text: src.slice(start, i + 1), end: i }
}

function scanFile(file: string): Finding[] {
  const src = readFileSync(file, 'utf8')
  const findings: Finding[] = []
  const tagRe = /<([A-Za-z][\w.]*)/g
  for (let m; (m = tagRe.exec(src)); ) {
    const name = m[1]
    if (SELF_TAGGING.has(name)) {
      tagRe.lastIndex = readOpeningTag(src, m.index).end + 1
      continue
    }
    const { text, end } = readOpeningTag(src, m.index)
    const interactive =
      INTERACTIVE_TAG.test(name) ||
      INTERACTIVE_COMPONENT.test(name) ||
      /\bonClick=/.test(text) ||
      /\brole=["']button["']/.test(text)
    if (!interactive) continue
    if (HAS_TESTID.test(text)) continue
    // line number + opt-out (this line or the line above)
    const before = src.slice(0, m.index)
    const lineNo = before.split('\n').length
    const lineStart = before.lastIndexOf('\n') + 1
    const prevLine = src.slice(src.lastIndexOf('\n', lineStart - 2) + 1, lineStart)
    if (/idmap-ignore/.test(text) || /idmap-ignore/.test(prevLine)) continue
    findings.push({ file, line: lineNo, text: `<${name} …` })
    tagRe.lastIndex = end + 1
  }
  return findings
}

function main(): void {
  const args = process.argv.slice(2)
  const dirs = args.filter(a => a.startsWith('--dir=')).map(a => a.slice('--dir='.length))
  const scanDirs = (dirs.length ? dirs : DEFAULT_DIRS).map(d => join(REPO_ROOT, d))

  const findings: Finding[] = []
  for (const d of scanDirs) for (const f of walk(d)) findings.push(...scanFile(f))

  if (!findings.length) {
    console.log('idmap:lint — no untagged interactive elements found.')
    return
  }
  const byFile = new Map<string, Finding[]>()
  for (const f of findings) (byFile.get(f.file) ?? byFile.set(f.file, []).get(f.file)!).push(f)
  console.log(`idmap:lint — ${findings.length} untagged interactive element(s):\n`)
  for (const [file, fs] of byFile) {
    console.log(`  ${relative(REPO_ROOT, file)}`)
    for (const f of fs) console.log(`    L${f.line}: ${f.text}`)
  }
  process.exitCode = 1
}

main()
