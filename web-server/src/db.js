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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            password text
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO devices (password) VALUES (?)';
                    db.run(insert, ["aaaa"]);
                    db.run(insert, ["bbbb"]);
                    db.run(insert, ["cccc"]);
                    db.run(insert, ["dddd"]);
                    db.run(insert, ["eeee"]);
                    db.run(insert, ["ffff"]);
                }
            });
    }
});


module.exports = db