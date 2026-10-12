# CHUYÊN ĐỀ 08: HƯỚNG DẪN THAY ĐỔI THIẾT KẾ THEO TRIẾT LÝ APPLE

## 1. Mục Đích

Tài liệu này hướng dẫn cách áp dụng **triết lý thiết kế Apple (Apple Design Principles)** vào dự án `tieu-hoc-vui`, kết hợp với phong cách thiết kế thiếu nhi hiện có. Mục tiêu: giữ được tính thân thiện, vui nhộn cho trẻ em, đồng thời nâng cao **rõ ràng, nhất quán và trải nghiệm chuyên nghiệp** theo chuẩn Apple.

> **Nguyên tắc vàng**: Áp dụng **30–40% triết lý Apple**, kết hợp **60–70% triết lý Child-Centered Design** hiện tại.

---

## 2. Nguồn Tham Khảo

- [Apple Human Interface Guidelines (HIG)](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [San Francisco Font](https://developer.apple.com/fonts/)

---

## 3. Các Nguyên Tắc Apple Áp Dụng

### 3.1. Clarity (Sự Trong Suốt)

**Áp dụng:**
- Mỗi màn hình chỉ tập trung vào **một nhiệm vụ chính**.
- Núi quan trọng nhất (ví dụ: "Bắt đầu", "Tiếp tục") phải nổi bật nhất.
- Hạn chế số lượng thông báo, menu và hiệu ứng đồng thời.
- Câu lệnh ngắn gọn, dễ hiểu: "Chọn đáp án đúng", "Nghe lại", "Thử lần nữa".

**Thay đổi cần thực hiện:**
- Kiểm tra mỗi màn hình: có quá nhiều thành phần không?
- Đảm bảo nút hành động chính luôn được đặt ở vị trí dễ tiếp cận (dưới cùng hoặc giữa màn hình).
- Rút ngắn văn bản hướng dẫn, dùng icon kèm để tăng độ rõ.

### 3.2. Deference (Sự Tôn Trọng Nội Dung)

**Áp dụng:**
- Nền sáng, mềm, ít trang trí phía sau câu hỏi.
- Sử dụng thẻ hoặc lớp kính mờ nhẹ cho điểm số, hướng dẫn và phần thưởng.
- Hình ảnh, nhân vật không được che mất bài học.
- Màu sắc sinh động chỉ dùng cho trạng thái và hành động quan trọng.

**Thay đổi cần thực hiện:**
- Thay nền trắng tinh khiết bằng nền kem dịu mắt (`#F8F9FD`).
- Áp dụng `backdrop-filter: blur(10px)` cho các thẻ thông tin.
- Đảm bảo hình ảnh nền luôn ở lớp sau (z-index thấp), nội dung ở lớp trên.

### 3.3. Depth (Chiều Sâu)

**Áp dụng:**
- Câu hỏi, thanh tiến trình và phần thưởng có thể nằm trong các thẻ nổi nhẹ.
- Modal, bảng đáp án hoặc màn hình chi tiết dùng bóng thấp và chuyển cảnh mượt.
- Tránh bóng quá đậm hoặc hiệu ứng 3D gây rối mắt.

**Thay đổi cần thực hiện:**
- Áp dụng bóng nhẹ cho thẻ nội dung:
  ```css
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  ```
- Dùng `transition` mượt cho modal và thẻ:
  ```css
  transition: transform 0.2s ease, opacity 0.2s ease;
  ```

### 3.4. Consistency (Nhất Quán)

**Áp dụng:**
- Tạo hệ thống token chung cho màu sắc, kích thước, font, bo góc.
- Đảm bảo mọi nút, thẻ, icon đều tuân thủ cùng một chuẩn.

**Thay đổi cần thực hiện:**
- Xây dựng file token CSS (hoặc biến SCSS):
  ```css
  :root {
    --color-primary: #10AC84;
    --color-secondary: #54A0FF;
    --color-accent: #EE5253;
    --color-background: #F8F9FD;
    --color-card: #FFFFFF;
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --font-body: 'Be Vietnam Pro', sans-serif;
    --font-heading: 'Quicksand', sans-serif;
    --font-display: 'Comfortaa', sans-serif;
  }
  ```

### 3.5. Direct Manipulation (Thao Tác Trực Tiếp)

**Áp dụng:**
- Cho trẻ chạm, kéo, lật hoặc chọn trực tiếp vào đáp án.
- Mỗi thao tác phải có phản hồi ngay lập tức: nút nảy nhẹ, âm thanh ngắn, rung nhẹ.
- Câu trả lời sai nên đổi màu nhẹ và hiển thị "Cố lên nhé!" thay vì cảnh báo tiêu cực.

**Thay đổi cần thực hiện:**
- Thêm hiệu ứng nảy nhẹ khi chạm nút:
  ```css
  &:active {
    transform: scale(0.95);
  }
  ```
- Kết hợp âm thanh phản hồi và rung nhẹ (nếu thiết bị hỗ trợ).

---

## 4. Áp Dụng Typography Theo Phong Cách Apple

### 4.1. Font Chữ

| Thành phần | Font đề xuất | Ghi chú |
|---|---|---|
| Nội dung bài học | `Be Vietnam Pro` | Dễ đọc, hỗ trợ dấu tiếng Việt |
| Tiêu đề và nút bấm | `Quicksand` hoặc `Comfortaa` | Thân thiện, dễ thương |
| Mô-đun tập viết lớp 1 | `HP001 4 Hàng` | Mô phỏng vở viết chuẩn |
| Mã nguồn | `SF Mono` tương đương hoặc `JetBrains Mono` | Không dùng San Francisco trực tiếp |

> **Lưu ý**: San Francisco (SF) là font độc quyền của Apple, không nên nhúng trực tiếp vào dự án web. Dùng `Be Vietnam Pro` hoặc `Inter` là lựa chọn thay thế tốt.

### 4.2. Dynamic Type Tương Đương

Thay vì dùng pixel cố định, CSS có thể dùng:

```css
font-size: clamp(1rem, 1.35vw + 0.55rem, 1.5rem);
```

**Nguyên tắc:**
- Text thường: `1rem–1.125rem`
- Tiêu đề nhỏ: `1.25rem–1.5rem`
- Tiêu đề lớn: `1.75rem–2.5rem`
- Nút bấm: tối thiểu `64dp`
- Khoảng cách nội dung: `16–24px`
- Hỗ trợ chữ lớn và Dark Mode
- Giảm chuyển động khi người dùng yêu cầu.

---

## 5. Hệ Thống Màu Sắc & Hiệu Ứng

### 5.1. Bảng Màu

| Màu | Mã | Mục đích |
|---|---|---|
| Vàng Nắng | `#FF9F43` | Nút hành động nổi bật |
| Xanh Lá Non | `#10AC84` | Trạng thái đúng, Toán |
| Xanh Da Trời | `#54A0FF` | Trạng thái khám phá, Tiếng Anh |
| Đỏ San Hô | `#EE5253` | Nút hành động quan trọng |
| Nền Kem | `#F8F9FD` | Nền chính, giảm mỏi mắt |

### 5.2. Hiệu Ứng

- **Blur nhẹ**: `backdrop-filter: blur(10px)` cho thẻ thông tin.
- **Bóng nhẹ**: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)`.
- **Chuyển cảnh mượt**: `transition: all 0.2s ease`.
- **Dark Mode**: Tự động chuyển đổi dựa trên `prefers-color-scheme`.

---

## 6. Quy Trình Thay Đổi

### Bước 1: Kiểm Tra Hiện Trạng
- Liệt kê các component hiện tại.
- Đánh giá mức độ tuân thủ nguyên tắc Apple.

### Bước 2: Xây Dựng Token
- Tạo file `src/styles/tokens.css` hoặc `.scss`.
- Định nghĩa biến màu, font, bo góc, bóng.

### Bước 3: Cập Nhật Component
- Áp dụng token vào từng component.
- Thêm hiệu ứng phản hồi (nảy, âm thanh, rung).

### Bước 4: Kiểm Tra Trải Nghiệm
- Chạy thử trên thiết bị thực.
- Kiểm tra Dark Mode, chữ lớn, giảm chuyển động.

### Bước 5: Cập Nhật Tài Liệu
- Ghi chép các thay đổi vào file này.
- Cập nhật README nếu cần.

---

## 7. Checklist Áp Dụng Apple Design

- [ ] Mỗi màn hình chỉ có một nhiệm vụ chính
- [ ] Nút hành động chính luôn nổi bật và dễ tiếp cận
- [ ] Nền sáng, mềm, không trang trí quá mức
- [ ] Thẻ thông tin dùng blur nhẹ
- [ ] Bóng và chuyển cảnh mượt
- [ ] Hệ thống token màu/font/bo góc nhất quán
- [ ] Phản hồi ngay lập tức khi tương tác
- [ ] Hỗ trợ Dark Mode và chữ lớn
- [ ] Giảm chuyển động khi người dùng yêu cầu

---

## 8. Tài Liệu Tham Khảo

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [San Francisco Font](https://developer.apple.com/fonts/)
- [CSS clamp() cho responsive font](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp())
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
