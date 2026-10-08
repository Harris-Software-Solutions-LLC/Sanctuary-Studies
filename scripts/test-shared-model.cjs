const assert = require('node:assert/strict');
const { createBundle, createEmptyDatabase, parseBundle, validateDatabase } = require('../shared/model.cjs');

const database = createEmptyDatabase();
database.studies.push({ id: 'study-1', title: 'Test Study', description: '', status: 'draft', created_at: '2026-10-06T00:00:00.000Z', updated_at: '2026-10-06T00:00:00.000Z' });
database.entities.push(
  { id: 'person-1', study_id: 'study-1', entity_type: 'person', name: 'Person', description: '', metadata_json: '{}' },
  { id: 'place-1', study_id: 'study-1', entity_type: 'place', name: 'Place', description: '', metadata_json: '{}' },
  { id: 'event-1', study_id: 'study-1', entity_type: 'event', name: 'Event', description: '', metadata_json: '{}' }
);
database.tags.push({ id: 'tag-1', study_id: 'study-1', name: 'important' });
database.study_tags.push({ study_id: 'study-1', tag_id: 'tag-1' });
database.relationships.push({ id: 'relation-1', study_id: 'study-1', source_entity_id: 'person-1', relationship_type: 'attended', target_entity_id: 'event-1' });

const validation = validateDatabase(database);
assert.equal(validation.valid, true, validation.errors.join('; '));
const roundTrip = parseBundle(createBundle(database));
assert.equal(roundTrip.schema_version, 1);
assert.equal(roundTrip.entities.length, 3);
assert.equal(roundTrip.relationships[0].relationship_type, 'attended');
console.log('shared model tests passed');
