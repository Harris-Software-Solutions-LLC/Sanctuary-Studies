// ===== SANCTUARY STUDY PLATFORM — CORE =====
'use strict';

// ===== STATE =====
let currentPage = 'home';
let currentBibleBook = 'Exodus';
let currentBibleChapter = 25;
let currentTimelineStep = 0;
let currentMythCat = 'all';
let currentForumCat = 'all';
let currentJudgmentTab = 'overview';
let currentSymbolismTab = 'furnishings';
let currentHeavenlyStage = 0;
let currentCompareTab = 'structural';
let currentScripturePassage = 0;
let currentBookChapter = {};
let currentColorsItem = null;

// ===== NAVIGATION =====
function navigate(page, opts) {
  closeMobileMenu();
  document.querySelectorAll('.page').forEach(p => { p.style.display='none'; p.classList.remove('active'); });
  const so = document.getElementById('search-overlay');
  if (so) so.classList.remove('active');
  currentPage = page;

  let el = document.getElementById('page-' + page);
  if (!el && page.startsWith('book-')) {
    el = document.createElement('div');
    el.id = 'page-' + page;
    el.className = 'page';
    const main = document.querySelector('main');
    if (main) main.appendChild(el);
  }
  if (el) { el.style.display='block'; el.classList.add('active'); window.scrollTo(0,0); }
  updateBottomNav(page);
  renderPage(page, opts);
}

function renderPage(page, opts) {
  switch(page) {
    case 'home':             renderHomePage(); break;
    case 'bible':            renderBiblePage(opts); break;
    case 'library':          renderLibraryPage(); break;
    case 'book-crosier':     renderBookViewer('crosier'); break;
    case 'book-haskell':     renderBookViewer('haskell'); break;
    case 'book-andreasen':   renderBookViewer('andreasen'); break;
    case 'book-gilbert':     renderBookViewer('gilbert'); break;
    case 'book-defense':     renderBookViewer('defense'); break;
    case 'timeline':         renderTimelinePage(); break;
    case 'judgment':         renderJudgmentPage(); break;
    case 'scripture':        renderScripturePage(); break;
    case 'symbolism':        renderSymbolismPage(); break;
    case 'colors':           renderColorsPage(); break;
    case 'heavenly':         renderHeavenlyPage(); break;
    case 'compare':          renderComparePage(); break;
    case 'explorer':         renderExplorerPage(); break;
    case 'media':            renderMediaPage(); break;
    case 'educators':        renderEducatorsPage(); break;
    case 'forums':           renderForumsPage(); break;
    case 'profiles':         renderProfilesPage(); break;
    case 'myths':            renderMythsPage(); break;
  }
}

function updateBottomNav(page) {
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  const map = {'home':'bn-home','bible':'bn-bible','library':'bn-library','timeline':'bn-timeline'};
  const id = map[page];
  if (id) { const btn=document.getElementById(id); if(btn) btn.classList.add('active'); }
}

function toggleMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('open');
}
function closeMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.remove('open');
}

// ===== SEARCH =====
function toggleSearch() {
  const so = document.getElementById('search-overlay');
  if (!so) return;
  so.classList.toggle('active');
  if (so.classList.contains('active')) setTimeout(() => { const inp=document.getElementById('search-input'); if(inp) inp.focus(); }, 100);
}
function closeSearch(evt) {
  if (!evt || evt.target.id==='search-overlay') {
    const so=document.getElementById('search-overlay'); if(so) so.classList.remove('active');
  }
}
function doSearch(q) {
  const res = document.getElementById('search-results');
  if (!res) return;
  q = (q||'').trim().toLowerCase();
  if (q.length < 2) { res.innerHTML=''; return; }
  const results = [];
  const pages = [
    {title:'KJV Bible Study',page:'bible',desc:'King James Version with sanctuary passages'},
    {title:'Digital Library',page:'library',desc:'Classic Adventist texts'},
    {title:'Ministry Timeline',page:'timeline',desc:'14-step parallel ministry comparison'},
    {title:'Investigative Judgment',page:'judgment',desc:'Daniel 8:14 and 1844'},
    {title:'Scripture Navigator',page:'scripture',desc:'Sanctuary scripture passages'},
    {title:'Symbolism Explorer',page:'symbolism',desc:'Sanctuary furnishings and symbols'},
    {title:'Sacred Colors',page:'colors',desc:'Eight sacred colors of the sanctuary'},
    {title:'Heavenly Portal',page:'heavenly',desc:'Journey to throne room of God'},
    {title:'Compare Sanctuaries',page:'compare',desc:'Side-by-side sanctuary comparison'},
    {title:'3D Sanctuary Explorer',page:'explorer',desc:'Interactive sanctuary models'},
    {title:'Myth vs. Fact',page:'myths',desc:'Clarifying doctrinal misconceptions'},
    {title:'Educator Resources',page:'educators',desc:'Teaching tools and lesson plans'},
    {title:'Media',page:'media',desc:'Podcasts and video series'},
    {title:'Forums',page:'forums',desc:'Community discussions'},
  ];
  pages.forEach(p => {
    if (p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q))
      results.push({type:'Page',title:p.title,desc:p.desc,pg:p.page});
  });
  if (typeof MYTHS_DATA!=='undefined') MYTHS_DATA.forEach(m => {
    if (m.myth.toLowerCase().includes(q)||m.fact.toLowerCase().includes(q))
      results.push({type:'Myth vs. Fact',title:m.myth.substring(0,60)+'...',desc:m.fact,pg:'myths'});
  });
  if (typeof LIBRARY_BOOKS!=='undefined') LIBRARY_BOOKS.forEach(b => {
    if (b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q))
      results.push({type:'Library',title:b.title,desc:'By '+b.author,pg:'book-'+b.id});
  });
  if (typeof SACRED_COLORS!=='undefined') SACRED_COLORS.forEach(c => {
    if ((c.name||'').toLowerCase().includes(q)||(c.meaning||'').toLowerCase().includes(q))
      results.push({type:'Sacred Color',title:c.name+' - '+c.meaning,desc:(c.symbolism||'').substring(0,80),pg:'colors'});
  });
  if (results.length===0) { res.innerHTML='<div style="padding:1rem;color:#888;text-align:center">No results found</div>'; return; }
  res.innerHTML = results.slice(0,10).map(r =>
    `<div class="search-result-item" onclick="navigate('${r.pg}');closeSearch()">
      <span class="search-result-type">${r.type}</span>
      <div class="search-result-title">${r.title}</div>
      <div class="search-result-desc">${r.desc}</div>
    </div>`).join('');
}

// ===== TOAST =====
function showToast(msg, duration) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration||3000);
}

// ===== HOME PAGE =====
function renderHomePage() {
  const featEl = document.getElementById('feature-grid');
  if (featEl && typeof HOME_FEATURES!=='undefined') {
    featEl.innerHTML = HOME_FEATURES.map(f =>
      `<div class="feature-card" onclick="navigate('${f.page}')">
        <div class="feature-icon">${f.icon}</div>
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
        <ul class="feature-list">${f.features.map(item=>`<li>${item}</li>`).join('')}</ul>
        <div class="feature-cta">Explore &rarr;</div>
      </div>`).join('');
  }
  renderDonationBanner();
}

function renderDonationBanner() {
  let el = document.getElementById('donation-banner');
  if (!el) {
    const heroEl = document.querySelector('#page-home .container');
    if (heroEl) {
      el = document.createElement('div');
      el.id = 'donation-banner';
      heroEl.appendChild(el);
    } else return;
  }
  el.innerHTML = `
    <div style="margin:2rem 0;background:linear-gradient(135deg,#1C2A39 0%,#2d4a6e 50%,#1C2A39 100%);border-radius:16px;padding:2rem 2.5rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;position:relative;overflow:hidden">
      <div style="position:absolute;right:-20px;top:-20px;font-size:8rem;opacity:.06;pointer-events:none">&#x1F3DB;&#xFE0F;</div>
      <div style="position:absolute;left:30%;bottom:-10px;font-size:5rem;opacity:.04;pointer-events:none">&#x1F4DC;</div>
      <div style="flex:1;min-width:240px;position:relative">
        <div style="font-family:'Cinzel',serif;font-size:1.3rem;font-weight:700;margin-bottom:.4rem;color:#ffffff !important">Support Sanctuary Studies</div>
        <p style="margin:0;font-size:.9rem;line-height:1.6;color:rgba(255,255,255,0.92) !important">This app is free and ad-free &mdash; created to illuminate the beautiful sanctuary truth for students of Scripture worldwide. If it has been a blessing to you, please consider a gift to help cover hosting, development, and future features.</p>
        <div style="display:flex;gap:1.5rem;margin-top:.75rem;font-size:.8rem;color:rgba(255,255,255,0.82) !important">
          <span style="color:rgba(255,255,255,0.82) !important">&#x2705; Ad-free forever</span>
          <span style="color:rgba(255,255,255,0.82) !important">&#x2705; No subscription</span>
          <span style="color:rgba(255,255,255,0.82) !important">&#x2705; Offline-capable</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.75rem;flex-shrink:0;position:relative">
        <a href="https://www.paypal.com/donate/?hosted_button_id=Z2T57WZMGV9UQ" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:.6rem;background:#f59e0b;color:#1C2A39 !important;padding:.75rem 1.5rem;border-radius:9999px;font-weight:800;font-size:.9rem;text-decoration:none;box-shadow:0 4px 12px rgba(245,158,11,.4);transition:all .2s"
          onmouseover="this.style.background='#d97706';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.background='#f59e0b';this.style.transform='translateY(0)'">
          &#x1F49B; Donate via PayPal
        </a>
        <a href="https://buy.stripe.com/eVq9AUaZD7aoeUE3MU4Vy00" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:.6rem;background:#6366f1;color:#ffffff !important;padding:.75rem 1.5rem;border-radius:9999px;font-weight:800;font-size:.9rem;text-decoration:none;box-shadow:0 4px 12px rgba(99,102,241,.4);transition:all .2s"
          onmouseover="this.style.background='#4f46e5';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.background='#6366f1';this.style.transform='translateY(0)'">
          &#x1F4B3; Donate via Stripe
        </a>
        <button onclick="this.closest('#donation-banner').style.display='none';localStorage.setItem('donation-dismissed','1')"
          style="background:transparent;border:none;color:rgba(255,255,255,.6) !important;font-size:.75rem;cursor:pointer;padding:.2rem;text-align:center">
          Dismiss
        </button>
      </div>
    </div>`;
  if (localStorage.getItem('donation-dismissed')==='1') {
    el.style.display = 'none';
  }
}

// ===== BIBLE PAGE =====
function renderBiblePage(opts) {
  if (opts&&opts.book) currentBibleBook=opts.book;
  if (opts&&opts.chapter) currentBibleChapter=opts.chapter;
  renderBibleBookSelector();
  renderChapterGrid();
  renderBibleText();
}

function renderBibleBookSelector() {
  const el=document.getElementById('bible-book-select');
  if (!el||typeof KJV_BOOKS==='undefined') return;
  el.innerHTML=KJV_BOOKS.map(b=>`<option value="${b}" ${b===currentBibleBook?'selected':''}>${b}</option>`).join('');
  el.onchange=function(){ currentBibleBook=this.value; currentBibleChapter=1; renderChapterGrid(); renderBibleText(); };
}

function updateBibleBook(val) { currentBibleBook=val; currentBibleChapter=1; renderChapterGrid(); renderBibleText(); }

function renderChapterGrid() {
  const el=document.getElementById('chapter-grid');
  if (!el||typeof KJV_CHAPTERS==='undefined') return;
  const chapters=KJV_CHAPTERS[currentBibleBook]||1;
  let html='';
  for(let i=1;i<=chapters;i++){
    html+=`<button class="chapter-btn ${i===currentBibleChapter?'active':''}" onclick="goToChapter(${i})">${i}</button>`;
  }
  el.innerHTML=html;
}

function goToChapter(ch) { currentBibleChapter=ch; renderChapterGrid(); renderBibleText(); }
function goToVerse(book, ch) { currentBibleBook=book; currentBibleChapter=ch; renderBibleBookSelector(); renderChapterGrid(); renderBibleText(); }

function renderBibleText() {
  const el=document.getElementById('bible-text');
  if (!el) return;
  const titleEl=document.getElementById('bible-chapter-title');
  if (titleEl) titleEl.textContent=currentBibleBook+' '+currentBibleChapter+' (KJV)';
  const chData=(typeof KJV_VERSES!=='undefined')&&KJV_VERSES[currentBibleBook]&&KJV_VERSES[currentBibleBook][currentBibleChapter];
  const ctxMap={
    'Exodus|25':"Tabernacle instructions — the Ark, Mercy Seat, Table of Shewbread, Golden Lampstand",
    'Exodus|40':"The Tabernacle completed; the Shekinah glory fills it",
    'Leviticus|16':"Day of Atonement — Aaron's ministry in the Most Holy Place; the two goats",
    'Daniel|7':"Four beasts, the Ancient of Days, the investigative judgment, Son of Man receives kingdom",
    'Daniel|8':"The ram, he-goat, little horn, and the 2,300-day prophecy",
    'Daniel|9':"Seventy-week prophecy — 457 BC starting point; the Messiah cut off",
    'Hebrews|1':"Christ, the radiance of God's glory — superior to angels",
    'Hebrews|4':"Christ our present High Priest — come boldly to the throne of grace",
    'Hebrews|7':"Christ's Melchizedek priesthood — superior to the Levitical order",
    'Hebrews|8':"Christ ministers in the heavenly sanctuary — the true tabernacle",
    'Hebrews|9':"The two apartments: daily priests vs. High Priest; Christ's better blood",
    'Hebrews|10':"The new and living way — boldness to enter the holiest by Christ's blood",
    'Revelation|4':"John's vision of the throne room of God — the heavenly Holy Place",
    'Revelation|5':"The Lamb worthy to open the seals — received the book before the throne",
    'Revelation|11':"The temple of God opened in heaven — the ark of the testament seen",
    'Revelation|14':"The three angels' messages — the hour of His judgment is come",
    'Psalms|23':"The Lord is my shepherd — divine care and provision",
    'Romans|3':"All have sinned — justified freely by His grace through Christ",
    'Romans|8':"No condemnation in Christ Jesus — more than conquerors",
    'John|3':"Born again — God so loved the world — eternal life through Christ"
  };
  const ctx=ctxMap[currentBibleBook+'|'+currentBibleChapter];
  if (chData) {
    el.innerHTML=(ctx?`<p class="chapter-context-note">${ctx}</p>`:'')+
      `<div class="bible-verses">${chData.map(v=>`<p class="bible-verse"><sup class="verse-num">${v.v}</sup>${v.t}</p>`).join('')}</div>`;
  } else {
    el.innerHTML=(ctx?`<p class="chapter-context-note">${ctx}</p>`:'')+
      `<div class="notice-box">
        <p><strong>${currentBibleBook} ${currentBibleChapter}</strong> — Sanctuary-focused chapters have complete KJV text pre-loaded.</p>
        <p style="margin-top:.5rem;font-size:.85rem;color:#666">Pre-loaded: Genesis 1 · Exodus 25,40 · Leviticus 16 · Daniel 7-9 · Hebrews 1-10 · Revelation 4-5,11,14 · John 1,3 · Romans 3,8 · Ephesians 2 · Psalms 23,91 · Matthew 5,27 · 1 Kings 6</p>
        <div style="margin-top:1rem;display:flex;gap:.75rem;flex-wrap:wrap">
          <button class="tool-btn" onclick="goToVerse('Hebrews',9)">📖 Open Hebrews 9</button>
          <button class="tool-btn" onclick="navigate('scripture')">🔍 Scripture Navigator</button>
        </div>
      </div>`;
  }
  renderBibleCrossRefs();
  renderBibleStudyNotes();
}

function prevChapter(){ if(currentBibleChapter>1){currentBibleChapter--;renderChapterGrid();renderBibleText();} }
function nextChapter(){ const max=(typeof KJV_CHAPTERS!=='undefined'?KJV_CHAPTERS[currentBibleBook]:1)||1; if(currentBibleChapter<max){currentBibleChapter++;renderChapterGrid();renderBibleText();} }

let memMode = false;
function toggleMemMode() {
  memMode = !memMode;
  const btn = document.getElementById('mem-btn');
  if (btn) btn.textContent = memMode ? '🧠 Exit Memorization Mode' : '🧠 Memorization Mode';
  const verses = document.querySelectorAll('.bible-verse');
  verses.forEach(v => v.classList.toggle('mem-mode', memMode));
  showToast(memMode ? 'Memorization mode ON — tap a verse to reveal' : 'Memorization mode OFF');
}

function searchBible(q) {
  const el = document.getElementById('bible-search-results');
  if (!el) return;
  if (!q||q.trim().length<3) { el.innerHTML=''; return; }
  q = q.toLowerCase();
  const results=[];
  if (typeof KJV_VERSES!=='undefined') {
    Object.keys(KJV_VERSES).forEach(book => {
      Object.keys(KJV_VERSES[book]).forEach(ch => {
        KJV_VERSES[book][ch].forEach(v => {
          if (v.t.toLowerCase().includes(q)) results.push({book,ch:parseInt(ch),v:v.v,text:v.t});
        });
      });
    });
  }
  if (results.length===0) { el.innerHTML='<p style="font-size:.8rem;color:#888;padding:.5rem">No results found</p>'; return; }
  el.innerHTML = results.slice(0,8).map(r =>
    `<div class="bible-search-result" onclick="goToVerse('${r.book}',${r.ch})">
      <div style="font-size:.75rem;font-weight:700;color:#8C6B3C">${r.book} ${r.ch}:${r.v}</div>
      <div style="font-size:.8rem;color:#555">${r.text.substring(0,80)}...</div>
    </div>`).join('');
}

function renderBibleCrossRefs() {
  const el = document.getElementById('cross-refs');
  if (!el) return;
  const key = currentBibleBook+'|'+currentBibleChapter;
  const defaultMap = {
    'Hebrews|9':['Leviticus 16','Hebrews 8:1-2','Daniel 8:14','Revelation 11:19'],
    'Hebrews|8':['Exodus 25:40','Hebrews 9:11-12','Revelation 21:22'],
    'Hebrews|10':['Romans 8:1','Hebrews 4:16','Ephesians 2:8-9'],
    'Daniel|8':['Daniel 9:24-27','Numbers 14:34','Ezekiel 4:6'],
    'Daniel|7':['Revelation 20:12','Romans 3:4','Daniel 8:14'],
    'Leviticus|16':['Hebrews 9:7','Hebrews 13:12','Romans 3:25'],
    'Revelation|11':['Hebrews 8:2','Revelation 4:5','Daniel 8:14']
  };
  const refs = (typeof CROSS_REFS!=='undefined' && CROSS_REFS[key]) || defaultMap[key] || [];
  if (refs.length===0) { el.innerHTML='<p style="font-size:.8rem;color:#888">No cross-references loaded for this chapter.</p>'; return; }
  el.innerHTML = refs.map(r=>`<span class="cross-ref-tag" style="cursor:pointer;display:inline-block;margin:.2rem" onclick="navigateToCrossRef('${r}')">${r}</span>`).join('');
}

function renderBibleStudyNotes() {
  const el = document.getElementById('study-notes');
  if (!el) return;
  const defaultNotes = {
    'Hebrews 9':"The key chapter distinguishing the two sanctuary apartments. The Holy Spirit interprets (v.8): access to the Most Holy was not open while the earthly system stood. Christ's blood is superior to all animal blood.",
    'Daniel 8':"The central 2,300-day prophecy (v.14). 'Sanctuary' = the heavenly sanctuary. 'Cleansed' (Hebrew: nitsdaq) = vindicated/justified. The vision concerns 'the time of the end' (v.17).",
    'Leviticus 16':"The Day of Atonement. Two goats: (1) Sacrifice for sin = Christ; (2) Azazel/scapegoat = Satan, who ultimately bears the sins he instigated — not as an atoner, but as their originator.",
    'Daniel 7':"Pre-Advent investigative judgment (vv.9-10). The books of record are opened before the Second Coming. 'Judgment was given to the saints' (v.22) — it vindicates them.",
    'Hebrews 8':"The 'true tabernacle' (v.2) — the heavenly original of which the earthly was a copy (v.5). Christ is a minister (leitourgos) there NOW, in the present tense.",
    'Revelation 11':"At the seventh trumpet, the heavenly temple is opened and the ark is seen (v.19) — confirming the reality of the heavenly sanctuary and its Most Holy Place.",
    'Exodus 25':"God's instructions for the tabernacle — 'according to all that I shew thee, after the pattern' (v.9). The earthly was a copy of the heavenly original shown to Moses."
  };
  const note = defaultNotes[currentBibleBook+' '+currentBibleChapter] || 'Use the Scripture Navigator for detailed sanctuary-passage study notes and cross-references.';
  el.innerHTML = `<p style="font-size:.85rem;color:#555;line-height:1.7">${note}</p>`;
}

// ===== LIBRARY PAGE =====
function renderLibraryPage() {
  if (typeof LIBRARY_BOOKS==='undefined') return;
  // Featured books (first 2 in a featured row)
  const featEl=document.getElementById('library-featured');
  if (featEl) {
    featEl.innerHTML=LIBRARY_BOOKS.slice(0,2).map(b=>`
      <div class="library-book-card library-book-featured" onclick="navigate('book-${b.id}')" style="border-left:5px solid ${b.color}">
        <div style="background:${b.color}15;padding:1.5rem;border-radius:.5rem;display:flex;gap:1.25rem;align-items:flex-start;flex-wrap:wrap">
          <div style="background:${b.color};padding:1.25rem 1rem;border-radius:.5rem;min-width:60px;text-align:center">
            <div style="font-size:2rem">📚</div>
            <div style="font-size:.6rem;color:white;margin-top:.25rem;font-family:'Cinzel',serif;text-transform:uppercase">KJV</div>
          </div>
          <div style="flex:1;min-width:200px">
            <div style="background:${b.color}20;color:${b.color};border:1px solid ${b.color}40;display:inline-block;padding:.15rem .6rem;border-radius:1rem;font-size:.75rem;font-weight:700;margin-bottom:.5rem">${b.special}</div>
            <h3 style="font-family:'Cinzel',serif;color:#1C2A39;margin:0 0 .25rem">${b.title}</h3>
            <p style="color:#8C6B3C;margin:0 0 .5rem;font-size:.9rem">${b.author} &bull; ${b.year}</p>
            <p style="color:#555;font-size:.85rem;margin-bottom:.75rem">${b.desc}</p>
            <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem">${b.tags.map(t=>`<span class="book-tag">${t}</span>`).join('')}</div>
            <button class="btn btn-primary btn-sm">Open Book &rarr;</button>
          </div>
        </div>
      </div>`).join('');
  }
  // All books grid
  const resEl=document.getElementById('library-resources');
  if (resEl) {
    resEl.innerHTML=LIBRARY_BOOKS.map(b=>`
      <div class="library-book-card" onclick="navigate('book-${b.id}')" style="border-top:4px solid ${b.color};cursor:pointer">
        <div style="padding:1.25rem">
          <div style="background:${b.color}20;color:${b.color};border:1px solid ${b.color}40;display:inline-block;padding:.1rem .5rem;border-radius:1rem;font-size:.7rem;font-weight:700;margin-bottom:.5rem">${b.special}</div>
          <h4 style="font-family:'Cinzel',serif;color:#1C2A39;margin:0 0 .25rem;font-size:.95rem">${b.title}</h4>
          <p style="color:#8C6B3C;font-size:.8rem;margin:0 0 .5rem">${b.author}</p>
          <p style="color:#555;font-size:.82rem;margin-bottom:.75rem;line-height:1.5">${b.desc.substring(0,120)}...</p>
          <div style="display:flex;gap:.75rem;font-size:.78rem;color:#888;margin-bottom:.75rem">
            <span>📖 ${b.chapters} ch.</span><span>📜 ${b.scriptures}</span>
          </div>
          <button class="btn btn-primary btn-sm" style="width:100%">Read Book</button>
        </div>
      </div>`).join('');
  }
}

// Init on load
document.addEventListener('DOMContentLoaded', function() {
  navigate('home');
});