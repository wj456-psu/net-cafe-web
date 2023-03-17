const axios = require("axios");

setInterval(() => {
    axios.get("http://localhost:8080/api/devices").then((response) => {
        const devices_data = response.data.data;
        devices_data.forEach((device) => {
            console.log(`id: ${device.id}, used: ${device.used}, username: ${device.username}, time_remained: ${device.time_remained}`);
            if (parseInt(device.used) == 1) {
                device.time_remained = parseInt(device.time_remained);
                device.time_remained--;
                if (device.time_remained > 0) {
                    axios.put(`http://localhost:8080/api/device/${device.id}`, {
                        "time_remained": device.time_remained
                    }).then(response => {
                        console.log(`id: ${device.id} -> ${JSON.stringify(response.data, null, 2)}`);
                    }).catch(error => {
                        console.error(error);
                    });
                } else {
                    axios.put(`http://localhost:8080/api/device/${device.id}`, {
                        "used": 0,
                        "username": "null",
                        "time_remained": device.time_remained
                    }).then(response => {
                        console.log(`id: ${device.id} -> ${JSON.stringify(response.data, null, 2)}`);
                    }).catch(error => {
                        console.error(error);
                    });
                }
            }
        });
    }).catch((err) => { });
}, 1000);