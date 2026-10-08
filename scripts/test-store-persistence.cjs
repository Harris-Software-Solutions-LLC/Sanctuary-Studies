const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../shared/store.cjs');

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

  const reopenedStore = createStore(databasePath);
  const snapshot = reopenedStore.snapshot();
  assert.equal(snapshot.studies.some((item) => item.id === study.id), true);
  assert.equal(snapshot.notes.some((item) => item.id === note.id && item.body.includes('survive reopening')), true);

  console.log('store persistence and invalid-input tests passed');
} finally {
  if (fs.existsSync(temporaryRoot)) fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
