var express = require('express');
var router = express.Router();
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xuan',
  database: 'mauppt'
})
connection.connect()

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM mau_powerpoint', (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ data: rows });
  });
});
module.exports = router;
