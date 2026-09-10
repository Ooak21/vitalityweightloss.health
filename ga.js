/* Vitality Weight Loss — Google tag loader (GA4 + Google Ads) + site-wide event tracking.
 *
 * TO ACTIVATE: paste your GA4 Measurement ID into GA4_MEASUREMENT_ID below (looks like "G-XXXXXXXXXX").
 * Until a real ID is set, this runs in DRY MODE — it wires everything and logs events to the
 * browser console but sends NOTHING to Google, so it is safe to deploy as-is.
 *
 * Loaded on every public page via: <script src="/ga.js" defer></script>
 * Fire a custom conversion anywhere with: window.vitalityTrack('event_name', { key: 'value' })
 * Fire a Google Ads conversion with:   window.vitalityAdsConversion('intake_completed', { ... })
 */
(function () {
  "use strict";
  var GA4_MEASUREMENT_ID = "G-HWCGE6Q1LS"; // Vitality Weight Loss GA4 property (live 2026-07-07)
  var GOOGLE_ADS_ID = "AW-18438580697";     // Google Ads account tag (added 2026-09-08)

  // No Google tag of any kind on the signed-in surfaces (Fred, 2026-09-04): anyone on these pages
  // has signed in as a patient or as staff, so neither the analytics tag nor the advertising tag
  // belongs there. GitHub Pages serves each page with and without the .html extension, so both
  // forms are matched. Until 2026-09-08 only the Ads destination was withheld here and GA4 still
  // loaded; now the loader itself stays out.
  var SIGNED_IN_SURFACE = /\/(portal|portal-login|m|rewards|sequences|templates)(\.html)?$/;
  var SIGNED_IN = SIGNED_IN_SURFACE.test(location.pathname);

  var LIVE = /^G-[A-Z0-9]{6,}$/.test(GA4_MEASUREMENT_ID) && !SIGNED_IN;
  var ADS = /^AW-\d{6,}$/.test(GOOGLE_ADS_ID) && !SIGNED_IN;

  // Google Ads conversion labels. Fred built the four actions in the account (2026-09-08); each
  // fires on the real success event, never on a URL. "InBody scan booked" fires from /scan/, which
  // deliberately carries no site-wide tag, so its label lives in scan/index.html instead.
  var ADS_LABELS = {
    intake_completed: "geexCK6ywPEcENnTmdhE",   // intake.html, after /patient-prefs accepts the intake
    consult_paid:     "Ob00CLGywPEcENnTmdhE",   // glp1.html, on payment success, with the real amount
    phone_call:       "ZccWCLSywPEcENnTmdhE"    // any tel: link click (below)
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (LIVE) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_MEASUREMENT_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA4_MEASUREMENT_ID, { anonymize_ip: true });
    // Same gtag.js library serves both products; a second config call is how Google documents
    // adding an Ads destination to an existing Google tag.
    if (ADS) gtag("config", GOOGLE_ADS_ID);
  }

  // Unified tracker. Pages can call window.vitalityTrack('purchase', {...}) on real conversions.
  window.vitalityTrack = function (name, params) {
    params = params || {};
    params.page_path = location.pathname;
    if (LIVE) window.gtag("event", name, params);
    else if (!SIGNED_IN && window.console) console.debug("[GA4 dry-run] " + name, params);
  };

  // Google Ads conversion. Silent (returns false) on signed-in surfaces, in dry-run, or for an
  // unknown name, so a page can call it unconditionally. `params` may carry value / currency /
  // transaction_id for the purchase action; nothing about the person is ever passed here.
  window.vitalityAdsConversion = function (name, params) {
    if (!ADS || !LIVE || !ADS_LABELS[name]) return false;
    var p = { send_to: GOOGLE_ADS_ID + "/" + ADS_LABELS[name] };
    if (params) for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) p[k] = params[k];
    window.gtag("event", "conversion", p);
    return true;
  };

  // ---- Auto event tracking (works in dry-run too, so you can verify wiring before the ID lands) ----
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("a,button") : null;
    if (!el) return;
    var href = (el.getAttribute && el.getAttribute("href")) || "";
    var text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
    if (href.indexOf("tel:") === 0) {
      window.vitalityTrack("call_click", { link_text: text, phone_number: href.slice(4) });
      window.vitalityAdsConversion("phone_call");
    } else if (href.indexOf("mailto:") === 0) {
      window.vitalityTrack("email_click", { email: href.slice(7) });
    } else if (/instagram\.com|facebook\.com|youtube\.com|youtu\.be|tiktok\.com/i.test(href)) {
      window.vitalityTrack("social_click", { destination: href, link_text: text });
    } else if (/(^|\/)(intake|checkout|eligibility-check)|#book|glp1|bloom|quiz/i.test(href) ||
               /start (your|the)|become a patient|book|check eligibility|take the/i.test(text)) {
      window.vitalityTrack("cta_click", { cta_text: text, destination: href });
    }
  }, true);

  // Form submits: treat payment/checkout forms as begin_checkout, everything else as a lead.
  //
  // AUTH FORMS ARE EXCLUDED. Until 2026-08-14 this counted every form submit as a lead, which meant
  // patient portal logins (portal-login.html), Thrive app logins and password resets (m.html) were
  // all landing in the lead figure. generate_lead is a conversion in GA4, so a returning patient
  // signing in was being reported as a new lead. Sign-in is not acquisition.
  var AUTH_FORM = /login|signin|sign-in|reset|password|forgot|auth/;
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f || f.tagName !== "FORM") return;
    // Pages that fire generate_lead themselves on Convex success (quiz, webinar) set data-ga-manual.
    if (f.getAttribute("data-ga-manual") != null) return;
    var id = (f.id || f.getAttribute("name") || "").toLowerCase();
    if (AUTH_FORM.test(id)) return;
    var isPay = /checkout|payment|\bpay\b|card|billing/.test(id);
    window.vitalityTrack(isPay ? "begin_checkout" : "generate_lead", { form_id: id || "form" });
  }, true);
})();
