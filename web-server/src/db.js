const Database = require('better-sqlite3');

const DBSOURCE = "db.sqlite";

const db = new Database(DBSOURCE, { verbose: console.log });

db.pragma("foreign_keys = ON");

try {
    db.prepare(`CREATE TABLE users (
            username TEXT,
            password TEXT,
            balance REAL DEFAULT 0,
            PRIMARY KEY(username)
        )`).run();
} catch (err) { }
try {
    db.prepare(`CREATE TABLE devices (
        id INTEGER,
        password TEXT,
        used INTEGER,
        username TEXT,
        PRIMARY KEY(id),
        FOREIGN KEY(username) REFERENCES users(username)
        )`).run();
} catch (err) { }
const insertDevice = db.prepare(`INSERT INTO devices (id, password, used) VALUES (?, ?, ?)`);
const insertDevices = db.transaction((devices) => {
    for (const device of devices) insertDevice.run(device);
});
try {
    insertDevices([
        [1, "aaaa", "FALSE"],
        [2, "bbbb", "FALSE"],
        [3, "cccc", "FALSE"],
        [4, "dddd", "FALSE"],
        [5, "eeee", "FALSE"],
        [6, "ffff", "FALSE"],
    ]);
} catch (err) { }

module.exports = db