const COLOR_VALUES = ['white', 'black', 'teal'];

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Row 0 = color field, Row 1 = richtext content
  const colorCell = rows[0]?.querySelector(':scope > div:last-child');
  const contentCell = rows[1]?.querySelector(':scope > div:last-child');

  const colorVal = colorCell?.textContent?.trim().toLowerCase() || 'black';
  const color = COLOR_VALUES.includes(colorVal) ? colorVal : 'black';

  block.innerHTML = '';
  block.classList.add(`xcel-text--${color}`);

  if (contentCell) {
    const wrapper = document.createElement('div');
    wrapper.className = 'xcel-text-content';
    wrapper.innerHTML = contentCell.innerHTML;
    block.appendChild(wrapper);
  }
}
