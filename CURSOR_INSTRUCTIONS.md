# CURSOR INSTRUCTIONS — Ondermax Shopify Theme (Copy-Paste)

You are a senior Shopify theme engineer working in **Cursor**. Apply the playbooks below exactly. Use **native Liquid only** (no custom i18n helpers). Keep changes **atomic**, safe, and **reversible**. **Do not publish** unless explicitly requested.

---

## 0) Global Rules (Always)

- **Git Flow**
  - `main` = Production (never commit directly)
  - `develop` = Integration
  - `feature/*`, `release/*`, `hotfix/*` = Working branches
- **Naming theme copies**
  - `ondermax-shopify-theme-{env}-{slugOrSemver}-{YYYYMMDD-HHMM}`
  - Examples:
    - Develop: `...-develop-{branch}-20250924-2115`
    - Staging: `...-staging-v1.3.0-20250924-2115`
    - Staging-Hotfix: `...-staging-hotfix-rtl-footer-20250924-2115`
    - Production: `...-production-v1.3.0`
- **Shrine auth/loader** — **DO NOT MODIFY**
  - Keep meta + loader exactly (line order can vary, attributes same):
    ```liquid
    <meta name="shrine-auth"
          content="{{ settings.shrine_auth_token | default: settings.authentication_token | escape }}"
          class="notranslate" data-i18n-lock translate="no">
    <script src="https://js.shrinetheme.com/js/v2/main.js?version=1"
            defer="defer" data-defer="true"
            data-is-rtl="{{ is_rtl }}"
            data-country-list-function="{{ settings.country_list_function }}"
            data-country-list="{{ settings.country_list }}"
            data-country-list-error="{{ settings.country_invalid_error_msg }}"
            data-animations-type="{{ settings.animations_type }}"></script>
    ```
- **i18n policy**
  - **Locked UI copy** → `{{ 'key' | t }}`
  - **Merchant-editable strings** → native Liquid fallback (no helpers):
    ```liquid
    {% capture __maybe %}{{ value | t }}{% endcapture %}
    {% if __maybe contains 'Translation missing' %}
      {{ value }}
    {% else %}
      {{ __maybe }}
    {% endif %}
    ```
- **RTL & Fonts**
  - In `<head>` **after** main CSS:
    ```liquid
    {% if request.locale.iso_code contains 'ar' %}{{ 'lang-ar.css' | asset_url | stylesheet_tag }}{% endif %}
    {% if request.locale.iso_code contains 'he' %}{{ 'lang-he.css' | asset_url | stylesheet_tag }}{% endif %}
    {% if request.locale.iso_code contains 'ar' or request.locale.iso_code contains 'he' %}{{ 'rtl.css' | asset_url | stylesheet_tag }}{% endif %}
    ```
  - `assets/lang-ar.css`
    ```css
    :root:lang(ar){
      --font-body-family:'PlexArabic',Cairo,system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Arabic',sans-serif;
      --font-heading-family:'PlexArabic',Cairo,system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Arabic',sans-serif;
    }
    :root:lang(ar) footer, :root:lang(ar) .footer, :root:lang(ar) #shopify-section-footer { font-family: var(--font-body-family) !important; }
    :root:lang(ar) footer *, :root:lang(ar) .footer *, :root:lang(ar) #shopify-section-footer * { font-family: inherit !important; }
    ```
  - `assets/lang-he.css`
    ```css
    :root:lang(he){
      --font-body-family:'HeeboLocal',system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Hebrew',sans-serif;
      --font-heading-family:'HeeboLocal',system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Hebrew',sans-serif;
    }
    :root:lang(he) footer, :root:lang(he) .footer, :root:lang(he) #shopify-section-footer { font-family: var(--font-body-family) !important; }
    :root:lang(he) footer *, :root:lang(he) .footer *, :root:lang(he) #shopify-section-footer * { font-family: inherit !important; }
    ```
  - `assets/rtl.css` minimal utilities:
    ```css
    html[dir="rtl"] body{direction:rtl}
    html[dir="rtl"] .text-start{text-align:right}
    html[dir="rtl"] .text-end{text-align:left}
    html[dir="rtl"] .ml-auto{margin-left:0;margin-right:auto}
    html[dir="rtl"] .mr-auto{margin-right:0;margin-left:auto}
    .rtl-flip{transform:scaleX(-1)} [dir="rtl"] .rtl-flip{transform:scaleX(-1)}
    .rtl-num{direction:ltr;unicode-bidi:isolate}
    ```

---

## 1) Decision Matrix (pick one playbook below)

- **Feature / Refactor (non-urgent)** → Use **Playbook A**
- **P0/P1 Hotfix (urgent prod bug)** → Use **Playbook B**
- **Bundle to Release Candidate** → Use **Playbook C**
- **Publish Approved RC to Production** → Use **Playbook D**

---

## 2) Playbook A — Feature → Develop → Staging → Release (NO publish)

**Inputs**: current branch is `feature/<slug>`, CSV IDs list.

**Tasks**
1. **Detect ThemeRoot** (folder with `layout/theme.liquid`) and print absolute path.
2. **Safety snapshot**: copy changed files to `.backup_feature/<timestamp>/`.
3. **Linter**: run `shopify theme check` and print summary (don't fail the run).
4. **i18n enforcement**
   - Replace `{{ section.settings.* | t }}` / `{{ block.settings.* | t }}` with the **fallback** when these are merchant-editable.
   - Keep fixed UI as hard keys `{{ 'key' | t }}`.
   - Ensure the three language CSS includes are **after** main CSS in `<head>`.
5. **Footer font guarantee**: ensure `:root:lang(ar|he)` + footer overrides exist (as shown above).
6. **Hardcoded scan** (report only):
   - Print any remaining literals in sections/snippets/templates that should be keys.
7. **Print-only** staging push command (do not execute):
   ```bash
   shopify theme push --unpublished \
     --theme "ondermax-shopify-theme-develop-$(git branch --show-current)-$(date +%Y%m%d-%H%M)" \
     --ignore "node_modules/*" "*/.map" ".*"
   ```

8. **Commit (execute, same branch)**:

   ```
   git add -A
   git commit -m "feat(i18n,rtl): enforce native Liquid fallback for merchant text; AR/HE font + footer inheritance; keep Shrine stock
   - replace risky '| t' on settings with fallback
   - ensure lang-ar.css/lang-he.css/rtl.css order and variables
   CSV: <IDs>"
   ```

**Output**

* ThemeRoot path
* Diffstat (+/-)
* List of added/updated locale keys (if any)
* The print-only push command

---

## 3) Playbook B — Hotfix (main → Staging-Hotfix → Production)

**Inputs**: current branch is `hotfix/<slug>` from `main`. One-line issue summary.

**Tasks**

1. **ThemeRoot & snapshot**: `.backup_hotfix/<timestamp>/`.
2. **Verify Shrine untouched**: print short code excerpt of meta + loader.
3. **Minimal fix only**:

   * Wrap only the affected merchant-editable outputs with the **fallback**.
   * Add/footer AR/HE overrides if missing.
4. **Linter**: `shopify theme check` (print summary).
5. **Print-only** staging push command:

   ```bash
   shopify theme push --unpublished \
     --theme "ondermax-shopify-theme-staging-hotfix-<slug>-$(date +%Y%m%d-%H%M)" \
     --ignore "node_modules/*" "*/.map" ".*"
   ```
6. **QA checklist (print)**:

   * Home, PDP, Collection EN/AR/HE
   * No "Translation missing" in DOM
   * Fonts loaded:

     ```js
     Promise.all([document.fonts.ready, document.fonts.check('1em PlexArabic'), document.fonts.check('1em HeeboLocal')]).then(([,ar,he])=>console.log({PlexArabic:ar,HeeboLocal:he}))
     ```
   * Shrine payload script present; data-animations-type length > 0
7. **Commit (execute)**:

   ```
   git add -A
   git commit -m "fix(hotfix): <slug> — minimal i18n/RTL correction; Shrine loader/auth unchanged
   - native fallback on affected settings
   - footer font enforcement for AR/HE
   CSV: <IDs or N/A>"
   ```

**Output**

* Diffstat
* Staging push command (print-only)
* QA checklist (printed)

---

## 4) Playbook C — Release Candidate (develop → release/vX.Y.Z → Staging)

**Inputs**: Version `vX.Y.Z`.

**Tasks**

1. If needed, create `release/vX.Y.Z` from `develop`.
2. Update `/docs/changelog.md` and any version display (if stored).
3. Re-audit i18n/RTL:

   * No "Translation missing"
   * Language CSS includes order correct
   * `:root:lang(ar|he)` font variables + footer inheritance present
4. Linter + print Lighthouse steps (Home, PDP, Collection):

   * Perf>90, A11y>95, BP>90, SEO>95
5. **Print-only** staging push command:

   ```bash
   shopify theme push --unpublished \
     --theme "ondermax-shopify-theme-staging-vX.Y.Z-$(date +%Y%m%d-%H%M)" \
     --ignore "node_modules/*" "*/.map" ".*"
   ```
6. Commit (execute):

   ```
   git add -A
   git commit -m "chore(release): prepare vX.Y.Z — i18n/RTL verified; docs updated"
   ```

**Output**

* Diffstat
* Staging push command (print-only)
* RC QA checklist (printed)

---

## 5) Playbook D — Publish Approved RC → Production

**Inputs**: Approved `vX.Y.Z`, staging theme name.

**Tasks**

1. Duplicate current production theme (keep 2 rollback slots).
2. **Print-only** publish:

   ```bash
   shopify theme publish --theme "ondermax-shopify-theme-staging-vX.Y.Z-<TIMESTAMP>"
   ```
3. Tag + mergebacks (print exact commands):

   ```bash
   git tag -a vX.Y.Z -m "Ondermax Production vX.Y.Z"
   git checkout main && git merge --no-ff release/vX.Y.Z
   git checkout develop && git merge --no-ff main
   ```
4. Commit docs update (execute if changed):

   ```
   git add -A
   git commit -m "chore(release): publish vX.Y.Z — tag + mergeback complete"
   ```

**Output**

* Safety note (rollback slots kept)
* Git command summary (printed)

---

## 6) QA & Console Snippets (for operators)

**Dev server**

```bash
shopify theme check
shopify theme dev
# EN: http://127.0.0.1:9292/
# AR: http://127.0.0.1:9292/?locale=ar
# HE: http://127.0.0.1:9292/?locale=he
```

**Browser console**

```js
// Translation missing?
[...document.querySelectorAll('body *')].some(n=>/Translation missing:/i.test(n.textContent))

// Fonts loaded?
Promise.all([document.fonts.ready, document.fonts.check('1em PlexArabic'), document.fonts.check('1em HeeboLocal')])
  .then(([,ar,he])=>console.log({PlexArabic:ar, HeeboLocal:he}))

// Shrine loader present?
(() => {
  const s=document.querySelector('script[src*="shrinetheme.com/js"]');
  return {ok:!!s, len:s?.getAttribute('data-animations-type')?.length||0};
})()
```

---

## 7) Commit Standards

**Message**

```
type(scope): concise description

- Bullet(s) of changes
- Why (user impact or CRO)
CSV: <IDs>
```

**Examples**

```
feat(i18n): add AR/HE fallback on hero & badges
- wrap merchant strings with native Liquid fallback
- keep fixed UI as hard-keyed locales
CSV: HOM-001,HOM-004
```

---

## 8) Safety & Rollback

* Keep last **two** production themes available.
* Never overwrite a live theme; always push as **unpublished** first.
* For hotfixes: fix → staging-hotfix → smoke QA → publish → back-merge.

---

## 9) Deliverables (every run)

* ThemeRoot path
* Diffstat (+/-)
* List of modified files
* Any new/updated locale keys
* Print-only commands for push/publish
* Explicit confirmation that Shrine auth/loader remained untouched

---
