/**
 * Static module-reachability for the id-map generator.
 *
 * The env-only approach is inaccurate: it assumes every app renders the shared
 * registry's components. Apps swap modules (e.g. oribet renders the shared
 * AuthorizationModal via MainTemplate; oribet-korea renders CasinoAuthModal via
 * NavHeaderLayout), so an id is only really present if the component that emits
 * it is reachable from that app's entry.
 *
 * This walks each app's import graph from ClientApp.tsx with NAMED-EXPORT
 * awareness — following a file's `import`s only when the file is actually used,
 * and following barrel `export … from` only for the names that were imported.
 * That way importing `{ MainTemplate }` from a barrel does NOT drag in
 * `NavHeaderLayout` (and thus CasinoAuthModal) that live in the same barrel.
 *
 * It then collects every `AUTH_TEST_IDS.*` reference (and raw `data-testid`
 * literal) found in the reachable component files = the ids that app ships.
 */
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const DEBUG = process.env.IDMAP_DEBUG === '1'

/**
 * Dependency-injection seams to ignore. AppShell statically imports `MainTemplate`
 * only as a *fallback* layout (resolution order: <LayoutProvider> → `layout` prop →
 * MainTemplate). Each app reaches its real layout directly from ClientApp
 * (oribet via LayoutProvider's layouts map, korea via the `layout` prop), so the
 * fallback import must not be followed — otherwise every app would appear to render
 * MainTemplate (and the shared AuthorizationModal) regardless of its chosen layout.
 *
 * Caveat: an app that relies purely on the AppShell default (no LayoutProvider and
 * no `layout` prop) must still wire MainTemplate explicitly for it to be counted.
 */
const IGNORED_EDGES: { fromSuffix: string; source: string }[] = [
  { fromSuffix: 'templates/src/main/AppShell.tsx', source: './MainTemplate' },
]

function isIgnoredEdge(fromFile: string, source: string): boolean {
  return IGNORED_EDGES.some(
    (e) => fromFile.replace(/\\/g, '/').endsWith(e.fromSuffix) && source === e.source,
  )
}

type Pkg = { dir: string; exports?: Record<string, string>; main?: string }
type Ctx = {
  repoRoot: string
  pkgs: Record<string, Pkg>
  aliases: { prefix: string; target: string }[] // longest-first
}

type Demand = '*' | Set<string>

function isFile(p: string): boolean {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

function resolveFile(base: string): string | null {
  if (isFile(base)) return base
  for (const e of EXTS) if (isFile(base + e)) return base + e
  for (const e of EXTS) {
    const idx = join(base, 'index' + e)
    if (isFile(idx)) return idx
  }
  return null
}

/** Build the @oribet/* workspace package map (name → dir/exports/main). */
function loadWorkspacePackages(repoRoot: string): Record<string, Pkg> {
  const map: Record<string, Pkg> = {}
  for (const base of ['packages', join('packages', 'config')]) {
    const baseDir = join(repoRoot, base)
    if (!existsSync(baseDir)) continue
    for (const name of readdirSync(baseDir)) {
      const pjPath = join(baseDir, name, 'package.json')
      if (!existsSync(pjPath)) continue
      try {
        const json = JSON.parse(readFileSync(pjPath, 'utf8'))
        if (typeof json.name === 'string' && json.name.startsWith('@oribet/')) {
          map[json.name] = { dir: join(baseDir, name), exports: json.exports, main: json.main }
        }
      } catch {
        /* ignore unparsable package.json */
      }
    }
  }
  return map
}

/** Read an app's tsconfig `paths` into alias prefixes (longest-first). */
function loadAppAliases(appDir: string): { prefix: string; target: string }[] {
  const aliases: { prefix: string; target: string }[] = []
  const tsconfigPath = join(appDir, 'tsconfig.json')
  if (existsSync(tsconfigPath)) {
    try {
      // tsconfig may contain comments/trailing commas; strip the common cases.
      const raw = readFileSync(tsconfigPath, 'utf8').replace(/\/\/.*$/gm, '')
      const json = JSON.parse(raw)
      const paths = json?.compilerOptions?.paths ?? {}
      for (const [key, vals] of Object.entries(paths)) {
        const target = Array.isArray(vals) ? (vals[0] as string) : ''
        if (!target) continue
        aliases.push({
          prefix: key.replace(/\*$/, ''),
          target: join(appDir, target.replace(/\*$/, '')),
        })
      }
    } catch {
      /* ignore */
    }
  }
  aliases.sort((a, b) => b.prefix.length - a.prefix.length)
  return aliases
}

function resolveWorkspace(spec: string, ctx: Ctx): string | null {
  const m = spec.match(/^(@oribet\/[^/]+)(?:\/(.+))?$/)
  if (!m) return null
  const pkg = ctx.pkgs[m[1]]
  if (!pkg) return null
  const subpath = m[2]
  if (!subpath) {
    const entry = pkg.exports?.['.'] ?? pkg.main ?? './src/index.ts'
    return resolveFile(join(pkg.dir, entry))
  }
  // exact subpath export
  const exact = pkg.exports?.['./' + subpath]
  if (exact) return resolveFile(join(pkg.dir, exact))
  // fallback: src/<subpath>
  return resolveFile(join(pkg.dir, 'src', subpath))
}

function resolveSpecifier(spec: string, fromFile: string, ctx: Ctx): string | null {
  // strip query/hash
  spec = spec.replace(/[?#].*$/, '')
  if (spec.startsWith('.')) {
    return resolveFile(resolve(dirname(fromFile), spec))
  }
  if (spec.startsWith('@oribet/')) {
    return resolveWorkspace(spec, ctx)
  }
  // app path aliases (e.g. @pages/, @containers/, @locale/)
  for (const { prefix, target } of ctx.aliases) {
    if (spec === prefix.replace(/\/$/, '') || spec.startsWith(prefix)) {
      const rest = spec.slice(prefix.length).replace(/^\/+/, '') // tolerate `@locale//i18n`
      return resolveFile(rest ? join(target, rest) : target)
    }
  }
  return null // third-party — not part of our graph
}

// ---- file parsing -------------------------------------------------------

type ParsedImport = { source: string; names: Set<string>; namespace: boolean }
type ParsedReExport =
  | { source: string; star: true }
  | { source: string; star: false; map: Map<string, string> } // exported → source name

type DynamicImport = { source: string; demand: Demand }
type Parsed = {
  imports: ParsedImport[]
  dynamic: DynamicImport[]
  reExports: ParsedReExport[]
  localExports: Set<string>
  text: string
}

const parseCache = new Map<string, Parsed>()

function splitNamed(clause: string): { name: string; alias: string }[] {
  return clause
    .replace(/[{}]/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      const [name, alias] = item.split(/\s+as\s+/).map((x) => x.trim())
      return { name, alias: alias ?? name }
    })
}

function parseFile(file: string): Parsed {
  const cached = parseCache.get(file)
  if (cached) return cached
  const text = readFileSync(file, 'utf8')
  const imports: ParsedImport[] = []
  const dynamic: DynamicImport[] = []
  const reExports: ParsedReExport[] = []
  const localExports = new Set<string>()

  // import ... from '...'
  const importRe = /import\s+(?!type\b)([^;'"]*?)\s+from\s*['"]([^'"]+)['"]/g
  for (let m; (m = importRe.exec(text)); ) {
    const clause = m[1].trim()
    const source = m[2]
    const names = new Set<string>()
    let namespace = false
    const nsMatch = clause.match(/\*\s+as\s+\w+/)
    if (nsMatch) namespace = true
    const braceMatch = clause.match(/\{([\s\S]*?)\}/)
    if (braceMatch) for (const { name } of splitNamed(braceMatch[1])) names.add(name)
    // default import (leading identifier before any `{` or `*`)
    const defaultMatch = clause.match(/^([A-Za-z_$][\w$]*)\s*(?:,|$)/)
    if (defaultMatch && !clause.startsWith('{') && !clause.startsWith('*')) names.add('default')
    imports.push({ source, names, namespace })
  }

  // side-effect import '...'
  const sideRe = /import\s*['"]([^'"]+)['"]/g
  for (let m; (m = sideRe.exec(text)); ) {
    // avoid double-counting matched `import x from '...'` (those have `from`)
    const idx = m.index
    const lineHead = text.slice(idx, idx + m[0].length + 6)
    if (/from/.test(text.slice(Math.max(0, idx - 60), idx))) continue
    imports.push({ source: m[1], names: new Set(), namespace: false })
  }

  // dynamic import('...'), capturing a trailing `.then(...)` so we can demand only
  // the named export actually used (e.g. `.then(m => ({ default: m.Foo }))`).
  const dynRe = /import\(\s*['"]([^'"]+)['"]\s*\)(\s*\.then\(([\s\S]{0,240}?)\)\s*\))?/g
  for (let m; (m = dynRe.exec(text)); ) {
    const source = m[1]
    const thenBody = m[3]
    let demand: Demand = '*'
    if (thenBody) {
      const names = new Set<string>()
      // `m.Foo` member access (matchAll avoids the fresh-regex-in-loop infinite loop)
      for (const mm of thenBody.matchAll(/\b[A-Za-z_$][\w$]*\.([A-Za-z_$][\w$]*)/g))
        names.add(mm[1])
      // `.then(({ Foo, Bar }) => …)` destructure
      const destructure = thenBody.match(/\{([^}]*)\}\s*=>/)
      if (destructure) for (const { name } of splitNamed(destructure[1])) names.add(name)
      if (names.size > 0) demand = names
    }
    dynamic.push({ source, demand })
  }

  // export { ... } from '...'  /  export * from '...'
  const reExportRe = /export\s+(?!type\b)(\{[\s\S]*?\}|\*)\s+from\s*['"]([^'"]+)['"]/g
  for (let m; (m = reExportRe.exec(text)); ) {
    const what = m[1].trim()
    const source = m[2]
    if (what === '*') reExports.push({ source, star: true })
    else {
      const map = new Map<string, string>()
      for (const { name, alias } of splitNamed(what)) map.set(alias, name) // exported → source
      reExports.push({ source, star: false, map })
    }
  }

  // local exported declarations
  const declRe = /export\s+(?:default\s+)?(?:const|function|class|let|var)\s+([A-Za-z_$][\w$]*)/g
  for (let m; (m = declRe.exec(text)); ) localExports.add(m[1])
  if (/export\s+default\b/.test(text)) localExports.add('default')
  // export { A, B }  (no `from`)
  const localNamedRe = /export\s*\{([^}]*)\}\s*(?!\s*from)/g
  for (let m; (m = localNamedRe.exec(text)); ) {
    // skip if this is actually a re-export (followed by from) — handled above
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 12)
    if (/^\s*from/.test(after)) continue
    for (const { alias } of splitNamed(m[1])) localExports.add(alias)
  }

  const parsed: Parsed = { imports, dynamic, reExports, localExports, text }
  parseCache.set(file, parsed)
  return parsed
}

// ---- reachability walk --------------------------------------------------

/**
 * Returns the set of source files that are "fully used" (their body executes)
 * starting from `entry`, with named-export-aware barrel traversal.
 */
function walk(entry: string, ctx: Ctx): { fullyUsed: Set<string>; parents: Map<string, string> } {
  const fullyUsed = new Set<string>()
  const visited = new Map<string, { full: boolean; names: Set<string> }>()
  const parents = new Map<string, string>()

  const follow = (source: string, fromFile: string, demand: Demand) => {
    const target = resolveSpecifier(source, fromFile, ctx)
    if (target) {
      if (!parents.has(target) && target !== fromFile) parents.set(target, fromFile)
      visit(target, demand)
    }
  }

  const visit = (file: string, demand: Demand) => {
    let state = visited.get(file)
    if (!state) {
      state = { full: false, names: new Set() }
      visited.set(file, state)
    }
    let newNames: Set<string> | '*' = '*'
    if (demand === '*') {
      if (state.full) return
    } else {
      if (state.full) return
      newNames = new Set([...demand].filter((n) => !state!.names.has(n)))
      if (newNames.size === 0) return
      for (const n of newNames) state.names.add(n)
    }

    const parsed = parseFile(file)
    const wantAll = demand === '*'
    const names = wantAll ? null : (newNames as Set<string>)

    // Which demanded names does this file own locally?
    const localNeeded = wantAll
      ? parsed.localExports
      : new Set([...names!].filter((n) => parsed.localExports.has(n)))

    // A file is "fully used" if we need '*' or any of its local exports.
    if (wantAll || localNeeded.size > 0) {
      if (!state.full) {
        state.full = true
        fullyUsed.add(file)
        // follow this file's own imports (its runtime dependencies)
        for (const imp of parsed.imports) {
          if (isIgnoredEdge(file, imp.source)) continue // skip DI fallback edges
          const d: Demand = imp.namespace || imp.names.size === 0 ? '*' : imp.names
          follow(imp.source, file, imp.namespace ? '*' : d)
        }
        for (const dyn of parsed.dynamic) follow(dyn.source, file, dyn.demand)
        // when fully used, also expose its re-exports as needed below
      }
    }

    // Re-exports: pass through only the demanded names (barrel behavior).
    const remaining = wantAll
      ? '*'
      : new Set([...names!].filter((n) => !parsed.localExports.has(n)))
    for (const re of parsed.reExports) {
      if (re.star) {
        follow(re.source, file, remaining)
      } else if (remaining === '*') {
        // need everything → follow every mapped source name
        follow(re.source, file, new Set(re.map.values()))
      } else {
        const matched = new Set<string>()
        for (const want of remaining) {
          const src = re.map.get(want)
          if (src) matched.add(src)
        }
        if (matched.size > 0) follow(re.source, file, matched)
      }
    }
  }

  visit(entry, '*')
  return { fullyUsed, parents }
}

// ---- id collection ------------------------------------------------------

/** Resolve a dotted path like `login.emailInput` against the id constant tree. */
function lookupId(obj: unknown, path: string): string | null {
  let cur: any = obj
  for (const key of path.split('.')) {
    if (cur && typeof cur === 'object' && key in cur) cur = cur[key]
    else return null
  }
  return typeof cur === 'string' ? cur : null
}

export type ReachabilityResult = {
  /** ids actually referenced by reachable component files */
  ids: Set<string>
  /** count of fully-used files (debug) */
  fileCount: number
}

/**
 * Compute the set of registry ids an app actually ships.
 *
 * @param appDir          apps/<app>
 * @param idConstants     e.g. { auth: AUTH_TEST_IDS } — map of constant-name → object
 * @param validIds        the full set of registry id strings (for raw data-testid literals)
 */
export function computeReachableIds(
  appDir: string,
  repoRoot: string,
  idConstants: Record<string, unknown>,
  validIds: Set<string>,
): ReachabilityResult {
  const ctx: Ctx = {
    repoRoot,
    pkgs: loadWorkspacePackages(repoRoot),
    aliases: loadAppAliases(appDir),
  }
  const entry = resolveFile(join(appDir, 'src', 'ClientApp'))
  const ids = new Set<string>()
  if (!entry) return { ids, fileCount: 0 }

  const { fullyUsed: files, parents } = walk(entry, ctx)

  if (DEBUG) {
    mkdirSync(join(appDir, 'idmap'), { recursive: true })
    const rel = (f: string) => f.replace(repoRoot + '/', '')
    const chainTo = (probeRe: RegExp) => {
      const probe = [...files].find((f) => probeRe.test(f))
      if (!probe) return null
      const chain: string[] = []
      let cur: string | undefined = probe
      let guard = 0
      while (cur && guard++ < 100) {
        chain.push(rel(cur))
        cur = parents.get(cur)
      }
      return chain.reverse()
    }
    const dump = {
      app: rel(appDir),
      fileCount: files.size,
      chainToAuthorizationContent: chainTo(/authorization\/AuthorizationContent/),
      chainToMainTemplate: chainTo(/main\/MainTemplate/),
      chainToCasinoAuthModal: chainTo(/casino-authorization\/CasinoAuthModal/),
      authFiles: [...files].filter((f) => /authorization|app-header\/AppHeader/.test(f)).map(rel),
    }
    writeFileSync(join(appDir, 'idmap', '.reach-debug.json'), JSON.stringify(dump, null, 2))
  }

  for (const file of files) {
    // never harvest ids from the registry definition itself — it references all of them
    if (file.includes(join('packages', 'test-ids'))) continue
    const text = parseCache.get(file)?.text ?? readFileSync(file, 'utf8')

    for (const [constName, obj] of Object.entries(idConstants)) {
      const re = new RegExp(`\\b${constName}\\.([A-Za-z0-9_.]+)`, 'g')
      for (let m; (m = re.exec(text)); ) {
        const id = lookupId(obj, m[1])
        if (id) ids.add(id)
      }
    }
    const litRe = /data-testid\s*=\s*["'`]([^"'`]+)["'`]/g
    for (let m; (m = litRe.exec(text)); ) if (validIds.has(m[1])) ids.add(m[1])
  }

  if (DEBUG) {
    console.error(`  [reach] ${appDir}: ${files.size} files, ${ids.size} ids`)
    const auth = [...files].filter((f) =>
      /templates\/src\/main|authorization|casino-auth/.test(f),
    )
    for (const f of auth) console.error(`    used: ${f.replace(repoRoot + '/', '')}`)
  }

  return { ids, fileCount: files.size }
}
