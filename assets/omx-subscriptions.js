/**
 * Ondermax Custom Subscription Widget Controller - Hotfix
 *
 * Manual Tests:
 * 1) Open PDP → Console should log `[OMX] seeds` and show `sellingPlanId` + `resolvedFrom: "allocations"` or `"groups"`
 * 2) Select **One Time** → months box appears; buttons keep their original labels; CTA becomes "BUY NOW – $47.00 / $141.00 / …"
 * 3) Select **Subscribe & save** → months box hides; CTA shows the subscription price (`per_delivery_price` if present, else 20% off)
 * 4) Click CTA in **subscription** mode → Console logs `[OMX] posting subscription` with `sellingPlanId`. Cart should show it as a subscription (contract)
 * 5) Click CTA in **one-time** 3-month → Console logs one-time with months=3. Cart shows quantity 3 (no subscription flag)
 * 6) One-time → click 1/3/6 → The clicked button should get gradient (we toggle `.selected`/`.active` + `aria-pressed`)
 * 7) Variant change → Console logs `[OMX] variant change → plan re-resolved` with new plan data
 */

// ================== OMX SUBSCRIPTIONS CONTROLLER (HOTFIX) ==================
(() => {
  const DEBUG = true;

  const root = document.getElementById('omx-subscription-root');
  if (!root) return;

  if (window.__omxSubAbortCtl) window.__omxSubAbortCtl.abort();
  const ac = new AbortController();
  window.__omxSubAbortCtl = ac;
  const opt = { signal: ac.signal };

  // ---- Seeds from data-* ----
  const moneyFormat = root.dataset.moneyFormat || '${{amount}}';
  const basePriceCents = Number(root.dataset.basePriceCents || 0);
  let variantId = root.dataset.variantId || null;
  const allocs = parseJSON(root.dataset.spAllocJson);
  const groups = parseJSON(root.dataset.spGroupsJson);
  const manualOverride = root.dataset.sellingPlanId || '';

  let { sellingPlanId, subscriptionPriceCents, resolvedFrom } =
    resolveSubscriptionData(allocs, groups, basePriceCents, manualOverride);

  const state = { mode: 'subscription', months: 1 };

  // ---- DOM refs (existing) ----
  const subCard = document.getElementById('subscription-card');
  const oneCard = document.getElementById('one-time-card');
  const radios = document.querySelectorAll('input[name="purchase_type"]');
  const monthsBox = document.getElementById('supply-selector');
  const monthBtns = monthsBox
    ? monthsBox.querySelectorAll('.modern-btn[data-supply]')
    : [];
  const qtyInput =
    document.getElementById('custom-quantity') ||
    createHidden(root, 'custom-quantity', 'quantity', '1');
  const cta =
    document.querySelector('[data-omx-atc]') ||
    document.querySelector('form[action^="/cart/add"] [type="submit"]');
  const subPriceNode = document.querySelector('#omx-sub-price[data-omx-price]');
  const oneTimePriceNode = document.querySelector(
    '#omx-onetime-price[data-omx-price]'
  );

  if (DEBUG)
    console.log('[OMX] seeds', {
      basePriceCents,
      variantId,
      allocsLen: allocs.length,
      groupsLen: groups.length,
      manualOverride,
      sellingPlanId,
      subscriptionPriceCents,
      resolvedFrom,
    });

  // ---- Helpers ----
  function parseJSON(s) {
    try {
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }
  function fmt(c) {
    return window.Shopify && Shopify.formatMoney
      ? Shopify.formatMoney(c, moneyFormat)
      : (c / 100).toFixed(2);
  }
  function createHidden(parent, id, name, val) {
    const i = document.createElement('input');
    i.type = 'hidden';
    i.id = id;
    i.name = name;
    i.value = val;
    parent.appendChild(i);
    return i;
  }

  // Month button active-state fix (don't change design; just toggle known classes/attributes)
  function setMonthActive(m) {
    monthBtns.forEach((btn) => {
      const is = Number(btn.dataset.supply) === Number(m);
      btn.setAttribute('aria-pressed', String(is));
      // Toggle the correct classes based on the actual CSS structure
      btn.classList.toggle('active', is);
      btn.classList.toggle('inactive', !is);
    });
  }

  function currentCents() {
    return state.mode === 'subscription'
      ? subscriptionPriceCents
      : basePriceCents * (state.months || 1);
  }
  function updateCTA() {
    if (!cta) return;
    const label =
      state.mode === 'subscription'
        ? `SUBSCRIBE & SAVE – ${fmt(currentCents())}`
        : `BUY NOW – ${fmt(currentCents())}`;
    cta.innerText = label;
  }
  function setCardSelection() {
    if (!subCard || !oneCard) return;
    if (state.mode === 'subscription') {
      subCard.classList.add('selected');
      subCard.classList.remove('unselected');
      oneCard.classList.remove('selected');
      oneCard.classList.add('unselected');
    } else {
      oneCard.classList.add('selected');
      oneCard.classList.remove('unselected');
      subCard.classList.remove('selected');
      subCard.classList.add('unselected');
    }
  }
  function setMonthsVisibility() {
    if (!monthsBox) return;
    monthsBox.style.display = state.mode === 'onetime' ? '' : 'none';
  }
  function updateInlinePrices() {
    if (subPriceNode) subPriceNode.textContent = fmt(subscriptionPriceCents);
    if (oneTimePriceNode) oneTimePriceNode.textContent = fmt(basePriceCents);
  }

  function setSellingPlanOnForm(form) {
    form
      .querySelectorAll('input[name="selling_plan"]')
      .forEach((n) => n.remove());
    if (state.mode === 'subscription') {
      const sp = document.createElement('input');
      sp.type = 'hidden';
      sp.name = 'selling_plan';
      sp.value = sellingPlanId || '';
      form.appendChild(sp);
      let q = form.querySelector('input[name="quantity"]');
      if (!q) q = createHidden(form, 'omx-qty', 'quantity', '1');
      q.value = '1';
      if (DEBUG)
        console.log('[OMX] posting subscription', {
          sellingPlanId,
          price: fmt(subscriptionPriceCents),
        });
    } else {
      let q = form.querySelector('input[name="quantity"]');
      if (!q) q = createHidden(form, 'omx-qty', 'quantity', '1');
      q.value = String(state.months || 1);
      if (DEBUG)
        console.log('[OMX] posting one-time', {
          months: state.months,
          price: fmt(currentCents()),
        });
    }
  }

  // ---- Event wiring (idempotent) ----
  radios.forEach((r) =>
    r.addEventListener(
      'change',
      (e) => {
        state.mode =
          e.target.value === 'subscription' ? 'subscription' : 'onetime';
        if (state.mode === 'subscription') {
          state.months = 1;
          qtyInput.value = '1';
        }
        setCardSelection();
        setMonthsVisibility();
        updateInlinePrices();
        updateCTA();
        if (state.mode === 'onetime') setMonthActive(state.months);
        window.dataLayer?.push({
          event: 'subscription_option_selected',
          mode: state.mode,
          months: state.months,
          variantId,
        });
      },
      opt
    )
  );

  monthBtns.forEach((btn) =>
    btn.addEventListener(
      'click',
      () => {
        if (state.mode !== 'onetime') return; // ignore when subscription mode
        state.months = Number(btn.dataset.supply || '1') || 1;
        qtyInput.value = String(state.months);
        setMonthActive(state.months); // <<< visual gradient fix
        updateCTA();
        window.dataLayer?.push({
          event: 'subscription_option_selected',
          mode: 'onetime',
          months: state.months,
          variantId,
        });
      },
      opt
    )
  );

  // ATC (click + submit) so we win both AJAX and native submits
  if (cta) {
    const form = cta.closest('form[action^="/cart/add"]');
    const attach = () => {
      if (form) setSellingPlanOnForm(form);
    };
    cta.addEventListener('click', attach, opt);
    form && form.addEventListener('submit', attach, opt);
  }

  // Variant change support (re-resolve plan & price)
  document.addEventListener(
    'change',
    (e) => {
      const vSel = e.target.closest('select[name="id"], input[name="id"]');
      if (!vSel) return;
      // When variant changes, re-read data attributes (section likely re-rendered)
      const freshRoot = document.getElementById('omx-subscription-root');
      if (!freshRoot) return;
      variantId = freshRoot.dataset.variantId || variantId;
      const a2 = parseJSON(freshRoot.dataset.spAllocJson);
      const g2 = parseJSON(freshRoot.dataset.spGroupsJson);
      const manual2 = freshRoot.dataset.sellingPlanId || manualOverride;
      ({ sellingPlanId, subscriptionPriceCents, resolvedFrom } =
        resolveSubscriptionData(
          a2,
          g2,
          Number(freshRoot.dataset.basePriceCents || basePriceCents),
          manual2
        ));
      if (DEBUG)
        console.log('[OMX] variant change → plan re-resolved', {
          variantId,
          resolvedFrom,
          sellingPlanId,
          subscriptionPriceCents,
        });
      updateInlinePrices();
      updateCTA();
    },
    opt
  );

  // Initial paint
  setCardSelection();
  setMonthsVisibility();
  updateInlinePrices();
  updateCTA();
  if (state.mode === 'onetime') setMonthActive(state.months);

  // Theme Editor / SPA hooks
  [
    'shopify:section:load',
    'shopify:section:reorder',
    'shopify:block:select',
    'turbo:load',
    'page:load',
    'swup:contentReplaced',
  ].forEach((ev) => document.addEventListener(ev, () => ac.abort(), opt));

  // ---- plan resolver with manual override ----
  function resolveSubscriptionData(allocs, groups, base, manual) {
    if (manual) {
      return {
        sellingPlanId: manual,
        subscriptionPriceCents: Math.round(base * 0.8),
        resolvedFrom: 'manual-override',
      };
    }
    if (Array.isArray(allocs) && allocs.length) {
      const a = allocs[0];
      let price = Math.round(base * 0.8);
      if (a?.per_delivery_price != null) price = Number(a.per_delivery_price);
      else if (
        Array.isArray(a?.price_adjustments) &&
        a.price_adjustments.length
      ) {
        const adj = a.price_adjustments[0];
        if (adj.value_type === 'percentage')
          price = Math.round((base * (100 - Number(adj.value))) / 100);
        else if (adj.value_type === 'fixed_amount')
          price = Math.max(0, base - Number(adj.value));
        else if (adj.value_type === 'price') price = Number(adj.value);
      }
      return {
        sellingPlanId: a?.selling_plan?.id || null,
        subscriptionPriceCents: price,
        resolvedFrom: 'allocations',
      };
    }
    if (Array.isArray(groups) && groups.length) {
      const firstPlan = groups[0]?.selling_plans?.[0] || null;
      return {
        sellingPlanId: firstPlan?.id || null,
        subscriptionPriceCents: Math.round(base * 0.8),
        resolvedFrom: 'groups',
      };
    }
    return {
      sellingPlanId: null,
      subscriptionPriceCents: Math.round(base * 0.8),
      resolvedFrom: 'fallback-20%',
    };
  }
})();
// ================== /HOTFIX ==================
