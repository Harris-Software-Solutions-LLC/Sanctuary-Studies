const crypto = require('node:crypto');
const { CONTENT_TABLES, migrateV1ToV2 } = require('./migrations/002-content-links.cjs');

const CURRENT_SCHEMA_VERSION = 2;
const BUNDLE_FORMAT = 'sanctuary-studies-bundle';
const TABLES = ['studies', 'sources', 'notes', 'entities', 'relationships', 'tags', 'study_tags', ...CONTENT_TABLES];
const ENTITY_TYPES = ['person', 'place', 'event'];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createEmptyDatabase() {
  return {
    schema_version: CURRENT_SCHEMA_VERSION,
    ...Object.fromEntries(TABLES.map((table) => [table, []]))
  };
}

function migrateDatabase(input) {
  const source = input && typeof input === 'object' ? input : {};
  const version = Number(source.schema_version || 0);
  if (version > CURRENT_SCHEMA_VERSION) {
    throw new Error(`This data uses schema version ${version}; this app supports version ${CURRENT_SCHEMA_VERSION}.`);
  }

  // Version 0 was the unversioned prototype store. Its table names already
  // match v1, so migration is additive and preserves every record.
  const migrated = createEmptyDatabase();
  for (const table of TABLES) {
    if (Array.isArray(source[table])) migrated[table] = clone(source[table]);
  }
  return version < 2 ? migrateV1ToV2(migrated) : migrated;
}

function validateDatabase(database) {
  const value = migrateDatabase(database);
  const studyIds = new Set(value.studies.map((study) => study.id));
  const entityIds = new Set(value.entities.map((entity) => entity.id));
  const tagIds = new Set(value.tags.map((tag) => tag.id));
  const contentIds = new Set(value.content_items.map((item) => item.id));
  const errors = [];

  for (const table of TABLES) {
    if (!Array.isArray(value[table])) errors.push(`${table} must be an array`);
  }
  for (const row of [...value.sources, ...value.notes, ...value.entities, ...value.tags]) {
    if (!studyIds.has(row.study_id)) errors.push(`${row.id} references a missing study`);
  }
  for (const entity of value.entities) {
    if (!ENTITY_TYPES.includes(entity.entity_type)) errors.push(`${entity.id} has an invalid entity_type`);
  }
  for (const relation of value.relationships) {
    if (!studyIds.has(relation.study_id)) errors.push(`${relation.id} references a missing study`);
    if (!entityIds.has(relation.source_entity_id) || !entityIds.has(relation.target_entity_id)) errors.push(`${relation.id} references a missing entity`);
  }
  for (const join of value.study_tags) {
    if (!studyIds.has(join.study_id) || !tagIds.has(join.tag_id)) errors.push('study_tags references a missing record');
  }
  for (const item of value.content_items) {
    if (!item.id || !item.content_type || !item.title) errors.push('content_items requires id, content_type, and title');
    try { JSON.parse(String(item.payload_json || '{}')); } catch { errors.push(`${item.id || 'content item'} has invalid payload_json`); }
  }
  for (const relation of value.content_relationships) {
    if (!contentIds.has(relation.source_content_id) || !contentIds.has(relation.target_content_id)) errors.push(`${relation.id} references a missing content item`);
  }
  for (const provenance of value.content_provenance) {
    if (!contentIds.has(provenance.content_id)) errors.push(`${provenance.id} references a missing content item`);
  }
  for (const link of value.study_content_links) {
    if (!studyIds.has(link.study_id) || !contentIds.has(link.content_id)) errors.push(`${link.id} references a missing study or content item`);
  }
  return { valid: errors.length === 0, errors, database: value };
}

function createBundle(database, metadata = {}) {
  const validation = validateDatabase(database);
  if (!validation.valid) throw new Error(`Cannot export invalid data: ${validation.errors.join('; ')}`);
  return {
    format: BUNDLE_FORMAT,
    format_version: 1,
    schema_version: CURRENT_SCHEMA_VERSION,
    exported_at: new Date().toISOString(),
    source: metadata.source || 'Sanctuary Studies',
    data: validation.database
  };
}

function parseBundle(bundle) {
  if (!bundle || bundle.format !== BUNDLE_FORMAT || Number(bundle.format_version) !== 1) {
    throw new Error('The selected file is not a supported Sanctuary Studies bundle.');
  }
  const validation = validateDatabase(bundle.data);
  if (!validation.valid) throw new Error(`The bundle is invalid: ${validation.errors.join('; ')}`);
  return validation.database;
}

function newId() {
  return crypto.randomUUID();
}

module.exports = {
  BUNDLE_FORMAT,
  CONTENT_TABLES,
  CURRENT_SCHEMA_VERSION,
  ENTITY_TYPES,
  TABLES,
  createBundle,
  createEmptyDatabase,
  migrateDatabase,
  newId,
  parseBundle,
  validateDatabase
};
