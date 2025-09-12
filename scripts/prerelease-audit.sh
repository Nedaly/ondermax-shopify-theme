#!/bin/bash
# ================================================
# ONDERMAX — Pre-Release Audit, Cleanup & Local QA
# Safe, reversible flow — LIVE untouched
# ================================================

set -euo pipefail

STORE="ncjbp3-cm.myshopify.com"
DEV_THEME_NAME="ondermax-shopify-theme-develop"
DEV_THEME_ID="187749400907"
SPRINT_BRANCH="feature/cleanup-prerelease-$(date +%Y%m%d)"
DATE_STAMP="$(date +%F)"
RELEASE_VERSION="${RELEASE_VERSION:-v1.2.0}"
STAGING_THEME_NAME="staging-${RELEASE_VERSION}-${DATE_STAMP}"

# -------- helpers (mac vs linux sed) --------
if sed --version >/dev/null 2>&1; then SED="sed -i"; else SED="sed -i ''"; fi

echo "▶ Preflight…"
command -v shopify >/dev/null || { echo "❌ Shopify CLI missing"; exit 1; }
command -v git >/dev/null || { echo "❌ git missing"; exit 1; }

[[ -d .git ]] || { echo "❌ Run in your theme repo root"; exit 1; }
git fetch --all --tags
git checkout develop && git pull --rebase

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Uncommitted changes; commit/stash first."; exit 1
fi

# -------- resolve dev theme id --------
echo "▶ Using development theme ID: ${DEV_THEME_ID} for '${DEV_THEME_NAME}'"
echo "✅ DEV_THEME_ID=${DEV_THEME_ID}"

# -------- create safety branch --------
echo "▶ Creating safety branch: ${SPRINT_BRANCH}"
git checkout -b "${SPRINT_BRANCH}"

# -------- pull latest development theme snapshot (NO LIVE) --------
echo "▶ Pulling development theme snapshot into working tree…"
shopify theme pull \
  --store "${STORE}" \
  --theme "${DEV_THEME_ID}" \
  --path . \
  --nodelete

# -------- quick inventory --------
echo "▶ Inventory:"
find assets -maxdepth 1 -type f | wc -l | xargs echo "  assets files:"
find sections -maxdepth 1 -type f | wc -l | xargs echo "  sections files:"
find snippets -maxdepth 1 -type f | wc -l | xargs echo "  snippets files:"

# -------- AUDIT: locate debug code --------
echo "▶ Auditing for debug code (console.log, debugger, TODO, FIXME, DEBUG)…"
DBG_TMP=".debug_audit_${DATE_STAMP}.txt"
( 
  echo "=== JS/TS debug matches ==="
  grep -RIn --include='*.js' --include='*.ts' -E '\b(console\.log|debugger)\b' assets/ || true
  echo
  echo "=== Liquid debug markers ==="
  grep -RIn --include='*.liquid' -E '(DEBUG|TODO|FIXME|console\.log|debugger)' sections/ snippets/ templates/ || true
) | tee "${DBG_TMP}"

echo "▶ Top offenders (from your notes) — printing context:"
for f in assets/quick-add.js assets/media-gallery.js; do
  if [[ -f "$f" ]]; then
    echo "----- $f -----"; nl -ba "$f" | sed -n '1,200p'
  fi
done

# -------- CLEANUP (safe patterns) --------
# 1) Remove console.log lines from specific known files only
echo "▶ Cleaning console.log from targeted files…"
for f in assets/quick-add.js assets/media-gallery.js; do
  [[ -f "$f" ]] || continue
  ${SED} '/console\.log/d' "$f"
done

# 2) Remove `debugger;` in all JS under assets (safe)
echo "▶ Removing 'debugger;' in assets/*.js …"
find assets -type f -name "*.js" -print0 | xargs -0 -I{} ${SED} 's/^\s*debugger;\s*$//'

# 3) Strip obvious Liquid debug crumbs (commented DEBUG lines) — conservative
echo "▶ Stripping Liquid DEBUG comments (conservative)…"
for d in sections snippets; do
  find "$d" -type f -name "*.liquid" -print0 | xargs -0 -I{} ${SED} '/{%-?\s*comment\s*-?%}.*DEBUG.*{%-?\s*endcomment\s*-?%}/d'
done

# 4) (Optional) Remove known one-line debug prints like `{{ "DEBUG" }}`
echo "▶ Removing trivial one-line debug prints in Liquid…"
for d in sections snippets; do
  find "$d" -type f -name "*.liquid" -print0 | xargs -0 -I{} ${SED} '/{{\s*["'\'']DEBUG["'\'']\s*}}/d'
done

# -------- SHOW DIFF & ask confirmation --------
echo "▶ Cleanup diff (review carefully):"
git --no-pager diff --stat
echo
read -rp "Approve these changes? [y/N]: " OK
[[ "${OK:-N}" =~ ^[Yy]$ ]] || { echo "⛔ Aborted by user."; exit 1; }

git add .
git commit -m "chore: pre-release cleanup (remove console logs, debugger, liquid DEBUG crumbs)"

# -------- THEME CHECK --------
echo "▶ Running Shopify Theme Check…"
shopify theme check

# -------- LOCAL SERVE FOR QA --------
echo "▶ Starting local server (new terminal recommended):"
echo "   shopify theme serve --store ${STORE}"
echo "   QA checklist:"
cat <<'QA'
  - Homepage → PDP → Cart → Checkout path
  - Bundle deals (main focus)
  - RTL/Arabic/Hebrew fonts & numerals; spacing
  - Mobile responsiveness (iOS Safari, Android Chrome)
  - Console: 0 errors, 0 leftover logs
  - Performance quick scan: images lazy, no huge assets
QA
read -rp "Press Enter when local QA is complete to continue…"

# -------- OPTIONAL: push UNPUBLISHED staging for wider QA (still safe) --------
read -rp "Push an UNPUBLISHED staging theme for team QA? [y/N]: " STAGE
if [[ "${STAGE:-N}" =~ ^[Yy]$ ]]; then
  echo "▶ Pushing UNPUBLISHED staging: ${STAGING_THEME_NAME}"
  shopify theme push \
    --store "${STORE}" \
    --unpublished \
    --theme-name "${STAGING_THEME_NAME}"
  echo "ℹ️ Review in Admin → Themes Library: ${STAGING_THEME_NAME} (UNPUBLISHED)"
fi

echo "✅ Cleanup & local QA flow complete."
echo "Next:"
echo "  1) Continue dev on '${SPRINT_BRANCH}' (commit per change; reference CSV IDs)."
echo "  2) When ready: cut a release branch, push UNPUBLISHED candidate, full QA, then publish via CLI on your approval."

