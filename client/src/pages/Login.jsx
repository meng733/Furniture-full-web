import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg(t('alerts.fillFields') || 'Please fill in all fields.');
      return;
    }

    const result = await login(email, password);
    if (!result || !result.success) {
      setErrorMsg(result?.message || t('alerts.invalidAuth') || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-luxury dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {t('labels.welcomeBack')}
          </h2>
          <p className="mt-2.5 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            {t('labels.signinDesc')}
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
          >
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              {t('labels.email')}
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              {t('labels.password')}
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-12 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-soft disabled:opacity-50"
          >
            <span>{loading ? t('buttons.submitting') : t('nav.login')}</span>
            {!loading && <FiArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t('labels.orRegister') || "Don't have an account?"}{' '}
            <Link to="/register" className="font-semibold text-wood-600 dark:text-wood-400 hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
