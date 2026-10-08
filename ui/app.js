const studies = [
  { id: 'john', title: 'The Gospel of John', description: 'Historical and textual analysis', status: 'Active', sources: 12, notes: 38, records: 18, updated: 'Oct 6, 2026', tags: ['textual', 'chronology'] },
  { id: 'judea', title: 'Roman Judea', description: 'People, places, and events in context', status: 'Draft', sources: 5, notes: 11, records: 9, updated: 'Oct 4, 2026', tags: ['history', 'places'] },
  { id: 'doctrine', title: 'Sanctuary Doctrine', description: 'A comparative study of sanctuary themes', status: 'Paused', sources: 8, notes: 22, records: 14, updated: 'Sep 28, 2026', tags: ['doctrine'] }
];

const state = { selectedId: studies[0].id, query: '' };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

function visibleStudies() {
  const query = state.query.trim().toLowerCase();
  return studies.filter((study) => `${study.title} ${study.description} ${study.tags.join(' ')}`.toLowerCase().includes(query));
}

function render() {
  const visible = visibleStudies();
  $('#study-count').textContent = `${visible.length} ${visible.length === 1 ? 'study' : 'studies'}`;
  $('#study-table').innerHTML = visible.length ? visible.map((study) => `<tr tabindex="0" class="${study.id === state.selectedId ? 'is-selected' : ''}" data-study-id="${study.id}"><td><span class="study-title">${escapeHtml(study.title)}</span><span class="study-description">${escapeHtml(study.description)}</span></td><td><span class="status-pill">${escapeHtml(study.status)}</span></td><td>${study.sources}</td><td>${study.notes}</td><td class="records">${study.records}</td><td>${escapeHtml(study.updated)}</td></tr>`).join('') : '<tr><td colspan="6"><div class="inspector-empty">No studies match this search.</div></td></tr>';
  document.querySelectorAll('[data-study-id]').forEach((row) => {
    row.addEventListener('click', () => { state.selectedId = row.dataset.studyId; render(); });
    row.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); state.selectedId = row.dataset.studyId; render(); } });
  });
  renderInspector(studies.find((study) => study.id === state.selectedId));
}

function renderInspector(study) {
  if (!study) { $('#inspector-content').innerHTML = '<div class="inspector-empty">Select a study to inspect its status, record counts, and tags.</div>'; return; }
  $('#inspector-content').innerHTML = `<div class="inspector-block"><div class="inspector-title">${escapeHtml(study.title)}</div><div class="inspector-description">${escapeHtml(study.description)}</div></div><div class="inspector-block"><div class="inspector-label">Status</div><span class="status-pill">${escapeHtml(study.status)}</span></div><div class="inspector-block"><div class="inspector-label">Research record</div><div class="metrics"><div class="metric"><strong>${study.sources}</strong><span>Sources</span></div><div class="metric"><strong>${study.notes}</strong><span>Notes</span></div><div class="metric"><strong>${study.records}</strong><span>Other records</span></div><div class="metric"><strong>${study.tags.length}</strong><span>Tags</span></div></div></div><div class="inspector-block"><div class="inspector-label">Tags</div><div class="tag-list">${study.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div></div><div class="inspector-block"><div class="inspector-label">Last updated</div><div class="inspector-description">${escapeHtml(study.updated)} · Stored locally</div></div>`;
}

function openStudyDialog() { $('#study-form').reset(); $('#study-dialog').showModal(); }

$('#global-search').addEventListener('input', (event) => { state.query = event.target.value; $('#table-search').value = state.query; render(); });
$('#table-search').addEventListener('input', (event) => { state.query = event.target.value; $('#global-search').value = state.query; render(); });
$('#new-study').addEventListener('click', openStudyDialog);
$('#study-form').addEventListener('submit', (event) => { event.preventDefault(); $('#study-dialog').close(); });
document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#global-search').focus(); } });

render();
