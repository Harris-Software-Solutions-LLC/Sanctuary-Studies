const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage, scripturePackageToItems, scripturePackageToRelationships } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage } = require('../shared/content/colors/index.cjs');
const { loadSanctuaryPackage } = require('../shared/content/sanctuary/index.cjs');
const { loadLearningPackage } = require('../shared/content/learning/index.cjs');
const { loadExplorerPackage } = require('../shared/content/explorer/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-scripture-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');
const report = { localOnly: true, packageLoaded: false, searchWorks: false, crossReferenceOpens: false, attached: false, notesAndSourcesDetected: false, modeIntegration: false, exportRoundTrip: false, noExternalDependency: true };

function registerHandlers(store) {
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('study:add-record', (_event, input) => store.addStudyRecord(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:colors', () => loadColorsPackage());
  ipcMain.handle('content:sanctuary', () => loadSanctuaryPackage());
  ipcMain.handle('content:learning', () => loadLearningPackage());
  ipcMain.handle('content:explorer', () => loadExplorerPackage());
  ipcMain.handle('content:attach-scripture', (_event, input) => {
    const packageData = loadScripturePackage();
    return store.attachContentPackage({ studyId: input?.studyId, packageData, items: scripturePackageToItems(packageData), relationships: scripturePackageToRelationships(packageData), sourceName: 'test Scripture', sourcePath: 'test/scripture', sourceRevision: 'test', licenseStatus: 'review-required' });
  });
}

async function run() {
  fs.mkdirSync(temporaryRoot, { recursive: true });
  const store = createStore(databasePath);
  registerHandlers(store);
  app.setPath('userData', temporaryRoot);
  app.setPath('cache', path.join(temporaryRoot, 'cache'));
  await app.whenReady();
  const window = new BrowserWindow({ show: false, width: 1200, height: 800, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(root, 'electron', 'preload.cjs') } });
  const externalRequests = [];
  window.webContents.session.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (details, callback) => { externalRequests.push(details.url); callback({ cancel: true }); });
  await window.loadFile(path.join(root, 'ui', 'index.html'));
  const result = await window.webContents.executeJavaScript(`(async () => {
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Electron Scripture test', description: 'Offline Scripture integration.' });
    await window.sanctuaryDesktop.data.addStudyRecord({ studyId: study.id, section: 'notes', payload: { title: 'Cross-reference note', body: 'Compare Hebrews 9:23-24 with Revelation 11:19.' } });
    await window.sanctuaryDesktop.data.addStudyRecord({ studyId: study.id, section: 'sources', payload: { title: 'Hebrews study source', citation: 'Hebrews 9:23-24', notes: 'Local citation.' } });
    const packageData = await window.sanctuaryDesktop.data.getScriptureContent();
    await window.refreshFromDesktop();
    const row = document.querySelector('[data-study-id="' + study.id + '"]');
    row?.click();
    document.querySelector('[data-study-section="scripture"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const search = document.querySelector('#scripture-search');
    search.value = 'Hebrews 9:23-24';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    const searchText = document.querySelector('#record-table-wrap')?.textContent || '';
    const resultButton = Array.from(document.querySelectorAll('[data-scripture-record-key]')).find((button) => button.textContent.includes('Hebrews 9:23-24'));
    resultButton?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const detailText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#scripture-attach')?.click();
    for (let attempt = 0; attempt < 30; attempt += 1) {
      if ((document.querySelector('#scripture-attachment-state')?.textContent || '').includes('attached')) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const attachmentText = document.querySelector('#scripture-attachment-state')?.textContent || '';
    const modeText = {};
    const select = document.querySelector('#workspace-mode');
    for (const mode of ['desk', 'codex', 'atlas', 'folio', 'evidence']) {
      select.value = mode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, mode === 'atlas' ? 1000 : 120));
      modeText[mode] = document.querySelector('#record-table-wrap')?.textContent || '';
    }
    const bundle = await window.sanctuaryDesktop.data.exportBundle();
    return { packageData, searchText, detailText, attachmentText, modeText, bundle, studyId: study.id };
  })()`);
  const packageData = result.packageData;
  report.packageLoaded = packageData.book_count === 66 && packageData.chapter_count === 1189 && packageData.passage_count === 8 && packageData.reference_index.includes('Hebrews 9:23-24');
  report.searchWorks = result.searchText.includes('Hebrews 9:23-24');
  report.crossReferenceOpens = result.detailText.includes('Hebrews 9:23-24');
  report.attached = result.attachmentText.includes('attached') && store.listStudyContent({ studyId: result.studyId, contentType: 'scripture_passage' }).length === 8;
  report.notesAndSourcesDetected = result.modeText.folio.includes('Hebrews 9:23-24') && result.modeText.desk.includes('Scripture links');
  report.modeIntegration = result.modeText.codex.includes('Scripture index') && result.modeText.atlas.includes('Scripture connections') && result.modeText.evidence.includes('scripture');
  report.exportRoundTrip = result.bundle.data.content_items.some((item) => item.content_type === 'scripture_passage') && result.bundle.data.content_relationships.some((relation) => relation.relationship_type === 'cross_reference') && result.bundle.data.study_content_links.length > 0;
  report.noExternalDependency = externalRequests.length === 0;
  window.close();
  await app.quit();
  report.ok = Object.values(report).every((value) => value === true);
  console.log(JSON.stringify({ ...report, externalRequests }, null, 2));
  return report.ok;
}

run().then((ok) => { process.exitCode = ok ? 0 : 1; }).catch((error) => { report.ok = false; report.error = error.stack || String(error); console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; }).finally(() => { if (fs.existsSync(temporaryRoot)) { try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron may release its profile lock during process shutdown. */ } } });
