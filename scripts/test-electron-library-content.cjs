const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage, libraryPackageToItems, libraryPackageToRelationships } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage } = require('../shared/content/colors/index.cjs');
const { loadSanctuaryPackage } = require('../shared/content/sanctuary/index.cjs');
const { loadLearningPackage } = require('../shared/content/learning/index.cjs');
const { loadExplorerPackage } = require('../shared/content/explorer/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-library-content-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');
const report = { localOnly: true, packageLoaded: false, searchWorks: false, chapterOpens: false, attached: false, sourceIntegration: false, modeIntegration: false, exportRoundTrip: false, noExternalDependency: true };

function registerHandlers(store) {
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('study:add-record', (_event, input) => store.addStudyRecord(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:colors', () => loadColorsPackage());
  ipcMain.handle('content:sanctuary', () => loadSanctuaryPackage());
  ipcMain.handle('content:learning', () => loadLearningPackage());
  ipcMain.handle('content:explorer', () => loadExplorerPackage());
  ipcMain.handle('content:attach-library', (_event, input) => {
    const packageData = loadLibraryPackage();
    return store.attachContentPackage({ studyId: input?.studyId, packageData, items: libraryPackageToItems(packageData), relationships: libraryPackageToRelationships(packageData), sourceName: 'test Digital Library', sourcePath: 'test/library', sourceRevision: 'test', licenseStatus: 'review-required' });
  });
}

async function run() {
  fs.mkdirSync(temporaryRoot, { recursive: true });
  const store = createStore(databasePath);
  registerHandlers(store);
  app.setPath('userData', temporaryRoot);
  app.setPath('cache', path.join(temporaryRoot, 'cache'));
  await app.whenReady();
  const window = new BrowserWindow({ show: false, width: 1280, height: 860, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(root, 'electron', 'preload.cjs') } });
  const externalRequests = [];
  window.webContents.session.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (details, callback) => { externalRequests.push(details.url); callback({ cancel: true }); });
  await window.loadFile(path.join(root, 'ui', 'index.html'));
  const result = await window.webContents.executeJavaScript(`(async () => {
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Electron Digital Library test', description: 'Offline library integration.' });
    await window.sanctuaryDesktop.data.addStudyRecord({ studyId: study.id, section: 'sources', payload: { title: 'The Sanctuary: Center of Christ’s Work', author: 'M. L. Andreasen', source_type: 'Primary text', citation: 'Hebrews 9:23-24', local_path: 'E:\\\\Studies\\\\crosier.pdf', notes: 'Library-linked source.' } });
    await window.sanctuaryDesktop.data.addStudyRecord({ studyId: study.id, section: 'notes', payload: { title: 'Library note', body: 'Compare The Sanctuary: Center of Christ’s Work with Hebrews 9:23-24.' } });
    const packageData = await window.sanctuaryDesktop.data.getLibraryContent();
    await window.refreshFromDesktop();
    document.querySelector('[data-study-id="' + study.id + '"]')?.click();
    document.querySelector('[data-study-section="library"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const search = document.querySelector('#library-search');
    search.value = 'Sanctuary';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 80));
    const searchText = document.querySelector('#record-table-wrap')?.textContent || '';
    const bookButton = Array.from(document.querySelectorAll('[data-library-record-key]')).find((button) => button.textContent.includes('The Sanctuary'));
    bookButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    const bookText = document.querySelector('#record-table-wrap')?.textContent || '';
    const chapterButton = document.querySelector('[data-library-record-key^="library.chapter.crosier."]');
    chapterButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    const chapterText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#library-attach')?.click();
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if ((document.querySelector('#library-attachment-state')?.textContent || '').includes('attached')) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const attachmentText = document.querySelector('#library-attachment-state')?.textContent || '';
    const modeText = {};
    const select = document.querySelector('#workspace-mode');
    for (const mode of ['desk', 'codex', 'atlas', 'folio', 'evidence']) {
      select.value = mode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, mode === 'atlas' ? 1000 : 140));
      modeText[mode] = document.querySelector('#record-table-wrap')?.textContent || '';
    }
    const bundle = await window.sanctuaryDesktop.data.exportBundle();
    return { studyId: study.id, packageData, searchText, bookText, chapterText, attachmentText, modeText, bundle };
  })()`);
  assert.equal(result.packageData.book_count, 5);
  assert.equal(result.packageData.chapter_count, 112);
  assert.equal(result.packageData.excerpt_count, 112);
  assert.equal(result.packageData.scripture_reference_count, 46);
  report.packageLoaded = true;
  report.searchWorks = result.searchText.includes("The Sanctuary: Center of Christ's Work");
  report.chapterOpens = result.bookText.includes('Chapters') && result.chapterText.includes('Chapter 1');
  report.attached = result.attachmentText.includes('attached') && store.listStudyContent({ studyId: result.studyId, contentType: 'library_book' }).length === 5 && store.listStudyContent({ studyId: result.studyId, contentType: 'library_chapter' }).length === 112;
  report.sourceIntegration = result.modeText.codex.includes('Open in Library') && result.modeText.folio.includes('The Sanctuary: Center of Christ’s Work') && result.modeText.desk.includes('Digital Library');
  report.modeIntegration = result.modeText.atlas.includes('Library connections') && result.modeText.evidence.toLowerCase().includes('library');
  report.exportRoundTrip = result.bundle.data.content_items.some((item) => item.content_type === 'library_book') && result.bundle.data.content_relationships.some((relationship) => relationship.relationship_type === 'cites_scripture') && result.bundle.data.study_content_links.length >= 275;
  report.noExternalDependency = externalRequests.length === 0;
  window.close();
  await app.quit();
  report.ok = Object.values(report).every((value) => value === true);
  console.log(JSON.stringify({ ...report, externalRequests }, null, 2));
  return report.ok;
}

run().then((ok) => { process.exitCode = ok ? 0 : 1; }).catch((error) => { report.ok = false; report.error = error.stack || String(error); console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; }).finally(() => { if (fs.existsSync(temporaryRoot)) { try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron may release its profile lock during process shutdown. */ } } });
