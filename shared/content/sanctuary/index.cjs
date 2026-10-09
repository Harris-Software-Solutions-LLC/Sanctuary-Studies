const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'sanctuary-v1.json');

function loadSanctuaryPackage() { return JSON.parse(fs.readFileSync(packagePath, 'utf8')); }

function slug(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function sanctuaryPackageToItems(packageData, timestamp = new Date().toISOString()) {
  const item = ({ id, contentType, title, summary = '', payload }) => ({ id, content_type: contentType, slug: id.replace(/^sanctuary\./, ''), title, summary, payload_json: JSON.stringify(payload), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  const models = packageData.models.flatMap((model) => [
    item({ id: model.content_id, contentType: 'sanctuary_model', title: model.label, summary: `${model.period} · ${model.zones.length} zones`, payload: model }),
    ...model.zones.map((zone, index) => item({ id: `sanctuary.zone.${model.id}.${index + 1}-${slug(zone.name)}`, contentType: 'sanctuary_zone', title: zone.name, summary: model.label, payload: { ...zone, model_id: model.id, model_title: model.label, zone_index: index + 1 } }))
  ]);
  const comparisons = packageData.comparisons.map((comparison) => item({ id: comparison.content_id, contentType: 'sanctuary_comparison', title: comparison.title, summary: `${comparison.rows.length} comparative rows`, payload: comparison }));
  const stages = packageData.portal_stages.map((stage) => item({ id: stage.content_id, contentType: 'sanctuary_portal_stage', title: stage.label, summary: stage.desc, payload: stage }));
  const references = packageData.scripture_references.map((reference) => item({ id: reference.id, contentType: 'scripture_reference', title: reference.reference, summary: 'Scripture reference detected in Sanctuary content', payload: reference }));
  return [...models, ...comparisons, ...stages, ...references];
}

function sanctuaryPackageToRelationships(packageData, timestamp = new Date().toISOString()) {
  const relation = (source, type, target, metadata = {}) => ({ id: `sanctuary.relationship.${source}.${type}.${target}`, source_content_id: source, relationship_type: type, target_content_id: target, metadata_json: JSON.stringify(metadata), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  const relationships = [];
  for (const model of packageData.models) {
    for (const [index, zone] of model.zones.entries()) relationships.push(relation(model.content_id, 'contains_zone', `sanctuary.zone.${model.id}.${index + 1}-${slug(zone.name)}`, { model: model.id, zone: zone.name }));
    for (const reference of model.keyScriptures || []) relationships.push(relation(model.content_id, 'cites_scripture', `scripture.reference.${slug(reference)}`, { reference }));
  }
  for (const stage of packageData.portal_stages) for (const reference of String(stage.scripture || '').split('—')[1] ? [String(stage.scripture).split('—').pop().replace(/\s*\(KJV\)\s*$/, '').trim()] : []) relationships.push(relation(stage.content_id, 'cites_scripture', `scripture.reference.${slug(reference)}`, { reference }));
  return relationships;
}

module.exports = { loadSanctuaryPackage, sanctuaryPackageToItems, sanctuaryPackageToRelationships };
