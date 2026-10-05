// ===== 3D EXPLORER PAGE =====
const EXPLORER_MODELS = [
  {
    id:'tabernacle', label:'Wilderness Tabernacle', icon:'⛺', period:'c.1445–966 BC',
    color:'#b45309', desc:'The portable sanctuary built by Israel under Moses\' direction in the wilderness of Sinai, following the exact divine blueprint shown on Mount Sinai.',
    zones:[
      {name:'Outer Court Gate',desc:'The only entrance — through the east gate. 20 cubits wide, of blue, purple, scarlet, and fine linen. Represents Christ: "I am the door." (John 10:9)'},
      {name:'Brazen Altar',desc:'The large bronze altar (5×5 cubits, 3 high). The fire on it never went out. The first object encountered — typifying the cross of Christ.'},
      {name:'Brazen Laver',desc:'Bronze basin of water between altar and tabernacle. Priests washed before serving. Represents baptism and cleansing by the Word.'},
      {name:'Holy Place',desc:'The first chamber (20×10 cubits) with Menorah (south), Table of Shewbread (north), and Altar of Incense (center-west). Daily priestly ministry.'},
      {name:'The Veil',desc:'Embroidered linen curtain of blue, purple, scarlet — woven with cherubim. Separated Holy Place from Most Holy. Torn at the Crucifixion (Matt. 27:51).'},
      {name:'Most Holy Place',desc:'The Holiest of All (10×10 cubits). The Ark of the Covenant with the Mercy Seat and two cherubim. The Shekinah glory dwelt above the Mercy Seat.'},
    ],
    keyScriptures:['Exodus 25-40','Hebrews 8:5','Hebrews 9:2-8'],
  },
  {
    id:'solomon', label:'Solomon\'s Temple', icon:'🏛️', period:'966–586 BC',
    color:'#ca8a04', desc:'The permanent stone-and-cedar sanctuary built by Solomon in Jerusalem on Mount Moriah, following the plans David received from God. Twice the size of the tabernacle.',
    zones:[
      {name:'The Temple Mount',desc:'The expanded platform on which the Temple complex was built. Including Outer Courts, the Portico, and the main Temple building.'},
      {name:'Jachin & Boaz',desc:'Two bronze pillars at the Temple entrance, named Jachin ("He shall establish") and Boaz ("In him is strength") — proclaiming God\'s covenant faithfulness.'},
      {name:'The Bronze Sea',desc:'Enormous bronze basin (10 cubits diameter) resting on twelve bronze oxen — representing the twelve tribes. Used by priests for cleansing.'},
      {name:'The Holy Place',desc:'40×20 cubits — twice the tabernacle\'s. Ten Menorahs (five left, five right), Ten Tables of Shewbread, and the Altar of Incense overlaid with cedar and gold.'},
      {name:'The Most Holy Place',desc:'20×20×20 cubits — a perfect cube. Two cherubim of olive wood overlaid with gold, 10 cubits high, spanning the entire width. The Ark of the Covenant brought from the tabernacle.'},
      {name:'God\'s Glory Fills the Temple',desc:'"Then a cloud covered the tent of the congregation, and the glory of the LORD filled the tabernacle." — 1 Kings 8:10-11. The Shekinah descended at the dedication.'},
    ],
    keyScriptures:['1 Kings 6-8','2 Chronicles 3-7','Psalm 48:1-2'],
  },
  {
    id:'herod', label:'Herod\'s Temple', icon:'🕌', period:'20 BC–70 AD',
    color:'#1d4e89', desc:'A massive renovation and expansion of Zerubbabel\'s Second Temple begun by Herod the Great in 20 BC. Jesus taught and ministered in this Temple.',
    zones:[
      {name:'The Royal Portico',desc:'A magnificent basilica on the south side of the Temple Mount. Probably where Jesus taught as a child (Luke 2:46) and drove out the money changers (Matt. 21:12).'},
      {name:'Court of the Gentiles',desc:'The outermost court where anyone could come. Separated from the inner courts by the "Soreg" — a stone barrier with warning inscriptions forbidding Gentile entry on pain of death.'},
      {name:'Court of Women',desc:'The inner court where Jewish women could worship. Contained thirteen trumpet-shaped offering chests and the treasury where Jesus observed the widow\'s mite (Mark 12:41-44).'},
      {name:'Court of Israel & Priests',desc:'The inner courts surrounding the Temple building itself, accessible to Jewish men (Israel) and the priests respectively.'},
      {name:'The Temple Building',desc:'The naos — the actual Temple structure housing the Holy Place and Most Holy Place. The Holy Place contained the Menorah, Table of Shewbread, and Altar of Incense.'},
      {name:'The Veil & Its Tearing',desc:'The massive veil (60×20 cubits; reportedly the thickness of a palm) was torn from top to bottom at Christ\'s death (Matt. 27:51), signaling the end of the typical system.'},
    ],
    keyScriptures:['Matthew 21:12-13','Luke 21:5-6','Matthew 27:51'],
  },
  {
    id:'heavenly-explorer', label:'Heavenly Sanctuary', icon:'✨', period:'Eternal',
    color:'#0f766e', desc:'The original sanctuary — the true tabernacle which the Lord pitched and not man (Heb. 8:2). The earthly was built as a copy of this heavenly original.',
    zones:[
      {name:'The Heavenly Courts',desc:'Revelation 4-5 describes the heavenly courts surrounding the throne of God — four living creatures, twenty-four elders, thousands of angels, and the sea of glass before the throne.'},
      {name:'The Seven Lamps of Fire',desc:'"And there were seven lamps of fire burning before the throne, which are the seven Spirits of God." — Revelation 4:5. The sevenfold Spirit in the heavenly Holy Place.'},
      {name:'The Heavenly Altar',desc:'"And another angel came and stood at the altar, having a golden censer; and there was given unto him much incense, that he should offer it with the prayers of all saints." — Revelation 8:3.'},
      {name:'The Ark Revealed',desc:'"And the temple of God was opened in heaven, and there was seen in his temple the ark of his testament." — Revelation 11:19. The ark is really there.'},
      {name:'Christ the High Priest',desc:'"We have such an high priest, who is set on the right hand of the throne of the Majesty in the heavens; A minister of the sanctuary." — Hebrews 8:1-2.'},
      {name:'The Throne of Grace',desc:'The ultimate destination — the throne of God and of the Lamb. "Let us therefore come boldly unto the throne of grace." — Hebrews 4:16. Open to all through Christ.'},
    ],
    keyScriptures:['Hebrews 8:1-2','Revelation 4-5','Revelation 11:19'],
  }
];

let currentExplorerModel = 0;
let currentExplorerZone = 0;

function renderExplorerPage() {
  const el = document.getElementById('explorer-content');
  if (!el) return;
  // Inject model selector tabs into content
  el.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem" id="explorer-tabs">
    ${EXPLORER_MODELS.map((m,i)=>`<button class="btn ${i===currentExplorerModel?'btn-primary':'btn-secondary'} btn-sm" onclick="selectExplorerModel(${i})">${m.icon} ${m.label}</button>`).join('')}
  </div><div id="explorer-model-content"></div>`;
  renderExplorerModel(currentExplorerModel);
}

function selectExplorerModel(idx) {
  currentExplorerModel = idx;
  currentExplorerZone = 0;
  // Rebuild the tabs and model content
  const tabsEl = document.getElementById('explorer-tabs');
  if (tabsEl) {
    tabsEl.innerHTML = EXPLORER_MODELS.map((m,i)=>`<button class="btn ${i===idx?'btn-primary':'btn-secondary'} btn-sm" onclick="selectExplorerModel(${i})">${m.icon} ${m.label}</button>`).join('');
  }
  renderExplorerModel(idx);
}

function renderExplorerModel(idx) {
  const el = document.getElementById('explorer-model-content') || document.getElementById('explorer-content');
  if (!el) return;
  const m = EXPLORER_MODELS[idx];
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr;gap:1.5rem">
      <div class="card" style="border-top:4px solid ${m.color}">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
          <div style="font-size:3rem">${m.icon}</div>
          <div>
            <h2 style="font-family:'Cinzel',serif;color:#1C2A39;margin:0">${m.label}</h2>
            <span style="background:${m.color}20;color:${m.color};padding:.2rem .75rem;border-radius:1rem;font-size:.8rem;font-weight:600">${m.period}</span>
          </div>
        </div>
        <p>${m.desc}</p>
        <div style="margin-top:.75rem">
          <strong style="font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:#888">Key Scriptures</strong>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.4rem">${m.keyScriptures.map(s=>`<span class="cross-ref-tag" onclick="navigateToCrossRef('${s}')">${s}</span>`).join('')}</div>
        </div>
      </div>
      <div>
        <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">Explore the Zones</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem">
          ${m.zones.map((z,i) => `
          <div class="explorer-zone-card ${i===currentExplorerZone?'active':''}" onclick="selectExplorerZone(${i})" style="${i===currentExplorerZone?`border:2px solid ${m.color};background:${m.color}08`:'border:2px solid transparent'}">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
              <div style="width:28px;height:28px;border-radius:50%;background:${i===currentExplorerZone?m.color:'#e5e7eb'};color:${i===currentExplorerZone?'white':'#888'};display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0">${i+1}</div>
              <strong>${z.name}</strong>
            </div>
            <p style="font-size:.85rem;color:#555;margin:0">${z.desc}</p>
          </div>`).join('')}
        </div>
      </div>
      <div class="card" style="background:#1C2A39;color:#f5f0e8">
        <h3 style="font-family:'Cinzel',serif;color:#8C6B3C;margin-bottom:1rem">Sanctuary Diagram — ${m.label}</h3>
        <div class="sanctuary-diagram" style="font-family:monospace;font-size:.75rem;line-height:1.8;overflow-x:auto">
          ${renderSanctuaryDiagram(m.id)}
        </div>
      </div>
    </div>`;
}

function selectExplorerZone(i) {
  currentExplorerZone = i;
  renderExplorerModel(currentExplorerModel);
  window.scrollTo({top:document.getElementById('explorer-content').offsetTop-80,behavior:'smooth'});
}

function renderSanctuaryDiagram(id) {
  const diagrams = {
    tabernacle: `<pre style="color:#f5f0e8;background:transparent;margin:0;white-space:pre">
 ┌─────────────────────────────────────────────────────────────┐
 │                    OUTER COURT (150×75 cubits)              │
 │                                                             │
 │   [GATE - East]                                             │
 │       ↓                                                     │
 │   [⬛ BRAZEN ALTAR]      [🪣 BRAZEN LAVER]                   │
 │     (Sacrifice)           (Cleansing)                       │
 │                                                             │
 │   ┌────────────────────────────────────────┐                │
 │   │           HOLY PLACE (20×10)           │                │
 │   │  [🕯 MENORAH]  [📜 SHEWBREAD]  [🌿 INCENSE] │           │
 │   │   (Light)      (Bread)        (Prayer) │                │
 │   │                          ═══VEIL═══    │                │
 │   │   ┌──────────────────────┐             │                │
 │   │   │   MOST HOLY (10×10)  │             │                │
 │   │   │   [✨ ARK + MERCY SEAT] │           │               │
 │   │   │   [Shekinah Glory]   │             │                │
 │   │   └──────────────────────┘             │                │
 │   └────────────────────────────────────────┘                │
 └─────────────────────────────────────────────────────────────┘</pre>`,
    solomon: `<pre style="color:#f5f0e8;background:transparent;margin:0;white-space:pre">
 ┌────────────────────────────────────────────────────────────────┐
 │                  SOLOMON'S TEMPLE COMPLEX                      │
 │                                                                │
 │  [JACHIN] [BOAZ]  ← Bronze Pillars at Entrance                │
 │        ↓                                                       │
 │  ┌─────────────────────────────────────┐                       │
 │  │         ULAM (Porch / Portico)       │ 20×10 cubits         │
 │  ├─────────────────────────────────────┤                       │
 │  │     HEKAL — THE HOLY PLACE           │ 40×20 cubits         │
 │  │  10 Menorahs | 10 Shewbread Tables  │                       │
 │  │         Gold Altar of Incense        │                       │
 │  │               ══════ VEIL ══════     │                       │
 │  │  ┌──────────────────────────────┐   │                       │
 │  │  │  DEBIR — MOST HOLY 20×20×20  │   │                       │
 │  │  │  Two Cherubim (10 cubits ea) │   │                       │
 │  │  │  ARK OF THE COVENANT         │   │                       │
 │  │  └──────────────────────────────┘   │                       │
 │  └─────────────────────────────────────┘                       │
 │  [BRONZE SEA on 12 Oxen]  [10 Bronze Lavers]                   │
 └────────────────────────────────────────────────────────────────┘</pre>`,
    herod: `<pre style="color:#f5f0e8;background:transparent;margin:0;white-space:pre">
 ┌───────────────────────────────────────────────────────────────┐
 │                   HEROD'S TEMPLE MOUNT                        │
 │                                                               │
 │  COURT OF THE GENTILES (accessible to all nations)           │
 │  ┌──── SOREG (barrier — Gentiles forbidden beyond) ────┐     │
 │  │    COURT OF WOMEN (Jewish women & men)               │     │
 │  │  ┌── COURT OF ISRAEL (Jewish men) ───────────────┐  │     │
 │  │  │  ┌── COURT OF PRIESTS ────────────────────┐   │  │     │
 │  │  │  │  [BRAZEN ALTAR]   [BRONZE LAVER]        │   │  │     │
 │  │  │  │  ┌──────────────────────────────────┐   │   │  │     │
 │  │  │  │  │    THE NAOS (Temple Building)    │   │   │  │     │
 │  │  │  │  │  HOLY PLACE: Menorah, Shewbread  │   │   │  │     │
 │  │  │  │  │  ═══ GREAT VEIL (torn AD 31) ═══  │   │   │  │     │
 │  │  │  │  │  MOST HOLY PLACE (empty Ark)     │   │   │  │     │
 │  │  │  │  └──────────────────────────────────┘   │   │  │     │
 │  │  │  └────────────────────────────────────────┘   │  │     │
 │  │  └────────────────────────────────────────────────┘  │     │
 │  └──────────────────────────────────────────────────────┘     │
 └───────────────────────────────────────────────────────────────┘</pre>`,
    'heavenly-explorer': `<pre style="color:#f5f0e8;background:transparent;margin:0;white-space:pre">
 ┌──────────────────────────────────────────────────────────────┐
 │              THE HEAVENLY SANCTUARY (Heb. 8:2)              │
 │                                                              │
 │   ✦ SEA OF GLASS before the Throne (Rev. 4:6)               │
 │   ✦ FOUR LIVING CREATURES — Cherubim (Rev. 4:6-8)           │
 │   ✦ TWENTY-FOUR ELDERS on their thrones (Rev. 4:4)          │
 │                                                              │
 │  ┌──────────────────────────────────────────────────┐        │
 │  │     HEAVENLY HOLY PLACE                          │        │
 │  │  🕯 Seven Lamps = Seven Spirits (Rev. 4:5)       │        │
 │  │  🌿 Golden Censer / Altar of Incense (Rev. 8:3)  │        │
 │  │  💫 Christ ministers here 31 AD – 1844 AD        │        │
 │  │                    ═══════ VEIL ══════════        │        │
 │  │  ┌────────────────────────────────────────┐      │        │
 │  │  │  HEAVENLY MOST HOLY PLACE              │      │        │
 │  │  │  📦 ARK OF THE TESTAMENT (Rev. 11:19)  │      │        │
 │  │  │  🌟 THRONE OF GOD AND OF THE LAMB      │      │        │
 │  │  │  ✝️  CHRIST — Great High Priest (NOW)  │      │        │
 │  │  │  Ministry began 1844 (Dan. 8:14)       │      │        │
 │  │  └────────────────────────────────────────┘      │        │
 │  └──────────────────────────────────────────────────┘        │
 └──────────────────────────────────────────────────────────────┘</pre>`
  };
  return diagrams[id] || '<p style="color:#888">Diagram not available</p>';
}

// ===== MEDIA PAGE =====
function renderMediaPage() {
  switchMediaTab('podcasts', null);
}

function switchMediaTab(tab, btn) {
  document.querySelectorAll('#page-media .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    document.querySelectorAll('#page-media .tab-btn').forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'"+tab+"'")) b.classList.add('active');
    });
  }
  const el = document.getElementById('media-content');
  if (!el) return;
  switch(tab) {
    case 'podcasts': renderPodcasts(el); break;
    case 'videos': renderVideos(el); break;
    case 'guides': renderDiscussionGuides(el); break;
  }
}

function renderPodcasts(el) {
  if (typeof PODCAST_EPISODES === 'undefined') { el.innerHTML=''; return; }
  el.innerHTML = PODCAST_EPISODES.map(ep => `
    <div class="media-card">
      <div class="media-card-header">
        <div class="media-icon">🎙️</div>
        <div class="media-meta">
          <div class="media-episode-num">Episode ${ep.id}</div>
          <h3>${ep.title}</h3>
          <div style="display:flex;gap:1rem;font-size:.8rem;color:#888;flex-wrap:wrap;margin-top:.25rem">
            <span>⏱ ${ep.duration}</span>
            <span>📅 ${ep.date}</span>
            <span>⬇️ ${ep.downloads.toLocaleString()} downloads</span>
            <span>⭐ ${ep.rating}/5.0</span>
          </div>
        </div>
      </div>
      <p style="color:#555;font-size:.9rem;margin:.75rem 0">${ep.desc}</p>
      <div style="background:#f7f3ec;padding:.75rem;border-radius:.5rem;margin-bottom:.75rem">
        <div style="font-size:.8rem;font-weight:600;color:#8C6B3C;margin-bottom:.25rem">Featured Guest</div>
        <div style="font-weight:600;color:#1C2A39">${ep.guest}</div>
        <div style="font-size:.8rem;color:#666">${ep.guestTitle}</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem">${ep.topics.map(t=>`<span class="book-tag">${t}</span>`).join('')}</div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="showToast('▶ Playing: ${ep.title.replace(/'/g,"'")}')">▶ Play Episode</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Download will begin shortly')">⬇ Download</button>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Episode notes saved to your profile')">📝 Notes</button>
      </div>
    </div>`).join('');
}

function renderVideos(el) {
  if (typeof VIDEO_SERIES === 'undefined') { el.innerHTML=''; return; }
  el.innerHTML = `<div class="grid-2">${VIDEO_SERIES.map(v => `
    <div class="card">
      <div style="background:#1C2A39;border-radius:.5rem;padding:2rem;text-align:center;margin-bottom:1rem;position:relative">
        <div style="font-size:3rem">🎬</div>
        <div style="position:absolute;top:.5rem;right:.5rem;background:#8C6B3C;color:white;padding:.2rem .5rem;border-radius:.3rem;font-size:.7rem;font-weight:700">${v.episodes} Episodes</div>
      </div>
      <h3 style="font-family:'Cinzel',serif;color:#1C2A39">${v.title}</h3>
      <p style="font-size:.85rem;color:#555;margin-bottom:.75rem">${v.desc}</p>
      <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.75rem;font-size:.8rem;color:#888">
        <span>📺 ${v.episodes} episodes</span>
        <span>⏱ ${v.duration}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem">${v.topics.map(t=>`<span class="book-tag">${t}</span>`).join('')}</div>
      <button class="btn btn-primary btn-sm" style="width:100%" onclick="showToast('Opening series: ${v.title.replace(/'/g,"'")}')">Watch Series →</button>
    </div>`).join('')}</div>`;
}

function renderDiscussionGuides(el) {
  const guides = [
    {title:'Sanctuary Basics Discussion Guide', sessions:4, audience:'All Ages', topics:['What is the sanctuary?','The earthly as a copy','Christ our High Priest','The Day of Atonement']},
    {title:'Daniel 8:14 — Small Group Study', sessions:6, audience:'Adult', topics:['Introduction to Daniel','The little horn','The 2300 days','457 BC starting point','The year-day principle','1844 significance']},
    {title:'Hebrews: A Study in Sanctuary Theology', sessions:10, audience:'Adult', topics:['Introduction to Hebrews','Christ superior to angels','Better covenant','The two apartments','The blood of Christ','Faith in sanctuary promises']},
    {title:'Sacred Colors Family Study', sessions:3, audience:'Family/Children', topics:['Blue and purple — God\'s law and royalty','Red and white — blood and righteousness','Gold and linen — divinity and purity']},
  ];
  el.innerHTML = `<div class="grid-2">${guides.map(g => `
    <div class="card">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
        <div style="background:#1C2A3910;padding:.75rem;border-radius:.5rem;font-size:1.5rem">📋</div>
        <div>
          <h3 style="margin:0;font-size:1rem;color:#1C2A39">${g.title}</h3>
          <div style="font-size:.8rem;color:#888;margin-top:.2rem">${g.sessions} sessions &bull; ${g.audience}</div>
        </div>
      </div>
      <ul style="font-size:.85rem;color:#555;padding-left:1.25rem;margin-bottom:1rem">${g.topics.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-primary btn-sm" onclick="showToast('Discussion guide downloaded')">⬇ Download PDF</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Preview opened')">Preview</button>
      </div>
    </div>`).join('')}</div>`;
}

// ===== EDUCATORS PAGE =====
let educatorCatFilter = 'all';
let educatorAgeFilter = 'all';

function renderEducatorsPage() {
  filterEducators('cat', educatorCatFilter);
}

function filterEducators(type, value) {
  if (type==='cat') educatorCatFilter = value;
  if (type==='age') educatorAgeFilter = value;
  const el = document.getElementById('educators-content');
  if (!el || typeof EDUCATOR_RESOURCES === 'undefined') return;
  const filtered = EDUCATOR_RESOURCES.filter(r =>
    (educatorCatFilter==='all' || r.cat===educatorCatFilter) &&
    (educatorAgeFilter==='all' || r.age===educatorAgeFilter)
  );
  if (filtered.length===0) { el.innerHTML='<div class="notice-box"><p>No resources match the selected filters.</p></div>'; return; }
  el.innerHTML = filtered.map(r => `
    <div class="educator-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem">
        <div>
          <span class="cat-badge cat-${r.cat}">${r.cat.replace('-',' ')}</span>
          <span class="age-badge age-${r.age}">${r.age}</span>
        </div>
        <span style="font-size:.8rem;color:#888">⏱ ${r.duration}</span>
      </div>
      <h3 style="color:#1C2A39;font-size:1rem;margin:0 0 .5rem">${r.title}</h3>
      <p style="font-size:.85rem;color:#555;margin-bottom:.75rem">${r.desc}</p>
      <div style="margin-bottom:.75rem">
        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:.3rem">Objectives</div>
        <ul style="font-size:.8rem;color:#555;padding-left:1.2rem;margin:0">${r.objectives.map(o=>`<li>${o}</li>`).join('')}</ul>
      </div>
      <div style="margin-bottom:.75rem">
        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:.3rem">Materials</div>
        <div style="display:flex;flex-wrap:wrap;gap:.3rem">${r.materials.map(m=>`<span class="material-tag">${m}</span>`).join('')}</div>
      </div>
      <div style="margin-bottom:1rem">
        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:.3rem">Downloads</div>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem">${r.downloads.map(d=>`<button class="btn btn-ghost btn-sm" onclick="showToast('Downloading: ${d.replace(/'/g,"'")}')">📄 ${d}</button>`).join('')}</div>
      </div>
      <div style="border-top:1px solid #e5e7eb;padding-top:.75rem;font-size:.75rem;color:#888">
        📅 Quarter: ${r.quarter}
      </div>
    </div>`).join('');
}

// ===== FORUMS PAGE =====
function renderForumsPage() {
  renderForumCategories();
  renderForumThreads(currentForumCat);
}

function renderForumCategories() {
  const el = document.getElementById('forum-categories');
  if (!el || typeof FORUM_CATEGORIES === 'undefined') return;
  el.innerHTML = FORUM_CATEGORIES.map(c => `
    <div class="forum-cat-item ${c.id===currentForumCat?'active':''}" onclick="selectForumCat('${c.id}')">
      <span>${c.name}</span>
      <span class="forum-cat-count">${c.count}</span>
    </div>`).join('');
}

function selectForumCat(catId) {
  currentForumCat = catId;
  renderForumCategories();
  renderForumThreads(catId);
}

function renderForumThreads(catId) {
  const el = document.getElementById('forum-discussions');
  if (!el || typeof FORUM_THREADS === 'undefined') return;
  const threads = catId==='all' ? FORUM_THREADS : FORUM_THREADS.filter(t=>t.cat===catId);
  if (threads.length===0) { el.innerHTML='<div class="notice-box"><p>No threads in this category yet.</p></div>'; return; }
  el.innerHTML = threads.map(t => `
    <div class="forum-thread ${t.pinned?'pinned':''}">
      ${t.pinned?'<div class="pin-badge">📌 Pinned</div>':''}
      <div class="forum-thread-header">
        <div class="forum-thread-avatar">${t.author.charAt(0)}</div>
        <div style="flex:1;min-width:0">
          <h4 class="forum-thread-title" onclick="openForumThread(${t.id})">${t.title}</h4>
          <div style="font-size:.75rem;color:#888;margin-top:.2rem">
            <span style="font-weight:600;color:#1C2A39">${t.author}</span>
            <span class="role-chip role-${t.role.toLowerCase()}">${t.role}</span>
            &bull; ${t.time}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0">${t.tags.map(tag=>`<span class="forum-tag">${tag}</span>`).join('')}</div>
      <div style="display:flex;gap:1.5rem;font-size:.8rem;color:#888">
        <span>💬 ${t.replies} replies</span>
        <span>👁 ${t.views} views</span>
        <button class="btn-link" onclick="openForumThread(${t.id})">Read Thread →</button>
      </div>
    </div>`).join('');
}

function searchForums(q) {
  if (!q || q.trim().length<2) { renderForumThreads(currentForumCat); return; }
  const el = document.getElementById('forum-discussions');
  if (!el || typeof FORUM_THREADS === 'undefined') return;
  const filtered = FORUM_THREADS.filter(t => t.title.toLowerCase().includes(q.toLowerCase()) || t.tags.some(tag=>tag.toLowerCase().includes(q.toLowerCase())));
  if (filtered.length===0) { el.innerHTML='<div class="notice-box"><p>No threads match your search.</p></div>'; return; }
  el.innerHTML = filtered.map(t => `
    <div class="forum-thread">
      <h4 class="forum-thread-title" onclick="openForumThread(${t.id})">${t.title}</h4>
      <div style="font-size:.75rem;color:#888">${t.author} &bull; ${t.time} &bull; ${t.replies} replies</div>
    </div>`).join('');
}

function openForumThread(id) {
  const t = FORUM_THREADS.find(t=>t.id===id);
  if (!t) return;
  showToast('Opening thread: '+t.title.substring(0,40)+'...');
  const el = document.getElementById('forum-discussions');
  if (!el) return;
  el.innerHTML = `
    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem">
        <button class="btn btn-secondary btn-sm" onclick="renderForumThreads('${t.cat}')">← Back to Threads</button>
        <div class="forum-cat-item" style="cursor:default;background:#f1f5f9">${FORUM_CATEGORIES.find(c=>c.id===t.cat)?.name||t.cat}</div>
      </div>
      ${t.pinned?'<div class="pin-badge" style="display:inline-block;margin-bottom:.75rem">📌 Pinned Discussion</div>':''}
      <h2 style="font-family:\'Cinzel\',serif;color:#1C2A39;font-size:1.2rem;margin-bottom:.75rem">${t.title}</h2>
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
        <div class="forum-thread-avatar">${t.author.charAt(0)}</div>
        <div>
          <div style="font-weight:600;color:#1C2A39">${t.author} <span class="role-chip role-${t.role.toLowerCase()}">${t.role}</span></div>
          <div style="font-size:.75rem;color:#888">${t.time}</div>
        </div>
      </div>
      <p style="color:#555;line-height:1.7">This discussion thread is part of the moderated Sanctuary Studies community. Members explore this topic with scholarly rigor and respectful dialogue, supporting all claims with Scripture and recognized academic sources.</p>
      <p style="color:#555;line-height:1.7">Key topics discussed in this thread include: ${t.tags.join(', ')}. The ${t.replies} replies represent a rich exchange of biblical scholarship and practical insight.</p>
      <div style="margin-top:1rem;padding:.75rem;background:#f7f3ec;border-radius:.5rem;border-left:3px solid #8C6B3C">
        <p style="font-family:'Crimson Text',serif;font-style:italic;font-size:1rem;margin:0">"Prove all things; hold fast that which is good." — 1 Thessalonians 5:21 (KJV)</p>
      </div>
    </div>
    <div class="card">
      <h4 style="margin-bottom:.75rem">Join the Discussion</h4>
      <textarea class="form-input" rows="4" placeholder="Share your thoughts, citing Scripture (KJV) and scholarly sources..." style="width:100%;resize:vertical"></textarea>
      <div style="margin-top:.75rem;display:flex;gap:.5rem">
        <button class="btn btn-primary btn-sm" onclick="showToast('Sign in to post a reply')">Post Reply</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Thread bookmarked')">🔖 Bookmark</button>
      </div>
    </div>`;
}

// ===== PROFILES PAGE =====
function renderProfilesPage() {
  const el = document.getElementById('profile-content');
  if (!el) return;
  const achievements = [
    {icon:'📖',name:'Bible Scholar',desc:'Read 10+ KJV chapters',earned:true},
    {icon:'⛺',name:'Sanctuary Explorer',desc:'Explored all 4 sanctuary models',earned:true},
    {icon:'🏛️',name:'Library Patron',desc:'Read 3 complete books',earned:false},
    {icon:'⏱',name:'Timeline Master',desc:'Completed all timeline steps',earned:false},
    {icon:'🛡',name:'Myth Buster',desc:'Answered all myth vs. fact cards',earned:true},
    {icon:'🎓',name:'Educator',desc:'Downloaded 5 educator resources',earned:false},
    {icon:'💬',name:'Community Voice',desc:'Posted 10 forum replies',earned:false},
    {icon:'🌟',name:'Heavenly Journey',desc:'Completed the Heavenly Portal',earned:true},
    {icon:'🔍',name:'Deep Diver',desc:'Used Scripture Navigator 20 times',earned:false},
    {icon:'🎨',name:'Color Scholar',desc:'Studied all 8 sacred colors',earned:false},
    {icon:'⚖️',name:'Judgment Ready',desc:'Completed the Judgment module',earned:false},
    {icon:'🏆',name:'Sanctuary Master',desc:'Completed all modules',earned:false},
  ];
  const modules = [
    {name:'KJV Bible', progress:35, color:'#1d4e89'},
    {name:'Ministry Timeline', progress:60, color:'#ca8a04'},
    {name:'Investigative Judgment', progress:45, color:'#7c3aed'},
    {name:'Scripture Navigator', progress:20, color:'#0f766e'},
    {name:'Symbolism Explorer', progress:30, color:'#dc2626'},
    {name:'Sacred Colors', progress:75, color:'#b45309'},
    {name:'Digital Library', progress:15, color:'#1d4e89'},
    {name:'Heavenly Portal', progress:100, color:'#0f766e'},
  ];
  el.innerHTML = `
    <div class="grid-2" style="align-items:start">
      <div>
        <div class="card" style="margin-bottom:1rem">
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#1C2A39,#8C6B3C);display:flex;align-items:center;justify-content:center;font-size:1.75rem;color:white;font-family:'Cinzel',serif">S</div>
            <div>
              <h2 style="margin:0;font-family:'Cinzel',serif;color:#1C2A39">Sanctuary Student</h2>
              <p style="margin:.25rem 0 0;color:#888;font-size:.85rem">Member since January 2026</p>
              <div style="margin-top:.5rem;display:flex;gap:.5rem">
                <span style="background:#e0eeff;color:#1e3a5f;padding:.2rem .6rem;border-radius:1rem;font-size:.75rem;font-weight:600">Level 3 Scholar</span>
                <span style="background:#fef3c7;color:#92400e;padding:.2rem .6rem;border-radius:1rem;font-size:.75rem;font-weight:600">4 Achievements</span>
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Sign in to update your profile')">Edit Profile</button>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">Study Progress</h3>
          ${modules.map(m=>`
          <div style="margin-bottom:.85rem">
            <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:.3rem">
              <span style="color:#555">${m.name}</span>
              <span style="font-weight:600;color:${m.color}">${m.progress}%</span>
            </div>
            <div style="background:#e5e7eb;border-radius:1rem;height:8px;overflow:hidden">
              <div style="background:${m.color};width:${m.progress}%;height:100%;border-radius:1rem;transition:width .4s ease"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
      <div>
        <div class="card" style="margin-bottom:1rem">
          <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">Achievements</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.75rem">
            ${achievements.map(a=>`
            <div style="padding:.75rem;border-radius:.5rem;border:2px solid ${a.earned?'#8C6B3C':'#e5e7eb'};background:${a.earned?'#fef3c7':'#f9fafb'};opacity:${a.earned?1:.6}">
              <div style="font-size:1.5rem;margin-bottom:.25rem">${a.icon}</div>
              <div style="font-weight:600;font-size:.85rem;color:${a.earned?'#92400e':'#555'}">${a.name}</div>
              <div style="font-size:.75rem;color:#888;margin-top:.2rem">${a.desc}</div>
              ${a.earned?'<div style="font-size:.7rem;color:#ca8a04;margin-top:.3rem;font-weight:700">✓ Earned</div>':''}
            </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:.75rem">Recent Activity</h3>
          <div style="font-size:.85rem;color:#555">
            ${[
              {icon:'📖',text:'Read Hebrews 9 in KJV Bible Study',time:'Today'},
              {icon:'⛺',text:'Explored Solomon\'s Temple in 3D Explorer',time:'Yesterday'},
              {icon:'🛡',text:'Completed Myth vs. Fact: Investigative Judgment',time:'2 days ago'},
              {icon:'📚',text:'Read Chapter 4 of A Biblical Defense',time:'3 days ago'},
              {icon:'🌟',text:'Entered the Most Holy Place in Heavenly Portal',time:'1 week ago'},
            ].map(a=>`<div style="display:flex;align-items:center;gap:.75rem;padding:.5rem 0;border-bottom:1px solid #f3f4f6">
              <span style="font-size:1.2rem">${a.icon}</span>
              <div style="flex:1"><div>${a.text}</div><div style="font-size:.75rem;color:#888">${a.time}</div></div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

// ===== MYTHS PAGE =====
function renderMythsPage() {
  renderMythCategories();
  renderMythCards(currentMythCat);
}

function renderMythCategories() {
  const el = document.getElementById('myth-cats');
  if (!el || typeof MYTHS_DATA === 'undefined') return;
  const cats = ['all',...new Set(MYTHS_DATA.map(m=>m.cat))];
  const labels = {all:'All Topics',judgment:'Judgment',sanctuary:'Sanctuary',salvation:'Salvation',prophecy:'Prophecy',denominational:'Denominational'};
  el.innerHTML = cats.map(c => `
    <button class="btn btn-sm ${c===currentMythCat?'btn-primary':'btn-secondary'}" onclick="filterMythCat('${c}')">${labels[c]||c}</button>`).join('');
}

function filterMythCat(cat) {
  currentMythCat = cat;
  renderMythCategories();
  renderMythCards(cat);
}

function renderMythCards(cat) {
  const el = document.getElementById('myths-content');
  if (!el || typeof MYTHS_DATA === 'undefined') return;
  const filtered = cat==='all' ? MYTHS_DATA : MYTHS_DATA.filter(m=>m.cat===cat);
  const diffColors = {beginner:'#15803d',intermediate:'#d97706',advanced:'#dc2626'};
  el.innerHTML = filtered.map(m => `
    <div class="myth-card">
      <div class="myth-card-header">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem">
          <span class="myth-cat-badge">${m.cat}</span>
          <span style="background:${diffColors[m.difficulty]||'#888'}20;color:${diffColors[m.difficulty]||'#888'};padding:.15rem .5rem;border-radius:1rem;font-size:.7rem;font-weight:700;border:1px solid ${diffColors[m.difficulty]||'#888'}40">${m.difficulty}</span>
        </div>
        <div class="myth-label">❌ MYTH</div>
        <p class="myth-text">"${m.myth}"</p>
      </div>
      <div class="myth-fact-section">
        <div class="fact-label">✅ FACT</div>
        <p class="fact-text">${m.fact}</p>
        <p style="color:#555;font-size:.9rem;margin-top:.5rem;line-height:1.7">${m.explanation}</p>
        <div class="myth-scripture">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;color:#8C6B3C;flex-shrink:0"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          <span>${m.scripture}</span>
        </div>
      </div>
    </div>`).join('');
}