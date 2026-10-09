const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'scripture-v1.json');

function loadScripturePackage() {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function referenceId(reference) {
  return `scripture.reference.${slug(reference)}`;
}

function item({ id, contentType, title, summary = '', payload, timestamp }) {
  return {
    id,
    content_type: contentType,
    slug: id.replace(/^scripture\./, ''),
    title,
    summary,
    payload_json: JSON.stringify(payload),
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  };
}

function scripturePackageToItems(packageData, timestamp = new Date().toISOString()) {
  const books = packageData.books.map((book) => item({ id: book.id, contentType: 'scripture_book', title: book.name, summary: `${book.chapter_count} chapters`, payload: book, timestamp }));
  const chapters = packageData.chapters.map((chapter) => item({ id: chapter.id, contentType: 'scripture_chapter', title: chapter.reference, summary: `${chapter.verse_count} preserved verses`, payload: chapter, timestamp }));
  const verses = packageData.verses.map((verse) => item({ id: verse.id, contentType: 'scripture_verse', title: verse.reference, summary: verse.text, payload: verse, timestamp }));
  const passages = packageData.passages.map((passage) => item({ id: passage.content_id, contentType: 'scripture_passage', title: passage.title || passage.element, summary: `${passage.ref} · ${passage.zone}`, payload: passage, timestamp }));
  const references = packageData.reference_index.map((reference) => item({ id: referenceId(reference), contentType: 'scripture_reference', title: reference, summary: 'Local Scripture reference', payload: { reference }, timestamp }));
  const notes = packageData.study_notes.map((note) => item({ id: note.content_id, contentType: 'scripture_note', title: `Study note: ${note.reference}`, summary: note.body, payload: note, timestamp }));
  return [...books, ...chapters, ...verses, ...passages, ...references, ...notes];
}

function relationship(sourceId, targetId, type, payload, timestamp) {
  return {
    id: `scripture.relationship.${slug(sourceId)}.${type}.${slug(targetId)}`,
    source_content_id: sourceId,
    relationship_type: type,
    target_content_id: targetId,
    metadata_json: JSON.stringify(payload || {}),
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  };
}

function scripturePackageToRelationships(packageData, timestamp = new Date().toISOString()) {
  const relationships = [];
  const seen = new Set();
  const add = (sourceId, targetId, type, payload) => {
    const key = `${sourceId}|${type}|${targetId}`;
    if (!seen.has(key)) { seen.add(key); relationships.push(relationship(sourceId, targetId, type, payload, timestamp)); }
  };
  for (const group of packageData.cross_references) {
    for (const target of group.target_references) add(referenceId(group.source_reference), referenceId(target), 'cross_reference', { source_reference: group.source_reference, target_reference: target });
  }
  for (const passage of packageData.passages) {
    for (const target of passage.crossRefs || []) add(passage.content_id, referenceId(target), 'cross_reference', { source_reference: passage.ref, target_reference: target });
  }
  for (const note of packageData.study_notes) add(note.content_id, referenceId(note.reference), 'annotates', { reference: note.reference });
  return relationships;
}

module.exports = { loadScripturePackage, referenceId, scripturePackageToItems, scripturePackageToRelationships };
