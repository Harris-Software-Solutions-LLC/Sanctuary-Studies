# Scripture content package

`scripture-v2.json` is the complete offline 66-book KJV package. It replaces the v1 legacy-only text slice for the new Scripture workspace while leaving `scripture-v1.json` available as historical source material.

It contains:

- exactly 66 KJV book records, with no Apocrypha;
- 1,189 chapter records;
- 31,102 KJV verse records, covering every indexed chapter;
- 8 sanctuary-focused Scripture passages;
- 258 searchable Scripture references;
- 6 cross-reference groups;
- 6 study notes.

The verse text is imported from Project Gutenberg eBook 7999, *The Bible, King James Version, Complete Contents, Books 1–66*. The source is retained at `sources/kjv-gutenberg-7999.txt`, including its license notice. Project Gutenberg identifies this historical KJV text as public domain in the United States; jurisdiction-specific legal review remains the responsibility of anyone redistributing it outside the United States.

`index.cjs` loads the package and converts its records into shared `content_items` and `content_relationships`. The Electron main process owns package access; the renderer receives only the allow-listed preload methods.

The package is local-only and versioned independently from the UI. Its provenance is recorded in `provenance.json`. The importer is `scripts/import-complete-kjv.cjs`; it rejects non-66-book entries, normalizes the eight known `0$` source labels for Exodus through 1 Samuel, and excludes the Gutenberg license tail from verse text. The legacy `Bible` and `Scripture Navigator` routes remain unchanged and are still available through the compatibility window.
