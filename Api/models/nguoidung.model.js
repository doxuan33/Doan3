const db = require("../common/db");

const NguoiDung = (nguoiDung) => {
  this.id = nguoiDung.id;
  this.ten = nguoiDung.ten;
  this.email = nguoiDung.email;
  this.mat_khau = nguoiDung.mat_khau;
};

NguoiDung.getById = (id, callback) => {
  const sqlString = "SELECT * FROM nguoi_dung WHERE id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

NguoiDung.getAll = (callback) => {
  const sqlString = "SELECT * FROM nguoi_dung";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

NguoiDung.insert = (nguoiDung, callBack) => {
  const sqlString = "INSERT INTO nguoi_dung SET ?";
  db.query(sqlString, nguoiDung, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...nguoiDung });
  });
};

NguoiDung.update = (nguoiDung, id, callBack) => {
  const sqlString = "UPDATE nguoi_dung SET ? WHERE id = ?";
  db.query(sqlString, [nguoiDung, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Cập nhật người dùng có id = " + id + " thành công");
  });
};

NguoiDung.delete = (id, callBack) => {
  db.query("DELETE FROM nguoi_dung WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Xóa người dùng có id = " + id + " thành công");
  });
};

module.exports = NguoiDung;
