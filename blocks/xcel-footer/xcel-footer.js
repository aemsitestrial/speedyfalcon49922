import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * xcel-footer
 * Multi-column footer with a copyright bottom bar.
 *
 * Universal Editor model (container + repeatable column items):
 *   - Container field: copyright (text) -> rendered as the first row.
 *   - Each column item: heading (text) + links (richtext <ul> of links).
 *
 * The block is also robust to plain table authoring, where each row is
 * "Heading | links" and a linkless row becomes the copyright bar.
 */

function normalizeLinks(cell) {
  const list = cell.querySelector('ul, ol');
  if (list) {
    list.classList.add('xcel-footer-links');
    return list;
  }

  // Fall back to plain text: one "Label, /path" entry per line.
  const ul = document.createElement('ul');
  ul.className = 'xcel-footer-links';
  const anchors = [...cell.querySelectorAll('a')];
  if (anchors.length) {
    anchors.forEach((a) => {
      const li = document.createElement('li');
      li.append(a);
      ul.append(li);
    });
  } else {
    cell.textContent
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [label, href] = line.split(',').map((part) => (part || '').trim());
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = label;
        a.href = href || '#';
        li.append(a);
        ul.append(li);
      });
  }
  return ul;
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const columns = document.createElement('div');
  columns.className = 'xcel-footer-columns';
  let bottomBar = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const contentCell = cells[1] || cells[0];
    const hasLinks = contentCell && contentCell.querySelector('a, ul, ol');

    // Any linkless row is the copyright bar (single container field).
    if (!hasLinks) {
      const text = ((cells[1] || cells[0])?.textContent || '').trim();
      if (!text) return;
      bottomBar = document.createElement('div');
      bottomBar.className = 'xcel-footer-bottom';
      const p = document.createElement('p');
      p.textContent = text;
      bottomBar.append(p);
      return;
    }

    const heading = (cells[0]?.textContent || '').trim();
    const column = document.createElement('div');
    column.className = 'xcel-footer-column';
    moveInstrumentation(row, column);

    if (heading) {
      const h = document.createElement('h4');
      h.className = 'xcel-footer-heading';
      h.textContent = heading;
      column.append(h);
    }

    column.append(normalizeLinks(contentCell));
    columns.append(column);
  });

  const inner = document.createElement('div');
  inner.className = 'xcel-footer-inner';
  inner.append(columns);
  block.append(inner);

  if (bottomBar) block.append(bottomBar);
}
