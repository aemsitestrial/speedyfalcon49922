import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * xcel-feature-cards
 * A section heading + optional intro, followed by a responsive grid of
 * feature cards (heading + description + CTA link). Handles 2-up, 3-up and
 * 4-up layouts automatically via a responsive auto-fit grid.
 *
 * Universal Editor model (container + repeatable card items):
 *   - Container fields: heading (text), intro (text) -> the first row.
 *   - Each card item fields (JCR-alphabetical): ctaText, ctaLink, description,
 *     heading. Cells are therefore detected by content type rather than a
 *     fixed position so the block is resilient to field ordering.
 */
function decorateCard(row) {
  // xwalk renders one cell per model field in JCR-alphabetical order:
  //   [0] ctaText, [1] ctaLink, [2] description, [3] heading
  const cells = [...row.children];
  const ctaText = (cells[0]?.textContent || '').trim();
  const ctaLinkCell = cells[1];
  const descCell = cells[2];
  const headingText = (cells[3]?.textContent || '').trim();

  const li = document.createElement('li');
  li.className = 'xcel-feature-card';
  moveInstrumentation(row, li);

  if (headingText) {
    const h = document.createElement('h3');
    h.className = 'xcel-feature-card-heading';
    h.textContent = headingText;
    li.append(h);
  }

  if (descCell && descCell.textContent.trim()) {
    const body = document.createElement('div');
    body.className = 'xcel-feature-card-body';
    while (descCell.firstChild) body.append(descCell.firstChild);
    li.append(body);
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
    li.append(cta);
  }

  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'xcel-feature-cards-header';

  const grid = document.createElement('ul');
  grid.className = 'xcel-feature-cards-grid';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const hasLink = !!row.querySelector('a');

    // The first link-less row (1-2 plain text cells) is the section header.
    if (index === 0 && !hasLink && cells.length <= 2) {
      const heading = (cells[0]?.textContent || '').trim();
      const intro = (cells[1]?.textContent || '').trim();
      if (heading) {
        const h = document.createElement('h2');
        h.className = 'xcel-feature-cards-heading';
        h.textContent = heading;
        header.append(h);
      }
      if (intro) {
        const p = document.createElement('p');
        p.className = 'xcel-feature-cards-intro';
        p.textContent = intro;
        header.append(p);
      }
      return;
    }

    grid.append(decorateCard(row));
  });

  if (header.childElementCount) block.append(header);
  block.append(grid);
}
