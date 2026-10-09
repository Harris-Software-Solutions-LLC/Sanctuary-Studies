const TABLES = ['studies', 'sources', 'notes', 'entities', 'relationships', 'tags', 'study_tags', 'content_items', 'content_relationships', 'content_provenance', 'study_content_links'];
const STUDY_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'scripture', label: 'Scripture' },
  { id: 'sources', label: 'Sources' },
  { id: 'notes', label: 'Notes' },
  { id: 'people', label: 'People' },
  { id: 'places', label: 'Places' },
  { id: 'events', label: 'Events' },
  { id: 'tags', label: 'Tags' }
];
const WORKSPACE_MODES = [
  { id: 'desk', label: 'Scholar’s Desk', eyebrow: 'Study overview' },
  { id: 'codex', label: 'Codex Cabinet', eyebrow: 'Sources and archive' },
  { id: 'atlas', label: 'Sanctuary Atlas', eyebrow: 'Timeline and connections' },
  { id: 'folio', label: 'Research Folio', eyebrow: 'Focused reading and writing' },
  { id: 'evidence', label: 'Evidence Wall', eyebrow: 'Relationships and comparisons' }
];
const desktopData = window.sanctuaryDesktop?.data || null;
const state = { database: Object.fromEntries([['schema_version', 2], ...TABLES.map((table) => [table, []])]), selectedId: null, query: '', statusFilter: 'all', sort: 'updated', view: 'library', section: 'overview', workspaceMode: 'desk', timelineContent: null, timelineStep: 1, folioRecordId: null, scriptureContent: null, scriptureQuery: '', scriptureReference: null };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const active = (record) => !record.deleted_at;
const selectedStudy = () => state.database.studies.find((study) => study.id === state.selectedId && active(study));

function storedWorkspaceMode(studyId) {
  try {
    const saved = JSON.parse(window.localStorage.getItem('sanctuary-study-workspace-views') || '{}');
    return WORKSPACE_MODES.some((mode) => mode.id === saved[studyId]) ? saved[studyId] : 'desk';
  } catch { return 'desk'; }
}

function rememberWorkspaceMode(studyId, mode) {
  try {
    const saved = JSON.parse(window.localStorage.getItem('sanctuary-study-workspace-views') || '{}');
    saved[studyId] = mode;
    window.localStorage.setItem('sanctuary-study-workspace-views', JSON.stringify(saved));
  } catch { /* Local preference storage is optional and must not affect study data. */ }
}

function showMessage(message, isError = false) {
  const element = $('#app-message');
  element.textContent = message;
  element.classList.toggle('is-error', isError);
  element.hidden = false;
  window.clearTimeout(showMessage.timeout);
  showMessage.timeout = window.setTimeout(() => { element.hidden = true; }, 4200);
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? String(value) : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function recordsForStudy(studyId, section) {
  const table = { sources: 'sources', notes: 'notes', people: 'entities', places: 'entities', events: 'entities', tags: 'tags' }[section];
  if (!table) return [];
  const entityType = { people: 'person', places: 'place', events: 'event' }[section];
  return state.database[table].filter((record) => active(record) && record.study_id === studyId && (!entityType || record.entity_type === entityType));
}

function studyCounts(studyId) {
  return { sources: recordsForStudy(studyId, 'sources').length, notes: recordsForStudy(studyId, 'notes').length, people: recordsForStudy(studyId, 'people').length, places: recordsForStudy(studyId, 'places').length, events: recordsForStudy(studyId, 'events').length, tags: recordsForStudy(studyId, 'tags').length };
}

function contentForStudy(studyId, predicate = () => true) {
  const contentById = new Map(state.database.content_items.filter((item) => active(item)).map((item) => [item.id, item]));
  return state.database.study_content_links.filter((link) => link.study_id === studyId && active(link)).map((link) => contentById.get(link.content_id)).filter((item) => item && predicate(item));
}

function scriptureContentForStudy(studyId) {
  return contentForStudy(studyId, (item) => item.content_type.startsWith('scripture_'));
}

function parseContentPayload(item) {
  try { return JSON.parse(item.payload_json || '{}'); } catch { return {}; }
}

function scriptureReferencesForText(text) {
  if (!state.scriptureContent || !text) return [];
  const haystack = String(text).toLowerCase();
  return state.scriptureContent.reference_index.filter((reference) => haystack.includes(String(reference).toLowerCase()));
}

function studyScriptureReferences(studyId) {
  const attached = scriptureContentForStudy(studyId).filter((item) => ['scripture_passage', 'scripture_reference', 'scripture_note'].includes(item.content_type)).flatMap((item) => {
    const payload = parseContentPayload(item);
    return [payload.reference || payload.ref || (item.content_type === 'scripture_reference' ? item.title : '')].filter(Boolean);
  });
  const records = [...recordsForStudy(studyId, 'sources'), ...recordsForStudy(studyId, 'notes')];
  const detected = records.flatMap((record) => scriptureReferencesForText([record.title, record.body, record.notes, record.citation].filter(Boolean).join(' ')));
  return [...new Set([...attached, ...detected])].sort((left, right) => left.localeCompare(right));
}

function scriptureSearchRecords(query = '') {
  if (!state.scriptureContent) return [];
  const packageData = state.scriptureContent;
  const records = [
    ...packageData.books.map((book) => ({ key: book.id, kind: 'Book', title: book.name, meta: `${book.chapter_count} chapters`, body: book.name })),
    ...packageData.chapters.map((chapter) => ({ key: chapter.id, kind: 'Chapter', title: chapter.reference, meta: `${chapter.book} · ${chapter.verse_count} preserved verses`, body: chapter.reference })),
    ...packageData.verses.map((verse) => ({ key: verse.id, kind: 'Verse', title: verse.reference, meta: 'KJV', body: verse.text })),
    ...packageData.passages.map((passage) => ({ key: passage.content_id, kind: 'Passage', title: passage.title || passage.element, meta: `${passage.ref} · ${passage.zone}`, body: [passage.title, passage.ref, passage.element, passage.zone, passage.text, passage.symbolism, passage.type, ...(passage.crossRefs || [])].join(' ') })),
    ...packageData.reference_index.map((reference) => ({ key: `reference:${reference}`, kind: 'Reference', title: reference, meta: 'Cross-reference index', body: reference })),
    ...packageData.study_notes.map((note) => ({ key: note.content_id, kind: 'Study note', title: `Study note: ${note.reference}`, meta: note.reference, body: `${note.reference} ${note.body}` }))
  ];
  const normalized = String(query).trim().toLowerCase();
  return (normalized ? records.filter((record) => `${record.kind} ${record.title} ${record.meta} ${record.body}`.toLowerCase().includes(normalized)) : records.filter((record) => record.kind === 'Passage')).slice(0, 80);
}

function visibleStudies() {
  const query = state.query.trim().toLowerCase();
  return state.database.studies.filter(active).filter((study) => state.statusFilter === 'all' || String(study.status).toLowerCase() === state.statusFilter).filter((study) => `${study.title} ${study.description} ${study.status}`.toLowerCase().includes(query)).sort((left, right) => state.sort === 'title' ? left.title.localeCompare(right.title) : String(right.updated_at || '').localeCompare(String(left.updated_at || '')));
}

function render() {
  const visible = visibleStudies();
  const study = selectedStudy();
  const modeSelect = $('#workspace-mode');
  const context = $('#current-study-context');
  if (modeSelect) { modeSelect.value = state.workspaceMode; modeSelect.disabled = !study || state.view !== 'study'; }
  if (context) { context.hidden = !study || state.view !== 'study'; context.textContent = study ? study.title : ''; }
  $('#study-count').textContent = `${visible.length} ${visible.length === 1 ? 'study' : 'studies'}`;
  $('#filter-studies').textContent = `Filter: ${state.statusFilter === 'all' ? 'All' : state.statusFilter[0].toUpperCase() + state.statusFilter.slice(1)}`;
  $('#sort-studies').textContent = `Sort: ${state.sort === 'title' ? 'Title' : 'Updated'}`;
  $('#study-table').innerHTML = visible.length ? visible.map((study) => { const counts = studyCounts(study.id); return `<tr tabindex="0" class="${study.id === state.selectedId ? 'is-selected' : ''}" data-study-id="${escapeHtml(study.id)}"><td><span class="study-title">${escapeHtml(study.title)}</span><span class="study-description">${escapeHtml(study.description)}</span></td><td><span class="status-pill">${escapeHtml(study.status)}</span></td><td>${counts.sources}</td><td>${counts.notes}</td><td class="records">${counts.people + counts.places + counts.events}</td><td>${escapeHtml(formatDate(study.updated_at))}</td></tr>`; }).join('') : '<tr><td colspan="6"><div class="inspector-empty">No studies match this search. Create a study or change the filter.</div></td></tr>';
  document.querySelectorAll('[data-study-id]').forEach((row) => {
    row.addEventListener('click', () => selectStudy(row.dataset.studyId));
    row.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStudy(row.dataset.studyId); } });
  });
  renderInspector(selectedStudy());
  renderDetail();
  renderInformation();
  $('#library-view').hidden = state.view !== 'library';
  document.querySelectorAll('[data-section]').forEach((item) => item.classList.toggle('is-active', item.dataset.section === state.view));
}

function renderInspector(study) {
  if (!study) { $('#inspector-content').innerHTML = '<div class="inspector-empty">Create or select a study to inspect its local research records.</div>'; return; }
  const counts = studyCounts(study.id);
  const tags = recordsForStudy(study.id, 'tags');
  $('#inspector-content').innerHTML = `<div class="inspector-block"><div class="inspector-title">${escapeHtml(study.title)}</div><div class="inspector-description">${escapeHtml(study.description || 'No description yet.')}</div></div><div class="inspector-block"><div class="inspector-label">Status</div><span class="status-pill">${escapeHtml(study.status)}</span></div><div class="inspector-block"><div class="inspector-label">Research records</div><div class="metrics"><div class="metric"><strong>${counts.sources}</strong><span>Sources</span></div><div class="metric"><strong>${counts.notes}</strong><span>Notes</span></div><div class="metric"><strong>${counts.people + counts.places + counts.events}</strong><span>People / places / events</span></div><div class="metric"><strong>${counts.tags}</strong><span>Tags</span></div></div></div><div class="inspector-block"><div class="inspector-label">Tags</div><div class="tag-list">${tags.length ? tags.map((tag) => `<span class="tag">${escapeHtml(tag.name)}</span>`).join('') : '<span class="inspector-description">No tags yet.</span>'}</div></div><div class="inspector-block"><div class="inspector-label">Last updated</div><div class="inspector-description">${escapeHtml(formatDate(study.updated_at))} · Stored locally</div></div>`;
}

function openStudyDialog() { $('#study-form').reset(); $('#study-dialog').showModal(); }

function selectStudy(studyId) { state.selectedId = studyId; state.view = 'study'; state.section = 'overview'; state.workspaceMode = storedWorkspaceMode(studyId); state.timelineStep = 1; state.folioRecordId = null; state.scriptureQuery = ''; state.scriptureReference = null; render(); }

function studyActivity(studyId) {
  const recordLabels = { sources: 'source', notes: 'note', people: 'person', places: 'place', events: 'event', tags: 'tag' };
  const records = ['sources', 'notes', 'people', 'places', 'events', 'tags'].flatMap((section) => recordsForStudy(studyId, section).map((record) => ({ ...record, recordType: recordLabels[section] || section, recordTitle: record.title || record.name })));
  return records.sort((left, right) => String(right.updated_at || right.created_at || '').localeCompare(String(left.updated_at || left.created_at || '')));
}

function scriptureRecordByKey(key) {
  if (!state.scriptureContent || !key) return null;
  const packageData = state.scriptureContent;
  return packageData.passages.find((record) => record.content_id === key)
    || packageData.verses.find((record) => record.id === key)
    || packageData.chapters.find((record) => record.id === key)
    || packageData.books.find((record) => record.id === key)
    || packageData.study_notes.find((record) => record.content_id === key)
    || (key.startsWith('reference:') ? { reference: key.slice('reference:'.length), content_id: key } : null);
}

function scriptureDetailMarkup(record) {
  if (!record) return '<div class="record-empty">Select a Scripture result to inspect it locally.</div>';
  if (record.content_id?.startsWith('scripture.passage.')) {
    return `<div class="scripture-reading"><span class="eyebrow">${escapeHtml(record.zone || 'Sanctuary passage')}</span><h3>${escapeHtml(record.title || record.element)}</h3><p class="scripture-reference-label">${escapeHtml(record.ref)}</p><blockquote>${escapeHtml(record.text || '')}</blockquote>${record.symbolism ? `<section><span class="eyebrow">Symbolism</span><p>${escapeHtml(record.symbolism)}</p></section>` : ''}${record.type ? `<section><span class="eyebrow">Type and antitype</span><p>${escapeHtml(record.type)}</p></section>` : ''}${(record.crossRefs || []).length ? `<section><span class="eyebrow">Cross-references</span><div class="scripture-reference-list">${record.crossRefs.map((reference) => `<button class="reference-link" data-scripture-reference="${escapeHtml(reference)}" type="button">${escapeHtml(reference)}</button>`).join('')}</div></section>` : ''}</div>`;
  }
  if (record.text && record.reference) return `<div class="scripture-reading"><span class="eyebrow">KJV verse</span><h3>${escapeHtml(record.reference)}</h3><blockquote>${escapeHtml(record.text)}</blockquote></div>`;
  if (record.body && record.reference) return `<div class="scripture-reading"><span class="eyebrow">Study note</span><h3>${escapeHtml(record.reference)}</h3><p>${escapeHtml(record.body)}</p></div>`;
  if (record.reference) {
    const groups = state.scriptureContent.cross_references.filter((group) => group.source_reference === record.reference || group.target_references.includes(record.reference));
    return `<div class="scripture-reading"><span class="eyebrow">Indexed reference</span><h3>${escapeHtml(record.reference)}</h3><p>This reference is available locally for study linking and search.</p>${groups.length ? `<section><span class="eyebrow">Related references</span><div class="scripture-reference-list">${groups.flatMap((group) => [group.source_reference, ...group.target_references]).filter((reference, index, all) => all.indexOf(reference) === index && reference !== record.reference).map((reference) => `<button class="reference-link" data-scripture-reference="${escapeHtml(reference)}" type="button">${escapeHtml(reference)}</button>`).join('')}</div></section>` : ''}</div>`;
  }
  return `<div class="scripture-reading"><span class="eyebrow">${escapeHtml(record.name ? 'Book' : 'Chapter')}</span><h3>${escapeHtml(record.name || record.reference)}</h3><p>${escapeHtml(record.chapter_count ? `${record.chapter_count} chapters` : `${record.verse_count} preserved verses`)}</p></div>`;
}

function scriptureReferenceSummary(studyId, limit = 8) {
  const references = studyScriptureReferences(studyId).slice(0, limit);
  return references.length ? references.map((reference) => `<button class="reference-link" data-scripture-reference="${escapeHtml(reference)}" type="button">${escapeHtml(reference)}</button>`).join('') : '<span class="muted">No Scripture references attached or detected yet.</span>';
}

function renderScriptureWorkspace(study) {
  if (!state.scriptureContent) {
    $('#record-table-wrap').innerHTML = '<div class="record-empty">Loading the local Scripture package…</div>';
    if (desktopData?.getScriptureContent) desktopData.getScriptureContent().then((content) => { state.scriptureContent = content; renderDetail(); }).catch((error) => { $('#record-table-wrap').innerHTML = `<div class="record-empty">Unable to load Scripture content: ${escapeHtml(error.message || error)}</div>`; });
    return;
  }
  const packageData = state.scriptureContent;
  const results = scriptureSearchRecords(state.scriptureQuery);
  const selected = scriptureRecordByKey(state.scriptureReference) || scriptureRecordByKey(results[0]?.key);
  state.scriptureReference = selected?.content_id || (selected?.reference ? `reference:${selected.reference}` : null);
  const attached = scriptureContentForStudy(study.id);
  const resultMarkup = results.length ? results.map((record) => `<button class="scripture-result ${record.key === state.scriptureReference ? 'is-selected' : ''}" data-scripture-record-key="${escapeHtml(record.key)}" type="button"><span>${escapeHtml(record.kind)}</span><strong>${escapeHtml(record.title)}</strong><small>${escapeHtml(record.meta)}</small></button>`).join('') : '<div class="record-empty">No Scripture records match this search.</div>';
  $('#record-table-wrap').innerHTML = `<div class="scripture-workspace"><div class="mode-introduction"><div><span class="eyebrow">Local Scripture package</span><h2>Scripture and cross-references</h2><p>${packageData.book_count} books · ${packageData.chapter_count} chapters · ${packageData.verse_count} preserved KJV verses · ${packageData.passage_count} sanctuary passages.</p></div><button class="button button-secondary" id="scripture-attach" type="button" ${attached.length ? 'disabled' : ''}>${attached.length ? 'Scripture attached locally' : 'Attach Scripture to study'}</button></div><div class="scripture-toolbar"><label class="table-search" aria-label="Search Scripture"><span aria-hidden="true">⌕</span><input id="scripture-search" type="search" value="${escapeHtml(state.scriptureQuery)}" placeholder="Search books, chapters, verses, references…"></label><span id="scripture-attachment-state" class="muted">${attached.length ? `${attached.length} local content records attached` : 'Package available offline; attach it to this study to include it in exports.'}</span></div><div class="scripture-layout"><nav class="scripture-results" aria-label="Scripture results">${resultMarkup}</nav><article class="scripture-detail-panel">${scriptureDetailMarkup(selected)}</article></div></div>`;
  $('#scripture-search').addEventListener('input', (event) => { state.scriptureQuery = event.target.value; state.scriptureReference = null; renderDetail(); });
  document.querySelectorAll('[data-scripture-record-key]').forEach((button) => button.addEventListener('click', () => { state.scriptureReference = button.dataset.scriptureRecordKey; renderDetail(); }));
  document.querySelectorAll('[data-scripture-reference]').forEach((button) => button.addEventListener('click', () => { state.scriptureQuery = button.dataset.scriptureReference; state.scriptureReference = `reference:${button.dataset.scriptureReference}`; renderDetail(); }));
  $('#scripture-attach')?.addEventListener('click', async () => {
    try {
      if (!desktopData?.attachScripture) throw new Error('Scripture attachment is available in the standalone Electron app.');
      await desktopData.attachScripture({ studyId: study.id });
      await refreshFromDesktop(); state.view = 'study'; state.section = 'scripture'; renderDetail(); showMessage('Scripture and cross-references were attached locally.');
    } catch (error) { showMessage(error.message || 'Unable to attach Scripture.', true); }
  });
}

function scriptureAtlasMarkup(step) {
  const references = scriptureReferencesForText(`${step.aaronRef} ${step.jesusRef}`);
  return `<section class="mode-panel scripture-connection-panel"><div class="mode-panel-heading"><div><span class="eyebrow">Scripture connections</span><h3>References in this step</h3></div><button class="text-button" data-open-section="scripture" type="button">Open Scripture →</button></div><div class="scripture-reference-list">${references.length ? references.map((reference) => `<button class="reference-link" data-scripture-reference="${escapeHtml(reference)}" type="button">${escapeHtml(reference)}</button>`).join('') : '<span class="muted">Load or attach the Scripture package to index these references.</span>'}</div></section>`;
}

function scriptureArchiveMarkup(studyId) {
  const references = studyScriptureReferences(studyId);
  return `<section class="mode-panel scripture-archive-panel"><div class="mode-panel-heading"><div><span class="eyebrow">Scripture index</span><h3>References in this study</h3></div><button class="text-button" data-open-section="scripture" type="button">Open Scripture →</button></div><div class="scripture-reference-list">${references.length ? references.map((reference) => `<button class="reference-link" data-scripture-reference="${escapeHtml(reference)}" type="button">${escapeHtml(reference)}</button>`).join('') : '<span class="muted">No Scripture references attached or detected yet.</span>'}</div></section>`;
}

function renderDesk(study) {
  const activity = studyActivity(study.id).slice(0, 6);
  const counts = studyCounts(study.id);
  const studyContentIds = new Set(contentForStudy(study.id).map((item) => item.id));
  const relationships = state.database.relationships.filter((relation) => relation.study_id === study.id && !relation.deleted_at).length + state.database.content_relationships.filter((relation) => studyContentIds.has(relation.source_content_id) && studyContentIds.has(relation.target_content_id) && !relation.deleted_at).length;
  const scriptureCount = studyScriptureReferences(study.id).length;
  const activityMarkup = activity.length ? activity.map((record) => `<article class="activity-entry"><span class="activity-rule"></span><div><strong>${escapeHtml(record.recordTitle)}</strong><span>${escapeHtml(record.recordType)} · ${escapeHtml(formatDate(record.updated_at || record.created_at))}</span></div></article>`).join('') : '<p class="muted">No research records yet. Add a source, note, or entity to begin.</p>';
  $('#record-table-wrap').innerHTML = `<div class="workspace-mode workspace-desk"><div class="mode-introduction"><div><span class="eyebrow">Scholar’s Desk</span><h2>Research overview</h2><p>One calm working surface for the study’s current evidence, notes, Scripture, and activity.</p></div><div class="desk-actions"><button class="text-button" data-open-section="sources" type="button">+ Source</button><button class="text-button" data-open-section="notes" type="button">+ Note</button><button class="text-button" data-open-section="scripture" type="button">Scripture →</button><div class="desk-stamp">LOCAL<br><span>PRIVATE STUDY</span></div></div></div><div class="desk-summary"><div><strong>${counts.sources}</strong><span>Sources</span></div><div><strong>${counts.notes}</strong><span>Notes</span></div><div><strong>${counts.people + counts.places + counts.events}</strong><span>People · places · events</span></div><div><strong>${scriptureCount}</strong><span>Scripture links</span></div><div><strong>${relationships}</strong><span>Relationships</span></div></div><div class="desk-columns"><section class="mode-panel"><div class="mode-panel-heading"><div><span class="eyebrow">Current activity</span><h3>Recent research</h3></div><button class="text-button" data-mode="codex" type="button">Open archive →</button></div><div class="activity-list">${activityMarkup}</div></section><section class="mode-panel desk-context-panel"><span class="eyebrow">Study context</span><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description || 'No description has been added to this study.')}</p><dl class="context-list"><div><dt>Status</dt><dd>${escapeHtml(study.status)}</dd></div><div><dt>Created</dt><dd>${escapeHtml(formatDate(study.created_at))}</dd></div><div><dt>Last updated</dt><dd>${escapeHtml(formatDate(study.updated_at))}</dd></div></dl></section></div>${scriptureArchiveMarkup(study.id)}</div>`;
  document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => setWorkspaceMode(button.dataset.mode)));
  document.querySelectorAll('[data-scripture-reference]').forEach((button) => button.addEventListener('click', () => { state.section = 'scripture'; state.scriptureQuery = button.dataset.scriptureReference; state.scriptureReference = `reference:${button.dataset.scriptureReference}`; renderDetail(); }));
}

function renderCodex(study) {
  const sources = recordsForStudy(study.id, 'sources');
  const notes = recordsForStudy(study.id, 'notes');
  const sourceCards = sources.length ? sources.map((source) => `<article class="archive-card"><div class="archive-card-rule"></div><div class="archive-card-body"><span class="eyebrow">${escapeHtml(source.source_type || 'Reference')}</span><h3>${escapeHtml(source.title)}</h3><p class="archive-author">${escapeHtml(source.author || 'Author not recorded')}</p><p>${escapeHtml(source.notes || source.citation || 'No excerpt or citation has been added yet.')}</p><div class="archive-meta"><span>${source.citation ? 'Citation recorded' : 'Citation pending'}</span><span>${notes.length} study notes</span></div></div></article>`).join('') : '<div class="record-empty">No sources are in this study yet. Use Add record to build the archive.</div>';
  $('#record-table-wrap').innerHTML = `<div class="workspace-mode workspace-codex"><div class="mode-introduction"><div><span class="eyebrow">Codex Cabinet</span><h2>Sources and archive</h2><p>Annotated records with citations, excerpts, provenance, attached study context, and Scripture references.</p></div><div class="mode-count">${sources.length}<span>sources</span></div></div><div class="archive-grid">${sourceCards}</div>${sources.length ? '' : '<button class="button button-secondary" data-open-section="sources" type="button">Add the first source</button>'}${scriptureArchiveMarkup(study.id)}</div>`;
  document.querySelectorAll('[data-scripture-reference]').forEach((button) => button.addEventListener('click', () => { state.section = 'scripture'; state.scriptureQuery = button.dataset.scriptureReference; state.scriptureReference = `reference:${button.dataset.scriptureReference}`; renderDetail(); }));
}

function renderFolio(study) {
  const notes = recordsForStudy(study.id, 'notes');
  if (!state.folioRecordId || !notes.some((note) => note.id === state.folioRecordId)) state.folioRecordId = notes[0]?.id || null;
  const selectedNote = notes.find((note) => note.id === state.folioRecordId);
  const noteList = notes.length ? notes.map((note) => `<button class="folio-note ${note.id === state.folioRecordId ? 'is-selected' : ''}" data-folio-note="${escapeHtml(note.id)}" type="button"><strong>${escapeHtml(note.title)}</strong><span>${escapeHtml(formatDate(note.updated_at || note.created_at))}</span></button>`).join('') : '<p class="muted">No notes yet.</p>';
  const sources = recordsForStudy(study.id, 'sources');
  $('#record-table-wrap').innerHTML = `<div class="workspace-mode workspace-folio"><div class="mode-introduction"><div><span class="eyebrow">Research Folio</span><h2>Focused reading and writing</h2><p>Read notes as working pages while keeping source references and related Scripture records alongside them.</p></div></div><div class="folio-layout"><aside class="folio-index"><span class="eyebrow">Notes index</span>${noteList}${notes.length ? '' : '<button class="text-button" data-open-section="notes" type="button">+ Add note</button>'}</aside><article class="folio-page">${selectedNote ? `<span class="eyebrow">Working note</span><h3>${escapeHtml(selectedNote.title)}</h3><div class="folio-rule"></div><p class="folio-body">${escapeHtml(selectedNote.body).replace(/\n/g, '<br>')}</p><p class="folio-date">Modified ${escapeHtml(formatDate(selectedNote.updated_at || selectedNote.created_at))}</p>` : '<div class="record-empty">Select a note to begin reading, or add a note to this study.</div>'}</article><aside class="folio-references"><span class="eyebrow">Sources</span>${sources.length ? sources.map((source) => `<div class="reference-entry"><strong>${escapeHtml(source.title)}</strong><span>${escapeHtml(source.author || source.source_type || 'Reference')}</span></div>`).join('') : '<p class="muted">No related sources yet.</p>'}<span class="eyebrow folio-scripture-label">Scripture</span><div class="scripture-reference-list">${scriptureReferenceSummary(study.id)}</div></aside></div></div>`;
  document.querySelectorAll('[data-folio-note]').forEach((button) => button.addEventListener('click', () => { state.folioRecordId = button.dataset.folioNote; renderDetail(); }));
  document.querySelectorAll('[data-scripture-reference]').forEach((button) => button.addEventListener('click', () => { state.section = 'scripture'; state.scriptureQuery = button.dataset.scriptureReference; state.scriptureReference = `reference:${button.dataset.scriptureReference}`; renderDetail(); }));
}

function renderEvidence(study) {
  const sources = recordsForStudy(study.id, 'sources');
  const notes = recordsForStudy(study.id, 'notes');
  const entities = ['people', 'places', 'events'].flatMap((section) => recordsForStudy(study.id, section));
  const tags = recordsForStudy(study.id, 'tags');
  const scriptureNodes = scriptureContentForStudy(study.id).filter((record) => ['scripture_passage', 'scripture_reference', 'scripture_note'].includes(record.content_type)).slice(0, 60).map((record) => ({ ...record, nodeType: record.content_type.replace('scripture_', 'scripture '), nodeClass: 'scripture' }));
  const nodes = [...sources.map((record) => ({ ...record, nodeType: 'source', nodeClass: 'source' })), ...notes.map((record) => ({ ...record, nodeType: 'note', nodeClass: 'note' })), ...entities.map((record) => ({ ...record, nodeType: record.entity_type, nodeClass: 'entity' })), ...tags.map((record) => ({ ...record, nodeType: 'tag', nodeClass: 'tag' })), ...scriptureNodes];
  const nodeMarkup = nodes.length ? nodes.map((node) => `<article class="evidence-node ${node.nodeClass}"><span>${escapeHtml(node.nodeType)}</span><strong>${escapeHtml(node.title || node.name)}</strong><small>${escapeHtml(node.description || node.body || node.author || 'Local study record')}</small></article>`).join('') : '<div class="record-empty">Add sources, notes, or entities to build the evidence wall.</div>';
  const entityIds = new Set(entities.map((entity) => entity.id));
  const relationships = state.database.relationships.filter((relation) => relation.study_id === study.id && entityIds.has(relation.source_entity_id) && entityIds.has(relation.target_entity_id) && !relation.deleted_at);
  const contentIds = new Set(scriptureNodes.map((item) => item.id));
  const contentById = new Map(scriptureNodes.map((item) => [item.id, item]));
  const contentRelationships = state.database.content_relationships.filter((relation) => contentIds.has(relation.source_content_id) && contentIds.has(relation.target_content_id) && !relation.deleted_at);
  const relationshipMarkup = [...relationships.map((relation) => { const source = entities.find((entity) => entity.id === relation.source_entity_id); const target = entities.find((entity) => entity.id === relation.target_entity_id); return `<div class="relationship-line"><strong>${escapeHtml(source?.name || 'Unknown')}</strong><span>${escapeHtml(relation.relationship_type)}</span><strong>${escapeHtml(target?.name || 'Unknown')}</strong></div>`; }), ...contentRelationships.map((relation) => `<div class="relationship-line"><strong>${escapeHtml(contentById.get(relation.source_content_id)?.title || 'Unknown')}</strong><span>${escapeHtml(relation.relationship_type)}</span><strong>${escapeHtml(contentById.get(relation.target_content_id)?.title || 'Unknown')}</strong></div>`)].join('') || '<p class="muted">No explicit entity or Scripture relationships have been recorded yet.</p>';
  $('#record-table-wrap').innerHTML = `<div class="workspace-mode workspace-evidence"><div class="mode-introduction"><div><span class="eyebrow">Evidence Wall</span><h2>Relationships and comparisons</h2><p>View research objects together before formal relationship editing is added.</p></div><div class="mode-count">${nodes.length}<span>objects</span></div></div><div class="evidence-wall">${nodeMarkup}</div><section class="mode-panel relationship-panel"><div class="mode-panel-heading"><div><span class="eyebrow">Connections</span><h3>Recorded relationships</h3></div></div>${relationshipMarkup}</section></div>`;
}

function renderWorkspaceMode(study) {
  if (state.workspaceMode === 'codex') return renderCodex(study);
  if (state.workspaceMode === 'atlas') return renderTimeline(study);
  if (state.workspaceMode === 'folio') return renderFolio(study);
  if (state.workspaceMode === 'evidence') return renderEvidence(study);
  return renderDesk(study);
}

function setWorkspaceMode(mode) {
  if (!WORKSPACE_MODES.some((item) => item.id === mode) || !selectedStudy()) return;
  state.workspaceMode = mode;
  state.section = 'overview';
  rememberWorkspaceMode(state.selectedId, mode);
  render();
}

function renderTimeline(study) {
  const target = $('#record-table-wrap');
  if (!state.timelineContent) {
    target.innerHTML = '<div class="record-empty">Loading the local 24-step timeline…</div>';
    if (desktopData?.getTimelineContent) desktopData.getTimelineContent().then((content) => { state.timelineContent = content; renderDetail(); }).catch((error) => { target.innerHTML = `<div class="record-empty">Unable to load timeline content: ${escapeHtml(error.message || error)}</div>`; });
    return;
  }
  const content = state.timelineContent;
  const step = content.steps.find((item) => item.display_step === state.timelineStep) || content.steps[0];
  const questions = content.questions.filter((question) => question.display_step === state.timelineStep);
  const linkedCount = contentForStudy(study.id, (item) => item.content_type.startsWith('timeline_')).length;
  const stepButtons = content.steps.map((item) => `<button class="timeline-step-button ${item.display_step === state.timelineStep ? 'is-selected' : ''}" data-timeline-step="${item.display_step}" type="button"><span>${item.display_step}</span><strong>${escapeHtml(item.aaron)}</strong></button>`).join('');
  target.innerHTML = `<div class="timeline-workspace"><div class="timeline-toolbar"><div><span class="eyebrow">Local content package</span><h2>${escapeHtml(content.title)}</h2><p class="muted">24 numbered steps · ${content.question_count} questions · prelude preserved separately</p></div><button class="button button-secondary" id="timeline-attach" type="button" ${linkedCount ? 'disabled' : ''}>${linkedCount ? 'Timeline attached locally' : 'Attach timeline to study'}</button></div><div class="timeline-prelude"><strong>Prelude</strong><span>${escapeHtml(content.prelude.aaron)} — ${escapeHtml(content.prelude.jesus)}</span><small>Source entry 0 is preserved for provenance and is not counted among the 24 user-facing steps.</small></div><div class="timeline-columns"><nav class="timeline-step-list" aria-label="Timeline steps">${stepButtons}</nav><section class="timeline-step-detail"><span class="eyebrow">Step ${step.display_step} of 24</span><h3>${escapeHtml(step.aaron)}</h3><p class="timeline-jesus">${escapeHtml(step.jesus)}</p><dl class="timeline-facts"><div><dt>Aaron reference</dt><dd>${escapeHtml(step.aaronRef)}</dd></div><div><dt>Jesus reference</dt><dd>${escapeHtml(step.jesusRef)}</dd></div><div><dt>Questions</dt><dd>${questions.length}</dd></div></dl><h4>Learning prompts</h4>${questions.length ? `<ol class="timeline-questions">${questions.map((question) => `<li><strong>${escapeHtml(question.question)}</strong><span>${escapeHtml(question.type)} · ${escapeHtml(question.explanation || 'No explanation supplied.')}</span></li>`).join('')}</ol>` : '<p class="muted">No questions are assigned to this step.</p>'}</section></div>${scriptureAtlasMarkup(step)}</div>`;
  document.querySelectorAll('[data-timeline-step]').forEach((button) => button.addEventListener('click', () => { state.timelineStep = Number(button.dataset.timelineStep); renderDetail(); }));
  document.querySelectorAll('[data-open-section="scripture"]').forEach((button) => button.addEventListener('click', () => { state.section = 'scripture'; renderDetail(); }));
  document.querySelectorAll('[data-scripture-reference]').forEach((button) => button.addEventListener('click', () => { state.section = 'scripture'; state.scriptureQuery = button.dataset.scriptureReference; state.scriptureReference = `reference:${button.dataset.scriptureReference}`; renderDetail(); }));
  $('#timeline-attach')?.addEventListener('click', async () => {
    try {
      if (!desktopData?.attachTimeline) throw new Error('Timeline attachment is available in the standalone Electron app.');
      await desktopData.attachTimeline({ studyId: study.id });
      await refreshFromDesktop();
      showMessage('The 24-step timeline and its questions were attached locally.');
    } catch (error) { showMessage(error.message || 'Unable to attach the timeline.', true); }
  });
}

function renderDetail() {
  const study = selectedStudy();
  const detail = $('#study-detail-view');
  if (!study || state.view !== 'study') { detail.hidden = true; return; }
  detail.hidden = false;
  $('#study-detail-title').textContent = study.title;
  $('#study-detail-description').textContent = study.description || 'No description yet.';
  $('#section-tabs').innerHTML = STUDY_SECTIONS.map((section) => `<button class="section-tab ${section.id === state.section ? 'is-active' : ''}" data-study-section="${section.id}" role="tab" aria-selected="${section.id === state.section}">${section.label}</button>`).join('');
  document.querySelectorAll('[data-study-section]').forEach((button) => button.addEventListener('click', () => { state.section = button.dataset.studySection; renderDetail(); }));
  $('#add-record').disabled = state.section === 'overview' || state.section === 'timeline' || state.section === 'scripture';
  if (state.section === 'overview') { renderWorkspaceMode(study); document.querySelectorAll('[data-open-section]').forEach((button) => button.addEventListener('click', () => { state.section = button.dataset.openSection; renderDetail(); })); return; }
  if (state.section === 'timeline') { renderTimeline(study); return; }
  if (state.section === 'scripture') { renderScriptureWorkspace(study); return; }
  const records = recordsForStudy(study.id, state.section);
  const rows = records.map((record) => `<tr><td><span class="record-title">${escapeHtml(record.title || record.name)}</span><span class="record-secondary">${escapeHtml(record.body || record.description || record.author || record.source_type || record.citation || '')}</span></td><td>${escapeHtml(formatDate(record.updated_at || record.created_at))}</td></tr>`).join('');
  $('#record-table-wrap').innerHTML = records.length ? `<table><thead><tr><th>${escapeHtml(STUDY_SECTIONS.find((item) => item.id === state.section).label)}</th><th>Updated</th></tr></thead><tbody>${rows}</tbody></table>` : '<div class="record-empty">No records in this section yet.</div>';
}

function renderInformation() {
  const information = { collections: ['Collections', 'Collections will group studies without changing their underlying records.'], model: ['Data Model', 'Schema version 2 preserves the study model and adds versioned content items, content relationships, provenance, and study-content links.'], transfer: ['Import / Export', 'Use Export to create a portable .ssbundle file and Import to validate and restore one, including attached local content.'], settings: ['Settings', 'Sanctuary Studies is running as a local Electron application. Core study data and content packages are stored locally.'] };
  const content = information[state.view];
  $('#information-view').hidden = !content;
  if (content) { $('#information-eyebrow').textContent = state.view === 'model' ? 'Shared contract' : 'Workspace'; $('#information-title').textContent = content[0]; $('#information-body').innerHTML = `<p>${escapeHtml(content[1])}</p>`; }
}

function fieldMarkup(name, label, options = {}) {
  const tag = options.multiline ? 'textarea' : 'input';
  return `<label>${escapeHtml(label)}<${tag} name="${escapeHtml(name)}" ${options.multiline ? 'rows="4"' : 'type="text"'} ${options.required ? 'required' : ''} placeholder="${escapeHtml(options.placeholder || '')}"></${tag}>`;
}

function openRecordDialog() {
  if (!selectedStudy() || state.section === 'overview') return;
  const labels = {
    sources: [fieldMarkup('title', 'Title', { required: true, placeholder: 'Source title' }), fieldMarkup('author', 'Author', { placeholder: 'Author or editor' }), fieldMarkup('source_type', 'Source type', { placeholder: 'Book, article, archive…' }), fieldMarkup('citation', 'Citation', { multiline: true }), fieldMarkup('local_path', 'Local file path', { placeholder: 'Optional local path' }), fieldMarkup('notes', 'Notes', { multiline: true })],
    notes: [fieldMarkup('title', 'Title', { required: true, placeholder: 'Note title' }), fieldMarkup('body', 'Body', { required: true, multiline: true })],
    people: [fieldMarkup('name', 'Name', { required: true, placeholder: 'Person name' }), fieldMarkup('description', 'Description', { multiline: true }), fieldMarkup('metadata_json', 'Metadata JSON', { placeholder: '{}' })],
    places: [fieldMarkup('name', 'Name', { required: true, placeholder: 'Place name' }), fieldMarkup('description', 'Description', { multiline: true }), fieldMarkup('metadata_json', 'Metadata JSON', { placeholder: '{}' })],
    events: [fieldMarkup('name', 'Name', { required: true, placeholder: 'Event name' }), fieldMarkup('description', 'Description', { multiline: true }), fieldMarkup('metadata_json', 'Metadata JSON', { placeholder: '{}' })],
    tags: [fieldMarkup('name', 'Tag', { required: true, placeholder: 'Tag label' })]
  };
  const sectionLabel = STUDY_SECTIONS.find((item) => item.id === state.section)?.label || 'Record';
  $('#record-dialog-title').textContent = `Add ${sectionLabel.toLowerCase()}`;
  $('#record-fields').innerHTML = labels[state.section].join('');
  $('#record-dialog').showModal();
}

async function refreshFromDesktop() {
  if (!desktopData?.snapshot) { render(); return; }
  state.database = await desktopData.snapshot();
  if (!state.scriptureContent && desktopData.getScriptureContent) state.scriptureContent = await desktopData.getScriptureContent();
  if (!selectedStudy()) state.selectedId = state.database.studies.find(active)?.id || null;
  if (state.selectedId) state.workspaceMode = storedWorkspaceMode(state.selectedId);
  render();
}

async function handleCreateStudy(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    if (!desktopData?.createStudy) throw new Error('The local data service is unavailable.');
    const study = await desktopData.createStudy({ title: form.get('title'), description: form.get('description') });
    await refreshFromDesktop(); state.selectedId = study.id; state.view = 'study'; render(); $('#study-dialog').close(); showMessage('Study created and saved locally.');
  } catch (error) { showMessage(error.message || 'Unable to create the study.', true); }
}

async function handleCreateRecord(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    if (!desktopData?.addStudyRecord) throw new Error('The local data service is unavailable.');
    await desktopData.addStudyRecord({ studyId: state.selectedId, section: state.section, payload: Object.fromEntries(form.entries()) });
    await refreshFromDesktop(); state.view = 'study'; render(); $('#record-dialog').close(); showMessage('Record saved locally.');
  } catch (error) { showMessage(error.message || 'Unable to save the record.', true); }
}

async function exportBundle() {
  try { if (!desktopData?.exportFile) throw new Error('Export is available in the standalone Electron app.'); const result = await desktopData.exportFile(); if (!result.canceled) showMessage(`Bundle exported to ${result.path}.`); } catch (error) { showMessage(error.message || 'Unable to export the bundle.', true); }
}

async function importBundle() {
  try { if (!desktopData?.importFile) throw new Error('Import is available in the standalone Electron app.'); const result = await desktopData.importFile(); if (!result.canceled) { state.database = result.database; state.selectedId = state.database.studies.find(active)?.id || null; state.view = 'library'; state.section = 'overview'; render(); showMessage(`Bundle imported from ${result.path}.`); } } catch (error) { showMessage(error.message || 'Unable to import the bundle.', true); }
}

document.querySelectorAll('[data-section]').forEach((item) => item.addEventListener('click', () => { state.view = item.dataset.section; render(); }));
$('#workspace-mode').addEventListener('change', (event) => setWorkspaceMode(event.target.value));
$('#global-search').addEventListener('input', (event) => { state.query = event.target.value; $('#table-search').value = state.query; render(); });
$('#table-search').addEventListener('input', (event) => { state.query = event.target.value; $('#global-search').value = state.query; render(); });
$('#filter-studies').addEventListener('click', () => { state.statusFilter = ({ all: 'draft', draft: 'active', active: 'paused', paused: 'all' })[state.statusFilter]; render(); });
$('#sort-studies').addEventListener('click', () => { state.sort = state.sort === 'updated' ? 'title' : 'updated'; render(); });
$('#new-study').addEventListener('click', openStudyDialog);
$('#add-record').addEventListener('click', openRecordDialog);
$('#export-bundle').addEventListener('click', exportBundle);
$('#import-bundle').addEventListener('click', importBundle);
$('#open-legacy-workspace').addEventListener('click', async () => {
  try {
    await window.sanctuaryDesktop.openLegacyWorkspace();
  } catch (error) { showMessage(error.message || 'Unable to open the existing Study Workspace.', true); }
});
$('#study-form').addEventListener('submit', handleCreateStudy);
$('#record-form').addEventListener('submit', handleCreateRecord);
document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#global-search').focus(); } });

refreshFromDesktop().catch((error) => showMessage(error.message || 'Unable to load local studies.', true));
