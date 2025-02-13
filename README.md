# Server Website Văn Phòng Phẩm

🔹 **Mô tả dự án**

Đây là dự án server backend được xây dựng bằng **Node.js** cho website bán văn phòng phẩm. Server này đảm nhiệm các chức năng quản lý sản phẩm, đặt hàng, người dùng và các API phục vụ cho website cũng như ứng dụng di động.

## Tính năng

- **Quản lý sản phẩm:** Tạo, sửa, xóa và truy xuất danh sách sản phẩm.  
- **Xử lý người dùng:** Đăng ký, đăng nhập và quản lý thông tin người dùng.  
- **Đặt hàng & thanh toán:** Tạo đơn hàng, xử lý thanh toán và quản lý đơn hàng.  
- **Quản lý tồn kho:** Theo dõi số lượng tồn và cập nhật thông tin kho hàng.  
- **API RESTful:** Cung cấp các API cho website và ứng dụng di động.  

---

## Công nghệ sử dụng

- **Node.js:** Môi trường chạy JavaScript phía server.  
- **Express.js:** Framework web cho Node.js.  
- **MongoDB:** Cơ sở dữ liệu NoSQL.  
- **Mongoose:** ORM hỗ trợ làm việc với MongoDB.  
- Các thư viện hỗ trợ khác như: `dotenv`, `jsonwebtoken`, `bcrypt`, v.v.  

---

## Yêu cầu hệ thống

- **Node.js:** Phiên bản 12 trở lên.  
- **Trình quản lý thư viện:** npm hoặc yarn.  
- **Cơ sở dữ liệu:** MongoDB.  

---

## Hướng dẫn cài đặt

### 1. Clone repository  

Sử dụng lệnh sau để clone repository:  

```bash
git clone https://github.com/tqtwin/server-project.git
```

### 2. Cài đặt các phụ thuộc  

Sử dụng npm:  
```bash
npm install
```

Hoặc sử dụng yarn:  
```bash
yarn install
```

### 3. Cấu hình file `.env`  

Tạo file `.env` ở thư mục gốc và thêm nội dung sau:  

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/office-supply
JWT_SECRET=your_secret_key
```

### 4. Chạy server  

Khởi động server bằng lệnh sau:  

```bash
node index.js
```

---

## Hướng dẫn sử dụng API

Server cung cấp các endpoint API cơ bản như sau:  

- `GET /api/v1/products`: Lấy danh sách tất cả sản phẩm.  
- `GET /api/v1/products/:id`: Lấy thông tin chi tiết của một sản phẩm theo ID.  
- `POST /api/v1/users/signup`: Đăng ký người dùng mới.  
- `POST /api/v1/users/login`: Đăng nhập người dùng.  
- `POST /api/v1/orders`: Tạo đơn hàng mới.

