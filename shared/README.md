# Shared Sanctuary Studies foundation

This folder is the platform-neutral contract for the desktop and mobile applications.

- `schema/schema-v1.json` defines the tables and relationships.
- `model.cjs` handles versioning, validation, and `.ssbundle` envelopes.
- `store.cjs` provides a local file-backed store for the Electron prototype.
- `import-export/format.md` defines offline transfer between devices.
- `sync/rules.md` records the future conflict and synchronization rules.

The model intentionally represents People, Places, and Events as typed records in `entities`. This keeps the schema extensible while preserving clear UI sections.
