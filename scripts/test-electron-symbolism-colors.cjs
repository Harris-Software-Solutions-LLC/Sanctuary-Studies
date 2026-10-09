const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage, symbolismPackageToItems, symbolismPackageToRelationships } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage, colorsPackageToItems, colorsPackageToRelationships } = require('../shared/content/colors/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-symbolism-colors-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');
const report = { localOnly: true, packagesLoaded: false, symbolismSearch: false, colorSearch: false, attached: false, modeIntegration: false, exportRoundTrip: false, noExternalDependency: true };

function registerHandlers(store) {
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:colors', () => loadColorsPackage());
  ipcMain.handle('content:attach-symbolism', (_event, input) => { const packageData = loadSymbolismPackage(); return store.attachContentPackage({ studyId: input?.studyId, packageData, items: symbolismPackageToItems(packageData), relationships: symbolismPackageToRelationships(packageData), sourceName: 'test Symbolism', sourcePath: 'test/symbolism', sourceRevision: 'test', licenseStatus: 'review-required' }); });
  ipcMain.handle('content:attach-colors', (_event, input) => { const packageData = loadColorsPackage(); return store.attachContentPackage({ studyId: input?.studyId, packageData, items: colorsPackageToItems(packageData), relationships: colorsPackageToRelationships(packageData), sourceName: 'test Sacred Colors', sourcePath: 'test/colors', sourceRevision: 'test', licenseStatus: 'review-required' }); });
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
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Electron Symbolism and Colors test', description: 'Offline symbolism integration.' });
    await window.refreshFromDesktop();
    document.querySelector('[data-study-id="' + study.id + '"]')?.click();
    document.querySelector('[data-study-section="symbolism"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const symbolismSearch = document.querySelector('#symbolism-search');
    symbolismSearch.value = 'Brazen Altar';
    symbolismSearch.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 80));
    const symbolismText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#symbolism-attach')?.click();
    for (let attempt = 0; attempt < 40; attempt += 1) { if ((document.querySelector('#symbolism-attachment-state')?.textContent || '').includes('attached')) break; await new Promise((resolve) => setTimeout(resolve, 100)); }
    const symbolismAttached = document.querySelector('#symbolism-attachment-state')?.textContent || '';
    document.querySelector('[data-study-section="colors"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const colorsSearch = document.querySelector('#colors-search');
    colorsSearch.value = 'Blue';
    colorsSearch.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 80));
    const colorsText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#colors-attach')?.click();
    for (let attempt = 0; attempt < 40; attempt += 1) { if ((document.querySelector('#colors-attachment-state')?.textContent || '').includes('attached')) break; await new Promise((resolve) => setTimeout(resolve, 100)); }
    const colorsAttached = document.querySelector('#colors-attachment-state')?.textContent || '';
    const modeText = {};
    const select = document.querySelector('#workspace-mode');
    for (const mode of ['desk', 'codex', 'atlas', 'folio', 'evidence']) { select.value = mode; select.dispatchEvent(new Event('change', { bubbles: true })); await new Promise((resolve) => setTimeout(resolve, mode === 'atlas' ? 900 : 120)); modeText[mode] = document.querySelector('#record-table-wrap')?.textContent || ''; }
    const bundle = await window.sanctuaryDesktop.data.exportBundle();
    return { studyId: study.id, symbolismText, colorsText, symbolismAttached, colorsAttached, modeText, bundle };
  })()`);
  const symbolism = loadSymbolismPackage();
  const colors = loadColorsPackage();
  report.packagesLoaded = symbolism.record_count === 16 && colors.record_count === 8 && symbolism.scripture_reference_count === 55;
  report.symbolismSearch = result.symbolismText.includes('Brazen Altar') && result.symbolismText.includes('Type and antitype');
  report.colorSearch = result.colorsText.includes('Blue') && result.colorsText.includes('Sanctuary use');
  report.attached = result.symbolismAttached.includes('attached') && result.colorsAttached.includes('attached') && store.listStudyContent({ studyId: result.studyId, contentType: 'symbolism_furnishings' }).length === 7 && store.listStudyContent({ studyId: result.studyId, contentType: 'sacred_color' }).length === 8;
  report.modeIntegration = result.modeText.desk.includes('Sanctuary typology') && result.modeText.codex.includes('Material language') && result.modeText.folio.includes('Symbolism and colors') && result.modeText.evidence.toLowerCase().includes('sacred color') && result.modeText.evidence.toLowerCase().includes('symbolism');
  report.exportRoundTrip = result.bundle.data.content_items.some((item) => item.content_type === 'symbolism_furnishings') && result.bundle.data.content_items.some((item) => item.content_type === 'sacred_color') && result.bundle.data.content_relationships.some((relationship) => relationship.relationship_type === 'cites_scripture');
  report.noExternalDependency = externalRequests.length === 0;
  window.close();
  await app.quit();
  report.ok = Object.values(report).every((value) => value === true);
  console.log(JSON.stringify({ ...report, externalRequests }, null, 2));
  return report.ok;
}

run().then((ok) => { process.exitCode = ok ? 0 : 1; }).catch((error) => { report.ok = false; report.error = error.stack || String(error); console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; }).finally(() => { if (fs.existsSync(temporaryRoot)) { try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron may release its profile lock during process shutdown. */ } } });
