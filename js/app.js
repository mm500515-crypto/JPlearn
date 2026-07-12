// ========================================
// 日文 N5 學習應用 - 主應用邏輯
// ========================================

// --- State Management ---
const AppState = {
  currentPage: 'dashboard',
  progress: {
    kana: { learned: [], quizScores: [] },
    vocabulary: { learned: [], reviewing: [] },
    kanji: { learned: [], quizScores: [] },
    grammar: { bookmarked: [] },
    quiz: { history: [] },
    streak: { current: 0, lastDate: null },
    dailyGoal: { target: 20, completed: 0, date: null }
  },

  loadLocal() {
    const saved = localStorage.getItem('n5-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.progress = { ...this.progress, ...parsed };
      } catch (e) {
        console.warn('Failed to load local progress:', e);
      }
    }
    this.updateStreak();
    // Refresh current page if needed
    if (document.getElementById(`page-${this.currentPage}`).classList.contains('active')) {
       navigateTo(this.currentPage);
    }
  },

  async loadFromCloud(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (doc.exists) {
        this.progress = { ...this.progress, ...doc.data().progress };
        localStorage.setItem('n5-progress', JSON.stringify(this.progress));
      } else {
        this.saveToCloud(); // first time upload
      }
      this.updateStreak();
      navigateTo(this.currentPage);
    } catch (e) {
      console.error("Error loading from cloud:", e);
    }
  },

  load() {
    this.loadLocal();
  },

  save() {
    localStorage.setItem('n5-progress', JSON.stringify(this.progress));
    if (typeof currentUser !== 'undefined' && currentUser) {
      this.saveToCloud();
    }
  },

  saveToCloud() {
    if (typeof currentUser === 'undefined' || !currentUser) return;
    db.collection('users').doc(currentUser.uid).set({
      progress: this.progress,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).catch(e => console.error("Cloud save failed:", e));
  },

  updateStreak() {
    const today = new Date().toDateString();
    const last = this.progress.streak.lastDate;

    if (!last) {
      this.progress.streak.current = 0;
    } else if (last === today) {
      // Already logged today
    } else {
      const lastDate = new Date(last);
      const todayDate = new Date(today);
      const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diff > 1) {
        this.progress.streak.current = 0;
      }
    }

    // Reset daily goal if new day
    if (this.progress.dailyGoal.date !== today) {
      this.progress.dailyGoal.completed = 0;
      this.progress.dailyGoal.date = today;
    }
  },

  recordActivity() {
    const today = new Date().toDateString();
    if (this.progress.streak.lastDate !== today) {
      if (this.progress.streak.lastDate) {
        const lastDate = new Date(this.progress.streak.lastDate);
        const todayDate = new Date(today);
        const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
          this.progress.streak.current++;
        } else {
          this.progress.streak.current = 1;
        }
      } else {
        this.progress.streak.current = 1;
      }
      this.progress.streak.lastDate = today;
    }
    this.progress.dailyGoal.completed++;
    this.save();
  }
};

// --- Router ---
function navigateTo(page) {
  AppState.currentPage = page;

  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // Init page
  switch (page) {
    case 'dashboard': initDashboard(); break;
    case 'kana': initKana(); break;
    case 'vocabulary': initVocabulary(); break;
    case 'kanji': initKanji(); break;
    case 'grammar': initGrammar(); break;
    case 'quiz': initQuiz(); break;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Utility Functions ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomItems(arr, count) {
  return shuffle(arr).slice(0, count);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- TTS (Text-to-Speech) ---
function speakJapanese(text, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  utter.rate = rate;
  utter.pitch = 1;
  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jaVoice) utter.voice = jaVoice;
  window.speechSynthesis.speak(utter);
}

// Preload voices (some browsers need this)
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

function speakBtn(text, size = '1.1rem') {
  return `<button class="speak-btn" onclick="event.stopPropagation(); speakJapanese('${text.replace(/'/g, "\\'")}')" title="播放讀音" style="font-size: ${size};">🔊</button>`;
}

// --- Modal ---
function showModal(content) {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-body');
  container.innerHTML = content;
  overlay.classList.add('show');
}

function hideModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('show');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  AppState.load();

  // Nav click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.page);
    });
  });

  // Modal close
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideModal();
  });

  // Start on dashboard
  navigateTo('dashboard');
});
