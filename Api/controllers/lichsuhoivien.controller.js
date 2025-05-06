const LichSuHoiVien = require("../models/lichsuhoivien.model");

module.exports = {
  getByUserId: (req, res) => {
    const nguoi_dung_id = req.params.nguoi_dung_id;
    LichSuHoiVien.getByUserId(nguoi_dung_id, (result) => {
      res.send(result);
    });
  },

  checkMembershipValidity: (req, res) => {
    const nguoi_dung_id = req.params.nguoi_dung_id;
    LichSuHoiVien.checkMembershipValidity(nguoi_dung_id, (result) => {
      res.send({ isValid: result });
    });
  },

  extendMembership: (req, res) => {
    const id = req.params.id;
    const days = req.body.days || 30; // Default to 30 days if not specified
    LichSuHoiVien.extendMembership(id, days, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    LichSuHoiVien.delete(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const lichSuHoiVien = req.body;
    LichSuHoiVien.insert(lichSuHoiVien, (result) => {
      res.send(result);
    });
  },
};