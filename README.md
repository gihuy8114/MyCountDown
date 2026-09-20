# 🍃 Ghibli Countdown Web

> Ứng dụng web đếm ngược thời gian mang phong cách Studio Ghibli ấm áp, hỗ trợ tính toán thời gian thực theo Ngày, Giờ, Phút, Giây và hiển thị % hoàn thành với độ chính xác cao.

![Ghibli Countdown Preview](https://raw.githubusercontent.com/gihuy8114/MyCountDown/main/preview.png) *(sau khi bạn thêm ảnh preview)*

---

## ✨ Tính Năng Nổi Bật

- 🌱 **Đếm ngược thời gian thực (Real-time)**: Hiển thị đầy đủ **Ngày, Giờ, Phút, Giây**.
- 🚲 **Tính % hoàn thành siêu mượt**: Tỷ lệ % tiến độ được cập nhật liên tục (đến 4 chữ số thập phân) kèm mascot Ghibli di chuyển sinh động dọc theo thanh tiến trình.
- 🎨 **3 Bầu không khí Ghibli**:
  - ☀️ **Đồng Cỏ (Day)**: Lấy cảm hứng từ *My Neighbor Totoro* & *The Secret World of Arrietty*.
  - 🌇 **Hoàng Hôn (Sunset)**: Tông màu ấm áp lãng mạn như *Howl's Moving Castle*.
  - 🌙 **Đêm Sao (Night)**: Bầu trời đêm lung linh với đom đóm huyền ảo phong cách *Spirited Away*.
- 🍃 **Hiệu ứng thiên nhiên**: Mây trôi bồng bềnh, cánh hoa & lá bay nhẹ nhàng trên màn hình (đom đóm phát sáng vào ban đêm).
- 🔊 **Âm thanh thiên nhiên thư giãn**: Tích hợp bộ tạo âm thanh tiếng gió rì rào và chuông gió ngũ âm dịu êm bằng Web Audio API (không cần tải thêm file âm thanh bên ngoài).
- ⚡ **Preset tiện lợi**: Nhanh chóng chọn mốc +7 ngày, +30 ngày, +100 ngày hoặc Hết năm nay.
- 🔗 **Chia sẻ & Đồng bộ**: Tự động lưu vào `localStorage` và hỗ trợ tạo link chia sẻ có chứa tham số (`?title=...&start=...&end=...`) để gửi trực tiếp cho bạn bè.
- 📱 **Responsive 100%**: Hiển thị đẹp mắt trên cả Điện thoại, Máy tính bảng và Máy tính để bàn.

---

## 🚀 Hướng Dẫn Kích Hoạt GitHub Pages (.github.io)

Để đưa trang web lên hoạt động tại địa chỉ `https://gihuy8114.github.io/MyCountDown/`, bạn chỉ cần thực hiện 3 bước đơn giản:

### Bước 1: Đẩy mã nguồn lên GitHub
Nếu bạn đang dùng Git trên máy, hãy mở terminal và chạy:
```bash
git add .
git commit -m "feat: Ghibli countdown web app"
git push origin main
```

### Bước 2: Bật tính năng GitHub Pages
1. Truy cập vào repository GitHub của bạn: `https://github.com/gihuy8114/MyCountDown`
2. Bấm vào tab **Settings** (ở góc trên bên phải).
3. Ở menu bên trái, tìm và chọn mục **Pages** (dưới nhóm *Code and automation*).
4. Tại mục **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`
   - **Branch**: Chọn nhánh `main` và thư mục `/ (root)`
5. Nhấn **Save**.

### Bước 3: Thưởng thức trang web của bạn
Sau khoảng 1–2 phút, GitHub sẽ hoàn tất triển khai. Bạn sẽ nhận được đường link dạng:
👉 **`https://gihuy8114.github.io/MyCountDown/`**

---

## 🛠️ Công Nghệ Sử Dụng

- **HTML5**: Ngữ nghĩa rõ ràng, thân thiện với công cụ tìm kiếm (SEO).
- **CSS3 (Vanilla)**: Glassmorphism, CSS Custom Properties, Keyframe Animations, Flexbox & Grid.
- **JavaScript (ES6+)**: `requestAnimationFrame`, `Intl` API, Web Audio API (Synthesized ambient sounds).
- **Không có phụ thuộc (Zero Dependencies)**: Chạy mượt mà, tải trang cực nhanh, không cần `npm build` hay cài đặt phức tạp.