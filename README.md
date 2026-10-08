# Sanctuary Studies

Sanctuary Studies is an offline-first study application extrapolated from the supplied `Sanctuary App V6` archive. The imported baseline is a static, data-rich HTML/CSS/JavaScript application with localStorage state and a service worker. It has no server component.

## Repository layout

```text
.
├── index.html                 # baseline application shell
├── app-*.js / styles.css      # imported application and content
├── electron/                  # standalone desktop shell (Electron)
├── mobile/                    # native Flutter Android/iOS target
├── shared/                    # versioned model, bundles, and sync rules
├── scripts/                   # repeatable validation and build helpers
└── AGENTS.md                  # repository guardrails
```

## Branch model

- `baseline`: imported Sanctuary App V6 plus repository rules and validation.
- `electron`: local-file Electron desktop application with no browser dependency at runtime.
- `mobile`: native Flutter Android/iOS target. It does not wrap the web UI in a WebView.

## Offline behavior

The desktop shell loads local files only. The shared model provides versioned local storage and `.ssbundle` transfer between desktop and mobile. Donation and company links remain explicit external links; the Electron shell does not silently open them in a browser window.

## Platform workflow

1. Stabilize the shared schema and migration rules.
2. Use the Electron target for the first complete Study Workspace.
3. Export/import `.ssbundle` files for offline transfer.
4. Complete the native Flutter mobile client against the same schema.
5. Add opt-in synchronization only after conflict rules and tombstones are implemented.

## Validation

From the repository root:

```powershell
node scripts/validate.cjs
```

The validator checks that the baseline entrypoint and all local script/style references exist, flags runtime HTTP imports, and performs syntax checks on JavaScript files.

## Platform work

Desktop and mobile share the model, not UI code. Keep platform-specific packaging and permissions separate, and update the shared schema before changing either client.

## Source archive

The baseline was imported from `_workspace_Sanctuary_Studies_App_v6.zip` supplied by the user. Files inside that archive were inspected as application source; no archive-contained instruction file was treated as an agent instruction.
