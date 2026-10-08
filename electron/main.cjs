const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { createStore } = require('../shared/store.cjs');

const appRoot = path.resolve(__dirname, '..');
const entrypoint = path.join(appRoot, 'ui', 'index.html');
let store;

function isAppFile(url) {
  if (!url.startsWith('file://')) return false;
  return fileURLToPath(new URL(url)) === entrypoint;
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

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (!isAppFile(url)) event.preventDefault();
  });
  window.loadFile(entrypoint);

  if (process.env.SANCTUARY_DEVTOOLS === '1') window.webContents.openDevTools();
}

app.whenReady().then(() => {
  store = createStore(path.join(app.getPath('userData'), 'sanctuary-studies-data.json'));
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('study:add-record', (_event, input) => store.addStudyRecord(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
