const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const childProcess = require('node:child_process');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'app-data.js');
const outputPath = path.join(root, 'shared', 'content', 'scripture', 'scripture-v1.json');
const source = fs.readFileSync(sourcePath, 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__legacyScripture = { KJV_BOOKS, KJV_CHAPTERS, KJV_VERSES, CROSS_REFS, STUDY_NOTES, SCRIPTURE_PASSAGES };`, context, { filename: sourcePath });

const legacy = context.__legacyScripture;
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sourceRevision = childProcess.execFileSync('git', ['-c', 'safe.directory=E:/Sanctuary Studies', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();

const books = legacy.KJV_BOOKS.map((name) => ({
  id: `scripture.book.${slug(name)}`,
  name,
  chapter_count: legacy.KJV_CHAPTERS[name]
}));

const chapters = Object.entries(legacy.KJV_CHAPTERS).flatMap(([book, chapterCount]) => Array.from({ length: chapterCount }, (_value, index) => {
  const chapter = index + 1;
  const verses = legacy.KJV_VERSES[book]?.[chapter] || [];
  return {
    id: `scripture.chapter.${slug(book)}.${chapter}`,
    book,
    chapter,
    reference: `${book} ${chapter}`,
    verse_count: verses.length,
    complete_text_available: verses.length > 0
  };
}));

const verses = Object.entries(legacy.KJV_VERSES).flatMap(([book, chapterMap]) => Object.entries(chapterMap).flatMap(([chapter, verseList]) => verseList.map((verse) => ({
  id: `scripture.verse.${slug(book)}.${chapter}.${verse.v}`,
  book,
  chapter: Number(chapter),
  verse: verse.v,
  reference: `${book} ${chapter}:${verse.v}`,
  text: verse.t
}))));

const passages = legacy.SCRIPTURE_PASSAGES.map((passage) => ({ ...passage, content_id: `scripture.passage.${passage.id}` }));
const crossReferences = Object.entries(legacy.CROSS_REFS).map(([sourceReference, targetReferences]) => ({ source_reference: sourceReference, target_references: targetReferences }));
const studyNotes = Object.entries(legacy.STUDY_NOTES).map(([reference, body]) => ({ content_id: `scripture.note.${slug(reference)}`, reference, body }));
const referenceIndex = [...new Set([
  ...passages.flatMap((passage) => [passage.ref, ...(passage.crossRefs || [])]),
  ...crossReferences.flatMap((group) => [group.source_reference, ...group.target_references]),
  ...verses.map((verse) => verse.reference),
  ...studyNotes.map((note) => note.reference)
].filter(Boolean))].sort((left, right) => left.localeCompare(right));

const packageData = {
  format: 'sanctuary-studies-content',
  content_type: 'scripture',
  content_version: 1,
  title: 'KJV Scripture and Sanctuary References',
  translation: 'King James Version',
  source_files: ['app-data.js', 'app-pages1.js'],
  source_revision: sourceRevision,
  license_status: 'review-required',
  offline_only: true,
  book_count: books.length,
  chapter_count: chapters.length,
  verse_count: verses.length,
  passage_count: passages.length,
  cross_reference_group_count: crossReferences.length,
  study_note_count: studyNotes.length,
  books,
  chapters,
  verses,
  passages,
  reference_index: referenceIndex,
  cross_references: crossReferences,
  study_notes: studyNotes
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(packageData, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
console.log(JSON.stringify({ books: books.length, chapters: chapters.length, verses: verses.length, passages: passages.length, crossReferenceGroups: crossReferences.length, studyNotes: studyNotes.length, references: referenceIndex.length }, null, 2));
