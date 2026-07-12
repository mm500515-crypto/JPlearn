// ========================================
// 五十音模組
// ========================================

let kanaMode = 'hiragana'; // hiragana | katakana
let kanaView = 'chart';    // chart | quiz
let kanaChartType = 'basic'; // basic | dakuten | handakuten | combo

function initKana() {
  renderKanaPage();
}

function renderKanaPage() {
  const container = document.getElementById('kana-content');

  container.innerHTML = `
    <div class="page-header">
      <h1>五十音</h1>
      <p>日文的基礎 — 平假名與片假名</p>
    </div>

    <div class="tab-switcher" id="kana-type-tabs">
      <button class="tab-btn ${kanaMode === 'hiragana' ? 'active' : ''}" onclick="switchKanaMode('hiragana')">平假名</button>
      <button class="tab-btn ${kanaMode === 'katakana' ? 'active' : ''}" onclick="switchKanaMode('katakana')">片假名</button>
    </div>

    <div class="view-toggle">
      <button class="vt-btn ${kanaView === 'chart' ? 'active' : ''}" onclick="switchKanaView('chart')">📋 表格</button>
      <button class="vt-btn ${kanaView === 'quiz' ? 'active' : ''}" onclick="switchKanaView('quiz')">🎯 測驗</button>
    </div>

    <div id="kana-view-area"></div>
  `;

  if (kanaView === 'chart') {
    renderKanaChart();
  } else {
    renderKanaQuiz();
  }
}

function switchKanaMode(mode) {
  kanaMode = mode;
  renderKanaPage();
}

function switchKanaView(view) {
  kanaView = view;
  renderKanaPage();
}

function renderKanaChart() {
  const area = document.getElementById('kana-view-area');
  const data = KANA_DATA[kanaMode];

  area.innerHTML = `
    <div class="category-filter" id="kana-chart-filter">
      <button class="cat-chip ${kanaChartType === 'basic' ? 'active' : ''}" onclick="switchKanaChart('basic')">清音</button>
      <button class="cat-chip ${kanaChartType === 'dakuten' ? 'active' : ''}" onclick="switchKanaChart('dakuten')">濁音</button>
      <button class="cat-chip ${kanaChartType === 'handakuten' ? 'active' : ''}" onclick="switchKanaChart('handakuten')">半濁音</button>
      <button class="cat-chip ${kanaChartType === 'combo' ? 'active' : ''}" onclick="switchKanaChart('combo')">拗音</button>
    </div>
    <div class="kana-grid" id="kana-grid"></div>
  `;

  const grid = document.getElementById('kana-grid');
  const chars = data[kanaChartType] || [];
  let currentRow = '';

  chars.forEach((item, i) => {
    if (item.row !== currentRow) {
      currentRow = item.row;
      const label = document.createElement('div');
      label.className = 'kana-row-label';
      label.textContent = currentRow;
      grid.appendChild(label);
    }

    const cell = document.createElement('div');

    if (!item.kana) {
      cell.className = 'kana-cell empty';
      cell.innerHTML = '&nbsp;';
    } else {
      cell.className = 'kana-cell stagger-item';
      cell.innerHTML = `
        <span class="kana-char jp-text">${item.kana}</span>
        <span class="kana-romaji">${item.romaji}</span>
      `;
      cell.addEventListener('click', () => {
        cell.classList.toggle('revealed');
        speakJapanese(item.kana);
      });
    }

    grid.appendChild(cell);
  });
}

function switchKanaChart(type) {
  kanaChartType = type;
  renderKanaChart();
}

// --- Kana Quiz ---
let kanaQuizState = {
  questions: [],
  current: 0,
  score: 0,
  total: 10,
  answered: false
};

function renderKanaQuiz() {
  const area = document.getElementById('kana-view-area');
  // Gather all non-empty kana
  const allKana = [];
  const data = KANA_DATA[kanaMode];
  ['basic', 'dakuten', 'handakuten'].forEach(type => {
    data[type].forEach(k => {
      if (k.kana) allKana.push(k);
    });
  });

  // Generate questions
  const shuffled = shuffle(allKana);
  kanaQuizState.questions = shuffled.slice(0, kanaQuizState.total).map(q => {
    // Get 3 wrong answers
    const wrongs = shuffle(allKana.filter(k => k.romaji !== q.romaji && k.kana))
      .slice(0, 3)
      .map(k => k.romaji);
    const options = shuffle([q.romaji, ...wrongs]);
    return { ...q, options, correct: q.romaji };
  });
  kanaQuizState.current = 0;
  kanaQuizState.score = 0;
  kanaQuizState.answered = false;

  renderKanaQuizQuestion();
}

function renderKanaQuizQuestion() {
  const area = document.getElementById('kana-view-area');
  const state = kanaQuizState;

  if (state.current >= state.questions.length) {
    // Show results
    const pct = Math.round((state.score / state.total) * 100);
    area.innerHTML = `
      <div class="quiz-results animate-scale-in">
        <div class="quiz-score">${pct}%</div>
        <div class="quiz-score-label">${state.score} / ${state.total} 正確</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
          ${pct >= 80 ? '太棒了！🎉 繼續保持！' : pct >= 50 ? '不錯！再練習一下會更好 💪' : '加油！多練習幾次就會進步的 ✊'}
        </p>
        <button class="btn btn-primary" onclick="renderKanaQuiz()">再測一次</button>
      </div>
    `;
    // Record activity
    AppState.recordActivity();
    AppState.progress.kana.quizScores.push({ score: pct, date: new Date().toISOString(), mode: kanaMode });
    AppState.save();
    return;
  }

  const q = state.questions[state.current];
  area.innerHTML = `
    <div class="kana-quiz-area animate-scale-in">
      <div class="quiz-progress">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${(state.current / state.total) * 100}%"></div>
        </div>
        <div class="quiz-progress-text">${state.current + 1}/${state.total}</div>
      </div>

      <div class="kana-quiz-char jp-text">${q.kana}</div>
      <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9rem;">這個假名的讀音是？</p>

      <div class="kana-quiz-options" id="kana-quiz-opts">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" onclick="answerKanaQuiz(${i}, '${opt}')" id="kana-opt-${i}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function answerKanaQuiz(idx, answer) {
  if (kanaQuizState.answered) return;
  kanaQuizState.answered = true;

  const q = kanaQuizState.questions[kanaQuizState.current];
  const isCorrect = answer === q.correct;

  if (isCorrect) kanaQuizState.score++;

  // Highlight
  document.querySelectorAll('#kana-quiz-opts .quiz-option').forEach((btn, i) => {
    const opt = q.options[i];
    btn.classList.add('disabled');
    if (opt === q.correct) btn.classList.add('correct');
    if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  // Next after delay
  setTimeout(() => {
    kanaQuizState.current++;
    kanaQuizState.answered = false;
    renderKanaQuizQuestion();
  }, 1000);
}
