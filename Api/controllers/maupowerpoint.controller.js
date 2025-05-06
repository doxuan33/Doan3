const MauPowerpoint = require("../models/maupowerpoint.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = {
  getTotal: (req, res) => {
    MauPowerpoint.getTotal((err, total) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(total);
      });
    },
  getTopDownloads: (req, res) => {
    MauPowerpoint.getTopDownloads((err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu!" });
        res.status(200).json(results.length ? results : { message: "Không có dữ liệu" });
    });
  },
  getAll: (req, res) => {
    const params = {
      search: req.query.search,
      danh_muc_id: req.query.danh_muc_id ? parseInt(req.query.danh_muc_id) : null,
    };

    MauPowerpoint.getAll(params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(result.length ? result : []);
    });
  },

  getById: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

    MauPowerpoint.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(404).json({ message: "Không tìm thấy mẫu PowerPoint!" });
      res.status(200).json(result);
    });
  },

  insert: [
    upload.fields([{ name: "file" }, { name: "thumbnail" }]),
    (req, res) => {
      try {
        console.log("Received data:", Object.keys(req.body), req.files); // Debug log

        const keys = Object.keys(req.body);
        const tieu_de_key = keys.find(k => k.trim() === "tieu_de");
        const mo_ta_key = keys.find(k => k.trim() === "mo_ta");
        const danh_muc_key = keys.find(k => k.trim() === "danh_muc_id");

        const tieu_de = tieu_de_key ? req.body[tieu_de_key].trim() : null;
        const mo_ta = mo_ta_key ? req.body[mo_ta_key].trim() : null;
        const danh_muc_id = danh_muc_key ? parseInt(req.body[danh_muc_key]) : null;

        if (!tieu_de || !mo_ta) {
          return res.status(400).json({ error: "Thiếu tiêu đề hoặc mô tả!" });
        }
        if (danh_muc_key && isNaN(danh_muc_id)) {
          return res.status(400).json({ error: "danh_muc_id phải là số!" });
        }
        const mauPowerpoint = {
          tieu_de: tieu_de || null, 
          mo_ta: mo_ta || null,
          danh_muc_id: danh_muc_id || null,
          duong_dan_tap_tin: req.files?.file ? "/uploads/" + req.files["file"][0].filename : null,
          duong_dan_anh_nho: req.files?.thumbnail ? "http://localhost:1000/uploads/" + req.files["thumbnail"][0].filename : null,
          la_pro: req.body.la_pro ? req.body.la_pro === "true" : false,
          gia: req.body.gia ? parseFloat(req.body.gia) : null,
        };
        MauPowerpoint.insert(mauPowerpoint, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: "Thêm mẫu PowerPoint thành công!", data: result });
        });
      } catch (error) {
        res.status(500).json({ error: "Lỗi không xác định xảy ra!" });
      }
    },
  ],

  update: [
    upload.fields([{ name: "file" }, { name: "thumbnail" }]),
    (req, res) => {
      try {
        console.log("Received update data:", Object.keys(req.body), req.files); // Debug log

        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

        const keys = Object.keys(req.body);
        const tieu_de_key = keys.find(k => k.trim() === "tieu_de");
        const mo_ta_key = keys.find(k => k.trim() === "mo_ta");
        const danh_muc_key = keys.find(k => k.trim() === "danh_muc_id");

        const tieu_de = tieu_de_key ? req.body[tieu_de_key].trim() : null;
        const mo_ta = mo_ta_key ? req.body[mo_ta_key].trim() : null;
        const danh_muc_id = danh_muc_key ? parseInt(req.body[danh_muc_key]) : null;

        if (!tieu_de || !mo_ta) {
          return res.status(400).json({ error: "Thiếu tiêu đề hoặc mô tả!" });
        }
        if (danh_muc_key && isNaN(danh_muc_id)) {
          return res.status(400).json({ error: "danh_muc_id phải là số!" });
        }

        const mauPowerpoint = {
          tieu_de: tieu_de || null,
          mo_ta: mo_ta || null,
          danh_muc_id: danh_muc_id || null,
          la_pro: req.body.la_pro ? req.body.la_pro === "true" : undefined,
          gia: req.body.gia ? parseFloat(req.body.gia) : undefined,
        };
        
        if (req.files?.file) mauPowerpoint.duong_dan_tap_tin = "/uploads/" + req.files["file"][0].filename;
        if (req.files?.thumbnail) mauPowerpoint.duong_dan_anh_nho = "http://localhost:1000/uploads/" + req.files["thumbnail"][0].filename;

        MauPowerpoint.update(mauPowerpoint, id, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({ message: "Cập nhật thành công!" });
        });
      } catch (error) {
        res.status(500).json({ error: "Lỗi không xác định xảy ra!" });
      }
    },
  ],

  delete: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID không hợp lệ!" });

    MauPowerpoint.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(404).json({ message: "Không tìm thấy mẫu PowerPoint!" });
      
      const deleteFile = (filePath) => {
        if (filePath) {
          const fullPath = path.join(__dirname, "..", filePath);
          fs.unlink(fullPath, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error("Lỗi khi xóa file:", err);
            }
          });
        }
      };

      deleteFile(result.duong_dan_tap_tin);
      deleteFile(result.duong_dan_anh_nho);

      MauPowerpoint.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Xóa thành công!" });
      });
    });
  },
};