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

  const columns = document.createElement('div');
  columns.className = 'xcel-footer-columns';

  // Rows 0–9: pairs of (col{n}heading, col{n}links) for 5 columns
  for (let i = 0; i < 10; i += 2) {
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

  // Row 10: copyright
  const copyrightCell = rows[10]?.children[1] || rows[10]?.children[0];
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
