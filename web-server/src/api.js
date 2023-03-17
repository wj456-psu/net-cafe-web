const express = require("express")
const router = express.Router()
const db = require("./db")

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/devices", (req, res) => {
  const sql = "SELECT * FROM devices";
  const params = [];
  const devices = db.prepare(sql).all(params);
  res.json({ "message": "success", "data": devices });
});

router.get("/device/:id", (req, res) => {
  const sql = "SELECT * FROM devices WHERE id = ?";
  const params = [req.params.id];
  const device = db.prepare(sql).get(params);
  if (!device) {
    res.status(404).json({ "error": "No device found with the specified id" });
    return;
  }
  res.json({ "message": "success", "data": device });
});

router.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  const params = [];
  const users = db.prepare(sql).all(params);
  res.json({ "message": "success", "data": users });
});

router.get("/user/:name", (req, res) => {
  let sql = "SELECT * FROM users WHERE username = ?";
  const params = [req.params.name];
  const user = db.prepare(sql).get(params);
  if (!user) {
    res.status(404).json({ "error": "No user found with the specified username" });
    return;
  }
  sql = "SELECT * FROM devices WHERE username = ?";
  const used = db.prepare(sql).get(params);
  if (!used) {
    res.json({ "message": "success", "data": user });
  } else {
    res.json({ "message": "success", "data": { user, "using": { "id": used.id, "time_remained": used.time_remained } } });
  }
});

router.get("/goods", (req, res) => {
  const sql = "SELECT * FROM goods";
  const params = [];
  const goods = db.prepare(sql).all(params);
  res.json({ "message": "success", "data": goods });
});

router.get("/good/:id", (req, res) => {
  const sql = "SELECT * FROM goods WHERE id = ?";
  const params = [req.params.id];
  const good = db.prepare(sql).get(params);
  if (!good) {
    res.status(404).json({ "error": "No good found with the specified id" });
    return;
  }
  res.json({ "message": "success", "data": good });
});

router.post("/device", (req, res) => {
  if (!req.body.id) {
    res.status(400).json({ "error": "No id specified" });
    return;
  }
  const sql = "INSERT INTO devices (id) VALUES (?)";
  const params = [req.body.id];
  try {
    db.prepare(sql).run(params);
    res.json({
      "message": "success",
      "data": data,
    });
  } catch (err) {
    res.status(400).json({ "error": err.message });
    return;
  }
});

router.post("/device/:id", (req, res) => {
  if (!req.body.username) {
    res.status(400).json({ "error": "Missing required parameter" });
    return;
  }
  const sql =
    `UPDATE devices SET
      used = TRUE,
      username = ?
      WHERE id = ? `;
  const data = {
    name: req.body.username,
    id: req.params.id
  }
  const params = [data.name, data.id];
  try {
    db.prepare(sql).run(params);
    res.json({
      "message": "success",
      "data": { "device_id": data.id, "used_by": data.name }
    });
  } catch (err) {
    if (err.message === "FOREIGN KEY constraint failed") {
      res.status(400).json({ "error": "No user: " + data.name });
      return;
    }
  }
});

router.post("/user", (req, res) => {
  const errors = [];
  if (!req.body.username) {
    errors.push("No name specified");
  }
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(", ") });
    return;
  }
  const data = {
    name: req.body.username,
    password: req.body.password
  }
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  const params = [data.name, data.password];
  try {
    db.prepare(sql).run(params);
    res.json({
      "message": "success",
      "data": data,
    });
  } catch (err) {
    res.status(400).json({ "error": err.message });
    return;
  }
});

router.post("/good", (req, res) => {
  const errors = [];
  if (!req.body.id) {
    errors.push("No id specified");
  }
  if (!req.body.name) {
    errors.push("No name specified");
  }
  if (!req.body.price) {
    errors.push("No price specified");
  }
  if (!req.body.img) {
    errors.push("No img specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(", ") });
    return;
  }
  const data = {
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
    left: req.body.left
  }
  const sql = "INSERT INTO goods (id, name, price, img, left) VALUES (?, ?, ?, ?, ?)";
  const params = [data.id, data.name, data.price, data.img, data.left];
  try {
    db.prepare(sql).run(params);
    res.json({
      "message": "success",
      "data": data,
    });
  } catch (err) {
    res.status(400).json({ "error": err.message });
    return;
  }
});

router.put("/device/:id", (req, res) => {
  const data = {
    used: req.body.used,
    user: req.body.username,
    time: req.body.time_remained
  }
  console.log(data)
  const isEmpty = Object.values(data).every(x => x === undefined);
  if (isEmpty) {
    res.status(400).json({ "error": "No key specified" });
    return;
  }
  if (data.used) {
    data.used = parseInt(data.used);
  }
  if (data.time) {
    data.time = parseInt(data.time);
  }
  if (data.user) {
    data.user = JSON.parse(data.user);
    const sql = `UPDATE devices SET
      used = COALESCE(?, used),
      username = ?,
      time_remained = COALESCE(?, time_remained)
      WHERE id = ?`;
    const params = [data.used, data.user, data.time, req.params.id];
    db.pragma("foreign_keys = OFF");
    const info = db.prepare(sql).run(params);
    db.pragma("foreign_keys = ON");
    res.json({
      "message": "success",
      "data": data,
      "changes": info.changes
    });
  } else {
    const sql = `UPDATE devices SET
      used = COALESCE(?, used),
      time_remained = COALESCE(?, time_remained)
      WHERE id = ?`;
    const params = [data.used, data.time, req.params.id];
    const info = db.prepare(sql).run(params);
    res.json({
      "message": "success",
      "data": data,
      "changes": info.changes
    });
  }
});

router.put("/user/:name", (req, res) => {
  const data = {
    password: req.body.password,
    balance: req.body.balance
  }
  console.log(data)
  const isEmpty = Object.values(data).every(x => x === undefined);
  if (isEmpty) {
    res.status(400).json({ "error": "No key specified" });
    return;
  }
  if (data.balance) {
    data.balance = parseFloat(data.balance);
  }
  const sql = `UPDATE users SET
      password = COALESCE(?, password),
      balance = COALESCE(?, balance)
      WHERE username = ?`;
  const params = [data.password, data.balance, req.params.name];
  const info = db.prepare(sql).run(params);
  res.json({
    "message": "success",
    "data": data,
    "changes": info.changes
  });
});

router.put("/good/:id", (req, res) => {
  const data = {
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
    left: req.body.left
  }
  console.log(data);
  const isEmpty = Object.values(data).every(x => x === undefined);
  if (isEmpty) {
    res.status(400).json({ "error": "No key specified" });
    return;
  }
  if (data.price) {
    data.price = parseFloat(data.price);
  }
  if (data.left) {
    data.left = parseInt(data.left);
  }
  const sql = `UPDATE goods SET
      name = COALESCE(?, name),
      price = COALESCE(?, price),
      img = COALESCE(?, img),
      left = COALESCE(?, left)
      WHERE id = ?`;
  const params = [data.name, data.price, data.img, data.left, req.params.id];
  const info = db.prepare(sql).run(params);
  res.json({
    "message": "success",
    "data": data,
    "changes": info.changes
  });
});

router.delete("/device/:id", (req, res) => {
  const sql = "DELETE FROM devices WHERE id = ?";
  const params = [req.params.id];
  const info = db.prepare(sql).run(params);
  if (info.changes === 0) {
    res.status(404).json({ "error": "No device found with the specified id" });
    return;
  }
  res.json({
    "message": "deleted",
    "changes": info.changes
  });
});

router.delete("/user/:name", (req, res) => {
  const sql = "DELETE FROM users WHERE username = ?";
  const params = [req.params.name];
  const info = db.prepare(sql).run(params);
  if (info.changes === 0) {
    res.status(404).json({ "error": "No user found with the specified username" });
    return;
  }
  res.json({
    "message": "deleted",
    "changes": info.changes
  });
});

router.delete("/good/:id", (req, res) => {
  const sql = "DELETE FROM goods WHERE id = ?";
  const params = [req.params.id];
  const info = db.prepare(sql).run(params);
  if (info.changes === 0) {
    res.status(404).json({ "error": "No good found with the specified id" });
    return;
  }
  res.json({
    "message": "deleted",
    "changes": info.changes
  });
});

module.exports = router