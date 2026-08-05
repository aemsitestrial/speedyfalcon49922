import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * xcel-quick-links
 * "Welcome! Get Started Here" — an optional heading followed by a row of
 * compact icon quick-link tiles.
 *
 * Universal Editor model (container + repeatable link items):
 *   - Container field: heading (text) -> the first row (no link).
 *   - Each link item: icon (image, optional) + label (text) + link (url).
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

    // The container heading is a single-cell row with no link and no image.
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

    // Link item — xwalk cells in JCR-alphabetical model order:
    //   [0] icon (image), [1] iconAlt, [2] label, [3] link
    const picture = cells[0]?.querySelector('picture');
    const iconImg = cells[0]?.querySelector('img');
    const iconAlt = (cells[1]?.textContent || '').trim();
    const label = (cells[2]?.textContent || '').trim();
    const linkCell = cells[3];
    const href = linkCell?.querySelector('a')?.getAttribute('href')
      || (linkCell?.textContent || '').trim()
      || '#';

    if (iconImg && iconAlt) iconImg.setAttribute('alt', iconAlt);

    const li = document.createElement('li');
    li.className = 'xcel-quick-links-item';
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    link.className = 'xcel-quick-links-link';
    link.href = href;

    if (picture) {
      const icon = document.createElement('span');
      icon.className = 'xcel-quick-links-icon';
      icon.append(picture);
      link.append(icon);
    }

    const text = document.createElement('span');
    text.className = 'xcel-quick-links-label';
    text.textContent = label;
    link.append(text);

    li.append(link);
    list.append(li);
  });

  if (header.childElementCount) block.append(header);
  block.append(list);
}
