# Sanctuary Studies feature inventory

## Audit scope

- Repository: `Harris-Software-Solutions-LLC/Sanctuary-Studies`
- Branch: `UI`
- Working copy: `E:\Sanctuary Studies`
- Audit baseline: `1812e6c`
- Runtime: local Electron entry points only; no browser or web server
- Status meanings: **Working** means exercised by the audit; **Partially working** means some behavior is verified but an important path is incomplete; **Not yet verified** means the code exists or is reachable but the audit has not exercised the behavior; **Unimplemented** means the current UI exposes no behavior for the control.

## New Study Library UI

| Surface | Location | Status | Finding |
|---|---|---|---|
| Study Library table | `ui/index.html`, `ui/app.js`, Electron IPC | Working | Loads active studies from the shared local store, supports row selection, and calculates live record counts. |
| Global and table search | `ui/app.js` | Working | Search filters persisted study titles, descriptions, and statuses and keeps the two search fields synchronized. |
| Study inspector | `ui/app.js` | Working | Selected study status, live counts, tags, updated time, and local-storage state render from shared records. |
| New Study dialog | `ui/index.html`, `ui/app.js`, `shared/store.cjs` | Working | Validates the title, persists the study through Electron IPC, and displays errors without closing on failure. |
| Existing Study Workspace | `ui/app.js`, Electron preload/main | Not yet verified end-to-end | The local IPC bridge is present and the root workspace loads independently, but a real click-through from the new window was not automated in this audit. |
| Collections | `ui/index.html`, `ui/app.js` | Partially working | Opens an explicit explanatory workspace surface; collection persistence is deferred. |
| Data Model | `ui/index.html`, `ui/app.js` | Working | Opens the version-1 shared-contract summary. |
| Import / Export | `ui/index.html`, `ui/app.js`, Electron IPC | Working | Native Electron dialogs import and export validated `.ssbundle` files. |
| Settings | `ui/index.html`, `ui/app.js` | Partially working | Opens the local-runtime settings surface; preference persistence is deferred. |
| Filter and Sort controls | `ui/index.html`, `ui/app.js` | Working | Cycles status filters and toggles updated/title sorting. |

## Preserved root Study Workspace

The root application remains in `index.html`, `app-core.js`, `app-data.js`, `app-books.js`, `app-pages1.js`, `app-pages2.js`, `app-pages3.js`, `styles.css`, and `badge-override.js`. All listed routes loaded without renderer failure in the Electron acceptance harness.

| Route or feature | Status | Audit finding |
|---|---|---|
| Home | Working | Loads and renders the home page. Existing promotional/donation content remains preserved. |
| KJV Bible | Working | Route loads; Exodus 25 content rendered during the audit. |
| Scripture Navigator | Working | Route loads; deeper passage selection is not yet verified. |
| Digital Library | Working | Route loads. |
| Crosier, Haskell, Andreasen, Gilbert, and Defense book viewers | Working | All five viewer routes loaded; full content/search integrity is not yet verified. |
| Ministry Timeline | Working | Route loads and next-step control advanced during the audit. Play, previous, and reset are not yet verified. |
| Investigative Judgment | Working | Route loads; tab-by-tab behavior is not yet verified. |
| Symbolism Explorer | Working | Route loads; all content tabs are not yet verified. |
| Sacred Colors | Working | Route loads; item selection/detail behavior is not yet verified. |
| Heavenly Portal | Working | Route loads; stage transitions are not yet verified. |
| Sanctuary Comparison | Working | Route loads; comparison tabs are not yet verified. |
| 3D Sanctuary Explorer | Working | Route loads; interactive model behavior is not yet verified. |
| Media | Working | Route loads; Podcasts, Video Series, and Discussion Guides tabs are not yet verified. |
| Educators | Working | Route loads; resource actions are not yet verified. |
| Forums | Working | Route loads; posting is intentionally sign-in-gated and not a local persistence feature. |
| Profiles | Working | Route loads; profile persistence is not yet verified. |
| Myths vs Facts | Working | Route loads; category filtering is not yet verified. |
| Global search | Working | Search for `sanctuary` produced 10 local result items; result navigation was not fully exercised. |
| Mobile navigation/menu | Not yet verified | Controls are present but were not exercised in this desktop audit. |
| Keyboard shortcuts | Not yet verified | Root keyboard behavior was not fully exercised. |

## Data and persistence

| Area | Status | Finding |
|---|---|---|
| Shared schema v1 | Working | Schema and model validation pass for studies, sources, notes, entities, relationships, tags, and study tags. |
| Shared store persistence | Working | A study and note survived store reopening in the E: persistence test. |
| Shared store invalid input | Working | Empty study titles and missing-study records return errors. |
| New UI to shared store | Working | The renderer reads snapshots and persists studies and section records through the restricted Electron preload bridge. |
| Root workspace study persistence | Partially working | Local storage is used for the donation dismissal; no complete study/notes persistence workflow is present in the root UI. |
| Export bundle model | Working | Shared model round-trip export/parse tests pass. |
| Electron export IPC | Working | Native save-dialog export is exposed through main/preload and backed by the validated bundle model. |
| Electron import IPC | Working | Native open-dialog import validates the bundle before replacing local data. |

## Local-runtime and safety findings

- The Electron harness made zero `http://` or `https://` requests while loading and exercising the root workspace.
- `file://` service-worker registration is now skipped; web deployment behavior remains conditional for non-file protocols.
- CSP metadata was added to both local entry points.
- The root workspace contains an external Harris Software Solutions hyperlink, but Electron navigation restrictions prevent leaving the local entry point.
- IPC handlers rely on shared-store errors being returned through rejected promises; the new UI still needs visible error presentation when it is connected to those handlers.
