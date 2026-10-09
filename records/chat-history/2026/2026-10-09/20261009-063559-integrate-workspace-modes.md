# Sanctuary Studies task record — five workspace modes

- Date: 2026-10-09
- Branch: `UI`
- Repository: `https://github.com/Harris-Software-Solutions-LLC/Sanctuary-Studies.git`
- Authoritative working copy: `E:\Sanctuary Studies`
- Mirror: `D:\Sanctuary Studies`

## User-visible request

Begin integrating five selectable UI modes over the same Sanctuary Studies data model while continuing the additive port from the preserved legacy workspace into `shared/content/` packages. The requested modes are Scholar’s Desk, Codex Cabinet, Sanctuary Atlas, Research Folio, and Evidence Wall.

## Implementation

- Added one shared Study Workspace shell with a persistent view selector.
- Added Scholar’s Desk as the default study overview with study context, recent activity, counts, quick source/note actions, and inspector support.
- Added Codex Cabinet source cards with author, source type, citation status, notes, and archive context.
- Added Sanctuary Atlas integration using the existing local 24-step timeline, Aaron/Jesus references, learning prompts, and content attachment.
- Added Research Folio for focused note reading with a note index and source references.
- Added Evidence Wall for shared source, note, entity, and tag objects with recorded entity relationships.
- Added per-study workspace-mode preference storage in local-only UI preferences without changing the study schema.
- Added the versioned shared content-package manifest and package boundaries for scripture, timeline, library, sanctuary, symbolism, colors, learning, and provenance.
- Kept the preserved legacy workspace and all existing records/routes available.

## Validation

- Repository validation, lint, and type-check passed.
- Shared model, store persistence, and 24-step timeline tests passed.
- Electron library acceptance passed with all five modes, per-study mode memory, timeline loading/attachment, persistence, and zero external requests.
- No Electron packaging was run before this implementation was committed.

## Archive status

- E: implementation is authoritative and ready for commit/push.
- D: the exact implementation files and this record will be mirrored under `D:\Sanctuary Studies`.
- GitHub: implementation commit pending push to `UI`.
- Google Drive: this record will be uploaded to the existing `Sanctuary Studies` folder associated with `bachresearchgroup@gmail.com`.
- Packaging: a separate external-only build will follow the implementation commit and will be written only to the requested E:/D: build directories.
- No Muzicle, MMC, Canon and Imitation, unrelated repository, C: output, or external web dependency was used.
