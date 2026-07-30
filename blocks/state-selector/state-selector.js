const STATE_ORDER = [
  'Colorado', 'Michigan', 'Minnesota', 'New Mexico',
  'North Dakota', 'South Dakota', 'Texas', 'Wisconsin',
];

const STATE_SVGS = {
  colorado: `<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,5 95,5 95,65 5,65" fill="currentColor"/>
  </svg>`,
  michigan: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="30,5 60,5 75,20 80,40 65,55 55,70 40,80 20,70 5,55 5,25 20,10"
      fill="currentColor"/>
  </svg>`,
  minnesota: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
    <polygon points="25,5 70,5 70,10 95,10 95,65 65,65 55,90 30,90 5,65 5,15"
      fill="currentColor"/>
  </svg>`,
  'new mexico': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,5 95,5 95,95 15,95 15,80 5,80" fill="currentColor"/>
  </svg>`,
  'north dakota': `<svg viewBox="0 0 110 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,15 100,5 100,70 5,75" fill="currentColor"/>
  </svg>`,
  'south dakota': `<svg viewBox="0 0 110 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,5 100,5 100,70 30,70 5,55" fill="currentColor"/>
  </svg>`,
  texas: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,5 70,5 75,25 95,40 85,55 70,65 75,80 50,80 40,95 20,90 5,60"
      fill="currentColor"/>
  </svg>`,
  wisconsin: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="25,5 65,5 80,15 85,35 70,50 75,70 50,80 20,75 5,55 5,25"
      fill="currentColor"/>
  </svg>`,
};

const FALLBACK_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="90" height="90" fill="currentColor" rx="4"/>
</svg>`;

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

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('ul');
  grid.className = 'state-selector-grid';

  // Each row corresponds to one state in STATE_ORDER order.
  // Read the last cell of the row to get the link value (handles 1-cell or 2-cell rows).
  const states = STATE_ORDER.map((name, i) => {
    const cells = [...(rows[i]?.querySelectorAll(':scope > div') || [])];
    const link = cells.at(-1)?.textContent?.trim() || '/';
    return { name, link };
  });

  states.forEach(({ name, link }) => {
    const li = document.createElement('li');
    li.appendChild(buildStateCard(name, link));
    grid.appendChild(li);
  });

  block.innerHTML = '';
  block.appendChild(grid);
}
