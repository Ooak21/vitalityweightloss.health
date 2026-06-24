/* handbook-render.js — SHARED VBIS handbook renderer.
 * Used by BOTH the patient portal (portal.html) and the provider CRM (crm.html).
 * Input: the vit_handbooks `handbook` JSON (emit_transformation_plan shape).
 * Output: HTML string in the Vitality design system. Content is rendered verbatim — the only
 * thing redesigned vs Fred's Lovable build is the look. Exposes window.renderVbisHandbook(hb, opts).
 * opts: { patient:{first,last}, issued }  (mode is implicit — same render for patient & provider).
 */
(function () {
  function esc(s) { return s == null ? "" : String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function bullets(a) { return arr(a).map(function (x) { return '<li class="flex gap-2"><span class="text-[#0a6cf5] mt-[2px]">›</span><span>' + esc(x) + "</span></li>"; }).join(""); }
  function para(s) { return esc(s).replace(/\n+/g, "</p><p class=\"mt-2\">"); }
  var card = function (inner) { return '<section class="rounded-2xl border border-[#e6e9ee] bg-white p-6 shadow-[0_1px_2px_rgba(16,32,29,.04)]">' + inner + "</section>"; };
  var head = function (eyebrow, title) {
    return (eyebrow ? '<p class="text-[11px] uppercase tracking-[0.2em] text-[#0a6cf5] font-semibold mb-1">' + esc(eyebrow) + "</p>" : "") +
      '<h2 class="font-display text-xl font-semibold text-[#16201d] border-b border-[#eef0f4] pb-2 mb-4">' + esc(title) + "</h2>";
  };
  var sub = function (t) { return '<h3 class="font-display text-base font-semibold text-[#16201d] mt-4 mb-1">' + esc(t) + "</h3>"; };
  function statusDot(s) { var c = s === "positive" ? "#10b981" : s === "watch" ? "#f59e0b" : s === "priority" ? "#ef4444" : "#9aa0ab"; return '<span class="inline-block w-2.5 h-2.5 rounded-full shrink-0" style="background:' + c + '"></span>"'.slice(0, -1); }

  // ── STATIC clinic copy (verbatim from Fred's VBIS — content unchanged, design ours) ──
  function staticCounseling() {
    var block = function (t, lede, items) {
      return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-4">' + sub(t) +
        '<p class="text-sm text-[#6b7280] mb-2">' + esc(lede) + "</p>" +
        '<ul class="text-sm text-[#4b5563] space-y-1.5">' + bullets(items) + "</ul></div>";
    };
    return card(head("Counseling & behavioral therapy", "The support system that makes it stick") +
      '<div class="grid md:grid-cols-2 gap-4">' +
      block("Intensive Behavioral Therapy (IBT)", "Willpower runs out; habit engineering doesn't. Every Vitality patient gets our structured IBT protocol that rewires triggers, routines, and rewards.",
        ["Identifying emotional and situational eating triggers before they become lapses", "Building micro-habits that compound into sustainable lifestyle change", "Cognitive restructuring around food, body image, and long-term health identity", "Relapse prevention with real-time accountability touchpoints"]) +
      block("Personal counseling & education", "Weight loss without education is temporary; with understanding it's permanent.",
        ["Sustainability education — maintain progress through travel, stress, holidays, and life transitions", "Biomarker literacy — understand your InBody numbers in plain language so every re-scan motivates", "Identity-level change — move from \"I'm on a diet\" to \"This is how I live now\""]) +
      block("Registered Dietitian guidance", "Your nutrition plan isn't pulled from a template — it's calibrated by a Registered Dietitian (RD) against your InBody composition, body fat percentage, lean mass, and the specific goals you set with your provider.",
        ["Body-fat-driven targeting — macro splits and calorie ranges are tuned to your current body fat percentage and the percentage you're working toward, not a one-size-fits-all number", "Lean mass protection — protein floors and resistance-fueling strategy designed to preserve (or build) skeletal muscle mass while fat comes off", "Goal-specific plans — fat loss, recomposition, athletic performance, post-bariatric nutrition, or metabolic-health-first eating all get a distinct RD playbook", "Condition-aware nutrition — adjustments for GLP-1 medication side effects, insulin resistance, PCOS, thyroid, GI sensitivities, and food preferences", "Ongoing re-calibration — every InBody re-scan triggers an RD review so your plan evolves with your body, not three months behind it"]) +
      block("Your personal fitness coordinator", "You are not handed a workout sheet and sent away. Every patient is assigned a dedicated fitness coordinator who trains you hands-on and teaches you proper technique so you can confidently execute your personalized plan on your own.",
        ["One-on-one training — your coordinator walks you through every movement in your plan until it becomes second nature", "Technique mastery — learn correct form, tempo, and safety cues so you train effectively and avoid injury", "Gym autonomy — we don't create dependency; we build independence so you can run your program at any gym with confidence", "Plan personalization — exercises and progressions are chosen around your current capacity, injuries, and available equipment", "Facility onboarding — come into our facility, learn your program, ask questions, and leave with a clear path to success in your gym"]) +
      "</div>");
  }
  function staticFacility() {
    var tile = function (t, d) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-4"><div class="font-semibold text-sm text-[#16201d]">' + esc(t) + '</div><div class="text-xs text-[#6b7280] mt-1">' + esc(d) + "</div></div>"; };
    return card(head("Vitality Academies", "Your home base for transformation") +
      '<p class="text-sm text-[#4b5563] leading-relaxed mb-4">This isn\'t a telehealth-only program from your couch. Vitality Academies is our physical headquarters — a real facility built for real transformation.</p>' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">' +
      tile("Workout facility", "Train on-site with equipment and space designed for your program") +
      tile("Lecture rooms", "Live education on nutrition, metabolism, and habit science") +
      tile("Nurse office", "On-site consults, medication administration, and clinical check-ins") +
      tile("Vitals & wellness checks", "Blood pressure monitoring, injection administration, progress tracking") + "</div>" +
      '<div class="rounded-xl bg-[#eaf2ff] border border-[#d6e6ff] p-4"><div class="font-semibold text-sm text-[#0a3d7a] mb-2">On-site highlights</div><ul class="text-sm text-[#0a3d7a] space-y-1.5">' +
      bullets(["On-site InBody 570 scanning for precise body composition tracking", "Clinical oversight from licensed medical professionals", "Community of patients and providers walking the same journey"]) +
      '</ul><p class="text-sm font-medium text-[#0a3d7a] mt-3 pt-3 border-t border-[#cfe0fb]">Everything under one roof — scans, workouts, consults, injections, education — all at Vitality Academies. The difference between a program you download and a place that has your back.</p></div>');
  }

  // ── DYNAMIC per-patient sections ──
  function execSummary(hb) {
    if (!hb.executive_summary && !hb.inbody_analysis) return "";
    return card(head("", "Executive summary") +
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
    return card(head("Complete InBody analysis", "Every metric, decoded") + '<div class="space-y-2">' + rows + "</div>");
  }
  function aiAnalysis(hb) {
    var ai = hb.ai_analysis; if (!ai) return "";
    var col = function (t, items, tone) { if (!arr(items).length) return ""; return '<div><div class="text-[11px] uppercase tracking-wide font-semibold mb-1" style="color:' + tone + '">' + esc(t) + '</div><ul class="text-sm text-[#4b5563] space-y-1">' + bullets(items) + "</ul></div>"; };
    var txt = function (t, v) { return v ? "<div>" + sub(t) + '<p class="text-sm text-[#4b5563]">' + esc(v) + "</p></div>" : ""; };
    return card(head("Clinical analysis", "Where you stand today") +
      '<div class="grid md:grid-cols-3 gap-4 mb-2">' + col("Strengths", ai.strengths, "#10b981") + col("Risk factors", ai.risk_factors, "#ef4444") + col("Areas for improvement", ai.areas_for_improvement, "#f59e0b") + "</div>" +
      '<div class="grid md:grid-cols-2 gap-x-6 gap-y-1 mt-2">' + txt("Metabolic observations", ai.metabolic_observations) + txt("Body composition analysis", ai.body_composition_analysis) + txt("Lifestyle analysis", ai.lifestyle_analysis) + txt("Exercise readiness", ai.exercise_readiness) + txt("Nutrition readiness", ai.nutrition_readiness) + "</div>");
  }
  function whyPlan(hb) {
    var w = hb.why_we_chose_this_plan; if (!w || typeof w !== "object") return "";
    var rows = Object.keys(w).map(function (k) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3"><div class="text-[11px] uppercase tracking-wide text-[#0a6cf5] font-semibold">' + esc(k.replace(/_/g, " ")) + '</div><p class="text-sm text-[#4b5563] mt-1">' + esc(w[k]) + "</p></div>"; }).join("");
    return card(head("", "Why we chose this plan") + '<div class="grid md:grid-cols-2 gap-3">' + rows + "</div>");
  }
  function nutrition(hb) {
    var n = hb.nutrition; if (!n) return "";
    var dt = n.daily_targets || {};
    var tgt = function (l, v, u) { return v == null ? "" : '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3 text-center"><div class="font-display text-xl font-semibold text-[#16201d]">' + esc(v) + (u || "") + '</div><div class="text-[10px] uppercase tracking-wide text-[#9aa0ab] font-semibold">' + l + "</div></div>"; };
    var meal = function (slot, m) { if (!m) return ""; return '<div class="border-l-2 border-[#d6e6ff] pl-3 py-1"><div class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">' + slot + '</div><div class="text-sm font-semibold text-[#16201d]">' + esc(m.name) + ' <span class="text-[#9aa0ab] font-normal">· ' + esc(m.calories) + " kcal · " + esc(m.protein_g) + 'g P</span></div><div class="text-xs text-[#6b7280]">' + esc(arr(m.ingredients).join(", ")) + (m.serving ? " · " + esc(m.serving) : "") + '</div>' + (m.prep ? '<div class="text-xs text-[#9aa0ab] italic">' + esc(m.prep) + "</div>" : "") + "</div>"; };
    var days = arr(n.week_one_meal_plan).map(function (d, i) {
      return '<details ' + (i === 0 ? "open" : "") + ' class="rounded-xl border border-[#eef0f4] bg-[#fbfcfe]"><summary class="flex items-center justify-between p-3 cursor-pointer"><span class="font-semibold text-sm text-[#16201d]">' + esc(d.day) + '</span><span class="text-xs text-[#6b7280]">' + esc(d.daily_total_calories) + " kcal · " + esc(d.daily_total_protein_g) + 'g protein</span></summary><div class="px-3 pb-3 space-y-2">' + meal("Breakfast", d.breakfast) + meal("Lunch", d.lunch) + meal("Dinner", d.dinner) + meal("Snack", d.snack) + "</div></details>";
    }).join("");
    var roadmap = arr(n.monthly_roadmap).map(function (m) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3"><div class="flex items-center justify-between"><div class="font-semibold text-sm text-[#16201d]">Month ' + esc(m.month) + " · " + esc(m.focus) + '</div><span class="text-xs text-[#0a6cf5] font-medium">' + esc(m.calorie_adjustment) + "</span></div>" + (arr(m.key_swaps).length ? '<ul class="text-xs text-[#6b7280] mt-1 space-y-0.5">' + bullets(m.key_swaps) + "</ul>" : "") + "</div>"; }).join("");
    return card(head("Nutrition program", "Your eating plan") +
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
    return card(head("Workout program", esc(w.program_type || "Your movement plan")) + '<div class="space-y-2">' + phases + "</div>");
  }
  function habits(hb) {
    var hs = arr(hb.habits); if (!hs.length) return "";
    var rows = hs.map(function (h) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3"><div class="font-semibold text-sm text-[#16201d]">Week ' + esc(h.week) + " · " + esc(h.habit) + '</div><div class="text-xs text-[#6b7280] mt-1">' + esc(h.why_it_matters) + '</div>' + (h.expected_benefit ? '<div class="text-xs text-[#0a7a3d] mt-0.5">' + esc(h.expected_benefit) + "</div>" : "") + (h.success_strategy ? '<div class="text-xs text-[#9aa0ab] mt-0.5"><b>How:</b> ' + esc(h.success_strategy) + "</div>" : "") + "</div>"; }).join("");
    return card(head("", "Weekly habit progression") + '<div class="grid md:grid-cols-2 gap-3">' + rows + "</div>");
  }
  function projections(hb) {
    var ps = arr(hb.timeline_projections); if (!ps.length) return "";
    var rows = ps.map(function (p) { return '<div class="rounded-xl bg-[#f7f8fa] border border-[#eef0f4] p-3 text-center"><div class="text-[10px] uppercase tracking-wide text-[#0a6cf5] font-semibold">Day ' + esc(p.day) + '</div><div class="font-display text-lg font-semibold text-[#16201d] mt-0.5">' + esc(p.projected_weight_lb) + ' lb</div><div class="text-[11px] text-[#6b7280]">' + esc(p.projected_body_fat_pct) + '% BF</div><div class="text-[11px] text-[#9aa0ab] mt-1">' + esc(p.milestone) + "</div></div>"; }).join("");
    return card(head("", "Progress projections") + '<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">' + rows + "</div>");
  }
  function nextScan(hb) {
    if (!hb.next_inbody_recommendation_days) return "";
    return card('<div class="flex items-center justify-between"><div><h2 class="font-display text-base font-semibold text-[#16201d]">Next InBody scan</h2><p class="text-sm text-[#6b7280] mt-0.5">Re-scan to recalibrate your plan against real progress.</p></div><div class="text-right"><div class="font-display text-2xl font-semibold text-[#0a6cf5]">' + esc(hb.next_inbody_recommendation_days) + '</div><div class="text-[10px] uppercase tracking-wide text-[#9aa0ab] font-semibold">days</div></div></div>');
  }

  function sectionPlaceholder(label) {
    return '<div class="rounded-2xl border border-dashed border-[#d6e6ff] bg-[#f7faff] p-8 text-center"><div class="text-sm text-[#6b7280]"><span class="inline-flex items-center justify-center gap-2"><span class="w-2 h-2 rounded-full bg-[#0a6cf5] animate-pulse"></span>Generating ' + esc(label) + "…</span></div></div>";
  }
  function statusBanner(status) {
    if (status === "generating") {
      return '<div class="rounded-xl bg-[#eaf2ff] border border-[#d6e6ff] p-3 text-sm text-[#0a3d7a]">Handbook generating — sections appear below as they finish.</div>';
    }
    if (status === "partial") {
      return '<div class="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">Some sections could not be generated. Content below may be incomplete.</div>';
    }
    if (status === "complete") {
      return '<div class="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">Handbook complete.</div>';
    }
    return "";
  }

  window.renderVbisHandbook = function (hb, opts) {
    opts = opts || {}; hb = hb || {}; var p = opts.patient || {};
    var cover = card('<div class="flex items-center justify-between flex-wrap gap-3"><div><p class="text-[11px] uppercase tracking-[0.2em] text-[#0a6cf5] font-semibold">Patient handbook · Personalized transformation plan</p><h1 class="font-display text-2xl font-semibold text-[#16201d] mt-1">' + esc((p.first || "") + " " + (p.last || "")).trim() + '</h1></div><div class="text-right text-xs text-[#6b7280]"><div><span class="uppercase tracking-wide text-[#9aa0ab]">Program</span><br><span class="font-medium text-[#16201d]">' + esc((hb.workout && hb.workout.program_type) || "Personalized") + '</span></div><div class="mt-1.5"><span class="uppercase tracking-wide text-[#9aa0ab]">Provider</span><br><span class="font-medium text-[#16201d]">Vitality Academies</span></div></div></div>');
    return '<div class="space-y-5">' + [
      cover, execSummary(hb), interpretations(hb), aiAnalysis(hb), whyPlan(hb),
      nutrition(hb), workout(hb), habits(hb), projections(hb), nextScan(hb),
      staticCounseling(), staticFacility(),
    ].filter(Boolean).join("") + "</div>";
  };

  // Progressive renderer — placeholders for sections not yet in sections_ready while status is generating/partial.
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
    var cover = card('<div class="flex items-center justify-between flex-wrap gap-3"><div><p class="text-[11px] uppercase tracking-[0.2em] text-[#0a6cf5] font-semibold">Patient handbook · Personalized transformation plan</p><h1 class="font-display text-2xl font-semibold text-[#16201d] mt-1">' + esc((p.first || "") + " " + (p.last || "")).trim() + '</h1></div><div class="text-right text-xs text-[#6b7280]"><div><span class="uppercase tracking-wide text-[#9aa0ab]">Program</span><br><span class="font-medium text-[#16201d]">' + esc((hb.workout && hb.workout.program_type) || "Personalized") + '</span></div><div class="mt-1.5"><span class="uppercase tracking-wide text-[#9aa0ab]">Provider</span><br><span class="font-medium text-[#16201d]">Vitality Academies</span></div></div></div>');
    var parts = [
      statusBanner(status),
      cover,
      slot("overview", "Executive summary & clinical overview", execSummary),
      slot("interpretations", "InBody metric interpretations", interpretations),
      has("overview") ? aiAnalysis(hb) : (isLive ? "" : aiAnalysis(hb)),
      has("overview") ? whyPlan(hb) : (isLive ? "" : whyPlan(hb)),
      slot("nutrition", "Nutrition program (7-day meal plan)", nutrition),
      slot("program", "Workout program, habits & projections", function (h) {
        return [workout(h), habits(h), projections(h), nextScan(h)].filter(Boolean).join("");
      }),
    ];
    if (status === "complete") {
      parts.push(staticCounseling(), staticFacility());
    }
    return '<div class="space-y-5">' + parts.filter(Boolean).join("") + "</div>";
  };
})();
