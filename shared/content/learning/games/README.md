# Sanctuary Studies Interactive Learning Games

`games-v1.json` is an offline, versioned catalog of 30 curated activities: five each of multiple choice, fill-in-the-blank, true/false, Scripture linking, matching, and symbolism. The definitions are immutable content. Sessions, attempts, and mastery are stored separately in schema v3 and travel through the normal `.ssbundle` export/import path.

The package is intentionally data-driven so Electron and the future Flutter client can share the same definitions and answer rules. It does not load remote scripts, images, fonts, or web services. Every activity carries Scripture references, objectives, explanations, and source-content identifiers. The content is marked `review-required`; theological and licensing review remains part of the provenance workflow.

The first runtime includes keyboard-friendly answering, retry, review explanations, private progress, difficulty/age filters, and a Create Activity planning surface. User-authored activities must remain separate from the built-in package and must never overwrite it.
