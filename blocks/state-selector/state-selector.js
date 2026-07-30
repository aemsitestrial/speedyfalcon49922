const STATE_ORDER = [
  'Colorado', 'Michigan', 'Minnesota', 'New Mexico',
  'North Dakota', 'South Dakota', 'Texas', 'Wisconsin',
];

const STATE_SVGS = {
  // Colorado — nearly perfect rectangle
  colorado: `<svg viewBox="0 0 100 68" xmlns="http://www.w3.org/2000/svg">
    <polygon points="4,4 96,4 96,64 4,64" fill="currentColor"/>
  </svg>`,

  // Michigan — lower peninsula mitten with thumb pointing east
  michigan: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="
      36,4 50,2 60,8 56,22 70,16 86,24 88,42 78,54 84,68 78,82
      62,78 56,92 46,102 34,110 20,106 8,86 4,58 10,32 20,14
    " fill="currentColor"/>
  </svg>`,

  // Minnesota — notch in upper-right from Lake Superior
  minnesota: `<svg viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg">
    <polygon points="
      12,4 58,4 60,18 82,18 78,52 62,52 52,80 44,92 30,88 12,68 4,44 8,20
    " fill="currentColor"/>
  </svg>`,

  // New Mexico — rectangle with step cut from bottom-left
  'new mexico': `<svg viewBox="0 0 90 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="4,4 86,4 86,92 18,92 18,72 4,72" fill="currentColor"/>
  </svg>`,

  // North Dakota — slightly tapering trapezoid
  'north dakota': `<svg viewBox="0 0 110 72" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,10 100,4 104,60 4,68" fill="currentColor"/>
  </svg>`,

  // South Dakota — rectangle with wedge cut from bottom-left
  'south dakota': `<svg viewBox="0 0 110 72" xmlns="http://www.w3.org/2000/svg">
    <polygon points="4,4 104,4 104,68 36,68 4,50" fill="currentColor"/>
  </svg>`,

  // Texas — panhandle top-left, curves into Gulf Coast
  texas: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
    <polygon points="
      4,4 42,4 42,28 62,28 82,38 92,56 86,74 80,90 64,98 50,106
      36,100 18,82 8,62 4,36
    " fill="currentColor"/>
  </svg>`,

  // Wisconsin — eastern peninsula (Door County) + Lake Michigan coast
  wisconsin: `<svg viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg">
    <polygon points="
      22,4 56,4 72,14 78,32 68,50 74,66 58,82 40,86 22,78 8,58 4,36 12,16
    " fill="currentColor"/>
  </svg>`,
};

const FALLBACK_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="90" height="90" fill="currentColor" rx="4"/>
</svg>`;

const DEFAULT_HEADING = 'Select a Service Area to Explore';

function buildStateCard(name, link) {
  const key = name.toLowerCase().trim();
  const svg = STATE_SVGS[key] || FALLBACK_SVG;

  const a = document.createElement('a');
  a.href = link || '/';
  a.className = 'state-selector-item';
  a.innerHTML = `
    <span class="state-selector-icon">${svg}</span>
    <span class="state-selector-name">${name}</span>
  `;
  return a;
}

function getLastCellText(row) {
  const cells = [...(row?.querySelectorAll(':scope > div') || [])];
  return cells.at(-1)?.textContent?.trim() || '';
}

function isLink(text) {
  return text.startsWith('/') || text.startsWith('http');
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Detect heading: first row is heading if its value is not a URL.
  // This keeps backwards-compatibility with older blocks (8 link rows, no heading row).
  let headingText = DEFAULT_HEADING;
  let linkRows = rows;

  if (rows.length > 0) {
    const firstVal = getLastCellText(rows[0]);
    if (firstVal && !isLink(firstVal)) {
      headingText = firstVal;
      linkRows = rows.slice(1);
    }
  }

  const heading = document.createElement('h2');
  heading.className = 'state-selector-heading';
  heading.textContent = headingText;

  const grid = document.createElement('ul');
  grid.className = 'state-selector-grid';

  STATE_ORDER.forEach((name, i) => {
    const link = isLink(getLastCellText(linkRows[i]))
      ? getLastCellText(linkRows[i])
      : '/';
    const li = document.createElement('li');
    li.appendChild(buildStateCard(name, link));
    grid.appendChild(li);
  });

  block.innerHTML = '';
  block.appendChild(heading);
  block.appendChild(grid);
}
