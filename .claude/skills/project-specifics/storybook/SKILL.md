# storybook

Storybook visual development, Vitest unit testing, and axe-core accessibility
testing for Adobe EDS blocks. This skill defines the shift-left quality loop
every block must pass before it can be considered done.

## Use When

- Adding or refactoring any block under `blocks/<name>/`.
- Authoring the `.stories.js` or `.test.js` file for a new block.
- Debugging Storybook configuration or mock aliases.
- Running the shift-left quality checklist before a pull request.

## Tooling Overview

| Tool | Purpose | Config file |
|------|---------|-------------|
| `@storybook/html-vite` | Visual block development at `http://localhost:6006` | `.storybook/main.js` |
| `@storybook/addon-a11y` | axe-core accessibility panel inside Storybook | `.storybook/preview.js` |
| `vitest` + `happy-dom` | Unit tests for block decoration logic | `vitest.config.js` |
| `@vitest/coverage-v8` | Coverage reports | `vitest.config.js` |

## Development Commands

```bash
# Visual development
npm run storybook          # start Storybook at http://localhost:6006

# Unit tests
npm test                   # run all unit tests once
npm run test:watch         # watch mode during development
npm run test:coverage      # generate coverage report

# Build Storybook for CI / artefact upload
npm run build-storybook
```

## AEM Runtime Mocks

Block JS files import from `scripts/aem.js` and `scripts/scripts.js`. Both are
aliased to lightweight stubs in `test/mocks/` so blocks load in isolation:

- `test/mocks/aem.js` — stubs `createOptimizedPicture`, `toClassName`, etc.
- `test/mocks/scripts.js` — stubs `moveInstrumentation`, `loadFragment`, etc.

The same mock paths are reused by both Storybook (aliased in `.storybook/main.js`
`viteFinal`) and Vitest (aliased in `vitest.config.js`).

If a new function is needed from `aem.js` or `scripts.js`, add a stub export to
the corresponding mock file first.

## Story Authoring Pattern

Stories live alongside their block: `blocks/<name>/<name>.stories.js`.

```js
import decorate from './myblock.js';

export default {
  title: 'Blocks/MyBlock',
  parameters: { a11y: { config: { rules: [] } } },
};

function buildBlock(/* authored fields */) {
  // 1. Build the pre-decoration HTML structure AEM delivers to the block
  //    (outer div.block > rows > cells — see blocks/cards/cards.stories.js for reference)
  const block = document.createElement('div');
  block.className = 'myblock block';
  // ... add rows / cells ...
  return block;
}

export const Default = {
  render: () => {
    const block = buildBlock(/* happy-path args */);
    decorate(block);
    return block;
  },
};

// Always add edge-case stories: missing optional fields, empty block, etc.
export const NoOptionalField = {
  render: () => {
    const block = buildBlock(/* partial args */);
    decorate(block);
    return block;
  },
};
```

## Unit Test Authoring Pattern

Tests live alongside their block: `blocks/<name>/<name>.test.js`.

```js
import { describe, it, expect } from 'vitest';
import decorate from './myblock.js';

// Reuse the same buildBlock helper as in the story file
function buildBlock(...) { ... }

describe('myblock block', () => {
  describe('decorate()', () => {
    it('transforms authored markup into expected DOM structure', () => {
      const block = buildBlock(/* full args */);
      decorate(block);
      expect(block.querySelector('.myblock-item')).not.toBeNull();
    });

    it('does not throw when optional fields are absent', () => {
      const block = buildBlock(/* partial args */);
      expect(() => decorate(block)).not.toThrow();
    });
  });
});
```

## Shift-Left Checklist (per block)

A block is considered **done** only when all of the following pass:

- [ ] `.stories.js` exists with at least a Default story and one edge-case story
- [ ] Storybook renders the Default story without console errors
- [ ] Storybook a11y panel shows **0 violations** on the Default story
- [ ] `.test.js` covers: happy-path DOM structure, missing optional fields, empty block
- [ ] `npm test` exits 0
- [ ] `npm run lint` exits 0

## File Conventions

| File | Required for every block? |
|------|--------------------------|
| `blocks/<name>/<name>.js` | Yes |
| `blocks/<name>/<name>.css` | Yes |
| `blocks/<name>/_<name>.json` | Yes (UE model) |
| `blocks/<name>/<name>.stories.js` | **Yes — shift-left gate** |
| `blocks/<name>/<name>.test.js` | **Yes — shift-left gate** |

## Notes

- `storybook-static/` (the built output) is in `.gitignore` and must not be committed.
- `.storybook/` starts with a dot so it is already excluded from AEM serving via `.hlxignore` `.*` rule.
- `test/` is also covered by `.hlxignore` `test/*` rule.
- `vitest.config.js` is excluded from AEM serving via a dedicated `.hlxignore` entry.