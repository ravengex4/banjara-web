import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Visa from './pages/Visa';
import IndiaVisa from './pages/IndiaVisa';
import Apply from './pages/Apply';
import Track from './pages/Track';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import B2B from './pages/B2B';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/india-visa" element={<IndiaVisa />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/track" element={<Track />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/b2b" element={<B2B />} />
          <Route path="/login" element={<Contact />} />
          <Route path="/register" element={<Contact />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
