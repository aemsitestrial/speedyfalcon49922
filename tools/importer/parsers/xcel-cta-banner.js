/* eslint-disable */
/* global WebImporter */

/**
 * Parser for xcel-cta-banner. Base: xcel-cta-banner (existing repo block, reused).
 * Source: https://www.xcelenergy.com
 * Selector: #xeg-main .ui-widget:nth-of-type(2)
 * Project: xwalk — simple block, one column, one row per model field.
 * Model (_xcel-cta-banner.json) field order (JCR alphabetical):
 *   backgroundColor (select), buttonLabel (text), buttonLink (text),
 *   eyebrow (text), heading (text), subtext (text).
 * Source: <c-xeg-contact-support> section with dark crimson blade; column 1 has
 *   <h2 class="headline-h-3"> heading + <p class="subheading-aa-07"> subtext;
 *   column 2 has <a class="xeg-button"> button. No distinct eyebrow element in
 *   source, so eyebrow mirrors the heading (per authoring analysis).
 */
export default function parse(element, { document }) {
  // Heading — validated: <h2 class="headline-h-3">. Fallbacks for variation.
  const headingEl = element.querySelector('.headline-h-3, h2, h1, h3, [class*="headline"]');
  const headingText = headingEl ? headingEl.textContent.trim() : 'Contact Customer Service';

  // Subtext — validated: <p class="subheading-aa-07">.
  const subtextEl = element.querySelector('.subheading-aa-07, [data-column="1"] p, p[class*="subheading"]');
  const subtextText = subtextEl ? subtextEl.textContent.trim() : '';

  // Button — validated: <a class="xeg-button" href data-button-variant="contact-us">.
  const buttonEl = element.querySelector('a.xeg-button, .contact-us a, a[data-button-variant], a[class*="button"]');
  const buttonLabel = buttonEl ? buttonEl.textContent.trim() : 'Contact Us';
  const buttonLink = buttonEl ? (buttonEl.getAttribute('href') || '').trim() : '';

  // Eyebrow: source has no dedicated eyebrow element; mirror the heading text.
  const eyebrowText = headingText;

  // backgroundColor: crimson blade is the block's own design (select field default).
  const backgroundColor = 'crimson';

  const mkTextCell = (fieldName, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(document.createTextNode(text));
    return frag;
  };

  const cells = [];
  // Rows must follow the model field order exactly.
  cells.push([mkTextCell('backgroundColor', backgroundColor)]);
  cells.push([mkTextCell('buttonLabel', buttonLabel)]);
  cells.push([mkTextCell('buttonLink', buttonLink)]);
  cells.push([mkTextCell('eyebrow', eyebrowText)]);
  cells.push([mkTextCell('heading', headingText)]);
  cells.push([mkTextCell('subtext', subtextText)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'xcel-cta-banner', cells });
  element.replaceWith(block);
}
