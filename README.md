# Mẫu Thiệp Cưới (dựng lại từ Cinelove)

Trang tĩnh mẫu thiệp cưới giống mẫu `thiep-cuoi-15` trên Cinelove. Đây là một bản dựng cơ bản (HTML/CSS/JS) để bạn tùy chỉnh.

Cấu trúc:

- `index.html` - trang chính
- `css/style.css` - kiểu dáng
- `js/main.js` - tương tác nhẹ (menu, gửi RSVP)
- `assets/` - ảnh placeholder (thay bằng ảnh thật của bạn)

Build-time gallery (recommended)

1. Tạo thư mục `assets/album` và đặt tất cả ảnh gallery (.jpg/.png/.webp) vào đó.
2. Chạy script Node để tạo `images.json` (script sẽ quét `assets/album` và sinh mảng URL):

```powershell
# ở PowerShell, vào thư mục project rồi
node .\scripts\generate-images.js
```

3. Mở `index.html` trong trình duyệt (hoặc dùng Live Server) — client sẽ fetch `images.json` và hiển thị gallery.

Notes:

- Nếu bạn deploy lên GitHub Pages/Netlify, chạy script trước khi push, hoặc tích hợp vào CI để tự động sinh `images.json`.
- Nếu không muốn chạy Node, bạn có thể tự tạo `images.json` theo đúng định dạng mảng URL (ví dụ `["assets/album/1.jpg","assets/album/2.jpg"]`).

Chạy thử:
Mở `index.html` trong trình duyệt (kéo thả hoặc `Open File`).

Gợi ý tiếp theo:

- Thay `assets/*` bằng ảnh chất lượng cao của bạn.
- Kết nối form RSVP với backend (Google Forms, API hoặc Google Sheets) nếu muốn lưu phản hồi.
- Thêm font hoặc tinh chỉnh màu sắc theo theme mong muốn.
