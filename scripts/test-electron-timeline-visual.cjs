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
  const daily = JSON.parse(readFile('shared/content/timeline/daily-annotations-v1.json'));
  for (let number = 2; number <= 10; number += 1) {
    const annotation = daily.steps[String(number)];
    assert.ok(annotation, `Daily Step ${number} annotation must exist`);
    assert.ok(annotation.source_pages.length >= 1, `Daily Step ${number} must have a source page`);
    for (const sourcePage of annotation.source_pages) assert.ok(hasFile(sourcePage), `Daily Step ${number} asset missing: ${sourcePage}`);
    assert.ok(annotation.aaron.caption && annotation.jesus.caption && annotation.comparison, `Daily Step ${number} must have complete track annotations`);
  }
  assert.ok(hasFile(daily.full_timeline.daily_image), 'Full Daily timeline reference must be packaged');
  assert.ok(hasFile(daily.full_timeline.yearly_image), 'Full Yearly timeline reference must be packaged');
  assert.ok(hasFile('assets/Sanctuary-Studies-Chart-Pack/sanctuary-charts/assets/daily.png'), 'Chart pack Daily chart must be packaged');
  assert.ok(hasFile('assets/Sanctuary-Studies-Chart-Pack/sanctuary-charts/assets/yearly.png'), 'Chart pack Yearly chart must be packaged');
  assert.ok(hasFile('assets/timeline/24 StepsOfSanctuary/Sanctuary Timeline (Daily).png'), '24-step gallery Daily image must be packaged');
  assert.ok(hasFile('assets/timeline/24 StepsOfSanctuary/Sanctuary Timeline (Yearly).png'), '24-step gallery Yearly image must be packaged');
  const app = readFile(rendererPath);
  const css = readFile(stylesheetPath);
  for (const marker of ['timelineVisualMarkup', 'timelineReferenceMarkup', 'data-timeline-track', 'data-timeline-reference-image', 'data-timeline-image-action', 'save-timeline-note', 'timeline-source-viewport', 'timeline-full-view']) assert.ok(app.includes(marker), `renderer missing ${marker}`);
  for (const marker of ['timeline-visual-grid', 'timeline-source-viewport', 'timeline-private-notes', 'timeline-reference-panel', 'timeline-reference-thumb']) assert.ok(css.includes(marker), `stylesheet missing ${marker}`);
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
