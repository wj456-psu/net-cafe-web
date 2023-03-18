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
    axios.get(`http://localhost:8080/api/user/${user.state.username}`)
      .then(response => {
        setUser(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [user.state.username]);

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
    const newBalance = userData.balance - selectedItem.price;
    // Send the order to the server
    axios.post('http://localhost:8080/api/order', {
      username: userData.username,
      item: selectedItem
    })
    .then(response => {
      alert('Your order has been placed!');
    })
    .catch(error => {
      console.error(error.response);
      alert('There was an error placing your order. Please try again later.');
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
              alt={`Photo ${index}`}
              className={selectedItem === photo ? 'selected' : ''}
              onClick={() => handleSelect(photo)}
            />
            <p>{photo.name}</p>
            <p>{photo.price}</p>
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
