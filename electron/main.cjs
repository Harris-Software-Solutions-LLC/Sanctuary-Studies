const path = require('node:path');
const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const { fileURLToPath } = require('node:url');
const { app, BrowserWindow, dialog, ipcMain, session } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage, timelinePackageToItems } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage, scripturePackageToItems, scripturePackageToRelationships } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage, libraryPackageToItems, libraryPackageToRelationships } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage, symbolismPackageToItems, symbolismPackageToRelationships } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage, colorsPackageToItems, colorsPackageToRelationships } = require('../shared/content/colors/index.cjs');

const appRoot = path.resolve(__dirname, '..');
const entrypoint = path.join(appRoot, 'ui', 'index.html');
const legacyEntrypoint = path.join(appRoot, 'index.html');
let store;
let storagePath;
let storagePreferencePath;

function defaultStoragePath() {
  return path.join(app.getPath('userData'), 'sanctuary-studies-data.json');
}

function readPreferredStoragePath() {
  try {
    const preference = JSON.parse(fsSync.readFileSync(storagePreferencePath, 'utf8'));
    if (typeof preference.filePath === 'string' && path.isAbsolute(preference.filePath) && fsSync.existsSync(preference.filePath)) return preference.filePath;
  } catch { /* Missing or invalid preferences fall back to the local Electron data path. */ }
  return defaultStoragePath();
}

function writePreferredStoragePath(filePath) {
  fsSync.mkdirSync(path.dirname(storagePreferencePath), { recursive: true });
  fsSync.writeFileSync(storagePreferencePath, JSON.stringify({ filePath, updated_at: new Date().toISOString() }, null, 2), 'utf8');
}

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
  storagePreferencePath = path.join(app.getPath('userData'), 'storage-preference.json');
  storagePath = readPreferredStoragePath();
  store = createStore(storagePath);
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('data:list-studies', () => store.listStudies());
  ipcMain.handle('data:list-records', (_event, input) => store.listStudyRecords(input));
  ipcMain.handle('data:list-content-items', (_event, input) => store.listContentItems(input));
  ipcMain.handle('data:list-study-content', (_event, input) => store.listStudyContent(input));
  ipcMain.handle('data:storage-info', () => ({ filePath: storagePath, directory: path.dirname(storagePath), defaultPath: defaultStoragePath(), preferred: storagePath !== defaultStoragePath() }));
  ipcMain.handle('data:choose-storage', async () => {
    const result = await dialog.showOpenDialog({ title: 'Choose Sanctuary Studies storage folder', properties: ['openDirectory', 'createDirectory'] });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const targetPath = path.join(result.filePaths[0], 'sanctuary-studies-data.json');
    if (targetPath === storagePath) return { canceled: false, filePath: storagePath, directory: path.dirname(storagePath), preferred: storagePath !== defaultStoragePath() };
    if (fsSync.existsSync(targetPath)) throw new Error(`The selected folder already contains ${path.basename(targetPath)}. Choose an empty folder to avoid overwriting existing study data.`);
    const nextStore = createStore(targetPath);
    nextStore.importBundle(store.exportBundle());
    store = nextStore;
    storagePath = targetPath;
    writePreferredStoragePath(storagePath);
    return { canceled: false, filePath: storagePath, directory: path.dirname(storagePath), preferred: true };
  });
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
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:attach-library', (_event, input) => {
    const packageData = loadLibraryPackage();
    return store.attachContentPackage({
      studyId: input?.studyId,
      packageData,
      items: libraryPackageToItems(packageData),
      relationships: libraryPackageToRelationships(packageData),
      sourceName: 'Sanctuary Studies legacy Digital Library',
      sourcePath: 'app-data.js; app-core.js; app-books.js',
      sourceRevision: packageData.source_revision,
      licenseStatus: packageData.license_status
    });
  });
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:attach-symbolism', (_event, input) => {
    const packageData = loadSymbolismPackage();
    return store.attachContentPackage({
      studyId: input?.studyId,
      packageData,
      items: symbolismPackageToItems(packageData),
      relationships: symbolismPackageToRelationships(packageData),
      sourceName: 'Sanctuary Studies legacy Symbolism data',
      sourcePath: 'app-pages2.js',
      sourceRevision: packageData.source_revision,
      licenseStatus: packageData.license_status
    });
  });
  ipcMain.handle('content:colors', () => loadColorsPackage());
  ipcMain.handle('content:attach-colors', (_event, input) => {
    const packageData = loadColorsPackage();
    return store.attachContentPackage({
      studyId: input?.studyId,
      packageData,
      items: colorsPackageToItems(packageData),
      relationships: colorsPackageToRelationships(packageData),
      sourceName: 'Sanctuary Studies legacy Sacred Colors data',
      sourcePath: 'app-data.js; app-pages2.js',
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
