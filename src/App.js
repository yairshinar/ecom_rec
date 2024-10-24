import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Import your page components
import Home from './components/Home';
import ProductList from './components/ProductList';
import Recommendations from './components/Recommendations';
import ProductDetails from './components/ProductDetail'; // Product page with product ID

function App() {
 
    useEffect(() => {
      localStorage.setItem('userId', "user123");

        }  , []);
 
  return (
    <Router>
      <div>
 

        {/* Route Configurations */}
        <Routes>
        <Route path="/" element={<Home />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
