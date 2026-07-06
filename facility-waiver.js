/*
 * Vitality Weight Loss: Fitness Facility Use, Assumption of Risk, and Release of
 * Liability Agreement. SINGLE SOURCE OF TRUTH for the facility waiver text used across
 * intake.html, checkout.html, and checkin.html. Do not fork this text into a page; import
 * window.FACILITY_WAIVER_HTML so all surfaces stay identical and versioned together.
 *
 * Placement (per Luis 2026-07-05): required reading + acknowledgement on the in-person /
 * facility flows only. EXCLUDED: async drug flows (glp1.html / glp1A / glp1B / bloom.html)
 * because those patients never use the facility.
 *
 * When the legal text changes, bump FACILITY_WAIVER_VERSION so prior acknowledgements are
 * distinguishable and returning patients are re-prompted.
 */
(function () {
  window.FACILITY_WAIVER_VERSION = 'FFW-2026-07-05';
  window.FACILITY_WAIVER_TITLE = 'Fitness Facility Use, Assumption of Risk, and Release of Liability Agreement';

  // Full agreement, faithful to Vitality_Fitness_Facility_Waiver.pdf. Rendered inside a
  // scrollable "required reading" container; headings match the DOCS styling used in intake.html.
  window.FACILITY_WAIVER_HTML = `
    <h4>Fitness Facility Use, Assumption of Risk, and Release of Liability Agreement</h4>
    <p style="color:var(--muted);font-size:12px;">Vitality Weight Loss, a physician-supervised metabolic and fitness clinic operated by Vitality Academies Nevada LLC. Version ${window.FACILITY_WAIVER_VERSION}.</p>
    <p><strong>PLEASE READ CAREFULLY BEFORE SIGNING.</strong> This is a legally binding agreement that affects your legal rights, including your right to recover damages for certain injuries. It is entered into as a condition of your voluntary use of the fitness facilities, exercise equipment, supervised training, and body-composition testing offered at Vitality Weight Loss. It does not govern, limit, or waive any right you may have relating to professional medical care, as described in Section 4.4 below.</p>
    <p>This Agreement is made between the undersigned participant (&ldquo;Participant,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and <strong>Vitality Academies Nevada LLC</strong>, a Nevada limited liability company doing business as <strong>Vitality Weight Loss</strong> (the &ldquo;Clinic&rdquo;). This Agreement is part of the Clinic&rsquo;s patient intake process and may be executed and stored electronically.</p>

    <h4>Recitals and Definitions</h4>
    <p>The Clinic operates a physician-supervised medical weight-loss and metabolic health program. As one component of that program, and separate from the medical services it provides, the Clinic makes available to patients an on-site fitness environment. Because physical exercise carries inherent risks even when supervised, the Clinic requires each Participant to acknowledge those risks and to agree to the terms below as a condition of accessing the fitness environment.</p>
    <ul>
      <li><strong>&ldquo;Released Parties&rdquo;</strong> means Vitality Weight Loss; Vitality Academies Nevada LLC; and each of their respective owners, members, managers, officers, directors, supervising and treating physicians, advanced practice providers, nurses and medical staff, certified and non-certified fitness trainers and instructors, employees, independent contractors, agents, volunteers, affiliates, parent and related entities, successors, and assigns.</li>
      <li><strong>&ldquo;Facility&rdquo;</strong> means the Clinic&rsquo;s premises and all fitness-related areas, spaces, fixtures, exercise equipment, machines, free weights, cardiovascular equipment, and related apparatus located on the Clinic&rsquo;s premises, including the InBody 570 body-composition analyzer and any successor or comparable device.</li>
      <li><strong>&ldquo;Activities&rdquo;</strong> means the Participant&rsquo;s use of and participation in the Facility, including supervised and unsupervised exercise; individual and group fitness training and instruction; use of exercise equipment; body-composition testing and scanning; warm-up, cool-down, stretching, and conditioning; and movement to, from, and within the Facility.</li>
    </ul>

    <h4>1. Assumption of Risk</h4>
    <p>The Participant understands and voluntarily accepts that participation in the Activities involves inherent and other risks that cannot be eliminated regardless of the care taken by the Released Parties, and that supervision, instruction, or a physician&rsquo;s presence does not remove those risks. The Participant knowingly and freely assumes all such risks, both known and unknown, and accepts personal responsibility for participating. These risks include, but are not limited to:</p>
    <ul>
      <li>Cardiovascular events, including elevated heart rate, arrhythmia, heart attack, stroke, or other acute cardiac or vascular episodes;</li>
      <li>Musculoskeletal injuries, including sprains, strains, tears, dislocations, fractures, and injuries to muscles, ligaments, tendons, joints, and connective tissue;</li>
      <li>Dizziness, lightheadedness, nausea, fainting, loss of balance, slips, trips, and falls;</li>
      <li>Malfunction, failure, or improper use of exercise equipment or the InBody 570 or other testing devices;</li>
      <li>Aggravation, exacerbation, or worsening of pre-existing medical conditions, injuries, or physical limitations;</li>
      <li>Adverse physical responses that may occur when exercise is undertaken while receiving medical weight-loss treatment, which the Participant will discuss with the treating provider; and</li>
      <li>In rare circumstances, serious bodily injury, permanent disability, or death.</li>
    </ul>
    <p>The Participant acknowledges that the foregoing list is not exhaustive and that other risks, known and unknown, may arise. The Participant affirms that participation in the Activities is voluntary and that the Participant may decline or discontinue any Activity at any time.</p>

    <h4>2. Medical Representations and Acknowledgments</h4>
    <p>By signing below, the Participant represents, warrants, and agrees that:</p>
    <ul>
      <li>The Participant is physically able to participate in the Activities, or has been evaluated and cleared to participate by a qualified healthcare provider, and assumes full responsibility for the decision to participate;</li>
      <li>The Participant will fully and accurately disclose to the Clinic all medical conditions, symptoms, injuries, limitations, pregnancies, and medications (including GLP-1 and other prescribed therapies) that are or may be relevant to safe participation, and will promptly update that information as it changes;</li>
      <li>The Participant understands that the Clinic&rsquo;s fitness staff are not providing individualized medical diagnosis or treatment through the Activities, and that questions about the Participant&rsquo;s medical fitness to exercise should be directed to the treating physician or provider;</li>
      <li>The Participant will immediately stop any Activity and notify Clinic staff if the Participant experiences chest pain or pressure, shortness of breath, dizziness, faintness, irregular or racing heartbeat, unusual fatigue, nausea, sudden pain, or any other warning sign or symptom of distress; and</li>
      <li>The Participant understands that participating in the Activities against medical advice, or without disclosing relevant conditions, is done at the Participant&rsquo;s own risk.</li>
    </ul>

    <h4>3. Compliance with Instructions and Facility Rules</h4>
    <p>The Participant agrees to follow all instructions, directions, and safety guidelines given by the Clinic&rsquo;s physicians, medical staff, trainers, instructors, and other personnel; to use all exercise equipment, weights, machines, and the InBody 570 and other testing devices only as directed and only for their intended purpose, and not to exceed the Participant&rsquo;s own physical capabilities; to refrain from using any equipment or engaging in any Activity for which the Participant has not received instruction or clearance; to immediately report to Clinic staff any equipment that appears unsafe, damaged, defective, or malfunctioning, and any spill, hazard, or unsafe condition observed in the Facility; and to observe all posted rules, signage, and Facility policies, and conduct himself or herself in a manner that does not endanger the Participant or others.</p>

    <h4>4. Release and Waiver of Liability</h4>
    <p><strong>4.1 Release.</strong> To the fullest extent permitted by Nevada law, the Participant, on behalf of the Participant and the Participant&rsquo;s heirs, spouse, family members, executors, administrators, personal representatives, successors, and assigns, hereby <strong>releases, waives, discharges, and covenants not to sue</strong> the Released Parties from and for any and all claims, demands, causes of action, liabilities, damages, losses, costs, or expenses (including attorneys&rsquo; fees) arising out of or relating to <strong>ordinary negligence</strong> of the Released Parties in connection with the Activities, including use of the Facility&rsquo;s exercise equipment, machines, weights, and apparatus; supervised or unsupervised exercise and physical activity; participation in individual or group fitness instruction, training, and programming; body-composition testing and use of the InBody 570 or comparable device; and use of, and presence within, the Facility and its spaces, including entrances, floors, and common areas.</p>
    <p><strong>4.2 Injuries Covered.</strong> This release applies to personal injury, bodily injury, illness, aggravation of a pre-existing condition, property damage, disability, and death, and to both the risks specifically identified in Section 1 and any other risk arising from the Activities, whether or not presently known or anticipated.</p>
    <p><strong>4.3 Limitations: What Is NOT Released.</strong> This Agreement does not release, waive, or limit liability for <strong>gross negligence, willful or wanton misconduct, recklessness, or intentional misconduct</strong> of the Released Parties, and does not release any liability that may not lawfully be waived or released in advance under Nevada law. Nothing in this Agreement shall be construed to require the Participant to waive any right that cannot, as a matter of law or public policy, be prospectively waived, and any such right is expressly preserved.</p>
    <p><strong>4.4 Medical Care Not Affected.</strong> This Agreement addresses only the Participant&rsquo;s use of the Facility and participation in the Activities. It <strong>does not</strong> apply to, release, or waive any claim for professional negligence or medical malpractice arising from medical diagnosis, treatment, prescribing, or professional care rendered by the Clinic&rsquo;s physicians, providers, or medical staff. Such matters are governed by applicable Nevada law, including Chapter 41A of the Nevada Revised Statutes, and are not the subject of this Agreement. The Participant&rsquo;s consent to medical treatment is addressed through separate informed-consent documentation.</p>

    <h4>5. Indemnification and Hold Harmless</h4>
    <p>To the fullest extent permitted by Nevada law, the Participant agrees to <strong>indemnify, defend, and hold harmless</strong> the Released Parties from and against any and all claims, liabilities, damages, losses, judgments, costs, and expenses (including reasonable attorneys&rsquo; fees) brought by the Participant or by any third party, to the extent arising out of or relating to the Participant&rsquo;s misuse of, or improper or unauthorized use of, exercise equipment, weights, machines, or testing devices; the Participant&rsquo;s failure to follow instructions, directions, or safety guidelines given by Clinic staff, physicians, or trainers; the Participant&rsquo;s violation of Facility rules, policies, or posted signage; or the Participant&rsquo;s negligent, reckless, or intentional acts or omissions during the Activities. This indemnification obligation does not extend to claims arising from the gross negligence, recklessness, willful misconduct, or intentional misconduct of the Released Parties.</p>

    <h4>6. Limitation of Liability and Damages</h4>
    <p>To the fullest extent permitted by Nevada law, and except for liability arising from gross negligence, recklessness, or willful or intentional misconduct (which is neither limited nor waived by this Section), the Participant agrees that: (a) <strong>No consequential or punitive damages.</strong> The Released Parties shall not be liable to the Participant for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost income or earning capacity, arising out of or relating to the Facility or the Activities, even if advised of the possibility of such damages; and (b) <strong>Aggregate cap.</strong> The total, aggregate liability of the Released Parties for any and all claims that are not otherwise released by this Agreement, arising out of or relating to the Facility and the Activities, shall not exceed the greater of (i) the total amount of fees, if any, paid by the Participant to the Clinic for fitness-related services during the twelve (12) months preceding the event giving rise to the claim, or (ii) One Hundred Dollars ($100.00). This Section does not apply to, and does not limit, any claim for professional negligence or medical malpractice governed by Section 4.4, which remains subject to applicable Nevada law.</p>

    <h4>7. Emergency Medical Authorization</h4>
    <p>In the event of an apparent injury, medical emergency, or acute distress during the Activities, the Participant authorizes the Clinic and its staff to contact emergency medical services (911), to summon emergency responders, and to render or arrange first aid or emergency care to the extent the staff reasonably deem appropriate, including in circumstances where the Participant is unable to consent. The Released Parties are not obligated to provide medical treatment beyond summoning emergency assistance, and any emergency response is undertaken in good faith and does not create an assumption of ongoing medical responsibility. The Participant is solely responsible for all costs of emergency transport, hospitalization, examination, and medical treatment arising from such an event, should maintain personal health insurance, and understands that the Clinic does not provide coverage for such costs.</p>

    <h4>8. Photograph and Video Release</h4>
    <p>By signing this Agreement, the Participant grants the Clinic permission to capture, record, store, and use progress photographs, body-composition results, and fitness-related images or video of the Participant for internal documentation of the Participant&rsquo;s progress within the Participant&rsquo;s own program and record; clinical and fitness documentation used by Clinic staff to support, evaluate, and adjust the Participant&rsquo;s program; and marketing and promotional use by the Clinic (for example, website, social media, print, or advertising), which may involve public disclosure of the images. The Participant acknowledges that this consent is granted without expectation of compensation and that images and recordings created by the Clinic remain the property of the Clinic, and waives any right to inspect or approve the finished materials in which the Participant&rsquo;s likeness appears.</p>
    <p><strong>Withdrawal.</strong> The Participant may withdraw consent for future marketing and promotional use at any time by written notice to the Clinic, effective prospectively. Withdrawal will not obligate the Clinic to recall, retrieve, or remove materials already published or distributed before the notice is received, and does not affect internal or clinical documentation used to deliver the Participant&rsquo;s care.</p>
    <p><strong>Privacy.</strong> Any use of images that identifies the Participant as a patient will be handled consistent with applicable privacy laws, including HIPAA and Nevada law. To the extent any particular use constitutes &ldquo;marketing&rdquo; of protected health information, or otherwise requires a separate written authorization under HIPAA, the Clinic will obtain that authorization before such use.</p>

    <h4>9. Dispute Resolution; Arbitration, Class-Action and Jury-Trial Waiver</h4>
    <p><strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS HOW DISPUTES ARE RESOLVED AND LIMITS THE RIGHT TO A COURT OR JURY TRIAL AND TO PARTICIPATE IN A CLASS ACTION.</strong> This Section does not apply to claims for professional negligence or medical malpractice governed by Section 4.4, which are resolved as provided by Nevada law.</p>
    <p><strong>9.1 Informal Resolution.</strong> Before initiating any formal proceeding, the party raising a dispute relating to this Agreement, the Facility, or the Activities will give the other party written notice describing the dispute, and the parties will attempt in good faith to resolve it for a period of thirty (30) days.</p>
    <p><strong>9.2 Binding Arbitration.</strong> Except as provided in Sections 9.5 and 9.6, any dispute arising out of or relating to this Agreement, the Facility, or the Activities that is not resolved informally shall be resolved by final and binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules then in effect, before a single arbitrator, with the arbitration seated in Clark County, Nevada (or the Nevada county in which the Clinic operates). The Federal Arbitration Act governs the interpretation and enforcement of this Section. Judgment on the arbitrator&rsquo;s award may be entered in any court having jurisdiction.</p>
    <p><strong>9.3 Class-Action Waiver.</strong> To the fullest extent permitted by law, the Participant and the Clinic agree that each may bring claims against the other only in an individual capacity, and not as a plaintiff or class member in any purported class, collective, consolidated, or representative proceeding. The arbitrator may not consolidate more than one person&rsquo;s claims or preside over any form of class or representative proceeding.</p>
    <p><strong>9.4 Jury-Trial Waiver.</strong> To the extent any dispute is permitted to proceed in court rather than arbitration, the Participant and the Clinic each knowingly, voluntarily, and irrevocably waive any right to a trial by jury.</p>
    <p><strong>9.5 Right to Opt Out of Arbitration.</strong> The Participant may opt out of the arbitration and class-action-waiver provisions of this Section 9 by delivering written notice to the Clinic within thirty (30) days after signing this Agreement, stating the Participant&rsquo;s name and intent to opt out. Opting out will not affect any other provision of this Agreement, and will not affect the Participant&rsquo;s care or use of the Facility.</p>
    <p><strong>9.6 Injunctive Relief; Time to Bring Claims.</strong> Either party may seek injunctive or equitable relief in a court located in Clark County, Nevada, to prevent misuse of the Facility or to protect confidential or proprietary rights. In addition, to the fullest extent permitted by law, any claim arising out of or relating to the Facility or the Activities must be commenced within one (1) year after the event giving rise to the claim, or it is permanently barred.</p>
    <p><strong>9.7 Prevailing-Party Fees.</strong> In any arbitration or permitted court proceeding to enforce or interpret this Agreement, the prevailing party shall be entitled to recover its reasonable attorneys&rsquo; fees and costs, to the extent permitted by law.</p>

    <h4>10. Severability</h4>
    <p>If any provision of this Agreement, or the application of any provision to any person or circumstance, is held to be invalid, void, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. Any invalid or unenforceable provision shall be modified and interpreted so as to best accomplish its objectives to the fullest extent permitted by law, and if it cannot be so modified, it shall be severed from this Agreement without affecting the validity or enforceability of the remaining provisions. The Participant and the Clinic intend that this Agreement be enforced to the greatest extent permitted by Nevada law.</p>

    <h4>11. Acknowledgment and Voluntary Signature</h4>
    <p>By signing below, the Participant acknowledges and agrees that the Participant: has read this Agreement in its entirety, or has had it read to the Participant, and understands its terms, including that it is a release of liability and an assumption of risk; specifically understands and agrees to the assumption of risk (Section 1), the release of liability (Section 4), the limitation of liability and damages (Section 6), and the arbitration, class-action, and jury-trial waivers (Section 9), and understands the right to opt out of arbitration described in Section 9.5; has had the opportunity to ask questions and to seek independent legal or medical advice before signing, and that all questions have been answered to the Participant&rsquo;s satisfaction; is signing freely and voluntarily, without duress, and intends this Agreement to be binding on the Participant and the Participant&rsquo;s heirs and representatives; is not relying on any oral or written representation, promise, or inducement not expressly set forth in this Agreement; and is at least eighteen (18) years of age, or is signing as the parent or legal guardian of a minor Participant and agrees to be bound by this Agreement on the minor&rsquo;s behalf to the extent permitted by law.</p>

    <h4>12. General Provisions</h4>
    <p><strong>Consideration.</strong> Access to the Facility, participation in the Activities, and the fitness services made available by the Clinic constitute good, valuable, and sufficient consideration for the Participant&rsquo;s agreement to these terms. <strong>Governing Law and Venue.</strong> This Agreement is governed by the laws of the State of Nevada, without regard to its conflict-of-laws principles; subject to Section 9, any action shall be brought exclusively in the state or federal courts located in Clark County, Nevada. <strong>Third-Party Beneficiaries.</strong> Each of the Released Parties who is not a signatory is an intended third-party beneficiary of the releases, waivers, limitations, and covenants and may enforce them directly. <strong>Survival.</strong> The Participant&rsquo;s representations and Sections 1, 4, 5, 6, 9, and 12 survive termination of this Agreement and the end of the Participant&rsquo;s relationship with the Clinic. <strong>Entire Agreement.</strong> This Agreement is the entire understanding regarding use of the Facility and the Activities and supersedes any prior understanding on that subject; it may be amended only in a writing referencing this Agreement. <strong>Continuing Effect.</strong> This Agreement applies to the Participant&rsquo;s use of the Facility on the date signed and on all future dates, and remains in effect for the duration of the Participant&rsquo;s relationship with the Clinic unless revoked in writing prospectively; no revocation affects Activities occurring before the revocation is received. <strong>Electronic Signature.</strong> The Participant agrees that this Agreement may be signed electronically, and that an electronic signature and an electronic or printed copy have the same legal force and effect as an original handwritten signature and original document, consistent with the Nevada Uniform Electronic Transactions Act (NRS Chapter 719) and the federal E-SIGN Act.</p>
  `;

  /*
   * renderFacilityWaiver(host, opts) builds a self-contained required-reading + acknowledgement
   * block into `host` (a DOM element). Used by checkout.html and checkin.html, which do not have
   * intake.html's ack framework. The acknowledge checkbox stays LOCKED until the reader scrolls the
   * agreement to the end (required reading), then unlocks; a typed full legal name is the e-signature.
   *
   * opts.onChange(state) fires whenever satisfaction changes, where state = { read, agreed, name, ok }.
   * Call window.facilityWaiverState(host) any time to read the current { read, agreed, name, ok }.
   */
  window.renderFacilityWaiver = function (host, opts) {
    opts = opts || {};
    const S = { read: false, agreed: false, name: '' };
    const satisfied = () => S.read && S.agreed && S.name.trim().split(/\s+/).filter(Boolean).length >= 2;
    const fire = () => { S.ok = satisfied(); if (typeof opts.onChange === 'function') opts.onChange(S); };

    host.innerHTML = '';
    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;font-size:15px;margin:0 0 6px;';
    title.textContent = 'Fitness Facility Waiver (required)';
    host.appendChild(title);
    const sub = document.createElement('div');
    sub.style.cssText = 'font-size:12px;color:#6b7280;margin:0 0 10px;';
    sub.textContent = 'Please read the full agreement to the end. The acknowledgement unlocks once you have scrolled through it.';
    host.appendChild(sub);

    const box = document.createElement('div');
    box.style.cssText = 'max-height:320px;overflow-y:auto;border:1px solid #e6e9ee;border-radius:12px;padding:14px 16px;background:#fff;font-size:13px;line-height:1.55;color:#16201d;';
    box.innerHTML = window.FACILITY_WAIVER_HTML;
    host.appendChild(box);

    const ackRow = document.createElement('label');
    ackRow.style.cssText = 'display:flex;gap:11px;align-items:flex-start;padding:11px 13px;margin:12px 0 8px;border:1px solid #e6e9ee;border-radius:12px;cursor:pointer;opacity:.5;';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.disabled = true;
    const ackTxt = document.createElement('div');
    ackTxt.style.cssText = 'font-size:13px;line-height:1.5;';
    ackTxt.innerHTML = 'I have read and agree to the <strong>Fitness Facility Use, Assumption of Risk, and Release of Liability Agreement</strong>, including the assumption of risk (Section 1), the release of liability (Section 4), the limitation of liability (Section 6), and the arbitration, class-action, and jury-trial waivers (Section 9). I understand I may opt out of arbitration within 30 days (Section 9.5).';
    ackRow.appendChild(cb); ackRow.appendChild(ackTxt); host.appendChild(ackRow);

    const sigWrap = document.createElement('div'); sigWrap.style.cssText = 'margin:8px 0 0;';
    const sigLbl = document.createElement('div');
    sigLbl.style.cssText = 'font-size:12px;color:#6b7280;margin:0 0 5px;';
    sigLbl.textContent = 'Type your full legal name to sign';
    const sigIn = document.createElement('input'); sigIn.type = 'text'; sigIn.placeholder = 'First Last';
    sigIn.style.cssText = 'width:100%;box-sizing:border-box;padding:11px 13px;border:1px solid #e6e9ee;border-radius:12px;font-size:14px;';
    const sigMeta = document.createElement('div');
    sigMeta.style.cssText = 'font-size:11px;color:#9aa0ab;margin:6px 0 0;';
    sigMeta.textContent = 'By typing your name you sign under E-SIGN, UETA, and Nevada law. Your typed name has the same legal effect as a handwritten signature.';
    sigWrap.appendChild(sigLbl); sigWrap.appendChild(sigIn); sigWrap.appendChild(sigMeta); host.appendChild(sigWrap);

    // Required reading: unlock the checkbox once scrolled (or if content fits without scrolling).
    const markRead = () => {
      if (S.read) return;
      S.read = true;
      ackRow.style.opacity = '1'; cb.disabled = false;
      sub.textContent = 'Agreement read. You may now acknowledge and sign below.';
      fire();
    };
    box.addEventListener('scroll', () => {
      if (box.scrollTop + box.clientHeight >= box.scrollHeight - 24) markRead();
    });
    // If the box is not actually scrollable (large screen), don't trap the user.
    requestAnimationFrame(() => { if (box.scrollHeight <= box.clientHeight + 8) markRead(); });

    cb.onchange = () => { if (cb.disabled) { cb.checked = false; return; } S.agreed = cb.checked; fire(); };
    sigIn.oninput = () => { S.name = sigIn.value; fire(); };

    host._waiverState = S;
    fire();
    return S;
  };

  window.facilityWaiverState = function (host) {
    return (host && host._waiverState) || { read: false, agreed: false, name: '', ok: false };
  };
})();
