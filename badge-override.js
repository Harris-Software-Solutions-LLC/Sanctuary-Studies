/**
 * Badge Override — Sanctuary Studies
 * Removes any injected third-party badges and replaces with
 * "Made by Harris Software Solutions, LLC" branding.
 */
(function() {
  'use strict';

  const DISMISSED_KEY = 'harris-badge-dismissed';

  // Remove any NinjaTech / third-party injected elements
  function removeThirdPartyBadges() {
    const selectors = [
      '#ninja-daytona-banner',
      '#ninja-badge',
      '[id*="ninja"]',
      '[class*="ninja-badge"]',
      '[class*="daytona"]'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    // Reset any injected body padding
    if (document.body && document.body.style.paddingTop) {
      const pt = parseInt(document.body.style.paddingTop, 10);
      if (pt > 0 && pt <= 60) {
        document.body.style.paddingTop = '';
      }
    }
  }

  // Inject Harris Software Solutions badge
  function injectHarrisBadge() {
    if (document.getElementById('harris-badge')) return;
    if (localStorage.getItem(DISMISSED_KEY) === '1') return;

    const badge = document.createElement('div');
    badge.id = 'harris-badge';
    badge.innerHTML = `
      <a href="https://www.harrissoftwaresolutions.com" target="_blank" rel="noopener noreferrer"
         style="color:#C9A84C;text-decoration:none;font-weight:600;font-size:.8rem;">
        ★ Made by Harris Software Solutions, LLC
      </a>
      <button id="harris-badge-close" aria-label="Dismiss"
        style="background:none;border:none;color:rgba(255,255,255,.5);font-size:.9rem;
               cursor:pointer;padding:0 0 0 .75rem;line-height:1;">✕</button>
    `;
    Object.assign(badge.style, {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: '99999',
      background: 'linear-gradient(135deg,#1C2A39,#2d4a6e)',
      border: '1px solid #8C6B3C',
      borderRadius: '8px',
      padding: '.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,.4)',
      fontFamily: 'sans-serif',
      transition: 'opacity .3s'
    });

    document.body.appendChild(badge);

    document.getElementById('harris-badge-close').addEventListener('click', function() {
      badge.style.opacity = '0';
      setTimeout(() => badge.remove(), 320);
      localStorage.setItem(DISMISSED_KEY, '1');
    });
  }

  // Run immediately and watch for dynamic injections
  function run() {
    removeThirdPartyBadges();
    injectHarrisBadge();
  }

  // MutationObserver to catch dynamically injected badges
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          const id = node.id || '';
          const cls = node.className || '';
          if (id.includes('ninja') || cls.includes('ninja') || cls.includes('daytona')) {
            node.remove();
            if (document.body && document.body.style.paddingTop) {
              const pt = parseInt(document.body.style.paddingTop, 10);
              if (pt > 0 && pt <= 60) document.body.style.paddingTop = '';
            }
          }
        }
      });
    });
  });

  // Start observing once DOM is available
  if (document.body) {
    run();
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      run();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Poll for 10 seconds to catch late-injected badges
  let pollCount = 0;
  const pollInterval = setInterval(function() {
    removeThirdPartyBadges();
    if (++pollCount >= 20) clearInterval(pollInterval);
  }, 500);

})();