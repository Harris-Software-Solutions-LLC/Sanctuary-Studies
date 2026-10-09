const assert = require('node:assert/strict');
const timeline = require('../shared/content/timeline/timeline-v1.json');
const { timelinePackageToItems } = require('../shared/content/timeline/index.cjs');

assert.equal(timeline.step_count, 24);
assert.equal(timeline.steps.length, 24);
assert.equal(timeline.prelude.display_step, 0);
assert.equal(timeline.steps[0].display_step, 1);
assert.equal(timeline.steps.at(-1).display_step, 24);
assert.equal(timeline.question_count, 189);
assert.equal(new Set(timeline.questions.map((question) => question.questionId)).size, 189);
assert.deepEqual([...new Set(timeline.questions.map((question) => question.display_step))].sort((a, b) => a - b), Array.from({ length: 25 }, (_, index) => index));
assert.deepEqual([...new Set(timeline.questions.map((question) => question.type))].sort(), ['fill-blank', 'multiple-choice', 'true-false']);
const items = timelinePackageToItems(timeline);
assert.equal(items.length, 214);
assert.equal(items.filter((item) => item.content_type === 'timeline_prelude').length, 1);
assert.equal(items.filter((item) => item.content_type === 'timeline_step').length, 24);
assert.equal(items.filter((item) => item.content_type === 'timeline_question').length, 189);
console.log('timeline content tests passed: 24 steps, 1 prelude, 189 questions');
