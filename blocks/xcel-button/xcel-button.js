const VALID_STYLES = ['standard', 'card', 'pill', 'outline'];

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const getCellText = (row) => {
    const cells = [...(row?.querySelectorAll(':scope > div') || [])];
    return cells.at(-1)?.textContent?.trim() || '';
  };

  const styleVal = getCellText(rows[0]).toLowerCase();
  const label = getCellText(rows[1]) || 'Learn More';
  const link = getCellText(rows[2]) || '/';

  const style = VALID_STYLES.includes(styleVal) ? styleVal : 'standard';

  const a = document.createElement('a');
  a.href = link;
  a.textContent = label;
  a.className = `xcel-btn xcel-btn--${style}`;

  block.innerHTML = '';
  block.appendChild(a);
}
