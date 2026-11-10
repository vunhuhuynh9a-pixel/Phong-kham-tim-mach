/* =====================================================================
   PHÒNG KHÁM TIM MẠCH NHÍ — NHẬN KẾT QUẢ VÀO GOOGLE SHEET
   Cách cài: xem HUONG-DAN.md, mục 3.
   1) Đổi mật khẩu dưới đây.  2) Triển khai > Ứng dụng web > Ai có quyền truy cập: Bất kỳ ai.
   ===================================================================== */
const MAT_KHAU_GIAO_VIEN = 'doi-mat-khau-nay';
const TEN_TRANG = 'KetQua';
const COT = ['Cập nhật', 'Lượt', 'Lớp', 'Nhóm', 'Phiếu', 'Điểm', 'Thời gian (giây)', 'Chi tiết (JSON)', 'Sản phẩm (JSON)', 'Nộp SP lúc', 'Vào lúc'];

function trang_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TEN_TRANG);
  if (!sh) { sh = ss.insertSheet(TEN_TRANG); sh.appendRow(COT); sh.setFrozenRows(1); sh.getRange(1, 1, 1, COT.length).setFontWeight('bold'); }
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
// Chặn công thức độc hại khi dữ liệu bắt đầu bằng = + - @
function chu_(s, max) { s = String(s == null ? '' : s).slice(0, max || 200); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function so_(x, min, max) { const n = Number(x); return isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : ''; }
function jsonGon_(o, max) { try { const s = JSON.stringify(o); return s.length <= (max || 5000) ? s : ''; } catch (e) { return ''; } }

function doPost(e) {
  const khoa = LockService.getScriptLock();
  try {
    khoa.waitLock(20000);
    const g = JSON.parse(e.postData.contents);
    const luot = chu_(g.luot, 20), nhom = so_(g.nhom, 1, 20);
    if (!luot || !nhom) return json_({ ok: false });
    const sh = trang_(), du = sh.getDataRange().getValues();
    let r = -1;
    for (let i = 1; i < du.length; i++) if (String(du[i][1]) === luot && Number(du[i][3]) === nhom) { r = i + 1; break; }
    const bayGio = new Date();
    if (r < 0) { sh.appendRow([bayGio, luot, chu_(g.lop, 10), nhom, '', '', '', '', '', '', bayGio]); r = sh.getLastRow(); }
    sh.getRange(r, 1).setValue(bayGio);
    if (g.lop) sh.getRange(r, 3).setValue(chu_(g.lop, 10));
    if (g.phieu) sh.getRange(r, 5).setValue(chu_(g.phieu, 60));
    if (g.loai === 'phieu') {
      sh.getRange(r, 6, 1, 3).setValues([[so_(g.diem, 0, 100), so_(g.giay, 0, 3600), chu_(jsonGon_(g.chiTiet, 3000), 3000)]]);
    }
    if (g.loai === 'sanpham') {
      const s = g.sanPham || {};
      const gon = {
        loai: ['info', 'mind', 'phieu'].indexOf(s.loai) >= 0 ? s.loai : 'info', mau: so_(s.mau, 0, 4), bangMau: so_(s.bangMau, 0, 3),
        tieuDe: String(s.tieuDe || '').slice(0, 50), thongDiep: String(s.thongDiep || '').slice(0, 60),
        noiDung: (Array.isArray(s.noiDung) ? s.noiDung : []).slice(0, 5).map(x => String(x || '').slice(0, 200))
      };
      sh.getRange(r, 9, 1, 2).setValues([[chu_(jsonGon_(gon, 4000), 4000), bayGio]]);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, loi: String(err) });
  } finally { try { khoa.releaseLock(); } catch (e) { } }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.khoa !== MAT_KHAU_GIAO_VIEN) return json_({ loi: 'Sai mật khẩu' });
  const du = trang_().getDataRange().getValues().slice(1);
  const docJ = s => { try { return s ? JSON.parse(String(s).replace(/^'/, '')) : null; } catch (er) { return null; } };
  const dong = du.filter(d => !p.luot || String(d[1]) === p.luot).map(d => ({
    capNhat: d[0], luot: d[1], lop: d[2], nhom: d[3], phieu: d[4], diem: d[5], giay: d[6],
    chiTiet: docJ(d[7]), sanPham: docJ(d[8]), nopSPLuc: d[9], vaoLuc: d[10]
  }));
  return json_({ dong: dong });
}
