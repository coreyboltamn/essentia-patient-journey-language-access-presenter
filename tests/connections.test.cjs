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
    "jaide-live-speech": "Jaide AI Live Speech",
    jaide: "Jaide AI Translation and Live Speech",
    teladoc: "Telehealth",
    epic: "EPIC Integration",
    "patient-line": "Patient Line",
    mobile: "Mobile Device Access",
    "smart-tv": "Smart TV Integration",
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
        const connection = stage.connections.find(({ id }) => id === card.id);
        assert.equal(card.label, connection.labelByPersona?.[persona.id] ?? solutionCatalog[card.id]);
        assert.doesNotMatch(`${card.label} ${card.description}`, /teladoc/i);
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
    ["jaide-live-speech"],
    ["vri-opi"],
    ["smart-tv", "vri-opi", "epic"],
    ["jaide"],
    ["patient-line", "epic", "jaide"],
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

test("Maria's check-in highlights Jaide AI Live Speech and VRI/OPI, and her discharge label is Jaide AI Translation", () => {
  const checkIn = stages.find(({ title }) => title === "Arrival & Check-In");
  const discharge = stages.find(({ title }) => title === "Discharge & Transition of Care");
  const mariaCheckIn = connectionsFor(checkIn, "span");
  const speech = mariaCheckIn.find(({ id }) => id === "jaide-live-speech");
  const interpreter = mariaCheckIn.find(({ id }) => id === "vri-opi");
  assert.equal(speech.label, "Jaide AI Live Speech");
  assert.equal(speech.preferred, true);
  assert.equal(interpreter.preferred, true);
  assert.ok(!connectionsFor(checkIn, "som").some(({ id }) => id === "jaide-live-speech"));

  assert.equal(connectionsFor(discharge, "span").find(({ id }) => id === "jaide").label, "Jaide AI Translation");
  for (const persona of ["som", "tele", "joanna"]) {
    assert.equal(connectionsFor(discharge, persona).find(({ id }) => id === "jaide").label, solutionCatalog.jaide);
  }
});

test("Maria's pilot pairs patient and Essentia actions in every connection box", () => {
  let count = 0;
  for (const stage of stages) {
    for (const card of connectionsFor(stage, "span")) {
      const lines = card.description.split("\n");
      assert.equal(lines.length, 2, `${stage.title}: ${card.id}`);
      assert.match(lines[0], /^Patient action: Maria .+\.$/);
      assert.match(lines[1], /^Essentia action: .+\.$/);
      assert.ok(lines.every((line) => line.length <= 200), `${stage.title}: ${card.id}`);
      count += 1;
    }
  }
  assert.equal(count, 31);
});

test("paired action wording covers every Abdi, Tran and Joanna connection card", () => {
  for (const [persona, name] of [["som", "Abdi"], ["tele", "Tran"], ["joanna", "Joanna"]]) {
    for (const stage of stages) {
      for (const card of connectionsFor(stage, persona)) {
        const lines = card.description.split("\n");
        assert.equal(lines.length, 2, `${name} ${stage.title}: ${card.id}`);
        assert.match(lines[0], new RegExp(`^Patient action: ${name} .+\\.$`));
        assert.match(lines[1], /^Essentia action: .+\.$/);
        assert.ok(lines.every((line) => line.length <= 200), `${name} ${stage.title}: ${card.id}`);
      }
    }
  }
});

test("paired persona copy leaves Maria's approved connection wording unchanged", () => {
  for (const stage of stages) {
    for (const card of connectionsFor(stage, "span")) {
      const original = stage.connections.find(({ id }) => id === card.id);
      assert.equal(card.description, original.descriptionByPersona?.span ?? original.description);
    }
  }
});

test("MyChart communication descriptions apply only to Maria's post-visit EPIC and Jaide options", () => {
  for (const [index, stage] of stages.entries()) {
    for (const persona of personas) {
      for (const card of connectionsFor(stage, persona.id)) {
        const targeted = index === 6 && persona.id === "span" && ["epic", "jaide"].includes(card.id);
        const original = stage.connections.find(({ id }) => id === card.id);
        assert.equal(card.description.includes("MyChart"), targeted);
        if (targeted) {
          assert.equal(card.preferred, true);
          assert.equal(card.description, original.descriptionByPersona.span);
        }
      }
    }
  }
});

test("Website and ongoing in-person additions are Joanna-only and use existing canonical labels", () => {
  for (const persona of personas) {
    assert.equal(connectionsFor(stages[0], persona.id).some(({ id }) => id === "website"), persona.id === "joanna");
    assert.equal(connectionsFor(stages[6], persona.id).some(({ id }) => id === "in-person"), persona.id === "joanna");
  }
});

test("Telehealth is tied to Tran's virtual stages and all clinical AI materials require review", () => {
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

test("external video links are limited to Maria's Appointment, Check-In and Discharge Jaide cards", () => {
  const expected = {
    "Appointment Confirmation & Pre-Visit": "https://www.youtube.com/watch?v=cQFljsXDylA&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=1",
    "Arrival & Check-In": "https://www.youtube.com/watch?v=qHtBNM9-cKQ&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=3",
    "Discharge & Transition of Care": "https://www.youtube.com/watch?v=NE72LS-x-rs&list=PL2nqsuaL4MUK7ZOcbzFeeTHJ8tJXyDerR&index=2",
  };
  for (const stage of stages) {
    for (const persona of personas) {
      for (const card of connectionsFor(stage, persona.id)) {
        const linkedId = stage.title === "Arrival & Check-In" ? "jaide-live-speech" : "jaide";
        const link = persona.id === "span" && card.id === linkedId ? expected[stage.title] ?? null : null;
        assert.equal(card.externalLink, link, `${persona.id} ${stage.title} ${card.id}`);
      }
    }
  }
  const discharge = connectionsFor(stages.find(({ title }) => title === "Discharge & Transition of Care"), "span")
    .find(({ id }) => id === "jaide");
  assert.equal(discharge.label, "Jaide AI Translation");
  assert.equal(discharge.preferred, true);
});
