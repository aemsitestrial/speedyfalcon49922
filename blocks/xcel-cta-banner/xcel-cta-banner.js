// JCR alphabetical field order: backgroundColor, buttonLabel, buttonLink, eyebrow, heading, subtext
export default function decorate(block) {
  const rows = [...block.children];

  const backgroundColor = rows[0]?.querySelector('div:last-child')?.textContent.trim() || 'crimson';
  const buttonLabel = rows[1]?.querySelector('div:last-child')?.textContent.trim() || 'Contact Us';
  const buttonLink = rows[2]?.querySelector('div:last-child')?.textContent.trim() || '/contact';
  const eyebrow = rows[3]?.querySelector('div:last-child')?.textContent.trim() || '';
  const heading = rows[4]?.querySelector('div:last-child')?.textContent.trim() || '';
  const subtext = rows[5]?.querySelector('div:last-child')?.textContent.trim() || '';

  block.dataset.bg = backgroundColor;

  block.innerHTML = `
    <div class="xcel-cta-banner-content">
      <div class="xcel-cta-banner-text">
        ${eyebrow ? `<p class="xcel-cta-banner-eyebrow">${eyebrow}</p>` : ''}
        ${heading ? `<h2 class="xcel-cta-banner-heading">${heading}</h2>` : ''}
        ${subtext ? `<p class="xcel-cta-banner-subtext">${subtext}</p>` : ''}
      </div>
      <div class="xcel-cta-banner-action">
        <a class="button" href="${buttonLink}">${buttonLabel}</a>
      </div>
    </div>
  `;
}
