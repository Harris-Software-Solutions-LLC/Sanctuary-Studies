# PNG Sanctuary Atlas Analysis

- Date: 2026-10-27
- Repository: `E:/Sanctuary Studies`
- Scope: Analysis of user-provided Sanctuary environment screenshots.
- No screenshot files were copied into the repository and no application code was changed.

## Finding

The supplied PNGs can support an offline interactive Sanctuary environment using a calibrated image atlas. The images provide multiple oblique, elevated, wide, and closer views of the courtyard, tabernacle structure, curtains, altar, laver, and interior furnishing areas. PNGs alone cannot provide mathematically correct free-camera movement or reveal geometry hidden from every source view.

## Recommended implementation

Extend the existing Explorer/Atlas surface with a local image viewer that supports:

- View selection by orientation/elevation/zoom.
- Pan and zoom inside each image.
- Cross-fade or swipe transitions between supplied views.
- Normalized coordinate hotspots for sanctuary objects.
- Object inspector links to Scripture, Sanctuary models, Sources, Notes, and Timeline steps.
- Synchronized Aaron/Jesus step panels for 24 paired steps.
- Image provenance, dimensions, hashes, source labels, and review status.

Use a new additive package such as `shared/content/atlas/` with an environment manifest, image manifest, step annotation manifest, provenance, and loader. Keep `explorer-v1` unchanged.

## Important limitation

This first version is a 2D/2.5D study atlas. Smooth camera travel, true occlusion, and unseen surfaces require a depth map, mesh, or Blender/GLB export. Those are separate future options and are not required for the initial offline Electron implementation.

## Step model

Each of the 48 study records should contain actor, step number, action, image references, focused object, user-supplied commentary, Scripture references, source/provenance, review status, and comparison links. Aaron and Jesus remain separate records and are paired through an explicit relationship. Supplied commentary remains distinguished from KJV text and from visual reconstruction choices.

## Recommended next gate

First create a view manifest for the supplied environment images, normalize their presentation, and implement one pilot pair: Aaron step 1 and Jesus step 1. Review the pilot before importing all 24 pairs.
