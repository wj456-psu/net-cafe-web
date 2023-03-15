const express = require('express')
const router = express.Router()
const db = require('./db')

router.get('/devices', (req, res) => {
  const sql = "select * from devices";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": rows });
  });
})

module.exports = router