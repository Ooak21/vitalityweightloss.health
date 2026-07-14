/* CORTEX Help — in-app "Ask Support" widget for the staff CRM + admin.
   Self-contained. Include once per page:  <script src="support-widget.js?v=1"></script>
   Calls the staff-JWT-gated Convex route /system-support-ask (same answer engine as the
   email agent). Staff only: the token comes from the existing staff session (STORE_STAFF).
   PHI-free, how-to answers. Grow the brain in convex/systemSupportKb.ts. */
(function () {
  if (window.__cxHelpLoaded) return; window.__cxHelpLoaded = true;
  var CONVEX_URL = "https://quixotic-cat-492.convex.site";
  var SUGGESTIONS = [
    "How do I create a patient portal login?",
    "Where do patients see their tasks?",
    "What is a Sequence and how do I use it?",
    "How does a patient book a free InBody scan?"
  ];

  var css = ""
    + "#cxhelp,#cxhelp *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif}"
    + "#cxhelp-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;"
    + "background:#0a6cf5;color:#fff;border:none;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:600;cursor:pointer;"
    + "box-shadow:0 8px 24px rgba(10,108,245,.35);transition:transform .15s,background .15s}"
    + "#cxhelp-btn:hover{background:#0856c8;transform:translateY(-1px)}"
    + "#cxhelp-panel{position:fixed;right:20px;bottom:78px;z-index:2147483000;width:380px;max-width:calc(100vw - 40px);height:540px;max-height:calc(100vh - 120px);"
    + "background:#fff;border:1px solid #e6e9ee;border-radius:18px;box-shadow:0 24px 60px rgba(11,18,32,.28);display:none;flex-direction:column;overflow:hidden}"
    + "#cxhelp-panel.open{display:flex}"
    + "#cxhelp-head{background:#0b1220;color:#fff;padding:16px 18px;display:flex;align-items:flex-start;justify-content:space-between}"
    + "#cxhelp-head .t{font-size:15px;font-weight:700;letter-spacing:.2px}"
    + "#cxhelp-head .s{font-size:12px;color:#aeb9cc;margin-top:2px}"
    + "#cxhelp-x{background:none;border:none;color:#aeb9cc;font-size:20px;line-height:1;cursor:pointer;padding:0 2px}"
    + "#cxhelp-x:hover{color:#fff}"
    + "#cxhelp-body{flex:1;overflow-y:auto;padding:16px;background:#f7f8fa}"
    + "#cxhelp-body .row{margin-bottom:12px;display:flex}"
    + "#cxhelp-body .q{margin-left:auto;background:#0a6cf5;color:#fff;border-radius:14px 14px 4px 14px;padding:9px 13px;font-size:13.5px;max-width:85%}"
    + "#cxhelp-body .a{background:#fff;border:1px solid #e6e9ee;border-radius:14px 14px 14px 4px;padding:11px 14px;font-size:13.5px;color:#16201d;line-height:1.55;max-width:92%}"
    + "#cxhelp-body .a p{margin:0 0 8px}#cxhelp-body .a p:last-child{margin:0}#cxhelp-body .a ul,#cxhelp-body .a ol{margin:6px 0;padding-left:18px}#cxhelp-body .a li{margin:3px 0}#cxhelp-body .a a{color:#0a6cf5}"
    + "#cxhelp-body .a.muted{color:#6b7280;font-style:italic}"
    + "#cxhelp-intro{color:#6b7280;font-size:13px;line-height:1.5;margin-bottom:12px}"
    + "#cxhelp-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:4px}"
    + "#cxhelp-chips button{background:#fff;border:1px solid #d7dce4;color:#0a6cf5;border-radius:999px;padding:7px 12px;font-size:12.5px;cursor:pointer;text-align:left}"
    + "#cxhelp-chips button:hover{background:#eef4ff;border-color:#0a6cf5}"
    + "#cxhelp-foot{border-top:1px solid #e6e9ee;padding:10px;display:flex;gap:8px;align-items:flex-end;background:#fff}"
    + "#cxhelp-input{flex:1;border:1px solid #d7dce4;border-radius:12px;padding:9px 12px;font-size:13.5px;resize:none;max-height:110px;outline:none}"
    + "#cxhelp-input:focus{border-color:#0a6cf5}"
    + "#cxhelp-send{background:#0a6cf5;color:#fff;border:none;border-radius:11px;padding:9px 15px;font-size:13.5px;font-weight:600;cursor:pointer}"
    + "#cxhelp-send:disabled{opacity:.5;cursor:default}";

  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  var root = document.createElement("div"); root.id = "cxhelp";
  var btn = el('<button id="cxhelp-btn" aria-label="Ask Support"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Ask Support</button>');
  var panel = el(''
    + '<div id="cxhelp-panel">'
    + '  <div id="cxhelp-head"><div><div class="t">CORTEX Help</div><div class="s">System how-to, answered instantly</div></div><button id="cxhelp-x" aria-label="Close">&times;</button></div>'
    + '  <div id="cxhelp-body">'
    + '    <div id="cxhelp-intro">Ask anything about using the system. Answers cover the CRM, portal, sequences, and more.</div>'
    + '    <div id="cxhelp-chips"></div>'
    + '  </div>'
    + '  <div id="cxhelp-foot"><textarea id="cxhelp-input" rows="1" placeholder="Ask a question..."></textarea><button id="cxhelp-send">Ask</button></div>'
    + '</div>');
  root.appendChild(panel); root.appendChild(btn); document.body.appendChild(root);

  var body = panel.querySelector("#cxhelp-body");
  var input = panel.querySelector("#cxhelp-input");
  var sendBtn = panel.querySelector("#cxhelp-send");
  var chips = panel.querySelector("#cxhelp-chips");
  var intro = panel.querySelector("#cxhelp-intro");
  var busy = false;

  SUGGESTIONS.forEach(function (q) {
    var c = document.createElement("button"); c.textContent = q;
    c.onclick = function () { input.value = q; ask(); };
    chips.appendChild(c);
  });

  function toggle(open) {
    panel.classList.toggle("open", open == null ? !panel.classList.contains("open") : open);
    if (panel.classList.contains("open")) input.focus();
  }
  btn.onclick = function () { toggle(); };
  panel.querySelector("#cxhelp-x").onclick = function () { toggle(false); };

  input.addEventListener("input", function () { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 110) + "px"; });
  input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
  sendBtn.onclick = ask;

  function addRow(cls, html, isText) {
    var row = document.createElement("div"); row.className = "row";
    var b = document.createElement("div"); b.className = cls;
    if (isText) b.textContent = html; else b.innerHTML = html;
    row.appendChild(b); body.appendChild(row); body.scrollTop = body.scrollHeight;
    return b;
  }

  async function getToken() {
    try { var m = await import("/auth-convex.js"); return await m.getToken(m.STORE_STAFF); }
    catch (e) { return null; }
  }

  async function ask() {
    var q = (input.value || "").trim();
    if (!q || busy) return;
    busy = true; sendBtn.disabled = true;
    if (chips) { chips.style.display = "none"; intro.style.display = "none"; }
    input.value = ""; input.style.height = "auto";
    addRow("q", q, true);
    var thinking = addRow("a muted", "Thinking...", true);
    try {
      var token = await getToken();
      if (!token) { thinking.textContent = "Please sign in as staff to use support."; return; }
      var r = await fetch(CONVEX_URL + "/system-support-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ question: q })
      });
      var j = await r.json().catch(function () { return {}; });
      if (r.status === 401 || r.status === 403) { thinking.textContent = "Your session expired. Refresh and sign in again."; return; }
      if (j && j.ok && j.html) { thinking.className = "a"; thinking.innerHTML = j.html; }
      else { thinking.textContent = "I could not answer that one. Try rewording, or email support and a teammate will follow up."; }
      body.scrollTop = body.scrollHeight;
    } catch (e) {
      thinking.textContent = "Something went wrong reaching support. Check your connection and try again.";
    } finally {
      busy = false; sendBtn.disabled = false; input.focus();
    }
  }
})();
