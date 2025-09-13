# =========================================================
# ONDERMAX — Local QA Only (no publish)
# Goal: run static checks, scan for debug code & heavy assets,
# start local server, and guide manual QA steps. LIVE untouched.
# =========================================================

set -euo pipefail

STORE="ncjbp3-cm.myshopify.com"
DEV_THEME_NAME="ondermax-shopify-theme-develop"
DATE_STAMP="$(date +%F_%H%M)"
REPORT_DIR=".qa-reports/${DATE_STAMP}"

# ---------- helpers ----------
mkdir -p "${REPORT_DIR}"
if sed --version >/dev/null 2>&1; then SED="sed -i"; else SED="sed -i ''"; fi

command -v shopify >/dev/null || { echo "❌ Shopify CLI missing"; exit 1; }
command -v git >/dev/null || { echo "❌ git missing"; exit 1; }
[[ -d .git ]] || { echo "❌ Run in your repo root"; exit 1; }

echo "▶ Sync develop (no release/publish in this script)…"
git fetch --all --tags
git checkout develop
git pull --rebase

# ---------- pull the current DEV THEME snapshot locally (optional but recommended) ----------
echo "▶ Resolving DEV theme ID for '${DEV_THEME_NAME}'…"
THEME_LIST="$(shopify theme list --store "${STORE}")"
DEV_THEME_ID="$(echo "$THEME_LIST" | awk -v n="${DEV_THEME_NAME}" '$0 ~ n {print $1; exit}')"
if [[ -n "${DEV_THEME_ID}" ]]; then
  echo "▶ Pulling DEV theme snapshot (no delete)…"
  shopify theme pull --store "${STORE}" --theme "${DEV_THEME_ID}" --path . --nodelete
else
  echo "⚠️ Could not find '${DEV_THEME_NAME}'. Skipping pull; continuing with current working tree."
fi

# ---------- STATIC CHECKS ----------
echo "▶ Shopify Theme Check…"
shopify theme check | tee "${REPORT_DIR}/theme-check.txt" || true

echo "▶ Scan for debug statements (console.log / debugger) …"
( 
  echo "=== assets/*.js ==="
  grep -RIn --include='*.js' -E '\b(console\.log|debugger)\b' assets/ || true
  echo
  echo "=== liquid DEBUG crumbs (DEBUG/TODO/FIXME) in sections/snippets ==="
  grep -RIn --include='*.liquid' -E '(DEBUG|TODO|FIXME|console\.log|debugger)' sections/ snippets/ || true
) | tee "${REPORT_DIR}/debug-scan.txt"

echo "▶ Scan for oversized assets (>1.5 MB) …"
find assets -type f -size +1500k -exec ls -lh {} \; | awk '{print $5, $9}' | tee "${REPORT_DIR}/large-assets.txt" || true

echo "▶ Basic CSS/JS lint-ish checks (look for merge markers) …"
grep -RIn '<<<<<<<\|=======\|>>>>>>>' assets sections snippets || true

# ---------- OPTIONAL: trim obvious console.log/debugger (commented out, reversible) ----------
read -rp "Comment out console.log/debugger in assets/*.js for local QA? [y/N]: " AUTO_CLEAN
if [[ "${AUTO_CLEAN:-N}" =~ ^[Yy]$ ]]; then
  find assets -type f -name "*.js" -print0 | xargs -0 -I{} ${SED} 's/^\s*console\.log\(.*\);/\/\/ QA: console.log removed \1;/' {}
  find assets -type f -name "*.js" -print0 | xargs -0 -I{} ${SED} 's/^\s*debugger;\s*$/\/\/ QA: debugger removed/' {}
  echo "ℹ️ Changes are local only. Review with: git diff"
fi

# ---------- START LOCAL SERVER ----------
echo
echo "▶ Start the local dev server in a separate terminal (no live impact):"
echo "   shopify theme serve --store ${STORE}"
echo "   # After it starts, open the URL it prints (often http://127.0.0.1:9292 or :3000)"
echo

# ---------- PRINT QA CHECKLIST ----------
cat > "${REPORT_DIR}/QA-CHECKLIST.txt" <<'TXT'
ONDERMAX — Local QA Checklist
--------------------------------
1) Header & Logo
   - Homepage: logo visible immediately (desktop + mobile)
   - Product PDP: logo visible and consistent
   - No overlap: header above hero (z-index ok)

2) Core Journeys
   - Homepage → PDP → Cart → Checkout path
   - Bundle deals / variant selection / sticky ATC
   - Cart drawer and Buy Buttons function

3) RTL & Typography
   - Arabic/Hebrew: fonts load, numerals correct, spacing/mirroring OK
   - No layout shift when fonts load

4) Trust & Content
   - Returns, shipping times, UGC/reviews visible
   - Payment icons / trust badges present at PDP & checkout entry

5) Tracking & Compliance
   - Consent state respected
   - Pixels fire once (Meta, GA4, etc.) — check console/network

6) Performance (quick)
   - No console errors or warnings spam
   - Images lazy-load; videos not blocking first paint
   - No >1.5MB assets on critical path (see large-assets.txt)

7) Visual polish
   - Spacing consistent with design system
   - CTA hierarchy clear (primary > secondary)
   - No text clipping/overlaps on iPhone 12/13 and common Android widths

If all pass → proceed to staging/release flow (separate script).
TXT

echo "▶ QA checklist written to: ${REPORT_DIR}/QA-CHECKLIST.txt"
echo
echo "Next:"
echo "  1) Run the local server (see command above)."
echo "  2) Work through the checklist. Fix locally as needed."
echo "  3) Re-run scans with:"
echo "       shopify theme check"
echo "       grep -RIn 'console\\.log\\|debugger' assets"
echo "  4) When you're satisfied, use the release/publish script (separate) to push UNPUBLISHED staging, QA, then approve publish via CLI."
