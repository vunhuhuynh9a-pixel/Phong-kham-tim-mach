/* Gửi và đọc kết quả. Có URL Apps Script thì dùng Google Sheet; để trống thì lưu trên trình duyệt (chế độ thử). */
(function () {
  const KHOA_THU = 'kc-demo-v1';
  const kenh = ('BroadcastChannel' in window) ? new BroadcastChannel('kc-demo') : null;

  function docThu() { try { return JSON.parse(localStorage.getItem(KHOA_THU) || '{}'); } catch (e) { return {}; } }
  function ghiThu(d) { try { localStorage.setItem(KHOA_THU, JSON.stringify(d)); } catch (e) { } }

  // Gộp một gói tin vào một dòng — giống hệt cách Apps Script làm
  function gop(dong, g) {
    dong = dong || {};
    dong.luot = g.luot; dong.nhom = g.nhom; dong.lop = g.lop || dong.lop || '';
    dong.capNhat = new Date().toISOString();
    if (g.loai === 'vao') { dong.vaoLuc = dong.vaoLuc || dong.capNhat; dong.phieu = g.phieu; }
    if (g.loai === 'phieu') { dong.phieu = g.phieu; dong.diem = g.diem; dong.giay = g.giay; dong.chiTiet = g.chiTiet; dong.nopPhieuLuc = dong.capNhat; }
    if (g.loai === 'sanpham') { dong.sanPham = g.sanPham; dong.nopSPLuc = dong.capNhat; }
    return dong;
  }

  window.guiKetQua = async function (goi) {
    goi.guiLuc = new Date().toISOString();
    if (!CAU_HINH.urlKetQua) {
      const d = docThu(); d[goi.luot] = d[goi.luot] || {};
      d[goi.luot][goi.nhom] = gop(d[goi.luot][goi.nhom], goi); ghiThu(d);
      if (kenh) kenh.postMessage('moi');
      return true;
    }
    for (let lan = 0; lan < 3; lan++) {
      try {
        await fetch(CAU_HINH.urlKetQua, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(goi) });
        return true;
      } catch (e) { await new Promise(r => setTimeout(r, 1500 * (lan + 1))); }
    }
    return false;
  };

  // Trả về mảng dòng của một lượt
  window.docKetQua = async function (luot, url, matKhau) {
    if (!url) { const d = docThu()[luot] || {}; return Object.keys(d).map(k => d[k]); }
    const r = await fetch(url + '?khoa=' + encodeURIComponent(matKhau || '') + '&luot=' + encodeURIComponent(luot));
    const j = await r.json();
    if (j.loi) throw new Error(j.loi);
    return j.dong || [];
  };
  window.xoaThu = function (luot) { const d = docThu(); delete d[luot]; ghiThu(d); if (kenh) kenh.postMessage('moi'); };
  window.ghiThuTrucTiep = function (luot, nhom, dong) { const d = docThu(); d[luot] = d[luot] || {}; d[luot][nhom] = dong; ghiThu(d); };
  window.kenhThu = kenh;
})();
