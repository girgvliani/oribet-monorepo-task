#!/usr/bin/env bash

set -euo pipefail

BASE_SHA="${BASE_SHA:-origin/main}"
HEAD_SHA="${HEAD_SHA:-HEAD}"

APPS=("@repo/oribet")
ROOT_CONFIG_FILES=(
  "package.json"
  "pnpm-lock.yaml"
  "pnpm-workspace.yaml"
  "turbo.json"
  "tsconfig.json"
  ".npmrc"
)

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_command git
require_command jq
require_command pnpm

if ! git rev-parse --verify "$BASE_SHA" >/dev/null 2>&1; then
  echo "Base ref '$BASE_SHA' was not found. Set BASE_SHA to a valid local git ref." >&2
  exit 1
fi

if ! git rev-parse --verify "$HEAD_SHA" >/dev/null 2>&1; then
  echo "Head ref '$HEAD_SHA' was not found. Set HEAD_SHA to a valid local git ref." >&2
  exit 1
fi

changed_files="$(git diff --name-only "$BASE_SHA" "$HEAD_SHA")"

for config_file in "${ROOT_CONFIG_FILES[@]}"; do
  if grep -Fxq "$config_file" <<<"$changed_files"; then
    echo "Root config changed ($config_file); building all apps."
    pnpm turbo run build --filter=@repo/oribet

    exit 0
  fi
done

affected_output="$(
  pnpm turbo query affected \
    --packages "${APPS[@]}" \
    --base "$BASE_SHA" \
    --head "$HEAD_SHA" \
    --no-update-notifier
)"

affected_json="$(sed -n '/^{/,$p' <<<"$affected_output")"

mapfile -t affected_apps < <(
  jq -r '
    .data.affectedPackages.items[]
    | select(.name == "@repo/oribet")
    | .name
  ' <<<"$affected_json" | sort -u
)

if [ "${#affected_apps[@]}" -eq 0 ]; then
  echo "No affected apps found between $BASE_SHA and $HEAD_SHA; skipping build."
  exit 0
fi

filters=()
for app in "${affected_apps[@]}"; do
  filters+=("--filter=$app")
done

echo "Building affected apps: ${affected_apps[*]}"
pnpm turbo run build "${filters[@]}"
