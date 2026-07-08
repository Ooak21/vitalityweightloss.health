/* Vitality Weight Loss — GA4 analytics loader + site-wide event tracking.
 *
 * TO ACTIVATE: paste your GA4 Measurement ID into GA4_MEASUREMENT_ID below (looks like "G-XXXXXXXXXX").
 * Until a real ID is set, this runs in DRY MODE — it wires everything and logs events to the
 * browser console but sends NOTHING to Google, so it is safe to deploy as-is.
 *
 * Loaded on every public page via: <script src="/ga.js" defer></script>
 * Fire a custom conversion anywhere with: window.vitalityTrack('event_name', { key: 'value' })
 */
(function () {
  "use strict";
  var GA4_MEASUREMENT_ID = "G-HWCGE6Q1LS"; // Vitality Weight Loss GA4 property (live 2026-07-07)

  var LIVE = /^G-[A-Z0-9]{6,}$/.test(GA4_MEASUREMENT_ID);

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
  }

  // Unified tracker. Pages can call window.vitalityTrack('purchase', {...}) on real conversions.
  window.vitalityTrack = function (name, params) {
    params = params || {};
    params.page_path = location.pathname;
    if (LIVE) window.gtag("event", name, params);
    else if (window.console) console.debug("[GA4 dry-run] " + name, params);
  };

  // ---- Auto event tracking (works in dry-run too, so you can verify wiring before the ID lands) ----
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("a,button") : null;
    if (!el) return;
    var href = (el.getAttribute && el.getAttribute("href")) || "";
    var text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
    if (href.indexOf("tel:") === 0) {
      window.vitalityTrack("call_click", { link_text: text, phone_number: href.slice(4) });
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
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f || f.tagName !== "FORM") return;
    var id = (f.id || f.getAttribute("name") || "").toLowerCase();
    var isPay = /checkout|payment|\bpay\b|card|billing/.test(id);
    window.vitalityTrack(isPay ? "begin_checkout" : "generate_lead", { form_id: id || "form" });
  }, true);
})();
