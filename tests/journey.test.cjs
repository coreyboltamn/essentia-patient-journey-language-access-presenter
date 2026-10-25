const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const source = readFileSync(resolve(__dirname, "../app.js"), "utf8");
const html = readFileSync(resolve(__dirname, "../index.html"), "utf8");
const css = readFileSync(resolve(__dirname, "../styles.css"), "utf8");
const dataContext = vm.createContext({});
vm.runInContext(source.slice(0, source.indexOf("const scenarioGrid ="))
  + "\nthis.data = { personas, stages, connectionsFor };", dataContext);
const { personas, stages, connectionsFor } = dataContext.data;

// Minimal DOM/timer harness for the existing dependency-free Node test suite.
function journey() {
  const elements = new Map();
  let tick;
  class Element {
    constructor() {
      this.children = [];
      this.handlers = {};
      this.classList = { toggle() {}, add: (name) => { this.className = `${this.className || ""} ${name}`.trim(); } };
      this.style = { setProperty() {} };
      this.dataset = {};
    }
    set innerHTML(value) { this.markup = value; this.children = []; }
    get innerHTML() { return this.markup; }
    set id(value) { this.key = value; elements.set(value, this); }
    get id() { return this.key; }
    appendChild(child) { this.children.push(child); }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(name, handler) { this.handlers[name] = handler; }
    click() { if (!this.disabled) this.handlers.click(); }
    focus() { document.activeElement = this; }
    scrollIntoView() { assert.fail("Journey controls must not scroll the page"); }
  }
  for (const [, id] of html.matchAll(/\bid="([^"]+)"/g)) {
    const element = new Element();
    element.id = id;
  }
  const document = {
    body: new Element(),
    createElement: () => new Element(),
    getElementById(id) { return elements.get(id) || null; },
  };
  const opened = [];
  const context = vm.createContext({
    document,
    window: { open: (...args) => opened.push(args) },
    setInterval(callback) { tick = callback; return 1; },
    clearInterval() { tick = null; },
  });
  vm.runInContext(source, context);
  return {
    el: (id) => document.getElementById(id),
    node: (index) => document.getElementById("nodes").children[index].children[0],
    state: () => vm.runInContext("({ pIndex, sIndex, auto })", context),
    tick: () => tick(),
    activeElement: () => document.activeElement,
    opened,
  };
}

test("every scenario card labels its language as Preferred language", () => {
  const app = journey();
  const cards = app.el("scenarioGrid").children;
  assert.equal(cards.length, personas.length);
  personas.forEach((persona, index) => {
    assert.ok(cards[index].innerHTML.includes(`<strong>Preferred language:</strong> ${persona.language}`));
    assert.doesNotMatch(cards[index].innerHTML, /primary communication/i);
  });
});

test("live-demo callout, markers, styles, data and handlers are removed", () => {
  assert.doesNotMatch(html, /liveDemo|live-demo|demo-marker|Presenter handoff|Pause journey for live demo/);
  assert.doesNotMatch(source, /liveDemo|LiveDemo|selectedDemoId|checkpointsFor|renderDemoMarkers|node-demos/);
  assert.doesNotMatch(css, /live-demo|demo-controls|demo-choices|demo-marker|demo-chip|node-demos/);
  assert.match(html, /src="touchpoints.js"/);
  const app = journey();
  assert.equal(app.el("liveDemoCheckpoint"), null);
  assert.equal(app.el("nodes").children.length, stages.length);
  for (const stop of app.el("nodes").children) assert.equal(stop.children.length, 1);
});

test("stakeholder panel and unused UI hooks are removed without leaving an empty panel", () => {
  assert.doesNotMatch(html, /What matters to your team|stakeholderStrip|stakeholderDetail/);
  assert.doesNotMatch(source, /stakeholder|activeStakeholder/);
  assert.doesNotMatch(css, /stakeholder|stake-chip/);
  const app = journey();
  assert.equal(app.el("stakeholderStrip"), null);
  assert.equal(app.el("stakeholderDetail"), null);
});

test("scenario and journey headings and all stage labels have no numbering prefixes", () => {
  assert.doesNotMatch(html, /<(?:h[1-6]|summary)\b[^>]*>\s*\d+\.\s/i);
  assert.match(html, /<summary>Patient scenario/);
  assert.match(html, /<h2>Patient engagement timeline<\/h2>/);
  assert.match(html, /<h2>AMN connection points at this step<\/h2>/);
  for (const stage of stages) assert.doesNotMatch(stage.title, /^\d+\.\s/);

  const app = journey();
  stages.forEach((stage, index) => {
    app.node(index).click();
    assert.equal(app.el("stageTitle").textContent, stage.title);
    assert.equal(app.node(index)["aria-label"], stage.title);
  });
});

test("Abdi's Somali-language journey moves from pregnancy and prenatal care into inpatient maternity care", () => {
  const abdi = personas.find(({ id }) => id === "som");
  assert.equal(abdi.name, "Abdi");
  assert.match(abdi.situation, /pregnancy.*prenatal.*inpatient maternity care/i);
  assert.match(abdi.opening, /pregnant.*prenatal.*inpatient stay/i);
  const moments = stages.map(({ patient }) => patient.som);
  assert.match(moments[0], /prenatal maternity care.*Somali.*qualified interpreter/i);
  assert.match(moments[1], /prenatal visit.*qualified Somali interpreter/i);
  assert.match(moments[2], /prenatal visit.*qualified Somali interpreter/i);
  assert.match(moments[3], /prenatal assessment.*Somali.*qualified interpreter/i);
  assert.match(moments[4], /prenatal visits to inpatient maternity care.*qualified Somali interpreter.*admission/i);
  assert.match(moments[5], /leaving inpatient maternity care.*postpartum.*Somali.*qualified interpreter/i);
  assert.match(moments[6], /After discharge.*postpartum follow-up.*Somali.*qualified interpreter/i);
  assert.doesNotMatch(moments.join(" "), /medical advice|diagnos(?:is|ed)/i);
});

test("every scenario and timeline stage renders details and AMN mappings without the callout", () => {
  const app = journey();
  personas.forEach((persona, pIndex) => {
    app.el("scenarioGrid").children[pIndex].click();
    assert.equal(app.state().sIndex, 0);
    assert.match(app.el("scenarioName").textContent, new RegExp(persona.name));
    stages.forEach((stage, sIndex) => {
      app.node(sIndex).click();
      assert.equal(app.state().pIndex, pIndex);
      assert.equal(app.state().sIndex, sIndex);
      assert.equal(app.el("stageTitle").textContent, stage.title);
      assert.equal(app.el("patientMoment").textContent, stage.patient[persona.id]);
      assert.deepEqual(
        app.el("connectionGrid").children.map((card) => card.dataset.solutionId),
        Array.from(connectionsFor(stage, persona.id), ({ id }) => id),
      );
      assert.equal(app.node(sIndex)["aria-current"], "step");
      assert.equal(app.el("prevBtn").disabled, sIndex === 0);
      assert.equal(app.el("nextBtn").disabled, sIndex === stages.length - 1);
      assert.equal(app.state().auto, null);
    });
  });
});

test("Maria's connection cards render paired action lines without changing card structure", () => {
  const app = journey();
  assert.match(css, /\.connection-card p\s*\{[^}]*white-space:\s*pre-line;/);
  stages.forEach((stage, index) => {
    app.node(index).click();
    const expected = connectionsFor(stage, "span");
    app.el("connectionGrid").children.forEach((card, cardIndex) => {
      assert.equal(card.children.length, expected[cardIndex].preferred ? 3 : 2);
      assert.equal(card.children.at(-1).textContent, expected[cardIndex].description);
      assert.match(card.children.at(-1).textContent, /^Patient action: Maria .+\nEssentia action: .+$/);
      assert.equal(typeof card.handlers.click, expected[cardIndex].externalLink ? "function" : "undefined");
    });
  });
});

test("Tran's virtual stages render exactly Telehealth with unbranded, qualified-interpreter copy", () => {
  const app = journey();
  app.el("scenarioGrid").children[personas.findIndex(({ id }) => id === "tele")].click();
  for (const checked of [false, true]) {
    app.el("presentationMode").checked = checked;
    app.el("presentationMode").handlers.change();
    for (const index of [1, 2, 3, 6]) {
      app.node(index).click();
      const cards = app.el("connectionGrid").children;
      const telehealth = cards.filter((card) => card.dataset.solutionId === "teladoc");
      assert.equal(telehealth.length, 1, stages[index].title);
      assert.equal(telehealth[0].children[0].textContent, "Telehealth");
      assert.equal(telehealth[0].children[1].textContent, "Tran");
      assert.match(telehealth[0].children.at(-1).textContent, /configured telehealth workflow/);
      assert.match(telehealth[0].children.at(-1).textContent, /qualified interpreter/);
      for (const card of cards) {
        assert.doesNotMatch(card.children.map((child) => child.textContent).join(" "), /teladoc/i);
      }
    }
  }
});

test("Back, Next, scenario selection, timeline selection and restart stop autoplay", () => {
  for (const [navigate, expectedStage, expectedPersona] of [
    [(app) => app.el("nextBtn").click(), 2, 2],
    [(app) => app.el("prevBtn").click(), 0, 2],
    [(app) => app.node(4).click(), 4, 2],
    [(app) => app.el("scenarioGrid").children[1].click(), 0, 1],
    [(app) => app.el("resetBtn").click(), 0, 0],
  ]) {
    const app = journey();
    app.el("scenarioGrid").children[2].click();
    app.node(1).click();
    app.el("playBtn").click();
    assert.equal(app.state().auto, 1);
    navigate(app);
    assert.equal(app.state().sIndex, expectedStage);
    assert.equal(app.state().pIndex, expectedPersona);
    assert.equal(app.state().auto, null);
    assert.equal(app.el("playBtn").textContent, "▶ Auto-play");
  }
});

["span", "som", "tele", "joanna"].forEach((personaId) =>
test(`${personaId} highlights follow navigation, autoplay, presentation mode and scenario switching`, () => {
  const app = journey();
  const expected = { span: [
    ["patient-line"], ["patient-line"], ["jaide-live-speech", "vri-opi"], ["vri-opi"],
    ["smart-tv", "vri-opi", "epic"], ["jaide"], ["patient-line", "epic", "jaide"],
  ], som: [
    ["patient-line"], ["in-person"], ["in-person"], ["in-person"],
    ["smart-tv", "epic"], ["jaide"], ["patient-line"],
  ], tele: [
    ["patient-line"], ["teladoc"], ["teladoc"], ["teladoc"],
    ["mobile", "vri-opi", "in-person", "epic"], ["jaide"], ["patient-line", "teladoc"],
  ], joanna: [
    ["website"], ["in-person"], ["vri-opi", "in-person"], ["vri-opi", "in-person"],
    ["vri-opi", "in-person", "epic"], ["vri-opi", "jaide"], ["vri-opi", "mobile", "in-person"],
  ] };
  function checkHighlights(index) {
    const persona = personas[app.state().pIndex];
    const preferredIds = expected[persona.id]?.[index] || [];
    const cards = app.el("connectionGrid").children;
    const connections = connectionsFor(stages[index], persona.id);
    assert.deepEqual(cards.map((card) => card.dataset.solutionId), Array.from(connections, ({ id }) => id));
    assert.deepEqual(
      cards.filter((card) => card.className.includes("connection-preferred"))
        .map((card) => card.dataset.solutionId),
      preferredIds,
    );
    for (const card of cards) {
      const preferred = preferredIds.includes(card.dataset.solutionId);
      assert.equal(card.children.length, preferred ? 3 : 2);
      assert.equal(card.children[0].textContent, connections.find(({ id }) => id === card.dataset.solutionId).label);
      if (preferred) {
        assert.equal(card.children[1].textContent, persona.name);
        assert.equal(card.children[1].className, "connection-badge");
      }
      assert.ok(card.children.at(-1).textContent.length > 70);
    }
  }
  app.el("scenarioGrid").children[personas.findIndex(({ id }) => id === personaId)].click();
  checkHighlights(0);
  for (let index = 1; index < stages.length; index++) {
    app.el("nextBtn").click();
    checkHighlights(index);
  }
  for (let index = stages.length - 2; index >= 0; index--) {
    app.el("prevBtn").click();
    checkHighlights(index);
  }
  for (const checked of [true, false]) {
    app.el("presentationMode").checked = checked;
    app.el("presentationMode").handlers.change();
    stages.forEach((stage, index) => {
      app.node(index).click();
      checkHighlights(index);
    });
  }
  app.el("scenarioGrid").children[personas.findIndex(({ id }) => id === personaId)].click();
  app.el("playBtn").click();
  for (let index = 1; index <= stages.length; index++) {
    app.tick();
    checkHighlights(index % stages.length);
  }
  personas.forEach((persona, pIndex) => {
    app.el("scenarioGrid").children[pIndex].click();
    stages.forEach((stage, index) => {
      app.node(index).click();
      checkHighlights(index);
    });
  });
  app.el("resetBtn").click();
  checkHighlights(0);
}));

test("autoplay advances, wraps and pauses without demo state", () => {
  const app = journey();
  app.el("playBtn").click();
  for (let index = 1; index <= stages.length; index++) {
    app.tick();
    assert.equal(app.state().sIndex, index % stages.length);
    assert.equal(app.el("stageTitle").textContent, stages[index % stages.length].title);
  }
  app.el("playBtn").click();
  assert.equal(app.state().auto, null);
  assert.equal(app.el("playBtn").textContent, "▶ Auto-play");
});

test("presentation mode still collapses and restores support controls without changing the journey", () => {
  const app = journey();
  app.el("scenarioGrid").children[1].click();
  app.node(3).click();
  for (const checked of [true, false]) {
    app.el("presentationMode").checked = checked;
    app.el("presentationMode").handlers.change();
    assert.equal(app.el("scenarioPicker").open, !checked);
    assert.equal(app.el("touchpointDetails").open, !checked);
    assert.equal(app.el("stageDetails").open, !checked);
    assert.equal(app.el("connectionDetails").open, !checked);
    assert.equal(app.state().pIndex, 1);
    assert.equal(app.state().sIndex, 3);
  }
});

test("presenter supporting disclosures can reopen without changing stage or connection content", () => {
  const app = journey();
  app.el("scenarioGrid").children[3].click();
  app.node(4).click();
  const cards = app.el("connectionGrid").children;
  app.el("presentationMode").checked = true;
  app.el("presentationMode").handlers.change();
  for (const id of ["scenarioPicker", "touchpointDetails", "stageDetails", "connectionDetails"]) {
    assert.equal(app.el(id).open, false);
    app.el(id).open = true;
  }
  assert.equal(app.state().pIndex, 3);
  assert.equal(app.state().sIndex, 4);
  assert.equal(app.el("connectionGrid").children, cards);
  app.el("nextBtn").click();
  for (const id of ["scenarioPicker", "touchpointDetails", "stageDetails", "connectionDetails"]) {
    assert.equal(app.el(id).open, true);
  }
  assert.equal(app.state().pIndex, 3);
  assert.equal(app.state().sIndex, 5);
  assert.deepEqual(
    app.el("connectionGrid").children.map((card) => card.dataset.solutionId),
    Array.from(connectionsFor(stages[5], "joanna"), ({ id }) => id),
  );
  assert.match(html, /<details id="stageDetails" open>\s*<summary>People and outcomes<\/summary>/);
  assert.match(html, /<details id="connectionDetails" open>\s*<summary>All options, descriptions and safety notes<\/summary>/);
});

test("Tran's Telehealth modal shows only the uploaded integrations image without cropping", () => {
  const modal = html.match(/<dialog id="telehealthModal"[\s\S]*?<\/dialog>/)[0];
  const images = Array.from(modal.matchAll(/<img\b[^>]*>/g), ([image]) => image);
  assert.equal(images.length, 1);
  assert.match(images[0], /class="telehealth-image"/);
  const src = images[0].match(/src="([^"]+)"/)[1];
  assert.equal(src, "Designer%20(12).png");
  const asset = readFileSync(resolve(__dirname, "..", decodeURIComponent(src)));
  assert.equal(asset.subarray(1, 4).toString(), "PNG");
  assert.equal(asset.readUInt32BE(16), 1536);
  assert.equal(asset.readUInt32BE(20), 1024);
  assert.match(images[0], /width="1536" height="1024"/);
  assert.match(images[0], /alt="AMN Healthcare Language Services technology interoperability and integrations[^"]+"/);
  assert.doesNotMatch(modal, /<video\b|<iframe\b|<object\b|telehealth-category|telehealth-summary|scheduler-controls/);
  const imageStyles = css.match(/\.telehealth-image\s*\{([^}]+)\}/)[1];
  assert.match(imageStyles, /max-width: 100%/);
  assert.match(imageStyles, /max-height: calc\(100dvh - 13rem\)/);
  assert.match(imageStyles, /width: auto/);
  assert.match(imageStyles, /height: auto/);
  assert.match(imageStyles, /object-fit: contain/);
});

test("Telehealth redesign keeps a labelled header and scopes close interaction styles to the modal", () => {
  const modal = html.match(/<dialog id="telehealthModal"[\s\S]*?<\/dialog>/)[0];
  assert.match(modal, /aria-labelledby="telehealthModalTitle"/);
  const header = modal.slice(0, modal.indexOf('<div class="telehealth-image-wrap">'));
  assert.match(header, /class="telehealth-eyebrow">Tran’s journey · Clinical Encounter/);
  assert.match(header, /<h2 id="telehealthModalTitle">Telehealth integrations<\/h2>/);
  assert.match(header, /id="telehealthModalClose"[^>]*type="button" aria-label="Close"/);
  assert.match(css, /#telehealthModal \.image-modal-close:hover\s*\{/);
  assert.match(css, /#telehealthModal \.image-modal-close:focus-visible\s*\{[^}]*outline: 3px solid var\(--purple\)/);
});

test("Telehealth image framing and header spacing stay responsive and scoped", () => {
  assert.match(css, /#telehealthModal\s*\{[^}]*max-height: calc\(100dvh - 2rem\)/);
  assert.match(css, /#telehealthModal \.image-modal-head\s*\{[^}]*align-items: center;[^}]*padding: clamp\(1rem, 3vw, 1\.5rem\)/);
  assert.match(css, /#telehealthModal \.image-modal-close\s*\{[^}]*display: grid;[^}]*place-items: center;[^}]*padding: 0/);
  const frame = css.match(/\.telehealth-image-wrap\s*\{([^}]+)\}/)[1];
  assert.match(frame, /display: flex/);
  assert.match(frame, /align-items: center/);
  assert.match(frame, /justify-content: center/);
  assert.match(frame, /padding: clamp\(1rem, 3vw, 1\.5rem\)/);
  assert.match(frame, /background: #f6f8fc/);
  const image = css.match(/\.telehealth-image\s*\{([^}]+)\}/)[1];
  assert.match(image, /border: 1px solid var\(--border\)/);
  assert.match(image, /border-radius: 12px/);
  assert.match(image, /box-shadow: 0 4px 16px rgba\(/);
});

test("Tran's Clinical Encounter Telehealth card opens the image modal and restores focus on close", () => {
  assert.match(html, /<dialog id="telehealthModal"[\s\S]*id="telehealthModalClose"[\s\S]*<\/dialog>/);

  const app = journey();
  const modal = app.el("telehealthModal");
  modal.open = false;
  modal.showModal = () => { modal.open = true; };
  modal.close = () => { modal.open = false; modal.handlers.close(); };
  const tranIndex = personas.findIndex(({ id }) => id === "tele");
  const encounterIndex = stages.findIndex(({ title }) => title === "Clinical Encounter");
  app.el("scenarioGrid").children[tranIndex].click();
  app.node(encounterIndex).click();
  const card = app.el("connectionGrid").children.find((c) => c.dataset.solutionId === "teladoc");
  assert.match(card.className, /connection-preferred/);
  assert.match(card.className, /connection-clickable/);
  assert.equal(card["aria-haspopup"], "dialog");
  assert.equal(card["aria-label"], "Telehealth: view integrations image");

  app.el("playBtn").click();
  card.click();
  assert.equal(modal.open, true);
  assert.equal(app.state().auto, null);
  assert.equal(app.activeElement(), app.el("telehealthModalClose"));
  app.el("telehealthModalClose").click();
  assert.equal(modal.open, false);
  assert.equal(app.activeElement(), card);

  card.handlers.keydown({ key: "Enter", preventDefault() {} });
  assert.equal(modal.open, true);
  modal.handlers.click({ target: {} });
  assert.equal(modal.open, true, "Clicks inside the dialog content keep it open");
  modal.handlers.click({ target: modal });
  assert.equal(modal.open, false, "Backdrop click closes the dialog");
  assert.equal(app.activeElement(), card);

  card.handlers.keydown({ key: " ", preventDefault() {} });
  assert.equal(modal.open, true, "Space opens the dialog");
  modal.close();
  assert.equal(app.activeElement(), card, "Native dialog dismissal restores focus");

  for (const [pIndex, persona] of personas.entries()) {
    app.el("scenarioGrid").children[pIndex].click();
    for (const [sIndex, stage] of stages.entries()) {
      app.node(sIndex).click();
      for (const c of app.el("connectionGrid").children) {
        assert.equal(/connection-clickable/.test(c.className), (persona.id === "tele" && stage === stages[encounterIndex] && c.dataset.solutionId === "teladoc")
          || (persona.id === "span" && c.dataset.solutionId === "vri-opi")
          || (persona.id === "som" && stage.title === "Appointment Confirmation & Pre-Visit" && c.dataset.solutionId === "in-person")
          || Boolean(connectionsFor(stage, persona.id).find(({ id }) => id === c.dataset.solutionId).externalLink));
      }
    }
  }
});

test("Maria's VRI/OPI video modal embeds the uploaded MP4 with labelled controls and no autoplay", () => {
  const modal = html.match(/<dialog id="vriOpiVideoModal"[\s\S]*?<\/dialog>/)[0];
  assert.match(modal, /aria-labelledby="vriOpiVideoModalTitle"/);
  assert.match(modal, /class="telehealth-eyebrow">Maria’s journey · VRI\/OPI connection/);
  assert.match(modal, /<h2 id="vriOpiVideoModalTitle">/);
  assert.match(modal, /id="vriOpiVideoModalClose"[^>]*type="button" aria-label="Close video"/);
  const video = modal.match(/<video\b[^>]*>/)[0];
  assert.match(video, /id="vriOpiVideo"/);
  assert.match(video, /\bcontrols\b/);
  assert.match(video, /aria-labelledby="vriOpiVideoModalTitle"/);
  assert.doesNotMatch(video, /autoplay/);
  assert.match(modal, /<source src="public\/media\/amn-ls-interpreter-video-impact-1920x1080-captions-2\.mp4" type="video\/mp4" \/>/);
  assert.ok(require("node:fs").existsSync(resolve(__dirname, "../public/media/amn-ls-interpreter-video-impact-1920x1080-captions-2.mp4")));
  assert.match(css, /\.vri-opi-video \{[^}]*aspect-ratio: 16 \/ 9/);
  assert.match(css, /#vriOpiVideoModal \.image-modal-close:focus-visible,/);
});

test("Maria's VRI/OPI connection cards open the video modal by click and keyboard at every stage", () => {
  const app = journey();
  const modal = app.el("vriOpiVideoModal");
  const video = app.el("vriOpiVideo");
  let paused = 0;
  video.pause = () => { paused += 1; };
  modal.open = false;
  modal.showModal = () => { modal.open = true; };
  modal.close = () => { modal.open = false; modal.handlers.close(); };
  const mariaIndex = personas.findIndex(({ id }) => id === "span");
  app.el("scenarioGrid").children[mariaIndex].click();
  let checked = 0;
  for (const checkedMode of [false, true]) {
    app.el("presentationMode").checked = checkedMode;
    app.el("presentationMode").handlers.change();
    for (const [sIndex, stage] of stages.entries()) {
      app.node(sIndex).click();
      const expected = connectionsFor(stage, "span").find(({ id }) => id === "vri-opi");
      if (!expected) continue;
      const card = app.el("connectionGrid").children.find((c) => c.dataset.solutionId === "vri-opi");
      checked += 1;
      assert.equal(card.children[0].textContent, "VRI/OPI", stage.title);
      assert.equal(card.children.at(-1).textContent, expected.description);
      assert.equal(/connection-preferred/.test(card.className), expected.preferred);
      if (expected.preferred) assert.equal(card.children[1].textContent, "Maria");
      assert.match(card.className, /connection-clickable/);
      assert.equal(card.role, "button");
      assert.equal(card.tabindex, "0");
      assert.equal(card["aria-haspopup"], "dialog");
      assert.equal(card["aria-label"], "VRI/OPI: play interpreter video");
      let focused = 0;
      card.focus = () => { focused += 1; };

      app.el("playBtn").click();
      assert.ok(app.state().auto, "autoplay running");
      card.click();
      assert.equal(modal.open, true);
      assert.equal(app.state().auto, null, "Opening the video stops autoplay");
      assert.equal(app.state().sIndex, sIndex);
      app.el("vriOpiVideoModalClose").click();
      assert.equal(modal.open, false);
      assert.equal(focused, 1, "Focus returns to the VRI/OPI card");

      card.handlers.keydown({ key: "Enter", preventDefault() {} });
      assert.equal(modal.open, true);
      modal.handlers.click({ target: video });
      assert.equal(modal.open, true, "Clicks on the video keep the dialog open");
      modal.handlers.click({ target: modal });
      assert.equal(modal.open, false, "Backdrop click closes the dialog");

      card.handlers.keydown({ key: " ", preventDefault() {} });
      assert.equal(modal.open, true, "Space opens the dialog");
      card.handlers.keydown({ key: "Tab", preventDefault() {} });
      modal.close();
      assert.equal(focused, 3);
    }
  }
  assert.ok(checked > 0);
  assert.equal(paused, checked * 3, "Closing always pauses the video");
  assert.deepEqual(app.opened, []);
  assert.equal(app.el("telehealthModal").open, undefined, "Telehealth modal is not opened");
});

test("VRI/OPI cards for other personas stay informational", () => {
  const app = journey();
  for (const [pIndex, persona] of personas.entries()) {
    if (persona.id === "span") continue;
    app.el("scenarioGrid").children[pIndex].click();
    for (const sIndex of stages.keys()) {
      app.node(sIndex).click();
      const card = app.el("connectionGrid").children.find((c) => c.dataset.solutionId === "vri-opi");
      if (!card) continue;
      assert.doesNotMatch(card.className, /connection-clickable/);
      for (const attribute of ["role", "tabindex", "aria-haspopup", "aria-label"]) {
        assert.equal(card[attribute], undefined, attribute);
      }
      assert.equal(card.handlers.click, undefined);
    }
  }
});

test("Maria's Arrival Jaide AI Live Speech card opens the check-in video by click and keyboard", () => {
  const url = "https://www.youtube.com/watch?v=qHtBNM9-cKQ&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=3";
  const app = journey();
  app.node(stages.findIndex(({ title }) => title === "Arrival & Check-In")).click();
  const card = app.el("connectionGrid").children.find((c) => c.dataset.solutionId === "jaide-live-speech");
  assert.equal(card.children[0].textContent, "Jaide AI Live Speech");
  assert.match(card.className, /connection-preferred/);
  assert.match(card.className, /connection-clickable/);
  assert.equal(card.role, "link");
  assert.equal(card.tabindex, "0");
  assert.equal(card["aria-label"], "Jaide AI Live Speech: open linked video");

  card.click();
  let prevented = 0;
  for (const key of ["Enter", " ", "Tab"]) {
    card.handlers.keydown({ key, preventDefault() { prevented += 1; } });
  }
  assert.equal(prevented, 2);
  assert.deepEqual(app.opened, Array(3).fill([url, "_blank", "noopener,noreferrer"]));
  assert.equal(app.el("vriOpiVideoModal").open, undefined);
  assert.equal(app.el("telehealthModal").open, undefined);
  assert.equal(app.state().sIndex, 2);
});

test("Maria's Discharge Jaide AI Translation card opens the discharge video in a new tab by click and keyboard", () => {
  const url = "https://www.youtube.com/watch?v=NE72LS-x-rs&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=2";
  const app = journey();
  app.el("scenarioGrid").children[personas.findIndex(({ id }) => id === "span")].click();
  app.node(stages.findIndex(({ title }) => title === "Discharge & Transition of Care")).click();
  const card = app.el("connectionGrid").children.find((c) => c.dataset.solutionId === "jaide");
  assert.equal(card.children[0].textContent, "Jaide AI Translation");
  assert.match(card.className, /connection-preferred/);
  assert.match(card.className, /connection-clickable/);
  assert.equal(card.role, "link");
  assert.equal(card.tabindex, "0");

  card.click();
  card.handlers.keydown({ key: "Enter", preventDefault() {} });
  card.handlers.keydown({ key: " ", preventDefault() {} });
  card.handlers.keydown({ key: "Tab", preventDefault() {} });
  assert.deepEqual(app.opened, Array(3).fill([url, "_blank", "noopener,noreferrer"]));
});

const schedulerSlides = [
  ["Dashboard", "Interpreter Scheduler.Dashboard Overview.png"],
  ["Admin", "Interpreter Scheduler.Admin.png"],
  ["Calendar", "Interpreter Scheduler.Calendar.png"],
  ["Create Request", "Interpreter Scheduler.Create Request.png"],
  ["Reporting", "Interpreter Scheduler.Reporting.png"],
];

function schedulerApp() {
  const app = journey();
  const modal = app.el("interpreterSchedulerModal");
  modal.open = false;
  modal.showModal = () => { modal.open = true; };
  modal.close = () => { modal.open = false; modal.handlers.close(); };
  const slide = () => ({
    title: app.el("interpreterSchedulerSlideTitle").textContent,
    status: app.el("interpreterSchedulerStatus").textContent,
    src: app.el("interpreterSchedulerImage").src,
    alt: app.el("interpreterSchedulerImage").alt,
    prevDisabled: app.el("interpreterSchedulerPrev").disabled,
    nextDisabled: app.el("interpreterSchedulerNext").disabled,
  });
  const openCard = () => {
    app.el("scenarioGrid").children[personas.findIndex(({ id }) => id === "som")].click();
    app.node(stages.findIndex(({ title }) => title === "Appointment Confirmation & Pre-Visit")).click();
    return app.el("connectionGrid").children.find((c) => c.dataset.solutionId === "in-person");
  };
  return { app, modal, slide, openCard };
}

test("Interpreter Scheduler gallery markup is labelled and served from public/media with URL-encoded filenames", () => {
  const modal = html.match(/<dialog id="interpreterSchedulerModal"[\s\S]*?<\/dialog>/)[0];
  assert.match(modal, /aria-labelledby="interpreterSchedulerModalTitle"/);
  assert.match(modal, /<h2 id="interpreterSchedulerModalTitle">Interpreter Scheduler<\/h2>/);
  assert.match(modal, /class="telehealth-eyebrow">Abdi’s journey · Appointment Confirmation &amp; Pre-Visit/);
  assert.match(modal, /id="interpreterSchedulerModalClose"[^>]*type="button" aria-label="Close Interpreter Scheduler images"/);
  assert.match(modal, /id="interpreterSchedulerPrev"[^>]*type="button" aria-label="Previous image">&larr; Previous</);
  assert.match(modal, /id="interpreterSchedulerNext"[^>]*type="button" aria-label="Next image">Next &rarr;</);
  assert.match(modal, /id="interpreterSchedulerStatus"[^>]*aria-live="polite">1 of 5</);
  assert.match(modal, /src="public\/media\/Interpreter%20Scheduler\.Dashboard%20Overview\.png"/);
  assert.match(css, /\.scheduler-image \{[^}]*max-width: 100%[^}]*height: auto[^}]*object-fit: contain/);
  assert.doesNotMatch(css, /\.scheduler-image \{[^}]*object-fit: cover/);
  assert.match(css, /#interpreterSchedulerModal \.image-modal-close:focus-visible,/);

  const { app } = schedulerApp();
  const data = vm.createContext({});
  vm.runInContext(source.slice(0, source.indexOf("const scenarioGrid =")) + "\nthis.slides = interpreterSchedulerSlides;", data);
  assert.deepEqual(Array.from(data.slides, ({ title, file }) => [title, file]), schedulerSlides);
  for (const { file, src, alt } of data.slides) {
    assert.ok(require("node:fs").existsSync(resolve(__dirname, "../public/media", file)), file);
    assert.equal(src, `public/media/${file.replaceAll(" ", "%20")}`);
    assert.equal(decodeURIComponent(new URL(src, "https://coreyboltamn.github.io/essentia-patient-journey-language-access-presenter/").pathname),
      `/essentia-patient-journey-language-access-presenter/public/media/${file}`);
    assert.match(alt, /^Interpreter Scheduler /);
  }
  assert.equal(app.el("interpreterSchedulerModal").open, false, "Gallery stays closed on load");
});

test("Abdi's Appointment Interpreter Scheduler card opens the gallery at Dashboard and navigates in order with clear boundaries", () => {
  const { app, modal, slide, openCard } = schedulerApp();
  const card = openCard();
  assert.equal(card.children[0].textContent, "In-person Interpreter using Interpreter Scheduling tool");
  assert.match(card.className, /connection-preferred/);
  assert.match(card.className, /connection-clickable/);
  assert.equal(card.role, "button");
  assert.equal(card.tabindex, "0");
  assert.equal(card["aria-haspopup"], "dialog");
  assert.equal(card["aria-label"], "In-person Interpreter using Interpreter Scheduling tool: view Interpreter Scheduler images");

  app.el("playBtn").click();
  card.click();
  assert.equal(modal.open, true);
  assert.equal(app.state().auto, null, "Opening the gallery stops autoplay");
  assert.equal(app.activeElement(), app.el("interpreterSchedulerNext"), "Focus moves into the dialog");
  assert.deepEqual(slide(), { title: "Dashboard", status: "1 of 5", src: "public/media/Interpreter%20Scheduler.Dashboard%20Overview.png",
    alt: slide().alt, prevDisabled: true, nextDisabled: false });

  const seen = [slide().title];
  for (let i = 1; i < schedulerSlides.length; i += 1) {
    app.el("interpreterSchedulerNext").click();
    seen.push(slide().title);
    assert.equal(slide().status, `${i + 1} of 5`);
    assert.equal(slide().src, `public/media/${encodeURIComponent(schedulerSlides[i][1])}`);
  }
  assert.deepEqual(seen, schedulerSlides.map(([title]) => title));
  assert.equal(slide().nextDisabled, true, "Next is disabled on the last image");
  assert.equal(slide().prevDisabled, false);
  assert.equal(app.activeElement(), app.el("interpreterSchedulerPrev"), "Focus leaves the disabled Next button");
  app.el("interpreterSchedulerNext").click();
  assert.equal(slide().title, "Reporting", "Next does not wrap past Reporting");

  for (let i = schedulerSlides.length - 2; i >= 0; i -= 1) {
    app.el("interpreterSchedulerPrev").click();
    assert.equal(slide().title, schedulerSlides[i][0]);
  }
  assert.equal(slide().prevDisabled, true, "Previous is disabled on the first image");
  app.el("interpreterSchedulerPrev").click();
  assert.equal(slide().title, "Dashboard", "Previous does not wrap before Dashboard");
  assert.equal(app.state().sIndex, 1, "Gallery navigation does not move the journey");

  let restored = 0;
  card.focus = () => { restored += 1; };
  app.el("interpreterSchedulerNext").click();
  app.el("interpreterSchedulerNext").click();
  app.el("interpreterSchedulerModalClose").click();
  assert.equal(modal.open, false);
  assert.equal(restored, 1, "Focus returns to the card");

  card.handlers.keydown({ key: "Enter", preventDefault() {} });
  assert.equal(modal.open, true);
  assert.equal(slide().title, "Dashboard", "Reopening resets to Dashboard");
  modal.handlers.click({ target: app.el("interpreterSchedulerImage") });
  assert.equal(modal.open, true, "Clicks on the image keep the dialog open");
  modal.handlers.click({ target: modal });
  assert.equal(modal.open, false, "Backdrop click closes the dialog");
  card.handlers.keydown({ key: " ", preventDefault() {} });
  assert.equal(modal.open, true, "Space opens the dialog");
  modal.close();
  assert.equal(restored, 3);
  assert.deepEqual(app.opened, []);
  assert.equal(app.el("vriOpiVideoModal").open, undefined, "Video modal is not opened");
  assert.equal(app.el("telehealthModal").open, undefined, "Telehealth modal is not opened");
});

test("Interpreter Scheduler gallery supports arrow keys and traps Tab focus while open", () => {
  const { app, modal, slide, openCard } = schedulerApp();
  openCard().click();
  let prevented = 0;
  const key = (k, shiftKey = false) => modal.handlers.keydown({ key: k, shiftKey, preventDefault() { prevented += 1; } });

  key("ArrowLeft");
  assert.equal(slide().title, "Dashboard");
  key("ArrowRight");
  key("ArrowRight");
  assert.equal(slide().title, "Calendar");
  key("ArrowLeft");
  assert.equal(slide().title, "Admin");
  for (let i = 0; i < 6; i += 1) key("ArrowRight");
  assert.equal(slide().title, "Reporting");
  assert.equal(prevented, 10);
  key("Escape");
  assert.equal(prevented, 10, "Escape is left to the native dialog cancel behavior");
  assert.equal(app.state().sIndex, 1, "Arrow keys do not move the journey");

  const close = app.el("interpreterSchedulerModalClose");
  const prev = app.el("interpreterSchedulerPrev");
  prev.focus();
  prevented = 0;
  key("Tab");
  assert.equal(app.activeElement(), close, "Tab wraps from the last enabled control (Previous) to Close");
  key("Tab", true);
  assert.equal(app.activeElement(), prev, "Shift+Tab wraps from Close to the last control");
  assert.equal(prevented, 2);
  app.el("vriOpiVideoModal").focus();
  key("Tab");
  assert.equal(app.activeElement(), close, "Focus outside the controls is pulled back into the dialog");
});

test("Interpreter Scheduler gallery is scoped to Abdi's Appointment Confirmation & Pre-Visit card", () => {
  const { app, modal } = schedulerApp();
  for (const [pIndex, persona] of personas.entries()) {
    app.el("scenarioGrid").children[pIndex].click();
    for (const [sIndex, stage] of stages.entries()) {
      app.node(sIndex).click();
      for (const card of app.el("connectionGrid").children) {
        const scoped = persona.id === "som" && stage.title === "Appointment Confirmation & Pre-Visit" && card.dataset.solutionId === "in-person";
        assert.equal(/view Interpreter Scheduler images/.test(card["aria-label"] ?? ""), scoped, `${persona.name} ${stage.title} ${card.dataset.solutionId}`);
        if (card.dataset.solutionId === "in-person" && !scoped) {
          assert.doesNotMatch(card.className, /connection-clickable/);
          assert.equal(card.handlers.click, undefined);
        }
      }
    }
  }
  assert.equal(modal.open, false);
});
