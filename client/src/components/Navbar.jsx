import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, 
  FiMoon, FiSun, FiUser 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onCartToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const { currentLanguage, changeLanguage, languages, t } = useTranslation();
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-wider text-zinc-900 dark:text-white">
                NOVUS
              </span>
              <span className="h-2 w-2 rounded-full bg-wood-500"></span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-display text-sm font-medium tracking-wide transition-all hover:text-wood-600 ${
                      isActive 
                        ? 'text-wood-600 dark:text-wood-400 font-semibold border-b-2 border-wood-500 pb-1' 
                        : 'text-zinc-600 dark:text-zinc-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {/* Language Switcher Dropdown */}
              <div className="relative flex items-center pr-1 border-r border-zinc-100 dark:border-zinc-800 mr-1 gap-1">
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {t('nav.selectLanguage')}:
                </span>
                <select
                  value={currentLanguage}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-transparent hover:text-wood-600 dark:hover:text-wood-400 text-zinc-700 dark:text-zinc-300 font-display text-xs font-bold uppercase tracking-wider outline-none border-b border-transparent py-1 pr-4 pl-1 cursor-pointer transition-all bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a88f70%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_center] bg-no-repeat"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-zinc-900 bg-white dark:bg-zinc-950 dark:text-white text-xs font-semibold">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                aria-label="Toggle Theme"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Wishlist Link */}
              <Link 
                to="/gallery?tab=wishlist"
                className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-wood-500 dark:text-zinc-950">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button 
                onClick={onCartToggle}
                className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-wood-500 text-[10px] font-bold text-zinc-950">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile or Dashboard */}
              <Link 
                to={user?.role === 'admin' ? '/admin' : '/login'}
                className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                aria-label="Profile/Admin"
              >
                <FiUser size={20} />
              </Link>

              {/* WhatsApp Business Link */}
              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-emerald-600 hover:shadow-md"
              >
                <FaWhatsapp size={16} />
                <span>Chat</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-zinc-600 hover:text-zinc-900 md:hidden dark:text-zinc-300 dark:hover:text-white transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 p-4 pt-20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-luxury dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">{t('labels.refineSearch')}</h3>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('labels.searchPlaceholder') || "Search for furniture..."}
                    className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white dark:focus:bg-zinc-900 transition-all"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit" 
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
                >
                  {t('buttons.applyFilter')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-zinc-950/30 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-white p-6 shadow-luxury dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="font-display font-bold text-lg text-zinc-900 dark:text-white">Menu</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <FiX size={22} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `font-display text-xl font-medium tracking-wide transition-all ${
                          isActive 
                            ? 'text-wood-600 dark:text-wood-400 font-bold' 
                            : 'text-zinc-600 dark:text-zinc-300'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                {/* Language Switcher in Mobile Drawer */}
                <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t('nav.selectLanguage')}</span>
                  <div className="flex gap-2 flex-wrap">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
                          currentLanguage === lang.code
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-650 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800 flex flex-col gap-4">
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-emerald-600"
                >
                  <FaWhatsapp size={18} />
                  <span>{t('hero.whatsapp')}</span>
                </a>
                <div className="text-center text-xs text-zinc-400">
                  Novus Furniture Addis Ababa, Ethiopia
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
