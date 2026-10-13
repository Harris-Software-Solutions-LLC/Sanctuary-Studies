# Sanctuary Studies task record — Scripture-v2 package label correction

Date: 2026-10-13
Branch: `scripture-v2`
Repository: `E:\Sanctuary Studies`

## User-visible request

The packaged executable appeared to show the UI branch. Rebuild it so the executable clearly shows the Scripture-v2 branch.

## Diagnosis and fix

The executable was using the correct Scripture-v2 package code, but `ui/index.html` contained the hard-coded document title `Sanctuary Studies — UI branch`. Changed it to `Sanctuary Studies — Scripture v2`. No UI branch code was merged, removed, or modified.

## Git

- Commit: `bcd8e4d` — `Label packaged UI as Scripture v2`
- Pushed to: `origin/scripture-v2`

## Package verification

- E: `E:\Sanctuary Studies Builds\win-unpacked-scripture-v2-labeled-20261013-175729`
- D: `D:\Sanctuary Studies Builds\win-unpacked-scripture-v2-labeled-20261013-175729`
- Both: 74 files, 342.24 MB.
- Embedded `app.asar` title verified as `Sanctuary Studies — Scripture v2`.
- Existing packages were preserved; no previous build was deleted.
- No packaging output appeared under C:.
