// ========================================
// 文法模組
// ========================================

let grammarCategory = '全部';

function initGrammar() {
  renderGrammarPage();
}

function renderGrammarPage() {
  const container = document.getElementById('grammar-content');
  const categories = ['全部', ...new Set(GRAMMAR_DATA.map(g => g.category))];

  container.innerHTML = `
    <div class="page-header">
      <h1>文法</h1>
      <p>N5 核心文法 — ${GRAMMAR_DATA.length} 個語法點</p>
    </div>

    <div class="category-filter">
      ${categories.map(c => `
        <button class="cat-chip ${grammarCategory === c ? 'active' : ''}" onclick="filterGrammarCategory('${c}')">${c}</button>
      `).join('')}
    </div>

    <div class="grammar-list" id="grammar-list-items"></div>
  `;

  renderGrammarList();
}

function filterGrammarCategory(cat) {
  grammarCategory = cat;
  renderGrammarPage();
}

function renderGrammarList() {
  const list = document.getElementById('grammar-list-items');
  let filtered = GRAMMAR_DATA;
  if (grammarCategory !== '全部') {
    filtered = filtered.filter(g => g.category === grammarCategory);
  }

  const bookmarked = AppState.progress.grammar.bookmarked;

  list.innerHTML = filtered.map(g => `
    <div class="grammar-item stagger-item" id="grammar-${g.id}">
      <div class="grammar-header" onclick="toggleGrammar(${g.id})">
        <div class="grammar-number">${g.id}</div>
        <div class="grammar-pattern jp-text">${escapeHtml(g.pattern)}</div>
        <div class="grammar-meaning-short">${escapeHtml(g.meaning)}</div>
        <div class="grammar-toggle">▼</div>
      </div>
      <div class="grammar-detail">
        <div class="grammar-detail-inner">
          <div class="grammar-explanation">${escapeHtml(g.explanation)}</div>
          ${g.examples.map(ex => `
            <div class="grammar-example">
              <div class="ge-jp jp-text">${escapeHtml(ex.jp)} ${speakBtn(ex.jp, '0.9rem')}</div>
              <div class="ge-reading jp-text">${escapeHtml(ex.reading)}</div>
              <div class="ge-zh">${escapeHtml(ex.zh)}</div>
            </div>
          `).join('')}
          <div style="margin-top: 12px; text-align: right;">
            <button class="btn ${bookmarked.includes(g.id) ? 'btn-primary' : 'btn-ghost'}" onclick="toggleGrammarBookmark(${g.id})" style="font-size: 0.8rem; padding: 8px 16px;">
              ${bookmarked.includes(g.id) ? '⭐ 已收藏' : '☆ 收藏'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleGrammar(id) {
  const item = document.getElementById(`grammar-${id}`);
  if (item) {
    item.classList.toggle('expanded');
    AppState.recordActivity();
  }
}

function toggleGrammarBookmark(id) {
  const arr = AppState.progress.grammar.bookmarked;
  const pos = arr.indexOf(id);
  if (pos > -1) {
    arr.splice(pos, 1);
  } else {
    arr.push(id);
  }
  AppState.save();
  renderGrammarList();
}
