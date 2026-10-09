# Functional acceptance report

## Executive summary

The preserved root Study Workspace has a reproducible Electron baseline. All 21 declared routes loaded, local Bible and timeline interactions worked, search returned local results, persistence and invalid-input behavior passed in the shared store, and the runtime made zero external HTTP/HTTPS requests.

The new Study Library is now connected to the shared local store through restricted Electron IPC. Study creation, live record counts, section records, filtering, sorting, and validated `.ssbundle` import/export work without external HTTP/HTTPS requests. The root Study Workspace remains available as a compatibility surface.

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
- Electron Study Library create/reload persistence and section-record test.
- Electron native bundle import/export bridge implementation.
- Existing validator, lint, type-check, and shared-model tests.
- New UI Electron capture.

## Low-risk stabilization completed

- Added CSP metadata to the root and new UI entry points.
- Skipped service-worker registration for `file://` Electron sessions while preserving non-file behavior.
- Added `scripts/test-electron-root-workspace.cjs` and `scripts/test-store-persistence.cjs`.
- Added `npm run test:electron` and `npm run test:store`.

## Failures and incomplete behavior

There were no route-rendering failures in the acceptance harness. The following are known incomplete behaviors:

1. Collection persistence and user preference persistence remain deferred.
2. Root study notes, references, and comparative-study persistence are not established.
3. The root invalid-route behavior avoids throwing but leaves no explicit fallback page.
4. Flutter source is implemented but cannot be analyzed until the Flutter SDK is available.

## Data integrity concerns

- The shared model validates foreign keys and bundle structure, but the current new UI bypasses it with demo data.
- `importBundle` exists in the store but is not exposed through Electron IPC.
- The root workspace has localStorage behavior but does not use the versioned shared schema.
- The two UI surfaces can therefore display different study realities until a controlled data adapter is added.

## Priority order for the next phase

1. Add edit flows for existing studies and section records.
2. Add collection and preference persistence without changing the version-1 bundle contract.
3. Validate the Flutter target on Android and establish the macOS/Xcode iOS build lane.
4. Define how root workspace features map into the Study-centered shell.
5. Port root workspace feature groups only after their acceptance tests are defined.
