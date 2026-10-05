# Sanctuary Studies

Sanctuary Studies is an offline-first study application extrapolated from the supplied `Sanctuary App V6` archive. The imported baseline is a static, data-rich HTML/CSS/JavaScript application with localStorage state and a service worker. It has no server component.

## Repository layout

```text
.
├── index.html                 # baseline application shell
├── app-*.js / styles.css      # imported application and content
├── electron/                  # standalone desktop shell (electron branch)
├── mobile/                    # Android/iOS target configuration (mobile branch)
├── scripts/                   # repeatable validation and build helpers
└── AGENTS.md                  # repository guardrails
```

## Branch model

- `baseline`: imported Sanctuary App V6 plus repository rules and validation.
- `electron`: local-file Electron desktop application with no browser dependency at runtime.
- `mobile`: Capacitor Android/iOS target that reuses the same local application UI inside native platform projects.

## Offline behavior

The baseline no longer imports Google Fonts at runtime. It uses local system font fallbacks, so the desktop and mobile targets can render without a network connection. Donation and company links remain explicit external links; the Electron shell does not silently open them in a browser window.

## Validation

From the repository root:

```powershell
node scripts/validate.cjs
```

The validator checks that the baseline entrypoint and all local script/style references exist, flags runtime HTTP imports, and performs syntax checks on JavaScript files.

## Platform work

The Electron and mobile branches are intentionally separate because their packaging, permissions, and release tooling differ. Keep shared content and UI changes in the common baseline, then merge or cherry-pick them into platform branches.

## Source archive

The baseline was imported from `_workspace_Sanctuary_Studies_App_v6.zip` supplied by the user. Files inside that archive were inspected as application source; no archive-contained instruction file was treated as an agent instruction.
