# Gửi em, một chút dịu dàng · 20/10

Trang quà tặng ngày Phụ nữ Việt Nam: mở phong thư, nhạc piano, album 5 ảnh, thư tay và bó hoa tương tác. Giao diện có phiên bản điện thoại, hỗ trợ bàn phím và chế độ giảm chuyển động. Không cần cài thư viện hay build.

## Xem trên máy

Mở `index.html` bằng trình duyệt. Hoặc chạy trong thư mục dự án:

```powershell
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`. Bấm **Mở món quà nhỏ** để bắt đầu nhạc; nút ở góc trên cho phép tắt/bật. Nhạc cần thao tác chạm theo quy định của trình duyệt.

## Đưa lên GitHub Pages khi chưa có repo

1. Đăng nhập GitHub, tạo repository mới tên `gui-em-20-10`, chọn **Public**. Bỏ chọn khởi tạo README vì dự án đã có sẵn.
2. Trong thư mục này, mở PowerShell và chạy (thay `TEN-GITHUB` bằng tài khoản của bạn):

   ```powershell
   git init -b main
   git add .
   git commit -m "Create a little October 20 gift"
   git remote add origin https://github.com/TEN-GITHUB/gui-em-20-10.git
   git push -u origin main
   ```

3. Vào repo → **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Vào **Actions → Publish to GitHub Pages → Run workflow** và chọn nhánh `main`. Các lần push sau sẽ tự triển khai.
5. Khi workflow hoàn tất, mở `https://TEN-GITHUB.github.io/gui-em-20-10/`.

Không có bước build hoặc cấu hình đường dẫn: toàn bộ tài nguyên dùng đường dẫn tương đối, tương thích Pages trong một repo con. Các ảnh PNG gốc được giữ nguyên trên máy và bỏ qua khi commit; website sử dụng bản JPEG tối ưu trong `assets/`.

Tham khảo chính thức: [GitHub Pages với workflow riêng](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Sửa thành món quà riêng

- Sửa lời chúc, cách xưng hô và nội dung lá thư trong `index.html`.
- Ảnh website ở `assets/photo-01.jpg` đến `photo-05.jpg`. Thay ảnh cùng tên hoặc sửa đường dẫn trong `index.html` và `script.js`.
- Nhạc piano được tổng hợp riêng cho trang bằng `tools/make_music.py`, không phụ thuộc dịch vụ phát nhạc. Có thể thay bằng file nhạc bạn được phép sử dụng rồi đổi thuộc tính `src` của `background-music` trong `index.html`.
- Font Cormorant Garamond được lưu cục bộ kèm giấy phép SIL Open Font License; nếu font không tải được, trang dùng Georgia.

## Cấu trúc

```text
index.html                  Nội dung trang
styles.css                  Giao diện và responsive
script.js                   Nhạc, mở quà, xem ảnh, nhận hoa
assets/                     Ảnh, font, nhạc, favicon
.github/workflows/deploy.yml Tự động triển khai GitHub Pages
tools/make_music.py          Tạo lại nhạc piano (Python chuẩn)
```
# woman-day-hehe
