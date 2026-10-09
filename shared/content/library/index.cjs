const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'library-v1.json');

function loadLibraryPackage() {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function libraryPackageToItems(packageData, timestamp = new Date().toISOString()) {
  const item = ({ id, contentType, title, summary = '', payload }) => ({ id, content_type: contentType, slug: id.replace(/^library\./, ''), title, summary, payload_json: JSON.stringify(payload), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  const books = packageData.books.map((book) => item({ id: book.content_id, contentType: 'library_book', title: book.title, summary: `${book.author} · ${book.publication_year}`, payload: book }));
  const chapters = packageData.chapters.map((chapter) => item({ id: chapter.content_id, contentType: 'library_chapter', title: `${chapter.book_id} · Chapter ${chapter.number}: ${chapter.title}`, summary: chapter.scripture_references.join(', ') || 'No indexed Scripture references', payload: chapter }));
  const excerpts = packageData.excerpts.map((excerpt) => item({ id: excerpt.content_id, contentType: 'library_excerpt', title: excerpt.title, summary: excerpt.excerpt.slice(0, 240), payload: excerpt }));
  const references = packageData.scripture_references.map((reference) => item({ id: reference.id, contentType: 'scripture_reference', title: reference.reference, summary: 'Scripture reference detected in Digital Library content', payload: reference }));
  return [...books, ...chapters, ...excerpts, ...references];
}

function libraryPackageToRelationships(packageData, timestamp = new Date().toISOString()) {
  const relationships = [];
  const relation = (source, type, target, metadata = {}) => ({ id: `library.relationship.${source}.${type}.${target}`, source_content_id: source, relationship_type: type, target_content_id: target, metadata_json: JSON.stringify(metadata), created_at: timestamp, updated_at: timestamp, deleted_at: null });
  for (const chapter of packageData.chapters) {
    relationships.push(relation(chapter.book_content_id, 'contains_chapter', chapter.content_id, { book_id: chapter.book_id, chapter: chapter.number }));
    relationships.push(relation(chapter.content_id, 'contains_excerpt', chapter.excerpt_id, { chapter: chapter.number }));
  }
  for (const excerpt of packageData.excerpts) {
    relationships.push(relation(excerpt.content_id, 'related_source', `library.book.${excerpt.book_id}`, { chapter: excerpt.chapter_number }));
    for (const reference of excerpt.scripture_references) relationships.push(relation(excerpt.content_id, 'cites_scripture', `scripture.reference.${String(reference).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, { reference }));
  }
  return relationships;
}

module.exports = { loadLibraryPackage, libraryPackageToItems, libraryPackageToRelationships };
