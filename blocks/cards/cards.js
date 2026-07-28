import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function decorateTestimonialCard(li) {
  // Field order matches model: image, name, text, color, link
  const [imageDiv, nameDiv, textDiv, colorDiv, linkDiv] = [...li.children];

  const colorValue = colorDiv ? colorDiv.textContent.trim().toLowerCase() : 'teal';
  const nameText = nameDiv ? nameDiv.textContent.trim() : '';
  const linkText = linkDiv ? linkDiv.textContent.trim() : '';

  [imageDiv, nameDiv, textDiv, colorDiv, linkDiv].forEach((d) => d && d.remove());

  if (colorValue) li.classList.add(`color-${colorValue}`);

  const quoteEl = document.createElement('div');
  quoteEl.className = 'cards-card-quote';
  quoteEl.textContent = '“';
  li.append(quoteEl);

  if (textDiv) {
    textDiv.className = 'cards-card-body';
    li.append(textDiv);
  }

  const wave = document.createElement('div');
  wave.className = 'cards-card-wave';

  if (imageDiv) {
    imageDiv.className = 'cards-card-image';
    wave.append(imageDiv);
  }

  if (nameText) {
    const author = document.createElement('p');
    author.className = 'cards-card-author';
    author.textContent = nameText;
    wave.append(author);
  }

  li.append(wave);

  if (linkText && !linkText.startsWith('#')) {
    const overlay = document.createElement('a');
    overlay.href = linkText;
    overlay.className = 'cards-card-overlay';
    overlay.setAttribute('aria-label', 'Read more');
    li.append(overlay);
  }
}

export default function decorate(block) {
  const isTestimonial = block.classList.contains('testimonial');

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    if (isTestimonial) {
      decorateTestimonialCard(li);
    } else {
      let cardLink = '';
      [...li.children].forEach((div) => {
        const text = div.textContent.trim();
        if (div.children.length === 1 && div.querySelector('picture')) {
          div.className = 'cards-card-image';
        } else if (!div.children.length && (text.startsWith('/') || text.startsWith('http'))) {
          cardLink = text;
          div.remove();
        } else {
          div.className = 'cards-card-body';
        }
      });

      if (cardLink) {
        const overlay = document.createElement('a');
        overlay.href = cardLink;
        overlay.className = 'cards-card-overlay';
        overlay.setAttribute('aria-label', 'Read more');
        li.append(overlay);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
