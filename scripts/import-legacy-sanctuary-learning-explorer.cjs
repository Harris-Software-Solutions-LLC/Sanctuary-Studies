const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sourceRevision = process.env.SANCTUARY_SOURCE_REVISION || '61b379e7d6d4c9cc6ca693a334fd89c35759d8e5';
const timestamp = new Date().toISOString();

function readLegacyConstant(fileName, expression, extra = {}) {
  const source = fs.readFileSync(path.join(root, fileName), 'utf8');
  return JSON.parse(vm.runInNewContext(`${source}\n;JSON.stringify(${expression})`, { console, ...extra }));
}

function slug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function scriptureReferences(value) {
  if (Array.isArray(value)) return value.map((item) => String(item.ref || item.reference || item)).filter(Boolean);
  return String(value || '').split(';').map((item) => item.trim()).filter(Boolean);
}

function referenceRecord(reference, source) {
  return { id: `scripture.reference.${slug(reference)}`, reference, kind: 'Scripture reference', source };
}

function packageBase(contentType, title, sourceFiles, counts) {
  return {
    format: 'sanctuary-studies-content',
    content_type: contentType,
    content_version: 1,
    title,
    source_revision: sourceRevision,
    imported_at: timestamp,
    source_files: sourceFiles,
    license_status: 'review-required',
    runtime: 'offline-local',
    counts
  };
}

const compareData = readLegacyConstant('app-pages2.js', 'COMPARE_DATA');
const portalStages = readLegacyConstant('app-pages2.js', 'HEAVENLY_STAGES');
const explorerModels = readLegacyConstant('app-pages3.js', 'EXPLORER_MODELS');
const explorerDiagrams = readLegacyConstant('app-pages3.js', 'Object.fromEntries(EXPLORER_MODELS.map((model) => [model.id, renderSanctuaryDiagram(model.id)]))');
const educatorResources = readLegacyConstant('app-data.js', 'EDUCATOR_RESOURCES');
const homeFeatures = readLegacyConstant('app-data.js', 'HOME_FEATURES');

const references = new Map();
const addReference = (reference, source) => references.set(reference, referenceRecord(reference, source));
for (const model of explorerModels) for (const reference of model.keyScriptures || []) addReference(reference, 'legacy Sanctuary model and Explorer data');
for (const stage of portalStages) {
  const stageReference = String(stage.scripture || '').split('—').pop().replace(/\s*\(KJV\)\s*$/, '').trim();
  if (stageReference) addReference(stageReference, 'legacy Heavenly Portal data');
}
for (const comparison of Object.values(compareData)) for (const row of comparison.rows || []) for (const cell of row) {
  const value = String(cell);
  if (/[A-Za-z]+\s+\d/.test(value)) addReference(value, 'legacy Sanctuary comparative structure data');
}
for (const resource of educatorResources) for (const objective of resource.objectives || []) addReference(objective, 'legacy Educator Resources data');

const sanctuaryModels = explorerModels.map((model, index) => ({ content_id: `sanctuary.model.${model.id}`, legacy_index: index, ...model }));
const sanctuaryStages = portalStages.map((stage, index) => ({ content_id: `sanctuary.portal.${slug(stage.label)}`, legacy_index: index, ...stage }));
const sanctuaryComparisons = Object.entries(compareData).map(([id, comparison], index) => ({ content_id: `sanctuary.comparison.${id}`, legacy_index: index, id, ...comparison }));
const learningResources = educatorResources.map((resource, index) => ({ content_id: `learning.educator.${resource.id}`, legacy_index: index, ...resource }));
const specializedTools = homeFeatures.filter((feature) => ['judgment', 'heavenly', 'myths', 'media', 'forums', 'profiles'].includes(feature.id)).map((feature, index) => ({ content_id: `explorer.tool.${feature.id}`, legacy_index: index, ...feature, integration_status: 'legacy-route-preserved' }));
const explorerModelRecords = explorerModels.map((model, index) => ({ content_id: `explorer.model.${model.id}`, legacy_index: index, ...model, diagram: explorerDiagrams[model.id] }));

const sanctuaryPackage = {
  ...packageBase('sanctuary', 'Sanctuary Models and Comparative Structures', ['app-pages2.js', 'app-pages3.js'], { models: sanctuaryModels.length, comparisons: sanctuaryComparisons.length, portal_stages: sanctuaryStages.length, scripture_references: references.size }),
  models: sanctuaryModels,
  comparisons: sanctuaryComparisons,
  portal_stages: sanctuaryStages,
  scripture_references: [...references.values()]
};
const learningPackage = {
  ...packageBase('learning', 'Learning and Educator Resources', ['app-data.js', 'app-pages3.js'], { educator_resources: learningResources.length, categories: new Set(learningResources.map((resource) => resource.cat)).size, age_groups: new Set(learningResources.map((resource) => resource.age)).size }),
  educator_resources: learningResources
};
const explorerPackage = {
  ...packageBase('explorer', '3D Sanctuary Explorer and Specialized Legacy Tools', ['app-pages3.js', 'app-data.js'], { models: explorerModelRecords.length, zones: explorerModelRecords.reduce((count, model) => count + model.zones.length, 0), specialized_tools: specializedTools.length, scripture_references: [...references.values()].filter((reference) => reference.source.includes('Explorer')).length }),
  models: explorerModelRecords,
  specialized_tools: specializedTools,
  scripture_references: [...references.values()].filter((reference) => reference.source.includes('Explorer'))
};

const outputs = [
  ['sanctuary', 'sanctuary-v1.json', sanctuaryPackage],
  ['learning', 'learning-v1.json', learningPackage],
  ['explorer', 'explorer-v1.json', explorerPackage]
];
for (const [directory, fileName, value] of outputs) {
  const targetDirectory = path.join(root, 'shared', 'content', directory);
  fs.mkdirSync(targetDirectory, { recursive: true });
  fs.writeFileSync(path.join(targetDirectory, fileName), `${JSON.stringify(value, null, 2)}\n`);
}
console.log(JSON.stringify({ sanctuary_models: sanctuaryModels.length, comparisons: sanctuaryComparisons.length, portal_stages: sanctuaryStages.length, educator_resources: learningResources.length, explorer_models: explorerModelRecords.length, specialized_tools: specializedTools.length, sanctuary_path: 'shared/content/sanctuary/sanctuary-v1.json', learning_path: 'shared/content/learning/learning-v1.json', explorer_path: 'shared/content/explorer/explorer-v1.json' }, null, 2));
