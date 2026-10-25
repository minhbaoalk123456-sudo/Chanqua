/**
 * Live success ticker
 * by Trần phi thiên
 */

const Ticker = {
  el: null,

  init() {
    this.el = document.getElementById('ticker');
  },

  push(name = 'THIENTRAN') {
    if (!this.el) return;
    const span = document.createElement('span');
    span.innerHTML = `✦ <b>${name}</b> đã vượt thành công`;
    this.el.appendChild(span);

    // keep DOM light
    while (this.el.children.length > 20) {
      this.el.removeChild(this.el.firstChild);
    }
  },

  /** Simulate other users for live feel */
  startSimulation() {
    const names = ['THIENTRAN', 'User_8821', 'ModVN', 'BypassPro', 'LinkKing'];
    setInterval(() => {
      if (Math.random() > 0.55) {
        const n = names[Math.floor(Math.random() * names.length)];
        this.push(n);
      }
    }, 8000 + Math.random() * 7000);
  }
};
