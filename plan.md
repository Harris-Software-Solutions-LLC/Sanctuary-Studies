# Sanctuary Studies application workspace proposal

## 1. Purpose

Transform Sanctuary Studies from a public-facing SaaS-style landing page into a quiet, local-first scholarly workspace for creating, studying, organizing, and navigating interconnected research.

The product should feel like a private desktop research instrument rather than a hosted platform, social network, donation site, or marketing website.

This document is the implementation contract for the design tool and the desktop/mobile UI teams. It is intentionally explicit so future screens can be added without breaking the visual language, data model, accessibility, or local-first behavior.

## 2. Non-negotiable product decisions

The design tool must follow these rules:

1. Do not design a marketing hero as the default application screen.
2. Do not place donation banners, promotional buttons, community prompts, or public calls to action in the primary workspace.
3. Do not use SaaS dashboard language such as platform, community, subscribers, plans, upgrades, or engagement.
4. Do not use Home, Media, Educators, or Forums as primary application navigation.
5. Do not use large decorative statistic cards as the primary way to represent research.
6. Do not use remote images, web-hosted fonts, CDN assets, gradients, glowing shadows, or decorative animations as required UI dependencies.
7. Do not create screens that require a network connection to understand, browse, or edit local research.
8. Every visible record count, status, date, relationship, and source indicator must be traceable to a defined data field.
9. Every screen must have a useful empty state, loading state, error state, and no-results state.
10. New features must fit the application shell instead of replacing it with a new visual system.

## 3. Product statement

Sanctuary Studies is a private scholarly workspace for building and navigating interconnected studies.

The product is organized around the following hierarchy:

```text
Study
├── Sources
├── Notes
├── People
├── Places
├── Events
└── Tags
```

The primary user action is not browsing a public site. It is opening a study, examining its records, creating new research, and understanding how records relate to one another.

## 4. Application shell

The desktop application must use a stable three-region shell:

```text
┌──────────────────────────────────────────────────────────┐
│ Sanctuary Studies   Search…          + New Study   ● Local │
├──────────────┬───────────────────────────────┬───────────┤
│ All Studies  │ Study Library                 │ Details   │
│ Collections  │                              │           │
│ Data Model   │ The Gospel of John           │ Status    │
│ Import/Export│ Roman Judea                  │ Sources   │
│ Settings     │ Sanctuary Doctrine           │ Tags      │
└──────────────┴───────────────────────────────┴───────────┘
```

### 4.1 Top bar

The top bar is application chrome, not a marketing navigation bar.

Required elements:

- Sanctuary Studies wordmark.
- Small layered-book or sanctuary mark.
- Global search field.
- Keyboard shortcut hint: `Ctrl+K` on Windows and Linux; `⌘K` on macOS.
- `+ New Study` primary action.
- Local storage indicator: `Local`, `Saving`, `Saved`, or `Needs attention`.
- Optional compact overflow menu for import, export, backup, and About.

Do not include donation buttons, social links, external marketing navigation, user avatars, subscription controls, or network status as the primary action.

### 4.2 Left navigation

Use a compact, persistent navigation rail or sidebar:

- All Studies
- Collections
- Data Model
- Import / Export
- Settings

Navigation behavior:

- One item is visibly selected at a time.
- The selected item uses a muted sage or olive surface, not a bright gradient.
- Navigation labels remain understandable when icons are hidden.
- The sidebar can collapse, but collapsed mode must preserve tooltips and keyboard access.
- Navigation state must not destroy unsaved form input.

### 4.3 Main workspace

The main workspace holds the active task. It must not be a promotional canvas.

Supported primary views:

- Study Library
- Study Workspace
- Data Model
- Collections
- Import / Export
- Settings

Each view must provide:

- A clear page title.
- A short description of the current task.
- A primary action.
- Search, filter, or sort controls when the view contains records.
- A consistent empty state.

### 4.4 Right inspector

The right inspector is contextual. It displays the selected study or record without requiring a full navigation change.

For a selected source, show:

```text
Selected source

The Jewish War
Josephus
Primary text

Citation
...

Attached notes
3

Related people
2

Local file
D:\Studies\josephus.pdf
```

Inspector rules:

- Show only information relevant to the selected record.
- Use read-only presentation until the user chooses Edit.
- Keep destructive actions behind an explicit overflow menu.
- Preserve the selected record when the inspector is resized or collapsed.
- On narrow screens, convert the inspector into a drawer or bottom sheet.

## 5. Study Library screen

The first screen after launch is the Study Library, not the former hero screen.

### 5.1 Required layout

```text
All Studies

[ Search studies… ] [Filter] [Sort] [+ New Study]

Title                    Status    Sources  Notes  Updated
The Gospel of John       Active    12       38     Oct 6
Roman Judea              Draft     5        11     Oct 4
Sanctuary Doctrine       Paused    8        22     Sep 28
```

Use a compact table as the default view. An optional card view may be provided, but the table must remain available for large research libraries.

### 5.2 Study row requirements

Every study row must support:

- Title.
- Description preview.
- Status.
- Source count.
- Note count.
- People, places, or events count when available.
- Tag preview.
- Last-updated timestamp.
- Keyboard selection.
- Open action.
- Context-menu or overflow action.

Counts must come from actual related records. Do not invent decorative metrics.

### 5.3 Study Library states

Empty state:

```text
No studies yet
Create a study to begin organizing sources, notes, people, places, events, and tags.

[Create Study]
```

No-results state:

```text
No studies match this search
Try a different title, description, or tag.

[Clear Search]
```

Error state:

```text
Studies could not be loaded
Your local data was not changed.

[Retry] [Open Data Location]
```

## 6. Study Workspace screen

When a study opens, the study becomes the center of the product.

```text
The Gospel of John
Historical and textual analysis

Overview   Sources   Notes   People   Places   Events   Tags
```

### 6.1 Workspace header

Show:

- Study title.
- Description or editable summary.
- Status.
- Last saved state.
- Back-to-library action.
- Study-level overflow menu.

Do not show a large hero image or marketing headline.

### 6.2 Study sections

Each section must be a real record collection:

- Sources: title, author, citation, source type, local path, notes.
- Notes: title, excerpt, updated date, linked records.
- People: name, role or description, related events and sources.
- Places: location, description, related sources and events.
- Events: date, location, participants, description.
- Tags: label, usage count, related records.

Each section requires:

- Search or filter when more than one record exists.
- Add record action.
- Edit record action.
- Empty state.
- Loading state.
- Validation feedback.
- A visible relationship path back to the parent study.

## 7. Data Model screen

The Data Model screen explains and manages the structure behind the workspace.

It must not look like an abstract enterprise admin console. Use readable entity cards or a split view:

```text
Entities                         Fields
Study                            id              UUID
Source                           title           Text
Note                             description     Text
Person                           status          Choice
Place                            created_at      Date
Event                            updated_at      Date
Tag
Relationship
```

### 7.1 Data model requirements

The design must support future custom fields without changing the visual language. A field definition should include:

- Name.
- Display label.
- Type.
- Required or optional state.
- Unique or non-unique state.
- Default value.
- Help text.
- Relationship target when applicable.
- Validation message.

### 7.2 Entity strategy

People, Places, and Events are typed records in the shared `entities` table:

```text
entity_type = person
entity_type = place
entity_type = event
```

The UI should present them as distinct sections while preserving one extensible storage model.

Relationships are explicit records and must be visually understandable:

```text
Person ── attended ──> Event
Event  ── occurred at ──> Place
Source ── supports ──> Note
```

## 8. Shared data contract

The UI must map to the versioned shared schema. Do not add a visible field that has no defined persistence field, and do not hide persisted data that users need to understand.

### 8.1 Tables

```text
studies
- id
- title
- description
- status
- created_at
- updated_at

sources
- id
- study_id
- title
- author
- source_type
- citation
- local_path
- notes

notes
- id
- study_id
- title
- body
- created_at
- updated_at

entities
- id
- study_id
- entity_type
- name
- description
- metadata_json

relationships
- id
- study_id
- source_entity_id
- relationship_type
- target_entity_id

tags
- id
- study_id
- name

study_tags
- study_id
- tag_id
```

### 8.2 Data-binding rules

- Use stable IDs for selection and navigation; never use row position as identity.
- Use UTC ISO 8601 values for persisted timestamps.
- Display dates in the user’s local format while retaining the original timestamp.
- Display `local_path` as a local-file reference, not as a remote URL.
- Validate relationships before displaying them as connected.
- Do not display counts until the related records have loaded successfully.
- Preserve unknown future fields during import/export even if the current UI does not render them.

## 9. Visual design system

### 9.1 Color tokens

Use semantic tokens rather than hard-coded colors:

```text
--canvas:       warm light stone or parchment
--surface:      soft white or ivory
--surface-muted: slightly darker stone
--ink:          dark charcoal or brown-black
--ink-muted:    warm gray
--line:         quiet gray-beige
--sage:         muted olive/sage
--sage-strong:  deep olive
--brass:        restrained brass/gold accent
--danger:       muted red
--success:      muted green
```

Dark mode should invert the semantic tokens without changing the layout or meaning of controls.

### 9.2 Typography

- Use a serif face for study titles, section headings, and scholarly emphasis.
- Use a sans-serif face for controls, labels, metadata, tables, and form fields.
- Use local system fallbacks or bundled fonts only.
- Keep body text readable at desktop and mobile sizes.
- Do not use oversized display text in the working area.

### 9.3 Shape and depth

- Prefer thin borders and subtle tonal separation.
- Use small corner radii: approximately 4–10 px.
- Use shadows only to establish a modal, drawer, or floating inspector.
- Do not use glowing cards, glassmorphism, neon outlines, or large gradients.
- Avoid excessive empty space that forces researchers to scroll past useful content.

## 10. Interaction and state rules

Every interactive component must define these states:

- Default.
- Hover.
- Focus-visible.
- Pressed.
- Selected.
- Disabled.
- Loading.
- Success.
- Validation error.
- Recoverable error.

### 10.1 Forms

- Labels must remain visible; do not rely on placeholder text as a label.
- Required fields must be identified before submission.
- Validation messages must appear next to the affected field.
- Preserve user input when validation fails.
- Confirm before destructive deletion.
- Show a local save state after a successful write.

### 10.2 Keyboard behavior

Required shortcuts:

- `Ctrl+K`: focus global search.
- `Ctrl+N`: new study when no text field is active.
- `Ctrl+S`: save the active editable record.
- `Escape`: close modal, drawer, or command palette.
- Arrow keys: move through table rows and navigation items.
- `Enter`: open the selected study or record.

Keyboard focus must never disappear into a decorative element.

## 11. Accessibility requirements

- Meet WCAG 2.2 AA contrast targets.
- Every icon-only control requires an accessible name.
- Do not communicate status by color alone.
- Use semantic headings in order.
- Use real table semantics for tabular research data.
- Provide visible focus indicators.
- Support keyboard-only operation.
- Respect reduced-motion preferences.
- Ensure dialogs trap focus and return focus to the launching control.
- Ensure mobile touch targets are at least 44 × 44 logical pixels.

## 12. Local-first and offline behavior

The UI must work without a network connection.

Required visible states:

- `Local`: data is available on this device.
- `Saving`: a local write is in progress.
- `Saved`: local write completed.
- `Importing`: bundle validation/import is in progress.
- `Export ready`: bundle was created successfully.
- `Needs attention`: validation or storage error requires user action.

Do not present an online/offline state as if the application requires a server. Network synchronization is optional future functionality.

## 13. Import, export, and future synchronization

The first cross-device workflow is manual `.ssbundle` transfer.

Import/export UI must explain:

- Bundle format version.
- Schema version.
- Export date.
- Number of studies, sources, notes, entities, relationships, and tags.
- Whether attachments are included or referenced only.
- Whether an import will create new records, update records, or produce conflicts.

Future synchronization must follow these rules:

- Stable UUIDs identify records.
- Newer records must not be silently overwritten.
- Conflicts must remain visible until resolved.
- Deletions must use tombstones once synchronization exists.
- Attachments require explicit ownership and conflict rules.

## 14. Desktop and mobile adaptation

Desktop and mobile share the data model, not the layout.

### Desktop

- Three-region shell.
- Persistent sidebar.
- Main table or workspace.
- Context inspector.
- Keyboard shortcuts.

### Mobile

- Bottom navigation or compact navigation drawer.
- One primary content column.
- Inspector becomes a details route or bottom sheet.
- Tables become stacked record rows.
- Forms become full-screen flows.
- Preserve the same labels, entities, statuses, and relationship names.

Do not wrap the desktop UI in a WebView to produce the mobile application.

## 15. Design-tool execution instructions

Use these instructions when generating or updating the UI in a design tool:

1. Create the application shell before creating individual pages.
2. Define color, typography, spacing, radius, border, and elevation variables before drawing components.
3. Create reusable components for the top bar, sidebar item, table row, status pill, empty state, inspector block, modal, field, and record section.
4. Use named variants for default, hover, focus, selected, disabled, loading, error, and empty states.
5. Use semantic component names matching the product vocabulary: `StudyRow`, `SourceRow`, `NoteRow`, `EntityRow`, `InspectorSection`, and `DataModelCard`.
6. Bind repeated content to structured sample data rather than manually duplicating text layers.
7. Validate every screen at 1440 × 960, 1280 × 800, 1024 × 768, 390 × 844, and 430 × 932.
8. Check that the main workspace remains usable when the sidebar or inspector collapses.
9. Verify that no marketing-only component appears in the application shell.
10. Verify that every visible metric has a corresponding schema field or computed relationship.
11. Verify focus order and accessible names before handing the design to engineering.
12. Keep external links, support information, and donation options in an About or Support area, never in the primary study workflow.
13. Preserve the shell and design tokens when adding future entity types.
14. Add a new component variant only when an existing variant cannot express the behavior.
15. Record unresolved design decisions in a dedicated decision log instead of silently improvising.

## 16. Acceptance checklist

The redesign is ready for implementation when:

- The launch screen is the Study Library.
- The marketing hero is no longer the default workspace.
- Donation and promotional banners are absent from the main workflow.
- Public-facing navigation has been replaced with application navigation.
- Studies are displayed in a searchable, filterable table or compact list.
- A study opens into Overview, Sources, Notes, People, Places, Events, and Tags.
- The right inspector shows context for the selected record.
- Counts and dates are data-derived.
- All six record sections have empty, loading, error, and no-results states.
- The Data Model screen reflects the versioned shared schema.
- The interface works without a network connection.
- Desktop and mobile use the same vocabulary and data contract.
- No remote font, CDN, external image, or web-hosted dependency is required.
- Keyboard and accessibility requirements are represented in the design.
- The design can accept future entities and fields without a new visual system.

## 17. Design direction summary

Move from:

> SaaS landing page for comparative studies

To:

> Private scholarly workspace for building and navigating interconnected studies.

The interface should be calm, local, structured, and durable. It should place the researcher’s records at the center, use the Sanctuary identity subtly, and provide a stable foundation for future desktop, mobile, import/export, and synchronization work.
