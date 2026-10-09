const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'colors-v1.json');

function loadColorsPackage() { return JSON.parse(fs.readFileSync(packagePath, 'utf8')); }

function colorsPackageToItems(packageData, timestamp = new Date().toISOString()) {
  const item = ({ id, contentType, title, summary = '', payload }) => ({ id, content_type: contentType, slug: id.replace(/^color\./, ''), title, summary, payload_json: JSON.stringify(payload), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  const colors = packageData.colors.map((color) => item({ id: color.content_id, contentType: 'sacred_color', title: color.name, summary: color.meaning || color.symbolism, payload: color }));
  const references = packageData.scripture_references.map((reference) => item({ id: reference.id, contentType: 'scripture_reference', title: reference.reference, summary: 'Scripture reference detected in Sacred Colors content', payload: reference }));
  return [...colors, ...references];
}

function colorsPackageToRelationships(packageData, timestamp = new Date().toISOString()) {
  const relationships = [];
  const relation = (source, type, target, metadata = {}) => ({ id: `colors.relationship.${source}.${type}.${target}`, source_content_id: source, relationship_type: type, target_content_id: target, metadata_json: JSON.stringify(metadata), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  for (const color of packageData.colors) for (const scripture of color.scriptures) relationships.push(relation(color.content_id, 'cites_scripture', `scripture.reference.${String(scripture.ref).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, { reference: scripture.ref }));
  return relationships;
}

module.exports = { loadColorsPackage, colorsPackageToItems, colorsPackageToRelationships };
