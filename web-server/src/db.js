const Database = require('better-sqlite3');

const DBSOURCE = "db.sqlite";

const db = new Database(DBSOURCE, { verbose: console.log });

db.pragma("foreign_keys = ON");

try {
    db.prepare(`CREATE TABLE users (
        username TEXT,
        password TEXT,
        balance REAL DEFAULT 0,
        isAdmin INTEGER DEFAULT FALSE,
        PRIMARY KEY(username)
    )`).run();
} catch (err) { }
try {
    db.prepare(`CREATE TABLE devices (
        id INTEGER,
        used INTEGER DEFAULT FALSE,
        username TEXT,
        time_remained INTEGER DEFAULT 0,
        PRIMARY KEY(id),
        FOREIGN KEY(username) REFERENCES users(username)
    )`).run();
} catch (err) { }
try {
    db.prepare(`CREATE TABLE goods (
        id INTEGER,
        name TEXT,
        price REAL,
        img TEXT,
        left INTEGER DEFAULT 0,
        PRIMARY KEY(id)
    )`).run();
} catch (err) { }
const insertDevice = db.prepare(`INSERT INTO devices (id) VALUES (?)`);
const insertDevices = db.transaction((devices) => {
    for (const device of devices) insertDevice.run(device);
});
try {
    insertDevices([1, 2, 3, 4, 5, 6,]);
} catch (err) { }
const insertAdmin = db.prepare(`INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)`);
const insertAdmins = db.transaction((admins) => {
    for (const admin of admins) insertAdmin.run(admin);
});
try {
    insertAdmins([
        ["Uan", "admin", 1],
    ]);
} catch (err) { }
const insertGood = db.prepare(`INSERT INTO goods (id, name, price, img, left) VALUES (?, ?, ?, ?, ?)`);
const insertGoods = db.transaction((goods) => {
    for (const good of goods) insertGood.run(good);
});
try {
    insertGoods([
        [1, "Snack", 30, "https://cdn-icons-png.flaticon.com/512/859/859293.png", 12],
        [2, "Cookies", 10, "https://cdn-icons-png.flaticon.com/512/526/526331.png", 12],
        [3, "Soda", 20, "https://cdn-icons-png.flaticon.com/512/3076/3076028.png", 12],
    ]);
} catch (err) { }

module.exports = db