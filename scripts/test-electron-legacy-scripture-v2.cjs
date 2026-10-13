const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { loadScripturePackage, getScriptureChapter } = require('../shared/content/scripture/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-legacy-scripture-v2-${process.pid}`);

async function run() {
  fs.mkdirSync(temporaryRoot, { recursive: true });
  const packageData = loadScripturePackage();
  ipcMain.handle('content:scripture', () => packageData);
  ipcMain.handle('content:scripture-chapter', (_event, input) => getScriptureChapter(packageData, input?.book, input?.chapter, input?.verse));
  app.setPath('userData', temporaryRoot);
  app.setPath('cache', path.join(temporaryRoot, 'cache'));
  await app.whenReady();
  const window = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(root, 'electron', 'preload.js') }
  });
  const externalRequests = [];
  window.webContents.session.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (details, callback) => { externalRequests.push(details.url); callback({ cancel: true }); });
  await window.loadFile(path.join(root, 'index.html'));
  const result = await window.webContents.executeJavaScript(`(async () => {
    navigate('bible', { book: '2 Kings', chapter: 1 });
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      title: document.querySelector('#bible-chapter-title')?.textContent || '',
      text: document.querySelector('#bible-text')?.textContent || '',
      verses: document.querySelectorAll('#bible-text .bible-verse').length,
      hasPlaceholder: (document.querySelector('#bible-text')?.textContent || '').includes('Sanctuary-focused chapters have complete KJV text pre-loaded'),
      directVerse: await window.sanctuaryDesktop.data.getScriptureChapter('Genesis', 1, 1)
    };
  })()`);
  assert.equal(result.title, '2 Kings 1 (KJV)');
  assert.ok(result.verses > 0);
  assert.ok(result.text.includes('Now'));
  assert.equal(result.hasPlaceholder, false);
  assert.equal(result.directVerse.verses[0].reference, 'Genesis 1:1');
  assert.equal(externalRequests.length, 0);
  console.log(`Legacy Bible Scripture test passed: ${result.title}, ${result.verses} verses, complete local KJV text.`);
  window.close();
  await app.quit();
}

run().catch((error) => { console.error(error.stack || String(error)); process.exitCode = 1; }).finally(() => {
  if (fs.existsSync(temporaryRoot)) {
    try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron may release its profile lock during shutdown. */ }
  }
});
