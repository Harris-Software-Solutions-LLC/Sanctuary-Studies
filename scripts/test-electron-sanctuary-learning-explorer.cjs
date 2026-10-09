const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadTimelinePackage } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage } = require('../shared/content/colors/index.cjs');
const { loadSanctuaryPackage, sanctuaryPackageToItems, sanctuaryPackageToRelationships } = require('../shared/content/sanctuary/index.cjs');
const { loadLearningPackage, learningPackageToItems, learningPackageToRelationships } = require('../shared/content/learning/index.cjs');
const { loadExplorerPackage, explorerPackageToItems, explorerPackageToRelationships } = require('../shared/content/explorer/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-sanctuary-learning-explorer-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');
const report = { localOnly: true, packagesLoaded: false, sanctuarySearch: false, learningSearch: false, explorerSearch: false, explorerSpatialView: false, explorerSourceTrail: false, explorerLegacyRouteAction: false, attached: false, modeIntegration: false, exportRoundTrip: false, noExternalDependency: true };
let openedLegacyRoute = false;

function registerHandlers(store) {
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:colors', () => loadColorsPackage());
  ipcMain.handle('content:sanctuary', () => loadSanctuaryPackage());
  ipcMain.handle('content:learning', () => loadLearningPackage());
  ipcMain.handle('content:explorer', () => loadExplorerPackage());
  ipcMain.handle('content:attach-sanctuary', (_event, input) => { const packageData = loadSanctuaryPackage(); return store.attachContentPackage({ studyId: input.studyId, packageData, items: sanctuaryPackageToItems(packageData), relationships: sanctuaryPackageToRelationships(packageData), sourceName: 'test Sanctuary', sourcePath: 'test/sanctuary', sourceRevision: 'test', licenseStatus: 'review-required' }); });
  ipcMain.handle('content:attach-learning', (_event, input) => { const packageData = loadLearningPackage(); return store.attachContentPackage({ studyId: input.studyId, packageData, items: learningPackageToItems(packageData), relationships: learningPackageToRelationships(packageData), sourceName: 'test Learning', sourcePath: 'test/learning', sourceRevision: 'test', licenseStatus: 'review-required' }); });
  ipcMain.handle('content:attach-explorer', (_event, input) => { const packageData = loadExplorerPackage(); return store.attachContentPackage({ studyId: input.studyId, packageData, items: explorerPackageToItems(packageData), relationships: explorerPackageToRelationships(packageData), sourceName: 'test Explorer', sourcePath: 'test/explorer', sourceRevision: 'test', licenseStatus: 'review-required' }); });
  ipcMain.handle('ui:open-legacy-route', (_event, route) => { if (route !== 'heavenly') throw new Error(`Unexpected test route: ${route}`); openedLegacyRoute = true; return true; });
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
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Electron Sanctuary Models test', description: 'Offline Sanctuary, Learning, and Explorer integration.' });
    await window.refreshFromDesktop();
    document.querySelector('[data-study-id="' + study.id + '"]')?.click();
    document.querySelector('[data-study-section="sanctuary"]')?.click(); await wait(100);
    const sanctuaryText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#sanctuary-search').value = 'Wilderness'; document.querySelector('#sanctuary-search').dispatchEvent(new Event('input', { bubbles: true })); await wait(80);
    const sanctuarySearchText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#sanctuary-attach')?.click(); await wait(250);
    document.querySelector('[data-study-section="educators"]')?.click(); await wait(100);
    const learningText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#learning-search').value = 'Tabernacle Model'; document.querySelector('#learning-search').dispatchEvent(new Event('input', { bubbles: true })); await wait(80);
    const learningSearchText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#learning-attach')?.click(); await wait(250);
    document.querySelector('[data-study-section="explorer"]')?.click(); await wait(100);
    const explorerText = document.querySelector('#record-table-wrap')?.textContent || '';
    const spatialView = Boolean(document.querySelector('#explorer-view')?.value === 'spatial' && document.querySelector('.explorer-spatial-zone'));
    document.querySelector('#explorer-view').value = 'sources'; document.querySelector('#explorer-view').dispatchEvent(new Event('change', { bubbles: true })); await wait(80);
    const sourceTrailText = document.querySelector('#record-table-wrap')?.textContent || '';
    const sourceTrailView = Boolean(document.querySelector('.explorer-source-panel') && sourceTrailText.includes('Exodus 25'));
    document.querySelector('[data-explorer-tool-route="heavenly"]')?.click(); await wait(80);
    const legacyRouteAction = Boolean(document.querySelector('[data-explorer-tool-route="heavenly"]'));
    document.querySelector('#explorer-search').value = 'Solomon'; document.querySelector('#explorer-search').dispatchEvent(new Event('input', { bubbles: true })); await wait(80);
    const explorerSearchText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#explorer-attach')?.click(); await wait(250);
    const modeText = {};
    const select = document.querySelector('#workspace-mode');
    for (const mode of ['desk', 'codex', 'folio', 'evidence']) { select.value = mode; select.dispatchEvent(new Event('change', { bubbles: true })); await wait(160); modeText[mode] = document.querySelector('#record-table-wrap')?.textContent || ''; }
    const bundle = await window.sanctuaryDesktop.data.exportBundle();
    return { studyId: study.id, sanctuaryText, sanctuarySearchText, learningText, learningSearchText, explorerText, explorerSearchText, spatialView, sourceTrailView, legacyRouteAction, modeText, bundle };
  })()`);
  const sanctuary = loadSanctuaryPackage();
  const learning = loadLearningPackage();
  const explorer = loadExplorerPackage();
  report.packagesLoaded = sanctuary.counts.models === 4 && sanctuary.counts.comparisons === 4 && learning.counts.educator_resources === 9 && explorer.counts.specialized_tools === 6;
  report.sanctuarySearch = result.sanctuaryText.includes('Wilderness Tabernacle') && result.sanctuarySearchText.includes('Wilderness Tabernacle');
  report.learningSearch = result.learningText.includes('Build a Tabernacle Model') && result.learningSearchText.includes('Build a Tabernacle Model');
  report.explorerSearch = result.explorerText.includes('Solomon’s Temple') || result.explorerText.includes("Solomon's Temple") || result.explorerSearchText.includes('Solomon');
  report.explorerSpatialView = result.spatialView;
  report.explorerSourceTrail = result.sourceTrailView;
  report.explorerLegacyRouteAction = result.legacyRouteAction && openedLegacyRoute;
  report.attached = store.listStudyContent({ studyId: result.studyId, contentType: 'sanctuary_model' }).length === 4 && store.listStudyContent({ studyId: result.studyId, contentType: 'educator_resource' }).length === 9 && store.listStudyContent({ studyId: result.studyId, contentType: 'explorer_model' }).length === 4;
  report.modeIntegration = result.modeText.desk.includes('Structures and stages') && result.modeText.codex.includes('Models and tools') && result.modeText.folio.includes('Educator resources') && result.modeText.evidence.toLowerCase().includes('sanctuary model') && result.modeText.evidence.toLowerCase().includes('educator resource') && result.modeText.evidence.toLowerCase().includes('explorer model');
  report.exportRoundTrip = result.bundle.data.content_items.some((item) => item.content_type === 'sanctuary_model') && result.bundle.data.content_items.some((item) => item.content_type === 'educator_resource') && result.bundle.data.content_items.some((item) => item.content_type === 'explorer_model') && result.bundle.data.content_relationships.some((relationship) => relationship.relationship_type === 'contains_zone');
  report.noExternalDependency = externalRequests.length === 0;
  window.close();
  await app.quit();
  report.ok = Object.values(report).every((value) => value === true);
  console.log(JSON.stringify({ ...report, externalRequests }, null, 2));
  return report.ok;
}

run().then((ok) => { process.exitCode = ok ? 0 : 1; }).catch((error) => { report.ok = false; report.error = error.stack || String(error); console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; }).finally(() => { if (fs.existsSync(temporaryRoot)) { try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron may release its profile lock during process shutdown. */ } } });
