import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Loans', path: '/loans' },
  { name: 'Calculator', path: '/calculator' },
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userToken');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Pages that have a dark hero background (transparent nav needs white text)
  const darkHeroPages = ['/', '/about', '/loans', '/calculator', '/apply', '/blog', '/faq', '/contact', '/privacy', '/terms', '/track', '/dashboard', '/login'];
  const isDarkHero = darkHeroPages.includes(location.pathname) || location.pathname.startsWith('/blog/');
  const useWhiteText = isDarkHero && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : isDarkHero ? 'bg-primary-dark' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Apex Finance" className="w-10 h-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow object-cover" />
            <h1 className={`text-lg font-heading font-bold leading-tight transition-colors duration-300 ${useWhiteText ? 'text-white' : 'text-primary'}`}>Apex Finance</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? useWhiteText
                      ? 'text-secondary bg-white/10 font-semibold'
                      : 'text-primary bg-primary/5 font-semibold'
                    : useWhiteText
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-body hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${useWhiteText ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-body hover:text-primary hover:bg-primary/5'}`}
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${useWhiteText ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-body hover:text-primary hover:bg-primary/5'}`}
              >
                Login
              </Link>
            )}
            <Link
              to="/apply"
              className="px-6 py-2.5 bg-gradient-to-r from-secondary to-secondary-light text-dark font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${useWhiteText ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-primary/5'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/5 font-semibold'
                      : 'text-body hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === '/dashboard' ? 'text-primary bg-primary/5 font-semibold' : 'text-body hover:text-primary hover:bg-primary/5'}`}
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === '/login' ? 'text-primary bg-primary/5 font-semibold' : 'text-body hover:text-primary hover:bg-primary/5'}`}
                >
                  Login
                </Link>
              )}
              <Link
                to="/apply"
                className="block w-full text-center px-6 py-3 mt-4 bg-gradient-to-r from-secondary to-secondary-light text-dark font-semibold rounded-lg shadow-md"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
