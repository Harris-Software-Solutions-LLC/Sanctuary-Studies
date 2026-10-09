const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const childProcess = require('node:child_process');

const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'shared', 'content', 'library', 'library-v1.json');
const source = `${fs.readFileSync(path.join(root, 'app-data.js'), 'utf8')}\n${fs.readFileSync(path.join(root, 'app-books.js'), 'utf8')}`;
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__legacyLibrary = { LIBRARY_BOOKS, BOOK_CONTENT };`, context, { filename: 'legacy-library' });

const legacy = context.__legacyLibrary;
const scripturePackage = JSON.parse(fs.readFileSync(path.join(root, 'shared', 'content', 'scripture', 'scripture-v1.json'), 'utf8'));
const sourceRevision = childProcess.execFileSync('git', ['-c', 'safe.directory=E:/Sanctuary Studies', 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stripHtml = (value) => String(value || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/\s+/g, ' ').trim();
const scriptureReferenceId = (reference) => `scripture.reference.${slug(reference)}`;
const referenceMatches = (text) => scripturePackage.reference_index.filter((reference) => String(text).toLowerCase().includes(String(reference).toLowerCase())).sort((left, right) => right.length - left.length);

const books = legacy.LIBRARY_BOOKS.map((book) => {
  const content = legacy.BOOK_CONTENT[book.id] || { toc: [], chapters: [] };
  return {
    content_id: `library.book.${book.id}`,
    id: book.id,
    title: book.title,
    author: book.author,
    publication_year: book.year,
    accent_color: book.color,
    accent_color_light: book.colorLight,
    chapter_count: book.chapters,
    scripture_count: book.scriptures,
    description: book.desc,
    tags: book.tags,
    special: book.special,
    legacy_page: book.page,
    table_of_contents: content.toc || [],
    local_path: null
  };
});

const chapters = [];
const excerpts = [];
for (const book of books) {
  const content = legacy.BOOK_CONTENT[book.id] || { chapters: [] };
  for (const chapter of content.chapters || []) {
    const chapterId = `library.chapter.${book.id}.${chapter.num}`;
    const excerptId = `library.excerpt.${book.id}.${chapter.num}`;
    const excerptText = stripHtml(chapter.content);
    const scriptureReferences = referenceMatches(`${chapter.title} ${excerptText}`);
    chapters.push({ content_id: chapterId, book_id: book.id, book_content_id: book.content_id, number: chapter.num, title: chapter.title, excerpt_id: excerptId, scripture_references: scriptureReferences });
    excerpts.push({ content_id: excerptId, chapter_id: chapterId, book_id: book.id, chapter_number: chapter.num, title: chapter.title, excerpt: excerptText, excerpt_html: chapter.content, scripture_references: scriptureReferences });
  }
}

const scriptureReferences = [...new Set(excerpts.flatMap((excerpt) => excerpt.scripture_references))].sort((left, right) => left.localeCompare(right)).map((reference) => ({ id: scriptureReferenceId(reference), reference }));
const packageData = {
  format: 'sanctuary-studies-content',
  content_type: 'library',
  content_version: 1,
  title: 'Sanctuary Studies Digital Library',
  source_files: ['app-data.js', 'app-core.js', 'app-books.js'],
  source_revision: sourceRevision,
  license_status: 'review-required',
  offline_only: true,
  book_count: books.length,
  chapter_count: chapters.length,
  excerpt_count: excerpts.length,
  scripture_reference_count: scriptureReferences.length,
  books,
  chapters,
  excerpts,
  scripture_references: scriptureReferences
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(packageData, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
console.log(JSON.stringify({ books: books.length, chapters: chapters.length, excerpts: excerpts.length, scriptureReferences: scriptureReferences.length }, null, 2));
