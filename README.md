# essentia-patient-journey-language-access-presenter

Presenter copy of the Essentia + AMN patient journey language access microsite.
Baseline copied from
[`coreyboltamn/essentia-patient-journey-language-access` at `2f12f2a`](https://github.com/coreyboltamn/essentia-patient-journey-language-access/commit/2f12f2a325f9232ba30b65f3e2db11802cce7a95).
All four personas, seven stages, solution mappings, descriptions and badge wording
are retained. Changes and deployment belong to this presenter repository only;
the original repository and its Pages settings are not changed.

## Presenter deployment

If GitHub Pages is enabled for this repository, its expected URL is
https://coreyboltamn.github.io/essentia-patient-journey-language-access-presenter/.
Deployment is not configured or verified by this change.

## Screen-sharing presentations

The live-demo callout, demo markers and presenter handoff controls have been
removed for a cleaner shared-screen experience. Scenario selection, timeline
navigation, stage details and AMN connections remain available.

### Presenter workflow

1. Enable **Presentation Mode** for screen sharing. It hides the hero, collapses
   supporting sections and places active-stage details beside highlighted AMN
   connections on laptop screens. The patient moment, what happens at this step,
   highlighted solution labels and persona badges remain visible.
   **Choose / change** shows the current persona and opens the scenario choices;
   **Common touchpoints**, **People and outcomes**, and
   **All options, descriptions and safety notes** reveal supporting content.
   All disclosures work with keyboard Enter/Space. Close them after reviewing
   supporting content to return to the compact view. Leaving Presentation Mode
   expands all four disclosures and restores full connection cards.
2. Walk the spine or use **Back** and **Next** to explore each stage.
   **Auto-play** advances the journey; **Pause** stops it.
3. Scenario selection, direct timeline selection, Back, Next and Restart stop
   autoplay. Restart returns to the first scenario and first step.
   Normal stage progression does not scroll the page.
4. In Maria’s journey, select any **VRI/OPI** connection card (click, Enter or
   Space) to open a video popup that plays
   `public/media/amn-ls-interpreter-video-impact-1920x1080-captions-2.mp4`
   with standard controls (no autoplay). Close with the × button, Escape or a
   backdrop click; the video pauses and focus returns to the card. Other
   personas’ VRI/OPI cards remain informational.
5. In Abdi’s **Appointment Confirmation & Pre-Visit** step, select the
   **In-person Interpreter using Interpreter Scheduling tool** card to open an
   Interpreter Scheduler image gallery. It always opens at **Dashboard** and
   steps through Dashboard, Admin, Calendar, Create Request and Reporting
   (`public/media/Interpreter Scheduler.*.png`) with Previous/Next or the
   Left/Right arrow keys. Previous is disabled on the first image and Next on
   the last (no wrap). Close with the × button, Escape or a backdrop click;
   focus returns to the card.
6. In Tran’s **Clinical Encounter** step, select **Telehealth** (click, Enter or
   Space) to view the single uploaded integrations image, `Designer (12).png`.
   The image scales without cropping. Close with the × button, Escape or a
   backdrop click; focus returns to the card. Other Telehealth cards are unchanged.

### Viewport expectations

- At 100% browser zoom, all 28 persona/stage combinations fit without vertical
  page scrolling at **1366×768** and **1440×900 CSS-pixel content viewports**,
  with supporting disclosures closed.
- At **768×900**, the panels stack; the longest states require a little vertical
  scrolling. At **375×812** and **320×568**, readable stacked content requires
  vertical scrolling. Only the timeline scrolls horizontally; it is a named,
  keyboard-focusable region. The header is not sticky on phone widths.
- Opening disclosures, enlarged text, browser zoom or a shorter content viewport
  can require scrolling. Content remains in normal flow: no fixed-height clipping,
  forced scaling, or locked page scrolling. Browser chrome and screen-sharing
  toolbars reduce available space, so choose the larger share area when possible.
- Normal browsing starts with Presentation Mode off and supporting content open.

Use fictional data for any separate demonstration. Scheduling and telehealth
examples are configured illustrative workflows, not proof of live deployments.
Use qualified interpretation for clinical decisions/consent and appropriate
qualified review of translated content. AI/live speech and audio-only telephony
are not ASL substitutes. Do not put credentials, PHI or invented demo URLs in this site.

### Journey regression checks

Run `node --test tests/*.test.cjs` (Node 18+) and `node --check app.js`.
The dependency-free tests cover callout removal, scenario/stage navigation,
autoplay, restart, presentation-mode disclosures, AMN connection mapping, ASL and
nonclinical AI safeguards. There is no build step.
Repeat the browser checks below when changing the journey controls.

No live technology integration is added. Publishing this copy requires deploying
this presenter repository, not the original site.

### Presenter validation

- [x] Copied baseline: all 22 original Node tests and `node --check app.js` pass.
- [x] Presenter regression suite: 23 tests pass, including disclosure reopening,
  mode toggling without journey changes, every persona/stage mapping and labels.
- [x] Chromium: all 28 states fit at both laptop viewport sizes above; no horizontal
  page overflow at widths 1366, 1440, 768, 375 or 320.
- [x] Browser checks: timeline, Back/Next, autoplay/pause, restart, persona changes,
  keyboard disclosures and returning to normal mode.
- [x] `node --check app.js`, `node --check touchpoints.js` and `git diff --check`.
- [x] Secret scans pass; CodeQL reports zero JavaScript alerts. The bundled
  automated review runner was unavailable; a separate read-only review found
  no issues.

Local Chromium used the system-font fallback because Google Fonts could not be
resolved in the validation environment. No JavaScript errors were reported;
the inherited missing favicon also returned 404. Font metrics and other browsers
may change wrapping, so verify the actual sharing setup before presenting.

## Inherited source notes

The following baseline documentation describes the original site's content and
history. Historical test counts, reviews and Pages deployment IDs below refer
to the source repository, not a deployment of this presenter copy.
In compact Presentation Mode, non-highlighted cards and all descriptions are
available through **All options, descriptions and safety notes**.

## AMN solution connections

The connection section uses one stable-ID solution catalog in `app.js`.
Each stage has explicit solution IDs and patient/staff workflow descriptions.
Patient Line and approved written content support access/preparation; qualified
interpretation and configured endpoints support encounters; Smart TV appears
for inpatient care; discharge and follow-up emphasize reviewed instructions and
continued communication. Telehealth cards appear only in Tran's virtual-visit
preparation, check-in, encounter and ongoing-care stages.

Joanna's cards omit Patient Line audio, use VRI rather than OPI
for ASL, and require qualified ASL interpreters and configured accessible video
workflows for mobile/TV endpoints. Her discharge Jaide card supports reviewed
written materials alongside qualified ASL interpretation, not an ASL substitute.
AI is not a substitute for qualified medical
interpretation; written clinical materials require appropriate qualified review.
These are editorial examples, not validated integration or language availability.
No APIs, credentials, PHI collection, automatic EPIC synchronization or deployed
capabilities were added. The approved palette, journey visuals, stage mapping,
scenarios are retained.

### Maria's highlighted connections

Maria's per-stage preferences use stable solution IDs in `stage.preferredConnections.span`.
Matching cards have a purple border, tinted background, bold heading and a visible
**Maria** badge. Other options stay readable; other personas use their own preferences.
Highlights update with timeline selection, Back/Next, autoplay and Restart in
both normal and Presentation Mode.

| Stage | Highlighted connection(s) |
| --- | --- |
| Awareness & Access to Care | Patient Line |
| Appointment Confirmation & Pre-Visit | Patient Line |
| Arrival & Check-In | Jaide AI Live Speech, VRI/OPI |
| Clinical Encounter | VRI/OPI |
| Treatment / Inpatient Stay | Smart TV Integration, VRI/OPI, EPIC Integration |
| Discharge & Transition of Care | Jaide AI Translation |
| Post Visit & Ongoing Care | Patient Line, EPIC Integration, Jaide AI Translation and Live Speech |

Maria's post-visit EPIC and Jaide descriptions also include “Enable MyChart Communication”.

### Abdi's highlighted connections

Abdi uses the same highlighting via `stage.preferredConnections.som`, with a
**Abdi** badge. Non-highlighted options remain visible and readable.
Maria's mappings and badge wording are unchanged. Highlights follow navigation,
autoplay and persona switching in normal and Presentation Mode.

| Stage | Highlighted connection(s) |
| --- | --- |
| Awareness & Access to Care | Patient Line |
| Appointment Confirmation & Pre-Visit | In-person Interpreter using Interpreter Scheduling tool |
| Arrival & Check-In | In-person Interpreter using Interpreter Scheduling tool |
| Clinical Encounter | In-person Interpreter using Interpreter Scheduling tool |
| Treatment / Inpatient Stay | Smart TV Integration, EPIC Integration |
| Discharge & Transition of Care | Jaide AI Translation and Live Speech (one combined catalog card) |
| Post Visit & Ongoing Care | Patient Line |

Interpreter Scheduler uses the existing `in-person` ID and label; Jaide AI
Translation and Live Speech remain the existing combined `jaide` card.

### Tran's highlighted connections

Tran uses the same stable-ID mapping in `stage.preferredConnections.tele`, with
the badge text exactly **Tran**. All preferred cards receive the existing purple
border, tinted background and bold heading; other options remain visible.
Highlights follow navigation, autoplay and persona switching in normal and
Presentation Mode, without changing Maria, Abdi or Joanna.

| Stage | Highlighted connection(s) |
| --- | --- |
| Awareness & Access to Care | Patient Line |
| Appointment Confirmation & Pre-Visit | Telehealth |
| Arrival & Check-In | Telehealth |
| Clinical Encounter | Telehealth |
| Treatment / Inpatient Stay | Mobile Device Access, VRI/OPI, EPIC Integration, In-person Interpreter using Interpreter Scheduling tool |
| Discharge & Transition of Care | Jaide AI Translation and Live Speech (one combined catalog card) |
| Post Visit & Ongoing Care | Patient Line, Telehealth |

The check-in Telehealth card is Tran-only. All four virtual-stage cards use the
title exactly **Telehealth** and describe a **configured telehealth workflow**
with qualified interpreter guidance. The internal `teladoc` ID is retained to
preserve mappings, as are `in-person` for Interpreter Scheduler and `jaide` for
the combined translation/live-speech option.

In Tran's **Clinical Encounter** step, clicking (or pressing Enter/Space on) the
highlighted Telehealth card also opens a modal showing five technology integration
categories with platform names as text-only icon chips (no third-party logos),
an AMN Integration Benefits panel, and a “40+ Technology Partners” summary.
The responsive cards stack on smaller screens. The modal closes with the
X button, a backdrop click or Escape.

Verification: `node --test tests/*.test.cjs` passed all 20 tests, including exact
stage mappings, badge wording, Back/Next, timeline navigation, autoplay, persona
switching, Restart and Presentation Mode. `node --check app.js` and
`git diff --check` passed. Chromium checks covered every persona and stage in both
modes at widths 1366, 1440, 768, 375 and 320: highlights and secondary cards
rendered correctly without page overflow. Google Fonts was unavailable, so these
checks used fallback fonts; the site also has no favicon.

### Joanna's highlighted connections

Joanna uses `stage.preferredConnections.joanna` and the same purple border,
tinted background and bold heading as the other personas. Every highlighted
card has exactly a **Joanna** badge; other available options remain visible.
Highlights follow navigation, autoplay, persona switching, Restart and
Presentation Mode.

| Stage | Highlighted connection(s) |
| --- | --- |
| Awareness & Access to Care | Website |
| Appointment Confirmation & Pre-Visit | In-person Interpreter using Interpreter Scheduling tool |
| Arrival & Check-In | In-person Interpreter using Interpreter Scheduling tool, VRI/OPI |
| Clinical Encounter | In-person Interpreter using Interpreter Scheduling tool, VRI/OPI |
| Treatment / Inpatient Stay | In-person Interpreter using Interpreter Scheduling tool, VRI/OPI, EPIC Integration |
| Discharge & Transition of Care | Jaide AI Translation and Live Speech (one combined catalog card), VRI/OPI |
| Post Visit & Ongoing Care | In-person Interpreter using Interpreter Scheduling tool, VRI/OPI, Mobile Device Access |

Website uses the new `website` ID because no Website connection card existed.
It and the added ongoing-care In-person card are Joanna-only. Existing
`in-person`, `jaide`, `vri-opi`, `epic` and `mobile` IDs and labels are reused;
Maria, Abdi and Tran's cards and preferences are unchanged.

Verification: all 22 tests pass with `node --test tests/*.test.cjs`;
`node --check app.js` and `git diff --check` pass. Chromium checks covered
all seven stages, exact badges, persona switching, bold preferred headings
and visible secondary cards in both modes at widths 1366, 1440, 768, 375 and
320, without page overflow.

### Connection regression checks

Run `node --test tests/connections.test.cjs` (Node 18+). All eight tests passed:
canonical names/IDs, all seven stages, representation of all eight solutions,
stage-specific descriptions across all four personas, ASL-safe variants,
virtual-visit filtering and AI review safeguards. `node --check app.js` and
`git diff --check` also passed. No dependencies or build tools were added.
CodeQL reported zero JavaScript alerts. Automated code review was unavailable
because of a model configuration error; a separate read-only review found no
significant issues.

The latest existing Pages deployment (`38948324313`, commit `b08191ac`) succeeded,
as confirmed by its deployment logs. **This PR must still be merged and deployed
before these new connections appear on the public site.**

## Layout repair

The design reference is commit `bcea34f1d25c1cfd51a21f56b788db2c39c160bb`.
The repair restores its light hero, navy/purple/teal palette, and colored
touchpoint cards while keeping the current patient content and script extensions.
It is a normal repair commit, not a history reset.

The current base stylesheet had lost the touchpoint layout and the color
variables used by the interpreter stylesheet. This left touchpoints as plain
lists and the selected tab with white text on a transparent background.
The timeline also positioned the avatar at the track edges rather than the
centers of its seven steps, and its line, dots, and avatar used different heights.
Presenter-note visibility was reversed from the reference design.

The repair restores those styles and visibility rules, aligns the timeline,
lets header/journey controls wrap and stacks touchpoint cards on mobile.
Only the timeline intentionally scrolls sideways.

### Regression checks

This is a static HTML/CSS/JavaScript site using Node's built-in test runner,
with no build dependencies. Serve the repository with a static server and check
under `/essentia-patient-journey-language-access-presenter/`, not just at `/`.
To repeat the checks in a browser:

1. Check 1366×768 and 1440×900 laptops, plus widths 768, 375 and 320 pixels.
   In Presentation Mode, the spine and navigation should
   fit together without scrolling. Cards and controls should fit on mobile;
   only the timeline should scroll horizontally.
2. Select each of the four scenarios and all seven timeline steps. Check the
   patient details, highlighted touchpoints, and marker/line alignment, including
   the first and last steps.
3. Confirm no live-demo callout, demo markers or presenter handoff controls appear.
   Joanna must see qualified ASL VRI, never audio OPI or Jaide as ASL substitutes.
4. Exercise Back, Next, Restart Journey, and Auto-play followed by Pause. Restart
   should return to the first scenario and step.
5. Expand/collapse **Choose / change** and **Common touchpoints** using the
   keyboard. Detail remains available in both modes.
6. Confirm no console errors, layout gaps or orphaned callout borders remain.

### Deployment and limitations

Pages run `38933860419` successfully deployed `b0c68667417440d9c8bac12eda4b6b6dd2baad2a`
from `main`; its deployment log confirms the public URL above. No Pages settings
were changed. Direct public-site access failed DNS resolution in the repair
environment, so its live appearance and asset contents could not be verified.
Local checks used the system font fallback when Google Fonts was unavailable;
other browsers and physical devices have not been checked.

**The repair must be merged and GitHub Pages must finish deploying before the
public site changes.** A successful earlier deployment does not publish this PR.
