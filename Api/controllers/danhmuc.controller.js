const DanhMuc = require("../models/danhmuc.model");

module.exports = {
  getAll: (req, res) => {
    DanhMuc.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    DanhMuc.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const danhMuc = req.body;
    DanhMuc.insert(danhMuc, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const danhMuc = req.body;
    const id = req.params.id;
    DanhMuc.update(danhMuc, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    DanhMuc.delete(id, (result) => {
      res.send(result);
    });
  },
};
