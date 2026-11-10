# Phòng khám Tim mạch nhí – KHTN 8, Bài 33

Ứng dụng cho tiết học: 6 nhóm "bác sĩ nhí" nhận 3 hồ sơ bệnh (Thiếu máu, Huyết áp cao, Xơ vữa động mạch), hoàn thiện phiếu, thiết kế sản phẩm rồi gửi về trang giáo viên.

## 1. Các tệp

| Tệp | Dùng để |
|---|---|
| `index.html` | Trang học sinh (mỗi nhóm mở bằng mã QR của nhóm mình) |
| `giao-vien.html` | Trang giáo viên: tạo lượt, in QR, theo dõi, trình chiếu, chấm, báo cáo |
| `js/du-lieu.js` | **Nội dung** 3 phiếu, thẻ đúng, thẻ bẫy, lời giải thích. Cô sửa ở đây |
| `cong-cu/google-apps-script.gs` | Mã dán vào Google Sheet để nhận kết quả từ máy học sinh |
| Các tệp còn lại | Giao diện, 15 mẫu sản phẩm, tạo mã QR (không cần sửa) |

Nhóm 1 và 4 làm phiếu Thiếu máu, nhóm 2 và 5 làm phiếu Huyết áp cao, nhóm 3 và 6 làm phiếu Xơ vữa động mạch.

## 2. Chạy thử ngay trên một máy (không cần cài gì)

1. Mở `giao-vien.html`, nhập lớp và chọn số phút, rồi bấm **＋ Tạo lượt mới**.
2. Ở tab 1, bấm **Mở thử** dưới mã của từng nhóm để đóng vai học sinh.
3. Quay lại tab 2 **Theo dõi trực tiếp** để xem kết quả hiện lên. Nút **Dữ liệu mẫu** nạp nhanh 6 nhóm giả để xem giao diện.

Ở chế độ này, kết quả chỉ lưu trên trình duyệt của máy đó. Muốn dùng trên lớp với điện thoại hay máy tính bảng của học sinh, cô làm tiếp mục 3 và 4.

## 3. Nhận kết quả từ máy học sinh (Google Sheet, làm một lần)

1. Tạo một Google Sheet mới bằng tài khoản Google của cô.
2. Chọn **Tiện ích mở rộng → Apps Script**. Xoá hết mã có sẵn, rồi dán toàn bộ nội dung `cong-cu/google-apps-script.gs`.
3. Ở dòng đầu, đổi `doi-mat-khau-nay` thành mật khẩu riêng của cô. Mật khẩu này dùng để xem kết quả, cô không đưa cho học sinh.
4. Bấm **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**, chọn:
   - **Thực thi với tư cách:** Tôi
   - **Người có quyền truy cập:** Bất kỳ ai
5. Bấm **Triển khai** và cấp quyền. Sau đó sao chép **URL ứng dụng web** (kết thúc bằng `/exec`).
6. Mở `js/du-lieu.js` bằng Notepad và dán URL vào `urlKetQua: ''`, giữ nguyên hai dấu nháy. Lưu tệp dạng UTF-8.
7. Mở trang giáo viên, vào **Cài đặt kết nối Google Sheet**, dán URL, nhập mật khẩu, rồi bấm **Lưu cài đặt**. Mục này chỉ lưu trên máy của cô.

Nếu sau này sửa mã Apps Script, cô vào **Triển khai → Quản lý triển khai → Sửa → Phiên bản mới**. Làm vậy thì URL giữ nguyên.

## 4. Đưa lên mạng để học sinh quét QR (GitHub Pages, miễn phí)

1. Tạo tài khoản GitHub, tạo kho (repository) mới ở chế độ Public.
2. Bấm **Add file → Upload files** và kéo toàn bộ thư mục này lên. `index.html` phải nằm ở ngoài cùng.
3. Vào **Settings → Pages**, phần Branch chọn `main` và `/ (root)`, rồi bấm **Save**.
4. Sau khoảng 1–2 phút, trang có địa chỉ dạng `https://<tên>.github.io/<kho>/`. Trang giáo viên là `…/giao-vien.html`.

Mã QR được tạo theo địa chỉ trang giáo viên đang mở. Vì vậy cô phải mở trang giáo viên từ địa chỉ GitHub Pages, không mở từ tệp trên máy, thì QR mới dùng được cho học sinh.

## 5. Trên lớp

1. **Trước giờ học:** tạo lượt mới cho lớp và chọn số phút. In hoặc chiếu 6 mã QR (nút **In mã QR**).
2. **Học sinh:** mỗi nhóm quét mã → đọc hồ sơ bệnh nhân → bấm **Bắt đầu khám** → đặt 5 thẻ đúng vào 5 mục. Trong kho có 3 thẻ bẫy. Hết giờ, phiếu tự nộp.
3. **Sau khi nộp:** nhóm xem điểm, đáp án và lời giải thích vì sao thẻ bẫy sai. Phiếu đã nộp bị khoá, không làm lại được. Nếu muốn cho làm lại khi tập dượt, thêm `&thu=1` vào cuối đường dẫn.
4. **Thiết kế sản phẩm:** nhóm chọn Infographic, Sơ đồ tư duy hoặc Phiếu trình bày. Máy tự bốc một trong 5 mẫu của kiểu đó, nên các nhóm nhận mẫu khác nhau. Nhóm đặt tiêu đề, viết thông điệp, chọn màu và có thể viết lại nội dung bằng lời của mình. Sau đó bấm **Nộp sản phẩm cho cô** (nộp lại được, cô luôn thấy bản mới nhất) và có thể **Tải ảnh** PNG.
5. **Giáo viên:** tab **Theo dõi trực tiếp** tự làm mới 5 giây/lần. Khi các nhóm trình bày, bấm **Trình chiếu sản phẩm** để chiếu từng nhóm (phím ← → để chuyển) và chấm theo 4 tiêu chí × 5 sao kèm nhận xét.
6. **Cuối giờ:** tab **Tổng kết & báo cáo** có điểm trung bình, tỉ lệ đúng từng mục, mục nhiều nhóm nhầm nhất và bảng kết quả để in. Dữ liệu gốc nằm trong Google Sheet.

**Âm thanh:** ứng dụng tự tạo âm thanh, không cần tệp nhạc nên chạy được cả khi mạng yếu. Gồm còi xe cứu thương, tiếng tít của máy theo dõi, tiếng tim đập khi làm phiếu (đập nhanh hơn khi còn 30 giây), tiếng tích tắc 10 giây cuối, tiếng chuông đúng hoặc tiếng rè sai, tiếng đóng dấu, nhạc mừng khi đạt từ 80 điểm. Nút 🔊 ở góc trên dùng để bật hoặc tắt. Trên lớp nên để 1–2 máy bật loa, các máy còn lại tắt cho đỡ ồn. Trang giáo viên kêu "ting" khi có nhóm vừa nộp.

Lưu ý: mỗi kiểu có 5 mẫu mà lớp có 6 nhóm. Nếu nhóm 1 và nhóm 6 chọn cùng một kiểu thì sẽ trùng mẫu, nhưng vẫn khác bệnh và khác màu mặc định.

## 6. Sửa nội dung

Mở `js/du-lieu.js` bằng Notepad.
- Mỗi phiếu có `tinhHuong` (câu chuyện bệnh nhân), 5 thẻ `dung` (theo đúng thứ tự Nguyên nhân → Triệu chứng → Hậu quả → Biện pháp → Cơ sở khoa học) và 3 thẻ `nhieu` (thẻ bẫy).
- Mỗi thẻ gồm `the` (chữ trên thẻ, nên dưới 15 chữ) và `giai` (lời giải thích hiện sau khi nộp).
- Phần triệu chứng của huyết áp cao và xơ vữa động mạch là kiến thức bổ sung ngoài SGK (đã ghi chú trong lời giải thích). Cô nên duyệt lại toàn bộ nội dung trước khi dạy.
- Chỉ sửa phần chữ trong dấu nháy. Không xoá dấu phẩy hay ngoặc.

Nguồn: SGK KHTN 8 – Kết nối tri thức, Bài 33, mục III.
