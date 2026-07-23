import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isTestimonial = block.classList.contains('testimonial');

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    if (isTestimonial) {
      const quote = document.createElement('div');
      quote.className = 'cards-card-quote';
      quote.textContent = '“';
      li.prepend(quote);

      const body = li.querySelector('.cards-card-body');
      if (body) {
        const paragraphs = body.querySelectorAll('p');
        const lastP = paragraphs[paragraphs.length - 1];
        if (lastP) lastP.classList.add('cards-card-author');
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
