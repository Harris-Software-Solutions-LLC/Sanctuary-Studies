# Sanctuary Studies — Scripture content integration record

- Date: 2026-10-09
- Repository: `E:\Sanctuary Studies`
- Branch: `UI`
- Scope: additive Scripture integration only; the preserved root Bible and Scripture Navigator routes remain unchanged.
- Isolation: Sanctuary Studies only. No Muzicle, MMC, Canon and Imitation, or unrelated repository was accessed.

## Imported legacy content

The legacy Scripture data was normalized from `app-data.js` with the rendering behavior documented from `app-pages1.js`:

- 66 KJV books
- 1,189 chapter records
- 214 preserved KJV verse texts
- 8 sanctuary-focused Scripture passages
- 258 searchable Scripture references
- 6 cross-reference groups
- 6 study notes
- 1,741 shared content items
- 49 shared content relationships

Package files:

- `shared/content/scripture/scripture-v1.json`
- `shared/content/scripture/index.cjs`
- `shared/content/scripture/provenance.json`
- `shared/content/scripture/README.md`
- `scripts/import-legacy-scripture.cjs`

## Shared and Electron integration

- Scripture content uses schema v2 `content_items`, `content_relationships`, `content_provenance`, and `study_content_links`.
- Package attachment is additive and preserves existing timeline behavior.
- Electron main/preload exposes only local allow-listed Scripture methods.
- The new Scripture tab supports offline search, passage reading, cross-reference navigation, study attachment, and bundle export.
- Scholar’s Desk, Codex Cabinet, Sanctuary Atlas, Research Folio, and Evidence Wall now expose Scripture context from the same shared data.
- Notes and sources are scanned for local Scripture references without changing their existing record schema.
- Timeline attachment remains independent from Scripture attachment.

## Verification

- `npm test`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test:shared`: passed.
- `npm run test:store`: passed.
- `npm run test:timeline`: passed — 24 steps, 189 questions.
- `npm run test:scripture`: passed — 1,741 items, 49 relationships, 258 references.
- `npm run test:electron:library`: passed — local persistence, five workspace modes, timeline behavior, no external requests.
- `npm run test:electron:scripture`: passed — package loading, search, cross-reference opening, attachment, note/source detection, five-view integration, export round trip, no external requests.
- `npm run test:electron`: passed — every preserved root-workspace route, no console/process errors, no external requests.

## Handoff status

- E: authoritative implementation complete; commit, mirror, package, GitHub push, and Drive upload pending at record creation.
- D: isolated mirror pending verification.
- GitHub: canonical remote is `https://github.com/Harris-Software-Solutions-LLC/Sanctuary-Studies.git`.
- Google Drive: upload to the existing `Sanctuary Studies` folder for `bachresearchgroup@gmail.com` pending.
- Packaging: explicit external-only package to E: and D: pending.
