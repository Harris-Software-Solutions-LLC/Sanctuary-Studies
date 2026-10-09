# `.ssbundle` format

`.ssbundle` is a UTF-8 JSON document with the following envelope:

```json
{
  "format": "sanctuary-studies-bundle",
  "format_version": 1,
  "schema_version": 1,
  "exported_at": "2026-10-06T00:00:00.000Z",
  "source": "Sanctuary Studies desktop",
  "data": {
    "schema_version": 1,
    "studies": [],
    "sources": [],
    "notes": [],
    "entities": [],
    "relationships": [],
    "tags": [],
    "study_tags": []
  }
}
```

The bundle is designed for offline transfer between desktop and mobile. It contains no credentials, remote URLs, or executable content. Attachments referenced by `local_path` must be exported separately or added to a future archive manifest.

## Import/export behavior

- Desktop export is written only after the user chooses a destination in the native Electron save dialog.
- Desktop import is read through the native Electron open dialog and validated before replacing the local database.
- Mobile uses native platform file selection and saves the same JSON envelope with the `.ssbundle` extension.
- Unknown future schema versions are rejected without changing the existing local data.
- Deleted records are retained as tombstones through `deleted_at` so a future synchronization layer can reconcile them.
