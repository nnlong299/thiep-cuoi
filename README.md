# Thiệp cưới Ngọc Hân & Nhật Long

Trang tĩnh (HTML/CSS/JS), host miễn phí trên GitHub Pages.

## 1. Chọn ảnh
Chép ảnh đã chọn vào `images/` (nên resize ≤ 1600px, JPG ~300–500KB để tải nhanh):
- `cover.jpg` — ảnh bìa (nên chọn ảnh ngang hoặc dọc đều được)
- `couple.jpg` — ảnh chung của cô dâu chú rể (dọc)
- `01.jpg` … `06.jpg` — album (thêm/bớt tên file trong `config.js`)

Chưa có ảnh thì trang vẫn chạy, hiển thị nền gradient xanh.

## 2. Chọn theme
Mở `index.html?pick=1` để hiện 3 chấm màu ở góc trái dưới (sage / forest / mint).
Chọn xong, đổi `defaultTheme` trong `config.js`. Khách không thấy thanh chọn.
Link riêng cho từng theme: `?theme=forest`.

## 3. Kết nối form với Google Sheet
1. Tạo Google Sheet mới.
2. Extensions → Apps Script → dán nội dung `apps-script.gs` → Save.
3. Deploy → New deployment → loại **Web app** → Execute as: **Me**, Who has access: **Anyone** → Deploy → cho phép quyền.
4. Copy URL Web App (kết thúc bằng `/exec`) dán vào `rsvpEndpoint` trong `config.js`.

## 4. Đưa lên GitHub Pages
1. Tạo repo trên GitHub, đẩy nội dung thư mục `wedding-invite` lên nhánh `main`.
2. Settings → Pages → Source: Deploy from branch → `main` / root.
3. Link dạng `https://<user>.github.io/<repo>/`.

## Ghi chú về nhạc
Nhạc YouTube chỉ phát sau khi khách bấm "Mở thiệp" (trình duyệt chặn tự phát). Có nút ♪ để tắt/bật.
Video có thể bị chủ sở hữu chặn nhúng; nếu nhạc không phát, thử video khác hoặc dùng file mp3.
