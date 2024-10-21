import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Recommendations from './components/Recommendations';

// Custom hook to log route changes
function useLogRouteChanges() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Current Route:', location.pathname);
  }, [location]);
}

// Wrapper component to use the route logging hook
function RouteChangeLogger() {
  useLogRouteChanges();
  return null; // This component doesn't render anything, it's only for logging
}

function App() {
  return (
    <Router>
      <div>
        {/* RouteChangeLogger will log the current route */}
        <RouteChangeLogger />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
