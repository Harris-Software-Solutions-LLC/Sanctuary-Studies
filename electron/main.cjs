const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { app, BrowserWindow, session } = require('electron');

const appRoot = path.resolve(__dirname, '..');
const entrypoint = path.join(appRoot, 'index.html');

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
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
