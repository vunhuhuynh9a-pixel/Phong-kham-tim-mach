/* Hiệu ứng dùng chung: nền mạch máu, pháo giấy, thẻ bay, đếm số, chữ chạy */
(function () {
  const giam = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.HU = { giam };

  // Nền mạch máu với hồng cầu, bạch cầu trôi và đường điện tim
  HU.taoNen = function () {
    const n = document.createElement('div'); n.className = 'nen-dong'; n.setAttribute('aria-hidden', 'true');
    const so = window.innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < so; i++) {
      const c = document.createElement('i'), s = 26 + Math.random() * 46;
      c.className = 'hong-cau' + (i % 7 === 3 ? ' trang' : '');
      c.style.cssText = `width:${s}px;height:${s * .82}px;top:${Math.random() * 92}%;animation-duration:${16 + Math.random() * 22}s;animation-delay:-${Math.random() * 30}s`;
      n.appendChild(c);
    }
    n.insertAdjacentHTML('beforeend', '<svg class="dien-tim-nen" viewBox="0 0 1400 90" preserveAspectRatio="none"><path d="M0 60 H260 l20 -10 l15 10 H360 l18 -50 l20 80 l16 -30 H560 l20 -10 l15 10 H860 l18 -50 l20 80 l16 -30 H1060 l20 -10 l15 10 H1400"/></svg>');
    document.body.prepend(n);
    const dau = document.querySelector('.dau');
    if (dau) dau.querySelector('div:nth-child(2)').insertAdjacentHTML('afterend', '<svg class="dien-tim-dau" viewBox="0 0 120 30"><path d="M0 18 H38 l6 -4 l5 4 H58 l6 -16 l7 26 l5 -10 H120"/></svg>');
  };

  HU.vaoMan = function (el) {
    if (!el) return; el.classList.remove('vao-man'); void el.offsetWidth; el.classList.add('vao-man');
  };
  // Đánh số --i cho các phần tử để chạy lần lượt
  HU.lanLuot = function (ds, lop) { [...ds].forEach((e, i) => { e.style.setProperty('--i', i); e.classList.remove(lop || 'lan'); void e.offsetWidth; e.classList.add(lop || 'lan'); }); };

  HU.phaoGiay = function (so) {
    if (giam) return;
    const mau = ['#E63946', '#F4A261', '#2A9D8F', '#FDE047', '#7C3AED', '#0EA5E9'];
    for (let i = 0; i < (so || 90); i++) {
      const p = document.createElement('i'); p.className = 'phao-giay';
      p.style.cssText = `left:${Math.random() * 100}vw;background:${mau[i % mau.length]};animation-duration:${1.8 + Math.random() * 1.8}s;animation-delay:${Math.random() * .6}s;border-radius:${i % 3 ? '2px' : '50%'};width:${6 + Math.random() * 8}px`;
      document.body.appendChild(p); setTimeout(() => p.remove(), 4200);
    }
  };

  // Bay một bản sao từ phần tử nguồn (theo khung cũ) tới phần tử đích
  HU.bay = function (khungNguon, chu, dich, xong) {
    if (giam || !khungNguon || !dich || !dich.animate) { xong && xong(); return; }
    const k2 = dich.getBoundingClientRect();
    const g = document.createElement('div'); g.className = 'the the-bay'; g.textContent = chu;
    g.style.cssText = `left:${khungNguon.left}px;top:${khungNguon.top}px;width:${khungNguon.width}px;height:${khungNguon.height}px`;
    document.body.appendChild(g);
    const dx = k2.left - khungNguon.left, dy = k2.top - khungNguon.top, sx = k2.width / khungNguon.width;
    g.animate([{ transform: 'translate(0,0) scale(1) rotate(0)' }, { transform: `translate(${dx / 2}px,${dy / 2 - 40}px) scale(1.05) rotate(-4deg)`, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(${Math.min(sx, 1.3)},1)`, opacity: .2 }],
      { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = () => { g.remove(); xong && xong(); };
  };

  HU.demSo = function (el, den, ms) {
    if (giam) { el.textContent = den; return; }
    const bd = performance.now();
    (function b(t) { const k = Math.min(1, (t - bd) / (ms || 1200)); el.textContent = Math.round(den * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(b); })(bd);
  };

  HU.chuChay = function (el, chu, toc) {
    if (giam) { el.textContent = chu; return Promise.resolve(); }
    return new Promise(ok => {
      el.textContent = ''; const t = document.createTextNode(''), con = document.createElement('span'); con.className = 'con-tro';
      el.append(t, con); let i = 0;
      const h = setInterval(() => { t.data = chu.slice(0, ++i); if (i >= chu.length) { clearInterval(h); setTimeout(() => con.remove(), 600); ok(); } }, toc || 28);
      el.onclick = () => { i = chu.length - 1; };
    });
  };

  HU.mayBay = function (tu) {
    if (giam) return;
    const k = tu.getBoundingClientRect(), m = document.createElement('div'); m.className = 'may-bay'; m.textContent = '📨';
    m.style.left = (k.left + k.width / 2 - 24) + 'px'; m.style.top = (k.top - 10) + 'px';
    document.body.appendChild(m); setTimeout(() => m.remove(), 1300);
  };

  HU.lop = function (html, ms) { // lớp phủ tạm (màn chào, chẩn đoán)
    return new Promise(ok => {
      const d = document.createElement('div'); d.innerHTML = html; const el = d.firstElementChild; document.body.appendChild(el);
      const dong = () => { el.classList.add('dong'); setTimeout(() => { el.remove(); ok(); }, giam ? 0 : 380); };
      el.onclick = dong; setTimeout(dong, giam ? 0 : ms);
    });
  };
})();
