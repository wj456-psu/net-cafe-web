import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Admin.css";

export default function Admin() {
  const [devices, setDevices] = useState([]);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState("");
  const [password, setPassword] = useState("");
  const [device, setDevice] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:8080/api/devices')
        .then(response => {
          setDevices(response.data.data);
        })
        .catch(error => {
          console.error(error);
        });
    };

    fetchData(); // Fetch data on component mount

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 5 seconds
    }, 5000); // Time interval in milliseconds (5 seconds)

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  };

  function handleBalanceChange(event) {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    const inputBalance = parseFloat(value);
    setBalance(inputBalance);
  };

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  };

  function handleDeviceChange(event) {
    const value = event.target.value.replace(/\D/g, '');
    setDevice(value);
  };

  function handleTimeChange(event) {
    const value = event.target.value.replace(/\D/g, '');
    setTime(value);
  };

  function handleTopUp(event) {
    event.preventDefault();
    axios.put(`http://localhost:8080/api/user/${username}`, {
      "username": username,
      "balance": balance
    }).then(response => {
      console.log(response.data);
      alert("Top up successfully!");
    }).catch(error => {
      console.error(error);
    });
  };

  function handleRegister(event) {
    event.preventDefault();
    axios.post(`http://localhost:8080/api/user`, {
      "username": username,
      "password": password
    }).then(response => {
      console.log(response.data);
      alert("Register Successfully!");
    }).catch(error => {
      console.error(error);
      const message = error.response.data.error;
      if (message === 'UNIQUE constraint failed: users.username') {
        alert(`Already registered user ${username}`);
      }
    });
  };

  function handleReserve(event) {
    event.preventDefault();
    axios.post(`http://localhost:8080/api/device/${device}`, {
      "username": username
    }).then(response => {
      axios.put(`http://localhost:8080/api/device/${device}`, {
        "time_remained": (time * 60)
      }).then(response => {
        axios.get(`http://localhost:8080/api/user/${username}`).then(response => {
          let balance = response.data.data.balance;
          balance -= (time / 6);
          axios.put(`http://localhost:8080/api/user/${username}`, {
            "balance": balance
          }).then(response => {
            console.log(response.data);
            alert("Reserve Successfully!");
          }).catch(error => {
            console.error(error);
          });
        }).catch(error => {
          console.error(error);
        });
      }
      ).catch(error => {
        console.error(error);
      });
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <div>
      <div className="data-Topic">
        <h1>Devices Status</h1>
      </div>
      <div className="data-container">
        {devices.map(device => (
          <div key={device.id} className="data-box">
            <h2>{device.id}</h2>
            <p>Used By: {device.username}</p>
            <p>Remain: {device.time_remained} s</p>
          </div>
        ))}
      </div>
      <div className="top-up-container">
        <h2>TOP-UP</h2>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} />
        <br />
        <label htmlFor="amount">Amount</label>
        <input type="text" id="amount" name="amount" value={balance} onChange={handleBalanceChange} />
        <br />
        <button onClick={handleTopUp}>Enter</button>
      </div>

      <div className="register-container">
        <h2>Register</h2>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} />
        <br />
        <label htmlFor="password">Password</label>
        <input type="text" id="password" name="password" value={password} onChange={handlePasswordChange} />
        <br />
        <button onClick={handleRegister}>Enter</button>
      </div>

      <div className="reserve-container">
        <h2>Reserve</h2>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} />
        <br />
        <label htmlFor="device">Device</label>
        <input type="text" id="device" name="device" value={device} onChange={handleDeviceChange} />
        <br />
        <label htmlFor="time">Time</label>
        <input type="text" id="time" name="time" value={time} onChange={handleTimeChange} />
        <br />
        <button onClick={handleReserve}>Enter</button>
      </div>
    </div>
  );
}
