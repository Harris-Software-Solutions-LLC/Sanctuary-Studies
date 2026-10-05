// ===== TIMELINE PAGE =====
let tlPlayInterval = null;

function renderTimelinePage() {
  if (typeof TIMELINE_STEPS === 'undefined') return;
  renderTimelineContent(currentTimelineStep);
  updateTimelineControls();
}

function updateTimelineControls() {
  const stepNum = document.getElementById('tl-step-num');
  const totalEl = document.getElementById('tl-total');
  const progress = document.getElementById('tl-progress');
  if (stepNum) stepNum.textContent = currentTimelineStep+1;
  if (totalEl && typeof TIMELINE_STEPS!=='undefined') totalEl.textContent = TIMELINE_STEPS.length;
  if (progress && typeof TIMELINE_STEPS!=='undefined') {
    progress.style.width = ((currentTimelineStep+1)/TIMELINE_STEPS.length*100)+'%';
  }
}

function renderTimelineContent(idx) {
  const el = document.getElementById('timeline-content');
  if (!el || typeof TIMELINE_STEPS==='undefined' || !TIMELINE_STEPS[idx]) return;
  const step = TIMELINE_STEPS[idx];
  const total = TIMELINE_STEPS.length;
  el.innerHTML = `
    <div class="timeline-step-card">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap">
        <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#1C2A39,#8C6B3C);color:white;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:1.1rem;font-weight:700;flex-shrink:0">${idx+1}</div>
        <div>
          <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#8C6B3C;font-weight:600">Step ${idx+1} of ${total}</div>
          <h2 style="font-family:'Cinzel',serif;color:#1C2A39;margin:.1rem 0;font-size:1.2rem">${step.aaron||step.title||'Timeline Step'}</h2>
          ${step.ref?`<p style="color:#8C6B3C;font-size:.85rem;margin:0">${step.ref}</p>`:''}
        </div>
      </div>
      <div class="tl-parallel-grid">
        <div class="tl-panel tl-earthly">
          <div class="tl-panel-label"><span>⛺</span> Aaron — Earthly Ministry</div>
          <h3>${step.aaron||step.title||''}</h3>
          <p>${step.aaronDesc||step.desc||step.earthlyDesc||'The earthly high priest performs this ministry in the wilderness tabernacle, serving as a type of the heavenly reality to come.'}</p>
          ${step.scripture?`<blockquote class="scripture-quote">"${step.scripture}"${step.ref?' — '+step.ref+' (KJV)':''}</blockquote>`:''}
        </div>
        <div class="tl-panel tl-heavenly">
          <div class="tl-panel-label"><span>✨</span> Jesus — Heavenly Ministry</div>
          <h3>${step.jesus||step.heavenlyTitle||'Heavenly Fulfillment'}</h3>
          <p>${step.jesusDesc||step.application||step.heavenlyDesc||'Christ our great High Priest fulfills this type in the heavenly sanctuary, ministering before the Father on our behalf.'}</p>
          ${step.hebrewsRef?`<blockquote class="scripture-quote">"${step.hebrewsText||''}" — ${step.hebrewsRef} (KJV)</blockquote>`:
            step.hebrewsText?`<blockquote class="scripture-quote">"${step.hebrewsText}" (KJV)</blockquote>`:''}
        </div>
      </div>
      ${step.note?`<div class="notice-box" style="margin-top:1rem"><strong>Study Note:</strong> ${step.note}</div>`:''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.25rem;padding-top:1rem;border-top:1px solid #e5e7eb;flex-wrap:wrap;gap:.5rem">
        <div style="display:flex;gap:.5rem">
          <button class="btn btn-secondary btn-sm" onclick="selectTimelineStep(${Math.max(0,idx-1)})" ${idx===0?'disabled':''}>← Prev</button>
          <button class="btn btn-primary btn-sm" onclick="selectTimelineStep(${Math.min(total-1,idx+1)})" ${idx===total-1?'disabled':''}>Next →</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem">${TIMELINE_STEPS.map((_,i)=>`<button class="tl-dot ${i===idx?'active':''}" onclick="selectTimelineStep(${i})" title="Step ${i+1}"></button>`).join('')}</div>
      </div>
    </div>`;
}

function selectTimelineStep(idx) {
  currentTimelineStep = idx;
  renderTimelineContent(idx);
  updateTimelineControls();
}

function timelinePrev() { if(currentTimelineStep>0) selectTimelineStep(currentTimelineStep-1); }
function timelineNext() { if(typeof TIMELINE_STEPS!=='undefined'&&currentTimelineStep<TIMELINE_STEPS.length-1) selectTimelineStep(currentTimelineStep+1); }
function timelineReset() { stopTimelinePlay(); selectTimelineStep(0); }

function toggleTimelinePlay() {
  const btn = document.getElementById('tl-play-btn');
  if (tlPlayInterval) { stopTimelinePlay(); return; }
  if (btn) btn.textContent = '⏸ Pause';
  tlPlayInterval = setInterval(() => {
    if (typeof TIMELINE_STEPS==='undefined') return;
    if (currentTimelineStep < TIMELINE_STEPS.length-1) {
      selectTimelineStep(currentTimelineStep+1);
    } else { stopTimelinePlay(); }
  }, 4000);
}

function stopTimelinePlay() {
  if (tlPlayInterval) { clearInterval(tlPlayInterval); tlPlayInterval=null; }
  const btn = document.getElementById('tl-play-btn');
  if (btn) btn.textContent = '▶ Play';
}

// ===== JUDGMENT PAGE =====
const JUDGMENT_MODULES = [
  {id:'overview', label:'Overview', icon:'📋', pct:20},
  {id:'daniel7',  label:'Daniel 7', icon:'📕', pct:40},
  {id:'daniel8',  label:'Daniel 8 & 9', icon:'📗', pct:60},
  {id:'1844',     label:'1844 & History', icon:'📆', pct:80},
  {id:'quiz',     label:'Knowledge Check', icon:'✅', pct:100},
];

function renderJudgmentPage() {
  renderJudgmentNav();
  switchJudgmentTab(currentJudgmentTab, null);
}

function renderJudgmentNav() {
  const el = document.getElementById('judgment-nav');
  if (!el) return;
  el.innerHTML = JUDGMENT_MODULES.map(m => `
    <div class="judgment-nav-item ${m.id===currentJudgmentTab?'active':''}" onclick="switchJudgmentTab('${m.id}',null)">
      <span>${m.icon}</span> ${m.label}
    </div>`).join('');
}

function switchJudgmentTab(tab, btn) {
  currentJudgmentTab = tab;
  renderJudgmentNav();
  const mod = JUDGMENT_MODULES.find(m=>m.id===tab);
  const pct = mod ? mod.pct : 0;
  const pctEl = document.getElementById('judgment-pct');
  const barEl = document.getElementById('judgment-progress-bar');
  if (pctEl) pctEl.textContent = pct+'%';
  if (barEl) barEl.style.width = pct+'%';
  const el = document.getElementById('judgment-content');
  if (!el) return;
  switch(tab) {
    case 'overview': el.innerHTML = renderJudgmentOverview(); break;
    case 'daniel7':  el.innerHTML = renderJudgmentDaniel7(); break;
    case 'daniel8':  el.innerHTML = renderJudgmentDaniel8(); break;
    case '1844':     el.innerHTML = renderJudgment1844(); break;
    case 'quiz':     el.innerHTML = renderJudgmentQuiz(); break;
  }
}

function renderJudgmentOverview() {
  return `
  <div class="judgment-overview">
    <div class="notice-box" style="background:#e0eeff;border-color:#1e3a5f">
      <strong>📋 The Investigative Judgment</strong>
      <p>The doctrine of the investigative judgment teaches that before Christ's Second Advent, a pre-Advent judgment occurs in heaven, examining the records of those who have professed faith in God. It began in 1844 at the end of the 2,300-day (year) prophecy of Daniel 8:14.</p>
    </div>
    <div class="grid-2" style="margin-top:1.5rem">
      <div class="card">
        <h3>📖 Biblical Foundation</h3>
        <ul>
          <li><strong>Daniel 7:9-10</strong>: The Ancient of Days sits in judgment; books are opened</li>
          <li><strong>Daniel 8:14</strong>: "Then shall the sanctuary be cleansed"</li>
          <li><strong>Daniel 9:24-27</strong>: 70-week starting point of 457 BC</li>
          <li><strong>Revelation 14:6-7</strong>: "The hour of his judgment is come"</li>
          <li><strong>Hebrews 9:23</strong>: Heavenly things must be purified</li>
          <li><strong>Revelation 11:19</strong>: Temple opened; ark seen in heaven</li>
        </ul>
      </div>
      <div class="card">
        <h3>🏛️ Sanctuary Typology</h3>
        <p>The earthly Day of Atonement (Leviticus 16) was the annual event when the High Priest entered the Most Holy Place and cleansed the sanctuary of the accumulated sin-record.</p>
        <ul>
          <li>Daily ministry = Holy Place = 31–1844 AD</li>
          <li>Day of Atonement = Most Holy = 1844 onwards</li>
          <li>First goat = Christ's atoning blood</li>
          <li>Scapegoat (Azazel) = Satan bears responsibility</li>
        </ul>
      </div>
    </div>
    <div class="card" style="margin-top:1.5rem">
      <h3>📜 Key KJV Text: Daniel 7:9-10</h3>
      <blockquote class="scripture-quote">"I beheld till the thrones were cast down, and the Ancient of days did sit, whose garment was white as snow, and the hair of his head like the pure wool: his throne was like the fiery flame, and his wheels as burning fire. A fiery stream issued and came forth from before him: thousand thousands ministered unto him, and ten thousand times ten thousand stood before him: the judgment was set, and the books were opened." — Daniel 7:9-10 (KJV)</blockquote>
    </div>
    <div class="grid-3" style="margin-top:1.5rem">
      <div class="card" onclick="switchJudgmentTab('daniel7',null)" style="cursor:pointer;border:2px solid #1C2A3920;text-align:center">
        <div style="font-size:2rem">📕</div>
        <h4>Daniel 7</h4>
        <p style="font-size:.85rem;color:#666">The courtroom scene and the Son of Man receiving the kingdom</p>
      </div>
      <div class="card" onclick="switchJudgmentTab('daniel8',null)" style="cursor:pointer;border:2px solid #1C2A3920;text-align:center">
        <div style="font-size:2rem">📗</div>
        <h4>Daniel 8 & 9</h4>
        <p style="font-size:.85rem;color:#666">The 2300-day prophecy and 457 BC starting point</p>
      </div>
      <div class="card" onclick="switchJudgmentTab('1844',null)" style="cursor:pointer;border:2px solid #1C2A3920;text-align:center">
        <div style="font-size:2rem">📆</div>
        <h4>1844 & History</h4>
        <p style="font-size:.85rem;color:#666">The Great Disappointment and its prophetic meaning</p>
      </div>
    </div>
  </div>`;
}

function renderJudgmentDaniel7() {
  return `<div class="judgment-daniel7">
    <h2 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">Daniel 7: The Heavenly Courtroom</h2>
    <div class="scripture-block" style="background:#f7f3ec;border-left:4px solid #8C6B3C;padding:1.25rem;margin-bottom:1.5rem;border-radius:0 .5rem .5rem 0">
      <p style="font-family:'Crimson Text',serif;font-size:1.1rem;font-style:italic;margin:0">"I beheld till the thrones were cast down, and the Ancient of days did sit... the judgment was set, and the books were opened." — Daniel 7:9-10 (KJV)</p>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <h3>The Four Beasts of Daniel 7</h3>
      <div class="grid-2">
        <div>
          <p><strong>Lion (Babylon, 605–539 BC)</strong> — The first beast with eagle's wings, representing Nebuchadnezzar's empire at its height and subsequent humbling.</p>
          <p><strong>Bear (Medo-Persia, 539–331 BC)</strong> — Raised on one side (Persia dominant over Media), devouring three ribs (Babylon, Lydia, Egypt).</p>
        </div>
        <div>
          <p><strong>Leopard (Greece, 331–168 BC)</strong> — Four wings and four heads: Alexander's speed of conquest and the fourfold division after his death.</p>
          <p><strong>Terrible Beast (Rome)</strong> — Ten horns (ten divisions of Rome); the little horn rising among them = medieval papal power.</p>
        </div>
      </div>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <h3>The Judgment Sequence (Daniel 7:9-14, 26-27)</h3>
      <ol style="line-height:2">
        <li>The little horn persecutes the saints (1,260 years: 538–1798 AD)</li>
        <li>The heavenly court convenes; the Ancient of Days takes His seat</li>
        <li>Books of record are opened and reviewed</li>
        <li>The little horn's dominion is taken away</li>
        <li>The Son of Man comes to the Ancient of Days and receives the kingdom</li>
        <li>The saints possess the kingdom</li>
      </ol>
      <div class="notice-box" style="margin-top:1rem;background:#fefce8;border-color:#ca8a04">
        <strong>Key Insight:</strong> The Son of Man "comes" to the Ancient of Days (in heaven, before the Second Advent) — not to earth. This is the commencement of the investigative judgment in 1844, not the Second Coming.
      </div>
    </div>
    <div class="card">
      <h3>Judgment Vindicates the Saints</h3>
      <blockquote class="scripture-quote">"And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed." — Daniel 8:14 (KJV)</blockquote>
      <p>Daniel 7:22 specifies: "judgment was given to the saints." The investigative judgment is not against the saints — it vindicates them, formally declaring before the universe that they are accepted in Christ.</p>
    </div>
  </div>`;
}

function renderJudgmentDaniel8() {
  return `<div class="judgment-daniel8">
    <h2 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">Daniel 8 & 9: The 2300-Day Prophecy</h2>
    <div class="card" style="margin-bottom:1rem">
      <h3>The Prophetic Calculation</h3>
      <div style="background:#1C2A39;color:#f5f0e8;padding:1.5rem;border-radius:.75rem;font-family:monospace;margin:1rem 0">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;text-align:center">
          <div><div style="font-size:1.5rem;font-weight:700;color:#8C6B3C">457 BC</div><div style="font-size:.75rem;margin-top:.25rem;opacity:.8">Artaxerxes' Decree<br>(Ezra 7:12-26)<br>Starting Point</div></div>
          <div><div style="font-size:1.5rem;font-weight:700;color:#8C6B3C">+ 2300 years</div><div style="font-size:.75rem;margin-top:.25rem;opacity:.8">Day-Year Principle<br>(Num 14:34; Eze 4:6)<br>Applied</div></div>
          <div><div style="font-size:1.5rem;font-weight:700;color:#d97706">= 1844 AD</div><div style="font-size:.75rem;margin-top:.25rem;opacity:.8">Sanctuary Cleansed<br>Investigative Judgment<br>Begins</div></div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <h3>The 70-Week Confirmation (Daniel 9:24-27)</h3>
      <p>The 70 weeks (490 years) are "cut off" (<em>chatak</em>) from the 2,300 years — they share the same starting point of 457 BC. This provides a cross-check:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.75rem;margin-top:1rem">
        <div style="background:#e0eeff;padding:.75rem;border-radius:.5rem;text-align:center">
          <div style="font-weight:700;color:#1e3a5f">457 BC</div>
          <div style="font-size:.8rem;margin-top:.25rem">Decree of Artaxerxes</div>
        </div>
        <div style="background:#e0eeff;padding:.75rem;border-radius:.5rem;text-align:center">
          <div style="font-weight:700;color:#1e3a5f">27 AD</div>
          <div style="font-size:.8rem;margin-top:.25rem">Christ's Baptism<br>(69 weeks = 483 yrs)</div>
        </div>
        <div style="background:#e0eeff;padding:.75rem;border-radius:.5rem;text-align:center">
          <div style="font-weight:700;color:#1e3a5f">31 AD</div>
          <div style="font-size:.8rem;margin-top:.25rem">Crucifixion<br>(mid-70th week)</div>
        </div>
        <div style="background:#e0eeff;padding:.75rem;border-radius:.5rem;text-align:center">
          <div style="font-weight:700;color:#1e3a5f">34 AD</div>
          <div style="font-size:.8rem;margin-top:.25rem">End of 70 Weeks<br>Gospel to Gentiles</div>
        </div>
        <div style="background:#fef3c7;padding:.75rem;border-radius:.5rem;text-align:center;border:2px solid #d97706">
          <div style="font-weight:700;color:#92400e">1844 AD</div>
          <div style="font-size:.8rem;margin-top:.25rem">End of 2300 Years<br>Sanctuary Cleansed</div>
        </div>
      </div>
    </div>
    <div class="card">
      <h3>The Year-Day Principle — Biblical Basis</h3>
      <blockquote class="scripture-quote">"After the number of the days in which ye searched the land, even forty days, each day for a year, shall ye bear your iniquities, even forty years." — Numbers 14:34 (KJV)</blockquote>
      <blockquote class="scripture-quote">"I have appointed thee each day for a year." — Ezekiel 4:6 (KJV)</blockquote>
      <p>This principle was used by Protestant Reformers and historicist interpreters long before Adventism — it is not an Adventist innovation.</p>
    </div>
  </div>`;
}

function renderJudgment1844() {
  return `<div>
    <h2 style="font-family:'Cinzel',serif;color:#1C2A39;margin-bottom:1rem">1844 and the Great Disappointment</h2>
    <div class="card" style="margin-bottom:1rem">
      <h3>Historical Context</h3>
      <p>In the 1830s–1840s, William Miller, a Baptist layman from New York, began preaching that Christ would return in 1844 based on Daniel 8:14 and the year-day principle. Tens of thousands across denominations followed the movement.</p>
      <p>On October 22, 1844, the expected date passed without the Second Coming. This became known as the <strong>Great Disappointment</strong>.</p>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <h3>The Theological Resolution</h3>
      <p>A small group of Millerites, studying the sanctuary typology intensively, came to understand: the date was correct — but the event was misidentified. The prophecy did not describe the Second Coming but the commencement of a new phase of Christ's heavenly ministry — the antitypical Day of Atonement.</p>
      <ul>
        <li>O.R.L. Crosier's article (Day-Star Extra, Feb. 7, 1846) laid out the full sanctuary doctrine</li>
        <li>Hiram Edson's cornfield experience gave the initial insight</li>
        <li>Ellen Harmon (White) received confirmatory visions</li>
        <li>Joseph Bates, James White, and others joined in systematic study</li>
      </ul>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <h3>What Happened in 1844?</h3>
      <p>In October 1844, Christ moved from the Holy Place to the Most Holy Place of the heavenly sanctuary — corresponding to the High Priest's entrance into the Most Holy on the Day of Atonement. He began the antitypical Day of Atonement: the investigative judgment.</p>
      <blockquote class="scripture-quote">"And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people, Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come." — Revelation 14:6-7 (KJV)</blockquote>
    </div>
    <div class="card">
      <h3>Significance for Today</h3>
      <p>We live in the most solemn period of earth's history — the antitypical Day of Atonement. The investigative judgment is now in progress. As on the ancient Day of Atonement, God's people are called to examine themselves, to "afflict their souls," to fully trust in Christ's High Priestly ministry, and to allow His righteousness to be their only plea.</p>
      <blockquote class="scripture-quote">"Wherefore, beloved, seeing that ye look for such things, be diligent that ye may be found of him in peace, without spot, and blameless." — 2 Peter 3:14 (KJV)</blockquote>
    </div>
  </div>`;
}

function renderJudgmentQuiz() {
  const questions = [
    {q:"What year did the 2,300-day prophecy of Daniel 8:14 end?",opts:["1798","1844","1863","1888"],ans:1,exp:"Starting from 457 BC and adding 2,300 years (using the day-year principle) arrives at 1844 AD."},
    {q:"In Daniel 7, who opens the books of record?",opts:["Jesus Christ","The Angel Gabriel","The Ancient of Days","Michael the Archangel"],ans:2,exp:"Daniel 7:9-10 describes the Ancient of Days (the Father) sitting in judgment with the books opened."},
    {q:"What Hebrew word in Daniel 8:14 is translated 'cleansed' in the KJV?",opts:["Kaphar","Nitsdaq","Chatak","Tamid"],ans:1,exp:"The Hebrew 'nitsdaq' (from tsadaq = to be righteous/justified) is translated 'cleansed' — meaning vindicated or restored to rightful state."},
    {q:"The 70 weeks of Daniel 9 begin in what year?",opts:["536 BC","520 BC","457 BC","408 BC"],ans:2,exp:"The decree of Artaxerxes I in 457 BC (Ezra 7:12-26) is the starting point, fulfilling 'from the going forth of the commandment to restore and to build Jerusalem.'"},
    {q:"What event in 1798 marked the end of the 1,260-year period?",opts:["Death of Pope Clement XIV","Napoleon invades Rome","Pope Pius VI taken prisoner","Council of Trent ends"],ans:2,exp:"In February 1798, Napoleon's general Berthier took Pope Pius VI prisoner, ending the period of papal supremacy begun in 538 AD."},
  ];
  let html = '<h2 style="font-family:\'Cinzel\',serif;color:#1C2A39;margin-bottom:1rem">Knowledge Check</h2>';
  questions.forEach((q,i) => {
    html += `<div class="quiz-card" id="quiz-${i}">
      <p style="font-weight:600;margin-bottom:.75rem">${i+1}. ${q.q}</p>
      <div class="quiz-options">${q.opts.map((opt,j)=>
        `<button class="quiz-opt" onclick="checkQuizAnswer(${i},${j},${q.ans},'${q.exp.replace(/'/g,'&#39;')}')">${opt}</button>`
      ).join('')}</div>
      <div class="quiz-feedback" id="quiz-fb-${i}" style="display:none"></div>
    </div>`;
  });
  return html;
}

function checkQuizAnswer(qIdx, chosen, correct, explanation) {
  const card = document.getElementById('quiz-'+qIdx);
  const fb = document.getElementById('quiz-fb-'+qIdx);
  if (!card || !fb) return;
  const opts = card.querySelectorAll('.quiz-opt');
  opts.forEach((b,i) => {
    b.disabled = true;
    if (i===correct) b.classList.add('correct');
    else if (i===chosen) b.classList.add('wrong');
  });
  fb.style.display='block';
  fb.innerHTML = chosen===correct
    ? `<div style="color:#15803d;font-weight:600">✓ Correct! ${explanation}</div>`
    : `<div style="color:#dc2626;font-weight:600">✗ Incorrect. ${explanation}</div>`;
}

// ===== SCRIPTURE NAVIGATOR PAGE =====
function renderScripturePage() {
  if (typeof SCRIPTURE_PASSAGES === 'undefined') return;
  renderScriptureList();
  renderScriptureDetail(currentScripturePassage);
}

function filterScriptures(val) {
  if (typeof SCRIPTURE_PASSAGES === 'undefined') return;
  const filtered = val==='all' ? SCRIPTURE_PASSAGES.map((_,i)=>i) : SCRIPTURE_PASSAGES.reduce((acc,p,i)=>{ if((p.element||'').toLowerCase().includes(val)||(p.zone||'').toLowerCase().includes(val)) acc.push(i); return acc; },[]);
  const el = document.getElementById('scripture-passage-list');
  if (!el) return;
  el.innerHTML = (filtered.length?filtered:SCRIPTURE_PASSAGES.map((_,i)=>i)).map(i => {
    const p = SCRIPTURE_PASSAGES[i];
    return `<div class="scripture-nav-item ${i===currentScripturePassage?'active':''}" onclick="selectScripturePassage(${i})">
      <div class="scripture-nav-ref">${p.ref||p.reference||''}</div>
      <div class="scripture-nav-title">${p.title||p.element||''}</div>
    </div>`;
  }).join('');
}

function renderScriptureList() {
  const el = document.getElementById('scripture-passage-list');
  if (!el) return;
  el.innerHTML = SCRIPTURE_PASSAGES.map((p,i) => `
    <div class="scripture-nav-item ${i===currentScripturePassage?'active':''}" onclick="selectScripturePassage(${i})">
      <div class="scripture-nav-ref">${p.ref||p.reference||''}</div>
      <div class="scripture-nav-title">${p.title||p.element||''}</div>
    </div>`).join('');
}

function renderScriptureDetail(idx) {
  const el = document.getElementById('scripture-content');
  if (!el || !SCRIPTURE_PASSAGES[idx]) return;
  const p = SCRIPTURE_PASSAGES[idx];
  const notes = (typeof STUDY_NOTES!=='undefined') ? (STUDY_NOTES[p.ref||p.reference]||STUDY_NOTES[p.element]||null) : null;
  const crossRefs = p.crossRefs||[];
  el.innerHTML = `
    <div class="scripture-detail-card">
      <div class="scripture-detail-header">
        <div style="font-size:.8rem;color:#8C6B3C;text-transform:uppercase;letter-spacing:.08em;font-weight:600">${idx+1} of ${SCRIPTURE_PASSAGES.length}</div>
        <h2 style="font-family:'Cinzel',serif;color:#1C2A39;margin:.25rem 0">${p.title||p.element||''}</h2>
        <p style="color:#8C6B3C;margin:0">${p.ref||p.reference||''}</p>
      </div>
      ${p.text?`
      <div style="background:#f7f3ec;border-left:4px solid #8C6B3C;padding:1.25rem;margin:1.25rem 0;border-radius:0 .5rem .5rem 0">
        <p style="font-family:'Crimson Text',serif;font-size:1.05rem;font-style:italic;margin:0;line-height:1.8">"${p.text}"</p>
        <div style="font-size:.8rem;color:#8C6B3C;margin-top:.5rem;font-weight:600">${p.ref||p.reference||''} (KJV)</div>
      </div>`:''}
      ${p.symbolism?`<div class="card" style="margin-bottom:1rem"><h3>⚜️ Symbolism</h3><p>${p.symbolism}</p></div>`:''}
      ${p.type?`<div class="card" style="margin-bottom:1rem"><h3>🔗 Type & Antitype</h3><p>${p.type}</p></div>`:''}
      ${p.zone?`<div style="display:inline-block;background:#1C2A3910;padding:.3rem .75rem;border-radius:1rem;font-size:.8rem;font-weight:600;color:#1C2A39;margin-bottom:1rem">📍 Zone: ${p.zone}</div>`:''}
      ${crossRefs.length?`
      <div class="card" style="margin-bottom:1rem">
        <h3>📚 Cross-References</h3>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem">${crossRefs.map(r=>`<span class="cross-ref-tag" onclick="navigateToCrossRef('${r}')">${r}</span>`).join('')}</div>
      </div>`:''}
      ${notes?`<div class="card"><h3>📝 Study Notes</h3><p>${notes}</p></div>`:''}
      <div class="scripture-step-nav" style="margin-top:1rem">
        ${idx>0?`<button class="btn btn-secondary btn-sm" onclick="selectScripturePassage(${idx-1})">← Previous</button>`:'<span></span>'}
        ${idx<SCRIPTURE_PASSAGES.length-1?`<button class="btn btn-primary btn-sm" onclick="selectScripturePassage(${idx+1})">Next →</button>`:'<span></span>'}
      </div>
    </div>`;
}

function selectScripturePassage(idx) {
  currentScripturePassage = idx;
  renderScriptureList();
  renderScriptureDetail(idx);
  const detail = document.getElementById('scripture-content');
  if (detail) detail.scrollIntoView({behavior:'smooth',block:'start'});
}

function navigateToCrossRef(ref) {
  const parts = ref.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)/);
  if (parts) {
    const book = parts[1].trim();
    const ch = parseInt(parts[2]);
    if (typeof KJV_BOOKS !== 'undefined') {
      const found = KJV_BOOKS.find(b => b.toLowerCase().startsWith(book.toLowerCase().substring(0,4)));
      if (found) { navigate('bible', {book:found, chapter:ch}); return; }
    }
  }
  showToast('Opening '+ref);
}