# Electron acceptance matrix

Audit date: 2026-10-09. Branch: `UI`. No packaging was performed.

| ID | Acceptance check | Evidence | Status |
|---|---|---|---|
| EA-01 | E: is the authoritative working copy and branch is `UI` | Git status and AGENTS.md inspection | Passed |
| EA-02 | Canonical GitHub remote is Sanctuary Studies | `git remote -v` | Passed |
| EA-03 | Electron main process starts and shuts down | Bounded `electron.exe` probe with user data and logs on E: | Passed |
| EA-04 | Root workspace loads from a local file | `npm run test:electron` | Passed |
| EA-05 | All declared root routes activate | 21-route Electron harness | Passed |
| EA-06 | No external browser/network dependency is required | Harness recorded zero HTTP/HTTPS requests | Passed |
| EA-07 | Bible content renders locally | Exodus 25 rendered after `goToVerse` | Passed |
| EA-08 | Search interaction works | `sanctuary` produced 10 local result items | Passed |
| EA-09 | Timeline interaction works | `timelineNext()` advanced the displayed step | Passed |
| EA-10 | Local renderer storage round-trip works | `localStorage` audit value survived same-session round-trip | Passed |
| EA-11 | Invalid route does not throw | `navigate('not-a-real-route')` completed without exception | Passed, behavior needs fallback design |
| EA-12 | New Study Library renders | Local Electron capture of `ui/index.html` | Passed |
| EA-13 | Shared store persists data after reopening | `npm run test:store` | Passed |
| EA-14 | Shared store rejects invalid input | `npm run test:store` | Passed |
| EA-15 | New Library creates a persistent study | `npm run test:electron:library` creates through preload IPC and verifies after renderer reload | Passed |
| EA-16 | New Library Filter and Sort controls work | Renderer handlers and live table assertions | Passed |
| EA-17 | New Library loads shared-store records | `npm run test:electron:library` verifies persisted study text after reload | Passed |
| EA-18 | New Library button opens root workspace through real main IPC | Bridge exists; click-through was not automated | Not yet verified |
| EA-19 | Repeated legacy-window open/close preserves state | No lifecycle automation exists yet | Not yet verified |
| EA-20 | Main/preload IPC snapshot/create/add/export works end-to-end | `npm run test:electron:library` plus store bundle round-trip | Passed |
| EA-21 | Root notes, study references, and comparative data persist | No complete root persistence workflow was found | Not yet verified |
| EA-22 | Main/UI ancestry comparison | Remote `main` is at `3525b7a8`; local checkout lacks the remote main object/ref, so no merge-base was attempted | Incomplete by design |
| EA-23 | Google Drive archive recovery | Existing folder opened through Drive search; feature inventory and task record uploaded and read back | Passed |

## Commands executed

```text
npm test
npm run lint
npm run typecheck
npm run test:shared
npm run test:store
npm run test:electron
 npm run test:electron:library
node --check scripts/test-electron-root-workspace.cjs
electron scripts/capture-ui.cjs E:\Sanctuary Studies\sanctuary-studies-ui-branch-preview.png E:\Sanctuary Studies\ui\index.html
```

All executed commands passed. The `git diff --check` invocation was repeated with the repository path explicitly supplied because the shell did not honor its working-directory parameter for that standalone Git command; the corrected check is recorded before commit.
