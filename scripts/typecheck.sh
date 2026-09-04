#!/usr/bin/env bash

set -euo pipefail

# Shared, machine-global Turbo cache so every git worktree of this repo reuses each other's
# typecheck results instead of recomputing them. Turbo keys cache entries by content hash, so
# cache hits are returned only for genuinely-identical inputs.
export TURBO_CACHE_DIR="${TURBO_CACHE_DIR:-$HOME/.cache/oribet-monorepo/turbo}"

MODE="${TYPECHECK_MODE:-affected}"
BASE_SHA="${BASE_SHA:-origin/develop}"
HEAD_SHA="${HEAD_SHA:-HEAD}"
GLOBAL_CONCURRENCY="${TYPECHECK_GLOBAL_CONCURRENCY:-3}"
LOCK_DIR="${TYPECHECK_LOCK_DIR:-$HOME/.cache/oribet-monorepo/typecheck-locks}"

TURBO_ARGS=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --mode=*)
      MODE="${1#*=}"
      ;;
    --mode)
      if [ "$#" -lt 2 ]; then
        echo "Missing value for --mode" >&2
        exit 1
      fi
      MODE="$2"
      shift
      ;;
    *)
      TURBO_ARGS+=("$1")
      ;;
  esac
  shift
done

ROOT_CONFIG_FILES=(
  "package.json"
  "pnpm-lock.yaml"
  "pnpm-workspace.yaml"
  "turbo.json"
  "tsconfig.json"
  ".npmrc"
  "scripts/typecheck.sh"
)

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

ensure_ref() {
  local ref="$1"

  if git rev-parse --verify "$ref" >/dev/null 2>&1; then
    return 0
  fi

  if [[ "$ref" == origin/* ]]; then
    local branch="${ref#origin/}"
    echo "Ref '$ref' not found locally; fetching origin/$branch."
    git fetch --no-tags origin "+refs/heads/$branch:refs/remotes/origin/$branch" >/dev/null 2>&1 || true
  fi

  if ! git rev-parse --verify "$ref" >/dev/null 2>&1; then
    echo "Git ref '$ref' was not found. Set BASE_SHA/HEAD_SHA to valid refs." >&2
    exit 1
  fi
}

is_positive_integer() {
  [[ "$1" =~ ^[0-9]+$ ]] && [ "$1" -gt 0 ]
}

require_command git
require_command jq
require_command pnpm

if ! is_positive_integer "$GLOBAL_CONCURRENCY"; then
  echo "TYPECHECK_GLOBAL_CONCURRENCY must be a positive integer." >&2
  exit 1
fi

if [ "$GLOBAL_CONCURRENCY" -gt 0 ]; then
  require_command lockf
  mkdir -p "$LOCK_DIR"
  for ((slot = 1; slot <= GLOBAL_CONCURRENCY; slot++)); do
    : >"$LOCK_DIR/slot-$slot.lock"
  done
fi

APP_DIRS=()
APP_PACKAGES=()
for package_json in apps/*/package.json; do
  [ -f "$package_json" ] || continue
  app_dir="${package_json%/package.json}"
  package_name="$(jq -r 'select(.scripts.typecheck != null) | .name // empty' "$package_json")"
  if [ -n "$package_name" ]; then
    APP_DIRS+=("$app_dir")
    APP_PACKAGES+=("$package_name")
  fi
done

if [ "${#APP_PACKAGES[@]}" -eq 0 ]; then
  echo "No app packages with typecheck scripts found."
  exit 0
fi

add_target() {
  local package_name="$1"
  local existing

  if [ "${#TARGET_PACKAGES[@]}" -gt 0 ]; then
    for existing in "${TARGET_PACKAGES[@]}"; do
      if [ "$existing" = "$package_name" ]; then
        return 0
      fi
    done
  fi

  TARGET_PACKAGES+=("$package_name")
}

add_all_apps() {
  local package_name

  for package_name in "${APP_PACKAGES[@]}"; do
    add_target "$package_name"
  done
}

is_root_or_tooling_change() {
  local file="$1"
  local config_file

  for config_file in "${ROOT_CONFIG_FILES[@]}"; do
    if [ "$file" = "$config_file" ]; then
      return 0
    fi
  done

  case "$file" in
    packages/config/typescript/*)
      return 0
      ;;
  esac

  return 1
}

add_app_for_path() {
  local file="$1"
  local index

  for index in "${!APP_DIRS[@]}"; do
    case "$file" in
      "${APP_DIRS[$index]}"/*)
        add_target "${APP_PACKAGES[$index]}"
        return 0
        ;;
    esac
  done

  return 1
}

collect_worktree_changes() {
  {
    git diff --name-only
    git diff --cached --name-only
    git ls-files --others --exclude-standard
  } | sort -u
}

collect_committed_changes() {
  git diff --name-only "$BASE_SHA" "$HEAD_SHA" | sort -u
}

run_with_global_slot() {
  local slot lock_file exit_file error_file status

  while true; do
    for ((slot = 1; slot <= GLOBAL_CONCURRENCY; slot++)); do
      lock_file="$LOCK_DIR/slot-$slot.lock"
      touch "$lock_file"
      exit_file="$(mktemp "${TMPDIR:-/tmp}/oribet-typecheck.XXXXXX")"
      error_file="$(mktemp "${TMPDIR:-/tmp}/oribet-typecheck-error.XXXXXX")"

      if lockf -n "$lock_file" bash -c '
        exit_file="$1"
        shift
        "$@" 2>&1
        status=$?
        printf "%s" "$status" > "$exit_file"
        exit "$status"
      ' _ "$exit_file" "$@" 2>"$error_file"; then
        rm -f "$exit_file" "$error_file"
        return 0
      fi

      status=$?
      if [ -s "$exit_file" ]; then
        cat "$error_file" >&2
        rm -f "$exit_file" "$error_file"
        return "$status"
      fi

      rm -f "$exit_file" "$error_file"
    done

    sleep 1
  done
}

run_app_typecheck() {
  local package_name="$1"
  local command

  echo "Typechecking $package_name"

  command=(
    pnpm turbo run typecheck
    "--filter=$package_name"
    "--concurrency=1"
  )

  if [ "${#TURBO_ARGS[@]}" -gt 0 ]; then
    command+=("${TURBO_ARGS[@]}")
  fi

  run_with_global_slot "${command[@]}"
}

TARGET_PACKAGES=()

case "$MODE" in
  all)
    add_all_apps
    ;;
  affected)
    ensure_ref "$BASE_SHA"
    ensure_ref "$HEAD_SHA"

    committed_changed_files="$(collect_committed_changes)"
    worktree_changed_files="$(collect_worktree_changes)"
    all_changed_files="$(printf "%s\n%s\n" "$committed_changed_files" "$worktree_changed_files" | sed '/^$/d' | sort -u)"

    while IFS= read -r file; do
      [ -n "$file" ] || continue

      if is_root_or_tooling_change "$file"; then
        echo "Root/tooling config changed ($file); typechecking all apps."
        add_all_apps
        break
      fi
    done <<<"$all_changed_files"

    if [ "${#TARGET_PACKAGES[@]}" -eq 0 ] && [ -n "$committed_changed_files" ]; then
      affected_output="$(
        pnpm turbo query affected \
          --packages "${APP_PACKAGES[@]}" \
          --base "$BASE_SHA" \
          --head "$HEAD_SHA" \
          --no-update-notifier
      )"
      affected_json="$(sed -n '/^{/,$p' <<<"$affected_output")"

      while IFS= read -r package_name; do
        [ -n "$package_name" ] || continue
        add_target "$package_name"
      done < <(
        jq -r '
          .data.affectedPackages.items[]?
          | .name
        ' <<<"$affected_json"
      )
    fi

    if [ "${#TARGET_PACKAGES[@]}" -eq 0 ] && [ -n "$worktree_changed_files" ]; then
      while IFS= read -r file; do
        [ -n "$file" ] || continue

        if add_app_for_path "$file"; then
          continue
        fi

        case "$file" in
          packages/*)
            echo "Shared package changed ($file); typechecking all apps."
            add_all_apps
            break
            ;;
        esac
      done <<<"$worktree_changed_files"
    fi
    ;;
  *)
    echo "Unsupported TYPECHECK_MODE '$MODE'. Use 'affected' or 'all'." >&2
    exit 1
    ;;
esac

if [ "${#TARGET_PACKAGES[@]}" -eq 0 ]; then
  echo "No affected apps found between $BASE_SHA and $HEAD_SHA; skipping typecheck."
  exit 0
fi

echo "Typecheck mode: $MODE"
echo "Global typecheck concurrency: $GLOBAL_CONCURRENCY"
echo "Target apps: ${TARGET_PACKAGES[*]}"

pids=()
for package_name in "${TARGET_PACKAGES[@]}"; do
  run_app_typecheck "$package_name" &
  pids+=("$!")
done

exit_status=0
for pid in "${pids[@]}"; do
  if ! wait "$pid"; then
    exit_status=1
  fi
done

exit "$exit_status"
