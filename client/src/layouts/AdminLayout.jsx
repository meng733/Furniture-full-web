import React, { useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiGrid, FiBox, FiShoppingBag, FiUsers, 
  FiMail, FiSettings, FiLogOut, FiSun, FiMoon 
} from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const sidebarLinks = [
    { name: 'Overview', path: '/admin', icon: FiGrid, end: true },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: FiUsers },
    { name: 'Messages', path: '/admin/messages', icon: FiMail },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings }
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-wider text-zinc-900 dark:text-white">
                NOVUS ADMIN
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-wood-500"></span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${
                    isActive 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-soft' 
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                  }`
                }
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          {/* Theme switcher inside admin dashboard */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 transition-all"
          >
            {darkMode ? (
              <>
                <FiSun size={18} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FiMoon size={18} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-all"
          >
            <FiLogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between px-6 md:px-8">
          <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Dashboard
          </h2>
          
          {/* User info status */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-wood-100 text-wood-800 dark:bg-wood-950/30 dark:text-wood-400">
              System Admin
            </span>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-800 dark:text-white leading-none">{user.name}</p>
              <p className="text-[10px] text-zinc-400 mt-1">{user.email}</p>
            </div>
          </div>
        </header>

        {/* Dynamic page outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
