// ========================================
// 測驗模組
// ========================================

let quizType = null; // 'vocab-jz', 'vocab-zj', 'kanji-reading', 'grammar-fill'
let quizState = {
  questions: [],
  current: 0,
  score: 0,
  total: 10,
  answered: false
};

function initQuiz() {
  quizType = null;
  renderQuizSetup();
}

function renderQuizSetup() {
  const container = document.getElementById('quiz-content');
  container.innerHTML = `
    <div class="page-header">
      <h1>測驗</h1>
      <p>測試你的 N5 實力</p>
    </div>

    <div class="quiz-type-grid">
      <div class="quiz-type-card" onclick="startQuiz('vocab-jz')">
        <div class="qt-icon">🇯🇵→🇹🇼</div>
        <div class="qt-title">單字（日→中）</div>
        <div class="qt-desc">看日文選中文意思</div>
      </div>
      <div class="quiz-type-card" onclick="startQuiz('vocab-zj')">
        <div class="qt-icon">🇹🇼→🇯🇵</div>
        <div class="qt-title">單字（中→日）</div>
        <div class="qt-desc">看中文選日文</div>
      </div>
      <div class="quiz-type-card" onclick="startQuiz('kanji-reading')">
        <div class="qt-icon">漢字</div>
        <div class="qt-title">漢字讀音</div>
        <div class="qt-desc">看漢字選正確讀音</div>
      </div>
      <div class="quiz-type-card" onclick="startQuiz('kanji-meaning')">
        <div class="qt-icon">📖</div>
        <div class="qt-title">漢字意思</div>
        <div class="qt-desc">看漢字選正確意思</div>
      </div>
      <div class="quiz-type-card" onclick="startQuiz('mixed')">
        <div class="qt-icon">🎲</div>
        <div class="qt-title">綜合測驗</div>
        <div class="qt-desc">隨機混合各種題型</div>
      </div>
    </div>

    ${AppState.progress.quiz.history.length > 0 ? `
      <div style="margin-top: 32px;">
        <h3 style="margin-bottom: 12px;">📊 最近成績</h3>
        <div class="vocab-list">
          ${AppState.progress.quiz.history.slice(-5).reverse().map(h => `
            <div class="vocab-item">
              <span class="word">${h.type}</span>
              <span class="meaning">${h.score}%</span>
              <span class="type-badge">${new Date(h.date).toLocaleDateString('zh-TW')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function startQuiz(type) {
  quizType = type;
  quizState = { questions: [], current: 0, score: 0, total: 10, answered: false };

  switch (type) {
    case 'vocab-jz':
      generateVocabJZQuestions();
      break;
    case 'vocab-zj':
      generateVocabZJQuestions();
      break;
    case 'kanji-reading':
      generateKanjiReadingQuestions();
      break;
    case 'kanji-meaning':
      generateKanjiMeaningQuestions();
      break;
    case 'mixed':
      generateMixedQuestions();
      break;
  }

  renderQuizQuestion();
}

function generateVocabJZQuestions() {
  const items = shuffle(VOCABULARY_DATA).slice(0, quizState.total);
  quizState.questions = items.map(item => {
    const wrongs = shuffle(VOCABULARY_DATA.filter(v => v.meaning !== item.meaning))
      .slice(0, 3)
      .map(v => v.meaning);
    return {
      prompt: '以下日文的中文意思是？',
      question: item.word,
      questionSub: item.reading,
      correct: item.meaning,
      options: shuffle([item.meaning, ...wrongs])
    };
  });
}

function generateVocabZJQuestions() {
  const items = shuffle(VOCABULARY_DATA).slice(0, quizState.total);
  quizState.questions = items.map(item => {
    const wrongs = shuffle(VOCABULARY_DATA.filter(v => v.word !== item.word))
      .slice(0, 3)
      .map(v => v.word);
    return {
      prompt: '以下中文對應的日文是？',
      question: item.meaning,
      questionSub: '',
      correct: item.word,
      options: shuffle([item.word, ...wrongs])
    };
  });
}

function generateKanjiReadingQuestions() {
  const items = shuffle(KANJI_DATA).slice(0, quizState.total);
  quizState.questions = items.map(item => {
    const reading = item.examples[0] ? item.examples[0].reading : (item.kunyomi || item.onyomi);
    const wrongs = shuffle(KANJI_DATA.filter(k => k.kanji !== item.kanji))
      .slice(0, 3)
      .map(k => k.examples[0] ? k.examples[0].reading : (k.kunyomi || k.onyomi));
    return {
      prompt: '這個漢字怎麼讀？',
      question: item.kanji,
      questionSub: item.examples[0] ? `例: ${item.examples[0].word}` : '',
      correct: reading,
      options: shuffle([reading, ...wrongs])
    };
  });
}

function generateKanjiMeaningQuestions() {
  const items = shuffle(KANJI_DATA).slice(0, quizState.total);
  quizState.questions = items.map(item => {
    const wrongs = shuffle(KANJI_DATA.filter(k => k.meaning !== item.meaning))
      .slice(0, 3)
      .map(k => k.meaning);
    return {
      prompt: '這個漢字的意思是？',
      question: item.kanji,
      questionSub: '',
      correct: item.meaning,
      options: shuffle([item.meaning, ...wrongs])
    };
  });
}

function generateMixedQuestions() {
  const types = ['vocab-jz', 'vocab-zj', 'kanji-reading', 'kanji-meaning'];
  quizState.questions = [];

  for (let i = 0; i < quizState.total; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    let q;

    if (type === 'vocab-jz') {
      const item = VOCABULARY_DATA[Math.floor(Math.random() * VOCABULARY_DATA.length)];
      const wrongs = shuffle(VOCABULARY_DATA.filter(v => v.meaning !== item.meaning)).slice(0, 3).map(v => v.meaning);
      q = { prompt: '日文的中文意思是？', question: item.word, questionSub: item.reading, correct: item.meaning, options: shuffle([item.meaning, ...wrongs]) };
    } else if (type === 'vocab-zj') {
      const item = VOCABULARY_DATA[Math.floor(Math.random() * VOCABULARY_DATA.length)];
      const wrongs = shuffle(VOCABULARY_DATA.filter(v => v.word !== item.word)).slice(0, 3).map(v => v.word);
      q = { prompt: '中文對應的日文是？', question: item.meaning, questionSub: '', correct: item.word, options: shuffle([item.word, ...wrongs]) };
    } else if (type === 'kanji-reading') {
      const item = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
      const reading = item.examples[0] ? item.examples[0].reading : (item.kunyomi || item.onyomi);
      const wrongs = shuffle(KANJI_DATA.filter(k => k.kanji !== item.kanji)).slice(0, 3).map(k => k.examples[0] ? k.examples[0].reading : (k.kunyomi || k.onyomi));
      q = { prompt: '漢字怎麼讀？', question: item.kanji, questionSub: '', correct: reading, options: shuffle([reading, ...wrongs]) };
    } else {
      const item = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
      const wrongs = shuffle(KANJI_DATA.filter(k => k.meaning !== item.meaning)).slice(0, 3).map(k => k.meaning);
      q = { prompt: '漢字的意思是？', question: item.kanji, questionSub: '', correct: item.meaning, options: shuffle([item.meaning, ...wrongs]) };
    }
    quizState.questions.push(q);
  }
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-content');
  const state = quizState;

  if (state.current >= state.questions.length) {
    const pct = Math.round((state.score / state.total) * 100);
    const typeLabels = {
      'vocab-jz': '單字（日→中）',
      'vocab-zj': '單字（中→日）',
      'kanji-reading': '漢字讀音',
      'kanji-meaning': '漢字意思',
      'mixed': '綜合測驗'
    };

    // Save result
    AppState.progress.quiz.history.push({
      type: typeLabels[quizType] || quizType,
      score: pct,
      date: new Date().toISOString()
    });
    AppState.recordActivity();
    AppState.save();

    container.innerHTML = `
      <div class="quiz-results animate-scale-in">
        <div class="quiz-score">${pct}%</div>
        <div class="quiz-score-label">${state.score} / ${state.total} 正確</div>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 1.1rem;">
          ${pct >= 90 ? '太厲害了！🏆 你已經很熟練了！' : pct >= 70 ? '做得好！🎉 再加把勁！' : pct >= 50 ? '不錯的開始！💪 持續練習！' : '沒關係！✊ 多練習幾次就會進步！'}
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="startQuiz('${quizType}')">再測一次</button>
          <button class="btn btn-ghost" onclick="initQuiz()">選其他題型</button>
        </div>
      </div>
    `;
    return;
  }

  const q = state.questions[state.current];

  container.innerHTML = `
    <div class="quiz-area animate-scale-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <button class="btn btn-ghost" onclick="initQuiz()" style="font-size: 0.8rem; padding: 6px 12px;">← 返回</button>
      </div>

      <div class="quiz-progress">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${(state.current / state.total) * 100}%"></div>
        </div>
        <div class="quiz-progress-text">${state.current + 1}/${state.total}</div>
      </div>

      <div class="quiz-question">
        <div class="q-prompt">${escapeHtml(q.prompt)}</div>
        <div class="q-word jp-text">${escapeHtml(q.question)}</div>
        ${q.questionSub ? `<div style="font-family: var(--font-jp); color: var(--text-secondary); font-size: 1rem; margin-top: 4px;">${escapeHtml(q.questionSub)}</div>` : ''}
      </div>

      <div class="quiz-options" id="quiz-opts">
        ${q.options.map((opt, i) => `
          <button class="quiz-option jp-text" onclick="answerQuiz(${i})" id="quiz-opt-${i}">${escapeHtml(opt)}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function answerQuiz(idx) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizState.questions[quizState.current];
  const selected = q.options[idx];
  const isCorrect = selected === q.correct;

  if (isCorrect) quizState.score++;

  document.querySelectorAll('#quiz-opts .quiz-option').forEach((btn, i) => {
    const opt = q.options[i];
    btn.classList.add('disabled');
    if (opt === q.correct) btn.classList.add('correct');
    if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  setTimeout(() => {
    quizState.current++;
    quizState.answered = false;
    renderQuizQuestion();
  }, 1200);
}
