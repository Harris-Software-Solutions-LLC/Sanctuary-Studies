const path = require('node:path');
const { app, BrowserWindow, session } = require('electron');

const root = path.resolve(__dirname, '..');
const entrypoint = path.join(root, 'index.html');
const routeNames = [
  'home', 'bible', 'library', 'book-crosier', 'book-haskell', 'book-andreasen',
  'book-gilbert', 'book-defense', 'timeline', 'judgment', 'scripture', 'symbolism',
  'colors', 'heavenly', 'compare', 'explorer', 'media', 'educators', 'forums',
  'profiles', 'myths'
];

const report = {
  entrypoint,
  localOnly: true,
  routes: [],
  externalRequests: [],
  consoleErrors: [],
  processErrors: []
};

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function run() {
  await app.whenReady();

  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (details, callback) => {
    report.externalRequests.push(details.url);
    callback({ cancel: true });
  });

  const window = new BrowserWindow({
    show: false,
    width: 1440,
    height: 960,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 2) report.consoleErrors.push(message);
  });
  window.webContents.on('render-process-gone', (_event, details) => {
    report.processErrors.push(details.reason || 'unknown renderer failure');
  });

  await window.loadFile(entrypoint);
  await wait(350);

  const browserReport = await window.webContents.executeJavaScript(`(() => {
    const routeNames = ${JSON.stringify(routeNames)};
    const routes = [];
    for (const route of routeNames) {
      try {
        navigate(route);
        const active = [...document.querySelectorAll('.page')].find((page) => page.classList.contains('active'));
        routes.push({ route, ok: Boolean(active && active.id === 'page-' + route), active: active ? active.id : null });
      } catch (error) {
        routes.push({ route, ok: false, error: String(error) });
      }
    }

    navigate('bible');
    goToVerse('Exodus', 25);
    const bibleText = document.getElementById('bible-text')?.textContent || '';

    navigate('timeline');
    const timelineBefore = document.getElementById('tl-step-num')?.textContent || '';
    timelineNext();
    const timelineAfter = document.getElementById('tl-step-num')?.textContent || '';

    doSearch('sanctuary');
    const searchResultCount = document.querySelectorAll('#search-results .search-result-item').length;

    toggleSearch();
    const searchOpened = document.getElementById('search-overlay')?.classList.contains('active') === true;
    closeSearch();
    const searchClosed = document.getElementById('search-overlay')?.classList.contains('active') === false;

    localStorage.setItem('sanctuary-studies-audit', 'ok');
    const localStorageRoundTrip = localStorage.getItem('sanctuary-studies-audit') === 'ok';
    localStorage.removeItem('sanctuary-studies-audit');

    let invalidRouteHandled = true;
    try { navigate('not-a-real-route'); } catch (_error) { invalidRouteHandled = false; }

    return {
      initialPage: document.querySelector('.page.active')?.id || null,
      routes,
      bibleRendered: bibleText.includes('tabernacle') || bibleText.includes('ark'),
      timelineAdvanced: timelineBefore !== timelineAfter,
      searchResultCount,
      searchOpened,
      searchClosed,
      localStorageRoundTrip,
      invalidRouteHandled
    };
  })()`);

  Object.assign(report, browserReport);
  window.close();
  await app.quit();

  const failedRoutes = report.routes.filter((route) => !route.ok);
  report.ok = failedRoutes.length === 0
    && report.processErrors.length === 0
    && report.bibleRendered
    && report.timelineAdvanced
    && report.searchResultCount > 0
    && report.searchOpened
    && report.searchClosed
    && report.localStorageRoundTrip
    && report.invalidRouteHandled;
  report.failedRoutes = failedRoutes;
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.ok ? 0 : 1;
}

run().catch((error) => {
  report.ok = false;
  report.processErrors.push(error.stack || String(error));
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
});
