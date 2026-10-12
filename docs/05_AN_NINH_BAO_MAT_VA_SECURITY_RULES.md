# CHUYÊN ĐỀ 05: AN NINH BẢO MẬT, QUYỀN TRẺ EM & FIREBASE SECURITY RULES
## Bảo Vệ Dữ Liệu Học Sinh Tiểu Học, Chống Thất Thoát Quota & Tuân Thủ Chuẩn An Toàn Trẻ Em Quốc Tế

---

## 1. Tiêu Chuẩn Bảo Vệ Quyền Riêng Tư Của Trẻ Em (Child Privacy Standards)

Ứng dụng phục vụ trẻ em từ 6 đến 11 tuổi (độ tuổi nhạy cảm cần được bảo vệ đặc biệt theo pháp luật quốc tế và Việt Nam):
- **COPPA (Đạo luật bảo vệ quyền riêng tư của trẻ em trên mạng - Hoa Kỳ)**.
- **GDPR-K (Quy định bảo vệ dữ liệu chung cho trẻ em - Liên minh Châu Âu)**.
- **Nghị định 56/2017/NĐ-CP & Luật Trẻ em 2016 (Việt Nam)**: Bảo vệ tính bí mật đời sống riêng tư và thông tin cá nhân của trẻ em trên môi trường mạng.

### 1.1. Nguyên Tắc "Không Thu Thập Dữ Liệu Nhạy Cảm" (Zero PII Policy)
1. **Không yêu cầu Họ tên thật**: Học sinh chỉ sử dụng Biệt danh dễ thương (Nickname: Bé Bắp, Thỏ Ngọc, Siêu Nhân Nhí...).
2. **Không thu thập Vị trí địa lý (GPS)**: Ứng dụng không xin quyền truy cập vị trí thiết bị.
3. **Không tính năng Chat mở**: Trẻ không thể nhắn tin với người lạ; không có nguy cơ bị quấy rối hoặc bắt nạt trên mạng.
4. **Không gắn SDK theo dõi quảng cáo**: Tuyệt đối không cài đặt Facebook Pixel, Google AdMob hoặc bất kỳ mạng lưới quảng cáo hướng đối tượng nào.

---

## 2. Mã Nguồn Quy Tắc Bảo Mật Firestore Hoàn Chỉnh (`firestore.rules`)

File cấu hình sản xuất này ngăn chặn hoàn toàn việc người dùng giả mạo điểm số, bảo vệ dữ liệu tiến trình học và khóa chặt các tài nguyên nhạy cảm:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Hàm tiện ích kiểm tra đăng nhập
    function isAuthenticated() {
      return request.auth != null;
    }

    // Kiểm tra người dùng có phải chính chủ sở hữu tài nguyên hay không
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Kiểm tra quyền Quản trị viên (Admin Custom Claims)
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    // 1. QUY TẮC CHO HỒ SƠ NGƯỜI DÙNG (/users/{userId})
    match /users/{userId} {
      // Cho phép đọc thông tin cơ bản của chính mình
      allow read: if isOwner(userId) || isAdmin();

      // Cho phép tạo tài khoản lần đầu với cấu trúc hợp lệ
      allow create: if isOwner(userId)
                    && request.resource.data.role == 'student'
                    && request.resource.data.gamification.stars <= 50 // Giới hạn sao tặng khởi đầu
                    && request.resource.data.gamification.gems <= 10;

      // Cho phép cập nhật hồ sơ với ràng buộc chặt chẽ (Chống hack sao/gems)
      allow update: if isOwner(userId)
                    && request.resource.data.role == resource.data.role // Không được tự ý đổi role thành admin
                    // Chống gian lận: Mỗi lần cập nhật không được tăng đột biến quá 50 sao
                    && (request.resource.data.gamification.stars <= resource.data.gamification.stars + 50)
                    // Không cho phép sửa đổi ngày tạo tài khoản
                    && request.resource.data.createdAt == resource.data.createdAt;

      // Tuyệt đối không cho phép xóa tài khoản tùy tiện từ client
      allow delete: if isAdmin();

      // 2. QUY TẮC CHO TIẾN TRÌNH HỌC TẬP (/users/{userId}/progress/{progressId})
      match /progress/{progressId} {
        allow read: if isOwner(userId) || isAdmin();
        
        // Cho phép lưu kết quả bài học của chính học sinh
        allow write: if isOwner(userId);
      }
    }

    // 3. QUY TẮC CHO MỤC LỤC GIÁO TRÌNH TĨNH (/curriculums/{gradeId})
    match /curriculums/{gradeId} {
      // Mọi học sinh đã đăng nhập (hoặc ẩn danh) đều được đọc danh mục bài học
      allow read: if isAuthenticated();
      // Chỉ Admin mới có quyền sửa đổi nội dung giáo trình
      allow write: if isAdmin();
    }

    // 4. QUY TẮC CHO BẢNG XẾP HẠNG (/leaderboards/{boardId})
    match /leaderboards/{boardId} {
      // Học sinh chỉ được quyền xem (Read-only)
      allow read: if isAuthenticated();
      // Client không được phép tự ý ghi đè bảng xếp hạng
      allow write: if isAdmin();
    }

    // 5. QUY TẮC CHO THÔNG TIN CẤU HÌNH HỆ THỐNG (/system_config/{configId})
    match /system_config/{configId} {
      allow read: if true; // Công khai để kiểm tra phiên bản app và trạng thái bảo trì
      allow write: if isAdmin();
    }
  }
}
```

---

## 3. Mã Nguồn Quy Tắc Bảo Mật Lưu Trữ File (`storage.rules`)

Firebase Storage chỉ được sử dụng cho việc học sinh lưu tranh vẽ tự do hoặc ảnh avatar cá nhân hóa. Quy tắc này giới hạn kích thước tối đa **200 Kilobyte** để bảo vệ trọn vẹn dung lượng 5GB miễn phí:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Hàm kiểm tra định dạng ảnh an toàn
    function isImage() {
      return request.resource.contentType.matches('image/(jpeg|png|webp)');
    }

    // Khống chế dung lượng file tối đa 200KB (0.2MB) - Rất quan trọng!
    function isUnder200KB() {
      return request.resource.size <= 200 * 1024;
    }

    // Thư mục lưu ảnh bài vẽ và avatar của học sinh
    match /users/{userId}/{fileName} {
      // Học sinh chỉ được xem và tải lên file trong thư mục mang chính UID của mình
      allow read: if request.auth != null && request.auth.uid == userId;
      
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && isImage()
                   && isUnder200KB();

      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    // Chặn toàn bộ các đường dẫn khác
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 4. Cơ Chế "Cổng Phụ Huynh" (Parental Gate & PIN Protection)

Để ngăn trẻ em vô tình bấm vào các trang cài đặt nâng cao, đổi ngôn ngữ, liên kết tài khoản hoặc đăng xuất, ứng dụng tích hợp hai tầng bảo vệ:

```mermaid
flowchart TD
    ChildAction["Bé nhấn vào nút: 'Cài Đặt Phụ Huynh' hoặc 'Thoát Tài Khoản'"] --> CheckPIN{"Đã thiết lập mã PIN 4 số chưa?"}

    CheckPIN -->|Chưa có PIN| MathChallenge["🛡️ Tầng 1: Thử Thách Toán Học Người Lớn<br/>Yêu cầu giải bài toán ngẫu nhiên:<br/>'Nhập kết quả phép tính: 17 x 8 = ?'"]
    MathChallenge --> CheckMath{"Học sinh lớp 1-2 có giải được không?"}
    CheckMath -->|Giải đúng (Người lớn)| AccessGranted["Mở giao diện phụ huynh thành công ✅"]
    CheckMath -->|Giải sai| AccessDenied["Báo lỗi & Quay lại bài học ❌"]

    CheckPIN -->|Đã có PIN| PinPrompt["🔒 Tầng 2: Nhập Mã PIN Bảo Mật (4 Chữ Số)"]
    PinPrompt --> VerifyHash{"Kiểm tra mã băm SHA-256 trên thiết bị"}
    VerifyHash -->|Khớp mã PIN| AccessGranted
    VerifyHash -->|Sai mã PIN| AccessDenied
```

- **Lưu trữ mã PIN**: Mã PIN của phụ huynh được băm bằng thuật toán **SHA-256** kèm muối (Salt) và lưu cục bộ trong `FlutterSecureStorage` (trên Mobile) hoặc `IndexedDB` mã hóa (trên Web). Không truyền mã PIN dạng rõ (Plaintext) qua mạng.

---

## 5. Phòng Chống Botnet & Bảo Vệ Hạn Ngạch Bằng Firebase App Check

Một rủi ro lớn nhất đối với gói **Firebase Spark Plan** là bị kẻ xấu dùng Script/Bot cào dữ liệu hoặc spam truy vấn khiến tài khoản cạn kiệt 50,000 Reads trong vài phút.

**Giải pháp: Kích hoạt Firebase App Check**
1. **Trên Android**: Sử dụng chứng thực **Play Integrity API** - chỉ các ứng dụng được cài đặt từ Google Play Store chính thức mới được phép gửi request đến Firestore.
2. **Trên iOS**: Sử dụng **DeviceCheck / App Attest API** - chứng thực thiết bị Apple chính hãng, loại bỏ hoàn toàn các trình giả lập độc hại.
3. **Trên Web**: Sử dụng **reCAPTCHA Enterprise** (Miễn phí 10,000 lần đánh giá bảo mật mỗi tháng) để chặn bot tự động.

```dart
// Khởi tạo App Check trong main.dart
await FirebaseAppCheck.instance.activate(
  androidProvider: AndroidProvider.playIntegrity,
  appleProvider: AppleProvider.appAttest,
  webProvider: ReCaptchaEnterpriseProvider('SITE_KEY_RECAPTCHA'),
);
```
- Khi App Check được kích hoạt với chế độ **Enforcement (Bắt buộc)**, mọi yêu cầu từ Postman, Curl hay Botnet không có Token chứng thực hợp lệ từ thiết bị thật sẽ bị Google **chặn ngay tại cổng biên mạng (Network Edge)**, hoàn toàn **không tính vào hạn ngạch Firestore Reads** của dự án!
