const db = require("../common/db");

const HinhAnh = {};

// Lấy danh sách hình ảnh có lượt tải xuống cao nhất
HinhAnh.getTopDownloads = (callback) => {
  const query = `
      SELECT ha.id, ha.tieu_de, COUNT(ls.hinh_anh_id) AS luot_tai
      FROM hinh_anh ha
      LEFT JOIN lich_su_tai_xuong ls ON ha.id = ls.hinh_anh_id
      GROUP BY ha.id, ha.tieu_de
      ORDER BY luot_tai DESC
      LIMIT 3;
  `;
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Lấy một hình ảnh theo ID
HinhAnh.getById = (id, callback) => {
  const sqlString = "SELECT * FROM hinh_anh WHERE id = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result.length ? result[0] : null);
  });
};

// Lấy tất cả hình ảnh
HinhAnh.getAll = (callback) => {
  const sqlString = "SELECT * FROM hinh_anh";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Chèn một hình ảnh mới
HinhAnh.insert = (hinhAnh, callback) => {
  const sqlString = "INSERT INTO hinh_anh SET ?";
  db.query(sqlString, hinhAnh, (err, res) => {
    if (err) return callback(err);
    callback(null, { id: res.insertId, ...hinhAnh });
  });
};

// Cập nhật thông tin hình ảnh
HinhAnh.update = (hinhAnh, id, callback) => {
  const sqlString = "UPDATE hinh_anh SET ? WHERE id = ?";
  db.query(sqlString, [hinhAnh, id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật hình ảnh có ID = ${id} thành công`);
  });
};

// Xóa hình ảnh
HinhAnh.delete = (id, callback) => {
  db.query("DELETE FROM hinh_anh WHERE id = ?", [id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa hình ảnh có ID = ${id} thành công`);
  });
};

module.exports = HinhAnh;
