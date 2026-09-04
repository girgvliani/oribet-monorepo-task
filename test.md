# Affected Build Test Scenarios

These scenarios test the remote affected-build script without changing the main checkout.

The examples create temporary Git worktrees under `/tmp`, make one test commit, run `pnpm build:affected:remote`, and then remove the worktree.

## Before Testing

From the repo root:

```bash
git status --short
```

The scripts require:

```text
git
jq
pnpm
```

## Scenario 1: `apps/oribet` Change Builds Only `@repo/oribet`

Create a temporary worktree:

```bash
git worktree add /tmp/oribet-test-oribet HEAD
cd /tmp/oribet-test-oribet
```

Change only the `apps/oribet` app:

```bash
printf '\n// affected-build test: oribet\n' >> apps/oribet/src/vite-env.d.ts
git add apps/oribet/src/vite-env.d.ts
git commit -m "test affected build oribet only"
```

Run the remote affected build from the main checkout, where dependencies are installed:

```bash
cd /home/vasil/oribet-monorepo
BASE_SHA=$(git -C /tmp/oribet-test-oribet rev-parse HEAD~1) \
HEAD_SHA=$(git -C /tmp/oribet-test-oribet rev-parse HEAD) \
pnpm build:affected:remote
```

Expected output:

```text
Building affected apps: @repo/oribet
Packages in scope: @repo/oribet
Tasks: 1 successful, 1 total
```

`@repo/oribet-korea` should not be in scope.

Clean up:

```bash
git worktree remove /tmp/oribet-test-oribet --force
```

## Scenario 2: `apps/oribet-korea` Change Builds Only `@repo/oribet-korea`

Create a temporary worktree:

```bash
git worktree add /tmp/oribet-test-korea HEAD
cd /tmp/oribet-test-korea
```

Change only the `apps/oribet-korea` app:

```bash
printf '\n// affected-build test: oribet-korea\n' >> apps/oribet-korea/src/vite-env.d.ts
git add apps/oribet-korea/src/vite-env.d.ts
git commit -m "test affected build korea only"
```

Run the remote affected build from the main checkout:

```bash
cd /home/vasil/oribet-monorepo
BASE_SHA=$(git -C /tmp/oribet-test-korea rev-parse HEAD~1) \
HEAD_SHA=$(git -C /tmp/oribet-test-korea rev-parse HEAD) \
pnpm build:affected:remote
```

Expected output:

```text
Building affected apps: @repo/oribet-korea
Packages in scope: @repo/oribet-korea
Tasks: 1 successful, 1 total
```

`@repo/oribet` should not be in scope.

Clean up:

```bash
git worktree remove /tmp/oribet-test-korea --force
```

## Scenario 3: Root `package.json` Change Builds Both Apps

Create a temporary worktree:

```bash
git worktree add /tmp/oribet-test-root HEAD
cd /tmp/oribet-test-root
```

Change only root `package.json`:

```bash
node -e "const fs=require('fs'); const p='package.json'; const j=JSON.parse(fs.readFileSync(p,'utf8')); j.scripts['affected:test-marker']='echo affected'; fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');"
git add package.json
git commit -m "test affected build root package"
```

Run the remote affected build from the main checkout:

```bash
cd /home/vasil/oribet-monorepo
BASE_SHA=$(git -C /tmp/oribet-test-root rev-parse HEAD~1) \
HEAD_SHA=$(git -C /tmp/oribet-test-root rev-parse HEAD) \
pnpm build:affected:remote
```

Expected output:

```text
Root config changed (package.json); building all apps.
Packages in scope: @repo/oribet, @repo/oribet-korea
Tasks: 2 successful, 2 total
```

Clean up:

```bash
git worktree remove /tmp/oribet-test-root --force
```

## Final Check

After all scenarios:

```bash
git status --short
```

The main checkout should not contain changes from the temporary scenario commits.
