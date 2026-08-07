import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * xcel-feature-cards
 * A section heading + optional intro, followed by a responsive grid of
 * feature cards (optional image on top, heading + description + CTA link).
 * Handles 2-up, 3-up and 4-up layouts automatically via a responsive
 * auto-fit grid.
 *
 * Universal Editor model (container + repeatable card items):
 *   - Container fields (JCR-alphabetical): heading, intro, variant.
 *   - Each card item fields (JCR-alphabetical): ctaText, ctaLink, description,
 *     heading, image. Image detected by querySelector('picture') — resilient
 *     to field ordering.
 *   - variant = "media-object" adds CSS class; JS/CSS switch to icon-left layout.
 */
function decorateCard(row) {
  // xwalk renders one cell per model field in JCR-alphabetical order:
  //   [0] ctaText, [1] ctaLink, [2] description, [3] heading, [4] image
  const cells = [...row.children];
  const ctaText = (cells[0]?.textContent || '').trim();
  const ctaLinkCell = cells[1];
  const descCell = cells[2];
  const headingText = (cells[3]?.textContent || '').trim();

  const li = document.createElement('li');
  li.className = 'xcel-feature-card';
  moveInstrumentation(row, li);

  // Image: detect by picture element from the image reference field (cells[4])
  const pictureEl = row.querySelector('picture');
  if (pictureEl) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'xcel-feature-card-image';
    imgWrapper.append(pictureEl);
    li.append(imgWrapper);
  }

  const content = document.createElement('div');
  content.className = 'xcel-feature-card-content';

  if (headingText) {
    const h = document.createElement('h3');
    h.className = 'xcel-feature-card-heading';
    h.textContent = headingText;
    content.append(h);
  }

  if (descCell && descCell.textContent.trim()) {
    const body = document.createElement('div');
    body.className = 'xcel-feature-card-body';
    while (descCell.firstChild) body.append(descCell.firstChild);
    content.append(body);
  }

  // CTA link: prefer an authored anchor in the ctaLink cell; fall back to its
  // plain-text href. Label comes from the ctaText field (then anchor text).
  const anchor = ctaLinkCell?.querySelector('a');
  const href = anchor
    ? anchor.getAttribute('href')
    : (ctaLinkCell?.textContent || '').trim();
  if (href) {
    const cta = document.createElement('a');
    cta.className = 'xcel-feature-card-cta';
    cta.href = href;
    cta.textContent = ctaText || (anchor ? anchor.textContent.trim() : '') || 'Learn More';
    content.append(cta);
  }

  li.append(content);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'xcel-feature-cards-header';

  const grid = document.createElement('ul');
  grid.className = 'xcel-feature-cards-grid';

  // xwalk renders container fields as separate 1-cell rows; AEM delivery may
  // combine all 3 container fields (heading, intro, variant) into one 3-cell
  // row. Accept ≤3 cells so both delivery modes are handled. Card items always
  // have 5 cells so they are never mistaken for header rows.
  let headingSet = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const hasLink = !!row.querySelector('a');

    if (!hasLink && cells.length <= 3 && grid.childElementCount === 0) {
      const cellText = (cells[0]?.textContent || '').trim();

      // When AEM delivers all 3 container fields in one row, variant is cells[2].
      // When xwalk delivers each field as its own row, variant is cells[0].
      const variantCell = (cells[2]?.textContent || '').trim();
      if (variantCell === 'media-object') block.classList.add('media-object');

      if (cellText === 'cards' || cellText === 'media-object') {
        if (cellText === 'media-object') block.classList.add('media-object');
        return;
      }

      if (!headingSet) {
        if (cellText) {
          const h = document.createElement('h2');
          h.className = 'xcel-feature-cards-heading';
          h.textContent = cellText;
          header.append(h);
          headingSet = true;
        }
        const intro = (cells[1]?.textContent || '').trim();
        if (intro) {
          const p = document.createElement('p');
          p.className = 'xcel-feature-cards-intro';
          p.textContent = intro;
          header.append(p);
        }
      } else {
        if (cellText) {
          const p = document.createElement('p');
          p.className = 'xcel-feature-cards-intro';
          p.textContent = cellText;
          header.append(p);
        }
      }
      return;
    }

    grid.append(decorateCard(row));
  });

  if (header.childElementCount) block.append(header);
  block.append(grid);
}
