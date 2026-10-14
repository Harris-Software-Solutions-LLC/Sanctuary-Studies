# Sanctuary Studies Drive and GitHub Delivery Diagnosis

- Date: 2026-10-13
- Repository: `E:/Sanctuary Studies`
- Branch: `scripture-v2`
- Project isolation: Sanctuary Studies only; no Muzicle or unrelated repository was accessed.

## GitHub status

The canonical remote is:

`https://github.com/Harris-Software-Solutions-LLC/Sanctuary-Studies.git`

The current `scripture-v2` commit was verified on the remote with `git ls-remote`:

`58d7ac9a6401023a471148eda32c86b612ce2978`

GitHub push is therefore operational. The earlier inability to push was transient or local to the prior attempt; it is not a current repository or remote failure.

## Drive status

The authenticated Drive connector profile is:

- Account: `bachresearchgroup@gmail.com`
- Profile ID: `113002142378584388824`

The canonical Sanctuary Studies folder reference is:

- Folder ID: `1UgfVM9yuDSC4vlThP9s539u4F_fRIHa`
- URL: `https://drive.google.com/drive/folders/1UgfVM9yuDSC4vlThP9s539u4F_fRIHa`
- Parent ID: `12dAwcnH9k40doShAq8faSLoqiseRlTI7`

The parent folder is accessible and belongs to `bachresearchgroup@gmail.com`. However, every authoritative operation against the child folder returned HTTP 404 / `File not found`:

1. Direct file metadata lookup.
2. Direct folder listing.
3. Direct folder fetch.
4. File upload using the folder as `parent_folder_id`.

Drive search and the parent listing still return the old child ID. This is inconsistent stale/indexed metadata, not a normal sign-in failure. A separate Drive folder is accessible, proving the connector and account can read Drive, but it is not the canonical Sanctuary Studies destination and was not used.

## Safety result

- No replacement folder was created.
- No existing Drive file or folder was deleted or moved.
- No sharing permissions were changed.
- No upload was silently redirected to another folder.

## Required recovery

The canonical folder must be restored or its current valid folder ID must be supplied. The safest recovery sequence is:

1. Open the parent folder in Drive while signed in as `bachresearchgroup@gmail.com`:
   `https://drive.google.com/drive/folders/12dAwcnH9k40doShAq8faSLoqiseRlTI7`
2. Open the `Sanctuary Studies` child if it is present and provide its current URL.
3. If it is in Drive Trash, restore it and provide the restored URL.
4. If it is genuinely gone, explicitly authorize creation of a replacement under the same parent. Until that authorization is given, creating a replacement would violate the project’s archive policy.

Once a valid folder ID is available, upload must be followed by a listing/readback verification in that exact folder.
