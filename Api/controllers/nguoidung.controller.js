const NguoiDung = require("../models/nguoidung.model");
const db = require("../common/db");

module.exports = {
  getTotal: (req, res) => {
    NguoiDung.getTotal((err, total) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(total);
    });
  },

  getAll: (req, res) => {
    NguoiDung.getAll((err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    NguoiDung.getById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.length) return res.status(404).json({ error: "Người dùng không tồn tại" });
      res.json(result[0]);
    });
  },

  insert: (req, res) => {
    const nguoiDung = req.body;
    NguoiDung.insert(nguoiDung, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    });
  },

  update: (req, res) => {
    const nguoiDung = req.body;
    const id = req.params.id;

    // Kiểm tra dữ liệu đầu vào
    if (!nguoiDung.ten || !nguoiDung.email) {
      return res.status(400).json({ error: "Tên và email là bắt buộc" });
    }

    // Kiểm tra email duy nhất
    db.query(
      "SELECT * FROM nguoi_dung WHERE email = ? AND id != ?",
      [nguoiDung.email, id],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        if (results.length > 0) {
          return res.status(400).json({ error: "Email đã được sử dụng" });
        }

        NguoiDung.update(nguoiDung, id, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Cập nhật thành công", user: result });
        });
      }
    );
  },

  delete: (req, res) => {
    const id = req.params.id;
    NguoiDung.delete(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: result });
    });
  },
};