/* Vitality — PRE-LAUNCH GATE (waitlist capture)
   While PRELAUNCH = true, every patient-intake / payment CTA opens the waitlist modal
   instead of the real flow, and the intake pages themselves show the waitlist on load.
   Flip PRELAUNCH = false on launch day (July 1) to go fully live — one line.
   Captures MARKETING-SAFE leads only (name / email / phone / program interest) to the CRM
   via the Convex /lead route. NO health info is collected — the public front end stays
   PHI-free (clinical intake happens later, consented, in the real flow). */
(function () {
  "use strict";
  var PRELAUNCH = true;                  // <-- flip to false on 7/1 to open real intake
  if (!PRELAUNCH) return;

  var CONVEX_SITE = "https://quixotic-cat-492.convex.cloud".replace(".convex.cloud", ".convex.site");
  // Pages that begin patient intake / take payment — gated while pre-launch.
  var GATED = ["intake.html", "glp1.html", "total-male.html", "insurance.html", "checkout.html"];

  var CSS =
  '#vwl-wl{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(11,16,20,.55);backdrop-filter:blur(4px);font-family:Inter,system-ui,sans-serif}' +
  '#vwl-wl.open{display:flex}' +
  '#vwl-wl .vwl-card{background:#fff;border-radius:22px;max-width:440px;width:100%;padding:30px 28px;box-shadow:0 24px 70px rgba(10,30,60,.28);position:relative;max-height:92vh;overflow:auto}' +
  '#vwl-wl .vwl-x{position:absolute;top:14px;right:16px;background:none;border:none;font-size:26px;line-height:1;color:#9aa0ab;cursor:pointer}' +
  '#vwl-wl.blocking .vwl-x{display:none}' +
  '#vwl-wl .vwl-badge{display:inline-block;background:#eaf2ff;color:#0a6cf5;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:5px 11px;border-radius:999px;margin-bottom:14px}' +
  '#vwl-wl h3{font-family:Montserrat,Inter,sans-serif;font-weight:700;font-size:23px;line-height:1.2;color:#16201d;margin:0 0 8px}' +
  '#vwl-wl p{color:#4b5563;font-size:14.5px;line-height:1.5;margin:0 0 18px}' +
  '#vwl-wl form{display:flex;flex-direction:column;gap:10px}' +
  '#vwl-wl .vwl-row{display:flex;gap:10px}' +
  '#vwl-wl input,#vwl-wl select{width:100%;padding:12px 13px;border:1px solid #e6e9ee;border-radius:12px;font-size:15px;color:#16201d;background:#fff;outline:none;font-family:inherit}' +
  '#vwl-wl input:focus,#vwl-wl select:focus{border-color:#0a6cf5;box-shadow:0 0 0 3px rgba(10,108,245,.12)}' +
  '#vwl-wl button[type=submit]{margin-top:4px;background:#0a6cf5;color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}' +
  '#vwl-wl button[type=submit]:hover{background:#0856c8}' +
  '#vwl-wl button[type=submit]:disabled{opacity:.6;cursor:default}' +
  '#vwl-wl .vwl-fine{font-size:12px;color:#9aa0ab;margin:8px 0 0;text-align:center}' +
  '#vwl-wl .vwl-err{display:none;color:#e11d48;font-size:13px;margin:2px 0 0}' +
  '#vwl-wl .vwl-check{width:54px;height:54px;border-radius:50%;background:#eafaf0;color:#0a7a3d;font-size:28px;display:flex;align-items:center;justify-content:center;margin:0 0 14px}' +
  '#vwl-wl .vwl-done{display:none}';

  var HTML =
  '<div id="vwl-wl" role="dialog" aria-modal="true" aria-label="Join the waitlist">' +
    '<div class="vwl-card">' +
      '<button class="vwl-x" type="button" aria-label="Close">&times;</button>' +
      '<div class="vwl-form">' +
        '<span class="vwl-badge">Opening July 1</span>' +
        '<h3>Patient intake opens July&nbsp;1</h3>' +
        '<p>We&rsquo;re putting the finishing touches on a new patient experience. Join the list and we&rsquo;ll reach out the moment intake opens.</p>' +
        '<form>' +
          '<div class="vwl-row"><input name="first" placeholder="First name" autocomplete="given-name" required><input name="last" placeholder="Last name" autocomplete="family-name" required></div>' +
          '<input name="email" type="email" placeholder="Email" autocomplete="email" required>' +
          '<input name="phone" type="tel" placeholder="Phone" autocomplete="tel" required>' +
          '<select name="interest" required>' +
            '<option value="">What are you interested in?</option>' +
            '<option value="glp1">GLP-1 / Semaglutide weight loss</option>' +
            '<option value="total_male">Hormone optimization (Total Male)</option>' +
            '<option value="coaching">Coaching &amp; nutrition</option>' +
            '<option value="unsure">Not sure yet &mdash; help me decide</option>' +
          '</select>' +
          '<div class="vwl-err"></div>' +
          '<button type="submit">Join the list</button>' +
          '<p class="vwl-fine">We&rsquo;ll only use this to contact you about starting care. No medical info needed yet.</p>' +
        '</form>' +
      '</div>' +
      '<div class="vwl-done">' +
        '<div class="vwl-check">&#10003;</div>' +
        '<h3>You&rsquo;re on the list!</h3>' +
        '<p>Thanks &mdash; we&rsquo;ll reach out as soon as patient intake opens on July&nbsp;1. Questions in the meantime? Call us at <strong>(702) 602-5002</strong>.</p>' +
        '<button type="button" class="vwl-close-done" style="background:#0a6cf5;color:#fff;border:none;border-radius:12px;padding:13px;width:100%;font-size:15px;font-weight:700;cursor:pointer">Done</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  function injectOnce() {
    if (document.getElementById("vwl-wl")) return;
    var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    var w = document.createElement("div"); w.innerHTML = HTML; document.body.appendChild(w.firstChild);
    var modal = document.getElementById("vwl-wl");
    modal.querySelector(".vwl-x").addEventListener("click", close);
    modal.querySelector(".vwl-close-done").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    modal.querySelector("form").addEventListener("submit", submit);
  }

  function open(blocking) {
    injectOnce();
    var m = document.getElementById("vwl-wl");
    m.classList.toggle("blocking", !!blocking);
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    var m = document.getElementById("vwl-wl");
    if (m.classList.contains("blocking")) { location.href = "/"; return; }  // can't dismiss into a dead intake page
    m.classList.remove("open");
    document.body.style.overflow = "";
  }

  function submit(e) {
    e.preventDefault();
    var f = e.target, btn = f.querySelector("button[type=submit]"), err = f.querySelector(".vwl-err");
    err.style.display = "none";
    var label = btn.textContent; btn.disabled = true; btn.textContent = "Joining…";
    var payload = {
      first_name: f.first.value.trim(), last_name: f.last.value.trim(),
      email: f.email.value.trim(), phone: f.phone.value.trim(),
      program: f.interest.value, source: "prelaunch_waitlist", source_detail: "Website waitlist (pre-launch)"
    };
    fetch(CONVEX_SITE + "/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || "Something went wrong");
        var card = document.querySelector("#vwl-wl .vwl-card");
        card.querySelector(".vwl-form").style.display = "none";
        card.querySelector(".vwl-done").style.display = "block";
      })
      .catch(function (ex) {
        err.textContent = (ex && ex.message) || "Could not submit — please try again.";
        err.style.display = "block"; btn.disabled = false; btn.textContent = label;
      });
  }

  // 1) Intercept clicks on any CTA that points at a gated intake/payment page.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("a[href],[data-cta]");
    if (!el) return;
    var href = el.getAttribute("href") || el.getAttribute("data-cta") || "";
    for (var i = 0; i < GATED.length; i++) {
      if (href.indexOf(GATED[i]) !== -1) { e.preventDefault(); e.stopPropagation(); open(false); return; }
    }
  }, true);

  // 2) If someone lands directly on a gated intake page (old link, typed URL), block it.
  function checkLanding() {
    var here = (location.pathname.split("/").pop() || "").toLowerCase();
    if (GATED.indexOf(here) !== -1) open(true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", checkLanding);
  else checkLanding();
})();
