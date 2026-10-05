#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "usage: $0 work main [gh-pr-create-options...]" >&2
  exit 1
fi

source_branch="$1"
base_branch="$2"
shift 2
if [ "$source_branch" != work ] || [ "$base_branch" != main ]; then
  echo 'This fork submits only work -> upstream main.' >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"
if [ -n "$(git status --porcelain)" ]; then
  echo 'Commit or remove local changes before creating a submission.' >&2
  exit 1
fi

upstream_repo='eGovFramework/egovframe-msa-edu'
branch="upstream-submit/$(date +%Y%m%d%H%M%S)"
denylist=(
  AGENTS.md
  .github/workflows/fork-ci.yml
  .github/workflows/sync-upstream-main.yml
  .github/workflows/check-upstream-pr-hygiene.yml
  .github/workflows/close-resolved-issues.yml
  scripts/open_upstream_pr.sh
  scripts/close_resolved_issues.py
)

git fetch origin "$source_branch"
git switch -c "$branch" "origin/$source_branch"
for path in "${denylist[@]}"; do
  git rm -rq --ignore-unmatch -- "$path"
done
if ! git diff --cached --quiet; then
  git -c user.name='Fork submission' -c user.email='fork-submission@users.noreply.github.com' \
    commit -m 'chore: strip fork-only files from upstream submission'
fi

if ! git remote get-url upstream >/dev/null 2>&1; then
  git remote add upstream "https://github.com/$upstream_repo.git"
fi
git fetch upstream "$base_branch"
if git diff --quiet "upstream/$base_branch...HEAD"; then
  echo 'No upstream-bound changes remain after stripping fork-only files.' >&2
  exit 1
fi
echo 'Proposed upstream file list:'
git diff --name-status "upstream/$base_branch...HEAD"
echo 'Inspect the full diff before asking for merge:'
echo "  git diff upstream/$base_branch...HEAD"

git push -u origin "$branch"
gh pr create --repo "$upstream_repo" --base "$base_branch" \
  --head "leejongyoung:$branch" "$@"
echo "Source $source_branch is unchanged. Submission head: $branch"
