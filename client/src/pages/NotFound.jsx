import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-light">
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-8xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-bold text-dark mb-4">Page Not Found</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">Go Home</Link>
          <Link to="/contact" className="px-8 py-3 bg-light text-primary font-semibold rounded-xl border border-border hover:bg-primary/5 transition-colors">Contact Us</Link>
        </div>
      </motion.div>
    </div>
  );
}
