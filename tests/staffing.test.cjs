const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(resolve(__dirname, "../staffing.js"), "utf8");
const html = readFileSync(resolve(__dirname, "../staffing.html"), "utf8");
const css = readFileSync(resolve(__dirname, "../staffing.css"), "utf8");

function staffing() {
  const elements = new Map();
  class Element {
    constructor() {
      this.children = [];
      this.attributes = {};
      this.handlers = {};
      this.value = "";
      this.open = false;
      this.disabled = false;
      const classes = new Set();
      this.classList = {
        toggle(name) {
          if (classes.has(name)) { classes.delete(name); return false; }
          classes.add(name); return true;
        },
        contains: (name) => classes.has(name),
      };
    }
    appendChild(child) { this.children.push(child); return child; }
    replaceChildren() { this.children = []; }
    setAttribute(name, value) { this.attributes[name] = value; }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name, callback) { this.handlers[name] = callback; }
    click() { if (!this.disabled) this.handlers.click?.({ target: this }); }
    input(value) { this.value = value; this.handlers.input?.({ target: this }); }
    focus() { document.activeElement = this; }
  }
  for (const [, id] of html.matchAll(/\bid="([^"]+)"/g)) elements.set(id, new Element());
  const document = {
    body: new Element(),
    getElementById: (id) => elements.get(id),
    createElement: () => new Element(),
  };
  let prints = 0;
  const window = {
    handlers: {},
    addEventListener(name, callback) { this.handlers[name] = callback; },
    print() { this.handlers.beforeprint(); prints++; this.handlers.afterprint(); },
  };
  const context = vm.createContext({ document, window, Intl });
  vm.runInContext(source + "\nthis.api = { staffingScenarios, staffingStages, staffingComparison, staffingMoney, staffingComparisonText };", context);
  return {
    ...context.api, el: (id) => elements.get(id),
    scenario: (index) => elements.get("staffingScenarios").children[index],
    stage: (index) => elements.get("staffingTimeline").children[index],
    summary: () => elements.get("staffingSummaryContent").children.map((child) => child.textContent).join("\n"),
    window, document, prints: () => prints,
  };
}

test("standalone page loads only shared palette and staffing assets with native accessible controls", () => {
  assert.match(html, /href="styles.css"/);
  assert.match(html, /href="staffing.css"/);
  assert.match(html, /src="staffing.js" defer/);
  assert.match(html, /href="index.html"/);
  assert.doesNotMatch(html, /src="(?:app|touchpoints)\.js"|<video|<iframe/);
  assert.match(html, /No PHI, PII, or confidential information/);
  assert.match(html, /refreshing or closing loses them/i);
  assert.match(html, /Licensing, credentialing, and facility approval are required/);
  assert.match(css, /\.staffing-timeline[^}]*overflow-x: auto/s);
  assert.match(css, /@media print/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|XMLHttpRequest|innerHTML|setInterval/);
});

test("four distinct fictional scenarios contain complete, differentiated content at all seven stages", () => {
  const app = staffing();
  assert.equal(app.staffingScenarios.length, 4);
  assert.equal(app.staffingStages.length, 7);
  assert.equal(app.staffingStages[0], "Demand discovery");
  assert.equal(app.staffingStages[6], "Workforce review");
  const fields = Array.from({ length: 6 }, () => new Set());
  for (const scenario of app.staffingScenarios) {
    assert.match(scenario.description, /fictional/i);
    assert.equal(scenario.stages.length, 7);
    for (const stage of scenario.stages) {
      assert.equal(stage.length, 6);
      stage.forEach((value, index) => {
        assert.ok(value.length > 35, value);
        assert.ok(!fields[index].has(value), `Repeated stage field: ${value}`);
        fields[index].add(value);
      });
      assert.match(stage[2], /\?/);
    }
  }
});

test("navigation has boundaries, seven selectable stages and persistent native button focus", () => {
  const app = staffing();
  assert.equal(app.el("staffingBack").disabled, true);
  assert.equal(app.scenario(0).attributes["aria-pressed"], "true");
  assert.equal(app.stage(0).attributes["aria-current"], "step");
  app.stage(6).focus();
  app.stage(6).click();
  assert.equal(app.document.activeElement, app.stage(6));
  assert.equal(app.el("staffingNext").disabled, true);
  assert.equal(app.stage(0).attributes["aria-current"], undefined);
  assert.equal(app.stage(6).attributes["aria-pressed"], "true");
  assert.equal(app.el("staffingStageTitle").textContent, "Workforce review");
  app.el("staffingBack").click();
  assert.equal(app.el("staffingStageTitle").textContent, "Deployment & support");
  app.el("staffingNext").click();
  app.el("staffingRestart").click();
  assert.equal(app.el("staffingBack").disabled, true);
  app.scenario(2).focus();
  app.scenario(2).click();
  assert.equal(app.document.activeElement, app.scenario(2));
  assert.equal(app.scenario(0).attributes["aria-pressed"], "false");
  assert.equal(app.el("staffingContext").textContent, "Allied imaging capacity");
  assert.equal(app.stage(0).attributes["aria-current"], "step");
});

test("every scenario and stage renders its own six conversation fields", () => {
  const app = staffing();
  const ids = ["staffingPain", "staffingStakeholders", "staffingQuestions", "staffingSolution", "staffingMeasures", "staffingSuggested"];
  app.staffingScenarios.forEach((scenario, scenarioIndex) => {
    app.scenario(scenarioIndex).click();
    scenario.stages.forEach((stage, stageIndex) => {
      app.stage(stageIndex).click();
      ids.forEach((id, fieldIndex) => assert.equal(app.el(id).textContent, stage[fieldIndex]));
      assert.match(app.el("staffingNotesLabel").textContent, new RegExp(scenario.name));
      assert.ok(app.el("staffingNotesLabel").textContent.includes(app.staffingStages[stageIndex]));
    });
  });
});

test("notes and action plans stay isolated across all scenarios and stages, survive restart, and do not persist across reload", () => {
  const app = staffing();
  for (let scenario = 0; scenario < 4; scenario++) {
    app.scenario(scenario).click();
    app.el("staffingAction").input(`Plan ${scenario}`);
    for (let stage = 0; stage < 7; stage++) {
      app.stage(stage).click();
      assert.equal(app.el("staffingNotes").value, "");
      app.el("staffingNotes").input(`Note ${scenario}:${stage}`);
    }
  }
  for (let scenario = 0; scenario < 4; scenario++) {
    app.scenario(scenario).click();
    assert.equal(app.el("staffingAction").value, `Plan ${scenario}`);
    for (let stage = 0; stage < 7; stage++) {
      app.stage(stage).click();
      assert.equal(app.el("staffingNotes").value, `Note ${scenario}:${stage}`);
      assert.ok(app.summary().includes(`Note ${scenario}:${stage}`));
    }
  }
  app.el("staffingRestart").click();
  assert.equal(app.el("staffingNotes").value, "Note 3:0");
  assert.equal(staffing().el("staffingNotes").value, "");
});

test("summary uses literal safe text, includes all scenarios, action plan, and current next step", () => {
  const app = staffing();
  const literal = '<img src=x onerror="alert(1)"> & <script>bad()</script>';
  app.el("staffingNotes").input(literal);
  app.el("staffingAction").input("Ask the nursing sponsor to review options.");
  app.scenario(3).click();
  app.stage(5).click();
  app.el("staffingNotes").input("Rehab follow-up");
  app.el("staffingAction").input("Review site allocation.");
  assert.ok(app.summary().includes(literal));
  assert.match(app.summary(), /Urgent nursing coverage/);
  assert.match(app.summary(), /Rehab follow-up/);
  assert.match(app.summary(), /Selected scenario: Allied rehab continuity/);
  assert.match(app.summary(), /Selected scenario action plan: Review site allocation/);
  assert.ok(app.summary().includes(app.staffingScenarios[3].stages[5][5]));
  assert.equal(app.el("staffingSummaryContent").children.find((child) => child.textContent === literal).children.length, 0);
});

test("button and native print both prepare a complete summary and restore its prior open state", () => {
  const app = staffing();
  app.el("staffingNotes").input("Print this observation.");
  app.el("staffingPrint").click();
  assert.equal(app.prints(), 1);
  assert.equal(app.el("staffingSummary").open, false);
  app.window.handlers.beforeprint();
  assert.equal(app.el("staffingSummary").open, true);
  assert.match(app.summary(), /Print this observation/);
  app.window.handlers.afterprint();
  assert.equal(app.el("staffingSummary").open, false);
  app.el("staffingSummary").open = true;
  app.window.handlers.beforeprint();
  app.window.handlers.afterprint();
  assert.equal(app.el("staffingSummary").open, true);
});

test("presentation toggle uses an isolated class and does not lose notes or selection", () => {
  const app = staffing();
  app.stage(4).click();
  app.el("staffingNotes").input("Keep this.");
  app.el("staffingPresentation").click();
  assert.equal(app.el("staffingPresentation").attributes["aria-pressed"], "true");
  assert.equal(app.document.body.classList.contains("staffing-compact"), true);
  assert.equal(app.document.body.classList.contains("presentation-mode"), false);
  app.el("staffingPresentation").click();
  assert.equal(app.el("staffingPresentation").attributes["aria-pressed"], "false");
  assert.equal(app.el("staffingNotes").value, "Keep this.");
  assert.equal(app.stage(4).attributes["aria-current"], "step");
});

test("comparison calculates weekly and full period costs, with higher, lower and equal signed differences", () => {
  const { staffingComparison: compare, staffingComparisonText: text } = staffing();
  const higher = compare(["40", "13", "90", "110"]);
  assert.equal(higher.weeklyInternal, 3600);
  assert.equal(higher.weeklyContingent, 4400);
  assert.equal(higher.weeklyDifference, 800);
  assert.equal(higher.totalInternal, 46800);
  assert.equal(higher.totalContingent, 57200);
  assert.equal(higher.totalDifference, 10400);
  assert.match(text(higher), /\+\$800.00 \(higher contingent cost\)/);
  assert.match(text(higher), /Full period:.*\+\$10,400.00/);
  assert.match(text(compare(["40", "13", "110", "90"])), /−\$800.00 \(lower contingent cost\)/);
  assert.match(text(compare(["40", "13", "90", "90"])), /difference \$0.00 \(equal cost/);
  assert.equal(compare(["0", "0", "0", "0"]).totalDifference, 0);
  assert.equal(compare(["1000", "104", "1000", "1000"]).totalInternal, 104000000);
});

test("comparison rejects empty, negative, nonfinite, malformed, and excessive values in every field", () => {
  const { staffingComparison: compare } = staffing();
  const invalid = ["", " ", "-1", "Infinity", "-Infinity", "NaN", "1e309", "abc", "10000000000"];
  for (let index = 0; index < 4; index++) {
    for (const value of invalid) {
      const values = ["40", "13", "90", "110"];
      values[index] = value;
      assert.equal(compare(values), null, `Field ${index}: ${value}`);
    }
  }
  assert.equal(compare(["40", "104.1", "90", "110"]), null);
  assert.equal(compare(["40", "13", "90"]), null);
});

test("fractional rates and rounded signed zero are formatted accurately", () => {
  const { staffingComparison: compare, staffingMoney: money, staffingComparisonText: text } = staffing();
  const result = compare(["37.5", "2.5", "99.25", "100.75"]);
  assert.equal(result.weeklyDifference, 56.25);
  assert.equal(result.totalDifference, 140.625);
  assert.equal(money(result.totalDifference, true), "+$140.63");
  assert.equal(money(-0.001, true), "$0.00");
  assert.equal(money(-0, true), "$0.00");
  assert.match(text(compare(["0.001", "104", "0", "1"])), /equal cost at displayed precision/);
});

test("input events update live comparison and printable assumptions, then clear stale valid results on invalid input", () => {
  const app = staffing();
  ["staffingHours", "staffingWeeks", "staffingOvertime", "staffingContingent"].forEach((id, index) => {
    app.el(id).input(["40", "4", "100", "120"][index]);
  });
  assert.match(app.el("staffingCostResult").textContent, /higher contingent cost/);
  assert.match(app.summary(), /40 hours\/week × 4 weeks/);
  assert.match(app.summary(), /Full period:.*\+\$3,200.00/);
  app.el("staffingContingent").input("80");
  assert.match(app.el("staffingCostResult").textContent, /lower contingent cost/);
  app.el("staffingContingent").input("");
  assert.match(app.el("staffingCostResult").textContent, /Enter all four values/);
  assert.match(app.summary(), /No complete valid comparison entered/);
  assert.doesNotMatch(app.summary(), /Assumptions:|Full period:/);
  let prevented = false;
  app.el("staffingCostForm").handlers.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
});
