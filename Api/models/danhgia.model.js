const db = require("../common/db");

const DanhGia = (danhGia) => {
  this.id = danhGia.id;
  this.nguoi_dung_id = danhGia.nguoi_dung_id;
  this.mau_powerpoint_id = danhGia.mau_powerpoint_id;
  this.diem_danh_gia = danhGia.diem_danh_gia;
  this.binh_luan = danhGia.binh_luan;
  this.ngay_tao = danhGia.ngay_tao;
};

// Get a review by its ID
DanhGia.getById = (id, callback) => {
  const sqlString = "SELECT * FROM danh_gia WHERE id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

// Get all reviews for a specific PowerPoint template
DanhGia.getByPowerPointId = (mauPowerPointId, callback) => {
  const sqlString = "SELECT * FROM danh_gia WHERE mau_powerpoint_id = ?";
  db.query(sqlString, mauPowerPointId, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

// Get all reviews for a specific user
DanhGia.getByUserId = (nguoiDungId, callback) => {
  const sqlString = "SELECT * FROM danh_gia WHERE nguoi_dung_id = ?";
  db.query(sqlString, nguoiDungId, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

// Insert a new review
DanhGia.insert = (danhGia, callback) => {
  const sqlString = "INSERT INTO danh_gia SET ?";
  db.query(sqlString, danhGia, (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    callback({ id: res.insertId, ...danhGia });
  });
};

// Update an existing review
DanhGia.update = (danhGia, id, callback) => {
  const sqlString = "UPDATE danh_gia SET ? WHERE id = ?";
  db.query(sqlString, [danhGia, id], (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    callback("Cập nhật đánh giá có id = " + id + " thành công");
  });
};

// Delete a review by its ID
DanhGia.delete = (id, callback) => {
  const sqlString = "DELETE FROM danh_gia WHERE id = ?";
  db.query(sqlString, id, (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    callback("Xóa đánh giá có id = " + id + " thành công");
  });
};

module.exports = DanhGia;
