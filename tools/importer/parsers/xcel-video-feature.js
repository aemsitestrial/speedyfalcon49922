/* eslint-disable */
/* global WebImporter */

/**
 * Parser for xcel-video-feature. Base: xcel-video-feature (new block).
 * Source: https://co.my.xcelenergy.com/s/  (Colorado homepage)
 * Selector: <c-dc-video-component-v2> ("Local Energy").
 * Project: xwalk — simple block, one row per model field.
 * Model (_xcel-video-feature.json) field order (JCR alphabetical):
 *   ctaText (text), ctaLink (text), description (text), heading (text), videoUrl (text).
 * Source: <div class="content"><h2 data-html="headerText"> + <p data-html="paragraphText">
 *   + <a class="xeg-button" href>CTA</a></div> and <iframe class="player" src="youtube/embed/ID">.
 */
export default function parse(element, { document }) {
  const headingEl = element.querySelector('h2, [data-html="headerText"], h1, h3');
  const headingText = headingEl ? headingEl.textContent.trim() : '';

  const descEl = element.querySelector('p[data-html="paragraphText"], .content p');
  const descText = descEl ? descEl.textContent.trim() : '';

  const anchor = element.querySelector('a.xeg-button, a[data-button-variant], .content a');
  const ctaText = anchor ? anchor.textContent.trim() : '';
  const ctaLink = anchor ? (anchor.getAttribute('href') || '').trim() : '';

  // Video URL: normalize the iframe's youtube embed src to a watch URL.
  const iframe = element.querySelector('iframe');
  let videoUrl = iframe ? (iframe.getAttribute('src') || '').trim() : '';
  const em = videoUrl.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (em) videoUrl = `https://www.youtube.com/watch?v=${em[1]}`;

  const mkText = (field, text) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(document.createTextNode(text));
    return frag;
  };

  const cells = [];
  cells.push([mkText('ctaText', ctaText)]);
  cells.push([mkText('ctaLink', ctaLink)]);
  cells.push([mkText('description', descText)]);
  cells.push([mkText('heading', headingText)]);
  cells.push([mkText('videoUrl', videoUrl)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'xcel-video-feature', cells });
  element.replaceWith(block);
}
