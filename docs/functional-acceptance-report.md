# Functional acceptance report

## Executive summary

The preserved root Study Workspace has a reproducible Electron baseline. All 21 declared routes loaded, local Bible and timeline interactions worked, search returned local results, persistence and invalid-input behavior passed in the shared store, and the runtime made zero external HTTP/HTTPS requests.

The new Study Library is a visual prototype rather than a connected data surface. Its demo records, placeholder navigation, Filter/Sort buttons, and New Study form must be connected to the shared store before it can replace the root workspace as the primary research surface.

## Passed

- Electron startup and bounded shutdown probe on E:.
- Local root entry-point loading.
- All 21 root routes.
- Local-only runtime check with zero external HTTP/HTTPS requests.
- Bible rendering and search behavior.
- Timeline next-step interaction.
- Same-session local storage round-trip.
- Shared store persistence after reopening.
- Shared store invalid-input handling.
- Existing validator, lint, type-check, and shared-model tests.
- New UI Electron capture.

## Low-risk stabilization completed

- Added CSP metadata to the root and new UI entry points.
- Skipped service-worker registration for `file://` Electron sessions while preserving non-file behavior.
- Added `scripts/test-electron-root-workspace.cjs` and `scripts/test-store-persistence.cjs`.
- Added `npm run test:electron` and `npm run test:store`.

## Failures and incomplete behavior

There were no route-rendering failures in the acceptance harness. The following are known incomplete behaviors:

1. The new Study Library does not load or save shared-store records.
2. New Study submission does not persist a study.
3. Filter, Sort, Collections, Data Model, Import / Export, and Settings controls are placeholders.
4. Main/preload IPC has not yet had an end-to-end renderer test.
5. Root study notes, references, and comparative-study persistence are not established.
6. The root invalid-route behavior avoids throwing but leaves no explicit fallback page.
7. Drive archive writes still return 404.

## Data integrity concerns

- The shared model validates foreign keys and bundle structure, but the current new UI bypasses it with demo data.
- `importBundle` exists in the store but is not exposed through Electron IPC.
- The root workspace has localStorage behavior but does not use the versioned shared schema.
- The two UI surfaces can therefore display different study realities until a controlled data adapter is added.

## Priority order for the next phase

1. Add an Electron IPC smoke harness for snapshot, create study, add record, export, and error paths.
2. Connect the new Study Library to the shared store without removing the demo fallback.
3. Make New Study persist through IPC and show visible error states.
4. Add explicit study workspace navigation for Sources, Notes, People, Places, Events, and Tags.
5. Implement Import / Export through a versioned `.ssbundle` file workflow.
6. Define how root workspace features map into the Study-centered shell.
7. Resolve the GitHub `main` history comparison using a controlled, read-only object inspection before considering an integration branch.
8. Reconnect Drive and verify the pending archive without creating a replacement folder.
