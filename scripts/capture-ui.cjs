const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow } = require('electron');

const outputPath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'sanctuary-studies-ui-preview.png'));
const entrypoint = path.resolve(process.argv[3] || path.join(__dirname, '..', 'index.html'));

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    show: false,
    width: 1440,
    height: 960,
    backgroundColor: '#f5f0e8',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  await window.loadFile(entrypoint);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const image = await window.webContents.capturePage();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, image.toPNG());
  console.log(outputPath);
  app.quit();
});
