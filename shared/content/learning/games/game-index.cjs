const fs = require('node:fs');
const path = require('node:path');
const { evaluateGameItem } = require('./engine.cjs');

const packagePath = path.join(__dirname, 'games-v1.json');

function loadLearningGamesPackage() {
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  for (const game of packageData.games) {
    if (!game.game_id || !game.title || !game.game_type || !Array.isArray(game.items) || !game.items.length) throw new Error(`Invalid learning game: ${game.game_id || 'unknown'}`);
    if (!['multiple_choice', 'fill_blank', 'true_false', 'scripture_linking', 'matching', 'symbolism'].includes(game.game_type)) throw new Error(`Unsupported learning game type: ${game.game_type}`);
  }
  return packageData;
}

function learningGamesPackageToItems(packageData, timestamp = new Date().toISOString()) {
  return packageData.games.map((game) => ({
    id: game.game_id,
    content_type: 'learning_game',
    slug: game.game_id.replace(/^game\./, ''),
    title: game.title,
    summary: `${game.game_type} · ${game.difficulty} · ${game.estimated_minutes} minutes`,
    payload_json: JSON.stringify(game),
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  }));
}

function learningGamesPackageToRecords(packageData, timestamp = new Date().toISOString()) {
  return packageData.games.map((game) => ({ id: game.game_id, game_id: game.game_id, title: game.title, game_type: game.game_type, difficulty: game.difficulty, created_at: timestamp, updated_at: timestamp }));
}

function learningGamesPackageToRelationships() { return []; }

module.exports = { loadLearningGamesPackage, learningGamesPackageToItems, learningGamesPackageToRecords, learningGamesPackageToRelationships, evaluateGameItem };
