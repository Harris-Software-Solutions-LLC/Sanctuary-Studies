# Scripture content package

`scripture-v1.json` is the first Scripture vertical slice imported from the preserved legacy application.

It contains:

- 66 KJV book records;
- 1,189 chapter records;
- 214 preserved verse texts from the legacy data set;
- 8 sanctuary-focused Scripture passages;
- 258 searchable Scripture references;
- 6 cross-reference groups;
- 6 study notes.

`index.cjs` loads the package and converts its records into shared `content_items` and `content_relationships`. The Electron main process owns package access; the renderer receives only the allow-listed preload methods.

The package is local-only and versioned independently from the UI. Its provenance is recorded in `provenance.json`. The legacy `Bible` and `Scripture Navigator` routes remain unchanged and are still available through the compatibility window.
