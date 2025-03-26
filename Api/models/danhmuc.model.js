const db = require("../common/db");

const DanhMuc = (danhMuc) => {
  this.id = danhMuc.id;
  this.ten = danhMuc.ten;
  this.mo_ta = danhMuc.mo_ta;
};

DanhMuc.getById = (id, callback) => {
  const sqlString = "SELECT * FROM danh_muc WHERE id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

DanhMuc.getAll = (callback) => {
  const sqlString = "SELECT * FROM danh_muc";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

DanhMuc.insert = (danhMuc, callBack) => {
  const sqlString = "INSERT INTO danh_muc SET ?";
  db.query(sqlString, danhMuc, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...danhMuc });
  });
};

DanhMuc.update = (danhMuc, id, callBack) => {
  const sqlString = "UPDATE danh_muc SET ? WHERE id = ?";
  db.query(sqlString, [danhMuc, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Cập nhật danh mục có id = " + id + " thành công");
  });
};

DanhMuc.delete = (id, callBack) => {
  db.query("DELETE FROM danh_muc WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Xóa danh mục có id = " + id + " thành công");
  });
};

module.exports = DanhMuc;
