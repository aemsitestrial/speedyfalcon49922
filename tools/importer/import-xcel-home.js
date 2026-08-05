/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import stateSelectorParser from './parsers/state-selector.js';
import xcelCtaBannerParser from './parsers/xcel-cta-banner.js';
import xcelFooterParser from './parsers/xcel-footer.js';
import xcelHeroParser from './parsers/xcel-hero.js';
import xcelQuickLinksParser from './parsers/xcel-quick-links.js';
import xcelFeatureCardsParser from './parsers/xcel-feature-cards.js';
import xcelVideoFeatureParser from './parsers/xcel-video-feature.js';
import teaserParser from './parsers/teaser.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/xcel-cleanup.js';
import sectionsTransformer from './transformers/xcel-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'xcel-home',
  description: 'Xcel Energy Colorado homepage (behind the state-selector gate). Sections top-to-bottom: hero, quick-links, promo (teaser), feature-cards x3, video-feature, promo hero (teaser), and the contact CTA banner.',
  urls: [
    'https://co.my.xcelenergy.com/s/',
  ],
  blocks: [
    {
      name: 'xcel-hero',
      instances: ['c-xeg-hero-v2:has(section[data-blade-theme="dark"])'],
    },
    {
      name: 'xcel-quick-links',
      instances: ['c-xeg-multi-action-banner'],
    },
    {
      name: 'xcel-feature-cards',
      instances: ['c-xeg-featured-content-v2'],
    },
    {
      name: 'xcel-video-feature',
      instances: ['c-dc-video-component-v2'],
    },
    {
      name: 'teaser',
      instances: [
        'c-xeg-two-column-v2',
        'c-xeg-hero-v2:has(section[data-blade-theme="light"])',
      ],
    },
    {
      name: 'xcel-cta-banner',
      instances: ['c-xeg-contact-support'],
    },
    {
      name: 'xcel-footer',
      instances: ['c-xeg-site-footer'],
    },
  ],
  // Each content widget is its own section; section breaks are inserted between
  // them in document order. Styles are block-intrinsic, so no section metadata.
  sections: [
    { id: 'rc1', name: 'Hero', selector: ['c-xeg-hero-v2:has(section[data-blade-theme="dark"])'], style: null, blocks: ['xcel-hero'], defaultContent: [] },
    { id: 'rc2', name: 'Quick Links', selector: ['c-xeg-multi-action-banner'], style: null, blocks: ['xcel-quick-links'], defaultContent: [] },
    { id: 'rc3', name: 'Convenient Energy', selector: ['c-xeg-two-column-v2'], style: null, blocks: ['teaser'], defaultContent: [] },
    { id: 'rc4', name: 'Feature Cards', selector: ['c-xeg-featured-content-v2'], style: null, blocks: ['xcel-feature-cards'], defaultContent: [] },
    { id: 'rc5', name: 'Local Energy Video', selector: ['c-dc-video-component-v2'], style: null, blocks: ['xcel-video-feature'], defaultContent: [] },
    { id: 'rc6', name: 'Sustainable Energy', selector: ['c-xeg-hero-v2:has(section[data-blade-theme="light"])'], style: null, blocks: ['teaser'], defaultContent: [] },
    { id: 'rc7', name: 'Contact Customer Service CTA', selector: ['c-xeg-contact-support'], style: null, blocks: ['xcel-cta-banner'], defaultContent: [] },
    { id: 'rc8', name: 'Footer', selector: ['c-xeg-site-footer'], style: null, blocks: ['xcel-footer'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'state-selector': stateSelectorParser,
  'xcel-cta-banner': xcelCtaBannerParser,
  'xcel-footer': xcelFooterParser,
  'xcel-hero': xcelHeroParser,
  'xcel-quick-links': xcelQuickLinksParser,
  'xcel-feature-cards': xcelFeatureCardsParser,
  'xcel-video-feature': xcelVideoFeatureParser,
  teaser: teaserParser,
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

    // 6. Target path is always /xcel-home for this single-page migration.
    // The Colorado homepage source path ("/s/") is not meaningful for the target,
    // so map it explicitly to the intended document path.
    const path = WebImporter.FileUtils.sanitizePath('/xcel-home');

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
