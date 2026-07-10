import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="neumorph mt-20 pt-16 pb-8" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4" style={{ color: 'var(--accent)' }}>VibeStore</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Your one-stop destination for premium electronics, fashion, and lifestyle products. We bring the best brands directly to your doorstep with unrivaled aesthetics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'My Account', to: '/profile' },
                { label: 'Shopping Cart', to: '/cart' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 transition font-medium"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--accent)', opacity: 0.5 }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Categories</h4>
            <ul className="space-y-3 text-sm">
              {['Electronics', 'Fashion', 'Kids', 'Shoes', 'Arts'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat.toLowerCase()}`}
                    className="flex items-center gap-2 transition font-medium"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--accent)', opacity: 0.5 }}></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="neumorph-inset rounded-2xl py-6 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} VibeStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
