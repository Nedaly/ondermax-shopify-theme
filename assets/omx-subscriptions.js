/* ================= OMX SUBSCRIPTIONS CONTROLLER — FINAL ================== */
(() => {
  const DEBUG = true;

  const root = document.getElementById('omx-subscription-root');
  if (!root) return;

  // avoid duplicate listeners on Theme Editor / SPA reloads
  if (window.__omxSubAbortCtl) window.__omxSubAbortCtl.abort();
  const ac = new AbortController();
  window.__omxSubAbortCtl = ac;
  const opt = { signal: ac.signal };

  // ----- seeds from DOM -----
  const moneyFormat = root.dataset.moneyFormat || '${{amount}}';
  const basePriceCents = Number(root.dataset.basePriceCents || 0);
  let variantId = root.dataset.variantId || null;
  const productId = root.dataset.productId || null;
  const productHandle = root.dataset.productHandle || null;
  const allocsRaw = root.dataset.spAllocJson || '[]';
  const groupsRaw = root.dataset.spGroupsJson || '[]';
  const manualDataAttr = root.dataset.sellingPlanId || '';
  const manualUrlParam = new URLSearchParams(location.search).get('spid') || '';

  // parse safely
  const allocs = safeJSON(allocsRaw);
  const groups = safeJSON(groupsRaw);

  // runtime auto-detect (for flaky dev previews): first plan id present anywhere in page JSON
  const autoDetectedId =
    !manualUrlParam && !manualDataAttr
      ? extractPlanIdFromString(allocsRaw) || extractPlanIdFromString(groupsRaw)
      : '';
  
  // Enhanced fallback: try product ID, handle, then auto-detect
  const manualOverride =
    manualUrlParam || manualDataAttr || productId || productHandle || autoDetectedId || '';
  
  // Debug logging (production)
  if (DEBUG) {
    console.log('OMX Subscription Debug:', {
      productId,
      productHandle,
      variantId,
      manualOverride,
      allocs: allocs.length,
      groups: groups.length
    });
  }

  // resolve plan id + price
  let { sellingPlanId, subscriptionPriceCents, resolvedFrom } =
    resolveSubscription(
      allocs,
      groups,
      basePriceCents,
      manualOverride,
      allocsRaw,
      groupsRaw
    );
    
  // Debug the resolution result (production)
  if (DEBUG) {
    console.log('OMX Subscription Resolution:', {
      sellingPlanId,
      subscriptionPriceCents,
      resolvedFrom
    });
  }

  // expose for console checks
  window.__OMX_LAST_PLAN_ID = sellingPlanId;
  window.__OMX_LAST_MODE = 'subscription';
  window.__OMX_LAST_MONTHS = 1;

  // ----- live UI state -----
  const state = { mode: 'subscription', months: 1 };

  // ----- dom refs (existing) -----
  const subCard = document.getElementById('subscription-card');
  const oneCard = document.getElementById('one-time-card');
  const radios = document.querySelectorAll('input[name="purchase_type"]');
  const monthsBox = document.getElementById('supply-selector');
  const monthBtns = monthsBox
    ? monthsBox.querySelectorAll('.modern-btn[data-supply]')
    : [];
  const qtyInput =
    document.getElementById('custom-quantity') ||
    hidden(root, 'custom-quantity', 'quantity', '1');
  const cta =
    document.querySelector('[data-omx-atc]') ||
    document.querySelector('form[action^="/cart/add"] [type="submit"]');

  const subPriceNode = document.querySelector('#subscription-price-display');
  const oneTimePriceNode = document.querySelector(
    '#omx-onetime-price[data-omx-price]'
  );

  if (DEBUG)
    console.log('[OMX] seeds', {
      basePriceCents,
      variantId,
      allocsLen: sizeOf(allocs),
      groupsLen: sizeOf(groups),
      manualOverride: manualOverride || '(none)',
      sellingPlanId,
      subscriptionPriceCents,
      resolvedFrom,
    });

  // ----- helpers -----
  function safeJSON(s) {
    try {
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }
  function fmt(c) {
    if (window.Shopify && Shopify.formatMoney) {
      return Shopify.formatMoney(c, moneyFormat);
    }
    // Fallback: add currency symbol manually
    return '$' + (c / 100).toFixed(2);
  }
  function hidden(parent, id, name, val) {
    const i = document.createElement('input');
    i.type = 'hidden';
    i.id = id;
    i.name = name;
    i.value = val;
    parent.appendChild(i);
    return i;
  }
  function sizeOf(x) {
    return Array.isArray(x)
      ? x.length
      : x && typeof x === 'object'
        ? Object.keys(x).length
        : 0;
  }
  function extractPlanIdFromString(s) {
    if (!s) return null;
    const m = String(s).match(/gid:\/\/shopify\/SellingPlan\/[A-Za-z0-9]+/);
    return m ? m[0] : null;
  }

  function setMonthActive(m) {
    monthBtns.forEach((btn) => {
      const is = Number(btn.dataset.supply) === Number(m);
      btn.setAttribute('aria-pressed', String(is));
      btn.classList.toggle('selected', is);
      btn.classList.toggle('active', is);
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
    if (monthsBox)
      monthsBox.style.display = state.mode === 'onetime' ? '' : 'none';
  }

  function updateInlinePrices() {
    if (subPriceNode) subPriceNode.textContent = fmt(subscriptionPriceCents);
    if (oneTimePriceNode) oneTimePriceNode.textContent = fmt(basePriceCents);
  }

  // ensure correct payload in the SAME product form that posts to /cart/add
  function injectPayloadInto(form) {
    // wipe previous
    form
      .querySelectorAll('input[name="selling_plan"]')
      .forEach((n) => n.remove());

    if (state.mode === 'subscription') {
      const sp = document.createElement('input');
      sp.type = 'hidden';
      sp.name = 'selling_plan';
      sp.value = sellingPlanId || '';
      form.appendChild(sp);
      
      // Debug logging (production)
      if (DEBUG) {
        console.log('OMX Subscription: Injecting selling plan', {
          sellingPlanId,
          form: form.tagName
        });
      }
      let q = form.querySelector('input[name="quantity"]');
      if (!q) q = hidden(form, 'omx-qty', 'quantity', '1');
      q.value = '1';
      if (DEBUG)
        console.log('[OMX] posting subscription', {
          sellingPlanId,
          price: fmt(subscriptionPriceCents),
        });
    } else {
      let q = form.querySelector('input[name="quantity"]');
      if (!q) q = hidden(form, 'omx-qty', 'quantity', '1');
      q.value = String(state.months || 1);
      if (DEBUG)
        console.log('[OMX] posting one-time', {
          months: state.months,
          price: fmt(currentCents()),
        });
    }

    // cache
    window.__OMX_LAST_PLAN_ID = sellingPlanId;
    window.__OMX_LAST_MODE = state.mode;
    window.__OMX_LAST_MONTHS = state.months;
  }

  // ----- events -----
  radios.forEach((r) =>
    r.addEventListener(
      'change',
      (e) => {
        state.mode =
          e.target.value === 'subscription' ? 'subscription' : 'onetime';
        if (state.mode === 'subscription') {
          state.months = 1;
          qtyInput.value = '1';
          // Ensure selling plan is available for subscription
          if (!sellingPlanId) {
            console.warn('OMX Subscription: No selling plan ID found for subscription mode');
          }
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
        if (state.mode !== 'onetime') return;
        state.months = Number(btn.dataset.supply || '1') || 1;
        qtyInput.value = String(state.months);
        setMonthActive(state.months);
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

  // hook both click & submit so we survive themes that serialize manually
  if (cta) {
    const form = cta.closest('form[action^="/cart/add"]') || 
                 cta.closest('form') || 
                 document.querySelector('form[action*="/cart/add"]') ||
                 document.querySelector('form[action*="cart"]');
    const attach = () => {
      if (form) {
        injectPayloadInto(form);
        if (DEBUG) {
          console.log('OMX Subscription: Form found and payload injected', {
            form: form.tagName,
            action: form.action,
            sellingPlanId
          });
        }
      } else {
        console.warn('OMX Subscription: No form found for CTA', cta);
        // Try to find any form on the page
        const allForms = document.querySelectorAll('form');
        console.log('Available forms on page:', Array.from(allForms).map(f => ({
          tagName: f.tagName,
          action: f.action,
          method: f.method
        })));
      }
    };
    cta.addEventListener('click', attach, opt);
    form && form.addEventListener('submit', attach, opt);
    
    // Debug form detection (production)
    if (DEBUG) {
      console.log('OMX Subscription: CTA and form detection', {
        cta: cta ? cta.tagName : 'not found',
        form: form ? form.tagName : 'not found'
      });
    }
  }

  // variant change → re-resolve plan from fresh DOM data attrs
  document.addEventListener(
    'change',
    (e) => {
      const vSel = e.target.closest('select[name="id"], input[name="id"]');
      if (!vSel) return;
      const freshRoot = document.getElementById('omx-subscription-root');
      if (!freshRoot) return;
      variantId = freshRoot.dataset.variantId || variantId;

      const a2 = safeJSON(freshRoot.dataset.spAllocJson || '[]');
      const g2 = safeJSON(freshRoot.dataset.spGroupsJson || '[]');
      const manual =
        new URLSearchParams(location.search).get('spid') ||
        freshRoot.dataset.sellingPlanId ||
        '';

      ({ sellingPlanId, subscriptionPriceCents, resolvedFrom } =
        resolveSubscription(
          a2,
          g2,
          Number(freshRoot.dataset.basePriceCents || basePriceCents),
          manual,
          freshRoot.dataset.spAllocJson,
          freshRoot.dataset.spGroupsJson
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

  // first paint
  setCardSelection();
  setMonthsVisibility();
  updateInlinePrices();
  updateCTA();
  if (state.mode === 'onetime') setMonthActive(state.months);

  // theme editor / SPA safety
  [
    'shopify:section:load',
    'shopify:section:reorder',
    'shopify:block:select',
    'turbo:load',
    'page:load',
    'swup:contentReplaced',
  ].forEach((ev) => document.addEventListener(ev, () => ac.abort(), opt));

  // ----- resolver (allocations → groups → manual → regex fallback) -----
  function resolveSubscription(
    allocs,
    groups,
    base,
    manual,
    rawA = allocsRaw,
    rawG = groupsRaw
  ) {
    // manual override (data attr or ?spid)
    if (manual)
      return {
        sellingPlanId: manual,
        subscriptionPriceCents: Math.round(base * 0.8),
        resolvedFrom: 'manual-override',
      };

    // 1) allocations (array or edges) — prefer per-variant allocations
    const listA = normalizeList(allocs);
    if (listA.length) {
      // pick the first with an id
      const found = listA.find((a) => getPlanId(a)) || listA[0];
      const spId = getPlanId(found);
      const price = getAllocPrice(found, base);
      if (spId)
        return {
          sellingPlanId: spId,
          subscriptionPriceCents: price,
          resolvedFrom: 'allocations',
        };
    }

    // 2) groups (array or edges) — less precise pricing
    const listG = normalizeList(groups);
    if (listG.length) {
      const g = listG[0];
      const plans =
        normalizeList(g?.selling_plans) || normalizeList(g?.sellingPlans);
      const firstPlan = plans[0] || null;
      const spId = getPlanId(firstPlan);
      if (spId)
        return {
          sellingPlanId: spId,
          subscriptionPriceCents: Math.round(base * 0.8),
          resolvedFrom: 'groups',
        };
    }

    // 3) regex fallback — yank first gid from raw JSON
    const rxId = extractPlanIdFromString(rawA) || extractPlanIdFromString(rawG);
    if (rxId)
      return {
        sellingPlanId: rxId,
        subscriptionPriceCents: Math.round(base * 0.8),
        resolvedFrom: 'regex-fallback',
      };

    // 4) no plan but keep UI working
    return {
      sellingPlanId: null,
      subscriptionPriceCents: Math.round(base * 0.8),
      resolvedFrom: 'fallback-20%',
    };
  }

  // shape helpers
  function normalizeList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (Array.isArray(x.edges))
      return x.edges.map((e) => e?.node).filter(Boolean);
    return [];
  }
  function getPlanId(obj) {
    if (!obj || typeof obj !== 'object') return null;
    return (
      obj.selling_plan_id ||
      obj.sellingPlanId ||
      obj.id ||
      obj?.selling_plan?.id ||
      obj?.sellingPlan?.id ||
      obj?.node?.id ||
      obj?.node?.selling_plan_id ||
      obj?.node?.selling_plan?.id ||
      null
    );
  }
  function getAllocPrice(a, base) {
    if (a?.per_delivery_price != null) return Number(a.per_delivery_price);
    if (a?.perDeliveryPrice?.amount != null)
      return Math.round(Number(a.perDeliveryPrice.amount) * 100);
    if (a?.price != null) return Number(a.price);
    if (Array.isArray(a?.price_adjustments) && a.price_adjustments.length) {
      const adj = a.price_adjustments[0];
      if (adj.value_type === 'percentage')
        return Math.round((base * (100 - Number(adj.value))) / 100);
      if (adj.value_type === 'fixed_amount')
        return Math.max(0, base - Number(adj.value));
      if (adj.value_type === 'price') return Number(adj.value);
    }
    return Math.round(base * 0.8);
  }
})();
/* ================= /FINAL ================== */
