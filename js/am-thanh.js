/* Âm thanh tạo trực tiếp bằng Web Audio (không cần tệp âm thanh, chạy cả khi mất mạng).
   AT.phat('ten') — các tên: coi, tit, chon, dat, go, tich, het, quet, dung, sai, keng, xuc, vut, dau, chuong
   AT.timBatDau(nhanh) / AT.timDung() — tiếng tim đập nền khi làm phiếu. Nút 🔊 bật/tắt, nhớ theo máy. */
(function () {
  const KHOA = 'kc-am-thanh';
  let ctx = null, tong = null, dich = null, bat = true, henTim = null;
  try { bat = localStorage.getItem(KHOA) !== 'tat'; } catch (e) { }

  function mo() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC(); tong = ctx.createGain(); tong.gain.value = 0.9; tong.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // Trình duyệt chỉ cho phát âm thanh sau lần chạm đầu tiên
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, mo, { capture: true, passive: true }));

  function nhac(f, bd, dai, o) {
    o = o || {};
    const t = ctx.currentTime + (bd || 0), osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.kieu || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.den) osc.frequency.exponentialRampToValueAtTime(o.den, t + dai);
    const am = o.am == null ? 0.2 : o.am;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(am, t + Math.min(0.015, dai / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
    osc.connect(g); g.connect(dich || tong); osc.start(t); osc.stop(t + dai + 0.05);
  }
  function on(bd, dai, o) { // tiếng ồn có lọc (rung, vút, đập dấu)
    o = o || {};
    const t = ctx.currentTime + (bd || 0), n = Math.floor(ctx.sampleRate * dai), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(), loc = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; loc.type = o.loai || 'bandpass'; loc.frequency.setValueAtTime(o.f || 1200, t); if (o.den) loc.frequency.exponentialRampToValueAtTime(o.den, t + dai);
    loc.Q.value = o.q || 1;
    g.gain.setValueAtTime(o.am || 0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
    s.connect(loc); loc.connect(g); g.connect(dich || tong); s.start(t); s.stop(t + dai);
  }

  const AM = {
    coi() { for (let i = 0; i < 4; i++) { nhac(720, i * 0.42, 0.4, { kieu: 'triangle', am: 0.13 }); nhac(960, i * 0.42 + 0.21, 0.2, { kieu: 'triangle', am: 0.13 }); } },
    tit() { nhac(1050, 0, 0.09, { am: 0.07 }); },
    chon() { nhac(620, 0, 0.06, { kieu: 'triangle', am: 0.18 }); },
    dat() { nhac(320, 0, 0.12, { den: 880, am: 0.22 }); nhac(1200, 0.06, 0.08, { am: 0.06 }); },
    go() { nhac(700, 0, 0.12, { den: 260, am: 0.15 }); },
    tich() { nhac(1600, 0, 0.035, { kieu: 'square', am: 0.05 }); },
    het() { nhac(160, 0, 0.7, { kieu: 'sawtooth', am: 0.16 }); nhac(120, 0.05, 0.65, { kieu: 'square', am: 0.08 }); },
    quet() { nhac(220, 0, 1.5, { den: 660, am: 0.07 }); for (let i = 0; i < 5; i++) nhac(1300, i * 0.3, 0.06, { am: 0.05 }); },
    dung() { nhac(880, 0, 0.45, { am: 0.16 }); nhac(1320, 0.07, 0.5, { am: 0.12 }); },
    sai() { nhac(200, 0, 0.28, { kieu: 'square', am: 0.08, den: 150 }); },
    keng() { [523, 659, 784, 1047].forEach((f, i) => nhac(f, i * 0.12, 0.5, { kieu: 'triangle', am: 0.15 })); nhac(1047, 0.5, 0.9, { am: 0.12 }); nhac(1319, 0.5, 0.9, { am: 0.08 }); },
    xuc() { for (let i = 0; i < 9; i++) on(i * 0.1 + Math.random() * 0.03, 0.05, { f: 2500 + Math.random() * 1500, q: 4, am: 0.3 }); },
    vut() { on(0, 0.6, { f: 400, den: 4000, q: 0.8, am: 0.25 }); },
    dau() { nhac(140, 0, 0.25, { den: 60, am: 0.35 }); on(0, 0.12, { loai: 'lowpass', f: 800, am: 0.3 }); },
    chuong() { nhac(1175, 0, 0.6, { am: 0.12 }); nhac(1568, 0.15, 0.8, { am: 0.1 }); },
    // Còi xe dài, to dần như xe đang tiến lại gần (hiệu ứng Doppler đơn giản)
    coiDai(giay) {
      const buoc = 0.5, so = Math.floor((giay || 4) / buoc);
      for (let i = 0; i < so; i++) {
        const k = i / so, len = 1 + 0.06 * k, am = 0.05 + 0.13 * k;
        nhac(700 * len, i * buoc, buoc * 0.5, { kieu: 'triangle', am });
        nhac(940 * len, i * buoc + buoc * 0.5, buoc * 0.5, { kieu: 'triangle', am });
      }
    },
    phanh() { on(0, 0.9, { f: 3200, den: 1800, q: 6, am: 0.22 }); nhac(1900, 0, 0.8, { kieu: 'sawtooth', den: 1300, am: 0.04 }); },
    cua() { nhac(180, 0, 0.12, { den: 90, am: 0.3 }); on(0, 0.08, { loai: 'lowpass', f: 1500, am: 0.25 }); nhac(150, 0.35, 0.15, { den: 70, am: 0.35 }); on(0.35, 0.1, { loai: 'lowpass', f: 1200, am: 0.3 }); },
    buoc() { for (let i = 0; i < 6; i++) on(i * 0.32, 0.07, { loai: 'lowpass', f: 600, am: 0.25 }); },
    banh() { for (let i = 0; i < 8; i++) nhac(90, i * 0.2, 0.05, { kieu: 'square', am: 0.03 }); },
    tim() { nhac(70, 0, 0.14, { den: 45, am: 0.35 }); nhac(65, 0.2, 0.12, { den: 42, am: 0.25 }); }
  };

  window.AT = {
    phat(ten) { if (!bat || !mo() || !AM[ten]) return; try { AM[ten](); } catch (e) { } },
    timBatDau(nhanh) {
      this.timDung(); const ms = nhanh ? 520 : 900;
      henTim = setInterval(() => this.phat('tim'), ms);
    },
    timDung() { clearInterval(henTim); henTim = null; },
    // Gom các tiếng của một cảnh để có thể tắt ngay khi bỏ qua
    canhBatDau() { if (!mo()) return; dich = ctx.createGain(); dich.connect(tong); },
    canhDung() { if (!dich) return; const d = dich; dich = null; try { d.gain.setTargetAtTime(0, ctx.currentTime, 0.05); setTimeout(() => d.disconnect(), 400); } catch (e) { } },
    get bat() { return bat; },
    taoNut(cha) {
      const b = document.createElement('button'); b.className = 'nut-am'; b.type = 'button';
      const ve = () => { b.textContent = bat ? '🔊' : '🔇'; b.title = bat ? 'Tắt âm thanh' : 'Bật âm thanh'; b.setAttribute('aria-label', b.title); };
      b.onclick = () => { bat = !bat; try { localStorage.setItem(KHOA, bat ? 'bat' : 'tat'); } catch (e) { } if (!bat) this.timDung(); else this.phat('chon'); ve(); };
      ve(); (cha || document.querySelector('.dau .phai') || document.body).prepend(b); return b;
    }
  };
})();
