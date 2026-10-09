const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'explorer-v1.json');

function loadExplorerPackage() { return JSON.parse(fs.readFileSync(packagePath, 'utf8')); }

function slug(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function explorerPackageToItems(packageData, timestamp = new Date().toISOString()) {
  const item = ({ id, contentType, title, summary = '', payload }) => ({ id, content_type: contentType, slug: id.replace(/^explorer\./, ''), title, summary, payload_json: JSON.stringify(payload), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  const models = packageData.models.flatMap((model) => [
    item({ id: model.content_id, contentType: 'explorer_model', title: model.label, summary: `${model.period} · ${model.zones.length} interactive zones`, payload: model }),
    ...model.zones.map((zone, index) => item({ id: `explorer.zone.${model.id}.${index + 1}-${slug(zone.name)}`, contentType: 'explorer_zone', title: zone.name, summary: model.label, payload: { ...zone, model_id: model.id, model_title: model.label, zone_index: index + 1 } }))
  ]);
  const tools = packageData.specialized_tools.map((tool) => item({ id: tool.content_id, contentType: 'specialized_tool', title: tool.title, summary: tool.desc, payload: tool }));
  const references = (packageData.scripture_references || []).map((reference) => item({ id: reference.id, contentType: 'scripture_reference', title: reference.reference, summary: 'Scripture reference detected in Explorer content', payload: reference }));
  return [...models, ...tools, ...references];
}

function explorerPackageToRelationships(packageData, timestamp = new Date().toISOString()) {
  const relation = (source, type, target, metadata = {}) => ({ id: `explorer.relationship.${source}.${type}.${target}`, source_content_id: source, relationship_type: type, target_content_id: target, metadata_json: JSON.stringify(metadata), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  return packageData.models.flatMap((model) => [
    ...model.zones.map((zone, index) => relation(model.content_id, 'contains_zone', `explorer.zone.${model.id}.${index + 1}-${slug(zone.name)}`, { model: model.id, zone: zone.name })),
    ...(model.keyScriptures || []).map((reference) => relation(model.content_id, 'cites_scripture', `scripture.reference.${slug(reference)}`, { reference }))
  ]);
}

module.exports = { loadExplorerPackage, explorerPackageToItems, explorerPackageToRelationships };
