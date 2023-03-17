import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './User.css';

export default function User() {
  const [userData, setUser] = useState("");
  const [photos, setPhotos] = useState([]);
  const user = useLocation();
  console.log('user =', user.state.username);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/user/${user.state.username}`)
      .then(response => {
        setUser(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [user.state.username]);

  setInterval(() => {
    axios.get(`http://localhost:8080/api/user/${user.state.username}`)
      .then(response => {
        setUser(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, 10000);

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

  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        setFocusedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'ArrowRight') {
        setFocusedIndex((prevIndex) => Math.min(prevIndex + 1, photos.length - 1));
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [photos]);
  
  console.log(photos);

  return (
    <div>
      <h2>Welcome, {userData.username}!</h2>
      <p>Your current balance is: {userData.balance}</p>
      <p>Time remained: {userData.time_remained}</p>
      <h1>Snack and Drink</h1>
      {photos.map((photo, index) => (
        <img
          key={photo.id}
          src={photo.img}
          alt={`Photo ${index}`}
          className={index === focusedIndex ? 'focused' : ''}
        />
      ))}
    </div>
  );
}
