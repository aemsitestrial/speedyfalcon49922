const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/XcelEnergy',
    label: 'Facebook',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  },
  {
    href: 'https://x.com/XcelEnergy',
    label: 'X',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.844L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
  },
  {
    href: 'https://www.instagram.com/xcelenergy/',
    label: 'Instagram',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3zm5 3a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.25-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>',
  },
  {
    href: 'https://www.linkedin.com/company/xcel-energy',
    label: 'LinkedIn',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  },
  {
    href: 'https://www.youtube.com/user/XcelEnergy',
    label: 'YouTube',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>',
  },
];

const LEGAL_LINKS = [
  { href: '/online-terms-of-use', label: 'Online Terms of Use' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/accessibility', label: 'Accessibility' },
];

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

function buildBottomBar(copyrightText) {
  const bar = document.createElement('div');
  bar.className = 'xcel-footer-bottom';

  const inner = document.createElement('div');
  inner.className = 'xcel-footer-bottom-inner';

  // Left: wordmark + copyright
  const left = document.createElement('div');
  left.className = 'xcel-footer-bottom-left';

  const logo = document.createElement('div');
  logo.className = 'xcel-footer-logo';
  logo.innerHTML = '<span class="xcel-footer-logo-wordmark">Xcel Energy<sup>®</sup></span>';
  left.append(logo);

  if (copyrightText) {
    const copy = document.createElement('p');
    copy.className = 'xcel-footer-copyright';
    copy.textContent = copyrightText;
    left.append(copy);
  }

  // Center: social icons
  const socials = document.createElement('nav');
  socials.className = 'xcel-footer-socials';
  socials.setAttribute('aria-label', 'Social media');

  SOCIAL_LINKS.forEach(({ href, label, svg }) => {
    const a = document.createElement('a');
    a.className = 'xcel-footer-social-link';
    a.href = href;
    a.setAttribute('aria-label', label);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.innerHTML = svg;
    socials.append(a);
  });

  inner.append(left, socials);
  bar.append(inner);

  // Legal links row
  const legal = document.createElement('div');
  legal.className = 'xcel-footer-legal';

  const legalInner = document.createElement('div');
  legalInner.className = 'xcel-footer-legal-inner';

  LEGAL_LINKS.forEach(({ href, label }) => {
    const a = document.createElement('a');
    a.className = 'xcel-footer-legal-link';
    a.href = href;
    a.textContent = label;
    legalInner.append(a);
  });

  legal.append(legalInner);
  bar.append(legal);

  return bar;
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

  // Row 11: copyright — feeds into the bottom bar
  const copyrightCell = rows[11]?.children[1] || rows[11]?.children[0];
  const copyrightText = (copyrightCell?.textContent || '').trim();
  block.append(buildBottomBar(copyrightText));
}
