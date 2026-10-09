# ZIP functionality reference comparison

## Scope

The supplied `project-bolt-sb1-3nfg6yvm.zip` was inspected read-only. GitHub configuration and repository metadata were excluded. The ZIP was not extracted into Sanctuary Studies and is not a runtime dependency.

## Findings

- 274 archive entries; 185 TypeScript/JavaScript source files; approximately 52,098 source lines.
- 37 React route declarations, including professional/classic variants and detail routes.
- 20 Supabase migration files covering scripture, library, timeline learning, symbolism, colors, sanctuary models, books, comparisons, user progress, and related tables.
- 31 files reference BabylonJS or 3D behavior.
- Three local sanctuary model JSON files are present.
- The timeline source contains 25 zero-based entries (`0–24`) and 189 structured questions across three question types.
- Sanctuary Studies currently preserves the root workspace as a local Electron compatibility surface and exposes 21 tested root routes.
- The current shared schema v1 contains seven study-centered tables: studies, sources, notes, entities, relationships, tags, and study_tags.

## Architecture decision

The ZIP is a functionality and content reference, not an implementation source. Supabase, payment, authentication, forum, public-profile, hosted-font, external-image, and web-hosting code is excluded from the offline Electron/mobile runtime.

Content is being ported into versioned local packages under `shared/content/`. Schema v2 adds content records and study links without deleting or reshaping schema-v1 tables.

## Timeline normalization

The source entry with `step: 0` is preserved as `prelude` and is intentionally not counted as a numbered step. Source entries `1–24` are exposed as the 24 numbered user-facing steps. All 189 questions are retained; questions from source step 0 remain associated with the prelude.

## Recommended sequence

1. Timeline and learning content.
2. Scripture and cross-references.
3. Sources and Digital Library.
4. Symbolism and colors.
5. Sanctuary comparison.
6. Local 3D explorer assets after provenance and licensing review.
7. Educator resources as local reference content.

Every imported package must carry provenance, validation, and a declared licensing-review state.
