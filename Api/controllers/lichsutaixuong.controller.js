const LichSuTaiXuong = require("../models/lichsutaixuong.model");

module.exports = {
  getTotal: (req, res) => {
    LichSuTaiXuong.getTotal((err, total) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(total);
    });
  },
  // 🔹 Lấy tất cả lịch sử tải xuống
  getAll: (req, res) => {
    LichSuTaiXuong.getAll((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: err });
      }
      res.json(result);
    });
  },

  // 🔹 Lấy lịch sử tải xuống theo ID
  getById: (req, res) => {
    const id = req.params.id;
    LichSuTaiXuong.getById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: err });
      }
      res.json(result);
    });
  },

  // 🔹 Lấy lịch sử tải xuống theo ID người dùng
  getByUserId: (req, res) => {
    const nguoi_dung_id = req.params.nguoi_dung_id;
    LichSuTaiXuong.getByUserId(nguoi_dung_id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: err });
      }
      res.json(result);
    });
  },

  // 🔹 Thêm lịch sử tải xuống mới
  insert: (req, res) => {
    const lichSuTaiXuong = req.body;
    LichSuTaiXuong.insert(lichSuTaiXuong, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi thêm dữ liệu", error: err });
      }
      res.json(result);
    });
  },

  // 🔹 Cập nhật lịch sử tải xuống
  update: (req, res) => {
    const lichSuTaiXuong = req.body;
    const id = req.params.id;
    LichSuTaiXuong.update(lichSuTaiXuong, id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi cập nhật dữ liệu", error: err });
      }
      res.json({ message: `Cập nhật lịch sử tải xuống có ID = ${id} thành công` });
    });
  },

  // 🔹 Xóa lịch sử tải xuống
  delete: (req, res) => {
    const id = req.params.id;
    LichSuTaiXuong.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi xóa dữ liệu", error: err });
      }
      res.json({ message: `Xóa lịch sử tải xuống có ID = ${id} thành công` });
    });
  },
};
