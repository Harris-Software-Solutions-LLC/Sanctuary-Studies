# Interactive Learning module

Sanctuary Studies now includes an additive Learning workspace for learning the Sanctuary from the Bible. The workspace has four sections:

- **Resources** opens the preserved educator-resource package.
- **Interactive Games** provides the first six local engines: multiple choice, fill-in-the-blank, true/false, Scripture-reference linking, matching, and symbolism.
- **Progress** shows private per-study completion, best score, attempts, and mastery level.
- **Create Activity** documents the authoring boundary for the next phase without allowing user content to overwrite built-in activities.

## Content and runtime boundaries

Built-in activities live in `shared/content/learning/games/games-v1.json`. They are immutable, versioned content records with objectives, age group, difficulty, explanations, Scripture references, and provenance. The index converts them to shared `content_items` so the same content can be consumed by Electron and a future Flutter client.

User activity is separate from the definitions. Schema v3 adds `learning_games`, `game_sessions`, `game_attempts`, and `learning_progress`. These records are validated and included in `.ssbundle` export/import. The Electron renderer reaches the store only through the allow-listed preload API; no web server, browser, remote script, or external request is required.

## Learning quality rules

Text answers normalize case, whitespace, and common punctuation; packages can include approved alternate spellings. The UI supports keyboard operation, visible focus, retry, hints, explanation review, untimed sessions, and private progress. Symbolic claims remain marked `review-required` and expose their Scripture references and provenance rather than presenting an activity as a replacement for source study.

## Future additions

The next data-driven activity types can be added without changing the existing engines: 24-step timeline sequencing, floorplan labeling, source identification, myth-versus-evidence, comparison completion, evidence-chain construction, prophecy calculations with visible reasoning, flashcards/spaced review, and private reflection prompts. User authoring should create a separate local activity package and export it through `.ssbundle`; it must never mutate the built-in catalog.
