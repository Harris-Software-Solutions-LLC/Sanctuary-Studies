# Sanctuary Studies UI branch prototype

This folder is a parallel UI prototype for the `UI` branch. It does not replace the existing root UI files. The prototype implements the formal `plan.md` direction:

- Local research workspace instead of a marketing landing page.
- Study Library as the first screen.
- Compact table-first study browsing.
- Warm parchment, ink, sage, and brass visual language.
- Contextual inspector for the selected study.
- Local-only status and no external assets.
- Keyboard-friendly search and selection.

The prototype uses demo records until the shared store is connected to the final renderer.

## Preserved root workspace

The `Existing Study Workspace` navigation action opens the original root `index.html` application in a second local Electron window. This is an additive compatibility bridge: the root workspace files remain in the repository and are not replaced, removed, or loaded from a remote browser or web server.
