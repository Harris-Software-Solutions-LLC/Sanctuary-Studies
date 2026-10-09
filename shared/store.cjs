const fs = require('node:fs');
const path = require('node:path');
const { createBundle, createEmptyDatabase, migrateDatabase, newId, parseBundle } = require('./model.cjs');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeMetadata(value) {
  const metadata = String(value || '{}');
  try {
    JSON.parse(metadata);
  } catch {
    throw new Error('metadata_json must contain valid JSON.');
  }
  return metadata;
}

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

  function activeStudy(database, studyId) {
    const study = database.studies.find((item) => item.id === studyId && !item.deleted_at);
    if (!study) throw new Error('The selected study does not exist.');
    return study;
  }

  function tableForSection(section) {
    const tableBySection = { sources: 'sources', notes: 'notes', people: 'entities', places: 'entities', events: 'entities', tags: 'tags' };
    const table = tableBySection[section];
    if (!table) throw new Error(`Unsupported study section: ${section}`);
    return table;
  }

  function addStudyRecord({ studyId, section, payload = {} }) {
    const table = tableForSection(section);
    return transact((database) => {
      const study = activeStudy(database, studyId);
      const timestamp = new Date().toISOString();
      let record;
      if (table === 'entities') {
        record = { id: newId(), study_id: studyId, entity_type: { people: 'person', places: 'place', events: 'event' }[section], name: String(payload.name || '').trim(), description: String(payload.description || '').trim(), metadata_json: normalizeMetadata(payload.metadata_json), created_at: timestamp, updated_at: timestamp };
      } else if (table === 'tags') {
        record = { id: newId(), study_id: studyId, name: String(payload.name || '').trim(), created_at: timestamp, updated_at: timestamp };
        database.study_tags.push({ study_id: studyId, tag_id: record.id });
      } else if (table === 'notes') {
        record = { id: newId(), study_id: studyId, title: String(payload.title || '').trim(), body: String(payload.body || '').trim(), created_at: timestamp, updated_at: timestamp };
      } else {
        record = { id: newId(), study_id: studyId, title: String(payload.title || '').trim(), author: String(payload.author || '').trim(), source_type: String(payload.source_type || 'Reference').trim(), citation: String(payload.citation || '').trim(), local_path: String(payload.local_path || '').trim(), notes: String(payload.notes || '').trim(), created_at: timestamp, updated_at: timestamp };
      }
      if (!record.title && !record.name) throw new Error('A record name or title is required.');
      database[table].push(record);
      study.updated_at = timestamp;
      return record;
    });
  }

  return {
    snapshot: () => clone(read()),
    listStudies: () => read().studies.filter((study) => !study.deleted_at).map(clone),
    getStudy: (studyId) => {
      const study = read().studies.find((item) => item.id === studyId && !item.deleted_at);
      return study ? clone(study) : null;
    },
    listStudyRecords: ({ studyId, section }) => {
      const database = read();
      activeStudy(database, studyId);
      const table = tableForSection(section);
      return database[table].filter((record) => record.study_id === studyId && !record.deleted_at && (table !== 'entities' || record.entity_type === { people: 'person', places: 'place', events: 'event' }[section])).map(clone);
    },
    createStudy: ({ title, description = '', status = 'draft' }) => transact((database) => {
      const timestamp = new Date().toISOString();
      const study = { id: newId(), title: String(title || '').trim(), description: String(description).trim(), status: String(status || 'draft').trim(), created_at: timestamp, updated_at: timestamp, deleted_at: null };
      if (!study.title) throw new Error('A study title is required.');
      database.studies.push(study);
      return clone(study);
    }),
    updateStudy: ({ id, title, description, status }) => transact((database) => {
      const study = activeStudy(database, id);
      if (title !== undefined) study.title = String(title).trim();
      if (description !== undefined) study.description = String(description).trim();
      if (status !== undefined) study.status = String(status).trim();
      if (!study.title) throw new Error('A study title is required.');
      study.updated_at = new Date().toISOString();
      return clone(study);
    }),
    deleteStudy: ({ id }) => transact((database) => {
      const study = activeStudy(database, id);
      const timestamp = new Date().toISOString();
      study.deleted_at = timestamp;
      study.updated_at = timestamp;
      return clone(study);
    }),
    addStudyRecord,
    exportBundle: () => createBundle(read(), { source: 'Sanctuary Studies desktop' }),
    importBundle: (bundle) => {
      const imported = parseBundle(bundle);
      write(imported);
      return clone(imported);
    }
  };
}

module.exports = { createStore };
