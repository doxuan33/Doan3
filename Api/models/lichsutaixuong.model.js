const db = require("../common/db");

const LichSuTaiXuong = (lichSuTaiXuong) => {
  this.id = lichSuTaiXuong.id;
  this.nguoi_dung_id = lichSuTaiXuong.nguoi_dung_id;
  this.mau_powerpoint_id = lichSuTaiXuong.mau_powerpoint_id;
  this.thoi_gian_tai = lichSuTaiXuong.thoi_gian_tai;
};

LichSuTaiXuong.getById = (id, callback) => {
  const sqlString = "SELECT * FROM lich_su_tai_xuong WHERE id = ?";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

LichSuTaiXuong.getAll = (callback) => {
  const sqlString = "SELECT * FROM lich_su_tai_xuong";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

LichSuTaiXuong.insert = (lichSuTaiXuong, callBack) => {
  const sqlString = "INSERT INTO lich_su_tai_xuong SET ?";
  db.query(sqlString, lichSuTaiXuong, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...lichSuTaiXuong });
  });
};

LichSuTaiXuong.update = (lichSuTaiXuong, id, callBack) => {
  const sqlString = "UPDATE lich_su_tai_xuong SET ? WHERE id = ?";
  db.query(sqlString, [lichSuTaiXuong, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Cập nhật lịch sử tải xuống có id = " + id + " thành công");
  });
};

LichSuTaiXuong.delete = (id, callBack) => {
  db.query("DELETE FROM lich_su_tai_xuong WHERE id = ?", id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Xóa lịch sử tải xuống có id = " + id + " thành công");
  });
};

module.exports = LichSuTaiXuong;
