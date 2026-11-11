/* =====================================================================
   PHÒNG KHÁM TIM MẠCH NHÍ — CẤU HÌNH VÀ NỘI DUNG
   Sửa file này bằng Notepad (lưu dạng UTF-8). Đọc HUONG-DAN.md trước khi sửa.
   ===================================================================== */

const CAU_HINH = {
  giaoVien: 'Đinh Ly',
  mon: 'KHTN 8',
  bai: 'Bài 33 — Máu và hệ tuần hoàn của cơ thể người',
  // Dán URL ứng dụng web Apps Script vào đây (xem HUONG-DAN.md, mục 3).
  // Để trống: chạy chế độ thử trên một máy (học sinh và giáo viên mở cùng trình duyệt).
  urlKetQua: 'https://script.google.com/macros/s/AKfycbwEtzji_se71eo4U1LN65hXsi2zphbZNrmPx6gMhCXoCT5lKpOUuudfsarR18FzyQ9x/exec',
  soNhom: 6,
  phutMacDinh: 3
};

// 5 mục của hồ sơ bệnh (giữ nguyên thứ tự)
const MUC = [
  { ten: 'Nguyên nhân', bieuTuong: '🧪' },
  { ten: 'Triệu chứng', bieuTuong: '🤒' },
  { ten: 'Hậu quả', bieuTuong: '⚠️' },
  { ten: 'Biện pháp phòng bệnh', bieuTuong: '🛡️' },
  { ten: 'Cơ sở khoa học của biện pháp', bieuTuong: '🔬' }
];

/* chiSo: 2 dòng hiện trên màn hình theo dõi trong phòng khám (lấy từ tình huống).
   Mỗi phiếu: tình huống bệnh nhân + 5 thẻ đúng (đúng thứ tự 5 mục ở trên) + 3 thẻ nhiễu.
   Thẻ là một câu đầy đủ (khoảng 20–30 chữ); thẻ nhiễu nên dài tương đương để không lộ đáp án.
   "giai" là lời giải thích hiện ra sau khi nhóm nộp phiếu. */
const PHIEU = [
  {
    benh: 'Thiếu máu',
    benhNhan: 'Con Tuấn, 13 tuổi',
    chiSo: ['Nhịp tim: NHANH', 'Da: XANH XAO'], nhipNhanh: true,
    tinhHuong: 'Tuấn kén ăn, hay bỏ bữa sáng và rất ít ăn thịt, cá, trứng. Dạo này Tuấn hay mệt, da xanh xao, leo cầu thang là tim đập nhanh, học thể dục rất nhanh hụt hơi.',
    dung: [
      { the: 'Chế độ ăn thiếu sắt (ít thịt, cá, trứng) nên cơ thể không tạo đủ hemoglobin; hoặc cơ thể bị mất nhiều máu.',
        giai: 'Sắt là thành phần cấu tạo nên hemoglobin. Tuấn bỏ bữa, ít ăn thịt, cá nên thiếu sắt; ngoài ra chảy máu nhiều cũng làm cơ thể mất hồng cầu.' },
      { the: 'Cơ thể mệt mỏi, da xanh xao; chỉ vận động nhẹ như leo cầu thang mà tim đã đập nhanh, dễ hụt hơi.',
        giai: 'Máu chở được ít oxygen nên cơ thể mệt; tim phải đập nhanh hơn để đưa máu đi nhiều hơn, bù lại lượng oxygen bị thiếu.' },
      { the: 'Máu vận chuyển oxygen kém nên các cơ quan bị thiếu oxygen; kéo dài có thể gây rối loạn nhịp tim, ngất xỉu.',
        giai: 'Hemoglobin trong hồng cầu là chất kết hợp và vận chuyển oxygen. Thiếu hemoglobin thì tim, não và các cơ quan không nhận đủ oxygen.' },
      { the: 'Ăn đủ bữa, đủ chất, tăng thực phẩm giàu sắt như thịt, cá, trứng, rau xanh đậm; phòng tránh chấn thương gây mất máu.',
        giai: 'Không bỏ bữa sáng; bữa ăn cân đối giúp cơ thể có đủ nguyên liệu tạo máu; cẩn thận khi vui chơi, lao động để tránh chảy máu.' },
      { the: 'Sắt là nguyên liệu để cơ thể tạo hemoglobin giúp hồng cầu vận chuyển oxygen; hạn chế mất máu giúp giữ đủ số lượng hồng cầu.',
        giai: 'Đủ sắt → đủ hemoglobin → máu chở đủ oxygen. Không bị mất máu → không bị hao hụt hồng cầu.' }
    ],
    nhieu: [
      { the: 'Do ăn quá mặn và nhiều chất béo trong thời gian dài, làm máu bị đặc lại và khó lưu thông trong mạch.',
        giai: 'Sai: ăn mặn, nhiều chất béo là yếu tố gây huyết áp cao và xơ vữa động mạch, không phải nguyên nhân thiếu máu.' },
      { the: 'Uống thật nhiều nước mỗi ngày để cơ thể tự tạo thêm thật nhiều hồng cầu mới, máu sẽ đỏ trở lại.',
        giai: 'Sai: nước không tạo ra hồng cầu; cơ thể cần sắt và các chất dinh dưỡng để tạo hemoglobin, hồng cầu.' },
      { the: 'Thiếu máu làm máu chở được nhiều oxygen hơn bình thường nên tim được nghỉ ngơi và đập chậm lại.',
        giai: 'Sai: thiếu hemoglobin nên máu chở được ít oxygen hơn; tim phải đập nhanh hơn chứ không chậm lại.' }
    ]
  },
  {
    benh: 'Huyết áp cao',
    benhNhan: 'Bố Minh, 43 tuổi',
    chiSo: ['Huyết áp: 160/100', 'Đau đầu, chóng mặt'], nhipNhanh: false,
    tinhHuong: 'Bố Minh làm việc căng thẳng, thích ăn mặn, hay ăn đồ chiên rán và gần như không tập thể dục. Đo huyết áp được 160/100 mmHg. Thỉnh thoảng bố bị đau đầu, chóng mặt.',
    dung: [
      { the: 'Chế độ ăn mặn, nhiều đường và chất béo (đồ chiên rán); kèm theo ít vận động, căng thẳng, dùng rượu bia, thuốc lá.',
        giai: 'SGK nêu chế độ ăn nhiều muối, đường và chất béo gây huyết áp cao; ít vận động, căng thẳng, chất kích thích làm nguy cơ tăng thêm.' },
      { the: 'Thường không có dấu hiệu rõ ràng; đôi khi đau đầu, chóng mặt, nên phải đo huyết áp mới phát hiện được bệnh.',
        giai: 'Bổ sung ngoài SGK: nhiều người bị huyết áp cao mà không biết, vì vậy người lớn tuổi cần đo huyết áp định kì.' },
      { the: 'Áp lực máu cao kéo dài làm tổn thương thành động mạch, có thể gây biến chứng nguy hiểm: nhồi máu cơ tim, đột quỵ, suy thận.',
        giai: 'Máu luôn ép mạnh lên thành mạch làm thành mạch bị tổn thương; tim cũng phải làm việc nặng hơn trong thời gian dài.' },
      { the: 'Ăn nhạt, hạn chế đường và dầu mỡ; vận động đều đặn; hạn chế rượu bia, thuốc lá; giữ tinh thần vui vẻ, thoải mái.',
        giai: 'Với bố Minh: bớt ăn mặn, bớt đồ chiên rán, đi bộ mỗi ngày và đo huyết áp thường xuyên theo hướng dẫn của bác sĩ.' },
      { the: 'Bớt muối giúp cơ thể giảm giữ nước, giảm áp lực lên thành mạch; vận động và tinh thần thoải mái giúp tim mạch làm việc hiệu quả.',
        giai: 'Ăn uống, vận động hợp lí còn giúp kiểm soát cân nặng; tránh chất kích thích giúp hạn chế tăng huyết áp.' }
    ],
    nhieu: [
      { the: 'Huyết áp cao chỉ gặp ở người gầy yếu; người béo, ít vận động thì không cần lo lắng về căn bệnh này.',
        giai: 'Sai: thừa cân, ít vận động còn làm tăng nguy cơ huyết áp cao.' },
      { the: 'Khi hết đau đầu, chóng mặt nghĩa là huyết áp đã trở về bình thường, không cần đo lại nữa.',
        giai: 'Sai: huyết áp cao thường không có dấu hiệu rõ; hết đau đầu chưa chắc huyết áp đã bình thường, cần đo thường xuyên.' },
      { the: 'Nên ăn thêm muối trong mỗi bữa ăn để tim bơm máu khỏe hơn và thành mạch máu bền chắc hơn.',
        giai: 'Sai: ăn nhiều muối làm cơ thể giữ nước, huyết áp càng tăng cao.' }
    ]
  },
  {
    benh: 'Xơ vữa động mạch',
    benhNhan: 'Ông Hùng, 68 tuổi',
    chiSo: ['Cholesterol: CAO', 'Tức ngực khi gắng sức'], nhipNhanh: false,
    tinhHuong: 'Ông Hùng hút thuốc lá 40 năm, ăn nhiều mỡ động vật, ít tập thể dục. Xét nghiệm thấy cholesterol trong máu cao. Gần đây ông hay đau tức ngực mỗi khi làm việc nặng.',
    dung: [
      { the: 'Hút thuốc lá, ăn nhiều mỡ động vật, ít vận động làm hàm lượng cholesterol trong máu tăng cao.',
        giai: 'Cholesterol trong máu tăng cao, kết hợp với Ca²⁺ ngấm vào thành động mạch, tạo thành mảng xơ vữa.' },
      { the: 'Bệnh thường tiến triển âm thầm; khi lòng mạch đã hẹp có thể thấy đau tức ngực, khó thở khi làm việc nặng.',
        giai: 'Bổ sung ngoài SGK: khi gắng sức, tim cần nhiều máu hơn nhưng mạch đã hẹp nên máu đến tim không đủ, gây đau tức ngực.' },
      { the: 'Mảng xơ vữa làm lòng mạch hẹp, giảm dòng máu, tăng huyết áp; cục máu đông có thể gây tắc mạch, dẫn tới đau tim, đột quỵ.',
        giai: 'Tắc động mạch vành (nuôi tim) gây đau tim, nhồi máu cơ tim; tắc động mạch não gây đột quỵ.' },
      { the: 'Không hút thuốc lá; hạn chế mỡ động vật và đồ chế biến sẵn nhiều dầu mỡ; ăn nhiều rau xanh; tập thể dục thường xuyên.',
        giai: 'Với ông Hùng: bỏ thuốc lá, thay mỡ động vật bằng dầu thực vật, tăng rau xanh và đi bộ, tập thể dục đều đặn.' },
      { the: 'Ăn hợp lí và vận động giúp giảm cholesterol trong máu; tránh thuốc lá giúp bảo vệ thành mạch, hạn chế hình thành mảng xơ vữa.',
        giai: 'Ít cholesterol thì ít chất ngấm vào thành mạch; thành mạch không bị khói thuốc làm tổn thương thì khó hình thành mảng xơ vữa.' }
    ],
    nhieu: [
      { the: 'Do ăn thiếu sắt kéo dài nên cơ thể không tạo đủ hemoglobin cho hồng cầu, làm thành mạch bị xơ cứng.',
        giai: 'Sai: thiếu sắt gây bệnh thiếu máu, không gây xơ vữa động mạch.' },
      { the: 'Mảng xơ vữa bám vào thành mạch làm lòng mạch rộng ra, nên máu chảy nhanh và mạnh hơn bình thường.',
        giai: 'Sai: mảng xơ vữa làm lòng mạch hẹp lại, dòng máu bị giảm.' },
      { the: 'Chỉ người cao tuổi mới cần phòng xơ vữa động mạch; trẻ em ăn nhiều đồ béo, ít vận động cũng không sao.',
        giai: 'Sai: thói quen ăn uống, vận động từ nhỏ ảnh hưởng lâu dài đến mạch máu khi lớn lên.' }
    ]
  }
];

// Nhóm nào làm phiếu nào: nhóm 1 & 4 → phiếu 1, nhóm 2 & 5 → phiếu 2, nhóm 3 & 6 → phiếu 3
function phieuCuaNhom(nhom) { return (nhom - 1) % PHIEU.length; }

const NGUON = 'SGK KHTN 8 – Kết nối tri thức, Bài 33, mục III. Triệu chứng của huyết áp cao và xơ vữa động mạch là kiến thức bổ sung ngoài SGK.';
