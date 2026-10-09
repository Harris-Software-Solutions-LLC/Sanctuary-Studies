# Sanctuary Studies — Symbolism, Sacred Colors, and Study Lifecycle

Date: 2026-10-09
Branch: UI
Repository: `https://github.com/Harris-Software-Solutions-LLC/Sanctuary-Studies.git`

## Request

Continue the additive legacy-content migration after Scripture and Digital Library by integrating Symbolism and Sacred Colors into the five shared workspace views. Also provide users with safe study archive/delete controls and a preferred local-storage location, while preserving the legacy routes and Electron-only offline behavior.

## Implemented

- Imported and normalized 16 symbolism records from the preserved legacy data:
  - 7 furnishings
  - 5 offerings
  - 4 priesthood records
- Imported 8 sacred-color records and 55 Scripture references.
- Added versioned packages under `shared/content/symbolism/` and `shared/content/colors/`, including indexes, provenance, and documentation.
- Added content loaders, typed normalization boundaries, Scripture-reference relationships, Electron IPC handlers, and restricted preload methods.
- Integrated Symbolism and Sacred Colors into Scholar’s Desk, Codex Cabinet, Sanctuary Atlas, Research Folio, and Evidence Wall.
- Preserved the legacy Scripture, Library, book-viewer, Symbolism, and Colors routes.
- Added archive/restore and soft-delete study actions. Deletion preserves the record in the local store as archived/deleted state rather than silently removing data.
- Added Settings controls for choosing a preferred local storage folder. The current bundle is copied without overwriting an existing target file, and the preference is retained for later launches.
- Corrected `scripts/test-electron-study-lifecycle.cjs` so the Electron lifecycle test parses and reports failures through its guarded runner instead of opening the old JavaScript error dialog.

## Validation

The complete validation suite passed:

- core validation, lint, and type-check
- shared model and store persistence tests
- 24-step timeline and 189-question package tests
- Scripture package tests: 1,741 items, 49 relationships, 258 searchable references
- Digital Library tests: 5 books, 112 chapters, 112 excerpts, 46 Scripture references
- Symbolism/Colors tests: 16 symbolism records, 8 colors, 55 Scripture references
- Electron study lifecycle: archive, restore, soft delete, and storage information
- Electron library, Scripture, Digital Library, Symbolism/Colors, and root-workspace acceptance suites
- preserved legacy route sweep: 21 routes
- Electron external-request checks: none detected

The recurring screenshot dialog was traced to stale Electron test processes holding an earlier syntactically invalid version of the lifecycle script. Those exact Sanctuary Studies test processes were stopped. A clean rerun passed, and no stale lifecycle-test process remained.

## Delivery status

GitHub push, D: mirror, Google Drive upload, and explicit E:/D: external packaging are performed after this record is staged and committed. No C: packaging output is permitted.
