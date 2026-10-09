const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');

const root = path.resolve(__dirname, '..');
const sourceRevision = process.env.SANCTUARY_SOURCE_REVISION || '5c8ae58e7432bf3cd8073eeab9c4c094e192b5ab';
const timestamp = new Date().toISOString();

function readLegacyConstant(fileName, expression) {
  const source = fs.readFileSync(path.join(root, fileName), 'utf8');
  return JSON.parse(vm.runInNewContext(`${source}\n;JSON.stringify(${expression})`, { console }));
}

function slug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function referencesFromValue(value) {
  if (Array.isArray(value)) return value.map((item) => String(item.ref || item.reference || '')).filter(Boolean);
  return String(value || '').split(';').map((item) => item.trim()).filter(Boolean);
}

function referenceRecord(reference) {
  return { id: `scripture.reference.${slug(reference)}`, reference, kind: 'Scripture reference', source: 'legacy Symbolism and sacred Colors content' };
}

function buildItems(categories, colors, references) {
  const symbolismItems = Object.entries(categories).flatMap(([category, records]) => records.map((record, index) => ({
    content_id: `symbolism.${category}.${slug(record.name)}`,
    category,
    legacy_index: index,
    ...record,
    scripture_references: referencesFromValue(record.scripture)
  })));
  const colorItems = colors.map((color, index) => ({ content_id: `color.${color.id}`, legacy_index: index, ...color, scripture_references: color.scriptures.map((scripture) => scripture.ref) }));
  return { symbolismItems, colorItems, references };
}

function buildPackage({ contentType, title, sourceFiles, records, categories, colors, references }) {
  return {
    format: 'sanctuary-studies-content',
    content_type: contentType,
    content_version: 1,
    title,
    source_revision: sourceRevision,
    imported_at: timestamp,
    source_files: sourceFiles,
    license_status: 'review-required',
    runtime: 'offline-local',
    counts: { records: records.length, scripture_references: references.length },
    record_count: records.length,
    scripture_reference_count: references.length,
    categories,
    colors,
    records,
    scripture_references: references
  };
}

const legacySymbolism = readLegacyConstant('app-pages2.js', 'SYMBOLISM_DATA');
const legacyColors = readLegacyConstant('app-data.js', 'SACRED_COLORS');
const scriptureReferences = new Map();
for (const records of Object.values(legacySymbolism)) for (const record of records) for (const reference of referencesFromValue(record.scripture)) scriptureReferences.set(reference, referenceRecord(reference));
for (const color of legacyColors) for (const scripture of color.scriptures) scriptureReferences.set(scripture.ref, referenceRecord(scripture.ref));
const built = buildItems(legacySymbolism, legacyColors, [...scriptureReferences.values()]);
const symbolismPackage = buildPackage({ contentType: 'symbolism', title: 'Sanctuary Symbolism', sourceFiles: ['app-pages2.js'], records: built.symbolismItems, categories: legacySymbolism, colors: [], references: built.references });
const colorsPackage = buildPackage({ contentType: 'colors', title: 'Sacred Colors of the Sanctuary', sourceFiles: ['app-data.js', 'app-pages2.js'], records: built.colorItems, categories: {}, colors: built.colorItems.map((item) => item), references: built.references });

const symbolismDir = path.join(root, 'shared', 'content', 'symbolism');
const colorsDir = path.join(root, 'shared', 'content', 'colors');
fs.mkdirSync(symbolismDir, { recursive: true });
fs.mkdirSync(colorsDir, { recursive: true });
fs.writeFileSync(path.join(symbolismDir, 'symbolism-v1.json'), `${JSON.stringify(symbolismPackage, null, 2)}\n`);
fs.writeFileSync(path.join(colorsDir, 'colors-v1.json'), `${JSON.stringify(colorsPackage, null, 2)}\n`);
console.log(JSON.stringify({ symbolism_records: symbolismPackage.record_count, colors_records: colorsPackage.record_count, scripture_references: symbolismPackage.scripture_reference_count, symbolism_path: 'shared/content/symbolism/symbolism-v1.json', colors_path: 'shared/content/colors/colors-v1.json' }, null, 2));
