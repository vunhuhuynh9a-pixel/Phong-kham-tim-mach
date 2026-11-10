/* =====================================================================
   15 MẪU SẢN PHẨM: 5 infographic, 5 sơ đồ tư duy, 5 phiếu trình bày.
   veSanPham(sp) trả về một chuỗi SVG. Dùng chung cho trang học sinh và giáo viên.
   sp = { loai:'info'|'mind'|'phieu', mau:0..4, bangMau:0..3, tieuDe, thongDiep,
          nhom, lop, benh, benhNhan, noiDung:[5 chuỗi] }
   ===================================================================== */
(function () {
  const LOAI = {
    info: { ten: 'Infographic', w: 1080, h: 1350, mau: ['Dòng thời gian', 'Lưới thẻ màu', 'Trái tim trung tâm', 'Bậc thang', 'Tổ ong'] },
    mind: { ten: 'Sơ đồ tư duy', w: 1600, h: 1000, mau: ['Toả tròn', 'Cây ngang', 'Xương cá', 'Bong bóng', 'Cây dọc'] },
    phieu: { ten: 'Phiếu trình bày', w: 1080, h: 1350, mau: ['Bệnh án', 'Kẹp hồ sơ', 'Bảng kẻ', 'Trang vở', 'Đơn thuốc'] }
  };
  const BANG_MAU = [
    { ten: 'Đỏ – hồng', nen: '#FFF5F5', muc: ['#E63946', '#F4A261', '#E76F51', '#2A9D8F', '#264653'], dam: '#7A1E2B', nhat: '#FFE3E3' },
    { ten: 'Xanh biển', nen: '#F2F8FF', muc: ['#1D4ED8', '#0EA5E9', '#7C3AED', '#059669', '#F59E0B'], dam: '#0B2A5B', nhat: '#DCEBFF' },
    { ten: 'Xanh lá', nen: '#F3FBF4', muc: ['#15803D', '#65A30D', '#CA8A04', '#0F766E', '#B45309'], dam: '#123B22', nhat: '#DDF3E1' },
    { ten: 'Tím – cam', nen: '#FBF7FF', muc: ['#7C3AED', '#DB2777', '#EA580C', '#0891B2', '#4338CA'], dam: '#3B1366', nhat: '#EEE3FF' }
  ];
  const FONT = "Arial, 'Segoe UI', Helvetica, sans-serif";

  // ---------- đo và xuống dòng ----------
  let ctx = null;
  function doRong(text, size, dam) {
    try {
      if (!ctx) ctx = document.createElement('canvas').getContext('2d');
      ctx.font = (dam ? 'bold ' : '') + size + 'px ' + FONT;
      return ctx.measureText(text).width;
    } catch (e) { return text.length * size * 0.52; }
  }
  function xuongDong(text, rong, size, dam) {
    const tu = String(text || '').split(/\s+/).filter(Boolean), dong = [];
    let cur = '';
    tu.forEach(t => {
      const thu = cur ? cur + ' ' + t : t;
      if (doRong(thu, size, dam) <= rong || !cur) cur = thu; else { dong.push(cur); cur = t; }
    });
    if (cur) dong.push(cur);
    return dong;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  // Khối chữ tự co cỡ để vừa khung (rong x cao). Trả về {svg, h}
  function chu(x, y, rong, text, o) {
    o = o || {};
    let size = o.size || 28;
    const min = o.min || 16, cao = o.cao || 9999, lh = o.lh || 1.25, dam = !!o.dam;
    let dong = xuongDong(text, rong, size, dam);
    while (size > min && dong.length * size * lh > cao) { size -= 1; dong = xuongDong(text, rong, size, dam); }
    const anchor = o.giua ? 'middle' : (o.phai ? 'end' : 'start');
    const tx = o.giua ? x + rong / 2 : (o.phai ? x + rong : x);
    let y0 = y + size * 0.9;
    if (o.giuaDoc) y0 = y + (cao - dong.length * size * lh) / 2 + size * 0.9;
    const t = dong.map((d, i) => `<tspan x="${tx}" y="${(y0 + i * size * lh).toFixed(1)}">${esc(d)}</tspan>`).join('');
    return {
      svg: `<text font-family="${FONT}" font-size="${size}" ${dam ? 'font-weight="bold"' : ''} fill="${o.mau || '#1f2937'}" text-anchor="${anchor}" ${o.nghieng ? 'font-style="italic"' : ''}>${t}</text>`,
      h: dong.length * size * lh
    };
  }
  const rect = (x, y, w, h, fill, r, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r || 0}" fill="${fill}" ${extra || ''}/>`;
  const circle = (cx, cy, r, fill, extra) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra || ''}/>`;
  const line = (x1, y1, x2, y2, c, w, extra) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w || 3}" ${extra || ''}/>`;
  const icon = (x, y, s, ch) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="central">${ch}</text>`;

  function nhan(sp, i) { return MUC[i].ten; }
  function chanTrang(sp, W, H, p, mau) {
    return chu(40, H - 62, W - 80, `Nhóm ${sp.nhom}${sp.lop ? ' · Lớp ' + sp.lop : ''} · ${CAU_HINH.mon} · ${CAU_HINH.bai.split('—')[0].trim()}`, { size: 20, giua: true, mau: mau || p.dam }).svg;
  }
  function tieuDe(sp, W, p, y, o) {
    o = o || {};
    const a = chu(60, y, W - 120, sp.tieuDe || ('Hồ sơ: ' + sp.benh), { size: o.size || 60, dam: true, giua: true, mau: o.mau || p.dam, cao: o.cao || 150, min: 34 });
    return a;
  }
  function thongDiep(sp, x, y, w, h, p, o) {
    o = o || {};
    if (!sp.thongDiep) return '';
    return rect(x, y, w, h, o.nen || p.dam, o.r == null ? 24 : o.r) +
      chu(x + 30, y, w - 60, '“' + sp.thongDiep + '”', { size: o.size || 30, dam: true, giua: true, giuaDoc: true, cao: h, mau: o.mau || '#fff', min: 18, nghieng: true }).svg;
  }

  // ====================== INFOGRAPHIC 1080 x 1350 ======================
  const INFO = [
    // 0. Dòng thời gian dọc
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen) + rect(0, 0, W, 230, p.dam);
      s += chu(60, 40, W - 120, sp.tieuDe || sp.benh.toUpperCase(), { size: 64, dam: true, giua: true, mau: '#fff', cao: 120, min: 36 }).svg;
      s += chu(60, 168, W - 120, sp.benhNhan + ' · ' + sp.benh, { size: 28, giua: true, mau: p.nhat }).svg;
      const x0 = 150, y0 = 290, buoc = 168;
      s += line(x0, y0, x0, y0 + buoc * 4, p.dam, 8, 'stroke-linecap="round"');
      for (let i = 0; i < 5; i++) {
        const y = y0 + i * buoc, c = p.muc[i];
        s += circle(x0, y, 52, c) + icon(x0, y + 2, 46, MUC[i].bieuTuong);
        s += rect(230, y - 66, 790, 136, '#fff', 22, `stroke="${c}" stroke-width="4"`);
        s += chu(260, y - 56, 730, nhan(sp, i).toUpperCase(), { size: 24, dam: true, mau: c }).svg;
        s += chu(260, y - 20, 730, sp.noiDung[i], { size: 30, cao: 82, min: 18 }).svg;
      }
      s += thongDiep(sp, 60, 1130, W - 120, 120, p);
      return s + chanTrang(sp, W, H, p);
    },
    // 1. Lưới thẻ màu
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, '#fff');
      s += tieuDe(sp, W, p, 50).svg;
      s += chu(60, 200, W - 120, sp.benhNhan + ' · ' + sp.benh, { size: 28, giua: true, mau: p.muc[0], dam: true }).svg;
      const o = [[60, 270, 470, 330], [550, 270, 470, 330], [60, 620, 470, 330], [550, 620, 470, 330], [60, 970, 960, 200]];
      o.forEach((b, i) => {
        const [x, y, w, h] = b, c = p.muc[i];
        s += rect(x, y, w, h, c, 30);
        s += icon(x + 60, y + 62, 54, MUC[i].bieuTuong);
        s += chu(x + 110, y + 40, w - 140, nhan(sp, i), { size: 30, dam: true, mau: '#fff', cao: 60, min: 20 }).svg;
        s += chu(x + 34, y + 120, w - 68, sp.noiDung[i], { size: 34, mau: '#fff', cao: h - 140, min: 18 }).svg;
      });
      s += sp.thongDiep ? chu(60, 1190, W - 120, '“' + sp.thongDiep + '”', { size: 32, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 80, min: 18 }).svg : '';
      return s + chanTrang(sp, W, H, p);
    },
    // 2. Trái tim trung tâm với 5 chú thích
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen);
      s += tieuDe(sp, W, p, 40).svg;
      const cx = 540, cy = 640;
      s += `<path d="M${cx} ${cy + 150} C ${cx - 260} ${cy - 20}, ${cx - 160} ${cy - 220}, ${cx} ${cy - 110} C ${cx + 160} ${cy - 220}, ${cx + 260} ${cy - 20}, ${cx} ${cy + 150} Z" fill="${p.muc[0]}" opacity="0.92"/>`;
      s += chu(cx - 120, cy - 80, 240, sp.benh, { size: 40, dam: true, giua: true, mau: '#fff', cao: 120, giuaDoc: true, min: 22 }).svg;
      const pos = [[40, 230, 400, 'r'], [640, 230, 400, 'l'], [40, 770, 400, 'r'], [640, 770, 400, 'l'], [240, 1010, 600, 't']];
      const diem = [[cx - 150, cy - 90], [cx + 150, cy - 90], [cx - 150, cy + 50], [cx + 150, cy + 50], [cx, cy + 150]];
      pos.forEach((b, i) => {
        const [x, y, w, k] = b, c = p.muc[i], h = 200;
        const ax = k === 'r' ? x + w : (k === 'l' ? x : x + w / 2), ay = k === 't' ? y : y + h / 2;
        s += line(ax, ay, diem[i][0], diem[i][1], c, 4, 'stroke-dasharray="10 8"') + circle(diem[i][0], diem[i][1], 10, c);
        s += rect(x, y, w, h, '#fff', 24, `stroke="${c}" stroke-width="5"`);
        s += icon(x + 46, y + 44, 40, MUC[i].bieuTuong);
        s += chu(x + 80, y + 24, w - 100, nhan(sp, i), { size: 24, dam: true, mau: c, cao: 50, min: 16 }).svg;
        s += chu(x + 26, y + 84, w - 52, sp.noiDung[i], { size: 28, cao: 106, min: 16 }).svg;
      });
      s += thongDiep(sp, 60, 1230, W - 120, 56, p, { size: 24, r: 28 });
      return s + chanTrang(sp, W, H + 10, p);
    },
    // 3. Bậc thang chéo
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, '#fff') + `<path d="M0 0 H${W} V260 L0 330 Z" fill="${p.dam}"/>`;
      s += chu(60, 50, W - 120, sp.tieuDe || sp.benh, { size: 62, dam: true, mau: '#fff', cao: 130, min: 34 }).svg;
      s += chu(60, 200, W - 120, sp.benhNhan, { size: 30, mau: p.nhat }).svg;
      for (let i = 0; i < 5; i++) {
        const x = 60 + i * 60, y = 370 + i * 160, w = W - 120 - i * 60, c = p.muc[i];
        s += rect(x, y, w, 140, c, 18);
        s += `<text x="${x + 40}" y="${y + 92}" font-family="${FONT}" font-size="72" font-weight="bold" fill="#fff" opacity="0.35">${i + 1}</text>`;
        s += icon(x + 130, y + 70, 44, MUC[i].bieuTuong);
        s += chu(x + 180, y + 18, w - 210, nhan(sp, i).toUpperCase(), { size: 22, dam: true, mau: '#fff' }).svg;
        s += chu(x + 180, y + 50, w - 210, sp.noiDung[i], { size: 30, mau: '#fff', cao: 82, min: 17 }).svg;
      }
      s += thongDiep(sp, 60, 1190, W - 120, 80, p, { nen: p.nhat, mau: p.dam, size: 28 });
      return s + chanTrang(sp, W, H, p);
    },
    // 4. Tổ ong
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen);
      s += tieuDe(sp, W, p, 40).svg + chu(60, 190, W - 120, sp.benhNhan, { size: 28, giua: true, mau: p.muc[1], dam: true }).svg;
      const hex = (cx, cy, r, f) => { let d = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; d += (k ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); } return `<path d="${d}Z" fill="${f}"/>`; };
      const tam = [[300, 430], [780, 430], [540, 680], [300, 930], [780, 930]];
      s += hex(540, 680, 200, p.dam);
      tam.forEach((t, i) => {
        if (i === 2) return;
        s += hex(t[0], t[1], 205, p.muc[i]);
        s += icon(t[0], t[1] - 120, 46, MUC[i].bieuTuong);
        s += chu(t[0] - 150, t[1] - 84, 300, nhan(sp, i), { size: 24, dam: true, giua: true, mau: '#fff', cao: 56, min: 16 }).svg;
        s += chu(t[0] - 150, t[1] - 22, 300, sp.noiDung[i], { size: 27, giua: true, mau: '#fff', cao: 150, min: 15 }).svg;
      });
      s += icon(540, 560, 46, MUC[2].bieuTuong);
      s += chu(400, 596, 280, nhan(sp, 2), { size: 24, dam: true, giua: true, mau: p.nhat }).svg;
      s += chu(395, 640, 290, sp.noiDung[2], { size: 27, giua: true, mau: '#fff', cao: 140, min: 15 }).svg;
      s += thongDiep(sp, 60, 1170, W - 120, 90, p, { nen: p.muc[2], size: 28 });
      return s + chanTrang(sp, W, H, p);
    }
  ];

  // ====================== SƠ ĐỒ TƯ DUY 1600 x 1000 ======================
  const MIND = [
    // 0. Toả tròn
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen);
      const cx = 800, cy = 500;
      const vt = [[800, 130], [1290, 320], [1150, 740], [450, 740], [310, 320]];
      vt.forEach((v, i) => {
        const c = p.muc[i], mx = (cx + v[0]) / 2 + (i % 2 ? 60 : -60), my = (cy + v[1]) / 2;
        s += `<path d="M${cx} ${cy} Q ${mx} ${my} ${v[0]} ${v[1]}" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
      });
      s += circle(cx, cy, 150, p.dam) + chu(cx - 125, cy - 120, 250, sp.tieuDe || sp.benh, { size: 40, dam: true, giua: true, giuaDoc: true, cao: 240, mau: '#fff', min: 20 }).svg;
      vt.forEach((v, i) => {
        const c = p.muc[i], w = 360, h = 190, x = Math.min(W - w - 20, Math.max(20, v[0] - w / 2)), y = Math.min(H - h - 130, Math.max(20, v[1] - h / 2));
        s += rect(x, y, w, h, '#fff', 30, `stroke="${c}" stroke-width="6"`);
        s += rect(x, y, w, 56, c, 30) + rect(x, y + 28, w, 28, c);
        s += chu(x + 20, y + 8, w - 40, MUC[i].bieuTuong + ' ' + nhan(sp, i), { size: 24, dam: true, mau: '#fff', cao: 44, min: 15, giua: true }).svg;
        s += chu(x + 20, y + 68, w - 40, sp.noiDung[i], { size: 27, cao: 112, min: 15, giua: true }).svg;
      });
      if (sp.thongDiep) s += chu(40, H - 118, W - 80, '“' + sp.thongDiep + '”', { size: 28, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 44, min: 16 }).svg;
      return s + chanTrang(sp, W, H + 20, p);
    },
    // 1. Cây ngang
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, '#fff');
      s += rect(40, 330, 420, 300, p.dam, 30) + chu(70, 340, 360, sp.tieuDe || sp.benh, { size: 46, dam: true, giua: true, giuaDoc: true, cao: 200, mau: '#fff', min: 22 }).svg;
      s += chu(70, 545, 360, sp.benhNhan, { size: 24, giua: true, mau: p.nhat }).svg;
      for (let i = 0; i < 5; i++) {
        const y = 60 + i * 175, c = p.muc[i];
        s += `<path d="M460 480 C 560 480, 540 ${y + 75}, 640 ${y + 75}" stroke="${c}" stroke-width="8" fill="none"/>`;
        s += circle(660, y + 75, 46, c) + icon(660, y + 77, 40, MUC[i].bieuTuong);
        s += rect(720, y + 10, 840, 130, p.nhat, 20);
        s += chu(745, y + 20, 790, nhan(sp, i), { size: 24, dam: true, mau: c }).svg;
        s += chu(745, y + 55, 790, sp.noiDung[i], { size: 30, cao: 80, min: 16 }).svg;
      }
      if (sp.thongDiep) s += chu(40, 660, 420, '“' + sp.thongDiep + '”', { size: 26, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 200, min: 16 }).svg;
      return s + chanTrang(sp, W, H + 20, p);
    },
    // 2. Xương cá
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen);
      s += line(80, 500, 1240, 500, p.dam, 14, 'stroke-linecap="round"');
      s += `<path d="M1220 330 L1580 500 L1220 670 Z" fill="${p.dam}"/>`;
      s += chu(1232, 420, 200, sp.tieuDe || sp.benh, { size: 30, dam: true, giua: true, giuaDoc: true, cao: 160, mau: '#fff', min: 15 }).svg;
      const xs = [340, 730, 1120, 540, 930];
      for (let i = 0; i < 5; i++) {
        const tren = i < 3, x = xs[i], c = p.muc[i], y2 = tren ? 300 : 700;
        s += line(x, 500, x - 120, y2, c, 10, 'stroke-linecap="round"');
        const bx = x - 300, by = tren ? 50 : 700, bw = 380, bh = 250;
        s += rect(bx, by, bw, bh, '#fff', 24, `stroke="${c}" stroke-width="5"`);
        s += chu(bx + 20, by + 16, bw - 40, MUC[i].bieuTuong + ' ' + nhan(sp, i), { size: 24, dam: true, mau: c, cao: 40, min: 15 }).svg;
        s += chu(bx + 20, by + 66, bw - 40, sp.noiDung[i], { size: 28, cao: 170, min: 15 }).svg;
      }
      if (sp.thongDiep) s += chu(1180, 700, 380, '“' + sp.thongDiep + '”', { size: 26, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 200, min: 16 }).svg;
      return s + chanTrang(sp, W, H + 20, p);
    },
    // 3. Bong bóng
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, '#fff');
      const b = [[340, 260, 210], [1260, 250, 200], [1250, 730, 210], [350, 740, 200], [800, 170, 150]];
      b.forEach((v, i) => { s += line(800, 520, v[0], v[1], p.muc[i], 8); });
      s += circle(800, 520, 190, p.dam) + chu(640, 380, 320, sp.tieuDe || sp.benh, { size: 42, dam: true, giua: true, giuaDoc: true, cao: 200, mau: '#fff', min: 20 }).svg;
      s += chu(640, 590, 320, sp.benhNhan, { size: 22, giua: true, mau: p.nhat }).svg;
      b.forEach((v, i) => {
        const [x, y, r] = v, c = p.muc[i];
        s += circle(x, y, r, c, 'opacity="0.95"');
        s += icon(x, y - r * 0.58, r * 0.24, MUC[i].bieuTuong);
        s += chu(x - r * 0.78, y - r * 0.42, r * 1.56, nhan(sp, i), { size: 22, dam: true, giua: true, mau: '#fff', cao: r * 0.3, min: 13 }).svg;
        s += chu(x - r * 0.8, y - r * 0.1, r * 1.6, sp.noiDung[i], { size: 26, giua: true, mau: '#fff', cao: r * 0.85, min: 13 }).svg;
      });
      if (sp.thongDiep) s += chu(560, 760, 480, '“' + sp.thongDiep + '”', { size: 26, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 140, min: 16 }).svg;
      return s + chanTrang(sp, W, H + 20, p);
    },
    // 4. Cây dọc
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen);
      s += rect(450, 40, 700, 150, p.dam, 75) + chu(480, 50, 640, sp.tieuDe || sp.benh, { size: 46, dam: true, giua: true, giuaDoc: true, cao: 130, mau: '#fff', min: 22 }).svg;
      s += line(800, 190, 800, 260, p.dam, 8) + line(170, 260, 1430, 260, p.dam, 8);
      for (let i = 0; i < 5; i++) {
        const x = 30 + i * 310, c = p.muc[i];
        s += line(x + 140, 260, x + 140, 310, c, 8);
        s += rect(x, 310, 280, 560, '#fff', 26, `stroke="${c}" stroke-width="6"`);
        s += rect(x, 310, 280, 120, c, 26) + rect(x, 380, 280, 50, c);
        s += icon(x + 140, 350, 42, MUC[i].bieuTuong);
        s += chu(x + 15, 384, 250, nhan(sp, i), { size: 22, dam: true, giua: true, mau: '#fff', cao: 44, min: 14 }).svg;
        s += chu(x + 22, 450, 236, sp.noiDung[i], { size: 30, giua: true, cao: 400, min: 16 }).svg;
      }
      if (sp.thongDiep) s += chu(40, 890, W - 80, '“' + sp.thongDiep + '”', { size: 26, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 40, min: 16 }).svg;
      return s + chanTrang(sp, W, H + 20, p);
    }
  ];

  // ====================== PHIẾU TRÌNH BÀY 1080 x 1350 ======================
  const PHIEU_MAU = [
    // 0. Bệnh án
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, '#fff') + rect(30, 30, W - 60, H - 60, 'none', 0, `stroke="${p.dam}" stroke-width="4"`);
      s += chu(60, 60, 500, 'PHÒNG KHÁM TIM MẠCH NHÍ', { size: 24, dam: true, mau: p.dam }).svg + chu(60, 95, 500, 'Nhóm ' + sp.nhom, { size: 22, mau: p.dam }).svg;
      s += chu(560, 60, 460, 'Số hồ sơ: ' + String(sp.nhom).padStart(3, '0'), { size: 22, phai: true, mau: p.dam }).svg;
      s += chu(60, 150, W - 120, 'BỆNH ÁN', { size: 64, dam: true, giua: true, mau: p.muc[0] }).svg;
      s += chu(60, 240, W - 120, sp.tieuDe || sp.benh, { size: 34, dam: true, giua: true, mau: p.dam, cao: 90, min: 20 }).svg;
      s += chu(60, 320, W - 120, 'Bệnh nhân: ' + sp.benhNhan + ' — Chẩn đoán: ' + sp.benh, { size: 26, giua: true, mau: '#374151' }).svg;
      for (let i = 0; i < 5; i++) {
        const y = 390 + i * 150;
        s += rect(60, y, 300, 136, p.nhat) + rect(360, y, 660, 136, '#fff', 0, `stroke="${p.nhat}" stroke-width="3"`);
        s += chu(80, y + 14, 260, MUC[i].bieuTuong + ' ' + nhan(sp, i), { size: 26, dam: true, mau: p.dam, cao: 110, min: 16, giuaDoc: true }).svg;
        s += chu(385, y + 14, 615, sp.noiDung[i], { size: 30, cao: 110, min: 16, giuaDoc: true }).svg;
      }
      s += thongDiep(sp, 60, 1160, W - 120, 90, p, { nen: p.muc[0], r: 10 });
      return s + chanTrang(sp, W, H - 10, p);
    },
    // 1. Kẹp hồ sơ
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.dam) + rect(70, 110, W - 140, H - 170, '#FFFDF7', 26);
      s += rect(390, 60, 300, 110, '#9CA3AF', 20) + rect(440, 40, 200, 60, '#6B7280', 30);
      s += chu(120, 200, W - 240, sp.tieuDe || sp.benh, { size: 52, dam: true, giua: true, mau: p.dam, cao: 130, min: 28 }).svg;
      s += chu(120, 330, W - 240, sp.benhNhan, { size: 28, giua: true, mau: p.muc[1], dam: true }).svg;
      for (let i = 0; i < 5; i++) {
        const y = 400 + i * 150, c = p.muc[i];
        s += rect(130, y + 10, 46, 46, '#fff', 8, `stroke="${c}" stroke-width="5"`) + `<path d="M140 ${y + 34} l12 12 l22 -26" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
        s += chu(200, y, 760, MUC[i].bieuTuong + ' ' + nhan(sp, i), { size: 26, dam: true, mau: c }).svg;
        s += chu(200, y + 40, 760, sp.noiDung[i], { size: 30, cao: 90, min: 16 }).svg;
        s += line(130, y + 140, 950, y + 140, '#E5E7EB', 2);
      }
      s += sp.thongDiep ? chu(130, 1160, W - 260, '“' + sp.thongDiep + '”', { size: 30, dam: true, nghieng: true, giua: true, mau: p.dam, cao: 90, min: 18 }).svg : '';
      return s + chanTrang(sp, W, H + 8, p, '#fff');
    },
    // 2. Bảng kẻ
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nen);
      s += rect(60, 60, W - 120, 200, p.muc[0], 24) + chu(90, 70, W - 180, sp.tieuDe || sp.benh, { size: 54, dam: true, giua: true, giuaDoc: true, cao: 130, mau: '#fff', min: 28 }).svg;
      s += chu(90, 200, W - 180, sp.benhNhan, { size: 26, giua: true, mau: '#fff' }).svg;
      s += rect(60, 300, W - 120, 70, p.dam, 0) + chu(80, 316, 300, 'Mục', { size: 28, dam: true, mau: '#fff' }).svg + chu(400, 316, 600, 'Nội dung', { size: 28, dam: true, mau: '#fff' }).svg;
      for (let i = 0; i < 5; i++) {
        const y = 370 + i * 150;
        s += rect(60, y, W - 120, 150, i % 2 ? p.nhat : '#fff');
        s += line(380, y, 380, y + 150, p.dam, 2);
        s += chu(80, y + 10, 280, MUC[i].bieuTuong + ' ' + nhan(sp, i), { size: 26, dam: true, mau: p.muc[i], cao: 130, min: 16, giuaDoc: true }).svg;
        s += chu(405, y + 10, 600, sp.noiDung[i], { size: 30, cao: 130, min: 16, giuaDoc: true }).svg;
      }
      s += rect(60, 300, W - 120, 820, 'none', 0, `stroke="${p.dam}" stroke-width="3"`);
      s += thongDiep(sp, 60, 1150, W - 120, 100, p, { nen: p.dam });
      return s + chanTrang(sp, W, H, p);
    },
    // 3. Trang vở
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, '#FFFEF8');
      for (let y = 160; y < H - 80; y += 48) s += line(0, y, W, y, '#C7DDF3', 2);
      s += line(130, 0, 130, H, '#F4A3A3', 4);
      for (let k = 0; k < 9; k++) s += circle(55, 140 + k * 135, 16, '#E5E7EB');
      s += chu(160, 50, W - 220, sp.tieuDe || sp.benh, { size: 54, dam: true, mau: p.muc[0], cao: 100, min: 28 }).svg;
      s += chu(160, 160, W - 220, sp.benhNhan, { size: 28, nghieng: true, mau: '#374151', lh: 1.7 }).svg;
      let y = 230;
      for (let i = 0; i < 5; i++) {
        s += chu(160, y, W - 220, (i + 1) + '. ' + nhan(sp, i) + ':', { size: 28, dam: true, mau: p.muc[i], lh: 1.71 }).svg;
        const a = chu(200, y + 48, W - 270, sp.noiDung[i], { size: 28, mau: '#1f2937', lh: 1.71, cao: 96, min: 16 });
        s += a.svg; y += 48 + Math.max(96, a.h) + 32;
      }
      if (sp.thongDiep) s += `<g transform="rotate(-3 540 1200)">` + rect(200, 1150, 700, 100, '#FDE68A', 8) + chu(220, 1150, 660, sp.thongDiep, { size: 28, dam: true, giua: true, giuaDoc: true, cao: 100, mau: '#78350F', min: 16 }).svg + '</g>';
      return s + chanTrang(sp, W, H, p);
    },
    // 4. Đơn thuốc
    function (sp, p, W, H) {
      let s = rect(0, 0, W, H, p.nhat) + rect(60, 60, W - 120, H - 120, '#fff', 30);
      s += rect(60, 60, W - 120, 220, p.dam, 30) + rect(60, 240, W - 120, 40, p.dam);
      s += `<text x="110" y="215" font-family="Georgia, serif" font-size="140" font-weight="bold" fill="#fff" opacity="0.9">℞</text>`;
      s += chu(290, 90, 700, sp.tieuDe || ('Đơn phòng bệnh: ' + sp.benh), { size: 44, dam: true, mau: '#fff', cao: 120, min: 24 }).svg;
      s += chu(290, 215, 700, 'Bệnh nhân: ' + sp.benhNhan, { size: 24, mau: p.nhat }).svg;
      for (let i = 0; i < 5; i++) {
        const y = 320 + i * 160, c = p.muc[i];
        s += circle(140, y + 56, 40, c) + icon(140, y + 58, 38, MUC[i].bieuTuong);
        s += chu(210, y + 4, 770, nhan(sp, i), { size: 26, dam: true, mau: c }).svg;
        s += chu(210, y + 42, 770, sp.noiDung[i], { size: 30, cao: 92, min: 16 }).svg;
        s += line(110, y + 150, 970, y + 150, '#E5E7EB', 2, 'stroke-dasharray="8 8"');
      }
      s += circle(870, 1160, 85, 'none', `stroke="${p.muc[0]}" stroke-width="6" opacity="0.8"`) + chu(790, 1125, 160, 'NHÓM ' + sp.nhom, { size: 30, dam: true, giua: true, mau: p.muc[0] }).svg;
      if (sp.thongDiep) s += chu(110, 1120, 640, 'Lời dặn: ' + sp.thongDiep, { size: 28, dam: true, nghieng: true, mau: p.dam, cao: 100, min: 16 }).svg;
      return s + chanTrang(sp, W, H - 10, p);
    }
  ];

  const BO = { info: INFO, mind: MIND, phieu: PHIEU_MAU };
  window.LOAI_SAN_PHAM = LOAI;
  window.BANG_MAU = BANG_MAU;
  window.veSanPham = function (sp) {
    const L = LOAI[sp.loai] || LOAI.info, ham = (BO[sp.loai] || INFO)[(sp.mau || 0) % 5];
    const p = BANG_MAU[(sp.bangMau || 0) % BANG_MAU.length];
    let body = '';
    try { body = ham(sp, p, L.w, L.h); } catch (e) { body = `<text x="40" y="80" font-size="30">Lỗi vẽ mẫu: ${esc(e.message)}</text>`; }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.w} ${L.h}" width="${L.w}" height="${L.h}">${body}</svg>`;
  };
  // Xuất PNG từ SVG
  window.taiAnhSanPham = function (sp, tenFile) {
    return new Promise((ok, loi) => {
      const L = LOAI[sp.loai] || LOAI.info, svg = window.veSanPham(sp);
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = L.w; c.height = L.h;
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, L.w, L.h); g.drawImage(img, 0, 0);
        c.toBlob(b => {
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = tenFile || 'san-pham.png';
          document.body.appendChild(a); a.click(); a.remove(); ok();
        }, 'image/png');
      };
      img.onerror = loi;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  };
})();
