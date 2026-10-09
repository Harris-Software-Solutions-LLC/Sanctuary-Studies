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

function normalizeJson(value, fieldName) {
  const json = String(value || '{}');
  try { JSON.parse(json); } catch { throw new Error(`${fieldName} must contain valid JSON.`); }
  return json;
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

  function listContentItems({ contentType } = {}) {
    return read().content_items.filter((item) => !item.deleted_at && (!contentType || item.content_type === contentType)).map(clone);
  }

  function listStudyContent({ studyId, contentType } = {}) {
    const database = read();
    activeStudy(database, studyId);
    const contentById = new Map(database.content_items.filter((item) => !item.deleted_at).map((item) => [item.id, item]));
    return database.study_content_links
      .filter((link) => link.study_id === studyId && !link.deleted_at)
      .map((link) => ({ content: contentById.get(link.content_id), link }))
      .filter(({ content }) => content && (!contentType || content.content_type === contentType))
      .map(({ content, link }) => ({ ...clone(content), link: clone(link) }));
  }

  function attachContentPackage({ studyId, packageData, items = [], relationships = [], sourceName = '', sourcePath = '', sourceRevision = '', licenseStatus = 'review-required' }) {
    return transact((database) => {
      const study = activeStudy(database, studyId);
      const timestamp = new Date().toISOString();
      let links = 0;
      for (const item of items) {
        if (!item?.id || !item.content_type || !item.title) throw new Error('Content items require an id, content_type, and title.');
        normalizeJson(item.payload_json, 'payload_json');
        const incoming = clone(item);
        const existing = database.content_items.find((candidate) => candidate.id === item.id);
        if (existing) {
          const previous = clone(existing);
          Object.assign(existing, incoming, { updated_at: timestamp, deleted_at: null });
          // A later package may carry a deliberately small reference stub for
          // an item already imported with a richer payload. Preserve the richer
          // local record while still recording the new package provenance.
          if (String(previous.payload_json || '').length > String(incoming.payload_json || '').length) Object.assign(existing, { title: previous.title, summary: previous.summary, payload_json: previous.payload_json });
        } else database.content_items.push({ ...incoming, created_at: item.created_at || timestamp, updated_at: timestamp, deleted_at: null });
        if (!database.content_provenance.some((record) => record.content_id === item.id && record.source_path === sourcePath && !record.deleted_at)) {
          database.content_provenance.push({ id: newId(), content_id: item.id, source_name: sourceName, source_path: sourcePath, source_revision: sourceRevision, license_status: licenseStatus, imported_at: timestamp, notes: 'Imported as a local versioned content package.', deleted_at: null });
        }
        if (!database.study_content_links.some((link) => link.study_id === studyId && link.content_id === item.id && !link.deleted_at)) {
          database.study_content_links.push({ id: newId(), study_id: studyId, content_id: item.id, relationship_type: 'contains', created_at: timestamp, updated_at: timestamp, deleted_at: null });
          links += 1;
        }
      }
      const contentIds = new Set(database.content_items.filter((item) => !item.deleted_at).map((item) => item.id));
      let relationshipCount = 0;
      for (const relation of relationships) {
        if (!relation?.source_content_id || !relation.relationship_type || !relation.target_content_id) throw new Error('Content relationships require source, type, and target fields.');
        if (!contentIds.has(relation.source_content_id) || !contentIds.has(relation.target_content_id)) throw new Error(`Content relationship ${relation.id || 'unknown'} references a missing item.`);
        const existing = database.content_relationships.find((candidate) => candidate.source_content_id === relation.source_content_id && candidate.relationship_type === relation.relationship_type && candidate.target_content_id === relation.target_content_id && !candidate.deleted_at);
        if (existing) Object.assign(existing, clone(relation), { updated_at: timestamp, deleted_at: null });
        else { database.content_relationships.push({ ...clone(relation), created_at: relation.created_at || timestamp, updated_at: timestamp, deleted_at: null }); relationshipCount += 1; }
      }
      study.updated_at = timestamp;
      return { contentType: packageData?.content_type || 'unknown', items: items.length, links, relationships: relationshipCount, stepCount: packageData?.step_count || 0, questionCount: packageData?.question_count || 0 };
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
    listContentItems,
    listStudyContent,
    attachContentPackage,
    exportBundle: () => createBundle(read(), { source: 'Sanctuary Studies desktop' }),
    importBundle: (bundle) => {
      const imported = parseBundle(bundle);
      write(imported);
      return clone(imported);
    }
  };
}

module.exports = { createStore };
