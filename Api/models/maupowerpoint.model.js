const db = require("../common/db");

const MauPowerpoint = {};
MauPowerpoint.getTopDownloads = (callback) => {
  const query = `
      SELECT mp.id, mp.tieu_de, COUNT(ls.mau_powerpoint_id) AS luot_tai
      FROM mau_powerpoint mp
      LEFT JOIN lich_su_tai_xuong ls ON mp.id = ls.mau_powerpoint_id
      GROUP BY mp.id, mp.tieu_de
      ORDER BY luot_tai DESC
      LIMIT 3;
  `;

  db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
  });
};
MauPowerpoint.getById = (id, callback) => {
  const sqlString = "SELECT * FROM mau_powerpoint WHERE id = ?";
  db.query(sqlString, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result.length ? result[0] : null);
  });
};

MauPowerpoint.getAll = (callback) => {
  const sqlString = "SELECT * FROM mau_powerpoint";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

MauPowerpoint.insert = (mauPowerpoint, callback) => {
  const sqlString = "INSERT INTO mau_powerpoint SET ?";
  db.query(sqlString, mauPowerpoint, (err, res) => {
    if (err) return callback(err);
    callback(null, { id: res.insertId, ...mauPowerpoint });
  });
};

MauPowerpoint.update = (mauPowerpoint, id, callback) => {
  const sqlString = "UPDATE mau_powerpoint SET ? WHERE id = ?";
  db.query(sqlString, [mauPowerpoint, id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Cập nhật mẫu PowerPoint có ID = ${id} thành công`);
  });
};

MauPowerpoint.delete = (id, callback) => {
  db.query("DELETE FROM mau_powerpoint WHERE id = ?", [id], (err, res) => {
    if (err) return callback(err);
    callback(null, `Xóa mẫu PowerPoint có ID = ${id} thành công`);
  });
};

module.exports = MauPowerpoint;
