const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // 🔥 Đọc biến môi trường từ .env

const db = require("./common/db"); // ✅ Kết nối MySQL từ file bạn cung cấp

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const danhgiaRouter = require('./routes/danhgia.route');
const danhmucRouter = require('./routes/danhmuc.route');
const lichsutaixuongRouter = require('./routes/lichsutaixuong.route');
const maupowerpointRouter = require('./routes/maupowerpoint.route');
const nguoidungRouter = require('./routes/nguoidung.route');

const app = express();
const port = process.env.PORT || 1000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// ✅ Cấu hình CORS
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));


// ✅ Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Đổi từ `false` -> `true`
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// ✅ Middleware kiểm tra JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Access Denied: Invalid Token Format' });
    }

    try {
        const decoded = jwt.verify(tokenParts[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid Token' });
    }
};

// ✅ Route: Đăng ký (Register)
app.post('/auth/register', async (req, res) => {
    try {
        const { ten, email, mat_khau } = req.body;

        // Kiểm tra nếu email đã tồn tại
        db.query("SELECT * FROM nguoi_dung WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
            if (results.length > 0) {
                return res.status(400).json({ error: "Email đã tồn tại!" });
            }

            const hashedPassword = await bcrypt.hash(mat_khau, 10);
            const newUser = { ten, email, mat_khau: hashedPassword };

            db.query("INSERT INTO nguoi_dung SET ?", newUser, (error, result) => {
                if (error) return res.status(500).json({ error: "Lỗi khi tạo tài khoản!" });
                res.json({ message: "Đăng ký thành công!", userId: result.insertId });
            });
        });

    } catch (err) {
        res.status(500).json({ error: "Lỗi server khi đăng ký!" });
    }
});

// ✅ Route: Đăng nhập (Login) bằng email hoặc username
app.post('/auth/login', (req, res) => {
    const { emailOrUsername, mat_khau } = req.body;

    db.query(
        "SELECT * FROM nguoi_dung WHERE email = ? OR ten = ?", 
        [emailOrUsername, emailOrUsername], 
        async (err, results) => {
            if (err) return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
            if (results.length === 0) {
                return res.status(400).json({ error: "Tài khoản hoặc mật khẩu không đúng!" });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);

            if (!isMatch) {
                return res.status(400).json({ error: "Tài khoản hoặc mật khẩu không đúng!" });
            }

            const token = jwt.sign({ id: user.id, ten: user.ten, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: "Đăng nhập thành công!", token });
        }
    );
});
// ✅ Route: Lấy thông tin người dùng
app.get('/auth/me', verifyToken, (req, res) => {
    const userId = req.user.id;

    db.query("SELECT id, ten, email FROM nguoi_dung WHERE id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
        if (!result.length) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }
        res.json({ message: "Lấy thông tin thành công!", user: result[0] });
    });
});

// ✅ Các API KHÔNG yêu cầu xác thực
app.use('/danhmucs', danhmucRouter);
app.use('/lichsutaixuongs', lichsutaixuongRouter);
app.use('/maupowerpoints', maupowerpointRouter);
app.use('/nguoidungs', nguoidungRouter);
app.use('/danhgias', danhgiaRouter);
// ✅ Các API yêu cầu xác thực (Bảo vệ bằng `verifyToken`)
app.use('/users', verifyToken, usersRouter);

// ✅ Xử lý lỗi 404
app.use((req, res, next) => {
    next(createError(404, 'Route not found'));
});

// ✅ Middleware xử lý lỗi
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

// ✅ Khởi động Server
app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});

module.exports = app;
