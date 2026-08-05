/* eslint-disable */
/* global WebImporter */

/**
 * Parser for xcel-quick-links. Base: xcel-quick-links (new CONTAINER block).
 * Source: https://co.my.xcelenergy.com/s/  (Colorado homepage)
 * Selector: <c-xeg-multi-action-banner> ("Welcome! Get Started Here").
 * Project: xwalk — CONTAINER block.
 *   Parent model (xcel-quick-links): heading (text) — first row.
 *   Child items (xcel-quick-link) field order (JCR alphabetical):
 *     icon (reference), iconAlt (text), label (text), link (text) — one row, 4 cells.
 * Source: <h2 data-html="headerText"> + <ul><li><c-xeg-multi-action-button>
 *   <a class="xeg-button" href>Label</a></li>...</ul>. The source has no per-item
 *   icons, so icon/iconAlt cells are emitted empty.
 */
export default function parse(element, { document }) {
  const headingEl = element.querySelector('h2, [data-html="headerText"], h1, h3');
  const headingText = headingEl ? headingEl.textContent.trim() : 'Welcome! Get Started Here';

  const anchors = Array.from(element.querySelectorAll('li a, a.xeg-button'));

  const cells = [];

  // Parent field row: heading (text).
  const headingFrag = document.createDocumentFragment();
  headingFrag.appendChild(document.createComment(' field:heading '));
  headingFrag.appendChild(document.createTextNode(headingText));
  cells.push([headingFrag]);

  const mkText = (field, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(document.createTextNode(text));
    return frag;
  };
  const mkEmpty = (field) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    return frag;
  };

  // One row per quick link: [icon, iconAlt, label, link].
  anchors.forEach((a) => {
    const label = a.textContent.trim();
    const href = (a.getAttribute('href') || '').trim();
    if (!label) return;
    cells.push([
      mkEmpty('icon'),
      mkEmpty('iconAlt'),
      mkText('label', label),
      mkText('link', href),
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'xcel-quick-links', cells });
  element.replaceWith(block);
}
