#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: bash scripts/init_doc_bundle.sh <repo-root> <requirement-name>" >&2
  exit 1
fi

repo_root="$1"
requirement_name="$2"

if [[ ! -d "$repo_root" ]]; then
  echo "Repo root does not exist: $repo_root" >&2
  exit 1
fi

target_dir="$repo_root/doc/$requirement_name"
mkdir -p "$target_dir"

files=(
  "$target_dir/help-center-full.md"
  "$target_dir/official-site-copy.md"
  "$target_dir/in-product-short.md"
)

for file in "${files[@]}"; do
  if [[ ! -f "$file" ]]; then
    : > "$file"
  fi
done

printf '%s\n' "${files[@]}"
