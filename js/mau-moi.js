/* Mẫu sản phẩm thế hệ 2 — có hình minh hoạ, bóng đổ, đường cong.
   Thêm vào bộ mẫu chung qua MAU_CC.BO (do mau.js cung cấp). */
(function () {
  const { chu, rect, circle, icon, esc, chanTrang, nhan, BO } = window.MAU_CC;
  let dem = 0; const id = t => t + (++dem);

  // ---------- hình học ----------
  const bez3 = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const bez2 = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  // Nhánh cong thon dần (kiểu Tony Buzan)
  function nhanhThon(x0, y0, cx, cy, x1, y1, w0, w1, mau) {
    const n = 28, trai = [], phai = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = bez2(x0, cx, x1, t), y = bez2(y0, cy, y1, t);
      const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
      const l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = (w0 + (w1 - w0) * t) / 2;
      trai.push([x + nx * w, y + ny * w]); phai.push([x - nx * w, y - ny * w]);
    }
    const d = 'M' + trai.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' L' + phai.reverse().map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + 'Z';
    return `<path d="${d}" fill="${mau}"/>` + circle(x1, y1, w1 / 2 + 1, mau);
  }
  function traiTim(cx, cy, w, fill, extra) {
    const h = w * 0.9, x = cx, y = cy - h * 0.32;
    return `<path d="M${x} ${y + h * 0.95} C ${x - w * 0.95} ${y + h * 0.35}, ${x - w * 0.62} ${y - h * 0.42}, ${x} ${y - h * 0.05} C ${x + w * 0.62} ${y - h * 0.42}, ${x + w * 0.95} ${y + h * 0.35}, ${x} ${y + h * 0.95} Z" fill="${fill}" ${extra || ''}/>`;
  }
  function hongCau(x, y, r, goc) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${goc || 0})"><ellipse rx="${r}" ry="${r * 0.62}" fill="#C81E33"/><ellipse rx="${r * 0.55}" ry="${r * 0.3}" fill="#9B1426" opacity="0.55"/><ellipse cx="${-r * 0.35}" cy="${-r * 0.25}" rx="${r * 0.25}" ry="${r * 0.12}" fill="#fff" opacity="0.35"/></g>`;
  }
  const bong = fid => `<filter id="${fid}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#1f2937" flood-opacity="0.13"/></filter>`;

  // ====================== INFOGRAPHIC: HÀNH TRÌNH DÒNG MÁU ======================
  function infoDongMau(sp, p, W, H) {
    const fb = id('b'), gn = id('g'), gm = id('m');
    let s = `<defs>${bong(fb)}
      <linearGradient id="${gn}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.nhat}"/><stop offset="0.45" stop-color="#ffffff"/><stop offset="1" stop-color="${p.nen}"/></linearGradient>
      <linearGradient id="${gm}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B5172B"/><stop offset="0.5" stop-color="#E63946"/><stop offset="1" stop-color="#B5172B"/></linearGradient></defs>`;
    s += rect(0, 0, W, H, `url(#${gn})`);
    s += circle(W - 60, 90, 190, p.muc[1], 'opacity="0.10"') + circle(60, H - 220, 150, p.muc[3], 'opacity="0.08"');
    // đầu trang
    const nhanTren = 'HỒ SƠ BỆNH · NHÓM ' + sp.nhom;
    s += rect(W / 2 - 170, 34, 340, 44, p.muc[0], 22) + chu(W / 2 - 170, 40, 340, nhanTren, { size: 22, dam: true, giua: true, mau: '#fff' }).svg;
    s += chu(70, 92, W - 140, sp.tieuDe || sp.benh, { size: 58, dam: true, giua: true, mau: p.dam, cao: 140, min: 32, lh: 1.12 }).svg;
    s += chu(70, 200, W - 140, '👤 ' + sp.benhNhan + '   ·   🩺 ' + sp.benh, { size: 25, giua: true, mau: '#4B5563' }).svg;
    // mạch máu uốn lượn qua 5 trạm
    const N = [[205, 370], [875, 562], [205, 754], [875, 946], [205, 1138]];
    let d = `M-40 290 C 80 290, ${N[0][0]} 280, ${N[0][0]} ${N[0][1]}`, doan = [[-40, 290, 80, 290, N[0][0], 280, N[0][0], N[0][1]]];
    for (let i = 1; i < N.length; i++) {
      const a = N[i - 1], b = N[i], c1 = [a[0], a[1] + 110], c2 = [b[0], b[1] - 110];
      d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${b[0]} ${b[1]}`; doan.push([a[0], a[1], c1[0], c1[1], c2[0], c2[1], b[0], b[1]]);
    }
    s += `<path d="${d}" fill="none" stroke="#7A1E2B" stroke-opacity="0.18" stroke-width="64" stroke-linecap="round"/>`;
    s += `<path d="${d}" fill="none" stroke="url(#${gm})" stroke-width="46" stroke-linecap="round"/>`;
    s += `<path d="${d}" fill="none" stroke="#FF9AA5" stroke-opacity="0.45" stroke-width="10" stroke-linecap="round" stroke-dasharray="40 26"/>`;
    doan.forEach((g, k) => [0.3, 0.62].forEach((t, j) => {
      const x = bez3(g[0], g[2], g[4], g[6], t), y = bez3(g[1], g[3], g[5], g[7], t);
      s += hongCau(x + (j ? 6 : -6), y, 15, (k * 47 + j * 70) % 180);
    }));
    // các trạm
    N.forEach((n, i) => {
      const [nx, ny] = n, c = p.muc[i], trai = nx < W / 2;
      const cx = trai ? 300 : 60, cw = 720, cy = ny - 88, ch = 176;
      s += `<g filter="url(#${fb})">` + rect(cx, cy, cw, ch, '#fff', 28) + '</g>';
      s += rect(trai ? cx : cx + cw - 10, cy + 22, 10, ch - 44, c, 5);
      const nhanW = Math.min(cw - 60, 40 + nhan(sp, i).length * 13.5);
      s += rect(cx + 28, cy + 20, nhanW, 40, c, 20, 'opacity="0.13"') + chu(cx + 28, cy + 27, nhanW, nhan(sp, i).toUpperCase(), { size: 20, dam: true, giua: true, mau: c }).svg;
      s += chu(cx + 30, cy + 72, cw - 64, sp.noiDung[i], { size: 26, cao: 92, min: 16, mau: '#1F2937', lh: 1.22 }).svg;
      s += circle(nx, ny, 62, '#fff', `stroke="${c}" stroke-width="7"`) + circle(nx, ny, 48, c) + icon(nx, ny + 2, 44, MUC[i].bieuTuong);
      s += circle(nx + (trai ? -46 : 46), ny - 46, 20, p.dam) + `<text x="${nx + (trai ? -46 : 46)}" y="${ny - 39}" font-family="Arial" font-size="22" font-weight="bold" fill="#fff" text-anchor="middle">${i + 1}</text>`;
    });
    if (sp.thongDiep) {
      s += `<g filter="url(#${fb})">` + rect(90, 1236, W - 180, 64, p.dam, 32) + '</g>';
      s += traiTim(130, 1270, 30, '#FF6B7A') + traiTim(W - 130, 1270, 30, '#FF6B7A');
      s += chu(170, 1236, W - 340, sp.thongDiep, { size: 26, dam: true, nghieng: true, giua: true, giuaDoc: true, cao: 64, mau: '#fff', min: 16 }).svg;
    }
    return s + chanTrang(sp, W, H + 38, p, '#6B7280');
  }

  // ====================== SƠ ĐỒ TƯ DUY: NHÁNH CONG TONY BUZAN ======================
  function mindBuzan(sp, p, W, H) {
    const fb = id('b'), pt = id('p'), gt = id('t');
    let s = `<defs>${bong(fb)}
      <pattern id="${pt}" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="#E9DFCF"/></pattern>
      <radialGradient id="${gt}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#FF7A86"/><stop offset="0.6" stop-color="#E63946"/><stop offset="1" stop-color="#A3162A"/></radialGradient></defs>`;
    s += rect(0, 0, W, H, '#FFFBF3') + rect(0, 0, W, H, `url(#${pt})`);
    // tiêu đề
    s += chu(300, 26, W - 600, sp.tieuDe || sp.benh, { size: 40, dam: true, giua: true, mau: p.dam, cao: 56, min: 24 }).svg;
    if (sp.thongDiep) s += chu(300, 80, W - 600, '“' + sp.thongDiep + '”', { size: 24, nghieng: true, giua: true, mau: p.muc[0], cao: 34, min: 16 }).svg;
    const C = [800, 470];
    const O = [ // [hộp x,y,w,h], điểm cuối nhánh, điểm điều khiển
      { b: [40, 150, 420, 230], e: [460, 270], k: [640, 250] },
      { b: [1140, 150, 420, 230], e: [1140, 270], k: [960, 250] },
      { b: [1140, 580, 420, 230], e: [1140, 690], k: [990, 700] },
      { b: [590, 742, 420, 176], e: [800, 742], k: [860, 640] },
      { b: [40, 580, 420, 230], e: [460, 690], k: [610, 700] }
    ];
    O.forEach((o, i) => { s += nhanhThon(C[0], C[1], o.k[0], o.k[1], o.e[0], o.e[1], 46, 12, p.muc[i]); });
    // trái tim trung tâm
    s += `<g filter="url(#${fb})">` + traiTim(C[0], C[1] + 6, 330, `url(#${gt})`) + '</g>';
    s += `<ellipse cx="${C[0] - 78}" cy="${C[1] - 62}" rx="48" ry="24" fill="#fff" opacity="0.28" transform="rotate(-30 ${C[0] - 78} ${C[1] - 62})"/>`;
    s += chu(C[0] - 140, C[1] - 46, 280, sp.benh, { size: 42, dam: true, giua: true, mau: '#fff', cao: 110, min: 22, giuaDoc: true, lh: 1.1 }).svg;
    s += chu(C[0] - 120, C[1] + 66, 240, sp.benhNhan, { size: 20, giua: true, mau: '#FFE4E6' }).svg;
    // hộp nội dung
    O.forEach((o, i) => {
      const [x, y, w, h] = o.b, c = p.muc[i];
      s += `<g filter="url(#${fb})">` + rect(x, y, w, h, '#fff', 26, `stroke="${c}" stroke-width="4"`) + '</g>';
      s += circle(x + 40, y + 38, 26, c, 'opacity="0.15"') + icon(x + 40, y + 40, 30, MUC[i].bieuTuong);
      s += chu(x + 76, y + 22, w - 96, nhan(sp, i), { size: 26, dam: true, mau: c, cao: 36, min: 16 }).svg;
      s += `<path d="M${x + 76} ${y + 64} q 15 -8 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`;
      s += chu(x + 24, y + 80, w - 48, sp.noiDung[i], { size: 24, cao: h - 96, min: 14, mau: '#1F2937', lh: 1.25 }).svg;
    });
    // hình trang trí nhỏ
    [[560, 150, '✦', p.muc[1]], [1050, 140, '✦', p.muc[3]], [560, 860, '♥', p.muc[0]], [1060, 870, '✦', p.muc[2]], [700, 300, '•', p.muc[4]]]
      .forEach(([x, y, k, c]) => { s += `<text x="${x}" y="${y}" font-size="34" fill="${c}" opacity="0.7" text-anchor="middle">${k}</text>`; });
    s += hongCau(1010, 380, 18, 30) + hongCau(590, 560, 15, -20) + hongCau(1030, 560, 13, 60);
    return s + chanTrang(sp, W, H + 34, p, '#6B7280');
  }


  // ---------- tiện ích thêm ----------
  function ngauNhien(hat) { let h = hat >>> 0 || 1; return () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; }; }
  // Khung "vẽ tay": cạnh hơi run
  function khungTay(x, y, w, h, net, nen, hat, day) {
    const r = ngauNhien(hat), j = () => (r() - 0.5) * 6, d = [];
    const canh = (x1, y1, x2, y2) => { const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 70)); for (let i = 1; i <= n; i++) d.push([x1 + (x2 - x1) * i / n + j(), y1 + (y2 - y1) * i / n + j()]); };
    d.push([x + j(), y + j()]); canh(x, y, x + w, y); canh(x + w, y, x + w, y + h); canh(x + w, y + h, x, y + h); canh(x, y + h, x, y);
    const p = 'M' + d.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') + 'Z';
    const r2 = ngauNhien(hat + 99), p2 = 'M' + d.map(q => (q[0] + (r2() - 0.5) * 4).toFixed(1) + ' ' + (q[1] + (r2() - 0.5) * 4).toFixed(1)).join(' L') + 'Z';
    return `<path d="${p}" fill="${nen}" stroke="${net}" stroke-width="${day || 3.5}" stroke-linejoin="round"/><path d="${p2}" fill="none" stroke="${net}" stroke-width="1.6" opacity="0.6"/>`;
  }
  function luGiac(cx, cy, R, fill, extra) {
    let d = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 90); d += (k ? 'L' : 'M') + (cx + R * Math.cos(a)).toFixed(1) + ' ' + (cy + R * Math.sin(a)).toFixed(1); }
    return `<path d="${d}Z" fill="${fill}" ${extra || ''}/>`;
  }
  function theTrang(fb, x, y, w, h, r, extra) { return `<g filter="url(#${fb})">` + rect(x, y, w, h, '#fff', r == null ? 24 : r, extra) + '</g>'; }
  const so2 = i => String(i + 1).padStart(2, '0');

  // ====================== INFOGRAPHIC: THẺ BO TRÒN KIỂU CANVA ======================
  function infoCanva(sp, p, W, H) {
    const fb = id('b');
    let s = `<defs>${bong(fb)}</defs>` + rect(0, 0, W, H, p.nhat);
    s += circle(120, 120, 220, '#fff', 'opacity="0.35"') + circle(W - 80, H - 160, 260, '#fff', 'opacity="0.35"');
    s += rect(60, 50, W - 120, 250, p.dam, 40);
    s += traiTim(W - 150, 165, 120, 'none', `stroke="#fff" stroke-width="6" opacity="0.25"`) + traiTim(W - 150, 165, 70, '#fff', 'opacity="0.18"');
    s += chu(110, 78, 760, 'BẢN TIN SỨC KHOẺ · NHÓM ' + sp.nhom, { size: 22, dam: true, mau: p.nhat }).svg;
    s += chu(110, 118, 740, sp.tieuDe || sp.benh, { size: 52, dam: true, mau: '#fff', cao: 120, min: 28, lh: 1.1 }).svg;
    s += rect(110, 244, 420, 40, '#fff', 20, 'opacity="0.18"') + chu(110, 251, 420, '👤 ' + sp.benhNhan, { size: 22, giua: true, mau: '#fff' }).svg;
    const O = [[60, 340, 465, 340], [555, 340, 465, 340], [60, 710, 465, 340], [555, 710, 465, 340], [60, 1080, 960, 160]];
    O.forEach(([x, y, w, h], i) => {
      const c = p.muc[i], ngang = i === 4;
      s += theTrang(fb, x, y, w, h, 32);
      s += `<text x="${x + w - 26}" y="${y + 88}" font-family="Arial" font-size="92" font-weight="bold" fill="${c}" opacity="0.12" text-anchor="end">${so2(i)}</text>`;
      if (!ngang) {
        s += circle(x + 66, y + 66, 40, c) + icon(x + 66, y + 68, 40, MUC[i].bieuTuong);
        s += chu(x + 30, y + 122, w - 60, nhan(sp, i), { size: 28, dam: true, mau: c, cao: 40, min: 18 }).svg;
        s += rect(x + 30, y + 166, 60, 6, c, 3);
        s += chu(x + 30, y + 186, w - 60, sp.noiDung[i], { size: 25, cao: h - 204, min: 15, lh: 1.25 }).svg;
      } else {
        s += circle(x + 80, y + h / 2, 46, c) + icon(x + 80, y + h / 2 + 2, 44, MUC[i].bieuTuong);
        s += chu(x + 150, y + 24, w - 260, nhan(sp, i), { size: 26, dam: true, mau: c }).svg;
        s += chu(x + 150, y + 64, w - 280, sp.noiDung[i], { size: 25, cao: h - 80, min: 15, lh: 1.22 }).svg;
      }
    });
    if (sp.thongDiep) s += traiTim(96, 1282, 28, p.muc[0]) + chu(130, 1262, W - 200, sp.thongDiep, { size: 28, dam: true, nghieng: true, mau: p.dam, cao: 44, min: 16 }).svg;
    return s + chanTrang(sp, W, H + 40, p, '#6B7280');
  }

  // ====================== INFOGRAPHIC: QUẢ TIM TRUNG TÂM ======================
  function infoQuaTim(sp, p, W, H) {
    const fb = id('b'), gt = id('t');
    let s = `<defs>${bong(fb)}<radialGradient id="${gt}" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stop-color="#FF8A94"/><stop offset="0.55" stop-color="#E63946"/><stop offset="1" stop-color="#9B1426"/></radialGradient></defs>`;
    s += rect(0, 0, W, H, '#fff') + rect(0, 0, W, 250, p.nen);
    s += `<path d="M0 230 Q ${W / 2} 300 ${W} 230 V250 H0Z" fill="${p.nen}"/>`;
    s += chu(60, 46, W - 120, sp.tieuDe || sp.benh, { size: 56, dam: true, giua: true, mau: p.dam, cao: 130, min: 30, lh: 1.1 }).svg;
    s += chu(60, 165, W - 120, '👤 ' + sp.benhNhan + '  ·  🩺 ' + sp.benh, { size: 24, giua: true, mau: '#4B5563' }).svg;
    // quả tim + mạch lớn
    const cx = 540, cy = 640;
    s += `<path d="M${cx - 30} ${cy - 120} C ${cx - 40} ${cy - 230}, ${cx + 90} ${cy - 250}, ${cx + 100} ${cy - 150}" fill="none" stroke="#C81E33" stroke-width="34" stroke-linecap="round"/>`;
    s += `<path d="M${cx + 30} ${cy - 110} C ${cx + 30} ${cy - 190}, ${cx - 80} ${cy - 210}, ${cx - 110} ${cy - 160}" fill="none" stroke="#2563EB" stroke-width="26" stroke-linecap="round"/>`;
    s += `<g filter="url(#${fb})">` + traiTim(cx, cy, 240, `url(#${gt})`) + '</g>';
    s += `<ellipse cx="${cx - 70}" cy="${cy - 70}" rx="44" ry="22" fill="#fff" opacity="0.3" transform="rotate(-30 ${cx - 70} ${cy - 70})"/>`;
    s += chu(cx - 120, cy - 40, 240, sp.benh, { size: 36, dam: true, giua: true, giuaDoc: true, cao: 100, mau: '#fff', min: 20, lh: 1.1 }).svg;
    const O = [{ b: [40, 300, 330, 330], d: [cx - 90, cy - 50] }, { b: [710, 300, 330, 330], d: [cx + 90, cy - 50] },
      { b: [40, 660, 330, 300], d: [cx - 55, cy + 60] }, { b: [710, 660, 330, 300], d: [cx + 55, cy + 60] },
      { b: [60, 1000, 960, 170], d: [cx, cy + 130] }];
    O.forEach((o, i) => {
      const [x, y, w, h] = o.b, c = p.muc[i];
      const ax = i === 4 ? cx : (x < cx ? x + w : x), ay = i === 4 ? y : y + 70;
      s += `<path d="M${ax} ${ay} Q ${(ax + o.d[0]) / 2} ${ay} ${o.d[0]} ${o.d[1]}" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>` + circle(o.d[0], o.d[1], 9, '#fff', `stroke="${c}" stroke-width="4"`);
      s += theTrang(fb, x, y, w, h, 24) + rect(x, y, w, 10, c, 5);
      if (i < 4) {
        s += icon(x + 40, y + 52, 34, MUC[i].bieuTuong) + chu(x + 70, y + 32, w - 90, nhan(sp, i), { size: 23, dam: true, mau: c, cao: 44, min: 15 }).svg;
        s += chu(x + 24, y + 92, w - 48, sp.noiDung[i], { size: 23, cao: h - 108, min: 14, lh: 1.25 }).svg;
      } else {
        s += icon(x + 50, y + 60, 40, MUC[i].bieuTuong) + chu(x + 90, y + 30, w - 120, nhan(sp, i), { size: 25, dam: true, mau: c }).svg;
        s += chu(x + 90, y + 68, w - 120, sp.noiDung[i], { size: 24, cao: h - 82, min: 14, lh: 1.22 }).svg;
      }
    });
    if (sp.thongDiep) s += rect(160, 1200, W - 320, 64, p.muc[0], 32) + chu(190, 1200, W - 380, sp.thongDiep, { size: 25, dam: true, nghieng: true, giua: true, giuaDoc: true, cao: 64, mau: '#fff', min: 15 }).svg;
    return s + chanTrang(sp, W, H + 30, p, '#6B7280');
  }

  // ====================== INFOGRAPHIC: BONG BÓNG HỒNG CẦU ======================
  function infoHongCau(sp, p, W, H) {
    const fb = id('b'), gs = [];
    let defs = bong(fb);
    p.muc.forEach((c, i) => { const g = id('r'); gs.push(g); defs += `<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${c}" stop-opacity="0.78"/><stop offset="0.72" stop-color="${c}"/><stop offset="1" stop-color="${c}"/></radialGradient>`; });
    let s = `<defs>${defs}</defs>` + rect(0, 0, W, H, '#FFF6F6');
    s += `<path d="M-50 420 C 300 300, 700 620, 1130 480 L1130 760 C 700 900, 300 580, -50 700Z" fill="#FDE2E4"/>`;
    s += `<path d="M-50 980 C 300 860, 700 1180, 1130 1040 L1130 1250 C 700 1390, 300 1070, -50 1200Z" fill="#FDE2E4"/>`;
    s += chu(60, 40, W - 120, sp.tieuDe || sp.benh, { size: 54, dam: true, giua: true, mau: p.dam, cao: 120, min: 30, lh: 1.1 }).svg;
    if (sp.thongDiep) s += chu(80, 160, W - 160, '“' + sp.thongDiep + '”', { size: 26, nghieng: true, giua: true, mau: p.muc[0], dam: true, cao: 40, min: 16 }).svg;
    s += chu(60, 208, W - 120, '👤 ' + sp.benhNhan, { size: 23, giua: true, mau: '#6B7280' }).svg;
    const T = [[300, 425], [780, 600], [300, 775], [780, 950], [300, 1125]], R = 172;
    for (let k = 0; k < 9; k++) { const r = ngauNhien(k + 5); s += hongCau(80 + r() * 920, 300 + r() * 980, 10 + r() * 10, r() * 180); }
    T.forEach(([x, y], i) => {
      s += `<g filter="url(#${fb})">` + circle(x, y, R, `url(#${gs[i]})`) + '</g>';
      s += circle(x, y, R - 14, 'none', 'stroke="#fff" stroke-opacity="0.35" stroke-width="3"');
      s += `<ellipse cx="${x - 70}" cy="${y - 100}" rx="46" ry="18" fill="#fff" opacity="0.25" transform="rotate(-30 ${x - 70} ${y - 100})"/>`;
      s += icon(x, y - 118, 36, MUC[i].bieuTuong);
      s += chu(x - 130, y - 92, 260, nhan(sp, i).toUpperCase(), { size: 19, dam: true, giua: true, mau: '#fff', cao: 48, min: 13 }).svg;
      s += chu(x - 138, y - 40, 276, sp.noiDung[i], { size: 21, giua: true, mau: '#fff', cao: 175, min: 13, lh: 1.22 }).svg;
      const nx = W / 2;
      s += `<text x="${nx}" y="${y + 30}" font-family="Arial" font-size="110" font-weight="bold" fill="${p.muc[i]}" opacity="0.15" text-anchor="middle">${so2(i)}</text>`;
    });
    return s + chanTrang(sp, W, H + 30, p, '#6B7280');
  }

  // ====================== INFOGRAPHIC: CƠ THỂ NGƯỜI ======================
  function infoCoThe(sp, p, W, H) {
    const fb = id('b');
    let s = `<defs>${bong(fb)}</defs>` + rect(0, 0, W, H, p.nen);
    s += chu(60, 40, W - 120, sp.tieuDe || sp.benh, { size: 54, dam: true, giua: true, mau: p.dam, cao: 120, min: 30, lh: 1.1 }).svg;
    s += chu(60, 170, W - 120, '👤 ' + sp.benhNhan + '  ·  🩺 ' + sp.benh, { size: 24, giua: true, mau: '#4B5563' }).svg;
    // hình người
    const da = '#FBE3D6', vien = '#E8B9A3', cx = 540;
    s += `<g stroke-linecap="round" stroke-linejoin="round">`;
    s += `<path d="M${cx - 95} 450 L ${cx - 140} 720" stroke="${vien}" stroke-width="58" fill="none"/><path d="M${cx + 95} 450 L ${cx + 140} 720" stroke="${vien}" stroke-width="58" fill="none"/>`;
    s += `<path d="M${cx - 52} 770 L ${cx - 70} 1010" stroke="${vien}" stroke-width="70" fill="none"/><path d="M${cx + 52} 770 L ${cx + 70} 1010" stroke="${vien}" stroke-width="70" fill="none"/>`;
    s += `<path d="M${cx - 95} 450 L ${cx - 140} 720" stroke="${da}" stroke-width="48" fill="none"/><path d="M${cx + 95} 450 L ${cx + 140} 720" stroke="${da}" stroke-width="48" fill="none"/>`;
    s += `<path d="M${cx - 52} 770 L ${cx - 70} 1010" stroke="${da}" stroke-width="60" fill="none"/><path d="M${cx + 52} 770 L ${cx + 70} 1010" stroke="${da}" stroke-width="60" fill="none"/>`;
    s += `<rect x="${cx - 120}" y="410" width="240" height="390" rx="90" fill="${da}" stroke="${vien}" stroke-width="5"/>`;
    s += `<rect x="${cx - 26}" y="370" width="52" height="60" fill="${da}"/>` + circle(cx, 315, 72, da, `stroke="${vien}" stroke-width="5"`);
    s += `</g>`;
    // mạch máu đỏ – xanh
    s += `<path d="M${cx + 20} 520 C ${cx + 60} 470, ${cx + 90} 470, ${cx + 120} 560 L ${cx + 140} 710 M${cx + 20} 520 L ${cx + 45} 1000 M${cx + 20} 520 C ${cx + 10} 430, ${cx + 10} 390, ${cx + 15} 300" fill="none" stroke="#E63946" stroke-width="8" stroke-linecap="round"/>`;
    s += `<path d="M${cx - 20} 530 C ${cx - 60} 470, ${cx - 90} 470, ${cx - 120} 560 L ${cx - 140} 710 M${cx - 20} 530 L ${cx - 45} 1000 M${cx - 20} 530 C ${cx - 10} 430, ${cx - 10} 390, ${cx - 15} 300" fill="none" stroke="#3B82F6" stroke-width="8" stroke-linecap="round"/>`;
    s += traiTim(cx + 18, 520, 64, '#E63946', `stroke="#fff" stroke-width="3"`);
    // chú thích trỏ vào bộ phận: [hộp], điểm trên cơ thể
    const O = [{ b: [40, 250, 330, 300], d: [cx - 20, 345] }, { b: [710, 250, 330, 300], d: [cx + 45, 290] },
      { b: [710, 600, 330, 300], d: [cx + 40, 520] }, { b: [40, 600, 330, 300], d: [cx - 68, 900], a: [370, 860] },
      { b: [60, 1050, 960, 170], d: [cx - 45, 990], a: [cx - 45, 1050] }];
    const diaChi = ['miệng – ăn uống', 'đầu – cảm nhận', 'tim – mạch máu', 'chân – vận động', 'máu – mạch máu'];
    O.forEach((o, i) => {
      const [x, y, w, h] = o.b, c = p.muc[i];
      const ax = o.a ? o.a[0] : (x < cx ? x + w : x), ay = o.a ? o.a[1] : y + 60;
      s += line(ax, ay, o.d[0], o.d[1], c, 4) + circle(o.d[0], o.d[1], 12, c, 'stroke="#fff" stroke-width="4"');
      s += theTrang(fb, x, y, w, h, 22, `stroke="${c}" stroke-width="3"`);
      s += circle(x + 38, y + 40, 24, c) + icon(x + 38, y + 42, 26, MUC[i].bieuTuong);
      s += chu(x + 72, y + 20, w - 90, nhan(sp, i), { size: 23, dam: true, mau: c, cao: 36, min: 14 }).svg;
      s += chu(x + 72, y + 50, w - 90, diaChi[i], { size: 16, nghieng: true, mau: '#9CA3AF' }).svg;
      s += chu(x + 22, y + 84, w - 44, sp.noiDung[i], { size: i === 4 ? 24 : 22, cao: h - 98, min: 14, lh: 1.25 }).svg;
    });
    if (sp.thongDiep) s += rect(160, 1240, W - 320, 56, p.dam, 28) + chu(190, 1240, W - 380, sp.thongDiep, { size: 24, dam: true, nghieng: true, giua: true, giuaDoc: true, cao: 56, mau: '#fff', min: 15 }).svg;
    return s + chanTrang(sp, W, H + 46, p, '#6B7280');
  }
  const line = (x1, y1, x2, y2, c, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

  // ====================== SƠ ĐỒ TƯ DUY: VẼ TAY (SKETCHNOTE) ======================
  function mindVeTay(sp, p, W, H) {
    const TAY = "'Comic Sans MS','Segoe Print','Chalkboard SE',cursive";
    let s = rect(0, 0, W, H, '#FFFEF9');
    for (let y = 40; y < H; y += 40) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#EEF2F7" stroke-width="1.5"/>`;
    const C = [800, 560];
    const O = [{ b: [40, 120, 440, 270] }, { b: [580, 70, 440, 230] }, { b: [1120, 120, 440, 270] }, { b: [1120, 600, 440, 270] }, { b: [40, 600, 440, 270] }];
    // mũi tên vẽ tay
    O.forEach((o, i) => {
      const [x, y, w, h] = o.b, c = p.muc[i];
      const ex = i === 1 ? x + w / 2 : (x < C[0] ? x + w + 12 : x - 12), ey = i === 1 ? y + h + 12 : y + h / 2;
      const r = ngauNhien(i + 3), kx = (C[0] + ex) / 2 + (r() - 0.5) * 120, ky = (C[1] + ey) / 2 + (r() - 0.5) * 80;
      const sx = C[0] + (ex - C[0]) * 0.28, sy = C[1] + (ey - C[1]) * 0.28;
      s += `<path d="M${sx} ${sy} Q ${kx} ${ky} ${ex} ${ey}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
      const a = Math.atan2(ey - ky, ex - kx), l = 22;
      s += `<path d="M${ex - l * Math.cos(a - 0.45)} ${ey - l * Math.sin(a - 0.45)} L${ex} ${ey} L${ex - l * Math.cos(a + 0.45)} ${ey - l * Math.sin(a + 0.45)}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    // đám mây trung tâm
    let may = ''; const rM = ngauNhien(11);
    for (let k = 0; k < 10; k++) { const a = Math.PI * 2 * k / 10, rx = 175, ry = 120; may += circle(C[0] + rx * Math.cos(a), C[1] + ry * Math.sin(a), 62 + rM() * 18, '#fff', `stroke="${p.dam}" stroke-width="4"`); }
    s += may + `<ellipse cx="${C[0]}" cy="${C[1]}" rx="200" ry="140" fill="#fff"/>`;
    s += `<rect x="${C[0] - 170}" y="${C[1] - 36}" width="340" height="56" fill="#FDE047" opacity="0.55" transform="rotate(-2 ${C[0]} ${C[1]})"/>`;
    s += `<text x="${C[0]}" y="${C[1] + 6}" font-family="${TAY}" font-size="42" font-weight="bold" fill="${p.dam}" text-anchor="middle">${esc(sp.benh)}</text>`;
    s += `<text x="${C[0]}" y="${C[1] + 60}" font-family="${TAY}" font-size="22" fill="#4B5563" text-anchor="middle">${esc(sp.benhNhan)}</text>`;
    s += traiTim(C[0], C[1] - 80, 46, p.muc[0]);
    // hộp nội dung vẽ tay
    O.forEach((o, i) => {
      const [x, y, w, h] = o.b, c = p.muc[i];
      s += khungTay(x, y, w, h, c, '#fff', 17 + i * 7);
      s += `<rect x="${x + 18}" y="${y + 22}" width="${Math.min(w - 40, 40 + nhan(sp, i).length * 14)}" height="30" fill="${c}" opacity="0.2" transform="rotate(-1.5 ${x} ${y})"/>`;
      s += `<text x="${x + 24}" y="${y + 46}" font-family="${TAY}" font-size="25" font-weight="bold" fill="${c}">${MUC[i].bieuTuong} ${esc(nhan(sp, i))}</text>`;
      s += chu(x + 22, y + 70, w - 44, sp.noiDung[i], { size: 23, cao: h - 84, min: 14, lh: 1.27 }).svg;
    });
    // tiêu đề + thông điệp vẽ tay
    s += khungTay(540, 800, 520, 140, p.dam, '#FFF7D6', 77, 3);
    s += chu(560, 812, 480, sp.tieuDe || sp.benh, { size: 28, dam: true, giua: true, mau: p.dam, cao: 40, min: 16 }).svg;
    if (sp.thongDiep) s += chu(560, 858, 480, sp.thongDiep, { size: 22, nghieng: true, giua: true, cao: 70, mau: '#374151', min: 14 }).svg;
    [[530, 450, '★', p.muc[1]], [1075, 470, '✿', p.muc[3]], [520, 760, '♥', p.muc[0]], [1080, 770, '★', p.muc[2]]].forEach(([x, y, k, c]) => { s += `<text x="${x}" y="${y}" font-size="34" fill="${c}" text-anchor="middle">${k}</text>`; });
    return s + chanTrang(sp, W, H + 34, p, '#9CA3AF');
  }

  // ====================== SƠ ĐỒ TƯ DUY: TỔ ONG LỤC GIÁC ======================
  function mindToOng(sp, p, W, H) {
    const fb = id('b');
    let s = `<defs>${bong(fb)}</defs>` + rect(0, 0, W, H, '#FBF6EC');
    [[90, 860, 70], [180, 760, 40], [1510, 140, 80], [1420, 250, 44], [1500, 860, 56]].forEach(([x, y, r], k) => { s += luGiac(x, y, r, p.muc[k % 5], 'opacity="0.12"'); });
    const R = 168, D = 306, C = [800, 500];
    const vt = [[-60, 'TL'], [-120, 'TR']];
    const P = [[C[0] - D / 2, C[1] - D * 0.866], [C[0] + D / 2, C[1] - D * 0.866], [C[0] + D, C[1]], [C[0] + D / 2, C[1] + D * 0.866], [C[0] - D / 2, C[1] + D * 0.866], [C[0] - D, C[1]]];
    // tâm
    s += `<g filter="url(#${fb})">` + luGiac(C[0], C[1], R, p.dam) + '</g>' + luGiac(C[0], C[1], R - 14, 'none', `stroke="#fff" stroke-opacity="0.35" stroke-width="3"`);
    s += traiTim(C[0], C[1] - 82, 52, '#FF6B7A');
    s += chu(C[0] - 120, C[1] - 40, 240, sp.benh, { size: 36, dam: true, giua: true, giuaDoc: true, cao: 96, mau: '#fff', min: 18, lh: 1.1 }).svg;
    s += chu(C[0] - 120, C[1] + 66, 240, sp.benhNhan, { size: 19, giua: true, mau: p.nhat }).svg;
    for (let i = 0; i < 5; i++) {
      const [x, y] = P[i], c = p.muc[i];
      s += `<g filter="url(#${fb})">` + luGiac(x, y, R, '#FFFDF8', `stroke="${c}" stroke-width="7"`) + '</g>';
      s += circle(x, y - 112, 26, c) + icon(x, y - 110, 28, MUC[i].bieuTuong);
      s += chu(x - 120, y - 78, 240, nhan(sp, i), { size: 20, dam: true, giua: true, mau: c, cao: 30, min: 13 }).svg;
      s += chu(x - 122, y - 44, 244, sp.noiDung[i], { size: 19, giua: true, cao: 160, min: 12, lh: 1.22 }).svg;
    }
    // ô thứ 6: thông điệp
    const [x6, y6] = P[5];
    s += luGiac(x6, y6, R, p.muc[0], 'opacity="0.9"') + `<text x="${x6}" y="${y6 - 70}" font-size="40" text-anchor="middle">💬</text>`;
    s += chu(x6 - 115, y6 - 45, 230, sp.thongDiep || 'Thông điệp của nhóm', { size: 23, dam: true, nghieng: true, giua: true, giuaDoc: true, cao: 140, mau: '#fff', min: 14 }).svg;
    s += chu(40, 36, 400, sp.tieuDe || sp.benh, { size: 34, dam: true, mau: p.dam, cao: 130, min: 20, lh: 1.15 }).svg;
    return s + chanTrang(sp, W, H + 34, p, '#9CA3AF');
  }

  // ====================== SƠ ĐỒ TƯ DUY: DÒNG MÁU NGANG ======================
  function mindMachNgang(sp, p, W, H) {
    const fb = id('b'), gm = id('m');
    let s = `<defs>${bong(fb)}<linearGradient id="${gm}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F26B78"/><stop offset="0.5" stop-color="#E63946"/><stop offset="1" stop-color="#A3162A"/></linearGradient></defs>`;
    s += rect(0, 0, W, H, '#F7FAFC');
    const Y = 505;
    s += `<path d="M150 ${Y} C 500 ${Y - 30}, 1000 ${Y + 30}, 1540 ${Y}" fill="none" stroke="#7A1E2B" stroke-opacity="0.15" stroke-width="86" stroke-linecap="round"/>`;
    s += `<path d="M150 ${Y} C 500 ${Y - 30}, 1000 ${Y + 30}, 1540 ${Y}" fill="none" stroke="url(#${gm})" stroke-width="66" stroke-linecap="round"/>`;
    s += `<path d="M150 ${Y - 12} C 500 ${Y - 42}, 1000 ${Y + 18}, 1540 ${Y - 12}" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="8" stroke-dasharray="50 30"/>`;
    for (let k = 0; k < 11; k++) s += hongCau(250 + k * 125, Y + ((k % 2) ? 8 : -6) + Math.sin(k) * 4, 17, k * 33);
    s += `<g filter="url(#${fb})">` + traiTim(130, Y + 10, 210, '#E63946') + '</g>';
    s += chu(40, Y - 40, 180, sp.benh, { size: 26, dam: true, giua: true, giuaDoc: true, cao: 80, mau: '#fff', min: 14, lh: 1.05 }).svg;
    s += `<path d="M1540 ${Y - 60} L1590 ${Y} L1540 ${Y + 60}" fill="#A3162A"/>`;
    const O = [[260, 70, 400, 300, 1], [470, 640, 400, 300, 0], [700, 70, 400, 300, 1], [910, 640, 400, 300, 0], [1140, 70, 420, 300, 1]];
    O.forEach(([x, y, w, h, tren], i) => {
      const c = p.muc[i], bx = x + w / 2, by = tren ? y + h : y, vy = Y + (tren ? -36 : 36);
      s += `<path d="M${bx} ${vy} C ${bx - 30} ${(vy + by) / 2}, ${bx + 30} ${(vy + by) / 2}, ${bx} ${by}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`;
      s += circle(bx, vy, 14, c, 'stroke="#fff" stroke-width="4"');
      s += theTrang(fb, x, y, w, h, 26, `stroke="${c}" stroke-width="4"`);
      s += rect(x + 20, y + 18, 56, 56, c, 16) + icon(x + 48, y + 48, 32, MUC[i].bieuTuong);
      s += chu(x + 90, y + 16, w - 110, nhan(sp, i), { size: 25, dam: true, mau: c, cao: 34, min: 15 }).svg;
      s += chu(x + 90, y + 48, w - 110, 'Trạm ' + (i + 1), { size: 16, mau: '#9CA3AF' }).svg;
      s += chu(x + 22, y + 90, w - 44, sp.noiDung[i], { size: 23, cao: h - 104, min: 14, lh: 1.25 }).svg;
    });
    s += chu(40, 668, 400, sp.tieuDe || '', { size: 30, dam: true, mau: p.dam, cao: 120, min: 18, lh: 1.15 }).svg;
    s += chu(40, 790, 400, '👤 ' + sp.benhNhan, { size: 20, mau: '#4B5563' }).svg;
    if (sp.thongDiep) s += chu(40, 830, 400, '“' + sp.thongDiep + '”', { size: 22, nghieng: true, dam: true, mau: p.muc[0], cao: 120, min: 14 }).svg;
    return s + chanTrang(sp, W, H + 34, p, '#9CA3AF');
  }

  // ====================== SƠ ĐỒ TƯ DUY: VŨ TRỤ TIM MẠCH ======================
  function mindVuTru(sp, p, W, H) {
    const fb = id('b'), gs = id('s');
    let s = `<defs>${bong(fb)}<radialGradient id="${gs}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FF6B7A" stop-opacity="0.9"/><stop offset="0.5" stop-color="#E63946" stop-opacity="0.35"/><stop offset="1" stop-color="#E63946" stop-opacity="0"/></radialGradient></defs>`;
    s += rect(0, 0, W, H, '#0F172A');
    const r = ngauNhien(42); for (let k = 0; k < 120; k++) s += circle((r() * W).toFixed(0), (r() * H).toFixed(0), (r() * 1.8 + 0.4).toFixed(1), '#fff', `opacity="${(r() * 0.7 + 0.2).toFixed(2)}"`);
    const C = [800, 480];
    s += `<ellipse cx="${C[0]}" cy="${C[1]}" rx="330" ry="230" fill="none" stroke="#94A3B8" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="6 10"/>`;
    s += `<ellipse cx="${C[0]}" cy="${C[1]}" rx="200" ry="140" fill="none" stroke="#94A3B8" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="4 8"/>`;
    s += circle(C[0], C[1], 190, `url(#${gs})`) + traiTim(C[0], C[1] + 6, 220, '#E63946', 'stroke="#FFB4BC" stroke-width="4"');
    s += chu(C[0] - 100, C[1] - 52, 200, sp.benh, { size: 30, dam: true, giua: true, giuaDoc: true, cao: 90, mau: '#fff', min: 16, lh: 1.1 }).svg;
    s += chu(C[0] - 90, C[1] + 42, 180, sp.benhNhan, { size: 17, giua: true, mau: '#FFE4E6' }).svg;
    const goc = [205, -25, 25, 155, 90].map(g => g * Math.PI / 180);
    const O = [[40, 100, 420, 260], [1140, 100, 420, 260], [1140, 600, 420, 260], [40, 600, 420, 260], [590, 760, 420, 180]];
    O.forEach(([x, y, w, h], i) => {
      const c = p.muc[i], px = C[0] + 330 * Math.cos(goc[i]), py = C[1] + 230 * Math.sin(goc[i]);
      const ax = i === 4 ? px : (x < C[0] ? x + w : x), ay = i === 4 ? y : Math.min(Math.max(py, y + 30), y + h - 30);
      s += line(px, py, ax, ay, c, 3).replace('/>', ' stroke-dasharray="3 7" opacity="0.8"/>');
      s += circle(px, py, 46, c, 'stroke="#fff" stroke-opacity="0.6" stroke-width="4"') + icon(px, py + 2, 40, MUC[i].bieuTuong);
      s += rect(x, y, w, h, '#fff', 24, 'opacity="0.96"') + rect(x, y, 10, h, c, 5);
      s += chu(x + 28, y + 18, w - 50, (i + 1) + '. ' + nhan(sp, i), { size: 25, dam: true, mau: c, cao: 34, min: 15 }).svg;
      s += chu(x + 28, y + 60, w - 50, sp.noiDung[i], { size: 23, cao: h - 72, min: 13, lh: 1.25 }).svg;
    });
    s += chu(400, 20, 800, sp.tieuDe || '', { size: 38, dam: true, giua: true, mau: '#fff', cao: 50, min: 22 }).svg;
    if (sp.thongDiep) s += chu(400, 68, 800, '“' + sp.thongDiep + '”', { size: 22, nghieng: true, giua: true, mau: '#FDE68A', cao: 32, min: 14 }).svg;
    return s + chanTrang(sp, W, H + 34, p, '#94A3B8');
  }

  // Thay toàn bộ infographic và sơ đồ tư duy bằng 10 mẫu mới
  BO.info.length = 0; BO.info.push(infoDongMau, infoCanva, infoQuaTim, infoHongCau, infoCoThe);
  BO.mind.length = 0; BO.mind.push(mindBuzan, mindVeTay, mindToOng, mindMachNgang, mindVuTru);
  LOAI_SAN_PHAM.info.mau = ['Hành trình dòng máu', 'Bản tin sức khoẻ', 'Quả tim trung tâm', 'Bong bóng hồng cầu', 'Cơ thể người'];
  LOAI_SAN_PHAM.mind.mau = ['Nhánh cong', 'Vẽ tay', 'Tổ ong', 'Dòng máu ngang', 'Vũ trụ tim mạch'];
})();
