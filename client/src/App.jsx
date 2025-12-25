import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MediumDetail from './pages/MediumDetail';
import CreateMedium from './pages/CreateMedium';
import CreateItem from './pages/CreateItem';
import About from './pages/About';
import Wishlist from './pages/Wishlist';
import WishlistDetail from './pages/WishlistDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medium/:id" element={<MediumDetail />} />
          <Route path="/create-medium" element={<CreateMedium />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/wishlist/:id" element={<WishlistDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;