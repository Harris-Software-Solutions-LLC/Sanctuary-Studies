const LEARNING_TABLES = ['learning_games', 'game_sessions', 'game_attempts', 'learning_progress'];

function migrateV2ToV3(database) {
  const migrated = { ...database, schema_version: 3 };
  for (const table of LEARNING_TABLES) {
    if (!Array.isArray(migrated[table])) migrated[table] = [];
  }
  return migrated;
}

module.exports = { LEARNING_TABLES, migrateV2ToV3 };
