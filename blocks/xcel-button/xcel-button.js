export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const getCellText = (row) => {
    const cells = [...(row?.querySelectorAll(':scope > div') || [])];
    return cells.at(-1)?.textContent?.trim() || '';
  };

  // JCR delivers fields alphabetically: linkText (0), linkUrl (1)
  const text = getCellText(rows[0]) || 'Learn More';
  const href = getCellText(rows[1]) || '/';

  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  a.className = 'button';

  block.innerHTML = '';
  block.appendChild(a);
}
