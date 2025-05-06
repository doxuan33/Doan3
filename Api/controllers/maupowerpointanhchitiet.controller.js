const MauPowerpointAnhChiTiet = require("../models/maupowerpointanhchitiet.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình Multer để lưu ảnh
const storage = multer.diskStorage({
  destination: "uploads/anh_chi_tiet/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = {
  getByMauPowerpointId: (req, res) => {
    const mauPowerpointId = parseInt(req.params.mauPowerpointId);
    if (isNaN(mauPowerpointId)) return res.status(400).json({ error: "ID không hợp lệ!" });

    MauPowerpointAnhChiTiet.getByMauPowerpointId(mauPowerpointId, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(result.length ? result : { message: "Không có ảnh chi tiết nào!" });
    });
  },

  getById: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

    MauPowerpointAnhChiTiet.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(404).json({ message: "Không tìm thấy ảnh chi tiết!" });
      res.status(200).json(result);
    });
  },

  insert: [
    upload.single("duong_dan_anh"),
    (req, res) => {
      try {
        const mauPowerpointId = parseInt(req.body.mau_powerpoint_id);
        const thu_tu = req.body.thu_tu ? parseInt(req.body.thu_tu) : 0;
        if (isNaN(mauPowerpointId)) return res.status(400).json({ error: "mau_powerpoint_id không hợp lệ!" });

        const anhChiTiet = {
          mau_powerpoint_id: mauPowerpointId,
          duong_dan_anh: req.file ? "/uploads/anh_chi_tiet/" + req.file.filename : null,
          thu_tu,
        };

        MauPowerpointAnhChiTiet.insert(anhChiTiet, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Thêm ảnh chi tiết thành công!", data: result });
        });
      } catch (error) {
        res.status(500).json({ error: "Lỗi không xác định xảy ra!" });
      }
    },
  ],

  update: [
    upload.single("duong_dan_anh"),
    (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

        const thu_tu = req.body.thu_tu ? parseInt(req.body.thu_tu) : null;
        const anhChiTiet = { thu_tu };

        if (req.file) anhChiTiet.duong_dan_anh = "/uploads/anh_chi_tiet/" + req.file.filename;

        MauPowerpointAnhChiTiet.update(anhChiTiet, id, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({ message: "Cập nhật ảnh chi tiết thành công!" });
        });
      } catch (error) {
        res.status(500).json({ error: "Lỗi không xác định xảy ra!" });
      }
    },
  ],

  delete: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

    MauPowerpointAnhChiTiet.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(404).json({ message: "Không tìm thấy ảnh chi tiết!" });

      // Xóa file ảnh nếu tồn tại
      const filePath = path.join(__dirname, "..", result.duong_dan_anh);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Lỗi khi xóa file ảnh:", err);
        }
      });

      // Xóa khỏi DB
      MauPowerpointAnhChiTiet.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Xóa ảnh chi tiết thành công!" });
      });
    });
  },
};
