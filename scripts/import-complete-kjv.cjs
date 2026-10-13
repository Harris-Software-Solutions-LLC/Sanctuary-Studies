const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'shared', 'content', 'scripture', 'sources', 'kjv-gutenberg-7999.txt');
const basePath = path.join(root, 'shared', 'content', 'scripture', 'scripture-v1.json');
const outputPath = path.join(root, 'shared', 'content', 'scripture', 'scripture-v2.json');

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const sourceText = fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, '');
const sourceRevision = crypto.createHash('sha256').update(sourceText, 'utf8').digest('hex');
const editionText = sourceText.split('*** END OF THE PROJECT GUTENBERG EBOOK')[0];
const expectedBooks = base.books.map((book) => book.name);
const apocryphaNames = new Set(['Tobit', 'Judith', 'Additions to Esther', 'Wisdom of Solomon', 'Ecclesiasticus', 'Baruch', 'Letter of Jeremiah', 'Prayer of Azariah', 'Susanna', 'Bel and the Dragon', '1 Maccabees', '2 Maccabees']);
const books = new Map();
const verses = [];
let currentBook = null;
let currentVerse = null;

function flushVerse() {
  if (!currentVerse) return;
  const text = currentVerse.lines.join(' ').replace(/\s+/g, ' ').trim();
  verses.push({
    id: `scripture.verse.${currentVerse.book.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${currentVerse.chapter}.${currentVerse.verse}`,
    book: currentVerse.book,
    chapter: currentVerse.chapter,
    verse: currentVerse.verse,
    reference: `${currentVerse.book} ${currentVerse.chapter}:${currentVerse.verse}`,
    text
  });
  currentVerse = null;
}

for (const rawLine of editionText.split(/\r?\n/)) {
  const line = rawLine.trim();
  const bookMatch = /(?:^|\b)BOOK\s+(\d{2})\s+(.+)$/i.exec(line);
  if (bookMatch) {
    flushVerse();
    const number = Number(bookMatch[1]);
    const name = bookMatch[2].trim().replace(/\s+/g, ' ').replace(/^[^A-Z0-9]+/i, '');
    if (number < 1 || number > 66 || apocryphaNames.has(name)) throw new Error(`Unexpected non-66-book entry: ${number} ${name}`);
    if (books.has(number)) throw new Error(`Duplicate book number: ${number}`);
    books.set(number, name);
    currentBook = { number, name };
    continue;
  }
  const verseMatch = /^(\d{2}|0\$):(\d{3}):(\d{3})\s+(.+)$/.exec(line);
  if (verseMatch) {
    flushVerse();
    const bookNumber = verseMatch[1] === '0$' ? currentBook?.number : Number(verseMatch[1]);
    if (!currentBook || bookNumber !== currentBook.number) throw new Error(`Verse outside its declared book: ${line}`);
    currentVerse = { book: currentBook.name, chapter: Number(verseMatch[2]), verse: Number(verseMatch[3]), lines: [verseMatch[4]] };
    continue;
  }
  if (currentVerse && line) currentVerse.lines.push(line);
}
flushVerse();

if (books.size !== 66) throw new Error(`Expected 66 books, found ${books.size}`);
const parsedBooks = [...books.entries()].sort((left, right) => left[0] - right[0]).map(([, name]) => name);
if (JSON.stringify(parsedBooks) !== JSON.stringify(expectedBooks)) throw new Error('Source book order/names do not match the existing 66-book KJV index.');
if (verses.length !== 31102) throw new Error(`Expected 31,102 KJV verse records after source normalization, found ${verses.length}`);

const versesByChapter = new Map();
for (const verse of verses) {
  const key = `${verse.book}|${verse.chapter}`;
  const list = versesByChapter.get(key) || [];
  list.push(verse);
  versesByChapter.set(key, list);
}

const chapters = base.chapters.map((chapter) => {
  const verseList = versesByChapter.get(`${chapter.book}|${chapter.chapter}`) || [];
  return { ...chapter, verse_count: verseList.length, complete_text_available: true, text_source: 'Project Gutenberg eBook 7999, Books 1–66' };
});
if (chapters.some((chapter) => chapter.verse_count === 0)) throw new Error('One or more indexed chapters received no KJV verses.');
if (chapters.some((chapter) => chapter.verse_count !== versesByChapter.get(`${chapter.book}|${chapter.chapter}`).length)) throw new Error('Chapter verse counts do not match imported verse records.');

const output = {
  ...base,
  content_version: 2,
  title: 'Complete 66-Book KJV Scripture and Sanctuary References',
  source_files: [...base.source_files, 'sources/kjv-gutenberg-7999.txt'],
  source_revision: `gutenberg-7999-sha256-${sourceRevision}`,
  license_status: 'public-domain-source',
  apocrypha_included: false,
  source_citation: 'Project Gutenberg eBook 7999, The Bible, King James Version, Complete Contents, Books 1–66',
  source_url: 'https://www.gutenberg.org/cache/epub/7999/pg7999.txt',
  book_count: books.size,
  chapter_count: chapters.length,
  verse_count: verses.length,
  complete_verse_count: verses.length,
  books: base.books,
  chapters,
  verses
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputPath, sourceRevision, bookCount: books.size, chapterCount: chapters.length, verseCount: verses.length, apocryphaIncluded: false }, null, 2));
