// ========================================
// 儀表板模組
// ========================================

function initDashboard() {
  renderDashboard();
}

function renderDashboard() {
  const container = document.getElementById('dashboard-content');
  const progress = AppState.progress;

  // Calculate stats
  const vocabLearned = progress.vocabulary.learned.length;
  const vocabTotal = VOCABULARY_DATA.length;
  const kanjiLearned = progress.kanji.learned.length;
  const kanjiTotal = KANJI_DATA.length;
  const grammarBookmarked = progress.grammar.bookmarked.length;
  const grammarTotal = GRAMMAR_DATA.length;
  const quizCount = progress.quiz.history.length;
  const streak = progress.streak.current;

  // Get greeting based on time
  const hour = new Date().getHours();
  let greeting = 'こんにちは';
  if (hour < 6) greeting = 'おやすみ';
  else if (hour < 12) greeting = 'おはよう';
  else if (hour < 18) greeting = 'こんにちは';
  else greeting = 'こんばんは';

  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });

  // Average quiz score
  let avgScore = 0;
  if (progress.quiz.history.length > 0) {
    avgScore = Math.round(
      progress.quiz.history.reduce((sum, h) => sum + h.score, 0) / progress.quiz.history.length
    );
  }

  container.innerHTML = `
    <div class="page-header" style="margin-bottom: 8px;">
      <h1 style="font-size: 1.5rem;">${greeting}！👋</h1>
    </div>
    <div class="dashboard-date">${dateStr}</div>

    <!-- Streak -->
    <div class="streak-display animate-slide-up">
      <div class="streak-icon">🔥</div>
      <div class="streak-info">
        <div class="streak-count">${streak} 天</div>
        <div class="streak-label">連續學習</div>
      </div>
      <div style="flex:1;"></div>
      <div style="text-align: right;">
        <div style="font-size: 1rem; font-weight: 600; color: var(--accent-cyan);">${progress.dailyGoal.completed}</div>
        <div style="font-size: 0.7rem; color: var(--text-tertiary);">今日活動</div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" onclick="navigateTo('vocabulary')">
        <div class="stat-value gradient">${vocabLearned}</div>
        <div class="stat-label">已學單字 / ${vocabTotal}</div>
      </div>
      <div class="stat-card" onclick="navigateTo('kanji')">
        <div class="stat-value gradient">${kanjiLearned}</div>
        <div class="stat-label">已學漢字 / ${kanjiTotal}</div>
      </div>
      <div class="stat-card" onclick="navigateTo('grammar')">
        <div class="stat-value gradient">${grammarBookmarked}</div>
        <div class="stat-label">收藏文法 / ${grammarTotal}</div>
      </div>
      <div class="stat-card" onclick="navigateTo('quiz')">
        <div class="stat-value gradient">${avgScore}%</div>
        <div class="stat-label">平均分數 (${quizCount}次)</div>
      </div>
    </div>

    <!-- Progress Section -->
    <div class="progress-section glass-card">
      <h3 style="margin-bottom: 16px;">📈 學習進度</h3>

      <div class="progress-item">
        <div class="pi-header">
          <span class="pi-label">五十音</span>
          <span class="pi-value">${progress.kana.quizScores.length > 0 ? '已測驗' : '尚未測驗'}</span>
        </div>
        <div class="progress-bar">
          <div class="bar-fill fill-purple" style="width: ${progress.kana.quizScores.length > 0 ? Math.min(100, progress.kana.quizScores[progress.kana.quizScores.length - 1].score) : 0}%"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="pi-header">
          <span class="pi-label">單字</span>
          <span class="pi-value">${vocabLearned} / ${vocabTotal} (${Math.round(vocabLearned / vocabTotal * 100)}%)</span>
        </div>
        <div class="progress-bar">
          <div class="bar-fill fill-pink" style="width: ${(vocabLearned / vocabTotal * 100)}%"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="pi-header">
          <span class="pi-label">漢字</span>
          <span class="pi-value">${kanjiLearned} / ${kanjiTotal} (${Math.round(kanjiLearned / kanjiTotal * 100)}%)</span>
        </div>
        <div class="progress-bar">
          <div class="bar-fill fill-cyan" style="width: ${(kanjiLearned / kanjiTotal * 100)}%"></div>
        </div>
      </div>

      <div class="progress-item">
        <div class="pi-header">
          <span class="pi-label">文法收藏</span>
          <span class="pi-value">${grammarBookmarked} / ${grammarTotal}</span>
        </div>
        <div class="progress-bar">
          <div class="bar-fill fill-orange" style="width: ${(grammarBookmarked / grammarTotal * 100)}%"></div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div style="margin-top: 24px;">
      <h3 style="margin-bottom: 14px;">⚡ 快速開始</h3>
      <div class="quiz-type-grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="quiz-type-card" onclick="navigateTo('kana')">
          <div class="qt-icon">あ</div>
          <div class="qt-title" style="font-size: 0.85rem;">五十音</div>
        </div>
        <div class="quiz-type-card" onclick="navigateTo('vocabulary'); setTimeout(() => switchVocabView('flashcard'), 100);">
          <div class="qt-icon">🃏</div>
          <div class="qt-title" style="font-size: 0.85rem;">單字閃卡</div>
        </div>
        <div class="quiz-type-card" onclick="navigateTo('quiz')">
          <div class="qt-icon">🎯</div>
          <div class="qt-title" style="font-size: 0.85rem;">測驗</div>
        </div>
      </div>
    </div>

    <!-- Recent Quiz History -->
    ${progress.quiz.history.length > 0 ? `
      <div style="margin-top: 24px;">
        <h3 style="margin-bottom: 14px;">🕐 最近測驗</h3>
        <div class="vocab-list">
          ${progress.quiz.history.slice(-3).reverse().map(h => `
            <div class="vocab-item">
              <span class="word" style="min-width: auto; font-size: 0.9rem;">${h.type}</span>
              <span class="meaning" style="text-align: right;">
                <span style="color: ${h.score >= 70 ? 'var(--accent-secondary)' : h.score >= 50 ? 'var(--accent-orange)' : 'var(--accent-red)'}; font-weight: 600;">${h.score}%</span>
              </span>
              <span class="type-badge">${new Date(h.date).toLocaleDateString('zh-TW')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}
