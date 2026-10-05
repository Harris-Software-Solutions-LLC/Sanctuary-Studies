// ===== SYMBOLISM PAGE =====
const SYMBOLISM_DATA = {
  furnishings: [
    {name:'Brazen Altar',zone:'Outer Court',heb:'Mizbeach',desc:'The large bronze altar at the entrance of the sanctuary where animals were sacrificed daily. The first piece of furniture encountered when entering the sanctuary.',type:'Represents the cross of Christ — the place of sacrifice where sin is atoned for by blood.',scripture:'Exodus 27:1-8; Hebrews 9:12',color:'#b45309'},
    {name:'Brazen Laver',zone:'Outer Court',heb:'Kiyor',desc:'The large bronze basin filled with water, located between the altar and the tabernacle entrance. Priests washed hands and feet before serving.',type:'Represents baptism and the cleansing power of the Word of God. Titus 3:5; Ephesians 5:26.',scripture:'Exodus 30:17-21; John 13:10',color:'#0891b2'},
    {name:'Golden Lampstand',zone:'Holy Place',heb:'Menorah',desc:'The seven-branched golden lampstand on the south side of the Holy Place, fueled by pure olive oil. It burned continually, providing the only light in the Holy Place.',type:'Represents Christ as the Light of the world (John 8:12) and the Holy Spirit as the sevenfold spirit. The seven lamps parallel the seven spirits of God (Rev. 4:5).',scripture:'Exodus 25:31-40; Revelation 1:12-13',color:'#ca8a04'},
    {name:'Table of Shewbread',zone:'Holy Place',heb:'Shulchan',desc:'The golden-overlaid table on the north side of the Holy Place, holding twelve loaves of bread replaced every Sabbath. The bread was eaten by the priests.',type:'Represents Christ as the Bread of Life (John 6:35). The twelve loaves symbolize the twelve tribes — all of God\'s people — sustained by Christ\'s presence.',scripture:'Exodus 25:23-30; John 6:35',color:'#b45309'},
    {name:'Altar of Incense',zone:'Holy Place',heb:'Mizbeach haQetoret',desc:'The small golden altar placed directly in front of the veil leading to the Most Holy Place. Incense was burned on it morning and evening, filling the sanctuary with fragrant smoke.',type:'Represents the prayers of the saints, ascending to God through Christ\'s intercession (Rev. 8:3-4). The sweet fragrance = the merits of Christ covering our prayers.',scripture:'Exodus 30:1-10; Revelation 8:3-4',color:'#d97706'},
    {name:'Ark of the Covenant',zone:'Most Holy Place',heb:'Aron Habrit',desc:'The most sacred object — an acacia wood chest overlaid entirely with gold, containing the two tables of the Ten Commandments, Aaron\'s rod that budded, and a golden pot of manna.',type:'Represents the throne of God and His government of law. The Law (commandments) inside = God\'s unchanging moral standard. Christ\'s blood on the mercy seat above = grace meeting justice.',scripture:'Exodus 25:10-16; Hebrews 9:4',color:'#ca8a04'},
    {name:'Mercy Seat',zone:'Most Holy Place',heb:'Kapporeth',desc:'The pure gold cover of the Ark of the Covenant, flanked by two golden cherubim facing each other with outstretched wings. The Shekinah glory of God appeared between the cherubim.',type:'Represents the throne of grace — where God\'s law (justice) and Christ\'s blood (mercy) meet. "Mercy and truth are met together; righteousness and peace have kissed each other." (Ps. 85:10)',scripture:'Exodus 25:17-22; Romans 3:25',color:'#ca8a04'},
  ],
  priesthood: [
    {name:'The High Priest',role:'Chief Mediator',desc:'Aaron and his successors served as the supreme mediator between God and Israel. He alone entered the Most Holy Place on the Day of Atonement.',type:'Type of Christ our Great High Priest, who "ever liveth to make intercession" (Heb. 7:25) in the heavenly sanctuary.',scripture:'Leviticus 16; Hebrews 4:14-16',color:'#1d4e89'},
    {name:'The Priestly Garments',role:'Vestments',desc:'Aaron wore eight special garments: the breastplate, ephod, robe, tunic, turban, sash, breeches, and golden plate engraved "Holiness to the LORD."',type:'The garments represent Christ\'s character — His holiness, His intercession for all twelve tribes (breastplate), and His royal-priestly office.',scripture:'Exodus 28; Zechariah 3:1-5',color:'#5b21b6'},
    {name:'The Common Priests',role:'Daily Ministers',desc:'The sons of Aaron served as the regular priests, tending the lamps, replacing the shewbread, offering the daily sacrifices, and ministering in the Holy Place.',type:'Represent believers — a "royal priesthood" (1 Pet. 2:9) who through Christ have access to the Holy Place (the presence of God) through prayer and the Holy Spirit.',scripture:'Exodus 29; 1 Peter 2:9',color:'#0f766e'},
    {name:'The Levites',role:'Sanctuary Servants',desc:'The tribe of Levi was set apart to assist the priests, transport the tabernacle, guard its gates, and lead worship in music and song.',type:'Represent the broader body of believers called to service — supporting the work of ministry in various capacities. Also: the angels who minister in the heavenly sanctuary.',scripture:'Numbers 1:47-54; Numbers 3:6-9',color:'#b45309'},
  ],
  offerings: [
    {name:'The Burnt Offering (Olah)',freq:'Daily & Voluntary',desc:'An animal entirely consumed by fire on the altar. Nothing held back — wholly given to God. Voluntary act of complete consecration.',type:'Represents total consecration to God — Christ\'s complete surrender to the Father\'s will ("Not my will, but thine"). Also: the believer\'s dedication of self.',scripture:'Leviticus 1; Romans 12:1',color:'#dc2626'},
    {name:'The Meal Offering (Minchah)',freq:'Daily',desc:'An offering of fine flour, oil, salt, and frankincense — the work of human hands presented to God. No leaven (sin); no honey (natural sweetness).',type:'Represents Christ as the perfect sinless Man — human, yet without the corruption of sin (no leaven). His perfect obedient life offered to God on our behalf.',scripture:'Leviticus 2; John 6:35',color:'#d97706'},
    {name:'The Peace Offering (Shelamim)',freq:'Voluntary',desc:'A shared communion meal — portions burned for God, portions for the priests, portions for the worshiper. A celebration of restored fellowship.',type:'Represents justification and fellowship restored through Christ. "Therefore being justified by faith, we have peace with God through our Lord Jesus Christ." (Rom. 5:1)',scripture:'Leviticus 3; Romans 5:1',color:'#15803d'},
    {name:'The Sin Offering (Chatat)',freq:'For unintentional sin',desc:'Required when sin was committed unwittingly. Blood applied to the altar horns; the animal\'s body burned outside the camp.',type:'Represents Christ bearing our sin outside the gate (Heb. 13:12-13). His blood applied to the heavenly altar removes the record of confessed sin.',scripture:'Leviticus 4; Hebrews 13:12',color:'#7c3aed'},
    {name:'The Trespass Offering (Asham)',freq:'For specific transgressions',desc:'Required when a specific wrong was done — especially involving a breach of trust or defilement of holy things. Restitution required in addition to the offering.',type:'Represents Christ making restitution for us — not just covering sin, but making right what was wrong. His perfect life more than compensates for all our failures.',scripture:'Leviticus 5-6; 1 Peter 3:18',color:'#be185d'},
  ]
};

function renderSymbolismPage() {
  currentSymbolismTab = currentSymbolismTab || 'overview';
  switchSymbolismTab(currentSymbolismTab, null);
}

function switchSymbolismTab(tab, btn) {
  currentSymbolismTab = tab;
  document.querySelectorAll('#page-symbolism .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    document.querySelectorAll('#page-symbolism .tab-btn').forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'"+tab+"'")) b.classList.add('active');
    });
  }
  const el = document.getElementById('symbolism-content');
  if (!el) return;
  // Map HTML tab names to data keys
  const tabMap = { overview:'furnishings', typology:'offerings', linguistic:'priesthood', furnishings:'furnishings' };
  const dataKey = tabMap[tab] || tab;
  if (tab === 'overview') {
    // Show overview of all categories
    el.innerHTML = `
      <div class="grid-3" style="margin-bottom:1.5rem">
        <div class="card" style="border-top:4px solid #ca8a04;cursor:pointer;text-align:center" onclick="switchSymbolismTab('furnishings',null)">
          <div style="font-size:2.5rem">🏺</div><h3>Sanctuary Furnishings</h3>
          <p style="font-size:.85rem;color:#666">7 furnishings — their materials, location, and Christ-centered typology</p>
          <button class="btn btn-primary btn-sm" style="margin-top:.75rem">Explore →</button>
        </div>
        <div class="card" style="border-top:4px solid #5b21b6;cursor:pointer;text-align:center" onclick="switchSymbolismTab('typology',null)">
          <div style="font-size:2.5rem">🫧</div><h3>The Five Offerings</h3>
          <p style="font-size:.85rem;color:#666">Burnt, Meal, Peace, Sin, and Trespass offerings — each a portrait of Christ</p>
          <button class="btn btn-primary btn-sm" style="margin-top:.75rem">Explore →</button>
        </div>
        <div class="card" style="border-top:4px solid #1d4e89;cursor:pointer;text-align:center" onclick="switchSymbolismTab('linguistic',null)">
          <div style="font-size:2.5rem">👘</div><h3>The Priesthood</h3>
          <p style="font-size:.85rem;color:#666">High Priest, common priests, Levites — their roles and antitypes in Christ</p>
          <button class="btn btn-primary btn-sm" style="margin-top:.75rem">Explore →</button>
        </div>
      </div>
      <div class="card">
        <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">The Sanctuary — Overview</h3>
        <p>The sanctuary that God commanded Israel to build was a miniature representation of the heavenly original (Hebrews 8:5). Every detail — materials, dimensions, furnishings, colors, and services — was prescribed by God Himself as a "pattern" of heavenly realities.</p>
        <p style="margin-top:.75rem">The Greek word for "pattern" in Hebrews 8:5 is <em>hupodeigma</em> — an example, model, or copy. The earthly sanctuary was God's illustrated sermon, teaching the plan of salvation through visual, tangible, participatory means.</p>
        <blockquote class="scripture-quote" style="margin-top:1rem">"Who serve unto the example and shadow of heavenly things, as Moses was admonished of God when he was about to make the tabernacle: for, See, saith he, that thou make all things according to the pattern shewed to thee in the mount." — Hebrews 8:5 (KJV)</blockquote>
      </div>`;
    return;
  }
  const data = SYMBOLISM_DATA[dataKey] || [];
  el.innerHTML = data.map(item => `
    <div class="symbolism-card">
      <div class="symbolism-card-header" style="border-left:4px solid ${item.color}">
        <div>
          <h3>${item.name}</h3>
          <div class="symbolism-meta">
            ${item.zone?`<span class="zone-badge">${item.zone}</span>`:''}
            ${item.heb?`<span class="heb-badge">Hebrew: <em>${item.heb}</em></span>`:''}
            ${item.role?`<span class="role-badge">${item.role}</span>`:''}
            ${item.freq?`<span class="freq-badge">${item.freq}</span>`:''}
          </div>
        </div>
      </div>
      <div class="symbolism-card-body">
        <div class="grid-2">
          <div>
            <h4 class="section-label">Description</h4>
            <p>${item.desc}</p>
          </div>
          <div>
            <h4 class="section-label">Type & Antitype</h4>
            <p>${item.type}</p>
          </div>
        </div>
        <div class="scripture-ref-line">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          <span>${item.scripture} (KJV)</span>
          <button class="btn-link" onclick="navigateToCrossRef('${item.scripture.split(';')[0].trim()}')">Read →</button>
        </div>
      </div>
    </div>`).join('');
}

// ===== SACRED COLORS PAGE =====
function renderColorsPage() {
  if (typeof SACRED_COLORS === 'undefined') return;
  const grid = document.getElementById('colors-grid');
  if (grid) {
    grid.innerHTML = SACRED_COLORS.map((c,i) => `
      <div class="color-card ${currentColorsItem===i?'active':''}" onclick="selectColor(${i})" style="border-top:4px solid ${c.hex||'#8C6B3C'}">
        <div class="color-swatch" style="background:${c.hex||'#8C6B3C'};color:${isLightColor(c.hex)?'#1C2A39':'white'}">
          <span style="font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700">${c.name||c.color||''}</span>
          <span style="font-size:.75rem;opacity:.85">${c.heb||''}</span>
        </div>
        <div class="color-card-body">
          <div class="color-meaning">${c.meaning||c.symbolism||''}</div>
          <div class="color-scripture">${c.ref||c.scripture||''}</div>
        </div>
      </div>`).join('');
  }
  if (currentColorsItem === null) currentColorsItem = 0;
  renderColorDetail(currentColorsItem);
}

function isLightColor(hex) {
  if (!hex) return false;
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (r*299+g*587+b*114)/1000 > 155;
}

function selectColor(idx) {
  currentColorsItem = idx;
  document.querySelectorAll('.color-card').forEach((c,i) => c.classList.toggle('active',i===idx));
  renderColorDetail(idx);
  const det = document.getElementById('color-detail');
  if (det) det.scrollIntoView({behavior:'smooth',block:'start'});
}

function renderColorDetail(idx) {
  if (typeof SACRED_COLORS === 'undefined') return;
  const el = document.getElementById('color-detail-panel');
  if (!el || !SACRED_COLORS[idx]) return;
  const c = SACRED_COLORS[idx];
  el.innerHTML = `
    <div class="color-detail-card">
      <div class="color-detail-header" style="background:linear-gradient(135deg,${c.hex||'#8C6B3C'},${c.hex||'#8C6B3C'}99);padding:2rem;border-radius:.75rem .75rem 0 0;color:${isLightColor(c.hex)?'#1C2A39':'white'}">
        <h2 style="font-family:'Cinzel',serif;margin:0;font-size:2rem">${c.name||c.color||''}</h2>
        <div style="font-size:1rem;opacity:.9;margin-top:.3rem">${c.heb||''} — ${c.meaning||''}</div>
      </div>
      <div style="padding:1.5rem">
        ${c.description||c.desc?`<div class="card" style="margin-bottom:1rem"><h3>📖 Description</h3><p>${c.description||c.desc||''}</p></div>`:''}
        ${c.symbolism?`<div class="card" style="margin-bottom:1rem"><h3>⚜️ Symbolism</h3><p>${c.symbolism}</p></div>`:''}
        ${c.typology||c.type?`<div class="card" style="margin-bottom:1rem"><h3>🔗 Typological Meaning</h3><p>${c.typology||c.type||''}</p></div>`:''}
        ${(c.ref||c.scripture)?`
        <div class="card" style="margin-bottom:1rem">
          <h3>📜 KJV Scripture</h3>
          <blockquote class="scripture-quote">${c.verse||c.text||''}</blockquote>
          <p style="font-size:.85rem;color:#8C6B3C;font-weight:600;margin:.5rem 0 0">${c.ref||c.scripture||''} (KJV)</p>
        </div>`:''}
        ${c.usage?`<div class="card"><h3>🏛️ Used In</h3><p>${c.usage}</p></div>`:''}
        <div style="display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap">
          ${idx>0?`<button class="btn btn-secondary btn-sm" onclick="selectColor(${idx-1})">← Previous Color</button>`:''}
          ${idx<SACRED_COLORS.length-1?`<button class="btn btn-primary btn-sm" onclick="selectColor(${idx+1})">Next Color →</button>`:''}
        </div>
      </div>
    </div>`;
}

// ===== HEAVENLY PORTAL PAGE =====
const HEAVENLY_STAGES = [
  {
    id:0, label:'The Outer Court', icon:'⛺',
    desc:'Enter through the gate of the sanctuary court — the place of sacrifice and consecration.',
    color:'#92400e', bg:'linear-gradient(135deg,#92400e,#b45309)',
    scripture:'"And let them make me a sanctuary; that I may dwell among them." — Exodus 25:8 (KJV)',
    content:`<p>The <strong>Outer Court</strong> is the beginning of the spiritual journey into the presence of God. It is an enclosed rectangular space of approximately 150×75 cubits, surrounded by linen curtains on bronze pillars. Only Israelites — God's covenant people — could enter here.</p>
<p>In the Outer Court stands the <strong>Brazen Altar</strong>, the first object encountered. Its fire burned continually, consuming the sacrifices that represented the cost of sin. No one could approach God without first acknowledging their need for atonement.</p>
<p>Beyond the altar stood the <strong>Brazen Laver</strong>, where priests washed before entering the tabernacle. Cleansing preceded service; consecration preceded access.</p>
<h3>Typological Meaning</h3>
<p>In the spiritual journey of the believer, the Outer Court represents: <em>Justification</em> — the initial experience of salvation through faith in Christ's atoning sacrifice. Here we come to the cross, acknowledge our sin, and receive the free gift of God's righteousness.</p>
<blockquote>"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God." — Ephesians 2:8 (KJV)</blockquote>`
  },
  {
    id:1, label:'The Holy Place', icon:'🕯️',
    desc:'Enter the first chamber — the place of light, sustenance, and prayer.',
    color:'#1d4e89', bg:'linear-gradient(135deg,#1d4e89,#2563eb)',
    scripture:'"Seeing then that we have a great high priest, that is passed into the heavens, Jesus the Son of God, let us hold fast our profession." — Hebrews 4:14 (KJV)',
    content:`<p>The <strong>Holy Place</strong> was the first of the two apartments within the tabernacle itself. It measured 20×10 cubits and was accessible only to the consecrated priests — not the general Israelite population. Three pieces of furniture furnished this sacred space:</p>
<p>The <strong>Golden Lampstand (Menorah)</strong> on the south side burned pure olive oil and provided the only light in the windowless room. Its seven branches carried seven lamps, their flames maintained by the priests morning and evening.</p>
<p>The <strong>Table of Shewbread</strong> on the north side held twelve loaves replaced every Sabbath. The old loaves were eaten by the priests in the Holy Place — the bread of the Presence, representing God's sustenance of His people.</p>
<p>The <strong>Altar of Incense</strong> stood directly before the veil, filling the sanctuary with fragrant smoke. The incense rose continuously, mingling with the Shekinah glory visible above the Most Holy Place.</p>
<h3>Typological Meaning</h3>
<p>The Holy Place represents <em>Sanctification</em> — the ongoing process of Christian growth through the Word (the Bread), prayer (the Incense), and the Holy Spirit (the Lampstand). This is where the believer lives — in daily communion with Christ through these means of grace.</p>
<blockquote>"Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need." — Hebrews 4:16 (KJV)</blockquote>`
  },
  {
    id:2, label:'Through the Veil', icon:'🌅',
    desc:'The veil separating the apartments — torn from top to bottom at the crucifixion.',
    color:'#5b21b6', bg:'linear-gradient(135deg,#5b21b6,#7c3aed)',
    scripture:'"And, behold, the veil of the temple was rent in twain from the top to the bottom." — Matthew 27:51 (KJV)',
    content:`<p>The <strong>Veil</strong> was a spectacular barrier of blue, purple, scarlet, and fine-twined linen, worked with cherubim. It hung on four golden pillars, separating the Holy Place from the Most Holy Place. No ordinary priest — and no layman — ever passed through it. Only the High Priest, once per year, on the Day of Atonement, entered.</p>
<p>The veil represented the body of Christ (Hebrews 10:20) — His flesh standing between sinful humanity and the holy presence of God. To pass through required the death of a sacrifice; to pass through in the antitype required the death of the Son of God Himself.</p>
<h3>The Tearing of the Veil</h3>
<p>At the moment of Christ's death at Calvary, the great veil of the Temple was torn from top to bottom — <em>from top to bottom</em>, indicating it was torn by divine, not human, hands. This was the most dramatic object lesson in history: the way into the Most Holy — into the immediate presence of God — was now open.</p>
<blockquote>"Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus, by a new and living way, which he hath consecrated for us, through the veil, that is to say, his flesh." — Hebrews 10:19-20 (KJV)</blockquote>
<h3>The Spiritual Veil</h3>
<p>In experience, the veil represents the transition from justification/sanctification to the deepest communion with God — from the outer chambers of Christian experience to the innermost place of His presence. Only those who pass through the death of self — reckoning themselves crucified with Christ — enter this dimension of spiritual experience.</p>`
  },
  {
    id:3, label:'The Most Holy Place', icon:'✨',
    desc:'The throne room of God — the Shekinah glory, the Mercy Seat, the Ark of His covenant.',
    color:'#0f766e', bg:'linear-gradient(135deg,#0f766e,#059669)',
    scripture:'"And the temple of God was opened in heaven, and there was seen in his temple the ark of his testament." — Revelation 11:19 (KJV)',
    content:`<p>The <strong>Most Holy Place</strong> — the Holiest of All — was the innermost chamber of the sanctuary, a perfect cube of 10×10×10 cubits. It contained only one piece of furniture: the <strong>Ark of the Covenant</strong> and its covering, the <strong>Mercy Seat</strong>. Yet in its simplicity it was the most sacred space on earth — the designated meeting point between God and mankind.</p>
<p>Above the Mercy Seat, between the outstretched wings of the two golden cherubim, the <strong>Shekinah glory</strong> — the visible manifestation of God's presence — dwelt. Here was the throne of God on earth.</p>
<h3>Contents of the Ark</h3>
<ul>
<li><strong>The Two Tables of Stone</strong>: The Ten Commandments, written by God's own finger — the transcript of His character, the foundation of His government</li>
<li><strong>Aaron's Rod That Budded</strong>: Confirmation of the divinely appointed priesthood</li>
<li><strong>The Golden Pot of Manna</strong>: Memorial of God's miraculous provision in the wilderness</li>
</ul>
<h3>The Mercy Seat: Grace Over Law</h3>
<p>The Ark contained God's law — the standard of righteousness. The Mercy Seat <em>covered</em> the law — the blood of atonement sprinkled on it covering the broken law with God's mercy. This is the gospel in a single piece of furniture: law and grace, justice and mercy, meeting in perfect harmony at the blood of Christ.</p>
<blockquote>"Mercy and truth are met together; righteousness and peace have kissed each other." — Psalm 85:10 (KJV)</blockquote>
<h3>The Heavenly Reality</h3>
<p>Revelation 11:19 reveals that the ark of the testament is in the heavenly temple, visible after the temple was opened in heaven — confirming the reality of the heavenly sanctuary and its contents. This is where Christ now ministers as our High Priest, applying His blood to the heavenly mercy seat on behalf of every repentant sinner who comes to God through Him.</p>
<blockquote>"Who being the brightness of his glory, and the express image of his person, and upholding all things by the word of his power, when he had by himself purged our sins, sat down on the right hand of the Majesty on high." — Hebrews 1:3 (KJV)</blockquote>`
  }
];

function renderHeavenlyPage() {
  renderHeavenlyStages();
  renderHeavenlyDetail(currentHeavenlyStage);
}

function renderHeavenlyStages() {
  const el = document.getElementById('heavenly-stage-btns');
  if (!el) return;
  el.innerHTML = HEAVENLY_STAGES.map((s,i) => `
    <button class="btn btn-sm ${i===currentHeavenlyStage?'btn-primary':'btn-secondary'}" onclick="selectHeavenlyStage(${i})" style="${i<=currentHeavenlyStage?'border-color:'+s.color.replace('linear-gradient(135deg,','').split(',')[0]:''}">
      ${s.icon} ${s.label}
    </button>`).join('');
}

function renderHeavenlyDetail(idx) {
  const el = document.getElementById('heavenly-portal-content');
  if (!el) return;
  const s = HEAVENLY_STAGES[idx];
  el.innerHTML = `
    <div class="heavenly-detail-card">
      <div style="background:${s.bg};color:white;padding:2rem;border-radius:.75rem .75rem 0 0">
        <div style="font-size:3rem;margin-bottom:.5rem">${s.icon}</div>
        <h2 style="font-family:'Cinzel',serif;margin:.25rem 0;font-size:1.5rem">${s.label}</h2>
        <p style="opacity:.9;margin:0">${s.desc}</p>
      </div>
      <div style="padding:1.5rem;background:white;border-radius:0 0 .75rem .75rem;box-shadow:0 4px 20px rgba(0,0,0,.1)">
        <blockquote class="scripture-quote" style="margin-bottom:1.5rem">${s.scripture}</blockquote>
        <div class="prose">${s.content}</div>
        <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
          ${idx>0?`<button class="btn btn-secondary" onclick="selectHeavenlyStage(${idx-1})">← ${HEAVENLY_STAGES[idx-1].label}</button>`:''}
          ${idx<HEAVENLY_STAGES.length-1?`<button class="btn btn-primary" onclick="selectHeavenlyStage(${idx+1})">Enter: ${HEAVENLY_STAGES[idx+1].label} →</button>`:'<div class="notice-box" style="flex:1"><strong>You have entered the Most Holy Place.</strong> "Let us therefore come boldly unto the throne of grace." — Hebrews 4:16</div>'}
        </div>
      </div>
    </div>`;
}

function selectHeavenlyStage(idx) {
  currentHeavenlyStage = idx;
  renderHeavenlyStages();
  renderHeavenlyDetail(idx);
  const det = document.getElementById('heavenly-portal-content');
  if (det) det.scrollIntoView({behavior:'smooth',block:'start'});
}

// ===== COMPARE SANCTUARIES PAGE =====
const COMPARE_DATA = {
  structural: {
    title: 'Structural Comparison',
    headers: ['Feature','Wilderness Tabernacle','Solomon\'s Temple','Herod\'s Temple','Heavenly Sanctuary'],
    rows: [
      ['Construction','Moses (Exodus 25-40)','Solomon (1 Kings 6-8)','Herod (20 BC–AD 70)','God Himself (Heb. 8:2)'],
      ['Materials','Acacia wood, gold, linen, animal skins','Cedar, gold, stone, bronze','Stone, marble, gold','Pure gold, divine substance'],
      ['Outer Court','Linen curtains on bronze pillars','Stone walls, bronze pillars','Magnificent marble courts','Heavenly courts of praise'],
      ['Holy Place','10×20 cubits','20×40 cubits','20×40 cubits','Transcendent dimensions'],
      ['Most Holy Place','10×10 cubits (cube)','20×20×20 cubits (cube)','20×20 cubits','Throne room of God'],
      ['Lamp','7-branch Menorah (gold)','10 Menorahs','1 Menorah (restored)','Christ is the Light (Rev. 21:23)'],
      ['Ark of Covenant','Present (acacia/gold)','Present (Solomon)','Absent (lost after 586 BC)','Present (Rev. 11:19)'],
      ['Duration','~480 years (c.1445–966 BC)','~410 years (966–586 BC)','~90 years (20 BC–AD 70)','Eternal'],
    ]
  },
  dimensions: {
    title: 'Dimensions & Proportions',
    headers: ['Measurement','Wilderness Tabernacle','Solomon\'s Temple','Herod\'s Temple'],
    rows: [
      ['Overall Length','100 cubits (~150 ft)','~100 cubits (court)','500 cubits (Temple Mount)'],
      ['Overall Width','50 cubits (~75 ft)','~50 cubits (court)','500 cubits (Temple Mount)'],
      ['Holy Place','20×10 cubits','40×20 cubits','~40×20 cubits'],
      ['Most Holy Place','10×10 cubits','20×20 cubits','20×20 cubits'],
      ['Height of Structure','~10 cubits (tabernacle)','30 cubits','60 cubits'],
      ['Altar of Burnt Offering','5 cubits square, 3 high','20 cubits square, 10 high','~50 cubits'],
      ['Ratio Holy:Most Holy','2:1','2:1','2:1 (same proportion)'],
    ]
  },
  theological: {
    title: 'Theological Comparison',
    headers: ['Doctrine','Earthly Sanctuary','Heavenly Sanctuary (Hebrews)'],
    rows: [
      ['Priest','Levitical (mortal, sinful)','Christ (eternal, sinless)'],
      ['Sacrifice','Animal blood (temporary)','Christ\'s blood (permanent, once for all)'],
      ['Mediation','Aaron and sons','Jesus, sole Mediator (1 Tim. 2:5)'],
      ['Basis','Type/shadow (Heb. 10:1)','The "very image" — the reality'],
      ['Covenant','Old Covenant (Sinai)','New Covenant (Jer. 31:31-34)'],
      ['Atonement','Annual, repeated (Day of Atonement)','Ongoing; investigative since 1844'],
      ['Access','Priests only (Holy Place); High Priest only (Most Holy)','All believers have boldness to enter (Heb. 10:19)'],
      ['Law','Written on stone tablets (inside Ark)','Written on the heart (Heb. 8:10)'],
    ]
  },
  timeline: {
    title: 'Historical Timeline',
    headers: ['Period','Event','Scripture'],
    rows: [
      ['c.1445 BC','Tabernacle constructed in wilderness','Exodus 25-40'],
      ['c.1405–966 BC','Tabernacle used in Canaan (Shiloh, etc.)','Joshua 18:1; 1 Samuel 4'],
      ['966 BC','Solomon begins Temple construction','1 Kings 6:1'],
      ['959 BC','Solomon\'s Temple dedicated; glory fills it','1 Kings 8:10-11'],
      ['586 BC','Temple destroyed by Nebuchadnezzar','2 Kings 25:8-9'],
      ['516 BC','Second Temple (Zerubbabel) completed','Ezra 6:14-15'],
      ['20 BC','Herod begins Temple renovation','Josephus, Ant. 15.11'],
      ['31 AD','Temple veil torn at Christ\'s crucifixion','Matthew 27:51'],
      ['70 AD','Herod\'s Temple destroyed by Titus','Matthew 24:2'],
      ['1844 AD','Christ enters Most Holy (heavenly)','Daniel 8:14; Heb. 9:23'],
    ]
  }
};

function renderComparePage() {
  currentCompareTab = currentCompareTab || 'overview';
  switchCompareTab(currentCompareTab, null);
}

function switchCompareTab(tab, btn) {
  currentCompareTab = tab;
  document.querySelectorAll('#page-compare .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    document.querySelectorAll('#page-compare .tab-btn').forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'"+tab+"'")) b.classList.add('active');
    });
  }
  const el = document.getElementById('compare-content');
  if (!el) return;
  // Map HTML tab names to data keys
  const tabMap = { overview:'structural', structure:'structural', furnishings:'theological', dimensions:'dimensions', materials:'timeline' };
  const dataKey = tabMap[tab] || tab;
  if (tab === 'overview') {
    el.innerHTML = `
      <div class="notice-box" style="margin-bottom:1.5rem;background:#e0eeff;border-color:#1e3a5f">
        <strong>📐 Sanctuary Comparison</strong>
        <p>The four biblical sanctuaries — the Wilderness Tabernacle, Solomon's Temple, Herod's Temple, and the Heavenly Sanctuary — share a common architectural pattern and theological purpose: to be the meeting place between God and humanity.</p>
      </div>
      <div class="grid-2" style="margin-bottom:1.5rem">
        ${[
          {label:'Structural Analysis',tab:'structure',icon:'🏗️',desc:'Physical layout, materials, and dimensions compared side by side'},
          {label:'Theological Comparison',tab:'furnishings',icon:'⚖️',desc:'Earthly vs. heavenly — type and antitype contrasted'},
          {label:'Dimensional Study',tab:'dimensions',icon:'📏',desc:'Proportional analysis — ratios and measurements'},
          {label:'Historical Timeline',tab:'materials',icon:'📅',desc:'When each sanctuary existed and key historical events'}
        ].map(c=>`<div class="card" style="cursor:pointer;text-align:center;border-top:3px solid #8C6B3C" onclick="switchCompareTab('${c.tab}',null)">
          <div style="font-size:2rem">${c.icon}</div>
          <h4 style="font-family:'Cinzel',serif;color:#1C2A39;margin:.5rem 0 .25rem">${c.label}</h4>
          <p style="font-size:.82rem;color:#666">${c.desc}</p>
          <button class="btn btn-primary btn-sm" style="margin-top:.75rem">View →</button>
        </div>`).join('')}
      </div>`;
    return;
  }
  const data = COMPARE_DATA[dataKey];
  if (!data) return;
  el.innerHTML = `
    <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">${data.title}</h3>
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead><tr>${data.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${data.rows.map((row,i)=>`
          <tr class="${i%2===0?'even':'odd'}">
            ${row.map((cell,j)=>`<td ${j===0?'class="feature-col"':''}>${cell}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:1rem;display:flex;gap:.5rem;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="switchCompareTab('overview',null)">← Overview</button>
    </div>`;
}