const db = require("./db");

function readDevices() {
    const sql = `SELECT * from devices`;
    const params = [];
    const devices = db.prepare(sql).all(params);
    devices.forEach((device) => {
        console.log(`id: ${device.id}, used: ${device.used}, username: ${device.username}, time_remained: ${device.time_remained}`);
        if (device.used == 1) {
            if (device.time_remained > 0) {
                device.time_remained--;
                const sql2 = `UPDATE devices SET time_remained = ? WHERE id = ?`;
                const params2 = [device.time_remained, device.id];
                const info2 = db.prepare(sql2).run(params2);
                console.log(info2);
            } else {
                const sql3 = `UPDATE devices SET used = 0, username = NULL WHERE id = ?`
                const params3 = [device.id];
                const info3 = db.prepare(sql3).run(params3);
                console.log(info3);
            }
        }
    });
}

setInterval(() => {
    readDevices();
}, 1000);