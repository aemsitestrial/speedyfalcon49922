const VALID_STYLES = ['standard', 'pill', 'square', 'card'];

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
  // Use .button as base so all OOTB styles apply; shape modifier overrides only border-radius
  a.className = `button xcel-btn--${style}`;

  block.innerHTML = '';
  block.appendChild(a);
}
