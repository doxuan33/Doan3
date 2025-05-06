const DanhGia = require("../models/danhgia.model");

module.exports = {
  getTotal: (req, res) => {
    DanhGia.getTotal((err, total) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(total);
          });
        },
  // Get all reviews for a specific PowerPoint template
  getAllByPowerPointId: (req, res) => {
    const mauPowerPointId = req.params.mauPowerPointId;
    DanhGia.getByPowerPointId(mauPowerPointId, (result) => {
      res.send(result);
    });
  },

  // Get all reviews for a specific user
  getAllByUserId: (req, res) => {
    const nguoiDungId = req.params.nguoiDungId;
    DanhGia.getByUserId(nguoiDungId, (result) => {
      res.send(result);
    });
  },

  // Get a review by its ID
  getById: (req, res) => {
    const id = req.params.id;
    DanhGia.getById(id, (result) => {
      res.send(result);
    });
  },

  // Insert a new review
  insert: (req, res) => {
    const danhGia = req.body;
    DanhGia.insert(danhGia, (result) => {
      res.send(result);
    });
  },

  // Update an existing review
  update: (req, res) => {
    const danhGia = req.body;
    const id = req.params.id;
    DanhGia.update(danhGia, id, (result) => {
      res.send(result);
    });
  },

  // Delete a review by its ID
  delete: (req, res) => {
    const id = req.params.id;
    DanhGia.delete(id, (result) => {
      res.send(result);
    });
  },
};
