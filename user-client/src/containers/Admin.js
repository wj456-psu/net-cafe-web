import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Admin.css";

export default function Admin() {
  const [devices, setDevices] = useState([]);
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8080/api/devices')
      .then(response => {
        setDevices(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  };

  function handleAmountChange(event) {
    setAmount(event.target.value);
  };

  function handleTopUp(event) {
    event.preventDefault();
    axios.put('http://localhost:8080/api/users', {
      username: username,
      balance: amount
    })
    .then(response => {
      console.log(response);
      // Update the data in the state or fetch new data from the server
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div>
      <h1>Database Data</h1>
      <div className="data-container">
        {devices.map(device => (
          <div key={device.id} className="data-box">
            <h2>{device.id}</h2>
            <p>Used By: {device.used_by}</p>
            <p>Amount: {device.amount}</p>
          </div>
        ))}
      </div>
      <div className="top-up-container">
        <h2>TOP-UP</h2>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} />
        <br />
        <label htmlFor="amount">Amount</label>
        <input type="number" id="amount" name="amount" value={amount} onChange={handleAmountChange} />
        <br />
        <button onClick={handleTopUp}>Enter</button>
      </div>
    </div>
  );
}
