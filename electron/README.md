# Electron target

The Electron target loads the shared Sanctuary Studies UI from local files. It does not start a web server, use a remote URL, or require a separate browser. Context isolation, sandboxing, denied permission prompts, denied new windows, and navigation restrictions are enabled by default.

Run the development shell after installing the declared development dependency:

```powershell
npm install
npm run start:electron
```

Packaging is a separate, explicit release action:

```powershell
npm run package:external -- "feature-name"
```

The packaging wrapper requires both `D:\Sanctuary Studies Builds` and `E:\Sanctuary Studies Builds`, places temporary output on E:, copies the completed build to D:, and verifies the copy. It intentionally fails when either drive is unavailable.
