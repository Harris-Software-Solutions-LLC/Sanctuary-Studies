const path = require('node:path');
const fs = require('node:fs/promises');
const { fileURLToPath } = require('node:url');
const { app, BrowserWindow, dialog, ipcMain, session } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage, timelinePackageToItems } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage, scripturePackageToItems, scripturePackageToRelationships } = require('../shared/content/scripture/index.cjs');

const appRoot = path.resolve(__dirname, '..');
const entrypoint = path.join(appRoot, 'ui', 'index.html');
const legacyEntrypoint = path.join(appRoot, 'index.html');
let store;

function isAppFile(url, allowedEntrypoint = entrypoint) {
  if (!url.startsWith('file://')) return false;
  try {
    return fileURLToPath(new URL(url)) === allowedEntrypoint;
  } catch {
    return false;
  }
}

function configureWindow(window, allowedEntrypoint) {
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (!isAppFile(url, allowedEntrypoint)) event.preventDefault();
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#f5f0e8',
    title: 'Sanctuary Studies',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  configureWindow(window, entrypoint);
  window.loadFile(entrypoint);

  if (process.env.SANCTUARY_DEVTOOLS === '1') window.webContents.openDevTools();
}

function createLegacyWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#f5f0e8',
    title: 'Sanctuary Studies — Existing Study Workspace',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  configureWindow(window, legacyEntrypoint);
  window.loadFile(legacyEntrypoint);
  return window;
}

app.whenReady().then(() => {
  store = createStore(path.join(app.getPath('userData'), 'sanctuary-studies-data.json'));
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('data:list-studies', () => store.listStudies());
  ipcMain.handle('data:list-records', (_event, input) => store.listStudyRecords(input));
  ipcMain.handle('data:list-content-items', (_event, input) => store.listContentItems(input));
  ipcMain.handle('data:list-study-content', (_event, input) => store.listStudyContent(input));
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:attach-timeline', (_event, input) => {
    const packageData = loadTimelinePackage();
    return store.attachContentPackage({
      studyId: input?.studyId,
      packageData,
      items: timelinePackageToItems(packageData),
      sourceName: 'project-bolt-sb1-3nfg6yvm.zip',
      sourcePath: 'project/src/components/TimelinePage.tsx; project/src/data/timelineQuestions.ts',
      sourceRevision: 'timeline-v1-normalized-24-step',
      licenseStatus: 'review-required'
    });
  });
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:attach-scripture', (_event, input) => {
    const packageData = loadScripturePackage();
    return store.attachContentPackage({
      studyId: input?.studyId,
      packageData,
      items: scripturePackageToItems(packageData),
      relationships: scripturePackageToRelationships(packageData),
      sourceName: 'Sanctuary Studies legacy Scripture data',
      sourcePath: 'app-data.js; app-pages1.js',
      sourceRevision: packageData.source_revision,
      licenseStatus: packageData.license_status
    });
  });
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('study:update', (_event, input) => store.updateStudy(input));
  ipcMain.handle('study:delete', (_event, input) => store.deleteStudy(input));
  ipcMain.handle('study:add-record', (_event, input) => store.addStudyRecord(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());
  ipcMain.handle('data:export-file', async () => {
    const result = await dialog.showSaveDialog({
      title: 'Export Sanctuary Studies bundle',
      filters: [{ name: 'Sanctuary Studies bundle', extensions: ['ssbundle'] }, { name: 'JSON', extensions: ['json'] }],
      properties: ['createDirectory', 'showOverwriteConfirmation']
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    const bundle = store.exportBundle();
    await fs.writeFile(result.filePath, JSON.stringify(bundle, null, 2), 'utf8');
    return { canceled: false, path: result.filePath };
  });
  ipcMain.handle('data:import-file', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Import Sanctuary Studies bundle',
      filters: [{ name: 'Sanctuary Studies bundle', extensions: ['ssbundle', 'json'] }],
      properties: ['openFile']
    });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const bundle = JSON.parse(await fs.readFile(result.filePaths[0], 'utf8'));
    const database = store.importBundle(bundle);
    return { canceled: false, path: result.filePaths[0], database };
  });
  ipcMain.handle('ui:open-legacy', () => {
    createLegacyWindow();
    return true;
  });

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
