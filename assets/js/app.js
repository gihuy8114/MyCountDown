/**
 * GHIBLI COUNTDOWN WEB APPLICATION - PREMIUM EDITION
 * Assets Directory: assets/js/app.js
 * Features:
 * - Real-time Countdown with high-precision % completion
 * - 2 Display Modes: Standard Breakdown vs Total Equivalent Units
 * - 4 Ghibli Atmosphere Themes (Đồng Cỏ, Hoàng Hôn, Đêm Sao, Vũ Trụ Xanh Đen)
 * - Synthesized Web Audio API (Nature Ambient Breeze, Chimes & Interactive Soot Mascot)
 * - 3D Card Parallax Tilt & Canvas Particle Physics (Leaves, Petals, Fireflies, Meteors)
 */

// ==========================================
// STATE MANAGEMENT & DOM ELEMENTS
// ==========================================

const DOM = {
  eventTitle: document.getElementById('event-title'),
  statusPill: document.getElementById('status-pill'),
  statusText: document.getElementById('status-text'),
  startTimeInput: document.getElementById('start-time'),
  endTimeInput: document.getElementById('end-time'),
  countdownBoard: document.getElementById('countdown-board'),
  daysVal: document.getElementById('days-val'),
  hoursVal: document.getElementById('hours-val'),
  minutesVal: document.getElementById('minutes-val'),
  secondsVal: document.getElementById('seconds-val'),
  percentVal: document.getElementById('percent-val'),
  progressFill: document.getElementById('progress-fill'),
  progressSprite: document.getElementById('progress-sprite'),
  statElapsed: document.getElementById('stat-elapsed'),
  statTotal: document.getElementById('stat-total'),
  statRemaining: document.getElementById('stat-remaining'),
  celebrationBox: document.getElementById('celebration-box'),
  themeIcoBtns: document.querySelectorAll('.theme-ico-btn'),
  audioBtn: document.getElementById('audio-btn'),
  audioIcon: document.getElementById('audio-icon'),
  shareBtn: document.getElementById('share-btn'),
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),
  currentClock: document.getElementById('current-clock'),
  canvas: document.getElementById('ambient-canvas'),
  presetButtons: document.querySelectorAll('.preset-btn'),
  modeBreakdownBtn: document.getElementById('mode-breakdown-btn'),
  modeTotalBtn: document.getElementById('mode-total-btn'),
  interactiveSoot: document.getElementById('interactive-soot'),
  parchmentCard: document.querySelector('.parchment-card')
};

// Application State
const state = {
  title: 'Hành trình mùa hè tuyệt vời ✨',
  startTime: null,
  endTime: null,
  displayMode: 'breakdown', // 'breakdown' or 'total'
  themeIndex: 0, // 0: Day, 1: Sunset, 2: Night, 3: Cosmic
  themes: [
    { name: 'theme-day', icon: '☀️', label: 'Đồng Cỏ' },
    { name: 'theme-sunset', icon: '🌇', label: 'Hoàng Hôn' },
    { name: 'theme-night', icon: '🌙', label: 'Đêm Sao' },
    { name: 'theme-cosmic', icon: '🌌', label: 'Vũ Trụ Xanh Đen' }
  ],
  audioActive: false,
  audioCtx: null,
  audioNodes: []
};

// ==========================================
// HELPER FUNCTIONS FOR DATE & FORMATTING
// ==========================================

function toLocalDatetimeString(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDuration(ms) {
  if (ms <= 0) return '0 giây';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0 || days > 0) parts.push(`${hours} giờ`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes} phút`);
  parts.push(`${seconds} giây`);

  return parts.slice(0, 3).join(' ');
}

// ==========================================
// INITIALIZATION & URL / STORAGE SYNC
// ==========================================

function initApp() {
  // 1. Read URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlTitle = urlParams.get('title');
  const urlStart = urlParams.get('start');
  const urlEnd = urlParams.get('end');
  const urlTheme = urlParams.get('theme');
  const urlMode = urlParams.get('mode');

  // 2. Read LocalStorage fallbacks
  const storedTitle = localStorage.getItem('ghibli_title');
  const storedStart = localStorage.getItem('ghibli_start');
  const storedEnd = localStorage.getItem('ghibli_end');
  const storedTheme = localStorage.getItem('ghibli_theme');
  const storedMode = localStorage.getItem('ghibli_mode');

  // Set Title
  state.title = urlTitle || storedTitle || 'Hành trình mùa hè tuyệt vời ✨';
  DOM.eventTitle.value = state.title;

  // Set Default Times (default: start = 3 days ago, end = 27 days from now)
  const now = new Date();
  let defaultStart = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  let defaultEnd = new Date(now.getTime() + 27 * 24 * 60 * 60 * 1000);

  if (urlStart) {
    state.startTime = new Date(urlStart);
  } else if (storedStart) {
    state.startTime = new Date(storedStart);
  } else {
    state.startTime = defaultStart;
  }

  if (urlEnd) {
    state.endTime = new Date(urlEnd);
  } else if (storedEnd) {
    state.endTime = new Date(storedEnd);
  } else {
    state.endTime = defaultEnd;
  }

  if (isNaN(state.startTime.getTime())) state.startTime = defaultStart;
  if (isNaN(state.endTime.getTime())) state.endTime = defaultEnd;

  DOM.startTimeInput.value = toLocalDatetimeString(state.startTime);
  DOM.endTimeInput.value = toLocalDatetimeString(state.endTime);

  // Set Theme
  const initialTheme = urlTheme || storedTheme;
  if (initialTheme) {
    const foundIndex = state.themes.findIndex(t => t.name === initialTheme);
    if (foundIndex !== -1) state.themeIndex = foundIndex;
  }
  applyTheme();

  // Set Display Mode (breakdown vs total)
  const initialMode = urlMode || storedMode;
  if (initialMode === 'total' || initialMode === 'breakdown') {
    state.displayMode = initialMode;
  }
  applyDisplayModeUI();

  // Setup Event Listeners
  setupEventListeners();

  // Initialize Ambient Canvas
  initAmbientCanvas();

  // Start Realtime Countdown Loop
  requestAnimationFrame(tick);
}

// ==========================================
// CORE COUNTDOWN & PROGRESS CALCULATION
// ==========================================

function updateCountdown() {
  const now = new Date();
  const start = state.startTime.getTime();
  const end = state.endTime.getTime();
  const current = now.getTime();

  // Update footer clock
  DOM.currentClock.textContent = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Calculate Total, Elapsed, and Remaining
  const totalDuration = Math.max(1, end - start);
  let elapsed = current - start;
  let remaining = end - current;

  // Percentage calculation
  let percentage = 0;

  if (current < start) {
    // Event has NOT started yet
    percentage = 0;
    remaining = end - current;
    const timeUntilStart = start - current;

    DOM.statusPill.className = 'status-pill status-upcoming';
    DOM.statusText.textContent = `Bắt đầu sau ${formatDuration(timeUntilStart)}`;
    DOM.celebrationBox.classList.add('hidden');
  } else if (current >= end) {
    // Event has COMPLETED
    percentage = 100;
    remaining = 0;
    elapsed = totalDuration;

    DOM.statusPill.className = 'status-pill status-completed';
    DOM.statusText.textContent = 'Đã hoàn thành! 🌸';
    DOM.celebrationBox.classList.remove('hidden');
  } else {
    // Event is IN PROGRESS
    percentage = (elapsed / totalDuration) * 100;
    DOM.statusPill.className = 'status-pill status-running';
    DOM.statusText.textContent = 'Đang diễn ra';
    DOM.celebrationBox.classList.add('hidden');
  }

  percentage = Math.max(0, Math.min(100, percentage));

  // Update % Display (4 decimal places)
  DOM.percentVal.textContent = percentage.toFixed(4);
  DOM.progressFill.style.width = `${percentage}%`;

  // Change mascot emoji based on progress
  if (percentage < 30) {
    DOM.progressSprite.querySelector('.sprite-body').textContent = '🐾';
  } else if (percentage < 70) {
    DOM.progressSprite.querySelector('.sprite-body').textContent = '🚲';
  } else if (percentage < 100) {
    DOM.progressSprite.querySelector('.sprite-body').textContent = '🏃';
  } else {
    DOM.progressSprite.querySelector('.sprite-body').textContent = '🎉';
  }

  const safeRemaining = Math.max(0, remaining);
  const unitEls = DOM.countdownBoard.querySelectorAll('.time-unit');

  if (state.displayMode === 'total') {
    // Total Equivalent Units Mode
    // 1 ngày = 24 giờ = 1440 phút = 86400 giây
    const totalDays = Math.floor(safeRemaining / 86400000);
    const totalHours = Math.floor(safeRemaining / 3600000);
    const totalMinutes = Math.floor(safeRemaining / 60000);
    const totalSeconds = Math.floor(safeRemaining / 1000);

    DOM.daysVal.textContent = totalDays.toLocaleString('vi-VN');
    DOM.hoursVal.textContent = totalHours.toLocaleString('vi-VN');
    DOM.minutesVal.textContent = totalMinutes.toLocaleString('vi-VN');
    DOM.secondsVal.textContent = totalSeconds.toLocaleString('vi-VN');

    if (unitEls.length >= 4) {
      unitEls[0].textContent = 'TỔNG NGÀY';
      unitEls[1].textContent = 'TỔNG GIỜ';
      unitEls[2].textContent = 'TỔNG PHÚT';
      unitEls[3].textContent = 'TỔNG GIÂY';
    }
  } else {
    // Standard Breakdown Mode (Ngày : Giờ : Phút : Giây)
    const totalSeconds = Math.floor(safeRemaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    DOM.daysVal.textContent = String(days).padStart(2, '0');
    DOM.hoursVal.textContent = String(hours).padStart(2, '0');
    DOM.minutesVal.textContent = String(minutes).padStart(2, '0');
    DOM.secondsVal.textContent = String(seconds).padStart(2, '0');

    if (unitEls.length >= 4) {
      unitEls[0].textContent = 'NGÀY';
      unitEls[1].textContent = 'GIỜ';
      unitEls[2].textContent = 'PHÚT';
      unitEls[3].textContent = 'GIÂY';
    }
  }

  // Update stats breakdown
  DOM.statElapsed.textContent = formatDuration(Math.max(0, elapsed));
  DOM.statTotal.textContent = formatDuration(totalDuration);
  DOM.statRemaining.textContent = formatDuration(safeRemaining);
}

let lastTickTime = 0;
function tick(timestamp) {
  if (timestamp - lastTickTime > 40) {
    updateCountdown();
    lastTickTime = timestamp;
  }
  requestAnimationFrame(tick);
}

// ==========================================
// EVENT LISTENERS & PRESETS
// ==========================================

function setupEventListeners() {
  // Title Input
  DOM.eventTitle.addEventListener('input', (e) => {
    state.title = e.target.value.trim() || 'Hành trình mới ✨';
    saveState();
  });

  // Time Inputs
  DOM.startTimeInput.addEventListener('change', (e) => {
    const val = new Date(e.target.value);
    if (!isNaN(val.getTime())) {
      state.startTime = val;
      saveState();
      updateCountdown();
    }
  });

  DOM.endTimeInput.addEventListener('change', (e) => {
    const val = new Date(e.target.value);
    if (!isNaN(val.getTime())) {
      state.endTime = val;
      saveState();
      updateCountdown();
    }
  });

  // Preset Buttons
  DOM.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playButtonTapSound();
      const preset = btn.dataset.preset;
      const now = new Date();
      state.startTime = now;
      DOM.startTimeInput.value = toLocalDatetimeString(now);

      if (preset === '7d') {
        state.endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (preset === '30d') {
        state.endTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else if (preset === '100d') {
        state.endTime = new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000);
      } else if (preset === 'eoy') {
        const currentYear = now.getFullYear();
        state.endTime = new Date(currentYear, 11, 31, 23, 59, 59);
      }

      DOM.endTimeInput.value = toLocalDatetimeString(state.endTime);
      saveState();
      updateCountdown();
      showToast(`Đã áp dụng: ${btn.textContent}! 🍃`);
    });
  });

  // Display Mode Buttons (Standard vs Total)
  DOM.modeBreakdownBtn.addEventListener('click', () => {
    playButtonTapSound();
    state.displayMode = 'breakdown';
    applyDisplayModeUI();
    saveState();
    updateCountdown();
    showToast('Chế độ: Ngày : Giờ : Phút : Giây ⏱️');
  });

  DOM.modeTotalBtn.addEventListener('click', () => {
    playButtonTapSound();
    state.displayMode = 'total';
    applyDisplayModeUI();
    saveState();
    updateCountdown();
    showToast('Chế độ: Tổng Ngày | Tổng Giờ | Tổng Phút | Tổng Giây 🔢');
  });

  // Theme Switcher (Icon-only)
  if (DOM.themeIcoBtns) {
    DOM.themeIcoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTheme = btn.dataset.theme;
        const idx = state.themes.findIndex(t => t.name === targetTheme);
        if (idx !== -1) {
          playButtonTapSound();
          state.themeIndex = idx;
          applyTheme();
          saveState();
        }
      });
    });
  }

  // Interactive Soot Mascot Click
  if (DOM.interactiveSoot) {
    DOM.interactiveSoot.addEventListener('click', () => {
      playSootSound();
      showToast('Bồ Hóng Susuwatari: “Chúc bạn một ngày ngập tràn phép màu!” 🐾✨');
    });
  }

  // Ambient Audio
  DOM.audioBtn.addEventListener('click', () => {
    toggleAmbientAudio();
  });

  // Share Button
  DOM.shareBtn.addEventListener('click', () => {
    playButtonTapSound();
    copyShareUrl();
  });
}

function applyDisplayModeUI() {
  if (state.displayMode === 'total') {
    DOM.modeTotalBtn.classList.add('active');
    DOM.modeBreakdownBtn.classList.remove('active');
    DOM.countdownBoard.classList.add('mode-total');
  } else {
    DOM.modeBreakdownBtn.classList.add('active');
    DOM.modeTotalBtn.classList.remove('active');
    DOM.countdownBoard.classList.remove('mode-total');
  }
}

function applyTheme() {
  const currentTheme = state.themes[state.themeIndex];
  document.body.className = currentTheme.name;
  if (DOM.themeIcoBtns) {
    DOM.themeIcoBtns.forEach(btn => {
      if (btn.dataset.theme === currentTheme.name) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

function saveState() {
  localStorage.setItem('ghibli_title', state.title);
  localStorage.setItem('ghibli_start', state.startTime.toISOString());
  localStorage.setItem('ghibli_end', state.endTime.toISOString());
  localStorage.setItem('ghibli_theme', state.themes[state.themeIndex].name);
  localStorage.setItem('ghibli_mode', state.displayMode);
}

function copyShareUrl() {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('title', state.title);
  url.searchParams.set('start', state.startTime.toISOString());
  url.searchParams.set('end', state.endTime.toISOString());
  url.searchParams.set('theme', state.themes[state.themeIndex].name);
  url.searchParams.set('mode', state.displayMode);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url.toString()).then(() => {
      showToast('Đã sao chép liên kết chia sẻ! 🔗 Gửi ngay cho bạn bè nhé');
    }).catch(() => {
      prompt('Sao chép liên kết bên dưới:', url.toString());
    });
  } else {
    prompt('Sao chép liên kết bên dưới:', url.toString());
  }
}

let toastTimer = null;
function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  DOM.toastMessage.textContent = msg;
  DOM.toast.classList.remove('hidden');
  toastTimer = setTimeout(() => {
    DOM.toast.classList.add('hidden');
  }, 3200);
}

// ==========================================
// SOUND SYNTHESIS (WEB AUDIO API)
// ==========================================

function playButtonTapSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

function playSootSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function toggleAmbientAudio() {
  if (!state.audioActive) {
    startAmbientAudio();
  } else {
    stopAmbientAudio();
  }
}

function startAmbientAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast('Trình duyệt không hỗ trợ Web Audio API');
      return;
    }

    state.audioCtx = new AudioContext();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    // 1. Pink Noise for Whispering Breeze
    const bufferSize = state.audioCtx.sampleRate * 2;
    const noiseBuffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.11;
    }

    const whiteNoise = state.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, state.audioCtx.currentTime);

    const lfo = state.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, state.audioCtx.currentTime);
    const lfoGain = state.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(140, state.audioCtx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const masterGain = state.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.25, state.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(state.audioCtx.destination);
    whiteNoise.start();

    // 2. Wind Chime Pentatonic Notes
    const pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const chimeInterval = setInterval(() => {
      if (!state.audioActive || !state.audioCtx) return;
      if (Math.random() > 0.4) {
        const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        const osc = state.audioCtx.createOscillator();
        const noteGain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0.001, state.audioCtx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.04, state.audioCtx.currentTime + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 2.8);

        osc.connect(noteGain);
        noteGain.connect(state.audioCtx.destination);
        osc.start();
        osc.stop(state.audioCtx.currentTime + 3.0);
      }
    }, 2800);

    state.audioNodes = [whiteNoise, lfo, chimeInterval];
    state.audioActive = true;
    DOM.audioIcon.textContent = '🔊';
    showToast('Đã bật âm thanh gió thiên nhiên 🍃');
  } catch (err) {
    console.error('Audio start error:', err);
  }
}

function stopAmbientAudio() {
  if (state.audioNodes) {
    state.audioNodes.forEach(node => {
      if (node && node.stop) node.stop();
      if (typeof node === 'number') clearInterval(node);
    });
    state.audioNodes = [];
  }
  if (state.audioCtx) {
    state.audioCtx.close();
    state.audioCtx = null;
  }
  state.audioActive = false;
  DOM.audioIcon.textContent = '🔇';
  showToast('Đã tắt âm thanh 🌿');
}

// ==========================================
// AMBIENT PARTICLES CANVAS
// ==========================================

function initAmbientCanvas() {
  const canvas = DOM.canvas;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = 30;
  const meteors = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 5;
      this.speedX = Math.random() * 1.5 - 0.5;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.8;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x > width + 40 || this.x < -40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      const currentTheme = state.themes[state.themeIndex].name;

      if (currentTheme === 'theme-cosmic') {
        ctx.fillStyle = Math.random() > 0.3 ? '#00e5ff' : '#70b6ff';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00f0ff';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentTheme === 'theme-night') {
        ctx.fillStyle = '#b6f8dc';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#46dcb4';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const isSunset = currentTheme === 'theme-sunset';
        ctx.fillStyle = isSunset ? '#e57a55' : '#73ab77';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  class Meteor {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width * 0.8 + width * 0.1;
      this.y = -50;
      this.length = Math.random() * 80 + 60;
      this.speed = Math.random() * 10 + 12;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      this.active = false;
      this.opacity = 1;
    }

    trigger() {
      this.reset();
      this.active = true;
    }

    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.015;

      if (this.opacity <= 0 || this.y > height || this.x > width) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#38b6ff';

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  const meteor = new Meteor();

  setInterval(() => {
    if (state.themes[state.themeIndex].name === 'theme-cosmic' && !meteor.active) {
      if (Math.random() > 0.3) {
        meteor.trigger();
      }
    }
  }, 3200);

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    if (meteor.active) {
      meteor.update();
      meteor.draw();
    }
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
