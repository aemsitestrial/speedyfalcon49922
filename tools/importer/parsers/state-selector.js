/* eslint-disable */
/* global WebImporter */

/**
 * Parser for state-selector. Base: state-selector (existing repo block, reused).
 * Source: https://www.xcelenergy.com
 * Selector: #xeg-main .ui-widget:nth-of-type(1)
 * Project: xwalk — simple block, one column, one row per model field.
 * Model (_state-selector.json) field order: heading, coloradoLink, michiganLink,
 *   minnesotaLink, newMexicoLink, northDakotaLink, southDakotaLink, texasLink, wisconsinLink.
 * Source is a JS-driven widget: heading in <h1 class="xeg-h3"> and 8 state anchors
 *   (<a data-code="co|mi|mn|nm|nd|sd|tx|wi">) with placeholder href="#".
 */

// Map each model link field to the source anchor's data-code.
const STATE_LINK_FIELDS = [
  { field: 'coloradoLink', code: 'co' },
  { field: 'michiganLink', code: 'mi' },
  { field: 'minnesotaLink', code: 'mn' },
  { field: 'newMexicoLink', code: 'nm' },
  { field: 'northDakotaLink', code: 'nd' },
  { field: 'southDakotaLink', code: 'sd' },
  { field: 'texasLink', code: 'tx' },
  { field: 'wisconsinLink', code: 'wi' },
];

export default function parse(element, { document }) {
  // Heading — validated against source: <h1 class="xeg-h3">. Fall back to any heading.
  const headingEl = element.querySelector('.xeg-text-content-container h1, h1, h2, h3, [class*="xeg-h"]');
  const headingText = headingEl ? headingEl.textContent.trim() : 'Select a Service Area to Explore';

  // Collect state anchors — validated against source: <ul><li><a data-code="..">.
  const anchors = Array.from(element.querySelectorAll('a[data-code], ul li a'));

  const getHref = (idx, code) => {
    // Prefer lookup by data-code (resilient to ordering changes), fall back to index.
    const byCode = anchors.find((a) => (a.getAttribute('data-code') || '').toLowerCase() === code);
    const a = byCode || anchors[idx];
    const href = a ? (a.getAttribute('href') || '').trim() : '';
    // Placeholder / empty hrefs map to the model default "/".
    return href && href !== '#' ? href : '/';
  };

  const cells = [];

  // Row: heading (text field).
  const headingFrag = document.createDocumentFragment();
  headingFrag.appendChild(document.createComment(' field:heading '));
  headingFrag.appendChild(document.createTextNode(headingText));
  cells.push([headingFrag]);

  // One row per state link field, in model order.
  STATE_LINK_FIELDS.forEach(({ field, code }, idx) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(document.createTextNode(getHref(idx, code)));
    cells.push([frag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'state-selector', cells });
  element.replaceWith(block);
}
