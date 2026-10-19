const personas = [
  {
    id: "span",
    name: "Maria",
    age: 62,
    language: "Spanish",
    situation: "Managing diabetes and hypertension",
    style: "linear-gradient(135deg,#4fa3dc,#7dc8f3)",
    opening: "\"I understand my care better when information is in Spanish and someone can answer questions in real time.\"",
  },
  {
    id: "som",
    name: "Abdi",
    age: 29,
    language: "Somali",
    situation: "Pregnancy progressing from prenatal visits to inpatient maternity care",
    style: "linear-gradient(135deg,#5bbf88,#87dca9)",
    opening: "\"I’m pregnant and want Somali-language support as I prepare for care, move from prenatal visits into an inpatient stay, and plan follow-up.\"",
  },
  {
    id: "tele",
    name: "Tran",
    age: 41,
    language: "Vietnamese",
    situation: "Post-op follow-up via telehealth",
    style: "linear-gradient(135deg,#5c6fd6,#8a9af2)",
    opening: "\"Virtual visits are easier for me, but only if language support is immediate and clear.\"",
  },
  {
    id: "joanna",
    name: "Joanna",
    age: 33,
    language: "ASL",
    situation: "Emergency department visit requiring immediate communication",
    style: "linear-gradient(135deg,#7b5ad5,#a082f0)",
    opening: "\"In urgent moments, I need communication that is direct, visual, and immediate.\"",
  },
];

const stages = [
  {
    phase: "Pre-Visit",
    title: "Awareness & Access to Care",
    preferredConnections: { span: ["patient-line"], som: ["patient-line"], tele: ["patient-line"], joanna: ["website"] },
    icon: "🌐",
    patient: {
      span: "Maria finds Essentia online and needs Spanish language support to understand services and decide where to start care.",
      som: "Abdi learns about prenatal maternity care through community outreach and asks questions in Somali with a qualified interpreter.",
      tele: "Tran receives discharge guidance and is offered telehealth follow-up options in Vietnamese.",
      joanna: "Joanna seeks urgent care and needs clear ASL access information before arrival.",
    },
    behind: [
      "Patient discovers care options and contact channels.",
      "Essentia receives inquiries through digital and phone channels.",
      "Language preference is captured early to shape next steps.",
    ],
    who: ["Patient / family", "Front-end access staff", "Call center", "Digital team"],
    outcomes: [
      "Patient feels welcomed at first touchpoint.",
      "Care entry starts with fewer delays and less confusion.",
      "Essentia captures demand signals by language and modality.",
    ],
    connections: [
      { id: "website", personas: ["joanna"], description: "Joanna uses the website to find care options and qualified ASL interpreter access information before arrival; staff confirm availability through local workflows." },
      { id: "patient-line", description: "Patients contact access staff about care options through a configured spoken-language phone workflow.", asl: null },
      { id: "vri-opi", description: "Access staff involve a qualified interpreter for spoken-language questions about starting care.", asl: "Access staff arrange qualified ASL interpretation by VRI through a configured accessible video workflow to discuss care entry." },
      { id: "jaide", description: "Staff prepare approved written, nonclinical service information for patients; AI translation is not medical interpretation.", asl: null },
      { id: "in-person", personas: ["joanna"], description: "Access staff plan qualified in-person ASL interpreter support for arrival when video access is unsuitable, subject to local staffing workflows." },
    ],
    impact: "Early language alignment improves access and reduces abandonment before care begins.",
  },
  {
    phase: "Pre-Visit",
    title: "Appointment Confirmation & Pre-Visit",
    preferredConnections: { span: ["patient-line"], som: ["in-person"], tele: ["teladoc"], joanna: ["in-person"] },
    icon: "🗓️",
    patient: {
      span: "Maria schedules a visit and receives prep instructions in Spanish so she can arrive ready.",
      som: "Abdi receives prenatal visit reminders and preparation information, with a qualified Somali interpreter available for questions.",
      tele: "Tran confirms his telehealth appointment and receives bilingual technical instructions.",
      joanna: "Joanna’s appointment flag indicates ASL support is required at check-in.",
    },
    behind: [
      "Appointments are created with language and modality needs attached.",
      "Reminders and prep instructions are sent through preferred channels.",
      "Interpreter demand is forecasted ahead of the visit.",
    ],
    who: ["Scheduling", "Patient access", "Interpreter operations", "Patient"],
    outcomes: [
      "Patient arrives informed and prepared.",
      "Interpreter resources are better aligned to expected demand.",
      "Reduced no-shows and day-of surprises.",
    ],
    connections: [
      { id: "in-person", description: "Scheduling staff request a qualified in-person interpreter and confirm visit time, location and communication preferences.", asl: "Scheduling staff request a qualified in-person ASL interpreter and confirm visual communication preferences." },
      { id: "epic", description: "Staff use the configured Epic workflow to record language and interpreter needs for appointment preparation; this demo does not synchronize records." },
      { id: "patient-line", description: "Patients use the configured spoken-language phone workflow to confirm appointment details and ask preparation questions with staff.", asl: null },
      { id: "jaide", description: "Staff prepare translated prep content for approval; written clinical materials require appropriate qualified review before patient use.", asl: null },
      { id: "teladoc", personas: ["tele"], description: "For Tran’s virtual visit, staff plan qualified interpreter participation and check the configured Teladoc joining workflow before the appointment." },
    ],
    impact: "Preparation with language support improves readiness and operational predictability.",
  },
  {
    phase: "During Visit",
    title: "Arrival & Check-In",
    preferredConnections: { span: ["vri-opi"], som: ["in-person"], tele: ["teladoc"], joanna: ["vri-opi", "in-person"] },
    icon: "🏥",
    patient: {
      span: "Maria checks in and confirms she will have Spanish interpretation before triage begins.",
      som: "Abdi arrives for a prenatal visit and asks registration to connect a qualified Somali interpreter.",
      tele: "Tran arrives for any needed in-person follow-up and needs quick Vietnamese support.",
      joanna: "Joanna needs immediate ASL-enabled communication during intake.",
    },
    behind: [
      "Registration verifies identity, visit purpose, and communication preferences.",
      "Interpreter request is initiated based on language and urgency.",
      "Staff prepare the encounter to avoid delays in care start.",
    ],
    who: ["Front desk", "Nursing intake", "Interpreter operations", "Patient"],
    outcomes: [
      "Patient starts encounter with clear communication.",
      "Staff avoid ad hoc workarounds.",
      "Check-in throughput improves.",
    ],
    connections: [
      { id: "vri-opi", description: "Registration staff request qualified video or phone interpretation to confirm check-in details.", asl: "Registration staff request qualified ASL interpretation by VRI, checking sightlines and video readiness rather than using audio-only OPI." },
      { id: "mobile", description: "Staff bring a configured mobile device to registration so the patient can join a qualified interpreter during intake.", asl: "Staff check that the mobile device has a configured accessible video workflow for a qualified ASL interpreter, with clear sightlines." },
      { id: "epic", description: "Registration staff verify communication preferences in the configured Epic intake workflow before handing off to the care team." },
      { id: "in-person", description: "Staff confirm arrival of the scheduled qualified in-person interpreter or arrange an appropriate backup.", asl: "Staff confirm the scheduled qualified in-person ASL interpreter or arrange a qualified visual backup for urgent intake." },
      { id: "teladoc", personas: ["tele"], description: "For Tran’s virtual check-in, registration staff confirm qualified interpreter access through the configured Teladoc workflow before the encounter." },
    ],
    impact: "Reliable language support at arrival prevents downstream delays.",
  },
  {
    phase: "During Visit",
    title: "Clinical Encounter",
    preferredConnections: { span: ["vri-opi"], som: ["in-person"], tele: ["teladoc"], joanna: ["vri-opi", "in-person"] },
    icon: "🩺",
    patient: {
      span: "Maria discusses symptoms, treatment options, and medication changes in Spanish with confidence.",
      som: "Abdi takes part in a prenatal assessment and discusses questions with the care team in Somali through a qualified interpreter.",
      tele: "Tran completes telehealth follow-up with Vietnamese interpretation during provider discussion.",
      joanna: "Joanna communicates directly with clinicians through ASL interpretation during urgent decision-making.",
    },
    behind: [
      "Interpreter joins the clinical conversation in the chosen modality.",
      "Clinical team completes assessment and care planning.",
      "Clarifications are handled in real time to preserve safety.",
    ],
    who: ["Provider", "Nurse", "Interpreter", "Patient"],
    outcomes: [
      "Patient comprehension and trust increase.",
      "Clinical decisions are made with fewer communication gaps.",
      "Care plans are more accurately understood.",
    ],
    connections: [
      { id: "vri-opi", description: "Clinicians use a qualified interpreter by video or phone for assessment, treatment discussions and patient questions.", asl: "Clinicians use a qualified ASL interpreter by VRI with clear video and sightlines for assessment and clinical decisions; audio-only OPI is not ASL interpretation." },
      { id: "in-person", description: "A scheduled qualified in-person interpreter supports complex discussions, consent and shared decisions with the clinical team.", asl: "A qualified in-person ASL interpreter supports urgent decisions and consent with appropriate positioning and pacing." },
      { id: "epic", description: "Clinicians document interpreter participation through the configured Epic encounter workflow; no automatic data transfer is demonstrated." },
      { id: "mobile", description: "Staff position a configured mobile device for the patient, clinician and qualified remote interpreter during the encounter.", asl: "Staff position a mobile device only with a configured accessible video workflow and qualified ASL interpreter; the device alone does not provide ASL access." },
      { id: "teladoc", personas: ["tele"], description: "Tran and the clinician include a qualified interpreter in the virtual follow-up using the configured Teladoc workflow." },
    ],
    impact: "High-quality interpreted encounters support safer, better-informed care decisions.",
  },
  {
    phase: "During Visit",
    title: "Treatment / Inpatient Stay",
    preferredConnections: { span: ["smart-tv", "vri-opi", "epic"], som: ["smart-tv", "epic"], tele: ["mobile", "vri-opi", "in-person", "epic"], joanna: ["vri-opi", "in-person", "epic"] },
    icon: "💊",
    patient: {
      span: "Maria receives inpatient updates and medication education in Spanish over multiple touchpoints.",
      som: "Abdi’s journey moves from prenatal visits to inpatient maternity care, where a qualified Somali interpreter supports admission, care-team conversations, and updates throughout the stay.",
      tele: "Tran has medication and recovery coaching that may alternate between in-person and virtual support.",
      joanna: "Joanna requires continued ASL communication support as care transitions across units.",
    },
    behind: [
      "Care teams hand off information through shifts and units.",
      "Interpreter support is reused across repeated interactions.",
      "Education and consent moments are reinforced over time.",
    ],
    who: ["Inpatient clinicians", "Interpreter services", "Care coordinators", "Patient/family"],
    outcomes: [
      "Reduced miscommunication during transitions.",
      "Improved adherence to treatment plans.",
      "Better patient confidence across longer stays.",
    ],
    connections: [
      { id: "smart-tv", description: "Where configured, staff use a bedside Smart TV workflow to connect the patient with a qualified video interpreter for inpatient updates.", asl: "Use a bedside Smart TV only where a configured accessible video workflow supports a qualified ASL interpreter and suitable sightlines; a TV alone does not provide ASL access." },
      { id: "mobile", description: "Care teams bring a configured mobile device with qualified interpreter access to bedside education and shift handoffs.", asl: "Care teams bring a mobile device with a configured accessible video workflow and qualified ASL interpreter to bedside updates, checking visual access at each handoff." },
      { id: "vri-opi", description: "Nurses request qualified video or phone interpretation for repeated treatment updates and medication education.", asl: "Nurses request qualified ASL interpretation by VRI for treatment updates and medication education, maintaining visual access across shifts." },
      { id: "in-person", description: "Staff schedule a qualified in-person interpreter for planned care conferences and complex inpatient discussions.", asl: "Staff schedule a qualified in-person ASL interpreter for care conferences and complex discussions across units." },
      { id: "epic", description: "Care teams use the configured Epic workflow to document communication preferences and interpreter needs for the next shift." },
    ],
    impact: "Sustained language support improves continuity and treatment adherence.",
  },
  {
    phase: "Post-Visit",
    title: "Discharge & Transition of Care",
    preferredConnections: { span: ["jaide"], som: ["jaide"], tele: ["jaide"], joanna: ["vri-opi", "jaide"] },
    icon: "📄",
    patient: {
      span: "Maria reviews discharge instructions and medication plans in Spanish before going home.",
      som: "When leaving inpatient maternity care, Abdi reviews postpartum and follow-up information in Somali with a qualified interpreter.",
      tele: "Tran gets recovery instructions and telehealth follow-up details in Vietnamese.",
      joanna: "Joanna reviews discharge and follow-up steps with ASL support to ensure clarity.",
    },
    behind: [
      "Discharge documentation and education are delivered with language support.",
      "Patient understanding is validated before transition.",
      "Follow-up communication paths are set.",
    ],
    who: ["Discharge nurse", "Care coordinator", "Interpreter", "Patient/family"],
    outcomes: [
      "Patient leaves with clearer understanding.",
      "Lower risk of avoidable complications.",
      "Stronger transition into home or next-care setting.",
    ],
    connections: [
      { id: "vri-opi", description: "Discharge staff use a qualified video or phone interpreter to review instructions, medication plans and patient teach-back.", asl: "Discharge staff use qualified ASL interpretation by VRI to review instructions and visual teach-back, not an audio-only call." },
      { id: "in-person", description: "Where appropriate, staff arrange a qualified in-person interpreter for complex discharge education with the patient and caregivers.", asl: "Staff arrange a qualified in-person ASL interpreter where appropriate for discharge education and follow-up planning." },
      { id: "epic", description: "Staff document interpreted discharge education and follow-up communication needs through the configured Epic discharge workflow." },
      { id: "jaide", description: "Staff may draft translated written discharge instructions for appropriate qualified review and approval before use; AI does not replace a qualified interpreter for clinical decisions or consent.", asl: "Staff may prepare written discharge materials for appropriate qualified review alongside qualified ASL interpretation; Jaide AI Translation and Live Speech do not provide ASL interpretation or replace a qualified interpreter for clinical decisions or consent." },
      { id: "patient-line", description: "Staff explain the configured spoken-language Patient Line workflow for contacting the care team with questions after discharge.", asl: null },
    ],
    impact: "Effective interpreted discharge improves safety and continuity after leaving care.",
  },
  {
    phase: "Post-Visit",
    title: "Post Visit & Ongoing Care",
    preferredConnections: { span: ["patient-line"], som: ["patient-line"], tele: ["patient-line", "teladoc"], joanna: ["vri-opi", "mobile", "in-person"] },
    icon: "🔄",
    patient: {
      span: "Maria receives follow-up outreach, answers medication questions, and stays connected through portal messaging in Spanish.",
      som: "After discharge, Abdi receives postpartum follow-up information and ongoing education in Somali with qualified interpreter support.",
      tele: "Tran completes virtual check-ins and receives ongoing Vietnamese support for recovery.",
      joanna: "Joanna continues care coordination and follow-up communication with ASL-accessible pathways.",
    },
    behind: [
      "Follow-up calls, messages, and education continue after discharge.",
      "Billing and patient feedback interactions occur.",
      "Performance data informs continuous improvement.",
    ],
    who: ["Care management", "Patient experience", "Revenue cycle", "Interpreter quality teams"],
    outcomes: [
      "Higher follow-up completion and trust.",
      "Improved patient-reported experience.",
      "Data-driven optimization of language access operations.",
    ],
    connections: [
      { id: "patient-line", description: "Patients reconnect with staff through the configured spoken-language phone workflow for follow-up coordination and questions.", asl: null },
      { id: "teladoc", personas: ["tele"], description: "Staff plan qualified interpreter participation for Tran’s ongoing virtual check-ins through the configured Teladoc follow-up workflow." },
      { id: "vri-opi", description: "Care managers involve a qualified video or phone interpreter when discussing recovery questions and next steps.", asl: "Care managers arrange qualified ASL interpretation by VRI for ongoing care discussions through a configured accessible video workflow." },
      { id: "mobile", description: "For follow-up, staff check the configured mobile access workflow with the patient before arranging a qualified remote interpreter.", asl: "For follow-up, staff check a configured accessible mobile video workflow with Joanna before arranging a qualified ASL interpreter; mobile access alone is not ASL interpretation." },
      { id: "epic", description: "Care coordinators use the configured Epic follow-up workflow to document communication needs and interpreted outreach." },
      { id: "jaide", description: "Staff prepare appropriate translated written follow-up messages for approval; clinical content requires appropriate qualified review, and clinical questions go to the care team with a qualified interpreter.", asl: null },
      { id: "in-person", personas: ["joanna"], description: "Care coordinators arrange a qualified in-person ASL interpreter for ongoing appointments and follow-up questions, subject to local scheduling and availability." },
    ],
    impact: "Ongoing interpreted engagement strengthens outcomes, loyalty, and operational learning.",
  },
];

const solutionCatalog = {
  "vri-opi": "VRI/OPI",
  "in-person": "In-person Interpreter using Interpreter Scheduling tool",
  jaide: "Jaide AI Translation and Live Speech",
  teladoc: "Telehealth integration with Teladoc",
  epic: "Epic integration",
  "patient-line": "Patient Line",
  mobile: "Mobile Device Access",
  "smart-tv": "Smart TV integration",
  website: "Website",
};

function connectionsFor(stage, personaKey) {
  return stage.connections
    .filter((connection) => (!connection.personas || connection.personas.includes(personaKey))
      && !(personaKey === "joanna" && connection.asl === null))
    .map((connection) => ({
      id: connection.id,
      label: solutionCatalog[connection.id],
      description: personaKey === "joanna" && connection.asl ? connection.asl : connection.description,
      preferred: stage.preferredConnections?.[personaKey]?.includes(connection.id) ?? false,
    }));
}

const scenarioGrid = document.getElementById("scenarioGrid");
const nodesWrap = document.getElementById("nodes");
const trackFill = document.getElementById("trackFill");
const avatar = document.getElementById("avatar");
const stagePhase = document.getElementById("stagePhase");
const stageTitle = document.getElementById("stageTitle");
const stageIcon = document.getElementById("stageIcon");
const stageCounter = document.getElementById("stageCounter");
const patientMoment = document.getElementById("patientMoment");
const behindList = document.getElementById("behindList");
const whoList = document.getElementById("whoList");
const outcomeList = document.getElementById("outcomeList");
const connectionGrid = document.getElementById("connectionGrid");
const impactText = document.getElementById("impactText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");
const presentationMode = document.getElementById("presentationMode");
const body = document.body;

let pIndex = 0;
let sIndex = 0;
let auto = null;
function make(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text) el.textContent = text;
  return el;
}

function populateScenarioCards() {
  personas.forEach((p, i) => {
    const card = make("button", "scenario-card");
    card.type = "button";
    card.style.setProperty("--chip", p.style);
    card.innerHTML = `
      <div class="avatar-dot" aria-hidden="true"></div>
      <h3>${p.name}, ${p.age}</h3>
      <p><strong>Primary communication:</strong> ${p.language}</p>
      <p>${p.situation}</p>
    `;
    card.addEventListener("click", () => {
      pIndex = i;
      sIndex = 0;
      setScenarioActive();
      render();
      stopAuto();
    });
    scenarioGrid.appendChild(card);
  });
  setScenarioActive();
}

function setScenarioActive() {
  document.getElementById("scenarioName").textContent = `${personas[pIndex].name} · ${personas[pIndex].language}`;
  [...scenarioGrid.children].forEach((card, i) => {
    card.classList.toggle("active", i === pIndex);
    card.setAttribute("aria-pressed", String(i === pIndex));
  });
}

function buildNodes() {
  stages.forEach((s, i) => {
    const stop = make("div", "journey-stop");
    const node = make("button", "node");
    node.type = "button";
    node.setAttribute("aria-label", s.title);
    node.innerHTML = `<span>${s.title}</span>`;
    node.addEventListener("click", () => {
      sIndex = i;
      render();
      stopAuto();
    });
    stop.appendChild(node);
    nodesWrap.appendChild(stop);
  });
}

function fillList(el, items) {
  el.innerHTML = "";
  items.forEach((item) => {
    const li = make("li", "", item);
    el.appendChild(li);
  });
}

function renderConnections(stage, personaKey) {
  connectionGrid.innerHTML = "";
  document.getElementById("connectionContext").textContent = `${personas[pIndex].name} · ${stage.title}`;
  connectionsFor(stage, personaKey).forEach((item) => {
    const card = make("article", item.preferred ? "connection-card connection-preferred" : "connection-card");
    card.dataset.solutionId = item.id;
    card.appendChild(make("h3", "", item.label));
    if (item.preferred) {
      card.appendChild(make("span", "connection-badge", personas[pIndex].name));
    }
    card.appendChild(make("p", "", item.description));
    connectionGrid.appendChild(card);
  });
}

function renderTimeline() {
  const pct = (sIndex / (stages.length - 1)) * 100;
  trackFill.style.width = `${pct}%`;
  avatar.style.left = `${((sIndex + 0.5) / stages.length) * 100}%`;
  [...nodesWrap.children].forEach((stop, i) => {
    const n = stop.children[0];
    n.classList.toggle("active", i <= sIndex);
    n.classList.toggle("current", i === sIndex);
    n.setAttribute("aria-current", i === sIndex ? "step" : "false");
  });
}

function render() {
  const persona = personas[pIndex];
  const stage = stages[sIndex];

  stagePhase.textContent = stage.phase;
  stageTitle.textContent = stage.title;
  stageIcon.textContent = stage.icon;
  stageCounter.textContent = `Step ${sIndex + 1} of ${stages.length}`;

  patientMoment.textContent = stage.patient[persona.id];

  fillList(behindList, stage.behind);
  fillList(whoList, stage.who);
  fillList(outcomeList, stage.outcomes);

  renderConnections(stage, persona.id);

  impactText.textContent = stage.impact;

  renderTimeline();
  prevBtn.disabled = sIndex === 0;
  nextBtn.disabled = sIndex === stages.length - 1;
}

function next() {
  if (sIndex < stages.length - 1) {
    sIndex += 1;
  } else {
    sIndex = 0;
  }
  render();
}

function prev() {
  if (sIndex > 0) sIndex -= 1;
  render();
}

function toggleAuto() {
  if (auto) {
    stopAuto();
  } else {
    playBtn.textContent = "❚❚ Pause";
    auto = setInterval(next, 3500);
  }
}

function stopAuto() {
  if (auto) {
    clearInterval(auto);
    auto = null;
    playBtn.textContent = "▶ Auto-play";
  }
}

prevBtn.addEventListener("click", () => {
  prev();
  stopAuto();
});
nextBtn.addEventListener("click", () => {
  next();
  stopAuto();
});
playBtn.addEventListener("click", toggleAuto);
resetBtn.addEventListener("click", () => {
  pIndex = 0;
  sIndex = 0;
  setScenarioActive();
  render();
  stopAuto();
});
presentationMode.addEventListener("change", () => {
  body.classList.toggle("presentation-mode", presentationMode.checked);
  document.getElementById("scenarioPicker").open = !presentationMode.checked;
  document.getElementById("touchpointDetails").open = !presentationMode.checked;
});
populateScenarioCards();
buildNodes();
render();
