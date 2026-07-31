export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const getCellText = (row) => {
    const cells = [...(row?.querySelectorAll(':scope > div') || [])];
    return cells.at(-1)?.textContent?.trim() || '';
  };

  // JCR alphabetical order: "link" (0) < "linkText" (1)
  const href = getCellText(rows[0]) || '/';
  const text = getCellText(rows[1]) || 'Learn More';

  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  a.className = 'button';

  block.innerHTML = '';
  block.appendChild(a);
}
