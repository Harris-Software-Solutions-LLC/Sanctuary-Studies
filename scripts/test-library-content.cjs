const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../shared/store.cjs');
const { parseBundle, validateDatabase } = require('../shared/model.cjs');
const { loadLibraryPackage, libraryPackageToItems, libraryPackageToRelationships } = require('../shared/content/library/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-library-${process.pid}`);

try {
  const packageData = loadLibraryPackage();
  assert.equal(packageData.content_type, 'library');
  assert.equal(packageData.book_count, 5);
  assert.equal(packageData.chapter_count, 112);
  assert.equal(packageData.excerpt_count, 112);
  assert.equal(packageData.scripture_reference_count, 46);
  assert.equal(packageData.books.length, 5);
  assert.equal(packageData.chapters.length, 112);
  assert.equal(packageData.excerpts.length, 112);
  assert.ok(packageData.books.every((book) => book.title && book.author && book.description && Array.isArray(book.tags)));
  assert.ok(packageData.chapters.every((chapter) => chapter.title && chapter.excerpt_id && Array.isArray(chapter.scripture_references)));
  assert.ok(packageData.excerpts.some((excerpt) => excerpt.excerpt.length > 40));

  const items = libraryPackageToItems(packageData, '2026-01-01T00:00:00.000Z');
  const relationships = libraryPackageToRelationships(packageData, '2026-01-01T00:00:00.000Z');
  assert.equal(items.length, 275);
  const expectedRelationships = (packageData.chapters.length * 2) + packageData.excerpts.length + packageData.excerpts.reduce((count, excerpt) => count + excerpt.scripture_references.length, 0);
  assert.equal(relationships.length, expectedRelationships);
  assert.equal(items.filter((item) => item.content_type === 'library_book').length, 5);
  assert.equal(items.filter((item) => item.content_type === 'library_chapter').length, 112);
  assert.equal(items.filter((item) => item.content_type === 'library_excerpt').length, 112);
  assert.equal(items.filter((item) => item.content_type === 'scripture_reference').length, 46);
  for (const type of ['contains_chapter', 'contains_excerpt', 'related_source', 'cites_scripture']) assert.ok(relationships.some((relationship) => relationship.relationship_type === type));

  const store = createStore(path.join(temporaryRoot, 'data.json'));
  const study = store.createStudy({ title: 'Digital Library package test' });
  const attachment = store.attachContentPackage({ studyId: study.id, packageData, items, relationships, sourceName: 'test Digital Library', sourcePath: 'test/library', sourceRevision: 'test', licenseStatus: 'review-required' });
  assert.equal(attachment.items, items.length);
  assert.equal(attachment.links, items.length);
  assert.equal(attachment.relationships, relationships.length);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'library_book' }).length, 5);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'library_chapter' }).length, 112);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'library_excerpt' }).length, 112);
  assert.equal(store.snapshot().content_provenance.filter((record) => record.source_path === 'test/library').length, items.length);
  assert.equal(validateDatabase(store.snapshot()).valid, true);

  const roundTrip = parseBundle(store.exportBundle());
  assert.equal(roundTrip.content_items.length, items.length);
  assert.equal(roundTrip.content_relationships.length, relationships.length);
  assert.equal(roundTrip.study_content_links.length, items.length);
  console.log(`Digital Library content tests passed: ${packageData.book_count} books, ${packageData.chapter_count} chapters, ${packageData.excerpt_count} excerpts, ${packageData.scripture_reference_count} Scripture references`);
} finally {
  if (fs.existsSync(temporaryRoot)) fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
