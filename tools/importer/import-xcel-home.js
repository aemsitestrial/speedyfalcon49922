/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import stateSelectorParser from './parsers/state-selector.js';
import xcelCtaBannerParser from './parsers/xcel-cta-banner.js';
import xcelFooterParser from './parsers/xcel-footer.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/xcel-cleanup.js';
import sectionsTransformer from './transformers/xcel-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'xcel-home',
  description: 'Xcel Energy homepage (state-selector landing). Sections: header/utility nav, state selector (8 service areas), Contact Customer Service CTA banner, and 5-column footer with copyright and social links.',
  urls: [
    'https://www.xcelenergy.com',
  ],
  blocks: [
    {
      name: 'state-selector',
      instances: ['#xeg-main .ui-widget:nth-of-type(1)'],
    },
    {
      name: 'xcel-cta-banner',
      instances: ['#xeg-main .ui-widget:nth-of-type(2)'],
    },
    {
      name: 'xcel-footer',
      instances: ['c-xeg-site-footer'],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'State Selector',
      selector: ['#xeg-main .ui-widget:nth-of-type(1)'],
      style: null,
      blocks: ['state-selector'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'Contact Customer Service CTA',
      selector: ['#xeg-main .ui-widget:nth-of-type(2)'],
      style: null,
      blocks: ['xcel-cta-banner'],
      defaultContent: [],
    },
    {
      id: 'rc4',
      name: 'Footer',
      selector: ['c-xeg-site-footer'],
      style: null,
      blocks: ['xcel-footer'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'state-selector': stateSelectorParser,
  'xcel-cta-banner': xcelCtaBannerParser,
  'xcel-footer': xcelFooterParser,
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path -> /xcel-home
    // The source URL path is "/" (homepage), which would sanitize to an empty
    // string; map the homepage explicitly to the target document path.
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/xcel-home');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
