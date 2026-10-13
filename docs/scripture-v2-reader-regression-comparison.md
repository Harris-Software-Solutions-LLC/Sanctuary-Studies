# Scripture v2 Bible Reader regression comparison

Date: 2026-10-13

## Comparison scope

The comparison was performed on the isolated `scripture-v2` branch. The existing Study Workspace, shared model, legacy routes, content packages, Electron preload bridge, and external-only packaging policy were kept in place. The new work adds the complete local KJV reader and selected Scripture attachment behavior; it does not remove or replace the preserved legacy Bible route.

Baseline commit before this implementation: `594a400` (`Record Scripture v2 package label correction`).

Final implementation commit: `f733c51` (`Build complete offline KJV Bible Reader`).

## 1:1 acceptance comparison

| Area | Before baseline | After final commit | Result |
| --- | --- | --- | --- |
| Shared model and persistence | Passing | Passing | Preserved |
| 66-book KJV package | 66 books, 1,189 chapters, 31,102 verses, no Apocrypha | Same counts, plus selected book/chapter/verse attachment filtering | Preserved and extended |
| Timeline | 24 steps and 189 questions | Same | Preserved |
| Digital Library | Passing | Passing | Preserved |
| Symbolism and Sacred Colors | Passing | Passing | Preserved |
| Sanctuary, Learning, Explorer packages | Passing | Passing | Preserved |
| Electron Library and study lifecycle | Passing | Passing | Preserved |
| Electron content integrations | Passing | Passing | Preserved |
| External requests | None in Electron content tests | None in Electron content tests | Preserved |
| Root validation | Existing failures for the unrelated working-tree `index.html` doctype/path references | Same failures; `index.html` was not part of this commit | No new failure |
| Legacy root Electron test | Existing `navigate is not defined` failure in the preserved root workspace test | Not changed by this implementation | No new failure |

## New reader checks

- Every one of the 66 books resolves from the local Scripture package.
- All 1,189 chapters return at least one complete local verse list.
- Genesis 1, Exodus 25, 2 Kings 1, Hebrews 9, and Revelation 22 open in Electron.
- Verse selection opens and highlights the requested verse.
- Previous/Next chapter navigation works.
- Search covers books, chapters, verses, references, and verse text.
- Scripture links in Scholar’s Desk, Codex Cabinet, Sanctuary Atlas, Research Folio, and Evidence Wall remain connected.
- Complete-KJV, chapter, and verse attachments export through the existing content model.
- No Apocrypha records are present.
- Electron request interception recorded zero HTTP/HTTPS requests.

## External packages

- E: `E:\Sanctuary Studies Builds\win-unpacked-scripture-v2-kjv-reader-final-20261013-193622` — 74 files, 342.23 MB.
- D: `D:\Sanctuary Studies Builds\win-unpacked-scripture-v2-kjv-reader-final-20261013-193622` — 74 files, 342.23 MB.
- E: and D: final directory counts and total bytes matched.
- The packaged archive contains `electron/main.cjs`, `electron/preload.js`, `ui/app.js`, and `shared/content/scripture/scripture-v2.json`.
- No new `win-unpacked*`, `dist`, `out`, `release`, or `output` directory was created in the C: Sanctuary workspace.

## Drive status

The existing Drive search still returns the `Sanctuary Studies` folder ID `1UgfVM9yuDSC4vlThP9s539u4F_fRIHa`, but listing that folder through the connected Drive interface returns HTTP 404 (`File not found`). No replacement folder was created and no file was uploaded outside the requested folder. Drive mirroring remains unresolved until that existing folder becomes accessible through the connector.
