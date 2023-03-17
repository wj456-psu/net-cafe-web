import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function User({ username }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8080/api/users?username=${username}`)
      .then(response => setUser(response.data[0]));
  }, [username]);

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Your current balance is: {user.balance}</p>
    </div>
  );
}
