const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, 'timeline-v1.json');
const dailyAnnotationsPath = path.join(__dirname, 'daily-annotations-v1.json');
const chartPackRoot = path.join(__dirname, '..', '..', 'assets', 'Sanctuary-Studies-Chart-Pack', 'sanctuary-charts');
const timelineGalleryRoot = path.join(__dirname, '..', '..', 'assets', 'timeline', '24 StepsOfSanctuary');

function localPngFiles(root, prefix) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
    .sort((left, right) => left.name.localeCompare(right.name, 'en'))
    .map((entry) => `${prefix}/${entry.name}`);
}

function loadTimelinePackage() {
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dailyAnnotations = JSON.parse(fs.readFileSync(dailyAnnotationsPath, 'utf8'));
  packageData.steps = packageData.steps.map((step) => {
    const annotation = dailyAnnotations.steps[String(step.display_step)];
    return annotation ? { ...step, annotation: { ...annotation, private_notes: step.annotation?.private_notes || [] } } : step;
  });
  packageData.full_timeline = dailyAnnotations.full_timeline;
  packageData.reference_assets = {
    chart_pack: {
      label: 'Sanctuary Studies Chart Pack',
      readme: 'assets/Sanctuary-Studies-Chart-Pack/sanctuary-charts/README.txt',
      data: 'assets/Sanctuary-Studies-Chart-Pack/sanctuary-charts/sanctuary-steps.json',
      charts: ['court', 'holy', 'most', 'daily', 'yearly'].map((name) => ({
        name,
        png: `assets/Sanctuary-Studies-Chart-Pack/sanctuary-charts/assets/${name}.png`,
        svg: `assets/Sanctuary-Studies-Chart-Pack/sanctuary-charts/assets/${name}.svg`
      }))
    },
    timeline_gallery: {
      label: '24 Steps of the Sanctuary — visual reference gallery',
      directory: 'assets/timeline/24 StepsOfSanctuary',
      images: localPngFiles(timelineGalleryRoot, 'assets/timeline/24 StepsOfSanctuary')
    }
  };
  return packageData;
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
