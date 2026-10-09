const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage, timelinePackageToItems } = require('../shared/content/timeline/index.cjs');

const temporaryRoot = path.join(path.resolve(__dirname, '..'), `.audit-temp-store-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'sanctuary-studies-data.json');

try {
  const firstStore = createStore(databasePath);
  const study = firstStore.createStudy({ title: 'Persistence Audit', description: 'Local Electron acceptance data' });
  const note = firstStore.addStudyRecord({
    studyId: study.id,
    section: 'notes',
    payload: { title: 'Round-trip note', body: 'This record must survive reopening the store.' }
  });

  assert.throws(() => firstStore.createStudy({ title: '' }), /study title is required/i);
  assert.throws(() => firstStore.addStudyRecord({ studyId: 'missing', section: 'notes', payload: { title: 'Invalid' } }), /selected study does not exist/i);
  assert.throws(() => firstStore.addStudyRecord({ studyId: study.id, section: 'people', payload: { name: 'Invalid metadata', metadata_json: '{' } }), /metadata_json must contain valid JSON/i);

  const reopenedStore = createStore(databasePath);
  const snapshot = reopenedStore.snapshot();
  assert.equal(snapshot.studies.some((item) => item.id === study.id), true);
  assert.equal(snapshot.notes.some((item) => item.id === note.id && item.body.includes('survive reopening')), true);
  assert.equal(reopenedStore.listStudies().some((item) => item.id === study.id), true);
  assert.equal(reopenedStore.listStudyRecords({ studyId: study.id, section: 'notes' }).length, 1);
  const source = reopenedStore.addStudyRecord({ studyId: study.id, section: 'sources', payload: { title: 'Local source', author: 'Author' } });
  assert.equal(reopenedStore.listStudyRecords({ studyId: study.id, section: 'sources' }).some((item) => item.id === source.id), true);
  const timeline = loadTimelinePackage();
  const attachment = reopenedStore.attachContentPackage({ studyId: study.id, packageData: timeline, items: timelinePackageToItems(timeline), sourceName: 'test timeline', sourcePath: 'test/timeline', sourceRevision: 'test' });
  assert.equal(attachment.stepCount, 24);
  assert.equal(attachment.questionCount, 189);
  assert.equal(reopenedStore.listStudyContent({ studyId: study.id, contentType: 'timeline_step' }).length, 24);
  assert.equal(reopenedStore.snapshot().study_content_links.length, 214);
  const updated = reopenedStore.updateStudy({ id: study.id, title: 'Persistence Audit Updated', status: 'active' });
  assert.equal(updated.status, 'active');
  const exported = reopenedStore.exportBundle();
  const importedStore = createStore(path.join(temporaryRoot, 'imported.json'));
  importedStore.importBundle(exported);
  assert.equal(importedStore.getStudy(study.id).title, 'Persistence Audit Updated');
  importedStore.deleteStudy({ id: study.id });
  assert.equal(importedStore.listStudies().some((item) => item.id === study.id), false);

  console.log('store persistence and invalid-input tests passed');
} finally {
  if (fs.existsSync(temporaryRoot)) fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
