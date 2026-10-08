# Synchronization rules

Synchronization is intentionally deferred until the local model and bundle format are stable.

1. Every record has a stable UUID and timestamps are ISO 8601 UTC values.
2. A record belongs to exactly one study unless it is a relationship or join record.
3. Imports must validate schema and foreign-key references before changing local data.
4. Sync must never overwrite a newer record silently. Conflicts should be retained and shown to the user.
5. Deletions will use tombstones once sync is introduced; physical deletion is not part of the first offline release.
6. Attachments are separate from records and must have explicit ownership and conflict rules.
7. The first cross-device transport is manual `.ssbundle` import/export. Network synchronization is a later, opt-in capability.
