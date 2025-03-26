const NguoiDung = require("../models/nguoidung.model");

module.exports = {
  getAll: (req, res) => {
    NguoiDung.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    NguoiDung.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const nguoiDung = req.body;
    NguoiDung.insert(nguoiDung, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const nguoiDung = req.body;
    const id = req.params.id;
    NguoiDung.update(nguoiDung, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    NguoiDung.delete(id, (result) => {
      res.send(result);
    });
  },
};
