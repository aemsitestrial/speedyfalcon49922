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

## Header/Footer Configuration

The header and footer are not hardcoded blocks of content — they're fragments loaded at runtime from
dedicated pages, and every page on the site loads the same fragment unless told otherwise.

- **Default paths (site-wide fallback):** hardcoded in [blocks/header/header.js](blocks/header/header.js#L175)
  (`'/nav'`) and [blocks/footer/footer.js](blocks/footer/footer.js#L17) (`'/footer'`). Changing these two
  lines is how you switch the source page for the **entire site**.
- **Per-page override:** add a `nav` and/or `footer` row to a page's **Metadata** block
  (e.g. `nav` → `/nav-v2`) to point just that page at a different header/footer page, without touching code.
- **Fetch mechanism:** both blocks call `loadFragment(path)` in
  [blocks/fragment/fragment.js](blocks/fragment/fragment.js#L17), which fetches `{rootPath}{path}.plain.html`.
  The target page must be **Previewed + Published** or this 404s.
- **Required content structure for a nav page** (read by [header.js](blocks/header/header.js#L206-L209) as
  5 sections, in this exact order — each section is a section break in the doc):
  1. **Announcements** — top promo/announcement bar content
  2. **Brand** — logo image + home link
  3. **Sections** — main menu; a nested `<ul>` under a menu item makes it an expandable dropdown
  4. **Tools** — usually left empty; cart/search icons are injected here by JS
  5. **Utility** — rendered as the top utility bar (e.g. Pay Bill, Sign In); authored as a simple link list
- **Required content structure for a footer page:** no fixed section count — all top-level content is
  copied as-is into the footer block.

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

## ESLint Rules (airbnb-base)

- Max 100 chars per line
- `ignoreStrings: true` and `ignoreTemplateLiterals: true` — string/template lines not checked
- Lines with no strings/templates still get checked — break long `.find()` / `.map()` callbacks to multi-line

---

## Block vs Core Component

| If it is... | Then build... |
|---|---|
| A custom content pattern (hero, cards, banner, footer) | **Block** — `core/franklin/components/block/v1/block` |
| A standard UI element (button, text, title, image) | **Extend a Core Component** — copy the existing model, change the `id` |

Building a block when a core component exists causes **silent render failure** in the UE canvas — block JS decorators do not run natively in UE.
