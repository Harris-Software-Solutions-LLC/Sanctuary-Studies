const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../shared/store.cjs');
const { parseBundle, validateDatabase } = require('../shared/model.cjs');
const { loadScripturePackage, scripturePackageToItems, scripturePackageToRelationships } = require('../shared/content/scripture/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-scripture-${process.pid}`);

try {
  const packageData = loadScripturePackage();
  assert.equal(packageData.content_type, 'scripture');
  assert.equal(packageData.book_count, 66);
  assert.equal(packageData.chapter_count, 1189);
  assert.equal(packageData.verse_count, 214);
  assert.equal(packageData.passage_count, 8);
  assert.equal(packageData.cross_reference_group_count, 6);
  assert.equal(packageData.study_note_count, 6);
  assert.equal(packageData.reference_index.length, 258);

  const items = scripturePackageToItems(packageData, '2026-01-01T00:00:00.000Z');
  const relationships = scripturePackageToRelationships(packageData, '2026-01-01T00:00:00.000Z');
  assert.ok(items.some((item) => item.content_type === 'scripture_passage'));
  assert.ok(items.some((item) => item.content_type === 'scripture_verse'));
  assert.ok(relationships.some((relation) => relation.relationship_type === 'cross_reference'));

  const store = createStore(path.join(temporaryRoot, 'data.json'));
  const study = store.createStudy({ title: 'Scripture package test' });
  const attachment = store.attachContentPackage({ studyId: study.id, packageData, items, relationships, sourceName: 'test Scripture', sourcePath: 'test/scripture', sourceRevision: 'test', licenseStatus: 'review-required' });
  assert.equal(attachment.items, items.length);
  assert.equal(attachment.links, items.length);
  assert.equal(attachment.relationships, relationships.length);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'scripture_passage' }).length, 8);
  assert.ok(store.listStudyContent({ studyId: study.id, contentType: 'scripture_reference' }).some((item) => item.title === 'Hebrews 9:23-24'));

  const database = store.snapshot();
  assert.equal(validateDatabase(database).valid, true);
  const roundTrip = parseBundle(store.exportBundle());
  assert.equal(roundTrip.content_items.length, database.content_items.length);
  assert.equal(roundTrip.content_relationships.length, database.content_relationships.length);
  assert.equal(roundTrip.study_content_links.length, database.study_content_links.length);
  console.log(`Scripture content tests passed: ${items.length} items, ${relationships.length} relationships, ${packageData.reference_index.length} searchable references`);
} finally {
  if (fs.existsSync(temporaryRoot)) fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
