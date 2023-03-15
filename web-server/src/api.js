const express = require("express")
const router = express.Router()
const db = require("./db")

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/devices", (req, res) => {
  const sql = "SELECT * FROM devices";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": rows });
  });
});

router.get("/device/:id", (req, res) => {
  const sql = "SELECT * FROM devices WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ "message": "No device found with the specified ID" });
      return;
    }
    res.json({ "message": "success", "data": row });
  });
});

router.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": rows });
  });
});

router.get("/user/id/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ "message": "No user found with the specified id" });
      return;
    }
    res.json({ "message": "success", "data": row });
  });
});

router.get("/user/name/:name", (req, res) => {
  const sql = "SELECT * FROM users WHERE name = ?";
  const params = [req.params.name];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ "message": "No user found with the specified name" });
      return;
    }
    res.json({ "message": "success", "data": row });
  });
});

router.post("/user", (req, res) => {
  const errors = [];
  if (!req.body.name) {
    errors.push("No name specified");
  }
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  const data = {
    name: req.body.name,
    password: req.body.password
  }
  const sql = "INSERT INTO users (name, password) VALUES (?, ?)";
  const params = [data.name, data.password];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": data,
      "id": this.lastID
    });
  });
});

router.put("/user/:id", (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    balance: req.body.balance
  }
  db.run(
    `UPDATE users SET
      name = COALESCE(?, name),
      password = COALESCE(?, password),
      balance = COALESCE(?, balance)
      WHERE id = ?`,
    [data.name, data.password, data.balance, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": data,
        "changes": this.changes
      });
    }
  );
});

router.delete("/user/:id", (req, res) => {
  db.run(
    "DELETE FROM users WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.json({ "message": "deleted", "changes": this.changes })
    });
});

router.post("/device/:d_id/user/:u_id", (req, res) => {
  db.run(
    "PRAGMA foreign_keys = ON", function (err, result) {
      if (err) throw err;
      db.run(
        `UPDATE devices SET
          used = 'TRUE',
          used_by = ?
          WHERE id = ? `,
        [req.params.u_id, req.params.d_id],
        function (err, result) {
          if (err) {
            res.status(400).json({ "error": err.message });
            return;
          }
          res.json({
            "message": "success",
            "data": { "device_id": req.params.d_id, "used_by": req.params.u_id }
          });
        }
      );
    }
  );
});

module.exports = router