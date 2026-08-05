function normalizeLinks(cell) {
  const list = cell.querySelector('ul, ol');
  if (list) {
    list.classList.add('xcel-footer-links');
    return list;
  }
  const ul = document.createElement('ul');
  ul.className = 'xcel-footer-links';
  [...cell.querySelectorAll('a')].forEach((a) => {
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  });
  return ul;
}

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  // Row 0: backgroundColor (alphabetically before col*)
  const bgCell = rows[0]?.children[1] || rows[0]?.children[0];
  const bgColor = (bgCell?.textContent || '').trim().toLowerCase();
  if (bgColor) block.classList.add(bgColor);

  const columns = document.createElement('div');
  columns.className = 'xcel-footer-columns';

  // Rows 1–10: pairs of (col{n}heading, col{n}links) for 5 columns
  for (let i = 1; i < 11; i += 2) {
    const headingCell = rows[i]?.children[1] || rows[i]?.children[0];
    const linksCell = rows[i + 1]?.children[1] || rows[i + 1]?.children[0];
    if (!headingCell) break;

    const column = document.createElement('div');
    column.className = 'xcel-footer-column';

    const headingText = (headingCell.textContent || '').trim();
    if (headingText) {
      const h = document.createElement('h4');
      h.className = 'xcel-footer-heading';
      h.textContent = headingText;
      column.append(h);
    }

    if (linksCell) column.append(normalizeLinks(linksCell));
    columns.append(column);
  }

  const inner = document.createElement('div');
  inner.className = 'xcel-footer-inner';
  inner.append(columns);
  block.append(inner);

  // Row 11: copyright
  const copyrightCell = rows[11]?.children[1] || rows[11]?.children[0];
  const copyrightText = (copyrightCell?.textContent || '').trim();
  if (copyrightText) {
    const bar = document.createElement('div');
    bar.className = 'xcel-footer-bottom';
    const p = document.createElement('p');
    p.textContent = copyrightText;
    bar.append(p);
    block.append(bar);
  }
}
