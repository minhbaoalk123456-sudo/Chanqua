/**
 * App controller
 * by Trần phi thiên
 */

const App = {
  currentSvc: 'auto',
  running: false,
  lastUrl: '',

  init() {
    Ticker.init();
    Ticker.startSimulation();
    this.bindUI();
    this.loadStats();
    this.renderHistory();
  },

  bindUI() {
    // service chips
    document.querySelectorAll('.svc').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.svc').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSvc = btn.dataset.svc;
      });
    });

    document.getElementById('btnBypass').addEventListener('click', () => this.start());
    document.getElementById('linkInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.start();
    });
    document.getElementById('btnCopy').addEventListener('click', () => this.copy());
    document.getElementById('btnOpen').addEventListener('click', () => this.open());
  },

  async start() {
    if (this.running) return;

    const input = document.getElementById('linkInput').value.trim();
    const progressPanel = document.getElementById('progressPanel');
    const resultPanel = document.getElementById('resultPanel');
    const btn = document.getElementById('btnBypass');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    if (!input || !/^https?:\/\//i.test(input)) {
      progressPanel.hidden = false;
      document.getElementById('progressStatus').textContent = 'Vui lòng dán link hợp lệ (http/https)';
      document.getElementById('progressBar').style.width = '0%';
      return;
    }

    this.running = true;
    btn.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;
    resultPanel.hidden = true;
    progressPanel.hidden = false;
    document.getElementById('progressBar').style.width = '0%';

    try {
      const result = await Bypass.run(input, this.currentSvc, (pct, msg) => {
        document.getElementById('progressBar').style.width = pct + '%';
        document.getElementById('progressStatus').textContent = msg;
      });

      this.lastUrl = result.url;
      document.getElementById('resultLink').textContent = result.url;
      resultPanel.hidden = false;
      document.getElementById('progressStatus').textContent = 'Vượt thành công';

      this.showToast();
      Ticker.push('THIENTRAN');
      this.saveHistory(result.svc, result.url);
      this.incStats();
      this.renderHistory();
    } catch (err) {
      document.getElementById('progressStatus').textContent = 'Lỗi: ' + (err.message || 'không xác định');
    } finally {
      this.running = false;
      btn.disabled = false;
      btnText.hidden = false;
      btnLoader.hidden = true;
    }
  },

  showToast() {
    const t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  },

  copy() {
    if (!this.lastUrl) return;
    navigator.clipboard.writeText(this.lastUrl).then(() => {
      document.getElementById('progressStatus').textContent = 'Đã copy link!';
    });
  },

  open() {
    if (this.lastUrl) window.open(this.lastUrl, '_blank', 'noopener');
  },

  // —— History ——
  getHistory() {
    try {
      return JSON.parse(localStorage.getItem('tt_bypass_hist') || '[]');
    } catch {
      return [];
    }
  },

  saveHistory(svc, url) {
    const list = this.getHistory();
    list.unshift({ svc, url, t: Date.now() });
    localStorage.setItem('tt_bypass_hist', JSON.stringify(list.slice(0, 30)));
  },

  renderHistory() {
    const box = document.getElementById('historyList');
    const list = this.getHistory();
    if (!list.length) {
      box.innerHTML = '<p class="empty">Chưa có lịch sử</p>';
      return;
    }
    box.innerHTML = list
      .slice(0, 10)
      .map(
        (h) => `
      <div class="history-item">
        <span class="svc-tag">${h.svc.toUpperCase()}</span>
        <a href="${h.url}" target="_blank" rel="noopener">${h.url}</a>
      </div>`
      )
      .join('');
  },

  // —— Stats ——
  loadStats() {
    const total = parseInt(localStorage.getItem('tt_stat_total') || '0', 10);
    const today = parseInt(localStorage.getItem('tt_stat_today') || '0', 10);
    const day = localStorage.getItem('tt_stat_day') || '';
    const todayStr = new Date().toDateString();

    if (day !== todayStr) {
      localStorage.setItem('tt_stat_day', todayStr);
      localStorage.setItem('tt_stat_today', '0');
      document.getElementById('statToday').textContent = '0';
    } else {
      document.getElementById('statToday').textContent = today;
    }
    document.getElementById('statTotal').textContent = total;
  },

  incStats() {
    const total = parseInt(localStorage.getItem('tt_stat_total') || '0', 10) + 1;
    const today = parseInt(localStorage.getItem('tt_stat_today') || '0', 10) + 1;
    localStorage.setItem('tt_stat_total', String(total));
    localStorage.setItem('tt_stat_today', String(today));
    localStorage.setItem('tt_stat_day', new Date().toDateString());
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statToday').textContent = today;
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
                           
