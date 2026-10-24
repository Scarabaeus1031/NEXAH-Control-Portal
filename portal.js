(async function () {
  const isPortalSource = location.protocol === 'file:' && location.pathname.includes('/OWNER_READ_PORTAL/portal-source/');
  if (isPortalSource) {
    document.querySelectorAll('[data-local-href]').forEach((link) => {
      link.href = link.dataset.localHref;
    });
  }

  const state = document.getElementById('buildState');
  const meta = document.getElementById('buildMeta');
  const summary = document.getElementById('sourceSummary');
  try {
    const response = await fetch('portal-manifest.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    const manifest = await response.json();
    state.textContent = manifest.status || 'READ_ONLY SNAPSHOT';
    meta.textContent = `Build ${manifest.built_at} · ${manifest.sources.length} Quellen`;
    summary.textContent = manifest.sources.map((source) => `${source.label} ${source.revision.slice(0, 8)}`).join(' · ');
  } catch (error) {
    state.textContent = 'QUELLANSICHT';
    meta.textContent = 'Build-Manifest erscheint im erzeugten Snapshot';
    summary.textContent = 'Portal source · noch kein Build-Metadatensatz';
  }
}());
