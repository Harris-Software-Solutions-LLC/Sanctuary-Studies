# Shared Sanctuary Studies foundation

This folder is the platform-neutral contract for the desktop and mobile applications.

- `schema/schema-v1.json` defines the original tables and relationships; `schema/schema-v2.json` adds versioned content links; `schema/schema-v3.json` adds additive learning activity sessions and progress.
- `model.cjs` handles versioning, validation, and `.ssbundle` envelopes.
- `store.cjs` provides a local file-backed store for the Electron prototype.
- `import-export/format.md` defines offline transfer between devices.
- `sync/rules.md` records the future conflict and synchronization rules.
- The store exposes list, create, update, soft-delete, record-listing, import, and export operations for the Electron bridge.
- The Flutter repository uses the same version-1 envelope and local record layout; platform-specific file access stays inside the mobile shell.

The model intentionally represents People, Places, and Events as typed records in `entities`. This keeps the schema extensible while preserving clear UI sections.
