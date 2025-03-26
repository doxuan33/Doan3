const LichSuTaiXuong = require("../models/lichsutaixuong.model");

module.exports = {
  getAll: (req, res) => {
    LichSuTaiXuong.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    LichSuTaiXuong.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const lichSuTaiXuong = req.body;
    LichSuTaiXuong.insert(lichSuTaiXuong, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const lichSuTaiXuong = req.body;
    const id = req.params.id;
    LichSuTaiXuong.update(lichSuTaiXuong, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    LichSuTaiXuong.delete(id, (result) => {
      res.send(result);
    });
  },
};
