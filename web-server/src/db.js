const sqlite3 = require('sqlite3');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE devices (
            id INTEGER PRIMARY KEY,
            password TEXT,
            used INTEGER,
            used_by TEXT,
            FOREIGN KEY(used_by) REFERENCES users(id)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating available devices
                    var insert = 'INSERT INTO devices (id, password, used) VALUES (?, ?, ?)';
                    db.run(insert, [1, "aaaa", "FALSE"]);
                    db.run(insert, [2, "bbbb", "FALSE"]);
                    db.run(insert, [3, "cccc", "FALSE"]);
                    db.run(insert, [4, "dddd", "FALSE"]);
                    db.run(insert, [5, "eeee", "FALSE"]);
                    db.run(insert, [6, "ffff", "FALSE"]);
                }
            });
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            password TEXT,
            balance REAL DEFAULT 0
        )`, (err) => {
            if (err) {
                // Table already created
            }
        });
    }
});


module.exports = db