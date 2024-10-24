import React from 'react';
import { clearUserLogs } from '../services/api'; // Import the clear user data function
import { Link } from 'react-router-dom';

const Home = () => {
  // Set and get userId from localStorage
  localStorage.setItem('userId', "user123");
  const userId = localStorage.getItem('userId');

  // Function to handle clearing user data
  const handleClearUserData = async () => {
    // Clear user data from the database and localStorage
    await clearUserLogs(userId); 
    alert('User data cleared!');
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      
      {/* Button to clear user data */}
      <button onClick={handleClearUserData}>
        Clear All User Data
      </button>
      <Link to="/products">Products</Link>  
    </div>
  );
};

export default Home;
