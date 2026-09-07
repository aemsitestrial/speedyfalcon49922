import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * xcel-quick-links
 * Dark crimson band with "Welcome! Get Started Here" heading and 4 white outlined buttons.
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'xcel-quick-links-header';

  const list = document.createElement('ul');
  list.className = 'xcel-quick-links-list';

  rows.forEach((row) => {
    const cells = [...row.children];

    // Container heading: single cell, no link, no image.
    if (cells.length === 1 && !row.querySelector('a, picture')) {
      const text = (cells[0]?.textContent || '').trim();
      if (text) {
        const h = document.createElement('h2');
        h.className = 'xcel-quick-links-heading';
        h.textContent = text;
        header.append(h);
      }
      return;
    }

    // Link item — detect by content type (xwalk skips empty fields so indices shift).
    let label = '';
    let href = '#';

    cells.forEach((cell) => {
      if (cell.querySelector('a')) {
        href = cell.querySelector('a').getAttribute('href') || '#';
      } else {
        const text = (cell.textContent || '').trim();
        if (text && (text.startsWith('/') || /^https?:\/\//.test(text))) {
          href = text;
        } else if (text && !label) {
          label = text;
        }
      }
    });

    const li = document.createElement('li');
    li.className = 'xcel-quick-links-item';
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    link.className = 'xcel-quick-links-link';
    link.href = href;

    const span = document.createElement('span');
    span.className = 'xcel-quick-links-label';
    span.textContent = label;
    link.append(span);

    li.append(link);
    list.append(li);
  });

  if (header.childElementCount) block.append(header);
  block.append(list);
}
