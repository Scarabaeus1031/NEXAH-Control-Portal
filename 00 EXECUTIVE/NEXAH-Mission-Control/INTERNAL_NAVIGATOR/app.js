"use strict";

const state = { catalog: null, category: "", search: "", kind: "", repo: "", binding: "", eligibility: "", priority: "", theme: "", selected: null, pathItems: [], limit: 160 };
const $ = (id) => document.getElementById(id);
const nodes = {
  truth: $("truth"), masterPath: $("masterPath"), startMasterPath: $("startMasterPath"), deepDiveGroups: $("deepDiveGroups"), a1Grid: $("a1Grid"), counts: $("counts"),
  surfaceIndex: $("surfaceIndex"),
  search: $("search"), kind: $("kindFilter"), repo: $("repoFilter"), categories: $("categoryFilters"),
  binding: $("bindingFilter"), bindingSummary: $("bindingSummary"), bridgeNote: $("bridgeNote"), scienceLink: $("scienceNavigatorLink"),
  eligibility: $("eligibilityFilter"), eligibilitySummary: $("eligibilitySummary"),
  priority: $("priorityFilter"), theme: $("themeFilter"),
  cards: $("cards"), result: $("resultLine"), detail: $("detail"), dialog: $("previewDialog"),
  previewTitle: $("previewTitle"), previewBody: $("previewBody"), closePreview: $("closePreview")
};

const SURFACE_CABINET = [
  { id: "a0-private-desk", code: "05", title: "A0 Science Desk", role: "Science authority · private workbench" },
  { id: "preserved-engines", code: "04", title: "Preserved Engines", role: "THE EYE lineage · private overlay" },
  { id: "reading-path", code: "01", title: "NEXAH Lesebaum", role: "Orientation lens · shared reader" },
  { id: "book", code: "03/06", title: "Foundation Book", role: "Framework · work · experience" },
  { id: "current-flagships", code: "05/06", title: "Science → Builder → Human", role: "Bound flagship lenses" },
  { id: "visual-series", code: "01", title: "Visual Overview", role: "Owner orientation · documentary" },
  { id: "deep-dives", code: "03", title: "Overview & Deep Dives", role: "Library · currentness layers" },
  { id: "transition-observatory", code: "05/04", title: "Transition Observatory", role: "Science return · verification" },
  { id: "bridge", code: "03/05", title: "Binding Bridge", role: "Source relation · provenance" },
  { id: "source-field", code: "02", title: "Source Field", role: "Mission Control discovery catalog" }
];

function setupSurfaceCabinet() {
  const surfaces = SURFACE_CABINET.map(config => ({...config, node: $(config.id)})).filter(surface => surface.node);
  surfaces.forEach(surface => {
    const body = document.createElement("div");
    body.className = "surface-body";
    body.id = `${surface.id}-body`;
    while (surface.node.firstChild) body.append(surface.node.firstChild);
    body.hidden = true;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "surface-toggle";
    toggle.setAttribute("aria-controls", body.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = `<small>${escapeHtml(surface.code)}</small><span><strong>${escapeHtml(surface.title)}</strong><em>${escapeHtml(surface.role)}</em></span><b aria-hidden="true">+</b>`;
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.querySelector("b").textContent = expanded ? "+" : "−";
      body.hidden = expanded;
    });

    surface.node.classList.add("collapsible-surface");
    surface.node.append(toggle, body);
    surface.toggle = toggle;
    surface.body = body;
  });

  state.openSurface = (id, scroll = true) => {
    const surface = surfaces.find(entry => entry.id === id);
    if (!surface) return;
    surface.toggle.setAttribute("aria-expanded", "true");
    surface.toggle.querySelector("b").textContent = "−";
    surface.body.hidden = false;
    if (scroll) surface.node.scrollIntoView({behavior: "smooth", block: "start"});
  };

  if (nodes.surfaceIndex) {
    nodes.surfaceIndex.innerHTML = surfaces.map(surface => `<button type="button" data-surface-target="${escapeHtml(surface.id)}"><b>${escapeHtml(surface.code)}</b><span>${escapeHtml(surface.title)}</span><em aria-hidden="true">+</em></button>`).join("");
    nodes.surfaceIndex.querySelectorAll("[data-surface-target]").forEach(button => button.addEventListener("click", () => state.openSurface(button.dataset.surfaceTarget)));
  }

  const hashTarget = window.location.hash.slice(1);
  if (surfaces.some(surface => surface.id === hashTarget)) state.openSurface(hashTarget, false);
  window.addEventListener("hashchange", () => {
    const id = window.location.hash.slice(1);
    if (surfaces.some(surface => surface.id === id)) state.openSurface(id, false);
  });
}

const PATH_LABELS = {
  "PATH-1": "Grundbeschreibung",
  "PATH-2": "Achievements",
  "PATH-3": "Owner View",
  "PATH-4": "Human View",
  "PATH-5": "Science View",
  "PATH-6": "Builder View"
};

const BOOK_CLUSTERS = [
  { role: "status", label: "STATUS & CONTROL", title: "Buchpaket", description: "Milestone, Mission-Control-Return und Projektgrenze." },
  { role: "foundation", label: "FOUNDATIONS & VOICE", title: "Quellenbasis", description: "Mission, Grundbeschreibung, Field Notes und der erhaltene Essay." },
  { role: "strategy", label: "RETURN", title: "Vom Buch zur Plattform", description: "Der strategische Return aus dem Buchprozess." }
];

const DEEP_DIVE_ORDER = {
  current: ["DD-ACHIEVEMENTS", "DD-A0-FRAMEWORK", "DD-NAVIGATOR-CONTROL", "DD-BOOK-IDEAS", "DD-CHORES", "DD-IDEAS", "DD-PUBLIC", "DD-OUTREACH"]
};

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
const bytes = (value) => !value ? "—" : value < 1024 ? `${value} B` : value < 1048576 ? `${(value/1024).toFixed(1)} KB` : `${(value/1048576).toFixed(1)} MB`;
const badgeClass = (item) => ["Book", "A1"].includes(item.category) ? "a1" : item.kind === "html" ? "html" : item.kind === "3d" ? "threed" : "";
const BINDING_LABELS = {
  admitted: "gebunden · aufgenommen",
  supporting: "gebunden · unterstützend",
  candidate: "Kandidat · Review nötig",
  unbound: "ungebunden",
  "excluded-historical": "historisch · nicht gebunden"
};
const bindingLabel = (status) => BINDING_LABELS[status] || status || "ungebunden";
const bindingBadgeClass = (status) => `binding-${String(status || "unbound").replace(/[^a-z-]/g, "")}`;
const ELIGIBILITY_LABELS = {
  "review-now": "jetzt prüfen",
  "family-review": "Versionsfamilie prüfen",
  "support-review": "als Support prüfen",
  "collection-bind": "als Sammlung binden",
  "not-individual": "nicht einzeln aufnehmen",
  defer: "zurückstellen",
  closed: "bereits geschlossen"
};
const eligibilityLabel = (queue) => ELIGIBILITY_LABELS[queue] || queue || "nicht klassifiziert";
const eligibilityClass = (queue) => `eligibility-${String(queue || "unknown").replace(/[^a-z-]/g, "")}`;

function scienceEntityHref(item) {
  const base = scienceNavigatorBase();
  const entityId = item.binding?.entity_ids?.[0];
  return base && entityId ? `${base}#entity=${encodeURIComponent(entityId)}` : base ? `${base}#catalog` : "";
}

function scienceNavigatorBase() {
  if (window.location.protocol === "file:") {
    return String(nodes.scienceLink?.dataset.fileHref || "").split("#")[0];
  }
  return String(state.catalog?.science_navigator?.href || "").split("#")[0];
}

async function loadCatalog() {
  let fetchError = null;
  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch("catalog.json", {cache: "no-store"});
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return {catalog: await response.json(), source: "live catalog"};
    } catch (error) {
      fetchError = error;
    }
  }
  if (globalThis.NEXAH_MISSION_CONTROL_CATALOG) {
    return {catalog: globalThis.NEXAH_MISSION_CONTROL_CATALOG, source: "direct-file snapshot"};
  }
  if (fetchError) throw fetchError;
  throw new Error("catalog.internal.js fehlt oder ist nicht lesbar");
}

function runtimeBaseUrl(baseHref) {
  const raw = String(baseHref || "").trim();
  if (window.location.protocol === "file:" && raw.startsWith("/")) {
    return new URL(`../../../${raw.replace(/^\/+/, "")}`, window.location.href);
  }
  return new URL(raw || window.location.href, window.location.href);
}

function safeUrl(raw, baseHref) {
  try {
    const cleaned = String(raw).trim().replace(/^<|>$/g, "");
    const base = runtimeBaseUrl(baseHref);
    const url = new URL(cleaned, base);
    if (["http:", "https:"].includes(url.protocol)) return escapeHtml(url.href);
    if (window.location.protocol === "file:" && url.protocol === "file:") {
      const ecosystemRoot = new URL("../../../", window.location.href);
      return url.href.startsWith(ecosystemRoot.href) ? escapeHtml(url.href) : "#";
    }
    return "#";
  } catch (_) { return "#"; }
}

function inlineMarkdown(value, baseHref) {
  const fragments = [];
  const preserve = html => {
    fragments.push(html);
    return `\u0000FRAGMENT${fragments.length - 1}\u0000`;
  };
  const addEmphasis = text => text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>");
  let text = escapeHtml(value).replace(/`([^`]+)`/g, (_, content) => {
    return preserve(`<code>${content}</code>`);
  });
  text = text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, href) => preserve(`<img src="${safeUrl(href, baseHref)}" alt="${alt}">`))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => preserve(`<a href="${safeUrl(href, baseHref)}" target="_blank" rel="noopener">${addEmphasis(label)}</a>`));
  text = addEmphasis(text)
    .replace(/\u0000FRAGMENT(\d+)\u0000/g, (_, index) => fragments[Number(index)]);
  return text;
}

function markdownToHtml(markdown, baseHref) {
  const lines = String(markdown).replace(/\r/g, "").split("\n");
  const html = [];
  const toc = [];
  const slugs = new Map();
  const slug = label => {
    const root = label.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9äöüß]+/gi, "-").replace(/^-|-$/g, "") || "section";
    const count = (slugs.get(root) || 0) + 1;
    slugs.set(root, count);
    return count === 1 ? root : `${root}-${count}`;
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }
    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      const body = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) body.push(lines[i++]);
      i += 1;
      html.push(`<pre><code${language ? ` data-language="${escapeHtml(language)}"` : ""}>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const label = inlineMarkdown(heading[2].replace(/\s+#+$/, ""), baseHref);
      const id = slug(label);
      if (level <= 3) toc.push({ level, label, id });
      html.push(`<h${level} id="${id}">${label}</h${level}>`);
      i += 1;
      continue;
    }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) { html.push("<hr>"); i += 1; continue; }
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const cells = value => value.trim().replace(/^\||\|$/g, "").split("|").map(cell => inlineMarkdown(cell.trim(), baseHref));
      const headers = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(cells(lines[i++]));
      html.push(`<div class="table-wrap"><table><thead><tr>${headers.map(cell => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^\s*[-+*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const orderedMatch = line.match(/^\s*(\d+)[.)]\s+/);
      const ordered = Boolean(orderedMatch);
      const items = [];
      const pattern = ordered ? /^\s*\d+[.)]\s+(.+)$/ : /^\s*[-+*]\s+(.+)$/;
      while (i < lines.length) {
        const match = lines[i].match(pattern);
        if (!match) break;
        const itemLines = [match[1].trim()];
        i += 1;
        while (i < lines.length && lines[i].trim()) {
          if (pattern.test(lines[i])) break;
          if (/^\s*[-+*]\s+/.test(lines[i]) || /^\s*\d+[.)]\s+/.test(lines[i])) break;
          if (/^(#{1,6})\s|^```|^>\s?/.test(lines[i])) break;
          if (!/^\s{2,}\S/.test(lines[i])) break;
          itemLines.push(lines[i].trim());
          i += 1;
        }
        items.push(`<li>${inlineMarkdown(itemLines.join(" "), baseHref)}</li>`);
      }
      if (ordered) {
        const start = Number(orderedMatch[1]);
        const startAttribute = start === 1 ? "" : ` start="${start}"`;
        html.push(`<ol${startAttribute}>${items.join("")}</ol>`);
      } else {
        html.push(`<ul>${items.join("")}</ul>`);
      }
      continue;
    }
    if (/^>\s?/.test(line)) {
      const body = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ""));
      html.push(`<blockquote>${inlineMarkdown(body.join(" "), baseHref)}</blockquote>`);
      continue;
    }
    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s|^```|^\s*[-+*]\s+|^\s*\d+[.)]\s+|^>\s?/.test(lines[i])) paragraph.push(lines[i++].trim());
    html.push(`<p>${inlineMarkdown(paragraph.join(" "), baseHref)}</p>`);
  }
  return { html: html.join("\n"), toc };
}

async function loadItemText(item) {
  const embedded = globalThis.NEXAH_MISSION_CONTROL_READER?.[item.path];
  if (window.location.protocol === "file:" && embedded?.content !== undefined) {
    return {text: embedded.content, source: "direct-file reader"};
  }
  try {
    const response = await fetch(item.href, {cache: "no-store"});
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return {text: await response.text(), source: "live source"};
  } catch (error) {
    if (embedded?.content !== undefined) {
      return {text: embedded.content, source: "reader fallback"};
    }
    throw error;
  }
}

async function openReader(item) {
  nodes.previewTitle.textContent = item.title;
  nodes.previewBody.innerHTML = `<p class="notice">Dokument wird geladen …</p>`;
  if (!nodes.dialog.open) nodes.dialog.showModal();
  try {
    const loaded = await loadItemText(item);
    const rendered = markdownToHtml(loaded.text, item.href);
    const index = state.pathItems.findIndex(entry => entry.path === item.path);
    const previous = index > 0 ? state.pathItems[index - 1] : null;
    const next = index >= 0 && index < state.pathItems.length - 1 ? state.pathItems[index + 1] : null;
    const navigation = index < 0 ? "" : `<div class="reader-sequence"><span>${String(index + 1).padStart(2, "0")} / ${String(state.pathItems.length).padStart(2, "0")}</span><div>${previous ? `<button data-reader-path="${escapeHtml(previous.path)}">← ${escapeHtml(previous.title)}</button>` : ""}${next ? `<button data-reader-path="${escapeHtml(next.path)}">${escapeHtml(next.title)} →</button>` : ""}</div></div>`;
    const toc = rendered.toc.length > 1 ? `<aside class="reader-toc"><p class="eyebrow">INHALT</p>${rendered.toc.map(entry => `<a class="level-${entry.level}" href="#${entry.id}">${entry.label}</a>`).join("")}</aside>` : "";
    nodes.previewBody.innerHTML = `<p class="reader-source">${escapeHtml(loaded.source)}</p>${navigation}<div class="reader-layout">${toc}<article class="reader-document">${rendered.html}</article></div>${navigation}`;
    nodes.previewBody.querySelectorAll("[data-reader-path]").forEach(button => button.addEventListener("click", () => {
      const target = state.pathItems.find(entry => entry.path === button.dataset.readerPath);
      if (target) { nodes.previewBody.scrollTop = 0; openReader(target); }
    }));
  } catch (error) {
    nodes.previewBody.innerHTML = `<p class="notice">Reader nicht verfügbar: ${escapeHtml(error.message)}</p>`;
  }
}

function searchable(item) {
  const binding = item.binding || {};
  const eligibility = item.eligibility || {};
  return [item.title, item.id, item.category, item.kind, item.state, item.authority, item.description, item.path, item.repo, binding.status, binding.basis, eligibility.queue, eligibility.source_class, eligibility.priority, eligibility.theme, eligibility.family_key, eligibility.variant_role, ...(binding.roles || []), ...(binding.entity_ids || []), ...(binding.module_ids || []), ...(binding.family_ids || []), ...(item.tags || [])].join(" ").toLowerCase();
}

function visibleItems() {
  const query = state.search.trim().toLowerCase();
  return state.catalog.items.filter(item =>
    (!state.category || item.category === state.category || (state.category === "Book" && item.tags.includes("book-shelf")) || (state.category === "A1" && item.tags.includes("A1")) || (state.category === "Reading Path" && item.tags.includes("master-path")) || (state.category === "Deep Dive" && item.tags.includes("deep-dive"))) &&
    (!state.kind || item.kind === state.kind) &&
    (!state.repo || item.repo === state.repo) &&
    (!state.binding || item.binding?.status === state.binding) &&
    (!state.eligibility || item.eligibility?.queue === state.eligibility) &&
    (!state.priority || item.eligibility?.priority === state.priority) &&
    (!state.theme || item.eligibility?.theme === state.theme) &&
    (!query || searchable(item).includes(query))
  );
}

function itemCard(item, a1 = false) {
  if (a1) return `<button class="a1-card" data-path="${escapeHtml(item.path)}"><span class="badge a1">${escapeHtml(item.kind)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || item.state)}</p></button>`;
  return `<button class="card ${state.selected?.path === item.path ? "selected" : ""}" data-path="${escapeHtml(item.path)}">
    <div class="card-top"><span class="badge ${badgeClass(item)}">${escapeHtml(item.category)} · ${escapeHtml(item.kind)}</span><span class="badge ${bindingBadgeClass(item.binding?.status)}">${escapeHtml(bindingLabel(item.binding?.status))}</span></div>
    <h3>${escapeHtml(item.title)}</h3><p class="eligibility-line"><span class="badge ${eligibilityClass(item.eligibility?.queue)}">${escapeHtml(item.eligibility?.priority || "—")} · ${escapeHtml(eligibilityLabel(item.eligibility?.queue))}</span> ${escapeHtml(item.eligibility?.theme || "")}</p><p>${escapeHtml(item.description || item.authority || item.state)}</p><p class="card-path">${escapeHtml(item.repo)} · ${escapeHtml(item.path)}</p>
  </button>`;
}

function render() {
  const items = visibleItems();
  const shown = items.slice(0, state.limit);
  nodes.result.textContent = `${items.length} Treffer${items.length > shown.length ? ` · erste ${shown.length}` : ""}`;
  nodes.cards.innerHTML = shown.map(item => itemCard(item)).join("") || `<p class="notice">Keine Treffer für diese Auswahl.</p>`;
  nodes.cards.querySelectorAll("[data-path]").forEach(button => button.addEventListener("click", () => selectByPath(button.dataset.path)));
}

function selectByPath(path) {
  state.selected = state.catalog.items.find(item => item.path === path);
  if (!state.selected) return;
  const item = state.selected;
  const metadata = item.metadata && Object.keys(item.metadata).length ? `<h3>Asset-Metadaten</h3><pre class="metadata">${escapeHtml(JSON.stringify(item.metadata, null, 2))}</pre>` : "";
  const previewable = ["markdown","text","table","data","image","pdf","html","3d"].includes(item.kind);
  const binding = item.binding || {status: "unbound", entity_ids: [], module_ids: [], family_ids: [], roles: []};
  const eligibility = item.eligibility || {queue: "", source_class: "", priority: "", basis: "", theme: "", family_key: "", variant_role: ""};
  const navigatorHref = scienceEntityHref(item);
  const bindingTargets = binding.targets?.length ? `<div class="binding-targets"><h3>Navigator-Ziele</h3>${binding.targets.map(target => `<article><strong>${escapeHtml(target.title || target.entity_id)}</strong><span>${escapeHtml(target.entity_id)}${target.module_id ? ` · ${escapeHtml(target.module_id)}` : ""}</span>${target.claim_ceiling ? `<p>${escapeHtml(target.claim_ceiling)}</p>` : ""}</article>`).join("")}</div>` : "";
  nodes.detail.innerHTML = `<p class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(item.id)}</p><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description || "Keine Kurzbeschreibung registriert.")}</p>
    <div class="actions">${item.href ? `<a class="button" href="${item.href}" target="_blank" rel="noopener">Original öffnen</a>` : ""}${previewable && item.href ? `<button class="button secondary" id="previewButton">Vorschau</button>` : ""}${navigatorHref ? `<a class="button science-button" href="${navigatorHref}">${binding.entity_ids?.length ? "Im Science Navigator" : "Science Navigator"}</a>` : ""}</div>
    <section class="binding-detail ${bindingBadgeClass(binding.status)}"><p class="eyebrow">BINDING STATUS</p><h3>${escapeHtml(bindingLabel(binding.status))}</h3><p>${escapeHtml(binding.basis || "Keine Binding-Angabe.")} · Konfidenz: ${escapeHtml(binding.confidence || "keine")}</p></section>
    <section class="eligibility-detail ${eligibilityClass(eligibility.queue)}"><p class="eyebrow">ELIGIBILITY PASS</p><h3>${escapeHtml(eligibility.priority || "—")} · ${escapeHtml(eligibilityLabel(eligibility.queue))}</h3><p>${escapeHtml(eligibility.basis || "Keine Review-Klassifikation.")}</p></section>
    <dl><dt>Quellstatus</dt><dd>${escapeHtml(item.state)}</dd><dt>Bindung</dt><dd>${escapeHtml(bindingLabel(binding.status))}</dd><dt>Review-Klasse</dt><dd>${escapeHtml(eligibilityLabel(eligibility.queue))}</dd><dt>Quellklasse</dt><dd>${escapeHtml(eligibility.source_class || "—")}</dd><dt>Themenbahn</dt><dd>${escapeHtml(eligibility.theme || "—")}</dd><dt>Familie</dt><dd>${escapeHtml(eligibility.family_key || "—")}</dd><dt>Variante</dt><dd>${escapeHtml(eligibility.variant_role || "—")}</dd><dt>Rolle</dt><dd>${escapeHtml((binding.roles || []).join(" · ") || "—")}</dd><dt>Entität</dt><dd>${escapeHtml((binding.entity_ids || []).join(" · ") || "—")}</dd><dt>Modul</dt><dd>${escapeHtml((binding.module_ids || []).join(" · ") || "—")}</dd><dt>Familien</dt><dd>${escapeHtml((binding.family_ids || []).join(" · ") || "—")}</dd><dt>Typ</dt><dd>${escapeHtml(item.kind)}</dd><dt>Repository</dt><dd>${escapeHtml(item.repo)}</dd><dt>Autorität</dt><dd>${escapeHtml(item.authority || "nicht angegeben")}</dd><dt>Größe</dt><dd>${bytes(item.bytes)}</dd><dt>Pfad</dt><dd>${escapeHtml(item.path)}</dd>${item.sha256 ? `<dt>SHA-256</dt><dd>${escapeHtml(item.sha256)}</dd>` : ""}</dl>${bindingTargets}${metadata}`;
  $("previewButton")?.addEventListener("click", () => item.kind === "markdown" ? openReader(item) : preview(item));
  render();
}

async function preview(item) {
  nodes.previewTitle.textContent = item.title;
  nodes.previewBody.innerHTML = `<p class="notice">Vorschau wird geladen …</p>`;
  nodes.dialog.showModal();
  if (item.kind === "image") {
    nodes.previewBody.innerHTML = `<img src="${item.href}" alt="${escapeHtml(item.title)}">`;
  } else if (item.kind === "pdf") {
    nodes.previewBody.innerHTML = `<iframe src="${item.href}" title="${escapeHtml(item.title)}"></iframe>`;
  } else if (item.kind === "html") {
    nodes.previewBody.innerHTML = `<iframe src="${item.href}" sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups" title="${escapeHtml(item.title)}"></iframe>`;
  } else if (item.kind === "3d") {
    const meta = escapeHtml(JSON.stringify(item.metadata || {}, null, 2));
    nodes.previewBody.innerHTML = `<h3>3D Asset Inspector</h3><p class="notice">Die lokale V1 zeigt Struktur und Abhängigkeiten des GLB/glTF. „Original öffnen“ übergibt die Datei an Browser oder Betriebssystem; ein vollständiger Orbit-Viewer ist die nächste optionale Ausbaustufe.</p><pre>${meta}</pre><p><a class="button" href="${item.href}" target="_blank" rel="noopener">3D-Datei öffnen</a></p>`;
  } else {
    try {
      const loaded = await loadItemText(item);
      nodes.previewBody.innerHTML = `<p class="reader-source">${escapeHtml(loaded.source)}</p><pre>${escapeHtml(loaded.text)}</pre>`;
    } catch (error) {
      nodes.previewBody.innerHTML = `<p class="notice">Vorschau nicht verfügbar: ${escapeHtml(error.message)}</p>`;
    }
  }
}

function setupFilters() {
  const categories = ["", "Book", "Reading Path", "Deep Dive", "Source Field", "Controlled Source", "Work", "HTML", "3D"];
  nodes.categories.innerHTML = categories.map(value => `<button class="chip ${value === state.category ? "active" : ""}" data-category="${escapeHtml(value)}">${value || "Alle"}${value ? ` · ${state.catalog.stats[value] || 0}` : ""}</button>`).join("");
  nodes.categories.querySelectorAll("button").forEach(button => button.addEventListener("click", () => { state.category = button.dataset.category; setupFilters(); render(); }));
  const kinds = [...new Set(state.catalog.items.map(item => item.kind))].sort();
  nodes.kind.innerHTML = `<option value="">Alle Typen</option>` + kinds.map(value => `<option>${escapeHtml(value)}</option>`).join("");
  nodes.repo.innerHTML = `<option value="">Alle Repositories</option>` + state.catalog.repositories.map(value => `<option>${escapeHtml(value)}</option>`).join("");
  const bindingOrder = ["admitted", "supporting", "candidate", "unbound", "excluded-historical"];
  nodes.binding.innerHTML = `<option value="">Alle Bindungen</option>` + bindingOrder.filter(value => state.catalog.binding_stats[value]).map(value => `<option value="${value}">${escapeHtml(bindingLabel(value))} · ${state.catalog.binding_stats[value]}</option>`).join("");
  const eligibilityOrder = ["review-now", "family-review", "support-review", "collection-bind", "not-individual", "defer", "closed"];
  nodes.eligibility.innerHTML = `<option value="">Alle Review-Klassen</option>` + eligibilityOrder.filter(value => state.catalog.eligibility_stats[value]).map(value => `<option value="${value}">${escapeHtml(eligibilityLabel(value))} · ${state.catalog.eligibility_stats[value]}</option>`).join("");
  const priorities = ["P1", "P2", "P3", "P4", "CLOSED"].filter(value => state.catalog.priority_stats[value]);
  nodes.priority.innerHTML = `<option value="">Alle Prioritäten</option>` + priorities.map(value => `<option value="${value}">${escapeHtml(value)} · ${state.catalog.priority_stats[value]}</option>`).join("");
  const themes = [...new Set(state.catalog.items.map(item => item.eligibility?.theme).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  nodes.theme.innerHTML = `<option value="">Alle Themen</option>` + themes.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
}

function renderBindingBridge() {
  const order = ["admitted", "supporting", "candidate", "unbound", "excluded-historical"];
  nodes.bindingSummary.innerHTML = order.map(status => `<button class="binding-metric ${bindingBadgeClass(status)}" data-binding-status="${status}"><strong>${state.catalog.binding_stats[status] || 0}</strong><span>${escapeHtml(bindingLabel(status))}</span></button>`).join("");
  nodes.bindingSummary.querySelectorAll("[data-binding-status]").forEach(button => button.addEventListener("click", () => {
    state.binding = button.dataset.bindingStatus;
    nodes.binding.value = state.binding;
    render();
    state.openSurface?.("source-field");
  }));
  const eligibilityOrder = ["review-now", "family-review", "support-review", "collection-bind", "not-individual", "defer", "closed"];
  nodes.eligibilitySummary.innerHTML = eligibilityOrder.map(queue => `<button class="eligibility-metric ${eligibilityClass(queue)}" data-eligibility-queue="${queue}"><strong>${state.catalog.eligibility_stats[queue] || 0}</strong><span>${escapeHtml(eligibilityLabel(queue))}</span></button>`).join("");
  nodes.eligibilitySummary.querySelectorAll("[data-eligibility-queue]").forEach(button => button.addEventListener("click", () => {
    state.eligibility = button.dataset.eligibilityQueue;
    nodes.eligibility.value = state.eligibility;
    render();
    state.openSurface?.("source-field");
  }));
  const science = state.catalog.science_navigator;
  nodes.bridgeNote.textContent = `${science.entity_count} kuratierte Entitäten · ${science.relation_count} typisierte Relationen · ${science.profile} ${science.version} · Frozen v1 bleibt unverändert.`;
  nodes.scienceLink.href = `${scienceNavigatorBase()}#home`;
}

function renderDeepDives() {
  const groups = state.catalog.deep_dive_groups || [];
  const items = state.catalog.items.filter(item => item.tags.includes("deep-dive"));
  nodes.deepDiveGroups.innerHTML = groups.map(group => {
    const desiredOrder = DEEP_DIVE_ORDER[group.id] || [];
    const groupItems = items
      .filter(item => item.tags.includes(`deep-group-${group.id}`))
      .sort((a, b) => {
        const aIndex = desiredOrder.indexOf(a.id);
        const bIndex = desiredOrder.indexOf(b.id);
        if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        return a.title.localeCompare(b.title, "de");
      });
    return `<section class="deep-dive-group deep-group-${escapeHtml(group.id)}">
      <div class="deep-dive-group-head"><div><p class="eyebrow">${escapeHtml(group.id)}</p><h3>${escapeHtml(group.title)}</h3></div><span>${groupItems.length}</span></div>
      <p>${escapeHtml(group.description)}</p>
      <div class="deep-dive-list">${groupItems.map(item => `<button class="deep-dive-card" data-deep-path="${escapeHtml(item.path)}"><span class="badge">${escapeHtml(item.state)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description)}</small><em>Lesen →</em></button>`).join("")}</div>
    </section>`;
  }).join("");
  nodes.deepDiveGroups.querySelectorAll("[data-deep-path]").forEach(button => button.addEventListener("click", () => {
    const item = items.find(entry => entry.path === button.dataset.deepPath);
    if (item) openReader(item);
  }));
}

function setupOwnerPostits() {
  document.querySelectorAll(".owner-postit[data-source-id]").forEach(link => link.addEventListener("click", event => {
    const item = state.catalog.items.find(entry => entry.id === link.dataset.sourceId);
    if (!item) return;
    event.preventDefault();
    openReader(item);
  }));
}

async function init() {
  try {
    const loaded = await loadCatalog();
    state.catalog = loaded.catalog;
    const truth = state.catalog.truth;
    nodes.truth.innerHTML = `<strong>${escapeHtml(truth.status)}</strong><span>${escapeHtml(truth.phase)}<br>ACTIVE PRIORITY: ${escapeHtml(truth.active_priority)}<br>AS OF: ${escapeHtml(state.catalog.as_of)}<br>SOURCE: ${escapeHtml(loaded.source)}</span>`;
    nodes.counts.textContent = `${state.catalog.items.length} LOCATORS · ${state.catalog.stats.HTML || 0} HTML · ${state.catalog.stats["3D"] || 0} 3D`;
    renderBindingBridge();
    renderDeepDives();
    setupOwnerPostits();
    state.pathItems = state.catalog.items.filter(item => item.tags.includes("master-path")).sort((a,b) => (a.tags.find(tag => tag.startsWith("step-")) || "").localeCompare(b.tags.find(tag => tag.startsWith("step-")) || ""));
    nodes.masterPath.innerHTML = state.pathItems.map(item => `<button data-reader-path="${escapeHtml(item.path)}"><small>0${escapeHtml(item.id.replace("PATH-", ""))}</small>${escapeHtml(PATH_LABELS[item.id] || item.title)}<span>Lesen →</span></button>`).join("");
    nodes.masterPath.querySelectorAll("[data-reader-path]").forEach(button => button.addEventListener("click", () => {
      const item = state.pathItems.find(entry => entry.path === button.dataset.readerPath);
      if (item) openReader(item);
    }));
    nodes.startMasterPath?.addEventListener("click", () => {
      if (state.pathItems[0]) openReader(state.pathItems[0]);
    });
    $("openAchievementsReader")?.addEventListener("click", () => {
      const achievements = state.pathItems.find(item => item.id === "PATH-2");
      if (achievements) openReader(achievements);
    });
    const bookItems = state.catalog.items.filter(item => item.tags.includes("book-shelf"));
    nodes.a1Grid.innerHTML = BOOK_CLUSTERS.map(cluster => {
      const items = bookItems.filter(item => item.tags.includes(`book-role-${cluster.role}`));
      return `<article class="book-cluster"><p class="eyebrow">${escapeHtml(cluster.label)}</p><h3>${escapeHtml(cluster.title)}</h3><p>${escapeHtml(cluster.description)}</p><div class="book-links">${items.map(item => `<button type="button" data-path="${escapeHtml(item.path)}">${escapeHtml(item.title)} <span>→</span></button>`).join("")}</div></article>`;
    }).join("");
    nodes.a1Grid.querySelectorAll("[data-path]").forEach(button => button.addEventListener("click", () => {
      const item = bookItems.find(entry => entry.path === button.dataset.path);
      if (!item) return;
      if (item.kind === "html" && item.href) {
        window.open(item.href, "_blank", "noopener");
      } else if (["markdown", "text", "table", "data"].includes(item.kind)) {
        openReader(item);
      } else {
        selectByPath(item.path);
        nodes.detail.scrollIntoView({behavior:"smooth", block:"start"});
      }
    }));
    setupFilters(); render();
  } catch (error) {
    nodes.truth.innerHTML = `<strong>KATALOGFEHLER</strong>${escapeHtml(error.message)}`;
  }
}

setupSurfaceCabinet();
nodes.search.addEventListener("input", event => { state.search = event.target.value; render(); });
nodes.kind.addEventListener("change", event => { state.kind = event.target.value; render(); });
nodes.repo.addEventListener("change", event => { state.repo = event.target.value; render(); });
nodes.binding.addEventListener("change", event => { state.binding = event.target.value; render(); });
nodes.eligibility.addEventListener("change", event => { state.eligibility = event.target.value; render(); });
nodes.priority.addEventListener("change", event => { state.priority = event.target.value; render(); });
nodes.theme.addEventListener("change", event => { state.theme = event.target.value; render(); });
nodes.closePreview.addEventListener("click", () => nodes.dialog.close());
nodes.dialog.addEventListener("click", event => { if (event.target === nodes.dialog) nodes.dialog.close(); });
init();
