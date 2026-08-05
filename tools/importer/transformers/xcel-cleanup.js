/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: xcel (Xcel Energy) site-wide cleanup.
 *
 * The homepage is a Salesforce Experience Cloud "state selector" page. It ships
 * with heavy non-authorable chrome (Aura loading/error overlays, toast/panel
 * managers, an embedded messaging/chat widget, tracking iframes/pixels, and an
 * SVG sprite <defs> region). This transformer strips all of that so only the
 * authorable body content survives: the state selector, the Contact Customer
 * Service CTA banner, and the real site footer (<c-xeg-site-footer>).
 *
 * ⚠️ Every selector below was verified against migration-work/cleaned.html.
 * NOTE: the authorable footer is <c-xeg-site-footer> / <footer> and is kept.
 * The Salesforce chrome wrapper class ".xeg-footer" is a DIFFERENT element and
 * IS removed. Do NOT remove the bare <footer> tag.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / widgets that can block or pollute block parsing.
    // Verified in cleaned.html:
    //   #auraLoadingBox (2), #auraErrorMask (10) — Aura loading/error overlay
    //   #embedded-messaging (573) + wrapper button — chat/messaging widget
    //   .grecaptcha-badge (551) — reCAPTCHA badge
    //   .forceCommunityToastManager (485), .forceHoverPrototype (494),
    //   .siteforceSpinnerManager (501) — Salesforce toast/hover/spinner managers
    //   div.DESKTOP.comm-panels-container (515) — Salesforce panel manager
    WebImporter.DOMUtils.remove(element, [
      '#auraLoadingBox',
      '#auraErrorMask',
      '#embedded-messaging',
      '.embeddedMessagingConversationButtonWrapper',
      '.embeddedMessagingLiveRegion',
      '.grecaptcha-badge',
      '.forceCommunityToastManager',
      '.forceHoverPrototype',
      '.siteforceSpinnerManager',
      'div.DESKTOP.comm-panels-container',
      '#kampyleButtonContainer',
      '#kampyleInviteContainer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome and framework artifacts.
    // Verified in cleaned.html:
    //   c-ma-billing-reroute (50), c-xe-maintenance-redirect (53),
    //   c-xeg-site-header-alert (57) — Salesforce/Aura redirect+alert stubs
    //   #xegs2c (59) — "Skip to main content" link
    //   c-xeg-site-header-desktop (60) — site header / utility + global nav
    //   siteforce-record-api-refresh-handler (41) — framework handler
    //   .xeg-theme-region (464) — wraps experience_messaging-embedded-messaging (467)
    //   .xeg-footer (472) — Salesforce chrome region (NOT the authorable footer)
    //   #sf-aria-live (522) — SR-only aria-live region
    //   grid of #httpsmyxcelenergycom...svg <defs> containers (524-547) — SVG sprite defs
    //   tracking iframes: #agency_ast_iFrame (564), .embeddedMessagingSiteContextFrame (569),
    //     #universal_pixel_l4yjqem (571)
    WebImporter.DOMUtils.remove(element, [
      'c-ma-billing-reroute',
      'c-xe-maintenance-redirect',
      'c-xeg-site-header-alert',
      '#xegs2c',
      'c-xeg-site-header-desktop',
      'siteforce-record-api-refresh-handler',
      '.xeg-theme-region',
      '.xeg-footer',
      '#sf-aria-live',
      '[id^="httpsmyxcelenergycom"]',
      '#agency_ast_iFrame',
      '.embeddedMessagingSiteContextFrame',
      '#universal_pixel_l4yjqem',
    ]);

    // Generic leftover / non-authorable elements (verified present in DOM).
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
      'style',
    ]);

    // Strip Decibel Insight click-tracking attributes left on links/buttons.
    // Verified: data-di-id / data-di-res-id / data-di-rand appear throughout.
    element.querySelectorAll('[data-di-id], [data-di-res-id], [data-di-rand]').forEach((el) => {
      el.removeAttribute('data-di-id');
      el.removeAttribute('data-di-res-id');
      el.removeAttribute('data-di-rand');
    });

    // Runtime-injected tracking pixel (rezync). The <img> is often wrapped in a
    // trailing <p>/<picture>; remove the image and unwrap any now-empty wrapper.
    element.querySelectorAll('img[src*="rezync"]').forEach((img) => {
      const wrapper = img.closest('picture') || img;
      const block = wrapper.closest('p') || wrapper;
      (block || wrapper).remove();
    });

    // Remove stray text nodes that are only backticks/whitespace (leftover from
    // inlined script template literals) so they don't become empty paragraphs.
    element.querySelectorAll('p').forEach((p) => {
      if (/^[`\s]+$/.test(p.textContent || '') && !p.querySelector('img, a, picture')) {
        p.remove();
      }
    });

    // Also strip bare backtick-only text nodes that are not yet wrapped in a <p>
    // (they get wrapped into an empty paragraph later during md conversion).
    const doc = element.ownerDocument;
    const walker = doc.createTreeWalker(element, 4 /* SHOW_TEXT */);
    const strayText = [];
    let node = walker.nextNode();
    while (node) {
      if (/^[`\s]+$/.test(node.nodeValue || '') && /`/.test(node.nodeValue || '')) {
        strayText.push(node);
      }
      node = walker.nextNode();
    }
    strayText.forEach((n) => n.remove());
  }
}
