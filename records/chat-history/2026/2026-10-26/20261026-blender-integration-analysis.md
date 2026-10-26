# Sanctuary Studies Blender Integration Analysis

- Date: 2026-10-26
- Repository: `E:/Sanctuary Studies`
- Branch at analysis time: `scripture-v2`
- Scope: Read-only analysis of `E:/SanctuaryBatchTools` and `E:/SanctuaryWorkspace` for a future additive integration.

## Source findings

The supplied Blender package contains:

- `E:/SanctuaryBatchTools/AGENTS.md`, `HANDOFF.md`, and `START_HERE.txt`.
- An E:-adapted Blender runtime and workspace under `E:/SanctuaryWorkspace`.
- A procedural sanctuary builder at `E:/SanctuaryWorkspace/SanctuaryBuilder/bible_scene_builder.py`.
- A scene definition containing 48 main scenes plus two introductions: 24 Aaron scenes and 24 corresponding Jesus scenes.
- Current E: migration configuration and protected fallback metadata.
- A batch-1 pointer that currently contains only the step-1 Aaron/Jesus smoke pair.

The preparation reports explicitly state that Blender execution, PowerShell execution, full preliminary batch success, and visual review remain pending. `project_E.json` reports runtime preparation as verified but visual review as pending. The Blender runtime is approximately 15.9 GB and the animation workspace is approximately 265 MB, so the runtime must not be copied into the Sanctuary Studies repository or packaged into the Electron application.

The existing Sanctuary Studies repository already contains an offline `shared/content/explorer` package with four model records, 24 zones, six specialized tool records, Scripture references, Electron IPC handlers, preload methods, and Explorer/Atlas UI behavior.

## Proposal

Keep the Blender authoring environment external and E:-only. Add a new versioned package such as:

```text
shared/content/animation/
├── animation-v1.json
├── index.cjs
├── asset-manifest.json
├── provenance.json
└── README.md
```

The package will contain scene definitions, actor/step pairing, chart wording, source-chart provenance, Scripture references, review status, model bindings, preview asset references, and explicit limitations. It will not contain the 15.9 GB Blender runtime or unreviewed `.blend` copies.

The first runtime delivery should use verified local PNG/video previews and metadata. `.blend` files remain editable authoring sources in `E:/SanctuaryWorkspace`. An optional controlled “Open in Blender” action may launch Blender only when the user has configured a valid local E: path; it must never be required for the packaged Electron reader.

Animation content should connect to the existing model through additive content items and relationships:

- `animation_scene`
- `animation_preview`
- `animation_source`
- `illustrates_timeline_step`
- `paired_with`
- `depicts_sanctuary_model`
- `references_scripture`
- `has_preview`

The existing `explorer-v1.json` remains unchanged. The new package attaches to existing Wilderness Tabernacle and Heavenly Sanctuary records first; Solomon and Herod remain on their existing static Explorer content until dedicated Blender assets are available.

## UI integration

Extend the existing Explorer/Sanctuary Atlas view with an Animation view:

- 24 step rows, each showing Aaron and Jesus side by side.
- Step 0 introductions separated from the 24 paired steps.
- Daily/yearly filters.
- Preview image or local video panel.
- Chart wording, Scripture references, provenance, and review status.
- Actions to open the corresponding Timeline step, Bible Reader passage, or Study attachment.
- Clear “preliminary,” “visual review pending,” and “source review pending” states.
- Optional controlled “Open editable Blender source” action.

## Required gates before implementation is considered complete

1. Run the handoff smoke test on E: using `run_batches.ps1 -Batch 1 -Step 1 -Render Previews`.
2. Inspect the actual Aaron/Jesus PNGs and report runtime success separately from visual/content approval.
3. Build and inspect batch 1 before proceeding to batches 2–4.
4. Preserve the step-9 revision-2 path and all existing baselines.
5. Add package validation for 50 unique scene records, 24 Aaron/Jesus pairs, provenance, path safety, and asset hashes.
6. Run all existing Sanctuary Studies validation, content, Electron, Scripture, Explorer, learning, and lifecycle tests.
7. Confirm no existing route, content package, IPC method, or legacy workspace behavior was removed.
8. Package only after explicit release approval, using the existing E:/D: external-only packaging policy.

No Sanctuary Studies application code, Blender source, baseline, `.blend`, render, or external project file was modified during this analysis.
