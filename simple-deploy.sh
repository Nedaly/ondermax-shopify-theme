#!/bin/bash
# =========================================================
# Simple merge feature → develop → push UNPUBLISHED staging for QA
# =========================================================

set -euo pipefail
STORE="ncjbp3-cm.myshopify.com"
FEATURE="feature/cleanup-prerelease-20250912"
RELEASE_VERSION="${RELEASE_VERSION:-v1.2.1}"
DATE_STAMP="$(date +%F)"
STAGING_NAME="staging-${RELEASE_VERSION}-${DATE_STAMP}"

command -v git >/dev/null || { echo "❌ git missing"; exit 1; }
command -v shopify >/dev/null || { echo "❌ Shopify CLI missing"; exit 1; }
[[ -d .git ]] || { echo "❌ run in repo root"; exit 1; }

echo "▶ Fetch remotes"
git fetch --all --tags

echo "▶ Ensure clean working tree"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Uncommitted changes; commit or stash first."; exit 1
fi

echo "▶ Update local develop from origin"
git checkout develop
git pull --rebase origin develop || true

echo "▶ Merge feature → develop (simple merge)"
git merge "${FEATURE}" -m "merge: ${FEATURE} into develop (pre-release cleanup)"

echo "▶ Run Theme Check (errors only). Warnings allowed for now."
shopify theme check --fail-level error || { 
  echo "⛔ Fix errors above before staging."; exit 1; 
}

echo "▶ Push develop to remote"
git push origin develop

echo "▶ Push UNPUBLISHED STAGING for team QA: ${STAGING_NAME}"
shopify theme push \
  --store "${STORE}" \
  --unpublished \
  --theme-name "${STAGING_NAME}"

cat <<'QA'

✅ Staging created (UNPUBLISHED). QA checklist:
  - Header/logo visible on Homepage & PDP (mobile/desktop)
  - PDP → Cart → Checkout flow OK
  - RTL (AR/HE) fonts & numerals correct
  - Browser console: 0 errors
  - Pixels/consent: clean, no duplicates
  - Only warnings left in Theme Check (errors = 0)
  - Tick rows in the CRO CSV checklist

If fixes are needed, commit them on develop and re-run Theme Check.
When QA passes, use the approval-gated publish script in the next step to go live.
QA
