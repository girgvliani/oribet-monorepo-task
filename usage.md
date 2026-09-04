# Affected Builds

This repo uses Turborepo and pnpm to build only the app packages affected by Git changes.

## Local Command

```bash
pnpm build:affected
```

This runs:

```bash
scripts/build-affected-local.sh
```

By default, the local script compares:

```bash
BASE_SHA=origin/main
HEAD_SHA=HEAD
```

## Remote Pipeline Command

```bash
pnpm build:affected:remote
```

This runs:

```bash
scripts/build-affected-remote.sh
```

The remote script is intended for CI pipelines. It uses CI-friendly defaults:

```bash
BASE_SHA=origin/${GITHUB_BASE_REF:-main}
HEAD_SHA=${GITHUB_SHA:-HEAD}
```

You can still override both refs from the pipeline:

```bash
BASE_SHA=<base-ref> HEAD_SHA=<head-ref> pnpm build:affected:remote
```

The remote script also tries to fetch a missing `origin/<branch>` ref before failing, which helps in GitHub Actions when the checkout does not already have the base branch ref.

### How the Remote Script Gets Refs

The remote script does not read commits from the GitHub API directly. It uses GitHub Actions environment variables to choose Git refs, then compares those refs with local Git commands.

In GitHub Actions:

```text
GITHUB_SHA       -> current workflow commit SHA
GITHUB_BASE_REF  -> pull request base branch, for example main
```

Then the script runs Git-based checks like:

```bash
git diff --name-only "$BASE_SHA" "$HEAD_SHA"
```

and Turbo also receives Git refs:

```bash
pnpm turbo query affected \
  --base "$BASE_SHA" \
  --head "$HEAD_SHA"
```

So the remote script gets ref names from GitHub Actions, but the actual comparison happens against the local Git history downloaded by `actions/checkout`. This is why the workflow uses:

```yaml
with:
  fetch-depth: 0
```

## Custom Git Range

You can override either ref:

```bash
BASE_SHA=main HEAD_SHA=HEAD pnpm build:affected
```

```bash
BASE_SHA=HEAD~1 HEAD_SHA=HEAD pnpm build:affected
```

Both refs must exist in local Git history.

For the remote script, use the same pattern:

```bash
BASE_SHA=HEAD~1 HEAD_SHA=HEAD pnpm build:affected:remote
```

## App Packages

The affected build scripts only build these app packages:

```text
apps/oribet           -> @repo/oribet
apps/oribet-korea     -> @repo/oribet-korea
apps/oribet-redesign  -> @repo/oribet-redesign
```

## Root Config Fallback

If any of these root files change, the script builds both apps:

```text
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
turbo.json
tsconfig.json
.npmrc
```

That fallback runs:

```bash
pnpm turbo run build \
  --filter=@repo/oribet \
  --filter=@repo/oribet-korea \
  --filter=@repo/oribet-redesign
```

## Affected Detection

For non-root-config changes, the script asks Turbo which app packages are affected:

```bash
pnpm turbo query affected \
  --packages @repo/oribet @repo/oribet-korea @repo/oribet-redesign \
  --base "$BASE_SHA" \
  --head "$HEAD_SHA"
```

The script parses Turbo's JSON response with `jq`, extracts affected app package names, and builds only those apps.

## Package Graph Behavior

Turborepo reads the pnpm workspace and each package's `package.json` dependencies.

If a file changes inside a shared package under `packages/*`, Turbo follows the workspace dependency graph and marks only dependent app packages as affected.

For example:

- A change only in `apps/oribet` builds only `@repo/oribet`.
- A change only in `apps/oribet-korea` builds only `@repo/oribet-korea`.
- A change in a shared package used by both apps builds both apps.
- A change in a shared package used by one app builds only that app.

## Pipeline Workflow

The test pipeline is:

```text
.github/workflows/testturbo.yaml
```

It runs on pull requests and manual dispatch, installs dependencies, and calls:

```bash
pnpm build:affected:remote
```

Recommended checkout setting for affected builds:

```yaml
with:
  fetch-depth: 0
```

This gives Turbo and Git enough history to compare `BASE_SHA` and `HEAD_SHA`.

## Skipping Builds

If Turbo reports no affected app packages, the script exits successfully without running a build:

```text
No affected apps found between <BASE_SHA> and <HEAD_SHA>; skipping build.
```

## Direct App Builds

You can still build each app directly:

```bash
pnpm build:oribet
```

```bash
pnpm build:oribet-korea
```

```bash
pnpm build:oribet-redesign
```

Those commands call Turborepo with a single app filter.

## Requirements

The scripts expect these commands to be available:

```text
git
jq
pnpm
```

## Manual Test Guide

See `test.md` for copy-paste scenarios that verify:

- `apps/oribet` change builds only `@repo/oribet`.
- `apps/oribet-korea` change builds only `@repo/oribet-korea`.
- `apps/oribet-redesign` change builds only `@repo/oribet-redesign`.
- root `package.json` change builds all apps.
