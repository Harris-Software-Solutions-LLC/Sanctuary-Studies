# Sanctuary Studies application architecture

## Runtime boundaries

Sanctuary Studies has two native shells around one offline contract:

- `electron/` and `ui/` are the Windows desktop shell and Study Library renderer.
- `mobile/` is the Flutter Android/iOS shell.
- `shared/` contains the versioned database model, validation, store behavior, bundle format, and synchronization rules.
- The repository root remains the preserved Study Workspace compatibility surface. It is opened locally by Electron and is not deleted or silently replaced.

Neither shell requires a remote website, a web server, Chrome, Edge, Node.js, or network access for core study work. Electron embeds its runtime; Flutter compiles its native runtime into the Android/iOS application.

## Data flow

```text
Study Library / Flutter Study Library
          |
          v
Versioned shared model and validation
          |
  +-------+--------+
  |                |
Electron IPC     Flutter repository
  |                |
Local JSON      Local JSON
store           store
  |                |
  +-------+--------+
          |
       .ssbundle
```

The first implementation keeps the existing file-backed store because it is portable and testable without introducing a native database dependency. SQLite can be added behind the same store interface after the contract is stable; that change must preserve bundle compatibility and pass the migration tests.

## Preservation rules

1. The root workspace remains available through `Existing Study Workspace`.
2. New Study Library records are loaded from the shared local store, not demo data.
3. Study creation and section records are persisted before the UI reports success.
4. Imports validate the entire bundle before replacing local data.
5. Deletion is soft deletion through `deleted_at`; physical deletion is not part of the first offline release.
6. External navigation and permission requests remain blocked by the Electron shell.
7. Desktop packaging remains an explicit external-drive-only release action.

## Mobile sequencing

The Flutter target starts with Study Library, Study Detail, section records, search-ready local data, and bundle transfer. The larger Scripture, book, timeline, and sanctuary tools will be ported in feature groups against the acceptance inventory after this shared foundation is validated on an Android device.
