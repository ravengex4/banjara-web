import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './lib/AuthContext';
import { RequireAdmin } from './lib/AuthGuards';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Visa from './pages/Visa';
import IndiaVisa from './pages/IndiaVisa';
import Apply from './pages/Apply';
import Track from './pages/Track';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Tickets from './pages/Tickets';
import B2B from './pages/B2B';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminApplications from './pages/admin/AdminApplications';
import { AdminContacts, AdminB2B, AdminNewsletter } from './pages/admin/AdminLists';
import AdminCMS from './pages/admin/AdminCMS';

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/visa" element={<Visa />} />
            <Route path="/india-visa" element={<IndiaVisa />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/track" element={<Track />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/b2b" element={<B2B />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminOverview />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="b2b" element={<AdminB2B />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="countries" element={<AdminCMS table="countries" />} />
              <Route path="testimonials" element={<AdminCMS table="testimonials" />} />
              <Route path="blog" element={<AdminCMS table="blog_posts" />} />
              <Route path="offices" element={<AdminCMS table="offices" />} />
              <Route path="faqs" element={<AdminCMS table="faqs" />} />
              <Route path="services" element={<AdminCMS table="services" />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
