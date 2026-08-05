/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: xcel (Xcel Energy) section breaks + section metadata.
 *
 * The xcel-home template defines 3 sections, so section breaks are required.
 * Driven entirely by payload.template.sections — for each section (processed in
 * reverse document order so inserts don't shift later selectors):
 *   - Insert an <hr> before the section's first element when it is not the first
 *     section and there is content before it.
 *   - Create a "Section Metadata" block (style cell) when section.style is set.
 *
 * For xcel-home all sections have style: null, so no Section Metadata blocks are
 * created; 2 <hr> breaks are inserted (sections.length - 1).
 *
 * ⚠️ Section selectors come from page-templates.json and were verified against
 * migration-work/cleaned.html:
 *   rc2 State Selector     -> #xeg-main .ui-widget:nth-of-type(1)   (line 120)
 *   rc3 Contact CS CTA     -> #xeg-main .ui-widget:nth-of-type(2)   (line 201)
 *   rc4 Footer             -> c-xeg-site-footer                     (line 225)
 *
 * Runs in afterTransform only (section breaks are a final-structure concern and
 * must not interfere with block parsing).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the first matching element for a section from its selector list.
  const findSectionEl = (section) => {
    const selectors = Array.isArray(section.selector)
      ? section.selector
      : [section.selector].filter(Boolean);
    for (const sel of selectors) {
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  };

  // Process in reverse so inserting nodes doesn't disturb earlier selectors
  // (nth-of-type in particular).
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionEl(section);
    if (!sectionEl) continue;

    // Section Metadata block (only when a style is defined).
    if (section.style) {
      const styleValue = Array.isArray(section.style) ? section.style.join(', ') : section.style;
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: styleValue },
      });
      sectionEl.after(metadataBlock);
    }

    // Section break before every non-first section that has preceding content.
    if (i > 0 && sectionEl.previousElementSibling) {
      sectionEl.before(doc.createElement('hr'));
    }
  }
}
