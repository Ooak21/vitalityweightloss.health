// ChairCare forms (Fred 10/9). The pages are static copies of Fred's prototype; this replaces its
// app code. Each form posts JSON to Convex /chaircare-inquiry, which files it in the CRM by
// `source`: chaircare-partner and barbers-table on the Partners board, chaircare-client as a
// patient lead tagged chaircare. Contact info only, never medical detail. The success and error
// copy is Fred's, word for word.
(function () {
  "use strict";
  var API = "https://quixotic-cat-492.convex.site/chaircare-inquiry";

  var SUCCESS = {
    "barbers-table": { h: "We got your request.", p: "Vitality will contact you with the next session details. Your seat is not confirmed yet.", tick: true },
    "chaircare-partner": { h: "We got your request.", p: "Vitality will contact you to find a good time for a quick conversation.", tick: true },
    "chaircare-client": { h: "Request received.", html: 'Your meeting request has been recorded. A time still needs to be confirmed by Vitality. For scheduling assistance, call <a href="tel:+17026025002">(702) 602-5002</a>.' }
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Client links carry ?shop=SHOP_NAME so the shop that sent them is prefilled (still editable).
  var shop = "";
  try { shop = (new URLSearchParams(window.location.search).get("shop") || "").slice(0, 120); } catch (e) {}

  Array.prototype.forEach.call(document.querySelectorAll("form.lead-form"), function (form) {
    var srcEl = form.querySelector('input[name="source"]');
    var source = srcEl ? srcEl.value : "";
    if (source === "chaircare-client" && shop) {
      var shopEl = form.querySelector('input[name="shop"]');
      if (shopEl && !shopEl.value) shopEl.value = shop;
    }
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var old = form.querySelector(".form-error"); if (old) old.remove();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v); });
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

      fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          if (!j || !j.ok) throw new Error((j && j.error) || "Your request could not be saved. Please try again or call (702) 602-5002.");
          var s = SUCCESS[source] || SUCCESS["chaircare-partner"];
          var div = document.createElement("div");
          div.className = "lead-form success";
          div.setAttribute("role", "status");
          div.innerHTML = (s.tick ? "<span>&#10003;</span>" : "") + "<h3>" + esc(s.h) + "</h3><p>" + (s.html || esc(s.p)) + "</p>";
          form.replaceWith(div);
        })
        .catch(function (err) {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          var p = document.createElement("p");
          p.className = "form-error";
          p.setAttribute("role", "alert");
          p.textContent = (err && err.message && err.message !== "Failed to fetch")
            ? err.message : "Your request could not be saved. Please try again or call (702) 602-5002.";
          if (btn) btn.insertAdjacentElement("afterend", p); else form.appendChild(p);
        });
    });
  });
})();
