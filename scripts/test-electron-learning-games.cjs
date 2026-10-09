const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { createStore } = require('../shared/store.cjs');
const { loadLearningGamesPackage, learningGamesPackageToItems, learningGamesPackageToRecords } = require('../shared/content/learning/games/game-index.cjs');
const { loadTimelinePackage } = require('../shared/content/timeline/index.cjs');
const { loadScripturePackage } = require('../shared/content/scripture/index.cjs');
const { loadLibraryPackage } = require('../shared/content/library/index.cjs');
const { loadSymbolismPackage } = require('../shared/content/symbolism/index.cjs');
const { loadColorsPackage } = require('../shared/content/colors/index.cjs');
const { loadSanctuaryPackage } = require('../shared/content/sanctuary/index.cjs');
const { loadLearningPackage } = require('../shared/content/learning/index.cjs');
const { loadExplorerPackage } = require('../shared/content/explorer/index.cjs');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, `.audit-temp-electron-learning-games-${process.pid}`);
const databasePath = path.join(temporaryRoot, 'data.json');
const report = { localOnly: true, packageLoaded: false, gameSearch: false, attached: false, sessionPersistence: false, progressPersistence: false, exportRoundTrip: false, noExternalDependency: true };

function registerHandlers(store) {
  ipcMain.handle('data:snapshot', () => store.snapshot());
  ipcMain.handle('study:create', (_event, input) => store.createStudy(input));
  ipcMain.handle('data:export-bundle', () => store.exportBundle());
  ipcMain.handle('content:learning-games', () => loadLearningGamesPackage());
  ipcMain.handle('content:timeline', () => loadTimelinePackage());
  ipcMain.handle('content:scripture', () => loadScripturePackage());
  ipcMain.handle('content:library', () => loadLibraryPackage());
  ipcMain.handle('content:symbolism', () => loadSymbolismPackage());
  ipcMain.handle('content:colors', () => loadColorsPackage());
  ipcMain.handle('content:sanctuary', () => loadSanctuaryPackage());
  ipcMain.handle('content:learning', () => loadLearningPackage());
  ipcMain.handle('content:explorer', () => loadExplorerPackage());
  ipcMain.handle('content:attach-learning-games', (_event, input) => { const packageData = loadLearningGamesPackage(); return store.attachLearningGamePackage({ studyId: input.studyId, packageData, items: learningGamesPackageToItems(packageData), gameRecords: learningGamesPackageToRecords(packageData), sourceName: 'test learning games', sourcePath: 'test/learning-games', sourceRevision: 'test' }); });
  ipcMain.handle('learning:start-session', (_event, input) => store.startGameSession(input));
  ipcMain.handle('learning:record-attempt', (_event, input) => store.recordGameAttempt(input));
  ipcMain.handle('learning:complete-session', (_event, input) => store.completeGameSession(input));
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
    const study = await window.sanctuaryDesktop.data.createStudy({ title: 'Electron Learning Games test', description: 'Offline game engine.' });
    await window.refreshFromDesktop();
    document.querySelector('[data-study-id="' + study.id + '"]')?.click();
    document.querySelector('[data-study-section="learning"]')?.click(); await wait(120);
    const initialText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#learning-game-search').value = 'colors'; document.querySelector('#learning-game-search').dispatchEvent(new Event('input', { bubbles: true })); await wait(80);
    const searchText = document.querySelector('#record-table-wrap')?.textContent || '';
    document.querySelector('#learning-games-attach')?.click(); await wait(220);
    const startButton = document.querySelector('[data-start-game]');
    startButton?.click(); await wait(80);
    const activeText = document.querySelector('#record-table-wrap')?.textContent || '';
    return { studyId: study.id, initialText, searchText, activeText };
  })()`);
  const packageData = loadLearningGamesPackage();
  report.packageLoaded = packageData.games.length === 30 && packageData.counts.symbolism === 5;
  report.gameSearch = result.initialText.includes('Interactive Games') && result.searchText.toLowerCase().includes('color');
  report.attached = store.listStudyContent({ studyId: result.studyId, contentType: 'learning_game' }).length === 30 && store.snapshot().learning_games.length === 30;
  const session = store.startGameSession({ studyId: result.studyId, gameId: packageData.games[0].game_id });
  store.recordGameAttempt({ sessionId: session.id, itemId: packageData.games[0].items[0].id, submittedAnswer: 1, correct: true, points: 10 });
  store.completeGameSession({ sessionId: session.id, score: 10, percentage: 100 });
  const snapshot = store.snapshot();
  report.sessionPersistence = snapshot.game_sessions.length >= 1 && snapshot.game_attempts.length === 1 && snapshot.game_sessions.some((sessionRecord) => sessionRecord.status === 'completed' && sessionRecord.completed_at);
  report.progressPersistence = snapshot.learning_progress.length === 1 && snapshot.learning_progress[0].mastery_level === 'mastered';
  report.exportRoundTrip = store.exportBundle().data.learning_games.length === 30 && store.exportBundle().data.learning_progress.length === 1;
  report.noExternalDependency = externalRequests.length === 0;
  window.close();
  await app.quit();
  report.ok = Object.values(report).every((value) => value === true);
  console.log(JSON.stringify({ ...report, externalRequests, sessionCount: snapshot.game_sessions.length, activeText: result.activeText.slice(0, 160) }, null, 2));
  return report.ok;
}

run().then((ok) => { process.exitCode = ok ? 0 : 1; }).catch((error) => { report.ok = false; report.error = error.stack || String(error); console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; }).finally(() => { if (fs.existsSync(temporaryRoot)) { try { fs.rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); } catch { /* Electron releases its profile lock during shutdown. */ } } });
