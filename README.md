# Server Website Văn Phòng Phẩm

Đây là dự án server backend được xây dựng bằng **Node.js** cho website bán văn phòng phẩm. Server này đảm nhiệm các chức năng quản lý sản phẩm, đặt hàng, người dùng và các API phục vụ cho website cũng như ứng dụng di động.

## Tính năng

- **Quản lý sản phẩm:** Tạo, sửa, xóa và truy xuất danh sách sản phẩm.
- **Xử lý người dùng:** Đăng ký, đăng nhập và quản lý thông tin người dùng.
- **Đặt hàng & thanh toán:** Tạo đơn hàng, xử lý thanh toán và quản lý đơn hàng.
- **Quản lý tồn kho:** Theo dõi số lượng tồn và cập nhật thông tin kho hàng.
- **API RESTful:** Cung cấp các API cho website và ứng dụng di động.

## Công nghệ sử dụng

- **Node.js:** Môi trường chạy JavaScript phía server.
- **Express.js:** Framework web cho Node.js.
- **MongoDB:** Cơ sở dữ liệu NoSQL (hoặc cơ sở dữ liệu khác nếu bạn thay thế).
- **Mongoose:** ORM hỗ trợ làm việc với MongoDB.
- Các thư viện hỗ trợ khác như: `dotenv`, `jsonwebtoken`, `bcrypt`, v.v.

## Yêu cầu hệ thống

- Node.js phiên bản 12 trở lên.
- npm hoặc yarn để quản lý thư viện.
- MongoDB.

## Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/tqtwin/server-project.git
### 2. Cài đặt các phụ thuộc
Sử dụng npm: npm install
sử dụng yarn: yarn install
### 3.env dựa trên có sẵn
ví dụ 
PORT=3000
MONGO_URI=mongodb://localhost:27017/office-supply
JWT_SECRET=your_secret_key
### 4. chạy server
node index.js
### Hướng dẫn sử dụng API
Server cung cấp các endpoint API cơ bản như:

GET /api/v1/products: Lấy danh sách tất cả sản phẩm.
GET /api/v1/products/:id: Lấy thông tin chi tiết của 1 sản phẩm theo ID.
POST /api/v1/users/signup: Đăng ký người dùng mới.
POST /api/v1/users/login: Đăng nhập người dùng.
POST /api/v1/orders: Tạo đơn hàng mới.
