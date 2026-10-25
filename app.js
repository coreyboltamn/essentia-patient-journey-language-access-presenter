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
      { id: "website", personas: ["joanna"], description: "Joanna uses the website to find care options and qualified ASL interpreter access information before arrival; staff confirm availability and next steps." },
      { id: "patient-line", description: "Patients contact access staff about care options through a configured spoken-language phone workflow.", asl: null,
        descriptionByPersona: { span: "Patient action: Maria calls to ask where to start care in Spanish.\nEssentia action: Access staff explain options through the configured Patient Line workflow and identify interpreter needs." } },
      { id: "vri-opi", description: "Access staff involve a qualified interpreter for spoken-language questions about starting care.", asl: "Access staff arrange qualified ASL interpretation by VRI/OPI as appropriate for pre-arrival communication.",
        descriptionByPersona: { span: "Patient action: Maria asks questions about starting care in Spanish.\nEssentia action: Access staff connect a qualified video or phone interpreter." } },
      { id: "jaide", description: "Staff prepare approved written, nonclinical service information for patients; AI translation is not medical interpretation.", asl: null,
        descriptionByPersona: { span: "Patient action: Maria reads service information in Spanish.\nEssentia action: Staff provide approved nonclinical translations; AI is not medical interpretation." } },
      { id: "in-person", personas: ["joanna"], description: "Access staff plan qualified in-person ASL interpreter support for arrival when video access is unsuitable, subject to local staffing workflows." },
    ],
    impact: "Early language alignment improves access and reduces abandonment before care begins.",
  },
  {
    phase: "Pre-Visit",
    title: "Appointment Confirmation & Pre-Visit",
    preferredConnections: { span: ["jaide"], som: ["in-person"], tele: ["teladoc"], joanna: ["in-person"] },
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
      { id: "in-person", description: "Scheduling staff request a qualified in-person interpreter and confirm visit time, location and communication preferences.", asl: "Scheduling staff request a qualified in-person ASL interpreter and verify communication accommodations for check-in.",
        descriptionByPersona: { span: "Patient action: Maria shares her visit time and Spanish interpreter needs.\nEssentia action: Scheduling staff request a qualified in-person interpreter and confirm details." } },
      { id: "epic", description: "Staff use the configured EPIC workflow to record language and interpreter needs for appointment preparation; this demo does not synchronize records.",
        descriptionByPersona: { span: "Patient action: Maria shares her language and interpreter preferences.\nEssentia action: Staff record needs in the configured EPIC workflow; this demo does not sync records." } },
      { id: "patient-line", description: "Patients use the configured spoken-language phone workflow to confirm appointment details and ask preparation questions with staff.", asl: null,
        descriptionByPersona: { span: "Patient action: Maria calls to confirm her visit and ask prep questions in Spanish.\nEssentia action: Staff review details through the configured Patient Line workflow." } },
      { id: "jaide", description: "Staff prepare translated prep content for approval; written clinical materials require appropriate qualified review before patient use.", asl: null,
        descriptionByPersona: { span: "Patient action: Maria reads Spanish prep instructions and notes questions.\nEssentia action: Staff provide translated materials after approval and appropriate review." } },
      { id: "teladoc", personas: ["tele"], description: "For Tran’s virtual visit, staff plan qualified interpreter participation and check the configured telehealth workflow for joining before appointment time." },
    ],
    impact: "Preparation with language support improves readiness and operational predictability.",
  },
  {
    phase: "During Visit",
    title: "Arrival & Check-In",
    preferredConnections: { span: ["jaide-live-speech", "vri-opi"], som: ["in-person"], tele: ["teladoc"], joanna: ["vri-opi", "in-person"] },
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
      { id: "vri-opi", description: "Registration staff request qualified video or phone interpretation to confirm check-in details.", asl: "Registration staff request qualified ASL interpretation to confirm check-in details.",
        descriptionByPersona: { span: "Patient action: Maria confirms check-in details in Spanish.\nEssentia action: Registration staff connect a qualified video or phone interpreter before intake." } },
      { id: "mobile", description: "Staff bring a configured mobile device to registration so the patient can join a qualified interpreter during intake.", asl: "Staff check that the mobile device supports ASL interpreter visibility and room setup before intake.",
        descriptionByPersona: { span: "Patient action: Maria joins a qualified Spanish interpreter on a mobile device for intake.\nEssentia action: Staff bring the configured device and check the connection." } },
      { id: "epic", description: "Registration staff verify communication preferences in the configured EPIC intake workflow before handing off to the care team.",
        descriptionByPersona: { span: "Patient action: Maria confirms her Spanish communication preferences at check-in.\nEssentia action: Registration staff verify needs in the configured EPIC workflow." } },
      { id: "in-person", description: "Staff confirm arrival of the scheduled qualified in-person interpreter or arrange an appropriate backup.", asl: "Staff confirm the scheduled qualified in-person ASL interpreter has arrived or arrange a backup.",
        descriptionByPersona: { span: "Patient action: Maria meets her Spanish interpreter before triage.\nEssentia action: Staff confirm the qualified in-person interpreter has arrived or arrange backup." } },
      { id: "teladoc", personas: ["tele"], description: "For Tran’s virtual check-in, registration staff confirm qualified interpreter access through the configured telehealth workflow before the encounter starts." },
      { id: "jaide-live-speech", personas: ["span"], description: "Staff demonstrate the configured Jaide AI Live Speech workflow at check-in and confirm whether qualified interpreter support is still needed for clinical content.",
        descriptionByPersona: { span: "Patient action: Maria tries Spanish-language AI support for nonclinical check-in questions.\nEssentia action: Staff demonstrate configured Live Speech and assess if qualified interpreter support is needed for clinical communication." } },
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
      { id: "vri-opi", description: "Clinicians use a qualified interpreter by video or phone for assessment, treatment discussions and patient questions.", asl: "Clinicians use a qualified ASL interpreter by video or in-person modality for urgent and complex discussions.",
        descriptionByPersona: { span: "Patient action: Maria describes symptoms and asks treatment questions in Spanish.\nEssentia action: Clinicians include a qualified video or phone interpreter." } },
      { id: "in-person", description: "A scheduled qualified in-person interpreter supports complex discussions, consent and shared decisions with the clinical team.", asl: "A qualified in-person ASL interpreter supports consent and urgent decision points.",
        descriptionByPersona: { span: "Patient action: Maria weighs care options and asks consent questions in Spanish.\nEssentia action: The care team includes a qualified in-person interpreter for complex discussions." } },
      { id: "epic", description: "Clinicians document interpreter participation through the configured EPIC encounter workflow; no automatic data transfer is demonstrated.",
        descriptionByPersona: { span: "Patient action: Maria discusses her care plan with Spanish interpretation.\nEssentia action: Clinicians record interpreter participation in configured EPIC; no automatic data transfer is shown." } },
      { id: "mobile", description: "Staff position a configured mobile device for the patient, clinician and qualified remote interpreter during the encounter.", asl: "Staff position a mobile device so clinician, patient, and qualified ASL interpreter maintain clear visibility.",
        descriptionByPersona: { span: "Patient action: Maria speaks with her clinician through a qualified Spanish interpreter.\nEssentia action: Staff position the configured mobile device so everyone can communicate clearly." } },
      { id: "teladoc", personas: ["tele"], description: "Tran and the clinician include a qualified interpreter in the virtual follow-up using the configured telehealth workflow." },
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
      { id: "smart-tv", description: "Where configured, staff use a bedside Smart TV workflow to connect the patient with a qualified video interpreter for inpatient updates.", asl: "Use a bedside Smart TV workflow with qualified ASL interpreter visibility where configured.",
        descriptionByPersona: { span: "Patient action: Maria asks about inpatient care in Spanish at her bedside.\nEssentia action: Where configured, staff connect a qualified video interpreter through Smart TV workflow." } },
      { id: "mobile", description: "Care teams bring a configured mobile device with qualified interpreter access to bedside education and shift handoffs.", asl: "Care teams bring a mobile device configured for qualified ASL interpretation at bedside.",
        descriptionByPersona: { span: "Patient action: Maria asks bedside questions as her care team changes.\nEssentia action: Staff bring a configured mobile device with qualified Spanish interpreter access." } },
      { id: "vri-opi", description: "Nurses request qualified video or phone interpretation for repeated treatment updates and medication education.", asl: "Nurses request qualified ASL interpretation for repeated updates and medication education.",
        descriptionByPersona: { span: "Patient action: Maria reviews medication changes and asks questions in Spanish.\nEssentia action: Nurses connect a qualified video or phone interpreter for repeated updates." } },
      { id: "in-person", description: "Staff schedule a qualified in-person interpreter for planned care conferences and complex inpatient discussions.", asl: "Staff schedule a qualified in-person ASL interpreter for conferences and complex discussions.",
        descriptionByPersona: { span: "Patient action: Maria discusses inpatient care choices in Spanish at a care conference.\nEssentia action: Staff schedule a qualified in-person interpreter for planned discussions." } },
      { id: "epic", description: "Care teams use the configured EPIC workflow to document communication preferences and interpreter needs for the next shift.",
        descriptionByPersona: { span: "Patient action: Maria shares what Spanish-language support she needs during her stay.\nEssentia action: Care teams record preferences and interpreter needs for next shifts." } },
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
      { id: "vri-opi", description: "Discharge staff use a qualified video or phone interpreter to review instructions, medication plans and patient teach-back.", asl: "Discharge staff use qualified ASL interpretation to review instructions and teach-back.",
        descriptionByPersona: { span: "Patient action: Maria explains her home care plan back in Spanish and asks questions.\nEssentia action: Discharge staff review instructions with a qualified interpreter and complete teach-back." } },
      { id: "in-person", description: "Where appropriate, staff arrange a qualified in-person interpreter for complex discharge education with the patient and caregivers.", asl: "Staff arrange a qualified in-person ASL interpreter for complex discharge education when appropriate.",
        descriptionByPersona: { span: "Patient action: Maria and her caregivers review next steps in Spanish before going home.\nEssentia action: Staff arrange a qualified in-person interpreter for complex education." } },
      { id: "epic", description: "Staff document interpreted discharge education and follow-up communication needs through the configured EPIC discharge workflow.",
        descriptionByPersona: { span: "Patient action: Maria confirms how she wants to receive Spanish follow-up information.\nEssentia action: Staff record interpreted discharge education and communication needs in EPIC workflow." } },
      { id: "jaide", labelByPersona: { span: "Jaide AI Translation" }, description: "Staff may draft translated written discharge instructions for appropriate qualified review and approval before patient distribution.",
        descriptionByPersona: { span: "Patient action: Maria reads Spanish discharge instructions and asks questions.\nEssentia action: Staff obtain appropriate qualified review and approval of AI-assisted translations before distribution." } },
      { id: "patient-line", description: "Staff explain the configured spoken-language Patient Line workflow for contacting the care team with questions after discharge.", asl: null,
        descriptionByPersona: { span: "Patient action: Maria confirms how to call with questions in Spanish after discharge.\nEssentia action: Staff explain the configured Patient Line steps for post-discharge questions." } },
    ],
    impact: "Effective interpreted discharge improves safety and continuity after leaving care.",
  },
  {
    phase: "Post-Visit",
    title: "Post Visit & Ongoing Care",
    preferredConnections: { span: ["patient-line", "epic", "jaide"], som: ["patient-line"], tele: ["patient-line", "teladoc"], joanna: ["vri-opi", "mobile", "in-person"] },
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
      { id: "patient-line", description: "Patients reconnect with staff through the configured spoken-language phone workflow for follow-up coordination and questions.", asl: null,
        descriptionByPersona: { span: "Patient action: Maria calls with follow-up questions in Spanish.\nEssentia action: Staff coordinate next steps through the configured Patient Line workflow." } },
      { id: "teladoc", personas: ["tele"], description: "Staff plan qualified interpreter participation for Tran’s ongoing virtual check-ins through the configured telehealth workflow for follow-up." },
      { id: "vri-opi", description: "Care managers involve a qualified video or phone interpreter when discussing recovery questions and next steps.", asl: "Care managers arrange qualified ASL interpretation for ongoing recovery and next-step discussions.",
        descriptionByPersona: { span: "Patient action: Maria discusses recovery and ongoing care questions in Spanish.\nEssentia action: Care managers include a qualified video or phone interpreter." } },
      { id: "mobile", description: "For follow-up, staff check the configured mobile access workflow with the patient before arranging a qualified remote interpreter.", asl: "For follow-up, staff verify the mobile workflow supports qualified ASL interpretation visibility and reliability.",
        descriptionByPersona: { span: "Patient action: Maria checks that she can join follow-up language support on her mobile device.\nEssentia action: Staff test the configured workflow with her before scheduling interpreter support." } },
      { id: "epic", description: "Care coordinators use the configured EPIC follow-up workflow to document communication needs and interpreted outreach.", descriptionByPersona: { span: "Patient action: Maria receives ongoing outreach in Spanish.\nEssentia action: Care coordinators document needs and interpreted follow-up in configured EPIC workflow." } },
      { id: "jaide", description: "Staff prepare appropriate translated written follow-up messages for approval; clinical content requires appropriate qualified review, and clinical questions go through qualified interpreter pathways." },
      { id: "in-person", personas: ["joanna"], description: "Care coordinators arrange a qualified in-person ASL interpreter for ongoing appointments and follow-up questions, subject to local scheduling workflows." },
    ],
    impact: "Ongoing interpreted engagement strengthens outcomes, loyalty, and operational learning.",
  },
];

const pairedConnectionDescriptions = {
  som: {
    "Awareness & Access to Care": {
      "patient-line": "Patient action: Abdi calls to ask where to begin prenatal care in Somali.\nEssentia action: Access staff explain options with a qualified Somali interpreter.",
      "vri-opi": "Patient action: Abdi asks about maternity services in Somali.\nEssentia action: Access staff connect a qualified Somali video or phone interpreter.",
      jaide: "Patient action: Abdi reviews Somali service information and asks about next steps.\nEssentia action: Staff provide approved nonclinical written translations; AI is not medical interpretation.",
    },
    "Appointment Confirmation & Pre-Visit": {
      "in-person": "Patient action: Abdi shares her visit time and Somali interpreter needs.\nEssentia action: Scheduling staff request a qualified in-person interpreter and confirm details.",
      epic: "Patient action: Abdi shares her language and interpreter preferences.\nEssentia action: Staff record needs in the configured EPIC workflow; this demo does not sync records.",
      "patient-line": "Patient action: Abdi calls with appointment and preparation questions in Somali.\nEssentia action: Staff review details through the configured Patient Line workflow.",
      jaide: "Patient action: Abdi reviews Somali preparation instructions and notes questions.\nEssentia action: Staff provide translated materials after appropriate qualified review and approval.",
    },
    "Arrival & Check-In": {
      "vri-opi": "Patient action: Abdi confirms check-in details in Somali.\nEssentia action: Registration staff connect a qualified video or phone interpreter before intake.",
      mobile: "Patient action: Abdi joins a Somali interpreter on a mobile device for intake.\nEssentia action: Staff bring the configured device and check the connection.",
      epic: "Patient action: Abdi confirms her Somali communication preferences at check-in.\nEssentia action: Registration staff verify needs in the configured EPIC workflow.",
      "in-person": "Patient action: Abdi meets her Somali interpreter before triage.\nEssentia action: Staff confirm the qualified in-person interpreter has arrived or arrange backup.",
    },
    "Clinical Encounter": {
      "vri-opi": "Patient action: Abdi describes symptoms and asks care questions in Somali.\nEssentia action: Clinicians include a qualified video or phone interpreter.",
      "in-person": "Patient action: Abdi asks about care options and consent in Somali.\nEssentia action: The care team includes a qualified in-person interpreter for complex discussions.",
      epic: "Patient action: Abdi discusses her care plan with Somali interpretation.\nEssentia action: Clinicians record interpreter participation in the configured EPIC workflow.",
      mobile: "Patient action: Abdi speaks with her clinician through a Somali interpreter.\nEssentia action: Staff position the configured mobile device so everyone can communicate clearly.",
    },
    "Treatment / Inpatient Stay": {
      "smart-tv": "Patient action: Abdi asks bedside questions about maternity care in Somali.\nEssentia action: Where configured, staff connect a qualified video interpreter through Smart TV.",
      mobile: "Patient action: Abdi asks questions as her maternity care team changes.\nEssentia action: Staff bring a configured mobile device with qualified Somali interpreter access.",
      "vri-opi": "Patient action: Abdi reviews medication changes and asks questions in Somali.\nEssentia action: Nurses connect a qualified video or phone interpreter for updates.",
      "in-person": "Patient action: Abdi discusses maternity care choices in Somali at a conference.\nEssentia action: Staff schedule a qualified in-person interpreter for planned discussions.",
      epic: "Patient action: Abdi shares her Somali-language support needs during her stay.\nEssentia action: Care teams record preferences and interpreter needs for next shifts.",
    },
    "Discharge & Transition of Care": {
      "vri-opi": "Patient action: Abdi explains her postpartum care plan in Somali and asks questions.\nEssentia action: Discharge staff review instructions with a qualified interpreter and complete teach-back.",
      "in-person": "Patient action: Abdi and her caregivers review next steps in Somali before going home.\nEssentia action: Staff arrange a qualified in-person interpreter for complex education.",
      epic: "Patient action: Abdi confirms how she wants to receive Somali follow-up information.\nEssentia action: Staff record interpreted discharge education and communication needs in EPIC.",
      jaide: "Patient action: Abdi reads written discharge instructions and asks questions in Somali.\nEssentia action: Staff obtain qualified review and approval of AI-assisted translations before distribution.",
      "patient-line": "Patient action: Abdi confirms how to call with questions in Somali after discharge.\nEssentia action: Staff explain the configured Patient Line steps for follow-up questions.",
    },
    "Post Visit & Ongoing Care": {
      "patient-line": "Patient action: Abdi calls with postpartum follow-up questions in Somali.\nEssentia action: Staff coordinate next steps through the configured Patient Line workflow.",
      "vri-opi": "Patient action: Abdi discusses recovery and ongoing care questions in Somali.\nEssentia action: Care managers include a qualified video or phone interpreter.",
      mobile: "Patient action: Abdi checks that she can join follow-up language support on her mobile device.\nEssentia action: Staff test the configured workflow before scheduling interpreter support.",
      epic: "Patient action: Abdi receives ongoing outreach in Somali.\nEssentia action: Care coordinators document communication needs and interpreted follow-up in EPIC.",
      jaide: "Patient action: Abdi reads Somali follow-up information and asks care questions.\nEssentia action: Staff obtain qualified review of AI-assisted written content and use interpreters for clinical questions.",
    },
  },
  tele: {
    "Awareness & Access to Care": {
      "patient-line": "Patient action: Tran calls to discuss Vietnamese access needs and where to start care.\nEssentia action: Access staff explain options with a qualified Vietnamese interpreter.",
      "vri-opi": "Patient action: Tran asks about care options in Vietnamese.\nEssentia action: Access staff connect a qualified Vietnamese video or phone interpreter.",
      jaide: "Patient action: Tran reviews written service information and asks about next steps.\nEssentia action: Staff provide approved nonclinical translations; AI is not medical interpretation.",
    },
    "Appointment Confirmation & Pre-Visit": {
      "in-person": "Patient action: Tran shares his visit time and Vietnamese interpreter needs.\nEssentia action: Scheduling staff request a qualified in-person interpreter and confirm details.",
      epic: "Patient action: Tran shares his language and interpreter preferences.\nEssentia action: Staff record needs in the configured EPIC workflow; this demo does not sync records.",
      "patient-line": "Patient action: Tran calls with appointment and preparation questions in Vietnamese.\nEssentia action: Staff review details through the configured Patient Line workflow.",
      jaide: "Patient action: Tran reviews Vietnamese preparation instructions and notes questions.\nEssentia action: Staff provide translated materials after appropriate qualified review and approval.",
      teladoc: "Patient action: Tran checks how to join his telehealth visit with Vietnamese support.\nEssentia action: Staff plan qualified interpreter participation through the configured telehealth workflow.",
    },
    "Arrival & Check-In": {
      "vri-opi": "Patient action: Tran confirms check-in details in Vietnamese.\nEssentia action: Registration staff connect a qualified video or phone interpreter before intake.",
      mobile: "Patient action: Tran joins a Vietnamese interpreter on a mobile device for intake.\nEssentia action: Staff bring the configured device and check the connection.",
      epic: "Patient action: Tran confirms his Vietnamese communication preferences at check-in.\nEssentia action: Registration staff verify needs in the configured EPIC workflow.",
      "in-person": "Patient action: Tran meets his Vietnamese interpreter before triage.\nEssentia action: Staff confirm the qualified in-person interpreter has arrived or arrange backup.",
      teladoc: "Patient action: Tran confirms Vietnamese interpreter access for virtual check-in.\nEssentia action: Registration staff verify qualified interpreter access through the configured telehealth workflow.",
    },
    "Clinical Encounter": {
      "vri-opi": "Patient action: Tran discusses symptoms and treatment questions in Vietnamese.\nEssentia action: Clinicians include a qualified video or phone interpreter.",
      "in-person": "Patient action: Tran asks about care options and consent in Vietnamese.\nEssentia action: The care team includes a qualified in-person interpreter for complex discussions.",
      epic: "Patient action: Tran discusses his care plan with Vietnamese interpretation.\nEssentia action: Clinicians record interpreter participation in the configured EPIC workflow.",
      mobile: "Patient action: Tran speaks with his clinician through a Vietnamese interpreter.\nEssentia action: Staff position the configured mobile device so everyone can communicate clearly.",
      teladoc: "Patient action: Tran discusses his care with a clinician through a Vietnamese interpreter.\nEssentia action: The team includes a qualified interpreter through the configured telehealth workflow.",
    },
    "Treatment / Inpatient Stay": {
      "smart-tv": "Patient action: Tran asks bedside questions about treatment in Vietnamese.\nEssentia action: Where configured, staff connect a qualified video interpreter through Smart TV.",
      mobile: "Patient action: Tran asks questions as his care team changes.\nEssentia action: Staff bring a configured mobile device with qualified Vietnamese interpreter access.",
      "vri-opi": "Patient action: Tran reviews medication changes and asks questions in Vietnamese.\nEssentia action: Nurses connect a qualified video or phone interpreter for updates.",
      "in-person": "Patient action: Tran discusses care choices in Vietnamese at a conference.\nEssentia action: Staff schedule a qualified in-person interpreter for planned discussions.",
      epic: "Patient action: Tran shares his Vietnamese-language support needs during his stay.\nEssentia action: Care teams record preferences and interpreter needs for next shifts.",
    },
    "Discharge & Transition of Care": {
      "vri-opi": "Patient action: Tran explains his home care plan in Vietnamese and asks questions.\nEssentia action: Discharge staff review instructions with a qualified interpreter and complete teach-back.",
      "in-person": "Patient action: Tran and his caregivers review next steps in Vietnamese before going home.\nEssentia action: Staff arrange a qualified in-person interpreter for complex education.",
      epic: "Patient action: Tran confirms how he wants to receive Vietnamese follow-up information.\nEssentia action: Staff record interpreted discharge education and communication needs in EPIC.",
      jaide: "Patient action: Tran reads written discharge instructions and asks questions in Vietnamese.\nEssentia action: Staff obtain qualified review and approval of AI-assisted translations before distribution.",
      "patient-line": "Patient action: Tran confirms how to call with questions in Vietnamese after discharge.\nEssentia action: Staff explain the configured Patient Line steps for follow-up questions.",
    },
    "Post Visit & Ongoing Care": {
      "patient-line": "Patient action: Tran calls with recovery follow-up questions in Vietnamese.\nEssentia action: Staff coordinate next steps through the configured Patient Line workflow.",
      teladoc: "Patient action: Tran joins virtual follow-up with Vietnamese interpretation.\nEssentia action: Staff plan qualified interpreter participation through the configured telehealth workflow.",
      "vri-opi": "Patient action: Tran discusses recovery and ongoing care questions in Vietnamese.\nEssentia action: Care managers include a qualified video or phone interpreter.",
      mobile: "Patient action: Tran checks that he can join follow-up language support on his mobile device.\nEssentia action: Staff test the configured workflow before scheduling interpreter support.",
      epic: "Patient action: Tran receives ongoing outreach in Vietnamese.\nEssentia action: Care coordinators document communication needs and interpreted follow-up in EPIC.",
      jaide: "Patient action: Tran reads Vietnamese follow-up information and asks care questions.\nEssentia action: Staff obtain qualified review of AI-assisted written content and use interpreters for clinical questions.",
    },
  },
  joanna: {
    "Awareness & Access to Care": {
      website: "Patient action: Joanna searches for urgent care and ASL access information.\nEssentia action: Staff confirm qualified ASL interpreter availability and next steps.",
      "vri-opi": "Patient action: Joanna asks about ASL access before arriving.\nEssentia action: Access staff arrange a qualified ASL interpreter by VRI or OPI as appropriate.",
      "in-person": "Patient action: Joanna requests ASL support for her visit.\nEssentia action: Access staff plan a qualified in-person ASL interpreter when video access is unsuitable.",
    },
    "Appointment Confirmation & Pre-Visit": {
      "in-person": "Patient action: Joanna confirms her appointment and ASL accommodation needs.\nEssentia action: Scheduling staff request a qualified in-person ASL interpreter and confirm details.",
      epic: "Patient action: Joanna shares her ASL communication preferences.\nEssentia action: Staff record accommodations in the configured EPIC workflow; this demo does not sync records.",
    },
    "Arrival & Check-In": {
      "vri-opi": "Patient action: Joanna confirms check-in details through ASL.\nEssentia action: Registration staff connect a qualified ASL interpreter by VRI before intake.",
      mobile: "Patient action: Joanna joins a qualified ASL interpreter on a mobile device.\nEssentia action: Staff bring the configured accessible video device and check visibility.",
      epic: "Patient action: Joanna confirms her ASL communication preferences at check-in.\nEssentia action: Registration staff verify needs in the configured EPIC workflow.",
      "in-person": "Patient action: Joanna meets her ASL interpreter before triage.\nEssentia action: Staff confirm the qualified in-person ASL interpreter has arrived or arrange backup.",
    },
    "Clinical Encounter": {
      "vri-opi": "Patient action: Joanna discusses symptoms and treatment questions through ASL.\nEssentia action: Clinicians include a qualified ASL interpreter by VRI or in person.",
      "in-person": "Patient action: Joanna asks about care options and consent through ASL.\nEssentia action: The care team includes a qualified in-person ASL interpreter for complex discussions.",
      epic: "Patient action: Joanna discusses her care plan through ASL interpretation.\nEssentia action: Clinicians record interpreter participation in the configured EPIC workflow.",
      mobile: "Patient action: Joanna speaks with her clinician through an ASL interpreter.\nEssentia action: Staff position a configured accessible mobile video device for the qualified ASL interpreter.",
    },
    "Treatment / Inpatient Stay": {
      "smart-tv": "Patient action: Joanna asks bedside questions about care through ASL.\nEssentia action: Where configured, staff connect a qualified ASL interpreter through configured accessible video Smart TV.",
      mobile: "Patient action: Joanna asks questions as her care team changes.\nEssentia action: Staff bring a configured accessible mobile video device with qualified ASL interpreter access.",
      "vri-opi": "Patient action: Joanna reviews medication changes and asks questions through ASL.\nEssentia action: Nurses connect a qualified ASL interpreter by VRI for updates.",
      "in-person": "Patient action: Joanna discusses care choices through ASL at a conference.\nEssentia action: Staff schedule a qualified in-person ASL interpreter for planned discussions.",
      epic: "Patient action: Joanna shares her ASL support needs during her stay.\nEssentia action: Care teams record accommodations and interpreter needs for next shifts.",
    },
    "Discharge & Transition of Care": {
      "vri-opi": "Patient action: Joanna reviews discharge instructions and asks questions through ASL.\nEssentia action: Discharge staff provide qualified ASL interpretation by VRI and complete teach-back.",
      "in-person": "Patient action: Joanna and her caregivers review next steps through ASL.\nEssentia action: Staff arrange a qualified in-person ASL interpreter for complex education.",
      epic: "Patient action: Joanna confirms how she wants to receive follow-up information.\nEssentia action: Staff record interpreted discharge education and communication needs in EPIC.",
      jaide: "Patient action: Joanna reviews written discharge information and asks care questions in ASL.\nEssentia action: Staff obtain qualified review; translations do not provide ASL interpretation or replace a qualified interpreter, and qualified ASL interpretation remains available.",
    },
    "Post Visit & Ongoing Care": {
      "vri-opi": "Patient action: Joanna discusses recovery and next steps through ASL.\nEssentia action: Care managers arrange qualified ASL interpretation by VRI for follow-up.",
      mobile: "Patient action: Joanna checks that she can join follow-up ASL support on her mobile device.\nEssentia action: Staff test the configured accessible mobile video workflow with a qualified ASL interpreter.",
      epic: "Patient action: Joanna receives ongoing outreach and shares her ASL needs.\nEssentia action: Care coordinators document accommodations and interpreted follow-up in EPIC.",
      jaide: "Patient action: Joanna reviews written follow-up information and asks care questions in ASL.\nEssentia action: Staff obtain qualified review of written content and use qualified ASL interpreters for clinical questions.",
      "in-person": "Patient action: Joanna requests ASL support for follow-up appointments.\nEssentia action: Care coordinators arrange a qualified in-person ASL interpreter through local workflows.",
    },
  },
};

const solutionCatalog = {
  "vri-opi": "VRI/OPI",
  "in-person": "In-person Interpreter using Interpreter Scheduling tool",
  "jaide-live-speech": "Jaide AI Live Speech",
  jaide: "Jaide AI Translation",
  teladoc: "Telehealth",
  epic: "EPIC Integration",
  "patient-line": "Patient Line",
  mobile: "Mobile Device Access",
  "smart-tv": "Smart TV Integration",
  website: "Website",
};

const externalConnectionLinks = {
  "Appointment Confirmation & Pre-Visit": {
    span: {
      jaide: "https://www.youtube.com/watch?v=cQFljsXDylA&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=1",
    },
  },
  "Arrival & Check-In": {
    span: {
      "jaide-live-speech": "https://www.youtube.com/watch?v=qHtBNM9-cKQ&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=3",
    },
  },
  "Discharge & Transition of Care": {
    span: {
      jaide: "https://www.youtube.com/watch?v=NE72LS-x-rs&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=2",
    },
  },
};

const interpreterSchedulerSlides = [
  { title: "Dashboard", file: "Interpreter Scheduler.Dashboard Overview.png", width: 1916, height: 858,
    alt: "Interpreter Scheduler dashboard overview with upcoming reservations, unassigned reservations and languages breakdown" },
  { title: "Admin", file: "Interpreter Scheduler.Admin.png", width: 1914, height: 856,
    alt: "Interpreter Scheduler Admin screen for managing scheduling settings" },
  { title: "Calendar", file: "Interpreter Scheduler.Calendar.png", width: 1917, height: 856,
    alt: "Interpreter Scheduler Calendar view of scheduled interpreter reservations" },
  { title: "Create Request", file: "Interpreter Scheduler.Create Request.png", width: 1916, height: 910,
    alt: "Interpreter Scheduler Create Request form for requesting an interpreter" },
  { title: "Reporting", file: "Interpreter Scheduler.Reporting.png", width: 1913, height: 901,
    alt: "Interpreter Scheduler Reporting screen summarizing interpreter scheduling activity" },
].map((slide) => ({ ...slide, src: `public/media/${encodeURIComponent(slide.file)}` }));

function connectionsFor(stage, personaKey) {
  return stage.connections
    .filter((connection) => (!connection.personas || connection.personas.includes(personaKey))
      && !(personaKey === "joanna" && connection.asl === null))
    .map((connection) => ({
      id: connection.id,
      label: connection.labelByPersona?.[personaKey] ?? solutionCatalog[connection.id],
      description: pairedConnectionDescriptions[personaKey]?.[stage.title]?.[connection.id]
        ?? (personaKey === "joanna" && connection.asl ? connection.asl : connection.descriptionByPersona?.[personaKey] ?? connection.description),
      preferred: stage.preferredConnections?.[personaKey]?.includes(connection.id) ?? false,
      externalLink: externalConnectionLinks?.[stage.title]?.[personaKey]?.[connection.id] ?? null,
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
const telehealthModal = document.getElementById("telehealthModal");
const vriOpiVideoModal = document.getElementById("vriOpiVideoModal");
const vriOpiVideo = document.getElementById("vriOpiVideo");
const interpreterSchedulerModal = document.getElementById("interpreterSchedulerModal");
const interpreterSchedulerImage = document.getElementById("interpreterSchedulerImage");
const interpreterSchedulerSlideTitle = document.getElementById("interpreterSchedulerSlideTitle");
const interpreterSchedulerStatus = document.getElementById("interpreterSchedulerStatus");
const interpreterSchedulerClose = document.getElementById("interpreterSchedulerModalClose");
const interpreterSchedulerPrev = document.getElementById("interpreterSchedulerPrev");
const interpreterSchedulerNext = document.getElementById("interpreterSchedulerNext");
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
      <p><strong>Preferred language:</strong> ${p.language}</p>
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

    if (item.externalLink) {
      card.classList.add("connection-clickable");
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${item.label}: open linked video`);
      card.addEventListener("click", () => window.open(item.externalLink, "_blank", "noopener,noreferrer"));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.open(item.externalLink, "_blank", "noopener,noreferrer");
        }
      });
    }

    if (personaKey === "tele" && stage.title === "Clinical Encounter" && item.id === "teladoc") {
      card.setAttribute("aria-label", `${item.label}: view integrations image`);
      makeDialogTrigger(card, () => openTelehealthModal(card));
    }

    if (personaKey === "span" && item.id === "vri-opi") {
      card.setAttribute("aria-label", `${item.label}: play interpreter video`);
      makeDialogTrigger(card, () => openVriOpiVideoModal(card));
    }

    if (personaKey === "som" && stage.title === "Appointment Confirmation & Pre-Visit" && item.id === "in-person") {
      card.setAttribute("aria-label", `${item.label}: view Interpreter Scheduler images`);
      makeDialogTrigger(card, () => openInterpreterSchedulerModal(card));
    }
    connectionGrid.appendChild(card);
  });
}

function makeDialogTrigger(card, openDialog) {
  card.classList.add("connection-clickable");
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-haspopup", "dialog");
  card.addEventListener("click", openDialog);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDialog();
    }
  });
}

let telehealthTrigger = null;
function openTelehealthModal(trigger) {
  stopAuto();
  telehealthTrigger = trigger;
  if (!telehealthModal.open) telehealthModal.showModal();
  document.getElementById("telehealthModalClose").focus();
}

let vriOpiVideoTrigger = null;
function openVriOpiVideoModal(trigger) {
  stopAuto();
  vriOpiVideoTrigger = trigger;
  if (!vriOpiVideoModal.open) vriOpiVideoModal.showModal();
}

let interpreterSchedulerIndex = 0;
let interpreterSchedulerTrigger = null;
function showInterpreterSchedulerSlide(index) {
  interpreterSchedulerIndex = Math.max(0, Math.min(index, interpreterSchedulerSlides.length - 1));
  const slide = interpreterSchedulerSlides[interpreterSchedulerIndex];
  const last = interpreterSchedulerSlides.length - 1;
  interpreterSchedulerImage.src = slide.src;
  interpreterSchedulerImage.alt = slide.alt;
  interpreterSchedulerImage.width = slide.width;
  interpreterSchedulerImage.height = slide.height;
  interpreterSchedulerSlideTitle.textContent = slide.title;
  interpreterSchedulerStatus.textContent = `${interpreterSchedulerIndex + 1} of ${interpreterSchedulerSlides.length}`;
  interpreterSchedulerPrev.disabled = interpreterSchedulerIndex === 0;
  interpreterSchedulerNext.disabled = interpreterSchedulerIndex === last;
  if (interpreterSchedulerPrev.disabled && document.activeElement === interpreterSchedulerPrev) interpreterSchedulerNext.focus();
  if (interpreterSchedulerNext.disabled && document.activeElement === interpreterSchedulerNext) interpreterSchedulerPrev.focus();
}

function openInterpreterSchedulerModal(trigger) {
  stopAuto();
  interpreterSchedulerTrigger = trigger;
  showInterpreterSchedulerSlide(0);
  if (!interpreterSchedulerModal.open) interpreterSchedulerModal.showModal();
  interpreterSchedulerNext.focus();
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
  document.getElementById("stageDetails").open = !presentationMode.checked;
  document.getElementById("connectionDetails").open = !presentationMode.checked;
});
document.getElementById("telehealthModalClose").addEventListener("click", () => telehealthModal.close());
telehealthModal.addEventListener("click", (event) => {
  if (event.target === telehealthModal) telehealthModal.close();
});
telehealthModal.addEventListener("close", () => {
  telehealthTrigger?.focus();
  telehealthTrigger = null;
});
document.getElementById("vriOpiVideoModalClose").addEventListener("click", () => vriOpiVideoModal.close());
vriOpiVideoModal.addEventListener("click", (event) => {
  if (event.target === vriOpiVideoModal) vriOpiVideoModal.close();
});
vriOpiVideoModal.addEventListener("close", () => {
  vriOpiVideo.pause();
  vriOpiVideoTrigger?.focus();
  vriOpiVideoTrigger = null;
});
interpreterSchedulerClose.addEventListener("click", () => interpreterSchedulerModal.close());
interpreterSchedulerPrev.addEventListener("click", () => showInterpreterSchedulerSlide(interpreterSchedulerIndex - 1));
interpreterSchedulerNext.addEventListener("click", () => showInterpreterSchedulerSlide(interpreterSchedulerIndex + 1));
interpreterSchedulerModal.addEventListener("click", (event) => {
  if (event.target === interpreterSchedulerModal) interpreterSchedulerModal.close();
});
interpreterSchedulerModal.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showInterpreterSchedulerSlide(interpreterSchedulerIndex + (event.key === "ArrowLeft" ? -1 : 1));
  } else if (event.key === "Tab") {
    const focusable = [interpreterSchedulerClose, interpreterSchedulerPrev, interpreterSchedulerNext].filter((el) => !el.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!focusable.includes(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }
});
interpreterSchedulerModal.addEventListener("close", () => {
  interpreterSchedulerTrigger?.focus();
  interpreterSchedulerTrigger = null;
});
populateScenarioCards();
buildNodes();
render();
