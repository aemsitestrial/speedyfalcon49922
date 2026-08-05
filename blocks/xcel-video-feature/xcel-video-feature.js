/*
 * xcel-video-feature
 * A text column (heading + description + CTA) beside an embedded video
 * (e.g. YouTube). Used for the homepage "Local Energy" section.
 *
 * Authoring model (xwalk fields: heading, description, ctaText, ctaLink,
 * videoUrl). The video is lazy-loaded on first interaction to keep the page
 * light — a poster/facade is shown until the user clicks play.
 */
function youTubeId(url) {
  const re = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/;
  const m = url.match(re);
  return m ? m[1] : null;
}

function buildVideo(url) {
  const wrap = document.createElement('div');
  wrap.className = 'xcel-video-feature-media';

  const id = youTubeId(url);
  if (!id) {
    // Non-YouTube: fall back to a generic responsive iframe.
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.title = 'Video';
    iframe.loading = 'lazy';
    iframe.setAttribute('allow', 'encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    wrap.append(iframe);
    return wrap;
  }

  // Lazy YouTube facade: load the iframe only when the user opts in.
  const facade = document.createElement('button');
  facade.type = 'button';
  facade.className = 'xcel-video-feature-facade';
  facade.setAttribute('aria-label', 'Play video');
  facade.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;
  facade.innerHTML = '<span class="xcel-video-feature-play" aria-hidden="true"></span>';

  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    iframe.title = 'Video';
    iframe.loading = 'lazy';
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    facade.replaceWith(iframe);
  });

  wrap.append(facade);
  return wrap;
}

export default function decorate(block) {
  // xwalk renders one cell per model field in JCR-alphabetical order:
  //   [0] ctaText, [1] ctaLink, [2] description, [3] heading, [4] videoUrl
  const cells = [...block.children].map((row) => row.children[row.children.length - 1] || row);
  const ctaText = (cells[0]?.textContent || '').trim();
  const ctaLinkCell = cells[1];
  const descriptionText = (cells[2]?.textContent || '').trim();
  const heading = (cells[3]?.textContent || '').trim();
  const videoCell = cells[4];
  const videoUrl = (videoCell?.querySelector('a')?.getAttribute('href') || videoCell?.textContent || '').trim();

  block.textContent = '';

  const content = document.createElement('div');
  content.className = 'xcel-video-feature-content';

  if (heading) {
    const h = document.createElement('h2');
    h.className = 'xcel-video-feature-heading';
    h.textContent = heading;
    content.append(h);
  }

  if (descriptionText) {
    const body = document.createElement('div');
    body.className = 'xcel-video-feature-body';
    const p = document.createElement('p');
    p.textContent = descriptionText;
    body.append(p);
    content.append(body);
  }

  const ctaHref = ctaLinkCell?.querySelector('a')?.getAttribute('href')
    || (ctaLinkCell?.textContent || '').trim();
  if (ctaHref && ctaText) {
    const cta = document.createElement('a');
    cta.className = 'xcel-video-feature-cta';
    cta.href = ctaHref;
    cta.textContent = ctaText;
    content.append(cta);
  }

  block.append(content);

  if (videoUrl) block.append(buildVideo(videoUrl));
}
