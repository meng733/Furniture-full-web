import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiSettings, FiUser, FiInfo, FiSliders, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  // Shop Config States
  const [storeName, setStoreName] = useState('Novus Furniture');
  const [phone1, setPhone1] = useState('+251 911 000 000');
  const [phone2, setPhone2] = useState('+251 912 000 000');
  const [supportEmail, setSupportEmail] = useState('info@novusfurniture.com');
  const [showroomAddress, setShowroomAddress] = useState('Bole, Around Atlas Hotel, Addis Ababa, Ethiopia');
  const [whatsappNumber, setWhatsappNumber] = useState('251911000000');
  const [deliveryRate, setDeliveryRate] = useState('1500');

  // Admin Profile States
  const [adminName, setAdminName] = useState(user?.name || 'Administrator');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@novus.com');
  
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Simulate API saving
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">System Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Configure metadata variables, contact records, and system displays.</p>
      </div>

      {/* Floating toast message */}
      {showSavedToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-8 bg-emerald-500 text-white rounded-2xl px-6 py-3 shadow-luxury flex items-center gap-2 z-50 text-sm font-semibold"
        >
          <FiCheck size={16} />
          <span>Configurations Saved Successfully</span>
        </motion.div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Company Settings */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-4 dark:border-zinc-800">
            <FiSliders className="text-wood-500" size={20} />
            <h3 className="font-display font-bold text-zinc-900 dark:text-white">Store Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Store Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">WhatsApp Business Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
              <p className="text-[10px] text-zinc-400 mt-1">Country code first, no spaces or special characters (e.g. 251911000000).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Primary Hotline</label>
              <input
                type="text"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Secondary Hotline</label>
              <input
                type="text"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Showroom Address</label>
              <input
                type="text"
                value={showroomAddress}
                onChange={(e) => setShowroomAddress(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Delivery Base Rate (ETB)</label>
              <input
                type="number"
                value={deliveryRate}
                onChange={(e) => setDeliveryRate(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Support Email Address</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Admin Profile */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-4 dark:border-zinc-800">
            <FiUser className="text-wood-500" size={20} />
            <h3 className="font-display font-bold text-zinc-900 dark:text-white">Admin Profile Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Full Display Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Email Address</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Global theme details */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiInfo className="text-wood-500" size={20} />
            <div>
              <h3 className="font-display font-bold text-zinc-900 dark:text-white">Dashboard Design System</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Toggle dark/light palettes across the entire interface.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-soft"
          >
            <FiSave size={16} />
            <span>Save System Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;
