/* Trang học sinh — Phòng khám Tim mạch nhí */
(function () {
  const $ = id => document.getElementById(id);
  const q = new URLSearchParams(location.search);
  const ANH_BN = ['👦', '👨', '👴'];

  // ----- tham số lượt -----
  const luot = (q.get('l') || 'thu').slice(0, 20);
  const phut = Math.min(15, Math.max(1, parseInt(q.get('t'), 10) || CAU_HINH.phutMacDinh));
  const choLamLai = q.get('thu') === '1';
  let nhom = parseInt(q.get('n'), 10) || 0;
  let lop = (q.get('lop') || '').slice(0, 10);

  function hamBam(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
  function tron(arr, hat) { const a = arr.slice(); let s = hat || 1; for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ----- trạng thái, lưu lại để tải lại trang không mất -----
  let tt = null;
  const khoaTT = () => 'kc-hs-' + luot + '-' + nhom;
  function luu() { try { localStorage.setItem(khoaTT(), JSON.stringify(tt)); } catch (e) { } }
  function nap() {
    try { const s = JSON.parse(localStorage.getItem(khoaTT()) || 'null'); if (s && !choLamLai) return s; } catch (e) { }
    return null;
  }

  function hien(id) {
    ['mhVao', 'mhHoSo', 'mhPhieu', 'mhKetQua', 'mhThietKe'].forEach(m => $(m).classList.toggle('an', m !== id));
    HU.vaoMan($(id));
    window.scrollTo(0, 0);
  }
  function thongBao(t) {
    const d = document.createElement('div'); d.className = 'thong-bao'; d.textContent = t; document.body.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }

  // =============== 0. VÀO NHÓM ===============
  function manVao() {
    hien('mhVao');
    const l = $('luoiNhom'); l.innerHTML = '';
    for (let i = 1; i <= CAU_HINH.soNhom; i++) {
      const b = document.createElement('button'); b.textContent = 'Nhóm ' + i;
      b.onclick = () => { nhom = i; [...l.children].forEach(x => x.classList.remove('chon')); b.classList.add('chon'); $('nutVao').disabled = false; };
      l.appendChild(b);
    }
    $('nutVao').onclick = () => batDauNhom();
  }

  function batDauNhom() {
    $('nhanNhom').textContent = 'Nhóm ' + nhom; $('nhanNhom').classList.remove('an');
    document.querySelectorAll('.soNhom').forEach(e => e.textContent = nhom);
    tt = nap();
    if (!tt) {
      const p = phieuCuaNhom(nhom), ph = PHIEU[p];
      const the = ph.dung.map((t, i) => ({ id: 'd' + i, the: t.the, giai: t.giai, muc: i }))
        .concat(ph.nhieu.map((t, i) => ({ id: 'n' + i, the: t.the, giai: t.giai, muc: -1 })));
      tt = { luot, nhom, lop, p, buoc: 'hoso', thuTu: tron(the, hamBam(luot + nhom)).map(t => t.id), dat: [null, null, null, null, null], batDau: 0, giay: 0, diem: null, sp: null };
      luu();
      guiKetQua({ loai: 'vao', luot, nhom, lop, phieu: ph.benh });
    }
    if (lop && !tt.lop) tt.lop = lop;
    $('dauPhu').textContent = CAU_HINH.mon + ' · ' + PHIEU[tt.p].benh + (tt.lop ? ' · Lớp ' + tt.lop : '');
    ({ hoso: manHoSo, phieu: manPhieu, ketqua: manKetQua, thietke: manThietKe })[tt.buoc]();
  }

  function theTheoId(id) {
    const ph = PHIEU[tt.p];
    if (id[0] === 'd') { const i = +id.slice(1); return { id, the: ph.dung[i].the, giai: ph.dung[i].giai, muc: i }; }
    const i = +id.slice(1); return { id, the: ph.nhieu[i].the, giai: ph.nhieu[i].giai, muc: -1 };
  }

  let henTit = null;
  // =============== 1. HỒ SƠ ===============
  function manHoSo() {
    hien('mhHoSo');
    const ph = PHIEU[tt.p];
    $('anhBN').textContent = ANH_BN[tt.p] || '🧑';
    $('soHS').textContent = String(nhom).padStart(2, '0');
    $('tenBN').textContent = ph.benhNhan;
    $('tinhHuong').textContent = '';
    $('tenBenh').textContent = ph.benh;
    // màn hình theo dõi: đường điện tim, nhanh hay chậm theo bệnh
    const nhanh = !!ph.nhipNhanh, buoc = nhanh ? 50 : 75; let d = 'M0 40';
    for (let x = 0; x < 300; x += buoc) d += ` H${x + buoc * .35} l4 -6 l4 6 H${x + buoc * .55} l5 -30 l6 50 l5 -20 H${x + buoc}`;
    $('duongTim').setAttribute('d', d);
    $('monitor').style.setProperty('--toc', nhanh ? '1.3s' : '2.2s');
    $('monitor').classList.toggle('canh-bao', true);
    $('chiSo1').textContent = (ph.chiSo || [])[0] || ''; $('chiSo2').textContent = (ph.chiSo || [])[1] || '';
    const ke = () => {
      let k = 0; clearInterval(henTit); henTit = setInterval(() => { if ($('mhHoSo').classList.contains('an') || ++k > 12) clearInterval(henTit); else AT.phat('tit'); }, nhanh ? 520 : 900);
      setTimeout(() => HU.chuChay($('tinhHuong'), ph.tinhHuong, 26), HU.giam ? 0 : 700);
    };
    if (!sessionStorage.getItem('kc-chao-' + luot + nhom)) {
      const so = String(nhom).padStart(2, '0'), lop = document.createElement('div');
      lop.className = 'man-chao';
      lop.innerHTML = `<div style="text-align:center"><div class="chu-chao" style="animation:none">🔔 Phòng số ${so} có bệnh nhân mới!<small>Cả nhóm sẵn sàng chưa?</small></div><p><button class="nut to nut-nhip" id="nutTiepNhan">🚑 Tiếp nhận bệnh nhân</button></p></div>`;
      document.body.appendChild(lop);
      const hen = [];
      const dongLop = () => {
        if (lop.classList.contains('dong')) return;
        hen.forEach(clearTimeout); AT.canhDung();
        lop.classList.add('dong'); setTimeout(() => { lop.remove(); HU.vaoMan($('mhHoSo')); ke(); }, 380);
      };
      lop.querySelector('#nutTiepNhan').onclick = () => {
        try { sessionStorage.setItem('kc-chao-' + luot + nhom, '1'); } catch (e) { }
        AT.canhBatDau(); AT.phat('coiDai');
        lop.innerHTML = `<div class="canh-xe">
            <div class="pho"><span>🏢</span><span>🏬</span><span>🌳</span><span>🏫</span><span>🌳</span><span>🏢</span></div>
            <div class="benh-vien">🏥<b>PHÒNG KHÁM<br>TIM MẠCH NHÍ</b></div>
            <div class="duong"><div class="vach"></div>
              <div class="cum-xe"><div class="den-xe"></div><div class="xe">🚑</div><div class="khoi">💨</div></div>
              <div class="nguoi"><span class="bs">🧑‍⚕️</span><span class="bn2">${ANH_BN[tt.p] || '🧑'}</span></div>
            </div>
            <div class="chu-chao" id="chuXe">Xe cứu thương đang chở bệnh nhân tới…</div>
            <button class="bo-qua" type="button">Bỏ qua ▶</button>
          </div>`;
        lop.querySelector('.bo-qua').onclick = dongLop;
        if (HU.giam) { setTimeout(dongLop, 600); return; }
        const dat = (ms, f) => hen.push(setTimeout(f, ms));
        dat(3600, () => { AT.phat('phanh'); lop.querySelector('.canh-xe').classList.add('phanh'); $('chuXe').textContent = 'Kíttt… Xe đã tới cổng phòng khám!'; });
        dat(4700, () => { AT.phat('cua'); lop.querySelector('.canh-xe').classList.add('xuong'); });
        dat(5100, () => { AT.phat('buoc'); });
        dat(5600, () => { $('chuXe').innerHTML = `Bệnh nhân <b>${ph.benhNhan}</b> đã tới Phòng số ${so}!<small>Các bác sĩ nhí chuẩn bị khám…</small>`; AT.phat('chuong'); });
        dat(8200, dongLop);
      };
    } else ke();
    $('soPhut').textContent = phut;
    $('nutBatDau').onclick = () => { clearInterval(henTit); AT.phat('chon'); tt.buoc = 'phieu'; tt.batDau = Date.now(); luu(); manPhieu(); };
  }

  // =============== 2. PHIẾU ===============
  let chonThe = null, hen = null, chiaLanDau = false;
  function manPhieu() {
    hien('mhPhieu');
    const ph = PHIEU[tt.p];
    $('tomTat').textContent = ph.benhNhan + ' — Chẩn đoán: ' + ph.benh;
    chiaLanDau = true; veO(); veKho(); chiaLanDau = false; chayDongHo();
    for (let i = 0; i < 8; i++) setTimeout(() => AT.phat('chon'), i * 70);
  }
  function veO() {
    const c = $('cacO'); c.innerHTML = '';
    MUC.forEach((m, i) => {
      const o = document.createElement('div'); o.className = 'o-muc' + (tt.dat[i] ? ' co' : '') + (chiaLanDau ? ' chia' : '') + (vuaDat === i ? ' pop' : '');
      o.style.setProperty('--i', i);
      o.innerHTML = `<div class="ten">${m.bieuTuong} ${m.ten}</div><div class="ruot"></div>`;
      o.querySelector('.ruot').textContent = tt.dat[i] ? theTheoId(tt.dat[i]).the : 'Đặt thẻ vào đây…';
      o.onclick = () => {
        if (chonThe) { datThe(chonThe, i); }
        else if (tt.dat[i]) { AT.phat('go'); tt.dat[i] = null; luu(); veO(); veKho(); }
      };
      o.ondragover = e => { e.preventDefault(); o.classList.add('cho'); };
      o.ondragleave = () => o.classList.remove('cho');
      o.ondrop = e => { e.preventDefault(); datThe(e.dataTransfer.getData('text'), i); };
      if (chonThe) o.classList.add('cho');
      c.appendChild(o);
    });
    $('nutNop').disabled = tt.dat.some(x => !x);
  }
  function veKho() {
    const k = $('khoThe'); k.innerHTML = '';
    tt.thuTu.forEach((id, vt) => {
      const t = theTheoId(id), daDung = tt.dat.includes(id);
      const b = document.createElement('button'); b.className = 'the' + (daDung ? ' da-dung' : '') + (chonThe === id ? ' chon' : '') + (chiaLanDau ? ' chia' : '');
      b.dataset.id = id; b.style.setProperty('--i', vt);
      b.textContent = t.the; b.draggable = !daDung;
      b.ondragstart = e => e.dataTransfer.setData('text', id);
      b.onclick = () => { if (daDung) { tt.dat[tt.dat.indexOf(id)] = null; luu(); } chonThe = chonThe === id ? null : id; AT.phat(chonThe ? 'chon' : 'go'); veO(); veKho();
        if (chonThe && window.innerWidth < 800) { const i = tt.dat.indexOf(null); const o = $('cacO').children[i < 0 ? 0 : i]; if (o) o.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };
      k.appendChild(b);
    });
  }
  let vuaDat = -1;
  function datThe(id, i) {
    if (!id) return;
    const nguon = document.querySelector(`#khoThe .the[data-id="${id}"]`), khung = nguon ? nguon.getBoundingClientRect() : null;
    const cu = tt.dat.indexOf(id); if (cu >= 0) tt.dat[cu] = null;
    tt.dat[i] = id; chonThe = null; luu();
    HU.bay(khung, theTheoId(id).the, $('cacO').children[i], () => { AT.phat('dat'); vuaDat = i; veO(); vuaDat = -1; });
    veKho();
  }
  function chayDongHo() {
    const dh = $('dongHo'); dh.classList.remove('an');
    clearInterval(hen);
    let giayCu = -1, timNhanh = null;
    const tick = () => {
      const con = Math.max(0, phut * 60 - Math.floor((Date.now() - tt.batDau) / 1000));
      const nhanhTim = con <= 30;
      if (timNhanh !== nhanhTim && con > 0) { timNhanh = nhanhTim; AT.timBatDau(nhanhTim); }
      if (con !== giayCu) { giayCu = con; if (con <= 10 && con > 0) AT.phat('tich'); }
      dh.textContent = Math.floor(con / 60) + ':' + String(con % 60).padStart(2, '0');
      dh.classList.toggle('gap', con <= 30);
      $('tienDo').style.width = (con / (phut * 60) * 100) + '%';
      if (con <= 0) { clearInterval(hen); AT.timDung(); AT.phat('het'); thongBao('Hết giờ! Phiếu được nộp tự động.'); nopPhieu(); }
    };
    tick(); hen = setInterval(tick, 500);
  }
  $('nutNop').onclick = () => nopPhieu();

  function nopPhieu() {
    if (tt.buoc !== 'phieu') return;
    clearInterval(hen); AT.timDung(); $('dongHo').classList.add('an');
    tt.giay = Math.min(phut * 60, Math.round((Date.now() - tt.batDau) / 1000));
    let dung = 0; const chiTiet = tt.dat.map((id, i) => { const ok = !!id && theTheoId(id).muc === i; if (ok) dung++; return { muc: i, the: id ? theTheoId(id).the : '', dung: ok }; });
    tt.diem = dung * 20; tt.chiTiet = chiTiet; tt.buoc = 'ketqua'; luu();
    guiKetQua({ loai: 'phieu', luot, nhom, lop: tt.lop, phieu: PHIEU[tt.p].benh, diem: tt.diem, giay: tt.giay, chiTiet });
    setTimeout(() => AT.phat('quet'), 100);
    HU.lop(`<div class="chan-doan"><div><div class="may">🫀<div class="tia"></div></div><p>Đang đối chiếu hồ sơ<span>…</span></p></div></div>`, 1700).then(() => manKetQua(true));
  }

  // =============== 3. KẾT QUẢ ===============
  function manKetQua(hieuUng) {
    hien('mhKetQua'); $('dongHo').classList.add('an');
    const ph = PHIEU[tt.p];
    if (hieuUng) { HU.demSo($('diem'), tt.diem, 1300); HU.vaoMan($('khungDiem')); $('khungDiem').classList.add('nay'); }
    else $('diem').textContent = tt.diem;
    $('conDau').innerHTML = tt.diem >= 80 ? '<span class="con-dau">CHẨN ĐOÁN CHÍNH XÁC</span>' : '<span class="con-dau cam">CẦN HỘI CHẨN THÊM</span>';
    if (hieuUng && tt.diem >= 80) setTimeout(() => { HU.phaoGiay(tt.diem === 100 ? 120 : 60); AT.phat('keng'); }, 1500);
    if (hieuUng) {
      tt.chiTiet.forEach((ct, i) => setTimeout(() => AT.phat(ct.dung ? 'dung' : 'sai'), i * 220 + 550));
      setTimeout(() => AT.phat('dau'), 2000);
    }
    $('loiKhen').textContent = tt.diem === 100 ? '🏆 Xuất sắc! Chẩn đoán chính xác tuyệt đối.' : tt.diem >= 60 ? '👏 Khá lắm! Xem lại các ô đỏ nhé.' : '💪 Cùng xem lại hồ sơ đúng bên dưới nhé.';
    $('dapAn').innerHTML = '';
    MUC.forEach((m, i) => {
      const ct = tt.chiTiet[i], o = document.createElement('div');
      o.className = 'o-muc co hien-dan ' + (ct.dung ? 'dung' : 'sai'); o.style.cursor = 'default'; o.style.setProperty('--i', i);
      o.innerHTML = `<div class="ten">${m.bieuTuong} ${m.ten}</div><div class="ruot" style="display:block"></div>`;
      const r = o.querySelector('.ruot');
      r.innerHTML = (ct.dung ? '' : 'Nhóm chọn: <s></s><br>👉 Đúng: ') + '<span class="d"></span><p class="giai"></p>';
      if (!ct.dung) r.querySelector('s').textContent = ct.the || '(để trống)';
      r.querySelector('.d').textContent = ph.dung[i].the;
      r.querySelector('.giai').textContent = ph.dung[i].giai;
      o.insertAdjacentHTML('beforeend', `<span class="dau-moc" style="--i:${i}">${ct.dung ? '✅' : '❌'}</span>`);
      r.style.paddingRight = '56px';
      $('dapAn').appendChild(o);
    });
    $('giaiNhieu').innerHTML = '';
    ph.nhieu.forEach(n => {
      const d = document.createElement('div'); d.className = 'nhieu-giai hien-dan'; d.style.setProperty('--i', 5 + ph.nhieu.indexOf(n));
      d.innerHTML = '<b></b><div class="giai"></div>';
      d.querySelector('b').textContent = '🪤 ' + n.the; d.querySelector('.giai').textContent = n.giai;
      $('giaiNhieu').appendChild(d);
    });
    $('nutSangTK').onclick = () => { AT.phat('vut'); tt.buoc = 'thietke'; luu(); manThietKe(); };
  }

  // =============== 4. THIẾT KẾ ===============
  const hat = hamBam(luot);
  function mauCuaNhom(loai) { const lech = { info: 0, mind: 2, phieu: 4 }[loai]; return (nhom - 1 + hat + lech) % 5; }
  function spHienTai() {
    const ph = PHIEU[tt.p];
    return Object.assign({ nhom, lop: tt.lop, benh: ph.benh, benhNhan: ph.benhNhan }, tt.sp);
  }
  function veXemTruoc() {
    $('xemTruoc').innerHTML = veSanPham(spHienTai());
    $('tenMau').textContent = 'Mẫu ' + (tt.sp.mau + 1) + ': ' + LOAI_SAN_PHAM[tt.sp.loai].mau[tt.sp.mau];
    $('demTD').textContent = (tt.sp.tieuDe || '').length; $('demTDiep').textContent = (tt.sp.thongDiep || '').length;
  }
  function manThietKe() {
    hien('mhThietKe');
    const ph = PHIEU[tt.p];
    document.querySelectorAll('#chonLoai button').forEach(b => {
      b.classList.toggle('chon', !!tt.sp && tt.sp.loai === b.dataset.loai);
      b.onclick = () => {
        const loai = b.dataset.loai;
        if (!tt.sp) tt.sp = { tieuDe: ph.benh.toUpperCase() + ' – NHÓM ' + nhom, thongDiep: '', bangMau: (nhom - 1) % BANG_MAU.length, noiDung: ph.dung.map(d => d.the) };
        const doi = tt.sp.loai !== loai;
        tt.sp.loai = loai; tt.sp.mau = mauCuaNhom(loai); luu();
        document.querySelectorAll('#chonLoai button').forEach(x => x.classList.toggle('chon', x === b));
        moTK();
        if (doi) bocMau();
      };
    });
    if (tt.sp) moTK();
  }
  function bocMau() {
    const k = document.querySelector('.xem-truoc'); if (HU.giam) return;
    const x = document.createElement('div'); x.className = 'xao-tron'; x.innerHTML = '<div style="text-align:center"><b>🎲</b>Đang bốc mẫu cho nhóm…</div>';
    k.appendChild(x); AT.phat('xuc');
    if (window.innerWidth < 800) k.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { x.remove(); const sv = $('xemTruoc'); sv.classList.remove('boc-mau'); void sv.offsetWidth; sv.classList.add('boc-mau'); AT.phat('dung'); thongBao('🎉 Nhóm nhận ' + $('tenMau').textContent); }, 1100);
  }
  function moTK() {
    const lanDau = $('vungTK').classList.contains('an');
    $('vungTK').classList.remove('an');
    if (lanDau) HU.vaoMan($('vungTK'));
    $('oTieuDe').value = tt.sp.tieuDe || ''; $('oThongDiep').value = tt.sp.thongDiep || '';
    $('oTieuDe').oninput = e => { tt.sp.tieuDe = e.target.value; luu(); veXemTruoc(); };
    $('oThongDiep').oninput = e => { tt.sp.thongDiep = e.target.value; luu(); veXemTruoc(); };
    const bm = $('bangMau'); bm.innerHTML = '';
    BANG_MAU.forEach((p, i) => {
      const b = document.createElement('button'); b.title = p.ten;
      b.style.background = `conic-gradient(${p.muc[0]} 0 33%, ${p.muc[1]} 0 66%, ${p.dam} 0)`;
      b.className = tt.sp.bangMau === i ? 'chon' : '';
      b.onclick = () => { tt.sp.bangMau = i; luu(); [...bm.children].forEach(x => x.classList.toggle('chon', x === b)); veXemTruoc(); };
      bm.appendChild(b);
    });
    const nd = $('suaND'); nd.innerHTML = '';
    MUC.forEach((m, i) => {
      const w = document.createElement('div'); w.style.marginBottom = '8px';
      w.innerHTML = `<div style="font-size:14px;font-weight:bold;color:var(--do-dam)">${m.bieuTuong} ${m.ten}</div><textarea class="o" maxlength="200" rows="2"></textarea>`;
      const inp = w.querySelector("textarea"); inp.value = tt.sp.noiDung[i];
      inp.oninput = () => { tt.sp.noiDung[i] = inp.value; luu(); veXemTruoc(); };
      nd.appendChild(w);
    });
    $('daNopSP').classList.toggle('an', !tt.daNopSP);
    veXemTruoc();
    $('nutTai').onclick = () => taiAnhSanPham(spHienTai(), `Nhom${nhom}_${LOAI_SAN_PHAM[tt.sp.loai].ten.replace(/\s/g, '')}.png`).catch(() => thongBao('Không tải được ảnh trên trình duyệt này.'));
    $('nutNopSP').onclick = async () => {
      if (!(tt.sp.tieuDe || '').trim()) { thongBao('Nhóm hãy đặt tiêu đề cho sản phẩm nhé!'); return; }
      $('nutNopSP').disabled = true;
      const s = tt.sp;
      const ok = await guiKetQua({ loai: 'sanpham', luot, nhom, lop: tt.lop, sanPham: { loai: s.loai, mau: s.mau, bangMau: s.bangMau, tieuDe: s.tieuDe.trim(), thongDiep: (s.thongDiep || '').trim(), noiDung: s.noiDung.map(x => (x || '').trim()) } });
      $('nutNopSP').disabled = false;
      if (ok) { HU.mayBay($('nutNopSP')); AT.phat('vut'); setTimeout(() => AT.phat('chuong'), 700); tt.daNopSP = true; luu(); $('daNopSP').classList.remove('an'); thongBao('Đã gửi sản phẩm cho cô!'); }
      else thongBao('Chưa gửi được, kiểm tra mạng rồi bấm lại nhé.');
    };
  }

  // =============== KHỞI ĐỘNG ===============
  HU.taoNen(); AT.taoNut();
  if (nhom >= 1 && nhom <= CAU_HINH.soNhom) batDauNhom(); else manVao();
})();
