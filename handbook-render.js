// handbook-render.js — VBIS transformation-handbook renderer.
// Screen view unchanged; on Print it generates a cover page + section line icons (not emojis),
// and force-expands collapsible sections so the printed copy is complete.
// renderVbisHandbook(hb, opts) and renderVbisHandbookProgressive(hb, opts) -> HTML string.
(function () {
  function esc(s) { return s == null ? "" : String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // Strip the AI "slop" tell: em-dash -> comma, en-dash (ranges) -> hyphen. Applied to the full output.
  function noDash(s) { return s.replace(/\s*—\s*/g, ", ").replace(/\s*&mdash;\s*/g, ", ").replace(/–/g, "-").replace(/&ndash;/g, "-"); }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function bullets(a) { return arr(a).map(function (x) { return '<li class="flex gap-2"><span class="text-[#0a6cf5] mt-[2px]">›</span><span>' + esc(x) + "</span></li>"; }).join(""); }
  function para(s) { return esc(s).replace(/\n+/g, "</p><p class=\"mt-2\">"); }

  // ── Line icons (Lucide-style, brand blue) — NOT emojis ──
  var ICONS = {
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    brain: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    apple: '<path d="M12 7c-1.5-3-5.5-3-7 0-1.3 2.6 0 7 2.5 9.5 1.2 1.2 2.4 1.5 3.5 1.5s2.3-.3 3.5-1.5C19 14 20.3 9.6 19 7c-1.5-3-5.5-3-7 0Z"/><path d="M12 7V4a2 2 0 0 1 2-2"/>',
    dumbbell: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" x2="17" y1="12" y2="12"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    stethoscope: '<path d="M4 2v6a6 6 0 0 0 12 0V2"/><path d="M8 15v1a6 6 0 0 0 12 0v-4"/><circle cx="20" cy="10" r="2"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  };
  function icon(name, cls) {
    if (!name || !ICONS[name]) return "";
    return '<svg class="' + (cls || "w-[18px] h-[18px]") + ' shrink-0 text-[#0a6cf5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + "</svg>";
  }

  var card = function (inner) { return '<section class="hb-card rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_2px_rgba(16,32,29,.04)]">' + inner + "</section>"; };
  var head = function (eyebrow, title, ic) {
    return (eyebrow ? '<p class="text-[11px] uppercase tracking-[0.2em] text-[#0a6cf5] font-semibold mb-1">' + esc(eyebrow) + "</p>" : "") +
      '<h2 class="font-display text-xl font-semibold text-[#16201d] border-b border-[#eef0f4] pb-2 mb-4 flex items-center gap-2">' + (ic ? icon(ic) : "") + "<span>" + esc(title) + "</span></h2>";
  };
  var sub = function (t, ic) { return '<h3 class="hb-sub font-display text-base font-semibold text-[#16201d] mt-4 mb-1 flex items-center gap-2">' + (ic ? icon(ic, "w-4 h-4") : "") + "<span>" + esc(t) + "</span></h3>"; };
  function statusDot(s) { var c = s === "positive" ? "#10b981" : s === "watch" ? "#f59e0b" : s === "priority" ? "#ef4444" : "#9aa0ab"; return '<span class="inline-block w-2.5 h-2.5 rounded-full shrink-0" style="background:' + c + '"></span>'; }

  function staticCounseling() {
    var block = function (t, lede, items, ic) {
      return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-4">' + sub(t, ic) +
        '<p class="text-sm text-[#6b7280] mb-2">' + esc(lede) + "</p>" +
        '<ul class="text-sm text-[#4b5563] space-y-1.5">' + bullets(items) + "</ul></div>";
    };
    return card(head("Counseling & behavioral therapy", "The support system that makes it stick", "users") +
      '<div class="grid md:grid-cols-2 gap-4">' +
      block("Intensive Behavioral Therapy (IBT)", "Willpower runs out; habit engineering doesn't. Every Vitality patient gets our structured IBT protocol that rewires triggers, routines, and rewards.",
        ["Identifying emotional and situational eating triggers before they become lapses", "Building micro-habits that compound into sustainable lifestyle change", "Cognitive restructuring around food, body image, and long-term health identity", "Relapse prevention with real-time accountability touchpoints"], "brain") +
      block("Personal counseling & education", "Weight loss without education is temporary; with understanding it's permanent.",
        ["Sustainability education — maintain progress through travel, stress, holidays, and life transitions", "Biomarker literacy — understand your InBody numbers in plain language so every re-scan motivates", "Identity-level change — move from \"I'm on a diet\" to \"This is how I live now\""], "users") +
      block("Registered Dietitian guidance", "Your nutrition plan isn't pulled from a template — it's calibrated by a Registered Dietitian (RD) against your InBody composition, body fat percentage, lean mass, and the specific goals you set with your provider.",
        ["Body-fat-driven targeting — macro splits and calorie ranges are tuned to your current body fat percentage and the percentage you're working toward, not a one-size-fits-all number", "Lean mass protection — protein floors and resistance-fueling strategy designed to preserve (or build) skeletal muscle mass while fat comes off", "Goal-specific plans — fat loss, recomposition, athletic performance, post-bariatric nutrition, or metabolic-health-first eating all get a distinct RD playbook", "Condition-aware nutrition — adjustments for GLP-1 medication side effects, insulin resistance, PCOS, thyroid, GI sensitivities, and food preferences", "Ongoing re-calibration — every InBody re-scan triggers an RD review so your plan evolves with your body, not three months behind it"], "apple") +
      block("Your personal fitness coordinator", "You are not handed a workout sheet and sent away. Every patient is assigned a dedicated fitness coordinator who trains you hands-on and teaches you proper technique so you can confidently execute your personalized plan on your own.",
        ["One-on-one training — your coordinator walks you through every movement in your plan until it becomes second nature", "Technique mastery — learn correct form, tempo, and safety cues so you train effectively and avoid injury", "Gym autonomy — we don't create dependency; we build independence so you can run your program at any gym with confidence", "Plan personalization — exercises and progressions are chosen around your current capacity, injuries, and available equipment", "Facility onboarding — come into our facility, learn your program, ask questions, and leave with a clear path to success in your gym"], "target") +
      "</div>");
  }
  function staticFacility() {
    var tile = function (t, d, ic) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-4"><div class="font-semibold text-sm text-[#16201d] flex items-center gap-2">' + icon(ic, "w-4 h-4") + "<span>" + esc(t) + '</span></div><div class="text-xs text-[#6b7280] mt-1">' + esc(d) + "</div></div>"; };
    return card(head("Vitality Academies", "Your home base for transformation", "building") +
      '<p class="text-sm text-[#4b5563] leading-relaxed mb-4">This isn\'t a telehealth-only program from your couch. Vitality Academies is our physical headquarters — a real facility built for real transformation.</p>' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">' +
      tile("Workout facility", "Train on-site with equipment and space designed for your program", "dumbbell") +
      tile("Lecture rooms", "Live education on nutrition, metabolism, and habit science", "users") +
      tile("Nurse office", "On-site consults, medication administration, and clinical check-ins", "stethoscope") +
      tile("Vitals & wellness checks", "Blood pressure monitoring, injection administration, progress tracking", "heart") +
      "</div>" +
      '<div class="rounded-xl bg-[#eaf2ff] border border-[#d6e6ff] p-4"><div class="font-semibold text-sm text-[#0a3d7a] mb-2 flex items-center gap-2">' + icon("building", "w-4 h-4") + "<span>On-site highlights</span></div><ul class=\"text-sm text-[#0a3d7a] space-y-1.5\">" +
      '<li class="flex gap-2">' + icon("pin", "w-4 h-4") + "<span>On-site InBody 570 scanning for precise body composition tracking</span></li>" +
      '<li class="flex gap-2">' + icon("stethoscope", "w-4 h-4") + "<span>Clinical oversight from licensed medical professionals</span></li>" +
      '<li class="flex gap-2">' + icon("users", "w-4 h-4") + "<span>Community of patients and providers walking the same journey</span></li>" +
      '</ul><p class="text-sm font-medium text-[#0a3d7a] mt-3 pt-3 border-t border-[#cfe0fb]">Everything under one roof — scans, workouts, consults, injections, education — all at Vitality Academies. The difference between a program you download and a place that has your back.</p></div>');
  }

  // ── DYNAMIC per-patient sections ──
  function execSummary(hb) {
    if (!hb.executive_summary && !hb.inbody_analysis) return "";
    return card(head("Personalized transformation plan", "Your executive summary", "sparkle") +
      (hb.executive_summary ? '<div class="text-sm text-[#4b5563] leading-relaxed"><p>' + para(hb.executive_summary) + "</p></div>" : "") +
      (hb.inbody_analysis ? '<div class="text-sm text-[#4b5563] leading-relaxed mt-4 pt-4 border-t border-[#eef0f4]"><p class="text-[11px] uppercase tracking-wide text-[#0a6cf5] font-semibold mb-1">InBody analysis</p><p>' + para(hb.inbody_analysis) + "</p></div>" : ""));
  }
  function interpretations(hb) {
    var its = arr(hb.interpretations); if (!its.length) return "";
    var rows = its.map(function (it) {
      return '<details class="rounded-xl border border-[#eef0f4] bg-[#fbfcfe]"><summary class="flex items-center gap-2.5 p-3.5 cursor-pointer">' +
        statusDot(it.status) + '<span class="font-semibold text-sm text-[#16201d]">' + esc(it.metric) + "</span>" +
        '<span class="ml-auto font-mono tabular-nums text-sm text-[#6b7280]">' + esc(it.value || "—") + "</span></summary>" +
        '<div class="px-3.5 pb-3.5 space-y-2 text-sm">' +
        '<div><span class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">What it is</span><p class="text-[#4b5563]">' + esc(it.what_it_is) + "</p></div>" +
        '<div><span class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">Why it matters</span><p class="text-[#4b5563]">' + esc(it.why_it_matters) + "</p></div>" +
        '<div><span class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">What it means for you</span><p class="text-[#16201d] font-medium">' + esc(it.what_it_means_for_you) + "</p></div>" +
        '<div><span class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">Recommended action</span><p class="text-[#4b5563]">' + esc(it.recommended_action) + "</p></div>" +
        '<div class="text-[11px] text-[#9aa0ab] pt-1 border-t border-[#f1f3f7]"><span class="font-semibold">Literature basis:</span> ' + esc(it.literature_basis) + "</div></div></details>";
    }).join("");
    return card(head("Complete InBody analysis", "Every metric, decoded", "activity") + '<div class="space-y-2">' + rows + "</div>");
  }
  function aiAnalysis(hb) {
    var ai = hb.ai_analysis; if (!ai || typeof ai !== "object") return "";
    var col = function (t, items, tone) { if (!arr(items).length) return ""; return '<div><div class="text-[11px] uppercase tracking-wide font-semibold mb-1" style="color:' + tone + '">' + esc(t) + '</div><ul class="text-sm text-[#4b5563] space-y-1">' + bullets(items) + "</ul></div>"; };
    var txt = function (t, v) { return v ? "<div>" + sub(t) + '<p class="text-sm text-[#4b5563]">' + esc(v) + "</p></div>" : ""; };
    return card(head("Clinical AI analysis", "What your composition is telling us", "brain") +
      '<div class="grid md:grid-cols-3 gap-4 mb-2">' + col("Strengths", ai.strengths, "#10b981") + col("Risk factors", ai.risk_factors, "#ef4444") + col("Areas for improvement", ai.areas_for_improvement, "#f59e0b") + "</div>" +
      '<div class="grid md:grid-cols-2 gap-x-6 gap-y-1 mt-2">' + txt("Metabolic observations", ai.metabolic_observations) + txt("Body composition analysis", ai.body_composition_analysis) + txt("Lifestyle analysis", ai.lifestyle_analysis) + txt("Exercise readiness", ai.exercise_readiness) + txt("Nutrition readiness", ai.nutrition_readiness) + "</div>");
  }
  function whyPlan(hb) {
    var w = hb.why_we_chose_this_plan; if (!w || typeof w !== "object") return "";
    var rows = Object.keys(w).map(function (k) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3"><div class="text-[11px] uppercase tracking-wide text-[#0a6cf5] font-semibold">' + esc(k.replace(/_/g, " ")) + '</div><p class="text-sm text-[#4b5563] mt-1">' + esc(w[k]) + "</p></div>"; }).join("");
    return card(head("", "Why we chose this plan", "target") + '<div class="grid md:grid-cols-2 gap-3">' + rows + "</div>");
  }
  function nutrition(hb) {
    var n = hb.nutrition; if (!n) return "";
    var dt = n.daily_targets || {};
    var tgt = function (l, v, u) { return v == null ? "" : '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3 text-center"><div class="font-display text-xl font-semibold text-[#16201d]">' + esc(v) + (u || "") + '</div><div class="text-[10px] uppercase tracking-wide text-[#9aa0ab] font-semibold">' + l + "</div></div>"; };
    var meal = function (slot, m) { if (!m) return ""; return '<div class="border-l-2 border-[#d6e6ff] pl-3 py-1"><div class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">' + slot + '</div><div class="text-sm font-semibold text-[#16201d]">' + esc(m.name) + ' <span class="text-[#9aa0ab] font-normal">· ' + esc(m.calories) + " kcal · " + esc(m.protein_g) + 'g P</span></div><div class="text-xs text-[#6b7280]">' + esc(arr(m.ingredients).join(", ")) + (m.serving ? " · " + esc(m.serving) : "") + '</div>' + (m.prep ? '<div class="text-xs text-[#9aa0ab] italic">' + esc(m.prep) + "</div>" : "") + "</div>"; };
    var days = arr(n.week_one_meal_plan).map(function (d, i) {
      return '<details ' + (i === 0 ? "open" : "") + ' class="hb-mealday rounded-xl border border-[#eef0f4] bg-[#fbfcfe]"><summary class="flex items-center justify-between p-3 cursor-pointer"><span class="font-semibold text-sm text-[#16201d]">' + esc(d.day) + '</span><span class="text-xs text-[#6b7280]">' + esc(d.daily_total_calories) + " kcal · " + esc(d.daily_total_protein_g) + 'g protein</span></summary><div class="px-3 pb-3 space-y-2">' + meal("Breakfast", d.breakfast) + meal("Lunch", d.lunch) + meal("Dinner", d.dinner) + meal("Snack", d.snack) + "</div></details>";
    }).join("");
    var roadmap = arr(n.monthly_roadmap).map(function (m) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3"><div class="flex items-center justify-between"><div class="font-semibold text-sm text-[#16201d]">Month ' + esc(m.month) + " · " + esc(m.focus) + '</div><span class="text-xs text-[#0a6cf5] font-medium">' + esc(m.calorie_adjustment) + "</span></div>" + (arr(m.key_swaps).length ? '<ul class="text-xs text-[#6b7280] mt-1 space-y-0.5">' + bullets(m.key_swaps) + "</ul>" : "") + "</div>"; }).join("");
    return card(head("Nutrition program", "Your eating plan", "apple") +
      '<div class="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">' + tgt("Calories", dt.calories) + tgt("Protein", dt.protein_g, "g") + tgt("Carbs", dt.carbs_g, "g") + tgt("Fat", dt.fat_g, "g") + tgt("Fiber", dt.fiber_g, "g") + tgt("Water", dt.water_oz, "oz") + "</div>" +
      (arr(n.condition_tags).length ? '<div class="text-xs text-[#6b7280] mb-4"><span class="font-semibold">Condition tags:</span> ' + arr(n.condition_tags).map(esc).join(" · ") + "</div>" : "") +
      sub("Week 1 meal plan") + '<div class="space-y-2">' + days + "</div>" +
      (roadmap ? sub("Long-term roadmap") + '<div class="space-y-2">' + roadmap + "</div>" : "") +
      (arr(n.substitution_guide).length ? sub("Substitution guide") + '<ul class="text-sm text-[#4b5563] space-y-1.5">' + bullets(n.substitution_guide) + "</ul>" : ""));
  }
  function workout(hb) {
    var w = hb.workout; if (!w) return "";
    var phases = arr(w.phases).map(function (p, i) {
      var sd = p.sample_day || {};
      var ex = arr(sd.exercises).map(function (e) { return '<div class="border-l-2 border-[#d6e6ff] pl-3 py-1"><div class="text-sm font-semibold text-[#16201d]">' + esc(e.name) + ' <span class="text-[#9aa0ab] font-normal">· ' + esc(e.sets) + " × " + esc(e.reps) + (e.rest_sec ? " · rest " + esc(e.rest_sec) + "s" : "") + '</span></div>' + (e.instructions ? '<div class="text-xs text-[#6b7280]">' + esc(e.instructions) + "</div>" : "") + '<div class="text-[11px] text-[#9aa0ab]">' + (e.easier ? "<b>Easier:</b> " + esc(e.easier) + " · " : "") + (e.harder ? "<b>Harder:</b> " + esc(e.harder) : "") + "</div>" + (e.safety ? '<div class="text-[11px] text-[#9aa0ab]"><b>Safety:</b> ' + esc(e.safety) + "</div>" : "") + "</div>"; }).join("");
      return '<details ' + (i === 0 ? "open" : "") + ' class="rounded-xl border border-[#eef0f4] bg-[#fbfcfe]"><summary class="flex items-center justify-between p-3 cursor-pointer"><span class="font-semibold text-sm text-[#16201d]">' + esc(p.phase) + ' <span class="text-[#9aa0ab] font-normal">· weeks ' + esc(p.weeks) + '</span></span><span class="text-xs text-[#6b7280]">' + (sd.estimated_calorie_burn ? "~" + esc(sd.estimated_calorie_burn) + " kcal · " : "") + esc(sd.difficulty || "") + '</span></summary><div class="px-3 pb-3"><div class="text-xs text-[#6b7280] mb-1"><b>Focus:</b> ' + esc(p.focus) + '</div><div class="text-xs text-[#6b7280] mb-2"><b>Structure:</b> ' + esc(p.weekly_structure) + "</div>" + (sd.title ? '<div class="text-[11px] uppercase tracking-wide text-[#0a6cf5] font-semibold mb-1">Sample day: ' + esc(sd.title) + "</div>" : "") + '<div class="space-y-1.5">' + ex + "</div>" + (sd.coaching_notes ? '<div class="text-xs text-[#9aa0ab] italic mt-2">' + esc(sd.coaching_notes) + "</div>" : "") + "</div></details>";
    }).join("");
    return card(head("Workout program", w.program_type || "Your movement plan", "dumbbell") + '<div class="space-y-2">' + phases + "</div>");
  }
  function habits(hb) {
    var hs = arr(hb.habits); if (!hs.length) return "";
    var rows = hs.map(function (h) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3"><div class="font-semibold text-sm text-[#16201d]">Week ' + esc(h.week) + " · " + esc(h.habit) + '</div><div class="text-xs text-[#6b7280] mt-1">' + esc(h.why_it_matters) + '</div>' + (h.expected_benefit ? '<div class="text-xs text-[#0a7a3d] mt-0.5">' + esc(h.expected_benefit) + "</div>" : "") + (h.success_strategy ? '<div class="text-xs text-[#9aa0ab] mt-0.5"><b>How:</b> ' + esc(h.success_strategy) + "</div>" : "") + "</div>"; }).join("");
    return card(head("", "Weekly habit progression", "calendar") + '<div class="grid md:grid-cols-2 gap-3">' + rows + "</div>");
  }
  function projections(hb) {
    var ps = arr(hb.timeline_projections); if (!ps.length) return "";
    var rows = ps.map(function (p) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3 text-center"><div class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">Day ' + esc(p.day) + '</div><div class="font-display text-lg font-semibold text-[#16201d] mt-0.5">' + esc(p.projected_weight_lb) + ' lb</div><div class="text-[11px] text-[#6b7280]">' + esc(p.projected_body_fat_pct) + '% BF</div><div class="text-[11px] text-[#9aa0ab] mt-1">' + esc(p.milestone) + "</div></div>"; }).join("");
    return card(head("", "Progress projections", "trending") + '<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">' + rows + "</div>");
  }
  function nextScan(hb) {
    if (!hb.next_inbody_recommendation_days) return "";
    return card('<div class="flex items-center justify-between"><div><h2 class="font-display text-base font-semibold text-[#16201d] flex items-center gap-2">' + icon("scan", "w-4 h-4") + '<span>Next InBody scan</span></h2><p class="text-sm text-[#6b7280] mt-0.5">Re-scan to recalibrate your plan against real progress.</p></div><div class="text-right"><div class="font-display text-2xl font-semibold text-[#0a6cf5]">' + esc(hb.next_inbody_recommendation_days) + '</div><div class="text-[10px] uppercase tracking-wide text-[#9aa0ab] font-semibold">days</div></div></div>');
  }

  function sectionPlaceholder(label) {
    return '<div class="rounded-2xl border border-dashed border-[#d6e6ff] bg-[#f7faff] p-8 text-center"><div class="text-sm text-[#6b7280]"><span class="inline-flex items-center justify-center gap-2"><span class="w-2 h-2 rounded-full bg-[#0a6cf5] animate-pulse"></span>Generating ' + esc(label) + "…</span></div></div>";
  }
  function statusBanner(status) {
    if (status === "generating") return '<div class="hb-status-banner rounded-xl bg-[#eaf2ff] border border-[#d6e6ff] p-3 text-sm text-[#0a3d7a]">Handbook generating — sections appear below as they finish.</div>';
    if (status === "partial") return '<div class="hb-status-banner rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">Some sections could not be generated. Content below may be incomplete.</div>';
    if (status === "complete") return '<div class="hb-status-banner rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">Handbook complete.</div>';
    return "";
  }

  // Compact on-screen header (hidden on print — the full cover page takes over).
  function screenHeader(hb, p) {
    return '<section class="hb-screen-cover hb-card rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_2px_rgba(16,32,29,.04)]"><div class="flex items-center justify-between flex-wrap gap-3"><div><p class="text-[11px] uppercase tracking-[0.2em] text-[#0a6cf5] font-semibold">Patient handbook · Personalized transformation plan</p><h1 class="font-display text-2xl font-semibold text-[#16201d] mt-1">' + esc(((p.first || "") + " " + (p.last || "")).trim()) + '</h1></div><div class="text-right text-xs text-[#6b7280]"><div><span class="uppercase tracking-wide text-[#9aa0ab]">Program</span><br><span class="font-medium text-[#16201d]">' + esc((hb.workout && hb.workout.program_type) || "Personalized") + '</span></div><div class="mt-1.5"><span class="uppercase tracking-wide text-[#9aa0ab]">Provider</span><br><span class="font-medium text-[#16201d]">Vitality Academies</span></div></div></div></section>';
  }

  // Full-page PRINT cover (hidden on screen, full page on print).
  function printCover(hb, p, opts) {
    var name = ((p.first || "") + " " + (p.last || "")).trim() || "Your Vitality Plan";
    var programType = (hb.workout && hb.workout.program_type) || p.program_type || "Personalized program";
    var days = hb.program_length_days || (opts && opts.program_length_days) || 90;
    var issued;
    try { issued = new Date(opts && opts.generated_at ? opts.generated_at : Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" }); } catch (e) { issued = ""; }
    var metaCell = function (l, v) { return '<div><div class="text-[10px] uppercase tracking-[0.18em] text-[#9aa0ab] font-semibold">' + esc(l) + '</div><div class="font-semibold text-[#16201d] mt-1">' + esc(v) + "</div></div>"; };
    return '<div class="hb-cover">' +
      '<div class="hb-cover-wm"></div>' +
      '<div class="hb-cover-top">' +
        '<img class="hb-logo" src="https://vitalityweightloss.health/assets/logo-icon.png" alt="Vitality">' +
        '<div class="hb-vbis-lockup"><div class="hb-vbis-title">VBIS</div><div class="hb-vbis-name">Vitality Body Intelligence System</div></div>' +
        '<span class="hb-cover-kicker">Patient Handbook</span>' +
      "</div>" +
      '<div class="hb-cover-main">' +
        '<p class="text-[12px] uppercase tracking-[0.22em] text-[#0a6cf5] font-semibold mb-3">Personalized Transformation Plan</p>' +
        '<h1 class="hb-cover-name">' + esc(name) + "</h1>" +
        '<p class="hb-cover-sub">' + esc(days) + "-day Vitality program</p>" +
      "</div>" +
      '<div class="hb-cover-meta">' + metaCell("Issued", issued) + metaCell("Program type", programType) + metaCell("Provider", "Vitality Academies") + "</div>" +
      "</div>";
  }

  // Print stylesheet: show cover, expand collapsed sections, page breaks, brand cover layout.
  var PRINT_CSS =
    '<style id="hb-print-css">' +
    '.hb-cover{display:none}' +
    '@media print{' +
    '@page{margin:0.65in}' +                          /* per-page top/bottom breathing room on every page */
    'body{-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:0!important;max-width:none!important}' +
    '.hb-screen-cover,.hb-status-banner{display:none!important}' +
    /* print on white: gray inner boxes waste ink and look muddy — keep them white (the blue facility box stays) */
    '.bg-\\[\\#f7f8fa\\],.bg-\\[\\#fbfcfe\\],.bg-\\[\\#fafbff\\]{background:#fff!important}' +
    '.hb-cover{display:flex!important;flex-direction:column;justify-content:space-between;min-height:9.1in;break-after:page;page-break-after:always;position:relative;overflow:hidden}' +
    /* embossed brand watermark — soft, faded edges, multiply blends the white into the cover */
    ".hb-cover-wm{position:absolute;inset:0;z-index:0;pointer-events:none;background:url('https://vitalityweightloss.health/assets/cover-watermark.png') no-repeat center 50%;background-size:64% auto;opacity:.7;mix-blend-mode:multiply;-webkit-mask-image:radial-gradient(ellipse 56% 56% at 50% 50%,#000 46%,transparent 86%);mask-image:radial-gradient(ellipse 56% 56% at 50% 50%,#000 46%,transparent 86%)}" +
    '.hb-cover-top,.hb-cover-main,.hb-cover-meta{position:relative;z-index:1}' +
    '.hb-cover-top{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e6e9ee;padding-bottom:18px;font-family:Inter,system-ui,sans-serif}' +
    '.hb-logo{height:48px;width:auto}' +
    '.hb-vbis-lockup{line-height:1.05}' +
    '.hb-vbis-title{font-family:Montserrat,Inter,sans-serif;font-weight:700;font-size:23px;letter-spacing:.04em;color:#16201d}' +
    '.hb-vbis-name{font-size:11px;letter-spacing:.17em;text-transform:uppercase;color:#6b7280;margin-top:3px}' +
    '.hb-cover-kicker{margin-left:auto;font-size:13px;font-weight:600;color:#16201d}' +
    '.hb-cover-main{margin-top:auto;margin-bottom:auto;padding:24px 0}' +
    '.hb-cover-name{font-family:Georgia,"Times New Roman",serif;font-size:58px;line-height:1.02;font-weight:600;color:#16201d;letter-spacing:-1px}' +
    '.hb-cover-sub{font-family:Inter,system-ui,sans-serif;font-size:20px;color:#4b5563;margin-top:8px}' +
    '.hb-cover-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;border-top:1px solid #e6e9ee;padding-top:18px;font-family:Inter,system-ui,sans-serif}' +
    /* FLOW the sections: strip the outer section-card box so content fills pages instead of */
    /* drawing a border around empty space / running down every page edge. */
    /* clear air between sections (margin-bottom on the card itself, so .hb-card margin doesn't override it) */
    '.hb-card{break-inside:auto!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;margin:0 0 46px 0!important;background:transparent!important}' +
    /* keep eyebrow + serif title + sub-headings glued to the first block -> no orphaned headers */
    '.hb-card>p:first-child,.hb-card>h2,.hb-sub{break-after:avoid}' +
    'p{orphans:3;widows:3}' +
    /* long-text 2-col grids (readiness, rationale, counseling) -> single full-width column in print */
    '.md\\:grid-cols-2{grid-template-columns:1fr!important}' +
    /* box atoms whole, EXCEPT large meal-days which may break between meals so they don't leave giant gaps */
    '.rounded-xl:not(.hb-mealday){break-inside:avoid}' +
    '.hb-mealday{break-inside:auto!important}' +
    '.hb-mealday .border-l-2{break-inside:avoid}' +  /* never split a single meal */
    'details:not(.hb-mealday){break-inside:avoid}' +
    'details>summary{list-style:none}' +
    'details>summary::-webkit-details-marker{display:none}' +
    'details>*:not(summary){display:block!important}' +
    '.grid>*{break-inside:avoid}' +
    '}' +
    "</style>";

  window.renderVbisHandbook = function (hb, opts) {
    opts = opts || {}; hb = hb || {}; var p = opts.patient || {};
    return PRINT_CSS + noDash('<div class="hb-root space-y-5">' + [
      printCover(hb, p, opts), screenHeader(hb, p),
      execSummary(hb), interpretations(hb), aiAnalysis(hb), whyPlan(hb),
      nutrition(hb), workout(hb), habits(hb), projections(hb), nextScan(hb),
      staticCounseling(), staticFacility(),
    ].filter(Boolean).join("") + "</div>");
  };

  // Progressive renderer — placeholders for sections not yet ready while status is generating/partial.
  window.renderVbisHandbookProgressive = function (hb, opts) {
    opts = opts || {}; hb = hb || {};
    var ready = opts.sections_ready || [];
    var status = opts.status;
    var isLive = status === "generating" || status === "partial";
    var has = function (k) { return ready.indexOf(k) >= 0; };
    var slot = function (key, label, fn) {
      if (has(key)) return fn(hb);
      if (isLive) return sectionPlaceholder(label);
      return fn(hb);
    };
    var p = opts.patient || {};
    var parts = [
      PRINT_CSS,
      printCover(hb, p, opts),
      statusBanner(status),
      screenHeader(hb, p),
      slot("overview", "Executive summary & clinical overview", execSummary),
      slot("interpretations", "InBody metric interpretations", interpretations),
      has("overview") ? aiAnalysis(hb) : (isLive ? "" : aiAnalysis(hb)),
      has("overview") ? whyPlan(hb) : (isLive ? "" : whyPlan(hb)),
      slot("nutrition", "Nutrition program (7-day meal plan)", nutrition),
      slot("program", "Workout program, habits & projections", function (h) {
        return [workout(h), habits(h), projections(h), nextScan(h)].filter(Boolean).join("");
      }),
    ];
    if (status === "complete") parts.push(staticCounseling(), staticFacility());
    return noDash('<div class="hb-root space-y-5">' + parts.filter(Boolean).join("") + "</div>");
  };
})();
