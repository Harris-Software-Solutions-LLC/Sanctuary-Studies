const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

const html = read('index.html');
if (!html.includes('<!DOCTYPE html>')) fail('index.html is missing a doctype');

for (const reference of [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)].map((match) => match[1])) {
  if (/^(?:https?:|data:|mailto:|#)/i.test(reference)) continue;
  if (!fs.existsSync(path.join(root, reference))) fail(`Broken local reference in index.html: ${reference}`);
}

for (const file of fs.readdirSync(root).filter((name) => name.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`JavaScript syntax check failed for ${file}: ${result.stderr.trim()}`);
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/https?:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)/i.test(source)) {
    fail(`Runtime font network dependency found in ${file}`);
  }
}

if (/(?:fonts\.googleapis\.com|fonts\.gstatic\.com)/i.test(html)) {
  fail('index.html still contains a Google Fonts runtime dependency');
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Sanctuary Studies validation passed.');
}
