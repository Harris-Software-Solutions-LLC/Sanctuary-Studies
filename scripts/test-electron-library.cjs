const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage, timelinePackageToItems } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage } = require('../shared/content/colors/index.cjs');
const { loadSanctuaryPackage } = require('../shared/content/sanctuary/index.cjs');
const { loadLearningPackage } = require('../shared/content/learning/index.cjs');
const { loadExplorerPackage } = require('../shared/content/explorer/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-library-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');
const report = { localOnly: true, created: false, persisted: false, recordPersisted: false, workspaceModes: false, modePreference: false, timelineLoaded: false, timelineAttached: false, timelineSteps: 0, noExternalDependency: true };

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
  ipcMain.handle('content:attach-timeline', (_event, input) => {
    const packageData = loadTimelinePackage();
    return store.attachContentPackage({ studyId: input?.studyId, packageData, items: timelinePackageToItems(packageData), sourceName: 'test timeline', sourcePath: 'test/timeline', sourceRevision: 'test' });
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
  const createdResult = await window.webContents.executeJavaScript(`(async () => {
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Electron library test', description: 'Persisted through the local IPC bridge.' });
    await window.sanctuaryDesktop.data.addStudyRecord({ studyId: study.id, section: 'notes', payload: { title: 'Electron note', body: 'Saved locally.' } });
    const timeline = await window.sanctuaryDesktop.data.getTimelineContent();
    const attachment = await window.sanctuaryDesktop.data.attachTimeline({ studyId: study.id });
    await window.refreshFromDesktop();
    const row = document.querySelector('[data-study-id="' + study.id + '"]');
    row?.click();
    const select = document.querySelector('#workspace-mode');
    const modeText = {};
    for (const mode of ['desk', 'codex', 'atlas', 'folio', 'evidence']) {
      select.value = mode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, mode === 'atlas' ? 150 : 20));
      modeText[mode] = document.querySelector('#record-table-wrap')?.textContent || '';
    }
    return { studyId: study.id, timeline, attachment, modeText };
  })()`);
  await new Promise((resolve) => { window.webContents.once('did-finish-load', resolve); window.reload(); });
  await window.webContents.executeJavaScript(`new Promise((resolve) => { const started = Date.now(); const check = () => { if ((document.querySelector('#study-table')?.textContent || '').includes('Electron library test') || Date.now() - started > 5000) resolve(true); else setTimeout(check, 50); }; check(); })`);
  const result = await window.webContents.executeJavaScript(`({ tableText: document.querySelector('#study-table')?.textContent || '', detailText: document.querySelector('#study-detail-view')?.textContent || '', modeValue: document.querySelector('#workspace-mode')?.value || '' })`);
  report.tableText = result.tableText;
  report.detailText = result.detailText;
  report.created = result.tableText.includes('Electron library test');
  report.persisted = store.listStudies().some((study) => study.id === createdResult.studyId);
  report.recordPersisted = store.listStudyRecords({ studyId: createdResult.studyId, section: 'notes' }).some((note) => note.title === 'Electron note');
  report.workspaceModes = createdResult.modeText.desk.includes('Scholar’s Desk') && createdResult.modeText.codex.includes('Codex Cabinet') && createdResult.modeText.atlas.includes('24 numbered steps') && createdResult.modeText.folio.includes('Research Folio') && createdResult.modeText.evidence.includes('Evidence Wall');
  report.modePreference = result.modeValue === 'evidence';
  report.timelineLoaded = createdResult.timeline.step_count === 24 && createdResult.timeline.question_count === 189;
  report.timelineAttached = createdResult.attachment.links === 214;
  report.timelineSteps = store.listStudyContent({ studyId: createdResult.studyId, contentType: 'timeline_step' }).length;
  report.noExternalDependency = externalRequests.length === 0;
  window.close();
  await app.quit();
  report.ok = report.created && report.persisted && report.recordPersisted && report.workspaceModes && report.modePreference && report.timelineLoaded && report.timelineAttached && report.timelineSteps === 24 && report.noExternalDependency;
  console.log(JSON.stringify({ ...report, externalRequests }, null, 2));
  return report.ok;
}

run().then((ok) => { process.exitCode = ok ? 0 : 1; }).catch((error) => { report.ok = false; report.error = error.stack || String(error); console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; });
