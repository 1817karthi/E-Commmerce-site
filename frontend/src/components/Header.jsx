import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Package, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search suggestions
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/products/suggestions?keyword=${val}`);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
      finally { setLoadingSuggestions(false); }
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const pickSuggestion = (product) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  const logoutHandler = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  const categories = ['Electronics', 'Fashion', 'Kids', 'Shoes', 'Arts'];
  const hiddenProductNames = ['4K Ultra HD Smart TV 55"', 'Silk Evening Dress', 'Kids Electric Scooter'];

  return (
    <header className="glassmorphism sticky top-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wider flex items-center gap-2 shrink-0" style={{ color: 'var(--accent)' }}>
          <div className="neumorph-btn p-2 rounded-xl" style={{ color: 'var(--accent)' }}>
            <ShoppingCart size={24} />
          </div>
          VibeStore
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="neumorph-inset rounded-full flex items-center px-5 py-3 gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search products, brands..."
                className="bg-transparent outline-none w-full text-base"
                style={{ color: 'var(--text-primary)' }}
              />
              <button type="submit" style={{ color: 'var(--text-muted)' }} className="hover:text-accent transition shrink-0">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50 skeuomorph-card" style={{ border: '1px solid var(--border)' }}>
              {loadingSuggestions ? (
                <div className="px-5 py-4 flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                  <div className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
                  Searching...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>No products found</div>
              ) : (
                suggestions
                  .filter((p) => !hiddenProductNames.includes(p.name))
                  .map((p) => (
                    <button
                      key={p._id}
                      onClick={() => pickSuggestion(p)}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-surface text-left transition"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.category} · <span style={{ color: 'var(--accent)' }}>₹{p.price?.toFixed(2)}</span></p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="neumorph-btn p-3 rounded-2xl transition"
            style={{ color: 'var(--accent)' }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative neumorph-btn p-3 rounded-2xl transition" style={{ color: 'var(--text-secondary)' }}>
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* User */}
          {userInfo ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="neumorph-btn px-4 py-3 rounded-2xl flex items-center gap-2 transition"
                style={{ color: 'var(--text-secondary)' }}
              >
                <User size={20} />
                <span className="hidden md:block font-semibold max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {userInfo.name.split(' ')[0]}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 skeuomorph-card rounded-2xl overflow-hidden py-2 shadow-2xl z-50" style={{ border: '1px solid var(--border)' }}>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 font-medium transition" style={{ color: 'var(--text-secondary)' }}>
                    <Package size={18} /> My Orders
                  </Link>
                  {userInfo.isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 font-medium transition" style={{ color: 'var(--text-secondary)' }}>
                      <LayoutDashboard size={18} /> Admin Panel
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                    <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-5 py-3 font-medium text-red-400 hover:bg-red-500/10 transition">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="neumorph-btn px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition" style={{ color: 'var(--text-secondary)' }}>
              <User size={20} />
              <span className="hidden md:block">Login</span>
            </Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden neumorph-btn p-3 rounded-2xl" style={{ color: 'var(--text-secondary)' }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Category Bar */}
      <div className="hidden md:block" style={{ borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
        <div className="container mx-auto px-4 py-3 flex gap-8">
          {categories.map((cat) => (
            <Link key={cat} to={`/category/${cat.toLowerCase()}`}
              className="font-semibold text-sm transition hover:tracking-wide"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glassmorphism px-4 py-6 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Mobile search */}
          <div className="neumorph-inset rounded-xl flex items-center px-4 py-3 gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="bg-transparent outline-none w-full text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
            <Search size={18} style={{ color: 'var(--accent)' }} />
          </div>
          {/* Mobile suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="skeuomorph-card rounded-2xl overflow-hidden">
              {suggestions.map((p) => (
                <button key={p._id} onClick={() => { pickSuggestion(p); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm font-semibold truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
          {/* Mobile categories */}
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link key={cat} to={`/category/${cat.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                className="neumorph-btn py-3 px-4 rounded-xl text-center font-semibold text-sm transition"
                style={{ color: 'var(--text-secondary)' }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
