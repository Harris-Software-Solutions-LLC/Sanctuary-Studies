const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'timeline-v1.json');

function loadTimelinePackage() {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function timelinePackageToItems(packageData, timestamp = new Date().toISOString()) {
  const stepItems = [packageData.prelude, ...packageData.steps].map((step) => ({
    id: step.content_id,
    content_type: step.display_step === 0 ? 'timeline_prelude' : 'timeline_step',
    slug: step.content_id,
    title: step.display_step === 0 ? 'Timeline prelude' : `Timeline step ${step.display_step}: ${step.aaron}`,
    summary: step.jesus,
    payload_json: JSON.stringify(step),
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  }));
  const questionItems = packageData.questions.map((question) => ({
    id: question.content_id,
    content_type: 'timeline_question',
    slug: question.questionId,
    title: question.question,
    summary: question.explanation,
    payload_json: JSON.stringify(question),
    created_at: timestamp,
    updated_at: timestamp,
    deleted_at: null
  }));
  return [...stepItems, ...questionItems];
}

module.exports = { loadTimelinePackage, timelinePackageToItems };
