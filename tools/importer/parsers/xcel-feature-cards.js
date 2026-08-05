/* eslint-disable */
/* global WebImporter */

/**
 * Parser for xcel-feature-cards. Base: xcel-feature-cards (new CONTAINER block).
 * Source: https://co.my.xcelenergy.com/s/  (Colorado homepage)
 * Selector: <c-xeg-featured-content-v2> (Affordable / Personalized / Cleaner Energy).
 * Project: xwalk — CONTAINER block.
 *   Parent model (xcel-feature-cards): heading (text), intro (text) — first row, 2 cells.
 *   Child items (xcel-feature-card) field order (JCR alphabetical):
 *     ctaText (text), ctaLink (text), description (richtext), heading (text) — one row, 4 cells.
 * Source: <h2 data-html="headerText"> + <p data-html="paragraphText"> +
 *   <div class="xeg-columns"><c-xeg-featured-content-item>
 *     <img><h3>Title</h3><lightning-formatted-rich-text><p>..</p></...><a class="xeg-button" href>CTA</a>
 *   </c-xeg-featured-content-item>...
 */
export default function parse(element, { document }) {
  const headingEl = element.querySelector(':scope h2, [data-html="headerText"]');
  const headingText = headingEl ? headingEl.textContent.trim() : '';

  const introEl = element.querySelector(':scope > section p[data-html="paragraphText"], .xeg-content-container > p[data-html="paragraphText"]');
  const introText = introEl ? introEl.textContent.trim() : '';

  const items = Array.from(element.querySelectorAll('c-xeg-featured-content-item, [class*="featured-content-item"]'));

  const cells = [];

  // Parent field row: [heading, intro].
  const hFrag = document.createDocumentFragment();
  hFrag.appendChild(document.createComment(' field:heading '));
  hFrag.appendChild(document.createTextNode(headingText));
  const iFrag = document.createDocumentFragment();
  iFrag.appendChild(document.createComment(' field:intro '));
  iFrag.appendChild(document.createTextNode(introText));
  cells.push([hFrag, iFrag]);

  const mkText = (field, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(document.createTextNode(text));
    return frag;
  };

  items.forEach((item) => {
    const cardHeadingEl = item.querySelector('h3, h4');
    const cardHeading = cardHeadingEl ? cardHeadingEl.textContent.trim() : '';

    const anchor = item.querySelector('a.xeg-button, a[data-button-variant], a');
    const ctaText = anchor ? anchor.textContent.trim() : '';
    const ctaLink = anchor ? (anchor.getAttribute('href') || '').trim() : '';

    // Description: the rich-text <p>. Preserve as richtext HTML.
    const descP = item.querySelector('lightning-formatted-rich-text p, [part="formatted-rich-text"] p, p');
    const descFrag = document.createDocumentFragment();
    descFrag.appendChild(document.createComment(' field:description '));
    if (descP) {
      const p = document.createElement('p');
      p.textContent = descP.textContent.trim();
      descFrag.appendChild(p);
    }

    cells.push([
      mkText('ctaText', ctaText),
      mkText('ctaLink', ctaLink),
      descFrag,
      mkText('heading', cardHeading),
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'xcel-feature-cards', cells });
  element.replaceWith(block);
}
