# Sanctuary Studies task record — Flutter SDK installation

- Date: 2026-10-09
- Repository: `E:\Sanctuary Studies`
- Branch: `UI`
- Scope: install the official Flutter SDK so mobile analysis can resume; keep all task-controlled installation, temporary, cache, and mirror paths off C:.

## Installation

- Official Flutter release: `3.47.5` stable
- Dart SDK: `3.13.4`
- Download source: official Flutter storage release archive
- Archive: `E:\Sanctuary Studies\tooling\downloads\flutter_windows_3.47.5-stable.zip`
- Official SHA-256: `0ccd71931f49c2fbe394b1eeb6d79af3d624058a043ea0d03d34160581624fb8`
- Verified downloaded SHA-256: `0ccd71931f49c2fbe394b1eeb6d79af3d624058a043ea0d03d34160581624fb8`
- Authoritative SDK: `E:\Sanctuary Studies\tooling\flutter-sdk`
- E: temporary directory: `E:\Sanctuary Studies\tooling\tmp`
- E: pub cache: `E:\Sanctuary Studies\tooling\pub-cache`
- D: mirror: `D:\Sanctuary Studies\tooling\flutter-sdk`

The D: mirror was copied without destructive mirroring and verified against E::

- File count: `18,851` on both drives
- Total bytes: `3,497,000,165` on both drives
- `bin\flutter.bat` hash matched

No system PATH or global Git configuration was changed. The SDK and its caches were not installed in C:.

## Validation

Commands were run from `E:\Sanctuary Studies\mobile` with `TEMP`, `TMP`, and `PUB_CACHE` directed to E:.

- `flutter --version`: passed
- `flutter pub get`: passed; 57 dependencies resolved
- `flutter analyze`: passed — `No issues found!`
- `flutter test`: not runnable because the existing project has no `mobile\test` directory; no tests were added as part of SDK installation

Flutter initially reported two syntax/type diagnostics in `mobile/lib/data/study_repository.dart`. The minimal correction changed the invalid Dart cast syntax to `(_database['studies'] as List<dynamic>)`; analysis then passed with zero issues.

## Repository safety

- Added `tooling/` and `mobile/.dart_tool/` to `.gitignore` so the external SDK and generated cache cannot be committed accidentally.
- Existing unrelated untracked items were left untouched.
- No Electron packaging was run.
- No Muzicle, MMC, Canon and Imitation, or other unrelated repository was accessed.
- No task-controlled file, cache, build output, or SDK was written to C:.
