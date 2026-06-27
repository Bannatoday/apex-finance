import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ScrollToTop from './components/common/ScrollToTop';
import TawkControl from './components/common/TawkControl';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Loans = lazy(() => import('./pages/Loans'));
const Apply = lazy(() => import('./pages/Apply'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const TrackApplication = lazy(() => import('./pages/TrackApplication'));
const Login = lazy(() => import('./pages/Login'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DebtConsolidation = lazy(() => import('./pages/DebtConsolidation'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Applications = lazy(() => import('./pages/admin/Applications'));
const ApplicationDetail = lazy(() => import('./pages/admin/ApplicationDetail'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'));
const Settings = lazy(() => import('./pages/admin/Settings'));

function App() {
  return (
    <>
      <ScrollToTop />
      <TawkControl />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/track" element={<TrackApplication />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone pages (no layout wrapper) */}
          <Route path="/lp" element={<LandingPage />} />
          <Route path="/debt-consolidation" element={<DebtConsolidation />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/edit/:id" element={<BlogEditor />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
