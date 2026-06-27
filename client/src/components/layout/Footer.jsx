import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Loan Products', path: '/loans' },
  { name: 'Debt Consolidation', path: '/debt-consolidation' },
  { name: 'Apply Now', path: '/apply' },
  { name: 'EMI Calculator', path: '/calculator' },
];

const resourceLinks = [
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'Disclaimer', path: '/disclaimer' },
];

const socialLinks = [
  { icon: FaFacebookF, url: '#', label: 'Facebook' },
  { icon: FaTwitter, url: '#', label: 'Twitter' },
  { icon: FaLinkedinIn, url: '#', label: 'LinkedIn' },
  { icon: FaInstagram, url: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Apex Finance" className="w-10 h-10 rounded-lg shadow-md object-cover" />
              <h3 className="text-lg font-heading font-bold text-white">Apex Finance</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Apex Finance LLC is a free loan matching service that connects borrowers with a network of licensed lenders. We are not a direct lender and do not issue loans.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-dark transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-secondary text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-white text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-secondary text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-secondary mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">123 Financial District, Suite 500, New York, NY 10004</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:+18452412429" className="text-gray-400 hover:text-secondary text-sm transition-colors">(845) 241-2429</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-secondary shrink-0" />
                <a href="mailto:info@apexfinancellc.com" className="text-gray-400 hover:text-secondary text-sm transition-colors">info@apexfinancellc.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <HiShieldCheck className="w-5 h-5 text-accent" />
              <span>Fully Licensed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <HiShieldCheck className="w-5 h-5 text-accent" />
              <span>BBB Accredited</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <HiShieldCheck className="w-5 h-5 text-accent" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <HiShieldCheck className="w-5 h-5 text-accent" />
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Apex Finance. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs max-w-2xl leading-relaxed">
              Apex Finance LLC is not a lender. We are a free loan matching service that connects borrowers with a network of licensed lenders. We do not make credit decisions or issue loans. Loan approval, terms, and rates are determined solely by the lender. Not all applicants will qualify. APR ranges from 5.99% to 35.99% depending on creditworthiness and lender terms.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
