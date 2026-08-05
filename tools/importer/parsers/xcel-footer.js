/* eslint-disable */
/* global WebImporter */

/**
 * Parser for xcel-footer. Base: xcel-footer (existing repo block, reused).
 * Source: https://www.xcelenergy.com
 * Selector: c-xeg-site-footer  (source.html rooted at <footer role="contentinfo">)
 * Project: xwalk — CONTAINER block.
 *   Parent model (xcel-footer): copyright (text) — rendered as the first row.
 *   Child items (xcel-footer-column): heading (text) + links (richtext <ul> of links)
 *     — one row per column, two cells: [heading, links].
 * Source structure: <nav aria-label="Footer"><ul><li><h3>Heading</h3><ul>..links..</ul></li>..</ul></nav>
 *   plus <div class="footer-bottom"><p>copyright</p><ul class="social">..</ul></div>.
 * The 5 content columns map to xcel-footer-column items. Copyright comes from
 * .footer-bottom > p. Social links are not part of the block model (rendered by the
 * block itself), so they are intentionally not emitted.
 */
export default function parse(element, { document }) {
  // Copyright — validated: <div class="footer-bottom"><p>© 2026 ...</p>.
  const copyrightEl = element.querySelector('.footer-bottom p, [class*="footer-bottom"] p, footer > div p');
  const copyrightText = copyrightEl
    ? copyrightEl.textContent.trim()
    : '© 2026 Xcel Energy Inc. All rights reserved.';

  // Column headings — each footer link column is anchored by a heading (h3 in source).
  // Anchoring on headings is resilient to how the live DOM nests the columns, and it
  // naturally excludes the copyright bar and the social list (neither has a heading).
  // Exclude any heading that lives inside the .footer-bottom copyright/social area.
  const headings = Array.from(element.querySelectorAll('h3, h4'))
    .filter((h) => !h.closest('.footer-bottom, [class*="footer-bottom"], .social, [class*="social"]'));

  const cells = [];

  // Parent field row: copyright (text).
  const copyrightFrag = document.createDocumentFragment();
  copyrightFrag.appendChild(document.createComment(' field:copyright '));
  copyrightFrag.appendChild(document.createTextNode(copyrightText));
  cells.push([copyrightFrag]);

  // One row per footer column item: [heading, links].
  headings.forEach((headingEl) => {
    // Find the links list associated with this heading: prefer a <ul> within the
    // heading's containing <li>, otherwise the nearest following sibling list.
    const container = headingEl.closest('li') || headingEl.parentElement;
    let listEl = container ? container.querySelector('ul, ol') : null;
    if (!listEl) {
      let sib = headingEl.nextElementSibling;
      while (sib && !listEl) {
        if (sib.tagName === 'UL' || sib.tagName === 'OL') listEl = sib;
        else listEl = sib.querySelector && sib.querySelector('ul, ol');
        sib = sib.nextElementSibling;
      }
    }
    // Only emit columns that actually have links.
    if (!listEl || !listEl.querySelector('a')) return;

    // Cell 1: heading (text field).
    const headingFrag = document.createDocumentFragment();
    headingFrag.appendChild(document.createComment(' field:heading '));
    headingFrag.appendChild(document.createTextNode(headingEl.textContent.trim()));

    // Cell 2: links (richtext field) — preserve the <ul> of anchors as HTML.
    const linksFrag = document.createDocumentFragment();
    linksFrag.appendChild(document.createComment(' field:links '));
    linksFrag.appendChild(listEl.cloneNode(true));

    cells.push([headingFrag, linksFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'xcel-footer', cells });
  element.replaceWith(block);
}
