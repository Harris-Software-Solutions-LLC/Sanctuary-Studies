# Timeline Step 1 integration

- Date: 2026-10-27
- Branch: `timeline-integration`
- Commit: `5389351`
- Scope: Add the supplied Step 1 of Aaron and Jesus page content to the local Timeline interaction.

## Included

- Aaron’s washing at the laver and linen common-priest garments.
- Jesus’ baptism by John in the Jordan River.
- Step-specific Scripture excerpts and references.
- The supplied Jesus annotation and source citation.
- A.D. 27 date marker.
- Aaron-versus-Jesus comparison text.
- An empty private-notes area for future user notes.
- Timeline UI rendering for annotation panels, references, comparison, citation, and private notes.

## Preservation

- Existing 24 timeline steps remain present.
- Existing 189 timeline questions remain present.
- No timeline content was removed or relabeled.
- No qualification, approval, or review-status fields were added.
- The attached source image was analyzed but not copied from C: into the project.

## Validation

- `npm.cmd run test:timeline` passed.
- `npm.cmd run test:shared` passed.
- `node --check ui/app.js` passed.
- `npm.cmd run lint` completed with pre-existing `index.html` doctype/icon warnings.
- The four changed implementation files were mirrored to D:.
