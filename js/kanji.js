// ========================================
// 漢字模組
// ========================================

let kanjiGroup = '全部';
let kanjiView = 'grid'; // grid | flashcard

function initKanji() {
  renderKanjiPage();
}

function renderKanjiPage() {
  const container = document.getElementById('kanji-content');
  const groups = ['全部', ...new Set(KANJI_DATA.map(k => k.group))];

  container.innerHTML = `
    <div class="page-header">
      <h1>漢字</h1>
      <p>N5 必學漢字 — ${KANJI_DATA.length} 個</p>
    </div>

    <div class="view-toggle">
      <button class="vt-btn ${kanjiView === 'grid' ? 'active' : ''}" onclick="switchKanjiView('grid')">📋 總覽</button>
      <button class="vt-btn ${kanjiView === 'flashcard' ? 'active' : ''}" onclick="switchKanjiView('flashcard')">🃏 閃卡</button>
    </div>

    <div class="category-filter">
      ${groups.map(g => `
        <button class="cat-chip ${kanjiGroup === g ? 'active' : ''}" onclick="filterKanjiGroup('${g}')">${g}</button>
      `).join('')}
    </div>

    <div id="kanji-view-area"></div>
  `;

  if (kanjiView === 'grid') {
    renderKanjiGrid();
  } else {
    renderKanjiFlashcard();
  }
}

function switchKanjiView(view) {
  kanjiView = view;
  renderKanjiPage();
}

function filterKanjiGroup(group) {
  kanjiGroup = group;
  renderKanjiPage();
}

function getFilteredKanji() {
  if (kanjiGroup === '全部') return KANJI_DATA;
  return KANJI_DATA.filter(k => k.group === kanjiGroup);
}

function renderKanjiGrid() {
  const area = document.getElementById('kanji-view-area');
  const filtered = getFilteredKanji();

  area.innerHTML = `<div class="kanji-grid">
    ${filtered.map((k, i) => {
      const idx = KANJI_DATA.indexOf(k);
      const isLearned = AppState.progress.kanji.learned.includes(idx);
      return `
        <div class="kanji-card stagger-item" onclick="showKanjiDetail(${idx})" style="${isLearned ? 'border-color: rgba(0, 212, 170, 0.3);' : ''}">
          <div class="kanji-big jp-text">${k.kanji}</div>
          <div class="kanji-meaning">${k.meaning}</div>
          ${isLearned ? '<div style="font-size:0.7rem; color: var(--accent-secondary); margin-top:4px;">✓ 已學</div>' : ''}
        </div>
      `;
    }).join('')}
  </div>`;
}

function showKanjiDetail(idx) {
  const k = KANJI_DATA[idx];
  const isLearned = AppState.progress.kanji.learned.includes(idx);

  showModal(`
    <div style="position: relative;">
      <div class="modal-kanji">${k.kanji}</div>

      <div class="modal-info-grid">
        <div class="modal-info-item">
          <div class="label">音讀</div>
          <div class="value jp-text">${k.onyomi || '—'}</div>
        </div>
        <div class="modal-info-item">
          <div class="label">訓讀</div>
          <div class="value jp-text">${k.kunyomi || '—'}</div>
        </div>
        <div class="modal-info-item">
          <div class="label">意思</div>
          <div class="value">${k.meaning}</div>
        </div>
        <div class="modal-info-item">
          <div class="label">分組</div>
          <div class="value">${k.group}</div>
        </div>
      </div>

      ${k.examples.length > 0 ? `
        <div class="modal-examples">
          <h4>📝 例詞</h4>
          ${k.examples.map(ex => `
            <div class="example-item">
              <span class="ex-word jp-text">${ex.word}</span>
              <span class="ex-reading jp-text" style="margin-left: 8px;">${ex.reading}</span>
              <div class="ex-meaning">${ex.meaning}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 20px;">
        <button class="btn ${isLearned ? 'btn-ghost' : 'btn-primary'}" onclick="toggleKanjiLearned(${idx})">
          ${isLearned ? '✅ 已學會' : '📝 標記為已學會'}
        </button>
        <button class="btn btn-ghost" onclick="hideModal()" style="margin-left: 8px;">關閉</button>
      </div>
    </div>
  `);
  speakJapanese(k.kanji);
}

function toggleKanjiLearned(idx) {
  const arr = AppState.progress.kanji.learned;
  const pos = arr.indexOf(idx);
  if (pos > -1) {
    arr.splice(pos, 1);
  } else {
    arr.push(idx);
    AppState.recordActivity();
  }
  AppState.save();
  showKanjiDetail(idx);
}

// --- Kanji Flashcard ---
let kanjiFlashcardIndex = 0;
let kanjiFlashcardList = [];

function renderKanjiFlashcard() {
  const area = document.getElementById('kanji-view-area');
  kanjiFlashcardList = shuffle(getFilteredKanji().map((k, i) => ({ ...k, originalIdx: KANJI_DATA.indexOf(k) })));
  kanjiFlashcardIndex = 0;
  renderCurrentKanjiFlashcard();
}

function renderCurrentKanjiFlashcard() {
  const area = document.getElementById('kanji-view-area');
  if (!area) return;

  if (kanjiFlashcardList.length === 0) {
    area.innerHTML = `<div class="empty-state"><div class="es-icon">📚</div><div class="es-text">這個分組沒有漢字</div></div>`;
    return;
  }

  if (kanjiFlashcardIndex >= kanjiFlashcardList.length) {
    area.innerHTML = `
      <div class="quiz-results animate-scale-in">
        <div class="quiz-score">🎉</div>
        <div class="quiz-score-label">全部看完了！</div>
        <button class="btn btn-primary" onclick="renderKanjiFlashcard()" style="margin-top: 16px;">重新開始</button>
      </div>
    `;
    return;
  }

  const k = kanjiFlashcardList[kanjiFlashcardIndex];

  area.innerHTML = `
    <div class="flashcard-container animate-scale-in">
      <div class="flashcard" id="kanji-flashcard" onclick="document.getElementById('kanji-flashcard').classList.toggle('flipped')">
        <div class="flashcard-face flashcard-front">
          <div class="flashcard-type">${k.group}</div>
          <div class="flashcard-word jp-text" style="font-size: 5rem;">${k.kanji}</div>
          <div class="flashcard-hint">點擊翻牌</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="flashcard-word jp-text" style="font-size: 3rem;">${k.kanji}</div>
          <div class="flashcard-meaning" style="font-size: 1.3rem;">${k.meaning}</div>
          <div style="font-family: var(--font-jp); color: var(--text-secondary); font-size: 0.9rem;">
            音: ${k.onyomi || '—'} ｜ 訓: ${k.kunyomi || '—'}
          </div>
          ${k.examples[0] ? `<div style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 8px;">例: ${k.examples[0].word}（${k.examples[0].meaning}）</div>` : ''}
          <div class="flashcard-hint">點擊翻回</div>
        </div>
      </div>
    </div>

    <div class="flashcard-controls">
      <button class="fc-btn dont-know" onclick="kanjiFlashcardNext(false)" title="需要複習">✕</button>
      <div class="fc-counter">${kanjiFlashcardIndex + 1} / ${kanjiFlashcardList.length}</div>
      <button class="fc-btn know" onclick="kanjiFlashcardNext(true)" title="已學會">✓</button>
    </div>
  `;
  speakJapanese(k.kanji);
}

function kanjiFlashcardNext(known) {
  const k = kanjiFlashcardList[kanjiFlashcardIndex];
  if (known && !AppState.progress.kanji.learned.includes(k.originalIdx)) {
    AppState.progress.kanji.learned.push(k.originalIdx);
    AppState.recordActivity();
  }
  AppState.save();
  kanjiFlashcardIndex++;
  renderCurrentKanjiFlashcard();
}
