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
        password TEXT,
        used INTEGER DEFAULT FALSE,
        username TEXT,
        time_remained INTEGER DEFAULT 0,
        PRIMARY KEY(id),
        FOREIGN KEY(username) REFERENCES users(username)
    )`).run();
} catch (err) { }
const insertDevice = db.prepare(`INSERT INTO devices (id, password) VALUES (?, ?)`);
const insertDevices = db.transaction((devices) => {
    for (const device of devices) insertDevice.run(device);
});
try {
    insertDevices([
        [1, "aaaa"],
        [2, "bbbb"],
        [3, "cccc"],
        [4, "dddd"],
        [5, "eeee"],
        [6, "ffff"],
    ]);
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

module.exports = db