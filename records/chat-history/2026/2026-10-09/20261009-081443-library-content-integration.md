# Sanctuary Studies — Digital Library integration

- Date: 2026-10-09
- Branch: `UI`
- Authoritative workspace: `E:\Sanctuary Studies`
- Isolated mirror: `D:\Sanctuary Studies`
- Scope: additive Digital Library and source-record integration; no Muzicle, MMC, Canon and Imitation, or unrelated repository access.
- Source revision: `648a7683a3b11b712744a977ef1ecfd83e42922e`
- Status at record creation: implementation and local acceptance testing complete; mirror, commit, GitHub push, Drive archive, and external packaging pending.

## Imported legacy content

The legacy `app-data.js`, `app-core.js`, and `app-books.js` surfaces were normalized into the versioned offline package:

`shared/content/library/`

- 5 books
- 112 chapters
- 112 preserved excerpts, with both text and source HTML
- 46 unique indexed Scripture references
- Book metadata, authors, publication years, descriptions, categories/tags, chapter metadata, local-source provenance, and legacy page identifiers

The package creates shared content items for `library_book`, `library_chapter`, `library_excerpt`, and detected Scripture references. It creates `contains_chapter`, `contains_excerpt`, `related_source`, and `cites_scripture` relationships. Existing Scripture payloads remain protected when a later library package carries a smaller reference stub.

## UI integration

- Added a Library study section with offline search, book/chapter/excerpt reading, Scripture-reference links, local attachment, and export participation.
- Added Library context to Scholar’s Desk, Codex Cabinet, Research Folio, Sanctuary Atlas, and Evidence Wall.
- Added source-card matching, `Open in Library`, author/citation/provenance context, and local file-path display.
- Kept the legacy Library and book-viewer routes unchanged.
- Added restrained scholarly styling for the Library workspace without replacing the existing UI shell.

## Verification

Passed on E: with no external requests:

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run test:shared`
- `npm run test:store`
- `npm run test:timeline`
- `npm run test:scripture`
- `npm run test:library`
- `npm run test:electron:library`
- `npm run test:electron:scripture`
- `npm run test:electron:library-content`
- `npm run test:electron`
- `git diff --check`

The dedicated Digital Library Electron acceptance test confirms offline loading, search, chapter opening, study attachment, source linking, all five workspace modes, export relationships, and zero external requests. The preserved root Electron acceptance test confirms the legacy Library, all five book routes, Scripture, timeline, symbolism, colors, sanctuary, comparison, explorer, media, educator, forum, profile, and other routes remain functional.

## Delivery record

The following delivery actions remain part of this task and will be recorded in the follow-up append-only package record: exact changed-file mirror to D:, UI commit and `origin/UI` push, upload of this record to the existing Sanctuary Studies Drive folder for `bachresearchgroup@gmail.com`, and explicit external-only Windows packaging to matching E: and D: build directories. No C: packaging output is authorized.
