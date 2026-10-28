const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { listPackage, extractAll } = require('@electron/asar');

const root = path.resolve(__dirname, '..');
const asarPath = process.argv[2];
const assetPath = 'assets/timeline/step-01-aaron-jesus.png';
const timelinePath = 'shared/content/timeline/timeline-v1.json';
const rendererPath = 'ui/app.js';
const stylesheetPath = 'ui/styles.css';

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assertVisualContract(readFile, hasFile) {
  const timeline = JSON.parse(readFile(timelinePath));
  const step = timeline.steps.find((item) => item.display_step === 1);
  assert.equal(step.annotation.source_image, assetPath, 'Step 1 must reference the packaged local visual asset');
  assert.ok(hasFile(assetPath), 'Step 1 visual asset must be present');
  const app = readFile(rendererPath);
  const css = readFile(stylesheetPath);
  for (const marker of ['timelineVisualMarkup', 'data-timeline-track', 'data-timeline-image-action', 'save-timeline-note', 'timeline-source-viewport']) assert.ok(app.includes(marker), `renderer missing ${marker}`);
  for (const marker of ['timeline-visual-grid', 'timeline-source-viewport', 'timeline-private-notes']) assert.ok(css.includes(marker), `stylesheet missing ${marker}`);
}

if (asarPath) {
  const files = new Set(listPackage(asarPath));
  const tempRoot = process.platform === 'win32' ? 'E:\\CodexHome' : require('node:os').tmpdir();
  const extractionRoot = fs.mkdtempSync(path.join(tempRoot, 'sanctuary-timeline-visual-'));
  try {
    extractAll(asarPath, extractionRoot);
    assertVisualContract((relativePath) => fs.readFileSync(path.join(extractionRoot, relativePath), 'utf8'), (relativePath) => files.has(`\\${relativePath.replaceAll('/', '\\')}`));
  } finally {
    fs.rmSync(extractionRoot, { recursive: true, force: true });
  }
  console.log(`Electron timeline visual package test passed: ${path.basename(asarPath)}`);
} else {
  assertVisualContract((relativePath) => readProjectFile(relativePath), (relativePath) => fs.existsSync(path.join(root, relativePath)));
  console.log('Electron timeline visual source test passed: Step 1 asset, renderer, annotations, controls, and notes');
}
