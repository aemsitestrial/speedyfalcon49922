# Development Conventions — speedyfalcon49922

This file documents the project-specific rules that all code (human or AI-generated) must follow.
Read this before writing or editing any block code.

---

## Project Context

- **Type:** AEM Edge Delivery Services (EDS) — Universal Editor (crosswalk/xwalk) project
- **Brand:** Xcel Energy
- **Working branch:** `dev` → PR → `main`

### Xcel Energy Brand Colors
| Token | Hex | Usage |
|---|---|---|
| Brand red | `#C8102E` | Buttons, highlights |
| Teal | `#005F87` | Accent |
| Dark crimson | `#8B1A2C` | Announcement bar, dark sections |
| Cream | `#F5EDE8` | Nav background |
| Text | `#333` | Body text |

### Font
All blocks must use `Arial, sans-serif` — never Roboto, Inter, or other Google Fonts.

---

## CSS Rules (stylelint enforced — all 3 fail CI if violated)

### Rule 1 — Modern color syntax
```css
/* WRONG */
rgba(255, 255, 255, 0.75)

/* RIGHT */
rgb(255 255 255 / 75%)
```
- No commas inside `rgb()`
- Alpha as `%` not decimal
- Use `rgb()` not `rgba()`

### Rule 2 — Range media queries
```css
/* WRONG */
@media (max-width: 767px)
@media (min-width: 900px)

/* RIGHT */
@media (width <= 767px)
@media (width >= 900px)
```

### Rule 3 — No descending specificity
If you add `a`, `li`, or `a:hover` selectors at the end of a CSS file that conflict with earlier higher-specificity selectors, wrap them:
```css
/* stylelint-disable no-descending-specificity */
.my-block a { ... }
.my-block a:hover { ... }
/* stylelint-enable no-descending-specificity */
```
The disable comment must have a blank line before it and be ≤100 chars.

### Rule 4 — Commerce boilerplate link color override

This is a **boilerplate-commerce** project. The Commerce Dropin CSS has a global `a:any-link` rule (specificity 0,1,1) that sets links to a dark color. A plain `.my-block a { color: #fff; }` has the same specificity and loses to Commerce CSS when it loads later.

**Always use the block's own class as a parent when coloring links:**
```css
/* WRONG — loses to Commerce boilerplate */
.my-block-links a { color: #fff; }

/* RIGHT — specificity 0,3,1, always wins */
/* stylelint-disable no-descending-specificity */
.my-block .my-block-links a,
.my-block .my-block-links a:any-link {
  color: #fff;
}
/* stylelint-enable no-descending-specificity */
```

This applies to **any block that sets a custom link color**, especially on dark backgrounds.

---

## JCR Field Ordering (critical for Universal Editor blocks)

JCR (AEM storage) saves block fields **alphabetically by field name**, not in model definition order.
The JS decorator reads rows by position (rows[0], rows[1], ...) which means it gets fields in alphabetical name order.

**Rule:** Name fields so their alphabetical sort equals the order the JS reads them.

```
Example: heading (h) < links (l) → rows[0]=heading, rows[1]=links ✓
Example: linkText (T) < linkUrl (U) → rows[0]=linkText, rows[1]=linkUrl ✓
```

Alternative: use content-type detection in JS (detect a link by `/` or `http` prefix) instead of relying on position — more resilient but more complex.

---

## Block Model Rules

1. Define `_block.json` (definitions + models + filters) **before** writing JS
2. Register the block in `models/_component-definition.json` (glob entry)
3. Register the block ID in the section filter in `models/_section.json`
4. Run `npm run build:json` after any model changes to rebuild the generated JSON files
5. Insert the block in UE and inspect the **Content Tree** — verify fields appear inside the correct parent before writing the JS decorator

---

## ESLint Rules (airbnb-base — all fail CI if violated)

### Rule 1 — No `for...of` loops
```js
// WRONG
for (const item of items) { ... }

// RIGHT
items.forEach((item) => { ... });
```

### Rule 2 — No `continue` statement
```js
// WRONG
items.forEach((item) => {
  if (!item) continue;  // banned
  doSomething(item);
});

// RIGHT
items.forEach((item) => {
  if (item) doSomething(item);
});
```

### Rule 3 — No unused variables
```js
// WRONG
const iconImg = picture.querySelector('img');  // declared but never read again

// RIGHT — remove it, or use it
picture.querySelector('img').alt = altText;
```

### Rule 4 — Max line length (100 chars)
- `ignoreStrings: true` and `ignoreTemplateLiterals: true` — string/template lines not checked
- Lines with no strings/templates still get checked — break long `.find()` / `.map()` callbacks to multi-line

---

## Xcel Site Design Spec (extracted from xcelenergy.com screenshots — 2026-08-06)

This section documents the visual design patterns from the real Xcel Energy site.
All block updates must match these patterns. EMA: apply these before writing any CSS.

---

### Universal Patterns — Apply to EVERY block

#### 1. Red dots decorator above section headings
Every section heading on the real site has 3 small red dots (`•••`) above it.
Implement as a `::before` pseudoelement on the heading element:
```css
.my-block-heading::before {
  content: "•••";
  display: block;
  color: #c8102e;
  font-size: 1rem;
  letter-spacing: 0.25em;
  margin-bottom: 8px;
}
```
Blocks that need this: `xcel-feature-cards`, `xcel-video-feature`, `teaser`.

#### 2. CTA link style — ALL CAPS + arrow
Every CTA link on the real site is ALL CAPS with a `→` arrow and a bottom underline. No filled button background.
```css
.my-block-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8b1a2c;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: underline;
}
.my-block-cta::after {
  content: "→";
  text-decoration: none;
}
```
Blocks that need this: `xcel-feature-cards`, `xcel-video-feature`, `teaser`.

#### 3. Section heading typography
```css
.my-block-heading {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.1;
  margin: 0 0 16px;
}
```

---

### Block-by-Block Design Spec

#### xcel-hero
- **Height:** ~60vh minimum (real site hero fills most of viewport)
- **Red accent bar** above heading — short horizontal red line (~32px wide, 4px tall):
```css
.xcel-hero-heading::before {
  content: "";
  display: block;
  width: 32px;
  height: 4px;
  background-color: #c8102e;
  margin-bottom: 16px;
}
```
- Heading: white, bold, large (2 lines on desktop)
- Subheading: white, smaller, below heading

#### xcel-quick-links
Current design (icon tiles) must be **completely replaced** to match real site:
- **Full-width dark crimson band** (`#8b1a2c`) — not white card tiles
- **"Welcome! Get Started Here"** heading in white, bold, centered
- **4 white outlined buttons** in a row — white border, white text, transparent background, fills on hover
- **NO icons** — text-only buttons
- Real site layout: heading on top, buttons in a row below

#### xcel-feature-cards (Affordable Energy / Cleaner Energy variant — 2-3 cards)
- Red `•••` dots above section heading
- Each card: **photo on top**, then card body below
- **Red left vertical bar** (3px wide, full card-body height) on the left of the card title — `border-left: 3px solid #c8102e`
- Card title: bold, dark, ~1.25rem
- Description text below title
- ALL CAPS CTA with → arrow at bottom
- Cards need an **image field** added to the model (Phase 3 — requires re-authoring)

#### xcel-feature-cards (Personalized Energy variant — 4 cards)
- Red `•••` dots above section heading
- Each card is a **media-object layout**: cream icon square on LEFT (~80px), text on RIGHT
- Icon area: `~80×80px`, cream background (`#f5ede8`), centered icon image
- Text: title bold, description, ALL CAPS CTA with →
- 2×2 grid layout on desktop
- Needs image field on card items for the icon (Phase 3)

#### teaser (Convenient Energy / Safer Energy)
- Two-column: **image LEFT** (~35% width), **text RIGHT**
- White background
- Red `•••` dots above heading
- Heading bold large
- Description text
- ALL CAPS CTA with →

#### teaser (Sustainable Energy)
- Two-column: **text LEFT**, **large illustration RIGHT**
- **Cream background** (`#f5ede8`) on the entire section
- Same `•••` dots + ALL CAPS CTA pattern

#### xcel-video-feature (Local Energy)
- Two-column: **text LEFT**, **video RIGHT** — same as current
- Red `•••` dots above heading
- ALL CAPS CTA with → (currently sentence case — needs update)

#### xcel-cta-banner (Contact Customer Service)
- Dark crimson background `#8b1a2c` (already correct)
- Add **white left vertical bar** — `border-left: 4px solid #fff` on the text container
- Heading + subtext white (already correct)
- Button: white outlined (`border: 2px solid #fff`, white text, transparent bg, fills on hover)

---

### Phase Plan for Next Session

#### Phase 1 — CSS only, no re-authoring (do first)
- [ ] `xcel-hero` — add red accent bar before heading, increase min-height to 60vh
- [ ] `xcel-feature-cards` — add `•••` dots to heading, ALL CAPS + arrow CTA
- [ ] `xcel-video-feature` — add `•••` dots to heading, ALL CAPS + arrow CTA
- [ ] `xcel-cta-banner` — add white left vertical bar accent

#### Phase 2 — JS + CSS restyle, no model change (do second)
- [ ] `xcel-quick-links` — full restyle: dark crimson band, white outlined buttons, remove icons

#### Phase 3 — Model + JS + CSS + re-authoring in UE (separate session)
- [ ] `xcel-feature-cards` — add image field to model, render photo on top of card, red left border on title
- [ ] Re-author all 3 feature card blocks in UE after model change

---

## Block vs Core Component

| If it is... | Then build... |
|---|---|
| A custom content pattern (hero, cards, banner, footer) | **Block** — `core/franklin/components/block/v1/block` |
| A standard UI element (button, text, title, image) | **Extend a Core Component** — copy the existing model, change the `id` |

Building a block when a core component exists causes **silent render failure** in the UE canvas — block JS decorators do not run natively in UE.

---

## Existing Skills & Agent — How to Use

This project already has 1 Agent and 4 Skills pre-built inside `.claude/`.
These are loaded automatically by Claude Code when you are in this repo.

---

### What is a Skill?

A **Skill** is a set of instructions that tells Claude exactly how to handle a specific type of task — like building a block or checking quality before a PR. Instead of explaining the rules every time, Claude reads the skill and follows it automatically.

### What is an Agent?

An **Agent** is a specialist that combines multiple skills and runs them in the right order. Think of it as a senior developer who already knows all the project rules.

---

### The 1 Agent

#### `eds-ue-specialist`
**What it does:** The master agent for all EDS/UE work. Automatically uses all 4 skills in the correct order.

**Workflow — when to trigger it:**
```
1. You decide to build a new block      ← task starts here
2. Say: "Build a new xcel-alert block"  ← you talk to Claude
3. ← AGENT RUNS HERE →                  Claude uses eds-ue-specialist automatically
4. Agent works through all 4 skills     ← JS + CSS + JSON + lint
5. You get a full working block + summary ← done
```

> **Rule:** Any time you say "build a block" or "create a component" — eds-ue-specialist runs. You do not need to trigger it manually.

---

### The 4 Skills

#### Skill 1 — `eds-ue-project-setup`
**What it does:** Checks that the project is correctly set up — required files exist, npm dependencies installed, local dev commands ready.

**Workflow — when to trigger it:**
```
1. You open the repo on a new machine   ← or something feels broken
2. Say: "Check if this project is set up correctly"
3. ← SKILL 1 RUNS HERE →               Claude checks all required files + deps
4. You get: ready-to-run confirmation   ← or a list of what's missing
5. Fix anything missing, then start work
```

> **Rule:** Only needed on first setup or when something is broken. You will rarely use this.

---

#### Skill 2 — `eds-ue-block-development`
**What it does:** Enforces correct block structure — JS + CSS + JSON all present, CSS scoped, decorator handles missing fields gracefully.

**Workflow — when to trigger it:**
```
1. We finish writing the block code     ← JS and CSS done
2. Say: "Check the block structure is correct"
3. ← SKILL 2 RUNS HERE →               Claude reviews JS + CSS + JSON
4. Any issues flagged and fixed         ← missing file, leaked CSS, etc.
5. Block is ready for quality check (Skill 4) before PR
```

> **Rule:** Runs automatically during block building. You can also call it explicitly after editing a block's JS or CSS.

---

#### Skill 3 — `eds-ue-content-modeling`
**What it does:** Handles all UE model file changes — updates `_block.json`, runs `npm run build:json` to rebuild the 3 generated files.

**Workflow — when to trigger it:**
```
1. We add or change a field in a model  ← _block.json edited
2. Say: "Rebuild the JSON models"
   OR it runs automatically after any model change
3. ← SKILL 3 RUNS HERE →               npm run build:json executes
4. component-definition.json            ← rebuilt ✅
   component-models.json                ← rebuilt ✅
   component-filters.json               ← rebuilt ✅
5. New field is now visible in UE palette
```

> **Rule:** Every time a `_*.json` model file changes — Skill 3 must run. Never skip this step or UE will not show the new field.

---

#### Skill 4 — `eds-ue-quality-and-publishing`
**What it does:** Quality gate before any PR. Runs `npm run lint`, checks for issues, gives a go/no-go.

**Workflow — when to trigger it:**
```
1. We build / make changes              ← coding happens here
2. We commit + push                     ← git work happens here
3. Say: "Run quality check"             ← YOU SAY THIS BEFORE OPENING PR
4. ← SKILL 4 RUNS HERE →               npm run lint executes
5. All issues reported and fixed        ← CSS errors, ESLint errors caught
6. Open PR on GitHub                    ← only after Skill 4 says OK
7. Merge to main
```

> **Rule:** Every single PR — no exceptions. Say "run quality check" before going to GitHub to open a PR.

---

### Planned Agent

#### `aem-cf-agent` ⏳ (to be built for XA6)
**What it does:** Creates Content Fragment Models, CF instances, and persisted GraphQL queries on AEM Author — via REST API, no browser needed.

**Workflow — when to trigger it (once built):**
```
1. You need new content in AEM          ← state data, CF model, etc.
2. Update scripts/cf-config.json        ← add your state data
3. Say: "Run the aem-cf-agent"
4. ← AGENT RUNS HERE →                 Claude calls AEM REST API
5. CF Model created on AEM Author       ← automatically ✅
   CF instances created (one per state) ← automatically ✅
   Persisted query saved                ← automatically ✅
6. Claude gives you the GraphQL endpoint URL
7. EDS block JS is updated to fetch from that URL
```

> **Rule:** Never create Content Fragments manually in AEM UI once this agent exists. Always run the agent — it is faster, repeatable, and error-free.

---

### Quick Reference — Which to Use When

| Situation | Use This | When |
|---|---|---|
| Building a brand new block | `eds-ue-specialist` (agent) | When task starts |
| Editing JS or CSS of existing block | `eds-ue-block-development` (skill 2) | After editing |
| Adding/changing model fields | `eds-ue-content-modeling` (skill 3) | After `_*.json` changes |
| **Before opening a PR** | **`eds-ue-quality-and-publishing` (skill 4)** | **Every PR, no exceptions** |
| Fresh machine setup or something broken | `eds-ue-project-setup` (skill 1) | Rarely |
| Creating AEM Content Fragments | `aem-cf-agent` (planned) | XA6 and beyond |
| Not sure — just describe the task | `eds-ue-specialist` handles it | Anytime |

---

### Skills We Still Need to Build (Planned)

| Skill/Agent | Purpose | Status |
|---|---|---|
| `aem-cf-agent` | Create CF Models, CF instances, persisted GraphQL queries via REST API — no browser needed | ⏳ Planned for XA6 |

---

## Skills & Agents — Automation Strategy

### Why build Skills/Agents for this project

AEM Author UI operations (creating Content Fragment models, CF instances, persisted queries, page creation) require manual browser clicks. These are repetitive, time-consuming, and error-prone. A Claude Code Skill or Agent can replace these manual steps by calling AEM REST APIs directly — **no browser needed**.

**Rule:** If an AEM task is repeatable (same steps, different data), build a Skill/Agent for it first. Then use the agent instead of the UI.

---

### AEM REST API Auth

AEM Author always requires authentication — even on sandbox/trial instances (returns `401` without credentials).

```
AEM Author:  https://author-p153710-e1614654.adobeaemcloud.com  → 401 (needs auth)
AEM Publish: https://publish-p153710-e1614654.adobeaemcloud.com → public (no auth)
```

**Auth pattern for agents:**
- Store credentials in `.env` file at repo root (never committed — already in `.gitignore`)
- Agent reads `AEM_USER` and `AEM_PASSWORD` from env vars
- All `curl` calls use `-u $AEM_USER:$AEM_PASSWORD`

---

### XA1–XA6 Automation Opportunity Analysis

| Activity | Manual Task | Can be Automated? | Agent Type |
|---|---|---|---|
| XA1 — Create page | Click in AEM Sites UI | ✅ Yes | AEM Sites REST API (`POST /api/sites/`) |
| XA2 — State Selector | Hardcoded JS array | ✅ Yes | CF instances → GraphQL fetch (XA6 agent) |
| XA3 — CTA Banner | Set fields in UE | ✅ Partial | AEM Assets API (content population) |
| XA4 — Header nav | Edit `/nav` doc in Author | ✅ Partial | JCR write API |
| XA5 — Footer | Edit `/footer` doc in Author | ✅ Partial | JCR write API |
| XA6 — CF + GraphQL | Create model, instances, query | ✅ Yes — **build this first** | CF REST API + GraphQL persist API |

**Priority:** Build XA6 agent first — it solves XA2 (State Selector data) at the same time.

---

### XA6 Agent Design

**Name:** `aem-cf-agent` (or invoke as a Claude Code skill)

**What it does:**
1. Creates a Content Fragment Model on AEM Author via REST API
2. Creates CF instances (one per state) with provided data
3. Creates a persisted GraphQL query on AEM Author
4. Returns the published GraphQL endpoint URL for the EDS JS block to consume

**Inputs (from a config file `scripts/cf-config.json`):**
```json
{
  "modelName": "Service Area",
  "modelPath": "/conf/speedyfalcon49922/settings/dam/cfm/models",
  "instancesPath": "/content/dam/speedyfalcon49922/service-areas",
  "queryName": "service-areas",
  "states": [
    { "name": "Colorado", "abbr": "CO", "link": "/" },
    { "name": "Minnesota", "abbr": "MN", "link": "/" }
  ]
}
```

**Output:**
```
Published query endpoint:
https://publish-p153710-e1614654.adobeaemcloud.com/graphql/execute.json/speedyfalcon49922/service-areas
```

**Files to create:**
- `scripts/cf-config.json` — state data input
- `scripts/create-cf-model.sh` — creates the CF Model via REST API
- `scripts/create-cf-instances.sh` — creates one CF instance per state
- `scripts/create-persisted-query.sh` — saves the GraphQL query

**Order of execution:**
```
Build agent → Run agent → Verify on Publish GraphQL → Update State Selector JS
```

**Do NOT start XA6 manually.** Build the agent first, then XA6 is just running the scripts.
