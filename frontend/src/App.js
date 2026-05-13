import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './lib/AuthContext';
import { RequireAdmin } from './lib/AuthGuards';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Visa = lazy(() => import('./pages/Visa'));
const IndiaVisa = lazy(() => import('./pages/IndiaVisa'));
const Apply = lazy(() => import('./pages/Apply'));
const Track = lazy(() => import('./pages/Track'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const Tickets = lazy(() => import('./pages/Tickets'));
const B2B = lazy(() => import('./pages/B2B'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const DebugForm = lazy(() => import('./pages/DebugForm'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'));

// Lazy load sub-lists to save bundle space
const AdminContactsLazy = lazy(() => import('./pages/admin/AdminLists').then(m => ({ default: m.AdminContacts })));
const AdminB2BLazy = lazy(() => import('./pages/admin/AdminLists').then(m => ({ default: m.AdminB2B })));
const AdminNewsletterLazy = lazy(() => import('./pages/admin/AdminLists').then(m => ({ default: m.AdminNewsletter })));

const FallbackLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-[#FF2A2A] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<FallbackLoader />}>
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
                <Route path="/debug-form" element={<DebugForm />} />

                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                  <Route index element={<AdminOverview />} />
                  <Route path="applications" element={<AdminApplications />} />
                  <Route path="contacts" element={<AdminContactsLazy />} />
                  <Route path="b2b" element={<AdminB2BLazy />} />
                  <Route path="newsletter" element={<AdminNewsletterLazy />} />
                  <Route path="countries" element={<AdminCMS table="countries" />} />
                  <Route path="testimonials" element={<AdminCMS table="testimonials" />} />
                  <Route path="blog" element={<AdminCMS table="blog_posts" />} />
                  <Route path="offices" element={<AdminCMS table="offices" />} />
                  <Route path="faqs" element={<AdminCMS table="faqs" />} />
                  <Route path="services" element={<AdminCMS table="services" />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
