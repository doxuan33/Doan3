const MauPowerpoint = require("../models/maupowerpoint.model");
const multer = require("multer");
const path = require("path");

// Cấu hình Multer để lưu file
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = {
  getAll: (req, res) => {
    MauPowerpoint.getAll((err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(result.length ? result : { message: "Không có dữ liệu" });
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
          tieu_de,
          mo_ta,
          danh_muc_id,
          duong_dan_tap_tin: req.files?.file ? "/uploads/" + req.files["file"][0].filename : null,
          duong_dan_anh_nho: req.files?.thumbnail ? "/uploads/" + req.files["thumbnail"][0].filename : null,
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

        const mauPowerpoint = { tieu_de, mo_ta, danh_muc_id };

        if (req.files?.file) mauPowerpoint.duong_dan_tap_tin = "/uploads/" + req.files["file"][0].filename;
        if (req.files?.thumbnail) mauPowerpoint.duong_dan_anh_nho = "/uploads/" + req.files["thumbnail"][0].filename;

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

    MauPowerpoint.delete(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Xóa thành công!" });
    });
  },
};