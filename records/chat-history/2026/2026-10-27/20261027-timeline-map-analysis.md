# Timeline Map Analysis and Interaction Proposal

- Date: 2026-10-27
- Repository: `E:/Sanctuary Studies`
- Source material: user-provided `Screenshot (755).png` and `Screenshot (756).png`.
- Scope: analysis only; no source images were copied and no application code was changed.

## Chart mapping

Page 88 is the Daily map and contains Step 0 plus Steps 1–10. Page 89 is the Yearly map and contains Steps 11–24. The existing Sanctuary Studies timeline package already contains 24 step records; Step 0 remains the separate introductory pair defined by the source page.

| Step | Aaron | Jesus |
|---:|---|---|
| 0 | Enters through the gate into the court | Born on earth in Bethlehem |
| 1 | Washes body and puts on common priest clothes | Baptism by John at the Jordan |
| 2 | Kills the bull for himself and his household | Crucifixion as the sacrifice for himself and co-laborers, as supplied by the chart |
| 3 | Washes hands and feet | Resurrection |
| 4 | Picks up incense and censer | Passes through with his own merits |
| 5 | Places bull blood on the ark; acceptance by God; puts censer on the Mercy Seat | Presents his blood; acceptance by God |
| 6 | Meets co-laborers; returns to the altar and kills the lamb for the people | Meets co-laborers; spends 40 days on earth as the Lamb for the people |
| 7 | Washes hands and feet | Divine stature restored to 16 feet, retained as chart interpretation and review-required |
| 8 | Dresses as High Priest | Inauguration as High Priest |
| 9 | Pours oil into the lamp | Pentecost |
| 10 | Puts incense on the altar | Christ on the first throne, pleading his merits for the people |
| 11 | Trumpet warning before the Day of Atonement | First Angel’s Message, dated 1833 in the chart |
| 12 | Common priests leave; Aaron casts lots and kills the Lord’s goat | Work of the 24 elders and 4 living creatures ends; supplied goat typology |
| 13 | High Priest enters the Most Holy Place | Christ enters the Most Holy Place in Heaven, dated 1844 in the chart |
| 14 | Continues in the Most Holy Place | Jesus stands before the Law, including the Sabbath interpretation shown in the chart |
| 15 | Continues in the Most Holy Place | Christ sits with God as Judge; Investigative Judgment |
| 16 | Stands before God and the Law; sprinkles blood on the Mercy Seat and before the Law | Pleads his blood; sealing and blotting-out interpretation |
| 17 | Stops at the altar of incense; cleanses the Holy Place by blood | Throws down the censer; cleanses the Holy Place; Close of Probation |
| 18 | Places sins on the scapegoat | Places sins on Satan |
| 19 | Removes the High Priest robes | Removes the High Priest robe |
| 20 | Leaves the Sanctuary in white linen | Leaves the Sanctuary; plagues fall; comes out in white |
| 21 | Washes body, identified as baptism in the chart | Jacob’s Time of Trouble, plagues, and the cup of baptism |
| 22 | Puts two rams on the fire | Second Coming of Christ |
| 23 | Puts the fat on the fire | End of sinners in the lake of fire |
| 24 | Bodies of the bull and goat burned outside the camp | Second fire, New Earth, and removal of all traces of sin |

## Proposed interaction

The two chart pages become a composite `Timeline Map` source view:

```text
Timeline Map
├── Daily — Page 88 — Step 0–10
└── Yearly — Page 89 — Step 11–24
```

Clicking an Aaron or Jesus marker will:

1. Select that actor and step.
2. Open the source page with the selected marker highlighted.
3. Open the comparison inspector beside the source image.
4. Offer Aaron-only, Jesus-only, or Compare mode.
5. Link to the complete Scripture text in Bible Reader.
6. Show the written Aaron/Jesus comparison table.
7. Show Source, Interpretation, and Questions tabs.
8. Show private notes attached to the selected study and step.
9. Show a source citation and provenance panel.

Selecting both markers opens synchronized comparison. The map should retain numbered labels and use text labels in addition to color so that red/green coloring is never the only distinction.

## Additive package design

Keep `timeline-v1.json` unchanged. Add a map package with normalized marker coordinates and page provenance:

```text
shared/content/atlas/
├── timeline-map-v1.json
├── timeline-map-index.cjs
├── provenance.json
└── README.md
```

The map records point to existing `timeline.step.01` through `timeline.step.24` records and the separate Step 0 records. They do not duplicate the KJV Bible package. Scripture excerpts are resolved from the existing local Bible Reader.

## Review flags

The chart’s dates, 16-foot statement, Sabbath interpretation, 1844 framework, Investigative Judgment, Close of Probation, Jacob’s Time of Trouble, and related typological claims must remain labeled as supplied chart interpretation or review-required content. The interface must distinguish chart wording, KJV evidence, commentary, and user questions.
