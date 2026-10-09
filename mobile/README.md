# Sanctuary Studies mobile

This is the native Flutter target for Android and iOS. It intentionally does not reuse the Electron renderer or wrap the web application in a WebView.

## Current state

- Native Flutter Study Library and Study Detail screens are implemented in `lib/main.dart`.
- The shared data contract is defined in `../shared/schema/schema-v1.json`.
- `study_model.dart` mirrors the platform-neutral Study concept and section names.
- `study_repository.dart` provides version-1 JSON persistence, study creation, section records, and `.ssbundle` import/export.
- `path_provider` and `file_picker` are compiled into the mobile application; no browser, web server, or separately installed runtime is required.

## Local validation

Install Flutter, then run:

```powershell
flutter pub get
flutter analyze
flutter test
```

If the Flutter SDK is not present on the build machine, the source remains ready for validation but the commands remain pending.
