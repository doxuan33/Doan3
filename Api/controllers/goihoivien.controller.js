const GoiHoiVien = require("../models/goihoivien.model");

module.exports = {
  getAll: (req, res) => {
    GoiHoiVien.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    GoiHoiVien.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const goiHoiVien = req.body;
    GoiHoiVien.insert(goiHoiVien, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const goiHoiVien = req.body;
    const id = req.params.id;
    GoiHoiVien.update(goiHoiVien, id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    GoiHoiVien.delete(id, (result) => {
      res.send(result);
    });
  },

  getUserMembershipStats: (req, res) => {
    GoiHoiVien.getUserMembershipStats((result) => {
      res.send(result);
    });
  },

  getPackagePurchaseStats: (req, res) => {
    GoiHoiVien.getPackagePurchaseStats((result) => {
      res.send(result);
    });
  },
};