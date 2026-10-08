const fs = require('node:fs');
const path = require('node:path');
const { createBundle, createEmptyDatabase, migrateDatabase, newId, parseBundle } = require('./model.cjs');

function createStore(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  function read() {
    if (!fs.existsSync(filePath)) return createEmptyDatabase();
    return migrateDatabase(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  }

  function write(database) {
    const temporaryPath = `${filePath}.${process.pid}.tmp`;
    fs.writeFileSync(temporaryPath, JSON.stringify(database, null, 2), 'utf8');
    try {
      fs.renameSync(temporaryPath, filePath);
    } catch (error) {
      if (process.platform !== 'win32' || !['EPERM', 'EEXIST', 'EXDEV'].includes(error.code)) throw error;
      fs.copyFileSync(temporaryPath, filePath);
      fs.unlinkSync(temporaryPath);
    }
  }

  function transact(mutator) {
    const database = read();
    const result = mutator(database);
    write(database);
    return result;
  }

  function addStudyRecord({ studyId, section, payload = {} }) {
    const tableBySection = { sources: 'sources', notes: 'notes', people: 'entities', places: 'entities', events: 'entities', tags: 'tags' };
    const table = tableBySection[section];
    if (!table) throw new Error(`Unsupported study section: ${section}`);
    return transact((database) => {
      const study = database.studies.find((item) => item.id === studyId);
      if (!study) throw new Error('The selected study does not exist.');
      const timestamp = new Date().toISOString();
      let record;
      if (table === 'entities') {
        record = { id: newId(), study_id: studyId, entity_type: { people: 'person', places: 'place', events: 'event' }[section], name: String(payload.name || '').trim(), description: String(payload.description || '').trim(), metadata_json: String(payload.metadata_json || '{}') };
      } else if (table === 'tags') {
        record = { id: newId(), study_id: studyId, name: String(payload.name || '').trim() };
        database.study_tags.push({ study_id: studyId, tag_id: record.id });
      } else if (table === 'notes') {
        record = { id: newId(), study_id: studyId, title: String(payload.title || '').trim(), body: String(payload.body || '').trim(), created_at: timestamp, updated_at: timestamp };
      } else {
        record = { id: newId(), study_id: studyId, title: String(payload.title || '').trim(), author: String(payload.author || '').trim(), source_type: String(payload.source_type || 'Reference').trim(), citation: String(payload.citation || '').trim(), local_path: String(payload.local_path || '').trim(), notes: String(payload.notes || '').trim() };
      }
      if (!record.title && !record.name) throw new Error('A record name or title is required.');
      database[table].push(record);
      study.updated_at = timestamp;
      return record;
    });
  }

  return {
    snapshot: () => read(),
    createStudy: ({ title, description = '' }) => transact((database) => {
      const timestamp = new Date().toISOString();
      const study = { id: newId(), title: String(title || '').trim(), description: String(description).trim(), status: 'draft', created_at: timestamp, updated_at: timestamp };
      if (!study.title) throw new Error('A study title is required.');
      database.studies.push(study);
      return study;
    }),
    addStudyRecord,
    exportBundle: () => createBundle(read(), { source: 'Sanctuary Studies desktop' }),
    importBundle: (bundle) => {
      const imported = parseBundle(bundle);
      write(imported);
      return imported;
    }
  };
}

module.exports = { createStore };
