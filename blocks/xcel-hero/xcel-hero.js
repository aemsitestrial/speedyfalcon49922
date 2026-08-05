/*
 * xcel-hero
 * Branded homepage hero: a headline + subheading over an optional background image.
 *
 * Authoring model (xwalk fields: backgroundImage, backgroundImageAlt, heading, subheading):
 *   row 1: background image
 *   row 2: background image alt text
 *   row 3: heading
 *   row 4: subheading
 */
export default function decorate(block) {
  const rows = [...block.children];

  const picture = rows[0]?.querySelector('picture');
  const img = rows[0]?.querySelector('img');
  const altText = (rows[1]?.textContent || '').trim();
  const heading = (rows[2]?.textContent || '').trim();
  const subheading = (rows[3]?.textContent || '').trim();

  if (img && altText) img.setAttribute('alt', altText);

  block.textContent = '';

  if (picture) {
    const media = document.createElement('div');
    media.className = 'xcel-hero-media';
    media.append(picture);
    block.append(media);
  }

  const content = document.createElement('div');
  content.className = 'xcel-hero-content';

  if (heading) {
    const h = document.createElement('h1');
    h.className = 'xcel-hero-heading';
    h.textContent = heading;
    content.append(h);
  }

  if (subheading) {
    const p = document.createElement('p');
    p.className = 'xcel-hero-subheading';
    p.textContent = subheading;
    content.append(p);
  }

  block.append(content);
}
