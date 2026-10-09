const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage } = require('../shared/content/colors/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-study-lifecycle-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');

async function run() {
  try {
  fs.mkdirSync(temporaryRoot, { recursive: true });
  const store = createStore(databasePath);
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('study:update', (_event, input) => store.updateStudy(input));
  ipcMain.handle('study:delete', (_event, input) => store.deleteStudy(input));
  ipcMain.handle('data:storage-info', () => ({ filePath: databasePath, directory: temporaryRoot, defaultPath: databasePath, preferred: false }));
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:colors', () => loadColorsPackage());
  app.setPath('userData', temporaryRoot);
  app.setPath('cache', path.join(temporaryRoot, 'cache'));
  await app.whenReady();
  const window = new BrowserWindow({ show: false, width: 1200, height: 800, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(root, 'electron', 'preload.cjs') } });
  const externalRequests = [];
  window.webContents.session.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (details, callback) => { externalRequests.push(details.url); callback({ cancel: true }); });
  await window.loadFile(path.join(root, 'ui', 'index.html'));
  const result = await window.webContents.executeJavaScript(`(async () => {
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Lifecycle test' });
    await window.refreshFromDesktop();
    document.querySelector('[data-study-id="' + study.id + '"]')?.click();
    document.querySelector('#archive-study')?.click();
    for (let attempt = 0; attempt < 40; attempt += 1) { if ((document.querySelector('#archive-study')?.textContent || '') === 'Restore study') break; await new Promise((resolve) => setTimeout(resolve, 100)); }
    const archivedButton = document.querySelector('#archive-study')?.textContent || '';
    const storage = await window.sanctuaryDesktop.data.getStorageInfo();
    await window.sanctuaryDesktop.data.deleteStudy({ id: study.id });
    await window.refreshFromDesktop();
    return { archivedButton, storage, visibleAfterDelete: document.querySelector('[data-study-id="' + study.id + '"]') !== null };
  })()`);
  assert.equal(result.archivedButton, 'Restore study');
  assert.equal(result.storage.directory, temporaryRoot);
  assert.equal(result.visibleAfterDelete, false);
  assert.equal(store.listStudies().some((study) => study.title === 'Lifecycle test'), false);
  assert.equal(externalRequests.length, 0);
  window.close();
  await app.quit();
  console.log('Electron study lifecycle tests passed: archive, restore control, soft delete, and storage info');
  }
  catch (error) {
  console.error(error.stack || error);
  process.exitCode = 1;
} finally {
  if (fs.existsSync(temporaryRoot)) { try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron may release its profile lock during shutdown. */ } }
}

}

run();
