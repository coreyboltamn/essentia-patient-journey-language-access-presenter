const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

// Evaluate only the data and selectors, before the browser DOM bindings.
const source = readFileSync(resolve(__dirname, "../app.js"), "utf8");
const context = vm.createContext({});
vm.runInContext(source.slice(0, source.indexOf("const scenarioGrid ="))
  + "\nthis.data = { personas, stages, solutionCatalog, connectionsFor };", context);
const { personas, stages, solutionCatalog, connectionsFor } = context.data;

test("catalog contains the canonical solutions with stable IDs", () => {
  assert.deepEqual({ ...solutionCatalog }, {
    "vri-opi": "VRI/OPI",
    "in-person": "In-person Interpreter using Interpreter Scheduling tool",
    jaide: "Jaide AI Translation and Live Speech",
    teladoc: "Telehealth integration with Teladoc",
    epic: "Epic integration",
    "patient-line": "Patient Line",
    mobile: "Mobile Device Access",
    "smart-tv": "Smart TV integration",
    website: "Website",
  });
});

test("all seven stages map valid, unique IDs and collectively show all solutions", () => {
  assert.equal(stages.length, 7);
  const represented = new Set();
  for (const stage of stages) {
    const ids = stage.connections.map(({ id }) => id);
    assert.equal(new Set(ids).size, ids.length);
    for (const connection of stage.connections) {
      assert.ok(Object.hasOwn(solutionCatalog, connection.id), connection.id);
      represented.add(connection.id);
      for (const personaKey of connection.personas || []) {
        assert.ok(personas.some(({ id }) => id === personaKey));
      }
    }
  }
  assert.deepEqual([...represented].sort(), Object.keys(solutionCatalog).sort());
});

for (const persona of personas) {
  test(`${persona.name}: meaningful stage-specific cards at every step`, () => {
    const descriptions = new Set();
    const selections = new Set();
    for (const stage of stages) {
      const cards = connectionsFor(stage, persona.id);
      assert.ok(cards.length >= 2 && cards.length <= 6, stage.title);
      selections.add(cards.map(({ id }) => id).join(","));
      for (const card of cards) {
        assert.equal(card.label, solutionCatalog[card.id]);
        assert.ok(card.description.length > 70, `${stage.title}: ${card.id}`);
        assert.doesNotMatch(card.description, /Connected to this step/);
        assert.ok(!descriptions.has(card.description), `Repeated copy: ${card.id}`);
        descriptions.add(card.description);
      }
    }
    assert.ok(selections.size > 3, "Selections should vary with the stage");
  });
}

test("ASL cards exclude audio options and retain qualified visual workflows and AI safeguards", () => {
  for (const [index, stage] of stages.entries()) {
    const cards = connectionsFor(stage, "joanna");
    assert.ok(!cards.some(({ id }) => ["patient-line", "teladoc"].includes(id)));
    const ai = cards.find(({ id }) => id === "jaide");
    assert.equal(Boolean(ai), index === 5);
    if (ai) {
      assert.match(ai.description, /qualified review.*qualified ASL interpretation/);
      assert.match(ai.description, /do not provide ASL interpretation or replace a qualified interpreter/);
    }
    for (const card of cards) {
      if (card.id === "epic") continue;
      assert.match(card.description, /qualified.*ASL/i);
      if (card.id === "vri-opi") assert.match(card.description, /VRI/);
      if (["mobile", "smart-tv"].includes(card.id)) {
        assert.match(card.description, /configured accessible video|configured accessible mobile video/);
      }
    }
  }
});

test("all personas' stage preferences use valid visible solution IDs", () => {
  const expected = { span: [
    ["patient-line"],
    ["patient-line"],
    ["vri-opi"],
    ["vri-opi"],
    ["smart-tv", "vri-opi", "epic"],
    ["jaide"],
    ["patient-line"],
  ], som: [
    ["patient-line"],
    ["in-person"],
    ["in-person"],
    ["in-person"],
    ["smart-tv", "epic"],
    ["jaide"],
    ["patient-line"],
  ], tele: [
    ["patient-line"],
    ["teladoc"],
    ["teladoc"],
    ["teladoc"],
    ["mobile", "vri-opi", "in-person", "epic"],
    ["jaide"],
    ["patient-line", "teladoc"],
  ], joanna: [
    ["website"],
    ["in-person"],
    ["vri-opi", "in-person"],
    ["vri-opi", "in-person"],
    ["vri-opi", "in-person", "epic"],
    ["vri-opi", "jaide"],
    ["vri-opi", "mobile", "in-person"],
  ] };
  stages.forEach((stage, index) => {
    for (const persona of personas) {
      const preferred = expected[persona.id]?.[index] || [];
      assert.deepEqual(Array.from(stage.preferredConnections[persona.id] || []), preferred);
      assert.equal(new Set(preferred).size, preferred.length);
      for (const id of preferred) assert.ok(Object.hasOwn(solutionCatalog, id));
      const cards = connectionsFor(stage, persona.id);
      assert.deepEqual(
        Array.from(cards.filter(({ preferred }) => preferred), ({ id }) => id),
        preferred,
      );
    }
  });
  const { preferredConnections, ...unmappedStage } = stages[0];
  for (const persona of personas) {
    assert.ok(connectionsFor(unmappedStage, persona.id).every(({ preferred }) => preferred === false));
  }
});

test("Website and ongoing in-person additions are Joanna-only and use existing canonical labels", () => {
  for (const persona of personas) {
    assert.equal(connectionsFor(stages[0], persona.id).some(({ id }) => id === "website"), persona.id === "joanna");
    assert.equal(connectionsFor(stages[6], persona.id).some(({ id }) => id === "in-person"), persona.id === "joanna");
  }
});

test("Teladoc is tied to Tran's virtual stages and all clinical AI materials require review", () => {
  for (const [index, stage] of stages.entries()) {
    for (const persona of personas) {
      assert.equal(
        connectionsFor(stage, persona.id).some(({ id }) => id === "teladoc"),
        persona.id === "tele" && [1, 2, 3, 6].includes(index),
      );
    }
    const ai = connectionsFor(stage, "span").find(({ id }) => id === "jaide");
    if (ai && index !== 0) assert.match(ai.description, /qualified review/);
  }
  const html = readFileSync(resolve(__dirname, "../index.html"), "utf8");
  assert.match(html, /AI translation\/live speech does not replace qualified interpreters/);
  assert.match(html, /availability depends on configured services/);
});
