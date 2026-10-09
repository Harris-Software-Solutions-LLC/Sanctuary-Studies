const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'learning-v1.json');

function loadLearningPackage() { return JSON.parse(fs.readFileSync(packagePath, 'utf8')); }

function learningPackageToItems(packageData, timestamp = new Date().toISOString()) {
  return packageData.educator_resources.map((resource) => ({ id: resource.content_id, content_type: 'educator_resource', slug: resource.content_id.replace(/^learning\./, ''), title: resource.title, summary: `${resource.cat} · ${resource.age} · ${resource.duration}`, payload_json: JSON.stringify(resource), created_at: timestamp, updated_at: timestamp, deleted_at: null }));
}

function learningPackageToRelationships() { return []; }

module.exports = { loadLearningPackage, learningPackageToItems, learningPackageToRelationships };
