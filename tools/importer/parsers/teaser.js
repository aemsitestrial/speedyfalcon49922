/* eslint-disable */
/* global WebImporter */

/**
 * Parser for teaser (existing repo block, reused for the homepage promo bands).
 * Source: https://co.my.xcelenergy.com/s/  (Colorado homepage)
 * Selectors: <c-xeg-two-column-v2> (Convenient Energy, Safer Energy) and the
 *   light-themed <c-xeg-hero-v2> (Sustainable Energy).
 * Project: xwalk — simple block, one row per model field.
 * Model (_teaser.json) field order (JCR alphabetical) — only the fields we can
 *   source are populated; the rest are emitted empty to preserve row order:
 *   fileReference (reference), fileReferenceAlt (text), classes (multiselect),
 *   eyebrow (text), title (text), titleType (select), longDescr (richtext),
 *   shortDescr (richtext), cta1Type (select), cta1Text (text), cta1 (text),
 *   cta2Type (select), cta2Text (text), cta2 (text).
 * Source: <h2 data-html="headerText"> + <p data-html="paragraphText"> +
 *   <a class="xeg-button" href>CTA</a> + an <img> (two-column) or a section
 *   background-image (hero).
 */
export default function parse(element, { document }) {
  const headingEl = element.querySelector('h2, [data-html="headerText"], h1, h3');
  const title = headingEl ? headingEl.textContent.trim() : '';

  const descEl = element.querySelector('p[data-html="paragraphText"], .content p, .xeg-content-container p');
  const descText = descEl ? descEl.textContent.trim() : '';

  const anchor = element.querySelector('a.xeg-button, a[data-button-variant], a');
  const cta1Text = anchor ? anchor.textContent.trim() : '';
  const cta1 = anchor ? (anchor.getAttribute('href') || '').trim() : '';

  // Image: an <img> in the two-column layout, else the hero section background-image.
  let imgUrl = '';
  const imgEl = element.querySelector('.image img, img');
  if (imgEl) {
    imgUrl = imgEl.getAttribute('src') || '';
  } else {
    const section = element.querySelector('section') || element;
    const style = section.getAttribute('style') || '';
    const m = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
    if (m) imgUrl = m[2].replace(/&quot;/g, '').trim();
  }

  const mkText = (field, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    if (text) frag.appendChild(document.createTextNode(text));
    return frag;
  };
  const mkRich = (field, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      frag.appendChild(p);
    }
    return frag;
  };

  // Row 1: fileReference (reference) — image.
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:fileReference '));
  if (imgUrl) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = title;
    imgFrag.appendChild(img);
  }

  const cells = [];
  cells.push([imgFrag]);
  cells.push([mkText('fileReferenceAlt', title)]);
  cells.push([mkText('classes', '')]);
  cells.push([mkText('eyebrow', '')]);
  cells.push([mkText('title', title)]);
  cells.push([mkText('titleType', 'h2')]);
  cells.push([mkRich('longDescr', descText)]);
  cells.push([mkRich('shortDescr', '')]);
  cells.push([mkText('cta1Type', 'link')]);
  cells.push([mkText('cta1Text', cta1Text)]);
  cells.push([mkText('cta1', cta1)]);
  cells.push([mkText('cta2Type', '')]);
  cells.push([mkText('cta2Text', '')]);
  cells.push([mkText('cta2', '')]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser', cells });
  element.replaceWith(block);
}
