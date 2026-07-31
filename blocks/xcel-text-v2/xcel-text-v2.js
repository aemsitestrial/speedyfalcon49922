const COLOR_VALUES = ['white', 'black', 'teal'];
const ALIGN_VALUES = ['left', 'center', 'right'];
const WIDTH_VALUES = ['full', 'narrow', 'wide'];

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cell = (row) => row?.querySelector(':scope > div:last-child');

  // JCR alphabetical order: alignment, color, content, ctaLabel, ctaLink, eyebrow, heading, width
  const alignVal = cell(rows[0])?.textContent?.trim().toLowerCase() || 'left';
  const colorVal = cell(rows[1])?.textContent?.trim().toLowerCase() || 'black';
  const contentCell = cell(rows[2]);
  const ctaLabel = cell(rows[3])?.textContent?.trim() || '';
  const ctaLink = cell(rows[4])?.textContent?.trim() || '';
  const eyebrow = cell(rows[5])?.textContent?.trim() || '';
  const heading = cell(rows[6])?.textContent?.trim() || '';
  const widthVal = cell(rows[7])?.textContent?.trim().toLowerCase() || 'full';

  const alignment = ALIGN_VALUES.includes(alignVal) ? alignVal : 'left';
  const color = COLOR_VALUES.includes(colorVal) ? colorVal : 'black';
  const width = WIDTH_VALUES.includes(widthVal) ? widthVal : 'full';

  block.innerHTML = '';
  block.classList.add(
    `xcel-text-v2--${color}`,
    `xcel-text-v2--${alignment}`,
    `xcel-text-v2--${width}`,
  );

  const wrapper = document.createElement('div');
  wrapper.className = 'xcel-text-v2-inner';

  if (eyebrow) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'xcel-text-v2-eyebrow';
    eyebrowEl.textContent = eyebrow;
    wrapper.appendChild(eyebrowEl);
  }

  if (heading) {
    const headingEl = document.createElement('h2');
    headingEl.className = 'xcel-text-v2-heading';
    headingEl.textContent = heading;
    wrapper.appendChild(headingEl);
  }

  if (contentCell) {
    const contentEl = document.createElement('div');
    contentEl.className = 'xcel-text-v2-content';
    contentEl.innerHTML = contentCell.innerHTML;
    wrapper.appendChild(contentEl);
  }

  if (ctaLabel && ctaLink) {
    const ctaEl = document.createElement('p');
    ctaEl.className = 'xcel-text-v2-cta button-container';
    const link = document.createElement('a');
    link.href = ctaLink;
    link.className = 'button';
    link.textContent = ctaLabel;
    ctaEl.appendChild(link);
    wrapper.appendChild(ctaEl);
  }

  block.appendChild(wrapper);
}
