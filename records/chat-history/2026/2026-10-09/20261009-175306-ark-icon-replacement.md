# Sanctuary Studies Ark icon replacement — 2026-10-09

## Request

Keep the simpler Ark of the Covenant and Mercy Seat symbol, remove the Decalogue tablet backdrop, and retain the richer gold color.

## Completed

- Replaced the prior book/arch icon source with the approved Ark/Mercy Seat concept.
- Kept the two facing cherubim and gold visual treatment.
- Removed the Decalogue tablet backdrop from the active icon.
- Regenerated 16px, 32px, 64px, and 256px PNG variants.
- Regenerated the multi-resolution Windows `.ico` used by Electron.
- Existing Electron window, taskbar, tray, favicon, manifest, and legacy/new UI wiring continues to reference the same asset paths.

## Validation

- `node --check electron/main.cjs`
- Approved icon assets exist.
- ICO header validated.
- No Electron package was created; packaging remains an explicit release action.

## Delivery status

At record creation, D: mirroring, GitHub push, and Google Drive upload were pending.

