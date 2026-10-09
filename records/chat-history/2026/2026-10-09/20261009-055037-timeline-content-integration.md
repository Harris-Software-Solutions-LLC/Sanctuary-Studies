# Sanctuary Studies task record — timeline content integration

- Date: 2026-10-09
- Branch: `UI`
- Repository: `https://github.com/Harris-Software-Solutions-LLC/Sanctuary-Studies.git`
- Scope: Sanctuary Studies only. No Muzicle, MMC, Canon and Imitation, or unrelated repository was accessed or used.

## User-visible request

Begin the approved ZIP comparison follow-up by importing the timeline functionality first. The visible timeline must contain 24 steps because the prior 14-step implementation is incorrect. Keep the supplied ZIP unchanged as a read-only reference and preserve all functionality additively.

## Decisions

- The supplied ZIP remains a read-only reference archive and is not a runtime dependency.
- ZIP GitHub configuration, web/SaaS infrastructure, Supabase integration, payment/auth routes, and external assets were excluded.
- The source timeline contains 25 zero-based entries (`0` through `24`) and 189 learning questions.
- Source entry `0` is preserved as an explicit provenance prelude and is not counted in the user-facing sequence.
- Source entries `1` through `24` are the 24 numbered Study Workspace steps.
- All 189 questions remain available, including questions associated with the prelude.
- The preserved legacy/root workspace remains available and its old timeline was not silently removed or overwritten.

## Implementation

- Added local versioned timeline package under `shared/content/timeline/`.
- Added timeline provenance under `shared/content/provenance/`.
- Added schema v2 and additive migration `002-content-links` for content items, relationships, provenance, and study-content links.
- Added local store operations for listing content, listing study content, and attaching a versioned content package.
- Added restricted Electron IPC/preload methods for local timeline loading and attachment.
- Added the Study Workspace Timeline tab with 24-step navigation, prelude disclosure, source references, learning prompts, and local attachment action.
- Added additive timeline styling and tests.

## Validation

- Timeline content test: passed — 24 steps, 1 prelude, 189 questions.
- Shared model test: passed — schema v2 and preserved v1 records.
- Store persistence test: passed — local persistence, invalid input handling, and 214 attached content items.
- Repository validation: passed.
- Lint: passed.
- Type-check: passed.
- JavaScript syntax checks: passed.
- Electron library acceptance test: passed — local IPC, persistence, timeline loading/attachment, and no external requests.
- Preserved-root Electron acceptance test: passed.
- No Electron packaging was run.
- The supplied ZIP was not modified.

## Changed Sanctuary Studies files

- `electron/main.cjs`
- `electron/preload.cjs`
- `package.json`
- `scripts/test-electron-library.cjs`
- `scripts/test-shared-model.cjs`
- `scripts/test-store-persistence.cjs`
- `scripts/test-timeline-content.cjs`
- `shared/content/timeline/README.md`
- `shared/content/timeline/index.cjs`
- `shared/content/timeline/timeline-v1.json`
- `shared/content/provenance/timeline-v1.json`
- `shared/migrations/002-content-links.cjs`
- `shared/model.cjs`
- `shared/schema/schema-v2.json`
- `shared/store.cjs`
- `ui/app.js`
- `ui/styles.css`
- `docs/feature-reference-bolt-comparison.md`
- this append-only task record

## External archive status

- E: authoritative working copy: implementation complete pending commit/push.
- D: isolated Sanctuary Studies mirror: the same task files will be copied without touching unrelated D: files.
- GitHub: pending commit and push from `UI`.
- Google Drive: pending upload to the existing `Sanctuary Studies` folder associated with `bachresearchgroup@gmail.com`.
