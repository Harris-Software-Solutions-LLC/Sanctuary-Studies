const CONTENT_TABLES = ['content_items', 'content_relationships', 'content_provenance', 'study_content_links'];

function migrateV1ToV2(database) {
  const migrated = { ...database, schema_version: 2 };
  for (const table of CONTENT_TABLES) {
    if (!Array.isArray(migrated[table])) migrated[table] = [];
  }
  return migrated;
}

module.exports = { CONTENT_TABLES, migrateV1ToV2 };
