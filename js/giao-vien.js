/* Trang giáo viên — theo dõi, xem sản phẩm, chấm, báo cáo */
(function () {
  const $ = id => document.getElementById(id);
  const TIEU_CHI = ['Nội dung chính xác', 'Trình bày rõ, đẹp', 'Thông điệp ý nghĩa', 'Thuyết trình tự tin'];
  const KHOA = 'kc-gv-v1';
  let cd = {}; try { cd = JSON.parse(localStorage.getItem(KHOA) || '{}'); } catch (e) { }
  cd.url = cd.url == null ? CAU_HINH.urlKetQua : cd.url; cd.mk = cd.mk || ''; cd.luot = cd.luot || []; cd.phut = cd.phut || CAU_HINH.phutMacDinh;
  function luuCD() { try { localStorage.setItem(KHOA, JSON.stringify(cd)); } catch (e) { } }
  let dong = [], hen = null, tcChiSo = 0;

  function thongBao(t) { const d = document.createElement('div'); d.className = 'thong-bao'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const luotHT = () => cd.luot.find(l => l.ma === cd.dangXem) || cd.luot[0];
  function urlDung() { return cd.url || CAU_HINH.urlKetQua || ''; }

  // ---------- lượt ----------
  function veLuot() {
    const s = $('oLuot'); s.innerHTML = '';
    cd.luot.forEach(l => { const o = document.createElement('option'); o.value = l.ma; o.textContent = (l.lop || '?') + ' · ' + l.ngay + ' · ' + l.ma; s.appendChild(o); });
    if (!cd.luot.length) { const o = document.createElement('option'); o.textContent = '(chưa có lượt)'; s.appendChild(o); }
    const l = luotHT(); if (l) { s.value = l.ma; cd.dangXem = l.ma; }
    $('dauPhu').textContent = CAU_HINH.mon + ' · ' + CAU_HINH.bai + (l ? ' · Lượt ' + l.ma + (l.lop ? ' · Lớp ' + l.lop : '') : '');
    $('cheDo').textContent = urlDung() ? 'Đang dùng Google Sheet' : 'Chế độ thử (một máy)';
    $('cheDo').className = 'trang-thai ' + (urlDung() ? 'sp' : 'vao');
  }
  $('oPhut').value = cd.phut;
  $('nutTaoLuot').onclick = () => {
    const lop = $('oLop').value.trim().slice(0, 10), phut = +$('oPhut').value;
    const d = new Date(), ngay = d.getDate() + '/' + (d.getMonth() + 1);
    const ma = (lop || 'L').replace(/[^0-9A-Za-z]/g, '').toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    cd.luot.unshift({ ma, lop, phut, ngay }); cd.luot = cd.luot.slice(0, 30); cd.dangXem = ma; cd.phut = phut; luuCD();
    veLuot(); veQR(); taiDuLieu(); thongBao('Đã tạo lượt ' + ma);
  };
  $('oLuot').onchange = e => { ttCu = {}; daVe = false; cd.dangXem = e.target.value; luuCD(); veLuot(); veQR(); taiDuLieu(); };
  $('oUrl').value = cd.url; $('oMK').value = cd.mk;
  $('nutLuuCD').onclick = () => { cd.url = $('oUrl').value.trim(); cd.mk = $('oMK').value; luuCD(); veLuot(); taiDuLieu(); thongBao('Đã lưu cài đặt'); };

  // ---------- tab ----------
  document.querySelectorAll('#tab button').forEach(b => b.onclick = () => {
    document.querySelectorAll('#tab button').forEach(x => x.classList.toggle('chon', x === b));
    ['qr', 'theo', 'bc'].forEach(t => $('tab' + t[0].toUpperCase() + t.slice(1)).classList.toggle('an', t !== b.dataset.tab));
    HU.vaoMan($('tab' + b.dataset.tab[0].toUpperCase() + b.dataset.tab.slice(1)));
    if (b.dataset.tab === 'bc') veBaoCao();
  });

  // ---------- QR ----------
  function linkNhom(l, n) {
    const goc = location.href.split('?')[0].split('#')[0].replace(/giao-vien\.html$/, '').replace(/\/?$/, '/');
    return goc + 'index.html?l=' + encodeURIComponent(l.ma) + '&n=' + n + '&t=' + l.phut + (l.lop ? '&lop=' + encodeURIComponent(l.lop) : '');
  }
  function veQR() {
    const l = luotHT(), g = $('qrLuoi'); g.innerHTML = '';
    if (!l) { g.innerHTML = '<div class="hop">Bấm <b>＋ Tạo lượt mới</b> ở trên để có mã QR cho các nhóm.</div>'; return; }
    for (let n = 1; n <= CAU_HINH.soNhom; n++) {
      const u = linkNhom(l, n), o = document.createElement('div'); o.className = 'qr-o';
      o.innerHTML = `<b>NHÓM ${n}</b><div>${PHIEU[phieuCuaNhom(n)].benh}</div>${window.taoQR ? taoQR(u) : ''}<small></small>`;
      const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.textContent = 'Mở thử'; a.className = 'khong-in';
      o.querySelector('small').textContent = u; o.appendChild(document.createElement('br')); o.appendChild(a);
      o.classList.add('lan'); o.style.setProperty('--i', n - 1);
      g.appendChild(o);
    }
  }

  // ---------- dữ liệu ----------
  async function taiDuLieu() {
    if (!$('capNhatLuc')) return;
    const l = luotHT(); if (!l) { dong = []; veTheoDoi(); return; }
    try {
      dong = await docKetQua(l.ma, urlDung(), cd.mk);
      $('capNhatLuc').textContent = 'Cập nhật lúc ' + new Date().toLocaleTimeString('vi-VN') + ' · tự làm mới 5 giây/lần';
    } catch (e) {
      $('capNhatLuc').textContent = '⚠️ Không đọc được kết quả: ' + e.message + ' (kiểm tra URL và mật khẩu)';
    }
    veTheoDoi();
    if (!$('tabBc').classList.contains('an')) veBaoCao();
  }
  HU.taoNen(); AT.taoNut();
  function hen5s() { clearInterval(hen); hen = setInterval(taiDuLieu, 5000); }
  if (window.kenhThu) kenhThu.onmessage = () => taiDuLieu();
  window.addEventListener('storage', e => { if (e.key === 'kc-demo-v1') taiDuLieu(); });

  const dongNhom = n => dong.find(d => +d.nhom === n);
  function trangThai(d) {
    if (!d) return ['Chưa vào', ''];
    if (d.sanPham) return ['Đã nộp sản phẩm', 'sp'];
    if (d.diem != null && d.diem !== '') return ['Đã nộp phiếu', 'phieu'];
    return ['Đang làm phiếu', 'vao'];
  }
  function spDayDu(d) {
    const p = PHIEU[phieuCuaNhom(+d.nhom)];
    return Object.assign({ nhom: d.nhom, lop: d.lop, benh: p.benh, benhNhan: p.benhNhan }, d.sanPham);
  }
  const fmtGiay = s => s == null || s === '' ? '–' : Math.floor(s / 60) + ' phút ' + (s % 60) + ' giây';

  let ttCu = {}, daVe = false, coMoi = false;
  function veTheoDoi() {
    coMoi = false;
    const g = $('luoiGV'); g.innerHTML = '';
    let nopP = 0, nopSP = 0, tong = 0;
    for (let n = 1; n <= CAU_HINH.soNhom; n++) {
      const d = dongNhom(n), [ten, lop] = trangThai(d);
      if (d && d.diem != null && d.diem !== '') { nopP++; tong += +d.diem; }
      if (d && d.sanPham) nopSP++;
      const o = document.createElement('div'); o.className = 'o-gv' + (!daVe ? ' lan' : '');
      o.style.setProperty('--i', n - 1);
      const khoaTT = ten + (d && d.sanPham ? JSON.stringify(d.sanPham) : '');
      if (daVe && ttCu[n] !== undefined && ttCu[n] !== khoaTT) { o.classList.add('moi'); coMoi = true; }
      ttCu[n] = khoaTT;
      o.innerHTML = `<div class="tren"><b>Nhóm ${n}</b><span class="trang-thai ${lop}">${ten}</span></div>
        <div class="anh-sp">${d && d.sanPham ? veSanPham(spDayDu(d)) : '<span>' + (d && d.diem != null && d.diem !== '' ? 'Đang thiết kế sản phẩm…' : 'Chưa có sản phẩm') + '</span>'}</div>
        <div class="duoi"><span>${esc(PHIEU[phieuCuaNhom(n)].benh)}</span><span>${d && d.diem != null && d.diem !== '' ? '<b>' + d.diem + '</b>/100 · ' + fmtGiay(+d.giay) : ''}</span></div>`;
      if (d && d.sanPham) o.querySelector('.anh-sp').onclick = () => moTC(n);
      g.appendChild(o);
    }
    daVe = true; if (coMoi) AT.phat('chuong');
    $('soLieu').innerHTML = `<div><b>${dong.length}/${CAU_HINH.soNhom}</b><span>nhóm đã vào</span></div>
      <div><b>${nopP}</b><span>nhóm nộp phiếu</span></div><div><b>${nopSP}</b><span>nhóm nộp sản phẩm</span></div>
      <div><b>${nopP ? Math.round(tong / nopP) : '–'}</b><span>điểm phiếu trung bình</span></div>`;
  }

  // ---------- trình chiếu + chấm ----------
  const khoaCham = () => 'kc-cham-' + (luotHT() ? luotHT().ma : '');
  function docCham() { try { return JSON.parse(localStorage.getItem(khoaCham()) || '{}'); } catch (e) { return {}; } }
  function ghiCham(c) { try { localStorage.setItem(khoaCham(), JSON.stringify(c)); } catch (e) { } }
  const dsCoSP = () => dong.filter(d => d.sanPham).map(d => +d.nhom).sort((a, b) => a - b);
  function moTC(n) {
    const ds = dsCoSP(); if (!ds.length) { thongBao('Chưa có nhóm nào nộp sản phẩm.'); return; }
    tcChiSo = Math.max(0, ds.indexOf(n)); $('tc').classList.remove('an'); veTC();
  }
  function veTC() {
    const ds = dsCoSP(), n = ds[tcChiSo], d = dongNhom(n), sp = spDayDu(d);
    $('tcSan').innerHTML = veSanPham(sp);
    $('tcTen').textContent = 'Nhóm ' + n + ' · ' + sp.benh;
    $('tcThongTin').textContent = LOAI_SAN_PHAM[sp.loai].ten + ' – mẫu ' + LOAI_SAN_PHAM[sp.loai].mau[sp.mau] + ' · Điểm phiếu: ' + (d.diem != null ? d.diem + '/100' : '–') + ' · ' + (tcChiSo + 1) + '/' + ds.length;
    const c = docCham(), cn = c[n] || { s: [0, 0, 0, 0], nx: '' };
    const wrap = $('tcCham'); wrap.innerHTML = '';
    TIEU_CHI.forEach((t, i) => {
      const r = document.createElement('div'); r.style.margin = '8px 0';
      r.innerHTML = `<div style="font-size:14px">${t}</div><div class="sao"></div>`;
      for (let k = 1; k <= 5; k++) {
        const b = document.createElement('button'); b.textContent = '★'; b.className = k <= cn.s[i] ? 'bat' : ''; b.title = k + ' điểm';
        b.onclick = () => { AT.phat('chon'); cn.s[i] = k; c[n] = cn; ghiCham(c); veTC(); };
        r.querySelector('.sao').appendChild(b);
      }
      wrap.appendChild(r);
    });
    $('tcTong').textContent = cn.s.reduce((a, b) => a + b, 0);
    $('tcNX').value = cn.nx || '';
    $('tcNX').oninput = e => { const c2 = docCham(); c2[n] = c2[n] || { s: [0, 0, 0, 0] }; c2[n].nx = e.target.value; ghiCham(c2); };
  }
  $('nutTrinhChieu').onclick = () => moTC(dsCoSP()[0]);
  $('tcDong').onclick = () => $('tc').classList.add('an');
  $('tcTruoc').onclick = () => { AT.phat('vut'); const k = dsCoSP().length; tcChiSo = (tcChiSo - 1 + k) % k; veTC(); };
  $('tcSau').onclick = () => { AT.phat('vut'); const k = dsCoSP().length; tcChiSo = (tcChiSo + 1) % k; veTC(); };
  document.addEventListener('keydown', e => {
    if ($('tc').classList.contains('an') || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') $('tcSau').click(); if (e.key === 'ArrowLeft') $('tcTruoc').click(); if (e.key === 'Escape') $('tcDong').click();
  });

  // ---------- báo cáo ----------
  function veBaoCao() {
    const l = luotHT(); $('bcLuot').textContent = l ? l.ma + (l.lop ? ' – Lớp ' + l.lop : '') : '';
    const coP = dong.filter(d => d.diem != null && d.diem !== '');
    const tb = coP.length ? Math.round(coP.reduce((a, d) => a + +d.diem, 0) / coP.length) : '–';
    const c = docCham();
    $('bcTong').innerHTML = `<div class="so-lieu"><div><b>${coP.length}</b><span>nhóm nộp phiếu</span></div><div><b>${tb}</b><span>điểm phiếu trung bình</span></div>
      <div><b>${dong.filter(d => d.sanPham).length}</b><span>sản phẩm đã nộp</span></div><div><b>${coP.filter(d => +d.diem === 100).length}</b><span>nhóm đạt 100 điểm</span></div></div>`;
    // tỉ lệ đúng từng mục
    let html = '';
    MUC.forEach((m, i) => {
      const co = coP.filter(d => Array.isArray(d.chiTiet) && d.chiTiet[i]);
      const dung = co.filter(d => d.chiTiet[i].dung).length, pt = co.length ? Math.round(dung / co.length * 100) : 0;
      html += `<div style="margin:8px 0"><div class="hang" style="justify-content:space-between"><span>${m.bieuTuong} ${m.ten}</span><b>${co.length ? dung + '/' + co.length + ' nhóm đúng' : '–'}</b></div><div class="thanh"><i style="width:${pt}%"></i></div></div>`;
    });
    const yeu = MUC.map((m, i) => ({ m, sai: coP.filter(d => Array.isArray(d.chiTiet) && d.chiTiet[i] && !d.chiTiet[i].dung).length })).sort((a, b) => b.sai - a.sai)[0];
    if (yeu && yeu.sai) html += `<p class="chi-dan">Mục nhiều nhóm nhầm nhất: <b>${yeu.m.ten}</b> (${yeu.sai} nhóm). Nên chốt lại kiến thức mục này.</p>`;
    $('bcMuc').innerHTML = html;
    let b = '<table class="bc"><tr><th>Nhóm</th><th>Bệnh</th><th>Điểm phiếu</th><th>Thời gian</th><th>Sản phẩm</th><th>Chấm SP (/20)</th><th>Nhận xét</th></tr>';
    for (let n = 1; n <= CAU_HINH.soNhom; n++) {
      const d = dongNhom(n), cn = c[n];
      b += `<tr><td>${n}</td><td>${esc(PHIEU[phieuCuaNhom(n)].benh)}</td><td>${d && d.diem != null && d.diem !== '' ? d.diem : '–'}</td><td>${d ? fmtGiay(d.giay === '' ? null : d.giay) : '–'}</td>
        <td>${d && d.sanPham ? esc(LOAI_SAN_PHAM[d.sanPham.loai].ten + ': ' + d.sanPham.tieuDe) : '–'}</td><td>${cn ? cn.s.reduce((a, x) => a + x, 0) : '–'}</td><td>${cn ? esc(cn.nx || '') : ''}</td></tr>`;
    }
    $('bcBang').innerHTML = b + '</table>';
  }

  // ---------- dữ liệu mẫu (chỉ chế độ thử) ----------
  $('nutMau').onclick = () => {
    if (urlDung()) { thongBao('Dữ liệu mẫu chỉ dùng ở chế độ thử (chưa nhập URL).'); return; }
    let l = luotHT();
    if (!l) { $('nutTaoLuot').click(); l = luotHT(); }
    const loai = ['info', 'mind', 'phieu', 'info', 'mind', 'phieu'], TD = ['Ăn đủ sắt – Máu khỏe mạnh', 'Huyết áp – Kẻ giết người thầm lặng', 'Giữ lòng mạch luôn thông thoáng', 'Lan ơi, đừng bỏ bữa!', 'Bớt muối – Thêm tuổi thọ', 'Nói KHÔNG với thuốc lá'];
    const TĐ = ['Mỗi bữa ăn đủ chất là một giọt máu khỏe!', 'Ăn nhạt hôm nay – Tim khỏe mai sau!', 'Tim khỏe nhờ mạch sạch!', 'Hồng cầu cần sắt như xe cần xăng!', 'Đo huyết áp thường xuyên, không đợi đau đầu!', 'Vận động mỗi ngày – Mạch máu thênh thang!'];
    const diem = [100, 80, 60, 100, 80, 100];
    for (let n = 1; n <= 6; n++) {
      const p = phieuCuaNhom(n), ph = PHIEU[p];
      ghiThuTrucTiep(l.ma, n, {
        luot: l.ma, nhom: n, lop: l.lop || '8A1', phieu: ph.benh, diem: diem[n - 1], giay: 120 + n * 9,
        chiTiet: MUC.map((m, i) => ({ muc: i, the: ph.dung[i].the, dung: i < diem[n - 1] / 20 })),
        sanPham: { loai: loai[n - 1], mau: (n - 1) % 5, bangMau: (n - 1) % 4, tieuDe: TD[n - 1], thongDiep: TĐ[n - 1], noiDung: ph.dung.map(d => d.the) }
      });
    }
    taiDuLieu(); thongBao('Đã nạp dữ liệu mẫu 6 nhóm');
  };
  $('nutXoa').onclick = () => {
    if (urlDung()) { thongBao('Dữ liệu trên Google Sheet cần xoá trực tiếp trong Sheet.'); return; }
    const l = luotHT(); if (l) { xoaThu(l.ma); try { localStorage.removeItem('kc-cham-' + l.ma); } catch (e) { } taiDuLieu(); thongBao('Đã xoá dữ liệu thử của lượt này'); }
  };

  veLuot(); veQR(); taiDuLieu(); hen5s();
})();
