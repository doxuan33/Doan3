const HinhAnh = require("../models/hinhanh.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: "uploads/images/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = {
  getTopDownloads: (req, res) => {
    HinhAnh.getTopDownloads((err, results) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
      res.status(200).json(results.length ? results : { message: "Không có dữ liệu" });
    });
  },

  getAll: (req, res) => {
    const params = {
      search: req.query.search,
      danh_muc_id: req.query.danh_muc_id ? parseInt(req.query.danh_muc_id) : null,
    };

    HinhAnh.getAll(params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(result.length ? result : []);
    });
  },

  getById: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

    HinhAnh.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(404).json({ message: "Không tìm thấy hình ảnh!" });
      res.status(200).json(result);
    });
  },

  insert: [
    upload.single("thumbnail"),
    (req, res) => {
      try {
        const { tieu_de, mo_ta, danh_muc_id } = req.body;
        if (!tieu_de || !mo_ta) return res.status(400).json({ error: "Thiếu tiêu đề hoặc mô tả!" });
        
        const hinhAnh = {
          tieu_de,
          mo_ta,
          danh_muc_id: danh_muc_id ? parseInt(danh_muc_id) : null,
          duong_dan_anh_nho: req.file ? "http://localhost:1000/uploads/images/" + req.file.filename : null,
        };
        
        HinhAnh.insert(hinhAnh, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Thêm hình ảnh thành công!", data: result });
        });
      } catch (error) {
        res.status(500).json({ error: "Lỗi không xác định xảy ra!" });
      }
    },
  ],

  update: [
    upload.single("thumbnail"),
    (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });
        
        const { tieu_de, mo_ta, danh_muc_id } = req.body;
        if (!tieu_de || !mo_ta) return res.status(400).json({ error: "Thiếu tiêu đề hoặc mô tả!" });
        
        const hinhAnh = {
          tieu_de,
          mo_ta,
          danh_muc_id: danh_muc_id ? parseInt(danh_muc_id) : null,
        };
        
        if (req.file) hinhAnh.duong_dan_anh_nho = "http://localhost:1000/uploads/images/" + req.file.filename;
        
        HinhAnh.update(hinhAnh, id, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({ message: "Cập nhật hình ảnh thành công!" });
        });
      } catch (error) {
        res.status(500).json({ error: "Lỗi không xác định xảy ra!" });
      }
    },
  ],

  delete: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });
    
    HinhAnh.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(404).json({ message: "Không tìm thấy hình ảnh!" });
      
      if (result.duong_dan_anh_nho) {
        const fullPath = path.join(__dirname, "..", result.duong_dan_anh_nho);
        fs.unlink(fullPath, (err) => {
          if (err && err.code !== "ENOENT") console.error("Lỗi khi xóa file:", err);
        });
      }
      
      HinhAnh.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Xóa hình ảnh thành công!" });
      });
    });
  },
};