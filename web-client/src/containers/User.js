import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './User.css';

export default function User() {
  const [userData, setUser] = useState("");
  const [photos, setPhotos] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const user = useLocation();

  useEffect(() => {
    const fetchData = (username) => {
      axios.get(`http://localhost:8080/api/user/${username}`)
        .then(response => {
          setUser(response.data.data);
        })
        .catch(error => {
          console.error(error);
        });
    };
    fetchData(user.state.username);
    const interval = setInterval(() => {
      fetchData(user.state.username);
    }, 5000);
    return () => clearInterval(interval);
  }, [user.state.username, selectedItem]);

  useEffect(() => {
    async function getPhotos() {
      try {
        const response = await axios.get('http://localhost:8080/api/goods');
        setPhotos(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getPhotos();
  }, []);

  const handleSelect = (item) => {
    setSelectedItem(item);
  }

  const handleOrder = () => {
    // Subtract the selected item price from the user's balance
    const nextBalance = userData.balance - selectedItem.price;
    if (nextBalance < 0) {
      alert("Not enough money! Please TOP-UP!");
      return;
    }
    if (selectedItem.left === 0) {
      alert("Item not in stock!");
      return;
    }
    selectedItem.left--;
    axios.put(`http://localhost:8080/api/user/${user.state.username}`, {
      "balance": nextBalance
    }).then(response => {
      console.log(response.data);
      axios.put(`http://localhost:8080/api/good/${selectedItem.id}`, {
        "left": selectedItem.left
      }).then(response => {
        console.log(response.data);
        alert('Your order has been placed!');
      }).catch(error => {
        console.error(error);
      })
    }).catch(error => {
      console.error(error);
    });
    // Clear the selected item
    setSelectedItem(null);
  }

  return (
    <div className="container">
      <div className="status">
        <h2>Welcome, {userData.username}!</h2>
        <p></p>
        <p className="balance">Your current balance is: {userData.balance}</p>
        <p className="time">Time remained: {userData.time_remained}</p>
      </div>

      <div className="items-container">
        <h1>Snack and Drink</h1>
        {photos.map((photo, index) => (
          <div className="item" key={photo.id}>
            <img
              src={photo.img}
              alt={`item ${index}`}
              className={selectedItem === photo ? 'selected' : ''}
              onClick={() => handleSelect(photo)}
            />
            <p>{photo.name}</p>
            <p>{photo.price}</p>
            <p>In stock: {photo.left}</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="selected-item">
          <h3>Your selection:</h3>
          <img src={selectedItem.img} alt={selectedItem.name} />
          <p>{selectedItem.name}</p>
          <p>{selectedItem.price}</p>
          <button onClick={handleOrder}>Confirm order</button>
        </div>
      )}
    </div>
  );
}
