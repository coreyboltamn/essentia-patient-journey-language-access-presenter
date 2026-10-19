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
      this.classList = { toggle() {} };
      this.style = { setProperty() {} };
      this.dataset = {};
    }
    set innerHTML(value) { this.children = []; }
    set id(value) { this.key = value; elements.set(value, this); }
    get id() { return this.key; }
    appendChild(child) { this.children.push(child); }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(name, handler) { this.handlers[name] = handler; }
    click() { if (!this.disabled) this.handlers.click(); }
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
  const context = vm.createContext({
    document,
    setInterval(callback) { tick = callback; return 1; },
    clearInterval() { tick = null; },
  });
  vm.runInContext(source, context);
  return {
    el: (id) => document.getElementById(id),
    node: (index) => document.getElementById("nodes").children[index].children[0],
    state: () => vm.runInContext("({ pIndex, sIndex, auto })", context),
    tick: () => tick(),
  };
}

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
    ["patient-line"], ["patient-line"], ["vri-opi"], ["vri-opi"],
    ["smart-tv", "vri-opi", "epic"], ["jaide"], ["patient-line"],
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
    assert.equal(app.state().pIndex, 1);
    assert.equal(app.state().sIndex, 3);
  }
});
