const assert = require('node:assert/strict');
const { loadLearningGamesPackage, learningGamesPackageToItems, learningGamesPackageToRecords, evaluateGameItem } = require('../shared/content/learning/games/game-index.cjs');
const { createEmptyDatabase, createBundle } = require('../shared/model.cjs');

const packageData = loadLearningGamesPackage();
assert.equal(packageData.games.length, 30);
for (const type of ['multiple_choice', 'fill_blank', 'true_false', 'scripture_linking', 'matching', 'symbolism']) assert.equal(packageData.games.filter((game) => game.game_type === type).length, 5);
assert.equal(new Set(packageData.games.map((game) => game.game_id)).size, 30);
const items = learningGamesPackageToItems(packageData);
const records = learningGamesPackageToRecords(packageData);
assert.equal(items.length, 30);
assert.equal(records.length, 30);
assert.ok(packageData.games.every((game) => game.source_content.length > 0 && game.items.every((item) => (item.references || []).length > 0)));
assert.equal(evaluateGameItem(packageData.games.find((game) => game.game_type === 'fill_blank'), packageData.games.find((game) => game.game_type === 'fill_blank').items[0], ' SANCTUARY! '), true);
assert.equal(evaluateGameItem(packageData.games.find((game) => game.game_type === 'true_false'), packageData.games.find((game) => game.game_type === 'true_false').items[0], true), true);
const database = createEmptyDatabase();
database.learning_games = records;
assert.equal(createBundle(database).schema_version, 3);
console.log(JSON.stringify({ ok: true, games: packageData.games.length, counts: packageData.counts, schemaVersion: 3 }));
