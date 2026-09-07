/* eslint-disable */
/* global WebImporter */

/**
 * Parser for xcel-hero. Base: xcel-hero (new block).
 * Source: https://co.my.xcelenergy.com/s/  (Colorado homepage)
 * Selector: the top <c-xeg-hero-v2> ("Our Energy, Your Power").
 * Project: xwalk — simple block, one row per model field.
 * Model (_xcel-hero.json) field order (JCR alphabetical):
 *   backgroundImage (reference), backgroundImageAlt (text), heading (text), subheading (text).
 * Source: <section class="xegc-hero xeg-blade" style="background-image:url(...)">
 *   <h1 data-html="headerText"> + <p data-html="paragraphText">.
 * The background image lives in the section's inline style; we surface it as an
 * <img> so the importer's image rules can pick it up.
 */
export default function parse(element, { document }) {
  const section = element.querySelector('section') || element;

  // Background image from the section's inline style="background-image:url(...)".
  let bgUrl = '';
  const style = section.getAttribute('style') || '';
  const m = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
  if (m) bgUrl = m[2].replace(/&quot;/g, '').trim();

  const headingEl = element.querySelector('h1, h2, [data-html="headerText"]');
  const headingText = headingEl ? headingEl.textContent.trim() : '';

  const subEl = element.querySelector('p[data-html="paragraphText"], .xeg-content-container p');
  const subText = subEl ? subEl.textContent.trim() : '';

  const cells = [];

  // Row 1: backgroundImage (reference) — an <img> the importer will rewrite.
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:backgroundImage '));
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    img.alt = headingText;
    imgFrag.appendChild(img);
  }
  cells.push([imgFrag]);

  const mkText = (field, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(document.createTextNode(text));
    return frag;
  };

  cells.push([mkText('backgroundImageAlt', headingText)]);
  cells.push([mkText('heading', headingText)]);
  cells.push([mkText('subheading', subText)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'xcel-hero', cells });
  element.replaceWith(block);
}
