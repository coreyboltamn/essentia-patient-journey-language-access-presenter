"use strict";

const staffingStages = [
  "Demand discovery", "Workforce assessment", "Solution alignment",
  "Commercial planning", "Readiness & approval", "Deployment & support", "Workforce review",
];

// Each stage supplies pain, stakeholders, questions, solution, measures, and a next step.
const staffingScenarios = [
  {
    id: "urgent", name: "Urgent nursing coverage", tag: "Nursing · immediate gap",
    description: "A fictional community hospital is facing uncovered medical-surgical night shifts after unexpected absences.",
    stages: [
      ["Night-shift gaps are driving repeated overtime requests and uncertainty for the next roster.",
        "Nurse manager, staffing office, and house supervisor.",
        "Which shifts and competencies are uncovered? When must the team decide whether to adjust capacity?",
        "Explore per-diem or local contract nursing for discrete gaps alongside internal float options; confirm realistic availability before proposing coverage.",
        "Baseline open shift-hours, overtime hours, and time to a coverage decision.",
        "Agree the priority shifts and request a de-identified requirements brief from the staffing office."],
      ["A headcount shortage may hide a narrower gap in night-shift experience and unit-specific capability.",
        "Unit educator, nursing operations, and float-pool lead.",
        "Which capabilities are essential on nights? What internal float capacity and orientation time are actually available?",
        "Map a competency-based request against the internal pool before discussing supplemental medical-surgical nurses.",
        "Number of shift requests with confirmed role, competency, supervision, and orientation requirements.",
        "Validate a skills-and-shift matrix with the unit educator; exclude employee or patient identifiers."],
      ["The buyer needs to distinguish single-shift relief from a recurring multiweek need.",
        "Nurse manager, staffing buyer, and scheduling lead.",
        "Are these isolated absences or a sustained pattern? What continuity and minimum shift commitment would work?",
        "Compare per-diem flexibility with a short local contract for recurring nights, subject to candidate fit and availability.",
        "Agreed coverage model, target shift-hours, and a documented fallback if supply is unavailable.",
        "Shortlist a primary model and a capacity-management fallback for buyer review."],
      ["An urgent request can bypass clarity on overtime alternatives and assignment charges.",
        "Finance partner, procurement, and nursing operations.",
        "What is the fully loaded overtime baseline? Which premiums, cancellation terms, and orientation costs need approval?",
        "Build a transparent, time-bounded contingent proposal against the internal overtime alternative; lower cost is not assumed.",
        "Approved budget range, known rate inclusions, and explicit decision authority.",
        "Request a written scope and itemized commercial assumptions before seeking authorization."],
      ["A fast start is not useful if screening or facility onboarding remains incomplete.",
        "Credentialing team, unit educator, and facility approver.",
        "Which licenses, competency checks, and facility approvals are outstanding? Who authorizes a first shift?",
        "Sequence required licensing verification, credentialing, orientation, and facility approval before any placement.",
        "Facility-accepted readiness checklist and unresolved approval items, not a promised start date.",
        "Assign an owner to each readiness item and agree a go/no-go checkpoint."],
      ["Last-minute schedule changes can leave managers unsure who is expected or how to escalate a gap.",
        "Shift supervisor, scheduler, and staffing account contact.",
        "How will assignments be confirmed? Who handles a call-out, scope concern, or time-entry dispute?",
        "Use an agreed shift confirmation and escalation process with supplemental nursing support inside the approved scope.",
        "Confirmed versus requested shift-hours, attendance exceptions, and response times against agreed targets.",
        "Schedule a short first-shift check-in and document the escalation path."],
      ["Temporary relief can become an unexamined habit while recurring vacancy drivers remain.",
        "Nursing leadership, finance, and talent acquisition.",
        "Which gaps persisted? Did overtime burden change, and what needs a longer-term recruiting response?",
        "Review actual supplemental use and consider extending, tapering, internal float investment, or permanent recruitment.",
        "Actual spend, overtime trend, uncovered hours, and manager feedback against the original baseline.",
        "Agree a closeout or revised coverage plan with a named decision role and review date."],
    ],
  },
  {
    id: "seasonal", name: "Seasonal nursing demand", tag: "Nursing · planned surge",
    description: "A fictional regional hospital expects a winter census increase and wants a more deliberate coverage plan.",
    stages: [
      ["The projected winter peak may exceed the core nursing roster, but the timing is uncertain.",
        "Nursing director, demand planning, and staffing office.",
        "What historical demand patterns support the forecast? Which units and weeks are most exposed?",
        "Explore a planned seasonal nursing program with demand checkpoints rather than treating the forecast as a firm order.",
        "Forecast range, vulnerable unit-weeks, and agreed decision lead times.",
        "Build a low/base/high demand outline using aggregate, non-sensitive assumptions."],
      ["A seasonal headcount target may ignore leave, skill mix, and orientation capacity.",
        "Workforce analyst, unit managers, and nurse education.",
        "How much productive capacity remains after leave and education? Which units can orient additional nurses together?",
        "Compare core roster and internal float capacity with specialty-specific seasonal contract requirements.",
        "Projected productive hours by unit and the number of feasible orientation slots.",
        "Reconcile a unit-level capacity map before selecting contract volumes."],
      ["A single long assignment may not fit different peak windows across units.",
        "Nursing operations, scheduling lead, and staffing partner.",
        "Would staggered starts or different assignment lengths better fit the forecast? What continuity matters most?",
        "Evaluate staggered local or travel nursing contracts and an internal float component, subject to available qualified supply.",
        "Coverage plan matched to forecast windows and documented triggers for scaling up or down.",
        "Review two feasible seasonal designs with the operational sponsor."],
      ["Forecast uncertainty makes fixed commitments and cancellation exposure important buying considerations.",
        "Finance, procurement, and nursing sponsor.",
        "What spend envelope is acceptable under each demand case? What notice and cancellation provisions can the facility accept?",
        "Model assignment lengths, fully loaded rates, and change provisions without assuming contingent staffing reduces spend.",
        "Scenario budget ranges, approved commitment limits, and understood change terms.",
        "Align commercial guardrails and route a conditional seasonal scope for review."],
      ["A cohort of seasonal nurses needs coordinated readiness without overwhelming educators.",
        "Nurse educators, credentialing, and unit approvers.",
        "What licensing and facility checks apply? How many people can be oriented safely in each start window?",
        "Stage required credentialing, facility approvals, and unit orientation in cohorts sized to educator capacity.",
        "Approved readiness by start window and remaining onboarding dependencies.",
        "Agree cohort checkpoints and a fallback for delayed approvals or unavailable candidates."],
      ["Actual census may diverge from the forecast while assignments are underway.",
        "Staffing command lead, unit managers, and account contact.",
        "How often will demand be refreshed? Who may approve schedule or assignment changes within contract terms?",
        "Use a recurring roster and demand check-in to manage approved seasonal assignments and internal capacity together.",
        "Requested versus worked hours, overtime trend, and forecast variance by week.",
        "Set a weekly operational review and explicit escalation thresholds."],
      ["The next seasonal buying cycle will repeat assumptions unless this season is evaluated.",
        "Workforce planning, nursing leadership, and finance.",
        "Where did the forecast miss? Which start windows or skills should change next season?",
        "Compare seasonal contract use with internal float and recruitment investments for the next planning cycle.",
        "Actual versus budget spend, forecast accuracy, unused commitments, and manager feedback.",
        "Create a revised seasonal planning brief and agree when to reopen the next cycle."],
    ],
  },
  {
    id: "imaging", name: "Allied imaging capacity", tag: "Allied · modality coverage",
    description: "A fictional outpatient imaging center needs CT technologist coverage during a recruitment gap.",
    stages: [
      ["Uncovered CT sessions are constraining the planned imaging schedule during a vacancy.",
        "Imaging director, modality lead, and operations manager.",
        "Which CT sessions lack coverage? What is the effect on booked capacity and staff overtime?",
        "Explore temporary CT technologist coverage while permanent recruitment continues; do not assume immediate supply.",
        "Uncovered session-hours, overtime, and available appointment capacity at baseline.",
        "Confirm the modality, shift windows, and operational priorities in an aggregate brief."],
      ["General imaging experience alone may not match the center’s equipment and exam mix.",
        "CT lead technologist, education lead, and facility credentialing.",
        "Which equipment experience and role-specific credentials are required? What work is within the approved scope?",
        "Develop a CT-specific skills profile with equipment orientation and supervision expectations defined by the facility.",
        "Requirements completeness and unresolved equipment or scope questions.",
        "Have the modality lead approve the skills profile before requesting candidate options."],
      ["A partial-week vacancy may not justify the same model as a full-time recruitment bridge.",
        "Imaging director, scheduler, and recruiting lead.",
        "Is the gap recurring on certain days? How will a permanent hire’s timing affect the assignment?",
        "Compare local per-diem CT coverage with a fixed-term allied contract aligned to the recruitment bridge.",
        "Agreed coverage pattern, continuity expectations, and a transition trigger.",
        "Select a preferred assignment structure and confirm whether qualified supply can be explored."],
      ["The proposed rate alone does not capture equipment orientation or unused session exposure.",
        "Service-line finance, procurement, and imaging sponsor.",
        "Which orientation hours and premiums are billable? How will schedule changes and cancellation be handled?",
        "Compare fully loaded temporary CT costs with internal overtime and schedule-adjustment alternatives, not assumed revenue gains.",
        "Documented cost assumptions, approved spend cap, and accepted session commitments.",
        "Request itemized commercial terms and secure the service-line budget decision."],
      ["Modality-specific verification and facility sign-off may determine the feasible start window.",
        "Credentialing specialist, CT educator, and facility approver.",
        "Which licenses, registrations, and competencies require verification here? Who approves equipment readiness?",
        "Complete applicable licensing, credentialing, facility approval, and CT equipment orientation before placement.",
        "Facility-approved readiness status and outstanding modality-specific checks.",
        "Agree a readiness review; keep the start contingent on all required approvals."],
      ["A new technologist needs clarity on local protocols and escalation during the coverage period.",
        "CT supervisor, scheduling team, and staffing contact.",
        "Who supports protocol questions? How are scope concerns, absences, and schedule adjustments escalated?",
        "Support the approved CT assignment with local supervision, scheduled check-ins, and a clear staffing escalation route.",
        "Worked versus planned session-hours, orientation completion, and reported operational issues.",
        "Review the first coverage week with the CT supervisor and adjust support within approved scope."],
      ["The temporary bridge should adapt as permanent recruitment and modality demand change.",
        "Imaging leadership, talent acquisition, and finance.",
        "Has the vacancy timeline changed? Which sessions still need external support after a permanent start?",
        "Plan a coordinated handoff, a justified extension, or a narrower per-diem pattern based on observed need.",
        "Actual contingent spend, covered session-hours, overtime trend, and permanent-hire transition readiness.",
        "Agree an exit or extension decision and update the imaging workforce plan."],
    ],
  },
  {
    id: "rehab", name: "Allied rehab continuity", tag: "Allied · leave coverage",
    description: "A fictional rehabilitation network is planning physical therapist leave coverage across two sites.",
    stages: [
      ["Planned physical therapist leave could interrupt the network’s scheduled therapy capacity.",
        "Rehab director, site managers, and scheduling lead.",
        "Which sites and leave windows are affected? What service capacity must remain available?",
        "Explore planned temporary physical therapist coverage alongside internal cross-site capacity.",
        "Expected uncovered clinical hours and affected site-weeks, using aggregate figures.",
        "Agree the leave coverage window and site priorities without recording employee details."],
      ["Cross-site coverage depends on setting experience, travel time, and realistic supervision.",
        "Lead physical therapist, site operations, and rehab education.",
        "Which practice-setting skills are essential? How much travel and documentation time must the schedule allow?",
        "Define a physical therapy role profile and workable site allocation, including facility-specific scope and support.",
        "Validated productive hours, non-clinical time assumptions, and site-specific competency requirements.",
        "Validate a two-site capacity and skills map with the rehab lead."],
      ["Splitting one therapist across sites may undermine continuity or create impractical travel.",
        "Rehab sponsor, site schedulers, and staffing buyer.",
        "Would one consistent therapist or separate site coverage fit better? What handoff time is needed?",
        "Compare a fixed-term PT contract at one primary site with targeted local coverage for the second site.",
        "Agreed continuity approach, achievable travel assumptions, and confirmed handoff responsibilities.",
        "Review site-based options and select a feasible model to price, subject to supply."],
      ["A proposed therapy rate needs context for non-treatment time and multi-site expenses.",
        "Rehab finance partner, procurement, and service-line lead.",
        "Are documentation, orientation, mileage, and travel time included? Which hours are committed or cancellable?",
        "Build a transparent PT assignment budget with site allocation and fully loaded costs; do not promise productivity or reimbursement.",
        "Budget approval, explicit billable-hour assumptions, and accepted travel terms.",
        "Agree a written scope and compare like-for-like cost assumptions before authorization."],
      ["A therapist may be suitable clinically but not yet approved to work at both facilities.",
        "Credentialing, rehab educator, and each site’s approver.",
        "What licensing and site-specific approvals are required? Which orientation steps differ between sites?",
        "Complete applicable PT licensing verification, credentialing, facility approvals, and local orientation for each assigned site.",
        "Readiness checklist accepted at each site and remaining approval dependencies.",
        "Set site-level go/no-go reviews and defer any unapproved placement."],
      ["Site changes and handoffs can create gaps unless the temporary therapist’s schedule is coordinated.",
        "Rehab team leads, central scheduler, and staffing contact.",
        "Who coordinates schedule changes? How will workload, scope questions, and handoff concerns be surfaced?",
        "Support the approved PT assignment with coordinated site scheduling and routine operational check-ins.",
        "Planned versus worked hours by site, handoff completion, and workload concerns raised.",
        "Hold an early two-site check-in and confirm an escalation owner for each location."],
      ["Leave coverage needs a deliberate transition back to the core team, not an automatic extension.",
        "Rehab director, site leads, and finance.",
        "What capacity remains uncovered as leave ends? What overlap is needed for an orderly handoff?",
        "Plan assignment closeout or a narrowly scoped extension with the facility; feed lessons into future leave planning.",
        "Actual spend, site coverage versus plan, transition completion, and team feedback.",
        "Confirm a handoff and end-date decision, then capture improvements for the next leave cycle."],
    ],
  },
];

function staffingComparison(values) {
  const limits = [1000, 104, 1000, 1000];
  if (values.length !== 4 || values.some((value, index) =>
    String(value).trim() === "" || !Number.isFinite(Number(value)) ||
    Number(value) < 0 || Number(value) > limits[index])) return null;
  const [hours, weeks, overtime, contingent] = values.map(Number);
  const weeklyInternal = hours * overtime;
  const weeklyContingent = hours * contingent;
  return {
    weeklyInternal, weeklyContingent, weeklyDifference: weeklyContingent - weeklyInternal,
    totalInternal: weeklyInternal * weeks, totalContingent: weeklyContingent * weeks,
    totalDifference: (weeklyContingent - weeklyInternal) * weeks,
  };
}

function staffingMoney(value, signed = false) {
  const rounded = Math.round((Math.abs(value) + Number.EPSILON) * 100) / 100;
  const sign = signed && rounded !== 0 ? (value > 0 ? "+" : "−") : "";
  return sign + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(rounded);
}

function staffingComparisonText(result) {
  if (!result) return "Enter all four values within the labeled ranges; use finite, non-negative numbers.";
  const relation = Math.round(Math.abs(result.weeklyDifference) * 100) === 0 ? "equal cost at displayed precision" :
    result.weeklyDifference > 0 ? "higher contingent cost" : "lower contingent cost";
  return `Weekly: internal overtime ${staffingMoney(result.weeklyInternal)} · contingent ${staffingMoney(result.weeklyContingent)} · difference ${staffingMoney(result.weeklyDifference, true)} (${relation}).\n` +
    `Full period: internal overtime ${staffingMoney(result.totalInternal)} · contingent ${staffingMoney(result.totalContingent)} · difference ${staffingMoney(result.totalDifference, true)}.`;
}

const staffingElement = (id) => document.getElementById(id);
let staffingScenarioIndex = 0;
let staffingStageIndex = 0;
const staffingNotes = staffingScenarios.map(() => Array(staffingStages.length).fill(""));
const staffingActions = staffingScenarios.map(() => "");
const staffingScenarioButtons = [];
const staffingStageButtons = [];
const staffingCostIds = ["staffingHours", "staffingWeeks", "staffingOvertime", "staffingContingent"];
const staffingText = (tag, text, parent) => {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.appendChild(element);
  return element;
};

function renderStaffingSummary() {
  const root = staffingElement("staffingSummaryContent");
  root.replaceChildren();
  const scenario = staffingScenarios[staffingScenarioIndex];
  staffingText("h2", "Nursing & allied staffing — conversation summary", root);
  staffingText("p", "Fictional, non-sensitive sales discussion. Session-only entries; refreshing loses notes. Printed copies are separate records under your control.", root);
  staffingText("h3", `Selected scenario: ${scenario.name}`, root);
  staffingText("p", scenario.description, root);
  staffingText("p", `Current stage: ${staffingStages[staffingStageIndex]}`, root);
  staffingText("p", `Suggested next step: ${scenario.stages[staffingStageIndex][5]}`, root);
  staffingText("p", `Selected scenario action plan: ${staffingActions[staffingScenarioIndex] || "Not entered."}`, root);
  let count = 0;
  staffingScenarios.forEach((item, scenarioIndex) => {
    const hasNotes = staffingNotes[scenarioIndex].some((note) => note.trim());
    if (!hasNotes && !staffingActions[scenarioIndex].trim()) return;
    count++;
    staffingText("h3", item.name, root);
    if (staffingActions[scenarioIndex].trim()) staffingText("p", `Action plan: ${staffingActions[scenarioIndex]}`, root);
    staffingNotes[scenarioIndex].forEach((note, stageIndex) => {
      if (!note.trim()) return;
      staffingText("h4", staffingStages[stageIndex], root);
      staffingText("p", note, root);
    });
  });
  if (!count) staffingText("p", "No notes or action plans entered.", root);
  staffingText("h3", "Optional illustrative cost comparison", root);
  const values = staffingCostIds.map((id) => staffingElement(id).value);
  const result = staffingComparison(values);
  if (result) staffingText("p", `Assumptions: ${values[0]} hours/week × ${values[1]} weeks; internal overtime ${staffingMoney(Number(values[2]))}/hour; contingent ${staffingMoney(Number(values[3]))}/hour (fully loaded, USD).`, root);
  staffingText("p", result ? staffingComparisonText(result) : "No complete valid comparison entered.", root);
  staffingText("p", "Illustrative only, not a quote or ROI guarantee. Contingent staffing is not always a savings option. Confirm all cost inclusions separately. Licensing, credentialing, and facility approval are required before placement. Availability, scope, timing, and terms vary; no fill, compliance, or outcome guarantees.", root);
}

function renderStaffing() {
  const scenario = staffingScenarios[staffingScenarioIndex];
  const stage = scenario.stages[staffingStageIndex];
  staffingScenarioButtons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === staffingScenarioIndex)));
  staffingStageButtons.forEach((button, index) => {
    button.setAttribute("aria-pressed", String(index === staffingStageIndex));
    if (index === staffingStageIndex) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  staffingElement("staffingContext").textContent = scenario.name;
  staffingElement("staffingStageTitle").textContent = staffingStages[staffingStageIndex];
  staffingElement("staffingProgress").textContent = `${scenario.name} · ${staffingStageIndex + 1} of ${staffingStages.length}`;
  ["staffingPain", "staffingStakeholders", "staffingQuestions", "staffingSolution", "staffingMeasures", "staffingSuggested"]
    .forEach((id, index) => { staffingElement(id).textContent = stage[index]; });
  staffingElement("staffingNotes").value = staffingNotes[staffingScenarioIndex][staffingStageIndex];
  staffingElement("staffingNotesLabel").textContent = `Stage notes · ${scenario.name} · ${staffingStages[staffingStageIndex]}`;
  staffingElement("staffingAction").value = staffingActions[staffingScenarioIndex];
  staffingElement("staffingActionLabel").textContent = `Action plan · ${scenario.name}`;
  staffingElement("staffingBack").disabled = staffingStageIndex === 0;
  staffingElement("staffingNext").disabled = staffingStageIndex === staffingStages.length - 1;
  renderStaffingSummary();
}

staffingScenarios.forEach((scenario, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "scenario-card";
  staffingText("span", scenario.tag, button).className = "staffing-scenario-tag";
  staffingText("span", scenario.name, button).className = "staffing-scenario-title";
  staffingText("span", scenario.description, button).className = "staffing-scenario-copy";
  button.addEventListener("click", () => {
    staffingScenarioIndex = index;
    staffingStageIndex = 0;
    renderStaffing();
  });
  staffingElement("staffingScenarios").appendChild(button);
  staffingScenarioButtons.push(button);
});
staffingStages.forEach((stage, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = `${index + 1}. ${stage}`;
  button.addEventListener("click", () => { staffingStageIndex = index; renderStaffing(); });
  staffingElement("staffingTimeline").appendChild(button);
  staffingStageButtons.push(button);
});
staffingElement("staffingBack").addEventListener("click", () => {
  staffingStageIndex = Math.max(0, staffingStageIndex - 1); renderStaffing();
});
staffingElement("staffingNext").addEventListener("click", () => {
  staffingStageIndex = Math.min(staffingStages.length - 1, staffingStageIndex + 1); renderStaffing();
});
staffingElement("staffingRestart").addEventListener("click", () => { staffingStageIndex = 0; renderStaffing(); });
staffingElement("staffingNotes").addEventListener("input", (event) => {
  staffingNotes[staffingScenarioIndex][staffingStageIndex] = event.target.value;
  renderStaffingSummary();
});
staffingElement("staffingAction").addEventListener("input", (event) => {
  staffingActions[staffingScenarioIndex] = event.target.value;
  renderStaffingSummary();
});
staffingElement("staffingPresentation").addEventListener("click", () => {
  const enabled = document.body.classList.toggle("staffing-compact");
  staffingElement("staffingPresentation").setAttribute("aria-pressed", String(enabled));
});
staffingElement("staffingCostForm").addEventListener("submit", (event) => event.preventDefault());
staffingCostIds.forEach((id) => staffingElement(id).addEventListener("input", () => {
  staffingElement("staffingCostResult").textContent = staffingComparisonText(staffingComparison(staffingCostIds.map((key) => staffingElement(key).value)));
  renderStaffingSummary();
}));
let staffingSummaryWasOpen = false;
function prepareStaffingPrint() {
  staffingSummaryWasOpen = staffingElement("staffingSummary").open;
  renderStaffingSummary();
  staffingElement("staffingSummary").open = true;
}
window.addEventListener("beforeprint", prepareStaffingPrint);
window.addEventListener("afterprint", () => { staffingElement("staffingSummary").open = staffingSummaryWasOpen; });
staffingElement("staffingPrint").addEventListener("click", () => { renderStaffingSummary(); window.print(); });
staffingElement("staffingCostResult").textContent = staffingComparisonText(null);
renderStaffing();
