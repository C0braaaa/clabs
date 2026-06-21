# Cấu Trúc Layout & Hệ Thống Theme (Clabs)

Chào bạn! Hệ thống giao diện của ứng dụng đã được xây dựng theo các chuẩn mực thiết kế hiện đại (Neo-Minimalist Grid) và tuân thủ chặt chẽ chỉ dẫn thiết kế trong `frontend-design.md`.

Dưới đây là tài liệu chi tiết giúp bạn hiểu rõ và dễ dàng tùy biến giao diện hoặc đổi màu sắc sau này.

---

## 1. Hệ Thống CSS Variables (Đặt Biến Màu Sắc)

Tất cả các màu sắc cốt lõi được định nghĩa thông qua các biến CSS (Custom Properties) trong tệp `src/app/globals.css`.

Bạn có thể chỉnh sửa màu sắc ở một nơi duy nhất này, hệ thống sẽ tự động cập nhật trên toàn bộ ứng dụng (cho cả chế độ sáng và chế độ tối).

| Biến CSS          | Tên Lớp Tailwind           | Ý Nghĩa / Mục Đích Sử Dụng                               |
| :---------------- | :------------------------- | :------------------------------------------------------- |
| `--bg-page`       | `bg-bg-page`               | Màu nền chính của toàn bộ trang                          |
| `--bg-card`       | `bg-bg-card`               | Màu nền của các thẻ card công cụ                         |
| `--bg-card-hover` | `bg-bg-card-hover`         | Màu nền card khi di chuột qua                            |
| `--border-ui`     | `border-border-ui`         | Màu đường viền mảnh (grid lines, dividers)               |
| `--brand`         | `text-brand`, `bg-brand`   | Màu thương hiệu chủ đạo (Soft Sky Blue)                  |
| `--brand-hover`   | `bg-brand-hover`           | Màu thương hiệu khi tương tác (hover)                    |
| `--accent`        | `text-accent`, `bg-accent` | Màu nhấn nổi bật (Emerald Green cho trạng thái Sẵn sàng) |
| `--secondary`     | `text-secondary`           | Màu phụ (Amber Orange cho trạng thái Sắp ra mắt)         |
| `--text-primary`  | `text-text-primary`        | Màu chữ chính (Slate-900 ở Light, Slate-50 ở Dark)       |
| `--text-muted`    | `text-text-muted`          | Màu chữ phụ, mô tả ngắn                                  |
| `--glow-color`    | _Dùng trong CSS_           | Màu đổ bóng phát sáng neon khi di chuột qua card         |

---

## 2. Phông Chữ (Typography)
Dự án sử dụng phông chữ **Inter** (`--font-inter`) làm phông chữ chính cho cả phần Tiêu đề (`font-display`) và Nội dung (`font-body`) để mang lại giao diện tinh tế, hiện đại và vô cùng dễ đọc.

Cấu hình phông chữ được định nghĩa tại `src/app/layout.js`.

---

## 3. Cấu Trúc Layout (Header - Main - Footer)

Bố cục giao diện được tách biệt rõ ràng trong tệp `src/app/page.js`:

- **Header**: Thanh điều hướng dạng `sticky` (cố định ở đầu trang) tích hợp tính năng mờ nền (`backdrop-blur`) cao cấp, logo phát sáng gradient và liên kết nhanh đến GitHub.
- **Main**:
  - **Hero Section**: Giới thiệu tiêu đề lớn mang tính tương phản cao kết hợp hiệu ứng chữ gradient.
  - **Khung Tìm Kiếm & Lọc**: Gồm thanh tìm kiếm tức thời (real-time) và các nút lọc nhanh danh mục (Tất cả, Tiện ích, Tài liệu, Hình ảnh, Lập trình).
  - **Grid Cards**: Lưới hiển thị các thẻ công cụ có khả năng phản hồi kích thước màn hình cực kỳ rộng rãi (hỗ trợ hiển thị tới 5 card trên một hàng ở màn hình siêu rộng: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`).
- **Footer**: Chứa bản quyền, các liên kết phụ và thông điệp thương hiệu.

---

## 4. Các Hiệu Ứng Nổi Bật (Micro-interactions)

- **Hiệu ứng Card Glow (`card-glow`)**: Khi di chuột lên bất kỳ card nào, card sẽ dịch chuyển nhẹ lên trên, viền chuyển sang màu thương hiệu và có một luồng sáng neon tinh tế lan tỏa phía dưới.
- **Hiệu ứng Grid Background (`grid-bg`)**: Nền trang web được phủ một lớp lưới kẻ ô mờ giúp tạo chiều sâu không gian (cyber-industrial look).
- **Bộ Lọc Thời Gian Thực**: Trải nghiệm mượt mà không cần tải lại trang khi người dùng tìm kiếm hoặc click lọc danh mục.

---

## 5. Nút Bật/Tắt Giao Diện (Theme Toggle)

Ứng dụng hỗ trợ chuyển đổi linh hoạt giữa giao diện sáng (Light Mode) và tối (Dark Mode):

- **Cơ chế hoạt động**: Khi người dùng nhấn nút biểu tượng Mặt trời/Mặt trăng ở Header, ứng dụng sẽ chuyển đổi lớp `.dark`/`.light` trên thẻ `<html>` và lưu cấu hình vào `localStorage` của trình duyệt.
- **Trạng thái khởi đầu**: Khi tải trang lần đầu, hệ thống sẽ tự động quét kiểm tra tùy chọn cấu hình cũ trong `localStorage` hoặc tự động áp dụng chế độ theo hệ điều hành (System preference) nếu không tìm thấy cấu hình cũ.
- **Đồng bộ hóa**: Biến CSS tương ứng với giao diện mới sẽ được kích hoạt tức thì.

---

## 6. Chuyển Đổi Ngôn Ngữ Dropdown (Language Switcher)

Ứng dụng hỗ trợ hai ngôn ngữ: **Tiếng Việt (Vietnamese)** và **English**.

- **Cơ chế hoạt động**: Khi nhấn vào nút biểu tượng Quả địa cầu trong Header, một trình đơn thả xuống (Dropdown) sẽ hiển thị với các tùy chọn tương ứng.
- **Đặc trưng thiết kế & Trải nghiệm**:
  - Biểu tượng mũi tên chevron tự động xoay 180 độ khi đóng/mở dropdown.
  - Tích hợp lớp phủ trong suốt (click-away backdrop) để nhấp ra ngoài là đóng dropdown nhanh chóng.
  - Ngôn ngữ đang hoạt động sẽ hiển thị dấu tích (checkmark) kèm màu nền thương hiệu dịu nhẹ.
- **Đồng bộ & Lưu trữ**: Lựa chọn ngôn ngữ được lưu trực tiếp vào `localStorage` dưới khóa `lang` giúp giữ nguyên thiết lập trong lần truy cập tiếp theo.

---

## 7. Thư Viện Biểu Tượng FontAwesome
Dự án đã tích hợp thư viện **FontAwesome Free** (`@fortawesome/fontawesome-free`).
- **Cách sử dụng**: Bạn có thể sử dụng trực tiếp các thẻ `<i>` với các lớp biểu tượng tiêu chuẩn của FontAwesome.
- **Ví dụ**:
  - Biểu tượng trang chủ: `<i className="fa-solid fa-house"></i>`
  - Biểu tượng cài đặt: `<i className="fa-solid fa-gear"></i>`
  - Biểu tượng quả địa cầu: `<i className="fa-solid fa-globe"></i>`
