# Sanctuary Studies workspace modes

The UI branch uses one shared Study Workspace shell with five views over the same local records. The views do not create separate data stores or duplicate business logic.

## Modes

1. **Scholar’s Desk** — the default overview with study context, recent activity, record counts, and quick actions.
2. **Codex Cabinet** — annotated source cards with author, source type, citation, notes, and archive context.
3. **Sanctuary Atlas** — the 24-step timeline with Aaron/Jesus pairings, references, learning questions, and linked content.
4. **Research Folio** — focused note reading with a note index, source references, and local writing surface.
5. **Evidence Wall** — source, note, entity, and tag objects with recorded relationships shown as connections.

## Shared-shell rules

- The Electron main process and restricted preload remain the only filesystem/data boundary.
- All modes read the same `studies`, `sources`, `notes`, `entities`, `relationships`, `tags`, content tables, and provenance records.
- The selected mode is remembered per study as a local UI preference. This preference does not change study data and is safe to move to a shared preference table later.
- The preserved root workspace remains available through **Existing Study Workspace**.
- Legacy content is ported into `shared/content/` packages separately from presentation code.

## Future integration order

1. Promote Scripture and cross-references into the shared Scripture package.
2. Promote Library book metadata and local chapters into the shared Library package.
3. Promote sanctuary, symbolism, colors, and learning records with provenance.
4. Connect Evidence Wall relationships to content relationships and study-content links.
5. Replace compatibility-only root routes one feature group at a time after acceptance tests pass.
