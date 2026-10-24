(function () {
  const allowedPageSuffixes = [
    '/00%20EXECUTIVE/NEXAH-Mission-Control/INTERNAL_NAVIGATOR/index.html',
    '/00%20EXECUTIVE/NEXAH-Mission-Control/CURRENT/RETURN_INGESTION_AND_PUBLICATION_BOUNDARY_PROTOCOL.md',
    '/10%20NEXAH%20CORE/NEXAH/BUILDER/B0_BUILDER_DECK/index.html',
    '/10%20NEXAH%20CORE/NEXAH/BUILDER/B0_BUILDER_DECK/public-field.html',
    '/10%20NEXAH%20CORE/NEXAH/BUILDER/B0_BUILDER_DECK/a0-tools.html',
    '/30%20SCIENCE%20LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/A0_RESEARCH_DESK.html'
  ];
  const allowedExternalHosts = new Set([
    'nexah.de',
    'www.nexah.de',
    'nexahedron.com',
    'www.nexahedron.com',
    'scarabaeus1033.net',
    'www.scarabaeus1033.net'
  ]);

  function samePage(target) {
    return target.origin === location.origin && target.pathname === location.pathname;
  }

  function permitted(target) {
    if (samePage(target)) return true;
    if (target.origin !== location.origin) return allowedExternalHosts.has(target.hostname);
    return allowedPageSuffixes.some((suffix) => target.pathname.endsWith(suffix));
  }

  function notice() {
    let node = document.getElementById('public-cut-notice');
    if (!node) {
      node = document.createElement('div');
      node.id = 'public-cut-notice';
      node.setAttribute('role', 'status');
      Object.assign(node.style, {
        position: 'fixed', left: '50%', bottom: '24px', zIndex: 2147483647,
        transform: 'translateX(-50%)', padding: '10px 14px', border: '1px solid #ffc34d',
        background: '#071821', color: '#d9edf4', font: '600 13px system-ui',
        boxShadow: '0 12px 40px rgba(0,0,0,.38)'
      });
      document.body.appendChild(node);
    }
    node.textContent = 'Dieser Link gehört nicht zum öffentlichen Drei-Surface-Cut.';
    node.hidden = false;
    clearTimeout(node._hideTimer);
    node._hideTimer = setTimeout(() => { node.hidden = true; }, 2800);
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const raw = anchor.getAttribute('href');
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:')) return;
    const target = new URL(raw, location.href);
    if (permitted(target)) return;
    event.preventDefault();
    notice();
  }, true);
}());
