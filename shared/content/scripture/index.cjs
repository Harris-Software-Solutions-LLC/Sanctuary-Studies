const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'scripture-v2.json');

function loadScripturePackage() {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function normalizeBookName(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getScriptureChapter(packageData, book, chapter, verse) {
  const requestedBook = normalizeBookName(book);
  const chapterNumber = Number.parseInt(chapter, 10);
  const verseNumber = verse === undefined || verse === null || verse === '' ? null : Number.parseInt(verse, 10);
  const bookRecord = packageData.books.find((entry) => normalizeBookName(entry.name) === requestedBook);
  if (!bookRecord) throw new Error(`Unknown Scripture book: ${book}`);
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > bookRecord.chapter_count) {
    throw new Error(`Invalid chapter for ${bookRecord.name}: ${chapter}`);
  }
  if (verseNumber !== null && (!Number.isInteger(verseNumber) || verseNumber < 1)) {
    throw new Error(`Invalid verse for ${bookRecord.name} ${chapterNumber}: ${verse}`);
  }
  const chapterRecord = packageData.chapters.find((entry) => normalizeBookName(entry.book) === normalizeBookName(bookRecord.name) && entry.chapter === chapterNumber);
  const verses = packageData.verses.filter((entry) => normalizeBookName(entry.book) === normalizeBookName(bookRecord.name) && entry.chapter === chapterNumber);
  if (!chapterRecord || verses.length === 0) throw new Error(`Scripture text is unavailable for ${bookRecord.name} ${chapterNumber}.`);
  const selectedVerses = verseNumber === null ? verses : verses.filter((entry) => entry.verse === verseNumber);
  if (verseNumber !== null && selectedVerses.length === 0) throw new Error(`Invalid verse for ${bookRecord.name} ${chapterNumber}: ${verse}`);
  return {
    book: { id: bookRecord.id, name: bookRecord.name, testament: bookRecord.testament },
    chapter: { id: chapterRecord.id, reference: chapterRecord.reference, chapter_number: chapterNumber, verse_count: chapterRecord.verse_count },
    verses: selectedVerses.map((entry) => ({ id: entry.id, reference: entry.reference, verse_number: entry.verse, text: entry.text })),
    requested_verse: verseNumber
  };
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

function scriptureSelectionIds(packageData, selection) {
  if (!selection?.book) return null;
  const bookName = normalizeBookName(selection.book);
  const chapterNumber = selection.chapter === undefined || selection.chapter === null || selection.chapter === '' ? null : Number.parseInt(selection.chapter, 10);
  const verseNumber = selection.verse === undefined || selection.verse === null || selection.verse === '' ? null : Number.parseInt(selection.verse, 10);
  const book = packageData.books.find((entry) => normalizeBookName(entry.name) === bookName);
  if (!book) throw new Error(`Unknown Scripture book: ${selection.book}`);
  if (chapterNumber !== null && (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > book.chapter_count)) throw new Error(`Invalid chapter for ${book.name}: ${selection.chapter}`);
  if (verseNumber !== null && (!Number.isInteger(verseNumber) || verseNumber < 1)) throw new Error(`Invalid verse for ${book.name} ${chapterNumber}: ${selection.verse}`);
  const ids = new Set([book.id]);
  const chapters = packageData.chapters.filter((entry) => normalizeBookName(entry.book) === bookName && (chapterNumber === null || entry.chapter === chapterNumber));
  if (chapters.length === 0) throw new Error(`Scripture text is unavailable for ${book.name}${chapterNumber === null ? '' : ` ${chapterNumber}`}.`);
  chapters.forEach((entry) => ids.add(entry.id));
  packageData.verses.filter((entry) => normalizeBookName(entry.book) === bookName && (chapterNumber === null || entry.chapter === chapterNumber) && (verseNumber === null || entry.verse === verseNumber)).forEach((entry) => ids.add(entry.id));
  return ids;
}

function scripturePackageToItems(packageData, timestamp = new Date().toISOString(), selection = null) {
  const books = packageData.books.map((book) => item({ id: book.id, contentType: 'scripture_book', title: book.name, summary: `${book.chapter_count} chapters`, payload: book, timestamp }));
  const chapters = packageData.chapters.map((chapter) => item({ id: chapter.id, contentType: 'scripture_chapter', title: chapter.reference, summary: `${chapter.verse_count} KJV verses`, payload: chapter, timestamp }));
  const verses = packageData.verses.map((verse) => item({ id: verse.id, contentType: 'scripture_verse', title: verse.reference, summary: verse.text, payload: verse, timestamp }));
  const passages = packageData.passages.map((passage) => item({ id: passage.content_id, contentType: 'scripture_passage', title: passage.title || passage.element, summary: `${passage.ref} · ${passage.zone}`, payload: passage, timestamp }));
  const references = packageData.reference_index.map((reference) => item({ id: referenceId(reference), contentType: 'scripture_reference', title: reference, summary: 'Local Scripture reference', payload: { reference }, timestamp }));
  const notes = packageData.study_notes.map((note) => item({ id: note.content_id, contentType: 'scripture_note', title: `Study note: ${note.reference}`, summary: note.body, payload: note, timestamp }));
  const allItems = [...books, ...chapters, ...verses, ...passages, ...references, ...notes];
  const selectedIds = scriptureSelectionIds(packageData, selection);
  return selectedIds ? allItems.filter((entry) => selectedIds.has(entry.id)) : allItems;
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

function scripturePackageToRelationships(packageData, timestamp = new Date().toISOString(), selection = null) {
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
  const selectedIds = scriptureSelectionIds(packageData, selection);
  return selectedIds ? relationships.filter((entry) => selectedIds.has(entry.source_content_id) && selectedIds.has(entry.target_content_id)) : relationships;
}

module.exports = { loadScripturePackage, getScriptureChapter, referenceId, scripturePackageToItems, scripturePackageToRelationships, scriptureSelectionIds };
