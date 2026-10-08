# Sanctuary Studies mobile

This is the native Flutter target for Android and iOS. It intentionally does not reuse the Electron renderer or wrap the web application in a WebView.

## Current state

- Native Flutter shell is scaffolded in `lib/main.dart`.
- The shared data contract is defined in `../shared/schema/schema-v1.json`.
- `study_model.dart` mirrors the platform-neutral Study concept and section names.
- Persistence and `.ssbundle` import/export will be added after the Flutter SDK is available on the build machine.

## Local validation

Install Flutter, then run:

```powershell
flutter pub get
flutter analyze
flutter test
```

No Flutter SDK was available during this change, so those commands remain pending.
