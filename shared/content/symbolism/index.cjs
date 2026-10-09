const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'symbolism-v1.json');

function loadSymbolismPackage() { return JSON.parse(fs.readFileSync(packagePath, 'utf8')); }

function symbolismPackageToItems(packageData, timestamp = new Date().toISOString()) {
  const item = ({ id, contentType, title, summary = '', payload }) => ({ id, content_type: contentType, slug: id.replace(/^symbolism\./, ''), title, summary, payload_json: JSON.stringify(payload), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  const records = packageData.records.map((record) => item({ id: record.content_id, contentType: `symbolism_${record.category}`, title: record.name, summary: record.zone || record.role || record.freq || 'Sanctuary symbolism', payload: record }));
  const references = packageData.scripture_references.map((reference) => item({ id: reference.id, contentType: 'scripture_reference', title: reference.reference, summary: 'Scripture reference detected in Symbolism content', payload: reference }));
  return [...records, ...references];
}

function symbolismPackageToRelationships(packageData, timestamp = new Date().toISOString()) {
  const relationships = [];
  const relation = (source, type, target, metadata = {}) => ({ id: `symbolism.relationship.${source}.${type}.${target}`, source_content_id: source, relationship_type: type, target_content_id: target, metadata_json: JSON.stringify(metadata), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  for (const record of packageData.records) for (const reference of record.scripture_references) relationships.push(relation(record.content_id, 'cites_scripture', `scripture.reference.${String(reference).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, { reference, category: record.category }));
  return relationships;
}

module.exports = { loadSymbolismPackage, symbolismPackageToItems, symbolismPackageToRelationships };
