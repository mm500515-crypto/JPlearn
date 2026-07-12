// ========================================
// 單字模組
// ========================================

let vocabView = 'list';       // list | flashcard
let vocabCategory = '全部';
let vocabSearch = '';
let vocabFlashcardIndex = 0;
let vocabFlashcardList = [];

function initVocabulary() {
  renderVocabularyPage();
}

function renderVocabularyPage() {
  const container = document.getElementById('vocab-content');

  container.innerHTML = `
    <div class="page-header">
      <h1>單字</h1>
      <p>N5 必學單字 — ${VOCABULARY_DATA.length} 個</p>
    </div>

    <div class="view-toggle">
      <button class="vt-btn ${vocabView === 'list' ? 'active' : ''}" onclick="switchVocabView('list')">📋 列表</button>
      <button class="vt-btn ${vocabView === 'flashcard' ? 'active' : ''}" onclick="switchVocabView('flashcard')">🃏 閃卡</button>
    </div>

    <div id="vocab-view-area"></div>
  `;

  if (vocabView === 'list') {
    renderVocabList();
  } else {
    renderVocabFlashcard();
  }
}

function switchVocabView(view) {
  vocabView = view;
  renderVocabularyPage();
}

function renderVocabList() {
  const area = document.getElementById('vocab-view-area');
  const categories = ['全部', ...new Set(VOCABULARY_DATA.map(v => v.category))];
  const types = ['全部', ...new Set(VOCABULARY_DATA.map(v => v.type))];

  area.innerHTML = `
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="搜尋單字、讀音或意思..." value="${vocabSearch}" oninput="vocabSearchChange(this.value)" id="vocab-search-input">
    </div>

    <div class="category-filter" id="vocab-cat-filter">
      ${categories.map(c => `
        <button class="cat-chip ${vocabCategory === c ? 'active' : ''}" onclick="filterVocabCategory('${c}')">${c}</button>
      `).join('')}
    </div>

    <div class="vocab-list" id="vocab-list-items"></div>
  `;

  updateVocabList();
}

function vocabSearchChange(val) {
  vocabSearch = val;
  updateVocabList();
}

function filterVocabCategory(cat) {
  vocabCategory = cat;
  document.querySelectorAll('#vocab-cat-filter .cat-chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  updateVocabList();
}

function updateVocabList() {
  const list = document.getElementById('vocab-list-items');
  if (!list) return;

  let filtered = VOCABULARY_DATA;

  if (vocabCategory !== '全部') {
    filtered = filtered.filter(v => v.category === vocabCategory);
  }

  if (vocabSearch) {
    const q = vocabSearch.toLowerCase();
    filtered = filtered.filter(v =>
      v.word.includes(q) || v.reading.includes(q) || v.meaning.includes(q)
    );
  }

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="es-icon">🔍</div><div class="es-text">找不到符合的單字</div></div>`;
    return;
  }

  list.innerHTML = filtered.map((v, i) => `
    <div class="vocab-item stagger-item" onclick="showVocabDetail(${VOCABULARY_DATA.indexOf(v)})">
      ${speakBtn(v.reading, '0.9rem')}
      <span class="word jp-text">${escapeHtml(v.word)}</span>
      <span class="reading jp-text">${escapeHtml(v.reading)}</span>
      <span class="meaning">${escapeHtml(v.meaning)}</span>
      <span class="type-badge">${escapeHtml(v.type)}</span>
    </div>
  `).join('');
}

function showVocabDetail(idx) {
  const v = VOCABULARY_DATA[idx];
  const isLearned = AppState.progress.vocabulary.learned.includes(idx);

  showModal(`
    <div style="text-align: center; position: relative;">
      <div style="font-family: var(--font-jp); font-size: 3rem; font-weight: 700; margin-bottom: 8px;">${escapeHtml(v.word)}</div>
      <div style="font-family: var(--font-jp); font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 4px;">${escapeHtml(v.reading)}</div>
      <div style="margin-bottom: 12px;">${speakBtn(v.reading, '1.4rem')}</div>
      <div style="font-size: 1.5rem; color: var(--accent-secondary); font-weight: 600; margin-bottom: 8px;">${escapeHtml(v.meaning)}</div>
      <div style="margin-bottom: 20px;">
        <span class="type-badge" style="font-size: 0.85rem; padding: 4px 14px;">${escapeHtml(v.type)}</span>
      </div>
      <button class="btn ${isLearned ? 'btn-ghost' : 'btn-primary'}" onclick="toggleVocabLearned(${idx})" id="vocab-learn-btn-${idx}">
        ${isLearned ? '✅ 已學會' : '📝 標記為已學會'}
      </button>
      <button class="btn btn-ghost" onclick="hideModal()" style="margin-left: 8px;">關閉</button>
    </div>
  `);
  speakJapanese(v.reading);
}

function toggleVocabLearned(idx) {
  const arr = AppState.progress.vocabulary.learned;
  const pos = arr.indexOf(idx);
  if (pos > -1) {
    arr.splice(pos, 1);
  } else {
    arr.push(idx);
    AppState.recordActivity();
  }
  AppState.save();
  showVocabDetail(idx); // Re-render
}

// --- Flashcard Mode ---
function renderVocabFlashcard() {
  const area = document.getElementById('vocab-view-area');

  // Filter by category
  let filtered = VOCABULARY_DATA.map((v, i) => ({ ...v, originalIdx: i }));
  if (vocabCategory !== '全部') {
    filtered = filtered.filter(v => v.category === vocabCategory);
  }
  vocabFlashcardList = shuffle(filtered);
  vocabFlashcardIndex = 0;

  area.innerHTML = `
    <div class="category-filter">
      ${['全部', ...new Set(VOCABULARY_DATA.map(v => v.category))].map(c => `
        <button class="cat-chip ${vocabCategory === c ? 'active' : ''}" onclick="vocabFlashcardCategory('${c}')">${c}</button>
      `).join('')}
    </div>
    <div id="vocab-fc-area"></div>
  `;

  renderCurrentFlashcard();
}

function vocabFlashcardCategory(cat) {
  vocabCategory = cat;
  renderVocabFlashcard();
}

function renderCurrentFlashcard() {
  const area = document.getElementById('vocab-fc-area');
  if (!area) return;

  if (vocabFlashcardList.length === 0) {
    area.innerHTML = `<div class="empty-state"><div class="es-icon">📚</div><div class="es-text">這個分類沒有單字</div></div>`;
    return;
  }

  if (vocabFlashcardIndex >= vocabFlashcardList.length) {
    area.innerHTML = `
      <div class="quiz-results animate-scale-in">
        <div class="quiz-score">🎉</div>
        <div class="quiz-score-label">全部看完了！</div>
        <button class="btn btn-primary" onclick="renderVocabFlashcard()" style="margin-top: 16px;">重新開始</button>
      </div>
    `;
    return;
  }

  const v = vocabFlashcardList[vocabFlashcardIndex];

  area.innerHTML = `
    <div class="flashcard-container animate-scale-in">
      <div class="flashcard" id="vocab-flashcard" onclick="document.getElementById('vocab-flashcard').classList.toggle('flipped')">
        <div class="flashcard-face flashcard-front">
          <div class="flashcard-type">${escapeHtml(v.type)}</div>
          <div class="flashcard-word jp-text">${escapeHtml(v.word)}</div>
          <div class="flashcard-reading jp-text">${escapeHtml(v.reading)}</div>
          ${speakBtn(v.reading, '1.3rem')}
          <div class="flashcard-hint">點擊翻牌</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="flashcard-word jp-text" style="font-size: 2rem;">${escapeHtml(v.word)}</div>
          <div class="flashcard-meaning">${escapeHtml(v.meaning)}</div>
          <div class="flashcard-reading jp-text">${escapeHtml(v.reading)}</div>
          ${speakBtn(v.reading, '1.3rem')}
          <div class="flashcard-hint">點擊翻回</div>
        </div>
      </div>
    </div>

    <div class="flashcard-controls">
      <button class="fc-btn dont-know" onclick="vocabFlashcardNext(false)" title="需要複習">✕</button>
      <div class="fc-counter">${vocabFlashcardIndex + 1} / ${vocabFlashcardList.length}</div>
      <button class="fc-btn know" onclick="vocabFlashcardNext(true)" title="已學會">✓</button>
    </div>
  `;
  speakJapanese(v.reading);
}

function vocabFlashcardNext(known) {
  const v = vocabFlashcardList[vocabFlashcardIndex];
  if (known) {
    if (!AppState.progress.vocabulary.learned.includes(v.originalIdx)) {
      AppState.progress.vocabulary.learned.push(v.originalIdx);
      AppState.recordActivity();
    }
  }
  AppState.save();
  vocabFlashcardIndex++;
  renderCurrentFlashcard();
}
