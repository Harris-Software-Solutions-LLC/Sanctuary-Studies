const TABLES = ['studies', 'sources', 'notes', 'entities', 'relationships', 'tags', 'study_tags'];
const STUDY_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'sources', label: 'Sources' },
  { id: 'notes', label: 'Notes' },
  { id: 'people', label: 'People' },
  { id: 'places', label: 'Places' },
  { id: 'events', label: 'Events' },
  { id: 'tags', label: 'Tags' }
];
const desktopData = window.sanctuaryDesktop?.data || null;
const state = { database: Object.fromEntries([['schema_version', 1], ...TABLES.map((table) => [table, []])]), selectedId: null, query: '', statusFilter: 'all', sort: 'updated', view: 'library', section: 'overview' };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const active = (record) => !record.deleted_at;
const selectedStudy = () => state.database.studies.find((study) => study.id === state.selectedId && active(study));

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

function visibleStudies() {
  const query = state.query.trim().toLowerCase();
  return state.database.studies.filter(active).filter((study) => state.statusFilter === 'all' || String(study.status).toLowerCase() === state.statusFilter).filter((study) => `${study.title} ${study.description} ${study.status}`.toLowerCase().includes(query)).sort((left, right) => state.sort === 'title' ? left.title.localeCompare(right.title) : String(right.updated_at || '').localeCompare(String(left.updated_at || '')));
}

function render() {
  const visible = visibleStudies();
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

function selectStudy(studyId) { state.selectedId = studyId; state.view = 'study'; state.section = 'overview'; render(); }

function renderDetail() {
  const study = selectedStudy();
  const detail = $('#study-detail-view');
  if (!study || state.view !== 'study') { detail.hidden = true; return; }
  detail.hidden = false;
  $('#study-detail-title').textContent = study.title;
  $('#study-detail-description').textContent = study.description || 'No description yet.';
  $('#section-tabs').innerHTML = STUDY_SECTIONS.map((section) => `<button class="section-tab ${section.id === state.section ? 'is-active' : ''}" data-study-section="${section.id}" role="tab" aria-selected="${section.id === state.section}">${section.label}</button>`).join('');
  document.querySelectorAll('[data-study-section]').forEach((button) => button.addEventListener('click', () => { state.section = button.dataset.studySection; renderDetail(); }));
  $('#add-record').disabled = state.section === 'overview';
  if (state.section === 'overview') { const counts = studyCounts(study.id); $('#record-table-wrap').innerHTML = `<div class="record-empty">This study contains ${counts.sources} sources, ${counts.notes} notes, ${counts.people} people, ${counts.places} places, ${counts.events} events, and ${counts.tags} tags. Choose a section to inspect or add records.</div>`; return; }
  const records = recordsForStudy(study.id, state.section);
  const rows = records.map((record) => `<tr><td><span class="record-title">${escapeHtml(record.title || record.name)}</span><span class="record-secondary">${escapeHtml(record.body || record.description || record.author || record.source_type || record.citation || '')}</span></td><td>${escapeHtml(formatDate(record.updated_at || record.created_at))}</td></tr>`).join('');
  $('#record-table-wrap').innerHTML = records.length ? `<table><thead><tr><th>${escapeHtml(STUDY_SECTIONS.find((item) => item.id === state.section).label)}</th><th>Updated</th></tr></thead><tbody>${rows}</tbody></table>` : '<div class="record-empty">No records in this section yet.</div>';
}

function renderInformation() {
  const information = { collections: ['Collections', 'Collections will group studies without changing their underlying records.'], model: ['Data Model', 'Schema version 1 contains studies, sources, notes, typed entities for people, places, and events, relationships, tags, and study_tags.'], transfer: ['Import / Export', 'Use Export to create a portable .ssbundle file and Import to validate and restore one.'], settings: ['Settings', 'Sanctuary Studies is running as a local Electron application. Core study data is stored locally.'] };
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
  if (!selectedStudy()) state.selectedId = state.database.studies.find(active)?.id || null;
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
