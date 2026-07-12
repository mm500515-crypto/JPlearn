// Authentication Logic

let currentUser = null;

// Observe Auth State
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    document.getElementById('auth-user-name').textContent = user.displayName || user.email.split('@')[0];
    document.getElementById('auth-logged-in').style.display = 'flex';
    document.getElementById('auth-logged-out').style.display = 'none';
    
    // Load cloud progress
    AppState.loadFromCloud(user.uid);
  } else {
    currentUser = null;
    document.getElementById('auth-logged-in').style.display = 'none';
    document.getElementById('auth-logged-out').style.display = 'flex';
    
    // If user signs out, we might want to clear or reset state
    AppState.loadLocal(); // load local generic state or clear it
  }
});

function showAuthModal() {
  showModal(`
    <div class="auth-modal-content" style="text-align: center;">
      <h2 style="margin-bottom: 24px; font-family: var(--font-jp);">登入 / 註冊</h2>
      
      <button class="btn btn-primary" onclick="signInWithGoogle()" style="width: 100%; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>
        使用 Google 繼續
      </button>

      <div style="margin: 16px 0; color: var(--text-secondary); font-size: 0.9rem;">或使用 Email</div>

      <input type="email" id="auth-email" placeholder="Email" class="form-input" style="width: 100%; margin-bottom: 12px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
      <input type="password" id="auth-password" placeholder="密碼 (至少 6 字元)" class="form-input" style="width: 100%; margin-bottom: 16px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
      
      <div id="auth-error" style="color: #ff6b6b; font-size: 0.85rem; margin-bottom: 12px; display: none;"></div>

      <div style="display: flex; gap: 8px;">
        <button class="btn btn-ghost" onclick="signInWithEmail()" style="flex: 1;">登入</button>
        <button class="btn btn-ghost" onclick="signUpWithEmail()" style="flex: 1;">註冊</button>
      </div>
      
      <button class="btn btn-ghost" onclick="hideModal()" style="margin-top: 16px; width: 100%;">稍後再說</button>
    </div>
  `);
}

function showAuthError(msg) {
  const err = document.getElementById('auth-error');
  if (err) {
    err.textContent = msg;
    err.style.display = 'block';
  } else {
    alert(msg);
  }
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(() => {
    hideModal();
  }).catch((error) => {
    showAuthError(error.message);
  });
}

function signInWithEmail() {
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-password').value;
  if (!email || !pass) return showAuthError("請輸入 Email 與密碼");
  
  auth.signInWithEmailAndPassword(email, pass).then(() => {
    hideModal();
  }).catch((error) => {
    showAuthError("登入失敗: " + error.message);
  });
}

function signUpWithEmail() {
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-password').value;
  if (!email || !pass) return showAuthError("請輸入 Email 與密碼");
  if (pass.length < 6) return showAuthError("密碼至少需要 6 個字元");

  auth.createUserWithEmailAndPassword(email, pass).then(() => {
    hideModal();
  }).catch((error) => {
    showAuthError("註冊失敗: " + error.message);
  });
}

function signOut() {
  auth.signOut();
}
