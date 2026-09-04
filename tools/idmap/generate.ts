/**
 * Static id-map generator (`pnpm gen:idmap`).
 *
 * For each target app it:
 *   1. statically resolves which registry ids are REACHABLE from the app entry
 *      (import-graph analysis — reachability.ts),
 *   2. prunes the combined registry structure by build-env `presentWhen` + reachability,
 *   3. reads the app's hand-authored feature manifest
 *      (`apps/<app>/config/site-features.ts`) and runs the COVERAGE GATE: every
 *      feature marked `true` must have all its required ids present,
 *   4. writes ONE file: `apps/<app>/idmap.json` (structure + ids + per-feature
 *      coverage). With `--check`, exits non-zero if any app's gate fails.
 *
 * Build-free: no browser/crawl, just module-graph + .env + manifest analysis.
 *
 * Usage:
 *   tsx tools/idmap/generate.ts [--app=oribet ...] [--check]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import {
  AUTH_REGISTRY,
  AUTH_TEST_IDS,
  DISCOVERY_REGISTRY,
  DISCOVERY_TEST_IDS,
  NAVIGATION_REGISTRY,
  NAV_TEST_IDS,
  PLAY_REGISTRY,
  PLAY_TEST_IDS,
  DEPOSIT_REGISTRY,
  DEPOSIT_TEST_IDS,
  TRANSACTIONS_REGISTRY,
  TRANSACTIONS_TEST_IDS,
  BONUSES_REGISTRY,
  BONUSES_TEST_IDS,
  PROMOTIONS_REGISTRY,
  PROMOTIONS_TEST_IDS,
  ACCOUNT_REGISTRY,
  ACCOUNT_TEST_IDS,
  ENGAGEMENT_REGISTRY,
  ENGAGEMENT_TEST_IDS,
  FEATURE_KEYS,
  featureForId,
} from '../../packages/test-ids/src/index'
import type { FeatureKey, SiteFeatures } from '../../packages/test-ids/src/features'
import type { IdNode, PresenceRule, TestIdRegistry } from '../../packages/test-ids/src/types'
import { computeReachableIds } from './reachability'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const DEFAULT_APPS = ['oribet']

const REGISTRIES: { registry: TestIdRegistry; testIds: object; constName: string }[] = [
  { registry: AUTH_REGISTRY, testIds: AUTH_TEST_IDS, constName: 'AUTH_TEST_IDS' },
  { registry: NAVIGATION_REGISTRY, testIds: NAV_TEST_IDS, constName: 'NAV_TEST_IDS' },
  { registry: DISCOVERY_REGISTRY, testIds: DISCOVERY_TEST_IDS, constName: 'DISCOVERY_TEST_IDS' },
  { registry: PLAY_REGISTRY, testIds: PLAY_TEST_IDS, constName: 'PLAY_TEST_IDS' },
  { registry: DEPOSIT_REGISTRY, testIds: DEPOSIT_TEST_IDS, constName: 'DEPOSIT_TEST_IDS' },
  { registry: TRANSACTIONS_REGISTRY, testIds: TRANSACTIONS_TEST_IDS, constName: 'TRANSACTIONS_TEST_IDS' },
  { registry: BONUSES_REGISTRY, testIds: BONUSES_TEST_IDS, constName: 'BONUSES_TEST_IDS' },
  { registry: PROMOTIONS_REGISTRY, testIds: PROMOTIONS_TEST_IDS, constName: 'PROMOTIONS_TEST_IDS' },
  { registry: ACCOUNT_REGISTRY, testIds: ACCOUNT_TEST_IDS, constName: 'ACCOUNT_TEST_IDS' },
  { registry: ENGAGEMENT_REGISTRY, testIds: ENGAGEMENT_TEST_IDS, constName: 'ENGAGEMENT_TEST_IDS' },
]

/** Combined structure across all feature areas (single tree for the single-file map). */
const ALL_STRUCTURE: IdNode[] = REGISTRIES.flatMap((r) => r.registry.structure)

type EnvMap = Record<string, string>

function parseEnv(filePath: string): EnvMap {
  const env: EnvMap = {}
  if (!existsSync(filePath)) return env
  for (const raw of readFileSync(filePath, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    )
      value = value.slice(1, -1)
    env[key] = value
  }
  return env
}

function flattenIds(obj: object, out: Set<string> = new Set()): Set<string> {
  for (const value of Object.values(obj)) {
    if (typeof value === 'string') out.add(value)
    else if (value && typeof value === 'object') flattenIds(value, out)
  }
  return out
}

function collectStructureIds(nodes: IdNode[], out: Set<string> = new Set()): Set<string> {
  for (const node of nodes) {
    out.add(node.id)
    if (node.children) collectStructureIds(node.children, out)
  }
  return out
}

/** Per-id `presentWhen` rule (for env pruning of "required" ids). */
function collectPresenceRules(nodes: IdNode[], out: Map<string, PresenceRule> = new Map()) {
  for (const node of nodes) {
    if (node.presentWhen) out.set(node.id, node.presentWhen)
    if (node.children) collectPresenceRules(node.children, out)
  }
  return out
}

/** Ids that may legitimately be absent at runtime — excluded from gate "required". */
function collectOptionalIds(nodes: IdNode[], out: Set<string> = new Set()): Set<string> {
  for (const node of nodes) {
    if (node.runtimeConditional) out.add(node.id)
    if (node.children) collectOptionalIds(node.children, out)
  }
  return out
}

/** Drift: registry constants ↔ structure ids must match 1:1, per area. */
function validateRegistry(registry: TestIdRegistry, testIds: object): void {
  const constants = flattenIds(testIds)
  const structureIds = collectStructureIds(registry.structure)
  const missingFromStructure = [...constants].filter((id) => !structureIds.has(id))
  const missingFromConstants = [...structureIds].filter((id) => !constants.has(id))
  if (missingFromStructure.length || missingFromConstants.length) {
    const lines = [`Registry "${registry.feature}" is out of sync:`]
    if (missingFromStructure.length)
      lines.push(`  in constants but not structure: ${missingFromStructure.join(', ')}`)
    if (missingFromConstants.length)
      lines.push(`  in structure but not constants: ${missingFromConstants.join(', ')}`)
    throw new Error(lines.join('\n'))
  }
}

/** Drift: every id maps to a feature; every FEATURE_KEY has ≥1 id. */
function validateFeatureCatalog(): void {
  const allIds = collectStructureIds(ALL_STRUCTURE)
  const unmapped = [...allIds].filter((id) => featureForId(id) === null)
  if (unmapped.length)
    throw new Error(`Ids with no feature mapping (add a rule in features.ts): ${unmapped.join(', ')}`)
  const covered = new Set([...allIds].map((id) => featureForId(id)))
  const emptyKeys = FEATURE_KEYS.filter((k) => !covered.has(k))
  if (emptyKeys.length)
    throw new Error(`FEATURE_KEYS with no registry ids: ${emptyKeys.join(', ')}`)
}

/** Prune combined structure by env + reachability (the rendered tree). */
function pruneTree(nodes: IdNode[], env: EnvMap, reachable: Set<string>): IdNode[] {
  const result: IdNode[] = []
  for (const node of nodes) {
    if (node.presentWhen && env[node.presentWhen.env] !== node.presentWhen.equals) continue
    const children = node.children ? pruneTree(node.children, env, reachable) : []
    if (!reachable.has(node.id) && children.length === 0) continue
    const pruned: IdNode = { id: node.id, role: node.role }
    if (node.label) pruned.label = node.label
    if (node.runtimeConditional) pruned.runtimeConditional = true
    if (node.collection) pruned.collection = true
    if (children.length > 0) pruned.children = children
    result.push(pruned)
  }
  return result
}

function flatIds(nodes: IdNode[], out: string[] = []): string[] {
  for (const node of nodes) {
    out.push(node.id)
    if (node.children) flatIds(node.children, out)
  }
  return out
}

async function loadManifest(appDir: string, app: string): Promise<SiteFeatures> {
  const file = join(appDir, 'config', 'site-features.ts')
  if (!existsSync(file)) throw new Error(`Missing feature manifest: apps/${app}/config/site-features.ts`)
  const mod = await import(pathToFileURL(file).href)
  if (!mod.SITE_FEATURES) throw new Error(`apps/${app}/config/site-features.ts must export SITE_FEATURES`)
  return mod.SITE_FEATURES as SiteFeatures
}

type FeatureReport = {
  expected: boolean
  present: boolean
  ids: string[]
  missingIds: string[]
}

async function generateForApp(app: string): Promise<boolean> {
  const appDir = join(REPO_ROOT, 'apps', app)
  if (!existsSync(appDir)) throw new Error(`App not found: apps/${app}`)
  const env = parseEnv(join(appDir, '.env'))
  const manifest = await loadManifest(appDir, app)

  // Reachability — one import-graph walk, scanning all feature constants.
  const allConstants: Record<string, object> = {}
  const allValidIds = new Set<string>()
  for (const { testIds, constName } of REGISTRIES) {
    allConstants[constName] = testIds
    for (const id of flattenIds(testIds)) allValidIds.add(id)
  }
  const { ids: reachable, fileCount } = computeReachableIds(appDir, REPO_ROOT, allConstants, allValidIds)

  // Required ids per feature = registry ids that (a) survive build-env pruning and
  // (b) are not runtimeConditional (those "may be absent" — the linter enforces their
  // wiring instead, so a missing one doesn't fail the gate).
  const presence = collectPresenceRules(ALL_STRUCTURE)
  const optional = collectOptionalIds(ALL_STRUCTURE)
  const requiredByFeature = new Map<FeatureKey, string[]>()
  for (const id of allValidIds) {
    if (optional.has(id)) continue
    const rule = presence.get(id)
    if (rule && env[rule.env] !== rule.equals) continue // env-pruned → not required
    const feature = featureForId(id)
    if (!feature) continue
    const arr = requiredByFeature.get(feature)
    if (arr) arr.push(id)
    else requiredByFeature.set(feature, [id])
  }

  const features: Record<string, FeatureReport> = {}
  const missingFeatures: string[] = []
  const unexpected: string[] = []
  for (const key of FEATURE_KEYS) {
    const required = (requiredByFeature.get(key) ?? []).sort()
    const present = required.filter((id) => reachable.has(id))
    const missingIds = required.filter((id) => !reachable.has(id))
    const expected = manifest[key] === true
    features[key] = { expected, present: present.length > 0, ids: present, missingIds }
    if (expected && missingIds.length) missingFeatures.push(key)
    if (!expected && present.length) unexpected.push(key)
  }

  const structure = pruneTree(ALL_STRUCTURE, env, reachable)
  const coverage = { ok: missingFeatures.length === 0, missingFeatures, unexpected }

  const output = {
    app,
    manifest,
    coverage,
    features,
    structure,
    ids: flatIds(structure).sort(),
  }
  const outFile = join(appDir, 'idmap.json')
  writeFileSync(outFile, JSON.stringify(output, null, 2) + '\n')

  const status = coverage.ok ? 'OK' : `GAPS(${missingFeatures.length})`
  console.log(
    `  ${app}: ${output.ids.length} ids, coverage ${status}` +
      (missingFeatures.length ? ` — missing: ${missingFeatures.join(', ')}` : '') +
      (unexpected.length ? ` | unexpected: ${unexpected.join(', ')}` : '') +
      ` (${fileCount} files scanned) -> apps/${app}/idmap.json`,
  )
  return coverage.ok
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const check = args.includes('--check')
  const apps = args.filter((a) => a.startsWith('--app=')).map((a) => a.slice('--app='.length))
  const targets = apps.length ? apps : DEFAULT_APPS

  for (const { registry, testIds } of REGISTRIES) validateRegistry(registry, testIds)
  validateFeatureCatalog()

  console.log(`Generating id map for: ${targets.join(', ')}`)
  let allOk = true
  for (const app of targets) {
    const ok = await generateForApp(app)
    allOk = allOk && ok
  }
  console.log('Done.')
  if (check && !allOk) {
    console.error('\nCoverage gate FAILED — see missing features above.')
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
