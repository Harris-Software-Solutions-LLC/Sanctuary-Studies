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
