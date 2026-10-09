const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../shared/store.cjs');
const { parseBundle, validateDatabase } = require('../shared/model.cjs');
const { loadSymbolismPackage, symbolismPackageToItems, symbolismPackageToRelationships } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage, colorsPackageToItems, colorsPackageToRelationships } = require('../shared/content/colors/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-symbolism-colors-${process.pid}`);

try {
  const symbolism = loadSymbolismPackage();
  const colors = loadColorsPackage();
  assert.equal(symbolism.content_type, 'symbolism');
  assert.equal(symbolism.record_count, 16);
  assert.equal(symbolism.categories.furnishings.length, 7);
  assert.equal(symbolism.categories.offerings.length, 5);
  assert.equal(symbolism.categories.priesthood.length, 4);
  assert.equal(colors.content_type, 'colors');
  assert.equal(colors.record_count, 8);
  assert.equal(colors.colors.length, 8);
  assert.equal(symbolism.scripture_reference_count, 55);
  assert.ok(colors.colors.every((color) => color.hex && color.hebrewWord && color.greekWord && color.symbolism && color.sanctuaryUse && color.scriptures.length === 3));

  const symbolismItems = symbolismPackageToItems(symbolism, '2026-01-01T00:00:00.000Z');
  const symbolismRelationships = symbolismPackageToRelationships(symbolism, '2026-01-01T00:00:00.000Z');
  const colorItems = colorsPackageToItems(colors, '2026-01-01T00:00:00.000Z');
  const colorRelationships = colorsPackageToRelationships(colors, '2026-01-01T00:00:00.000Z');
  assert.equal(symbolismItems.filter((item) => item.content_type.startsWith('symbolism_')).length, 16);
  assert.equal(colorItems.filter((item) => item.content_type === 'sacred_color').length, 8);
  assert.equal(symbolismItems.filter((item) => item.content_type === 'scripture_reference').length, 55);
  assert.equal(colorItems.filter((item) => item.content_type === 'scripture_reference').length, 55);
  assert.ok(symbolismRelationships.every((relationship) => relationship.relationship_type === 'cites_scripture'));
  assert.ok(colorRelationships.every((relationship) => relationship.relationship_type === 'cites_scripture'));

  const store = createStore(path.join(temporaryRoot, 'data.json'));
  const study = store.createStudy({ title: 'Symbolism and colors package test' });
  const symbolismAttachment = store.attachContentPackage({ studyId: study.id, packageData: symbolism, items: symbolismItems, relationships: symbolismRelationships, sourceName: 'test Symbolism', sourcePath: 'test/symbolism', sourceRevision: 'test', licenseStatus: 'review-required' });
  const colorsAttachment = store.attachContentPackage({ studyId: study.id, packageData: colors, items: colorItems, relationships: colorRelationships, sourceName: 'test Sacred Colors', sourcePath: 'test/colors', sourceRevision: 'test', licenseStatus: 'review-required' });
  assert.equal(symbolismAttachment.links, symbolismItems.length);
  assert.equal(colorsAttachment.links, 8);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'symbolism_furnishings' }).length, 7);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'symbolism_offerings' }).length, 5);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'symbolism_priesthood' }).length, 4);
  assert.equal(store.listStudyContent({ studyId: study.id, contentType: 'sacred_color' }).length, 8);
  assert.equal(validateDatabase(store.snapshot()).valid, true);
  const roundTrip = parseBundle(store.exportBundle());
  assert.ok(roundTrip.content_items.some((item) => item.content_type === 'sacred_color'));
  assert.ok(roundTrip.content_relationships.some((relationship) => relationship.relationship_type === 'cites_scripture'));
  console.log(`Symbolism and Sacred Colors tests passed: ${symbolism.record_count} symbolism records, ${colors.record_count} colors, ${symbolism.scripture_reference_count} Scripture references`);
} finally {
  if (fs.existsSync(temporaryRoot)) fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
