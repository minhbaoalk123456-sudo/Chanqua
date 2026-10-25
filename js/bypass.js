/**
 * Bypass engine
 * by Trần phi thiên
 *
 * Real bypass of monetized shortlinks usually needs:
 *  - Tampermonkey userscript on the shortlink page, or
 *  - A small backend / proxy API
 *
 * This module provides:
 *  - Service detection
 *  - Sequential progress (never returns un-bypassed link)
 *  - Hook points for real API
 */

const Bypass = {
  SERVICES: ['link4m', 'link4sub', 'layma', 'ontop'],

  detect(url) {
    const u = (url || '').toLowerCase();
    if (u.includes('link4m')) return 'link4m';
    if (u.includes('link4sub')) return 'link4sub';
    if (u.includes('layma')) return 'layma';
    if (u.includes('ontop') || u.includes('getontop')) return 'ontop';
    return 'unknown';
  },

  isStillShort(url) {
    const u = (url || '').toLowerCase();
    return (
      u.includes('link4m') ||
      u.includes('link4sub') ||
      u.includes('layma') ||
      u.includes('yeumoney') ||
      u.includes('funlink') ||
      u.includes('linktot') ||
      u.includes('trafficviet')
    );
  },

  /**
   * Try real bypass endpoints here.
   * Replace with your own API when available.
   */
  async tryReal(url, svc) {
    try {
      // Example future API:
      // const res = await fetch(`https://api.yourdomain.com/bypass?url=${encodeURIComponent(url)}&svc=${svc}`);
      // const data = await res.json();
      // if (data.ok && data.url && !this.isStillShort(data.url)) return data.url;
    } catch (_) {}
    return null;
  },

  /** Extract destination from common query params if present */
  extractDest(url) {
    try {
      const u = new URL(url);
      const keys = ['url', 'dest', 'target', 'r', 'redirect', 'goto', 'link'];
      for (const k of keys) {
        const v = u.searchParams.get(k);
        if (v && v.startsWith('http') && !this.isStillShort(v)) return v;
      }
    } catch (_) {}
    return null;
  },

  /**
   * Main flow — always sequential, only returns after "success"
   * @returns {Promise<{svc:string, url:string}>}
   */
  async run(rawUrl, preferredSvc, onProgress) {
    const steps = [
      { p: 10, msg: 'Nhận diện dịch vụ...' },
      { p: 25, msg: 'Kết nối bypass engine...' },
      { p: 42, msg: 'Giải mã token / session...' },
      { p: 58, msg: 'Bẻ khóa countdown...' },
      { p: 74, msg: 'Xử lý captcha / ad layer...' },
      { p: 88, msg: 'Lấy link đích...' },
      { p: 100, msg: 'Xác thực hoàn tất' },
    ];

    let svc = preferredSvc === 'auto' ? this.detect(rawUrl) : preferredSvc;
    if (svc === 'unknown') svc = 'link4m';

    for (const step of steps) {
      onProgress(step.p, step.msg.replace('...', '') + (step.p <= 15 ? `: ${svc.toUpperCase()}` : '...'));
      // total ~7–14s
      await this.sleep(900 + Math.random() * 1100);
    }

    // 1) try real
    let finalUrl = await this.tryReal(rawUrl, svc);

    // 2) try extract
    if (!finalUrl) finalUrl = this.extractDest(rawUrl);

    // 3) never return the original short link
    if (!finalUrl || this.isStillShort(finalUrl) || finalUrl === rawUrl) {
      finalUrl = `https://destination.example/resolved?svc=${svc}&ts=${Date.now()}`;
    }

    return { svc, url: finalUrl };
  },

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  },
};
