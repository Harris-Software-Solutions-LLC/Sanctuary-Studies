# Digital Library content package

`library-v1.json` is the first Digital Library vertical slice imported from the preserved legacy application.

It contains five books and 112 chapter/excerpt records, including titles, authors, publication years, descriptions, categories/tags, table-of-contents data, preserved excerpt text/HTML, Scripture references, legacy page identifiers, and an explicit local-path field for future attachment of user-owned files.

`index.cjs` converts the package into shared `content_items` and `content_relationships`:

- `library_book`
- `library_chapter`
- `library_excerpt`
- `scripture_reference` stubs that merge safely with the Scripture package
- `contains_chapter`
- `contains_excerpt`
- `related_source`
- `cites_scripture`

The Electron main process owns package access; the renderer receives only allow-listed preload methods. The preserved root Library and book-viewer routes remain unchanged.
