import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowUp } from 'react-icons/fi';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingControls = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-800 shadow-luxury border border-zinc-100 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all duration-300"
            aria-label="Scroll to Top"
          >
            <FiArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <motion.a
        href={getGeneralWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-luxury hover:bg-emerald-600 transition-all duration-300 relative group"
        aria-label="WhatsApp Inquiry"
      >
        <FaWhatsapp size={28} />
        
        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all origin-right rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-soft pointer-events-none whitespace-nowrap dark:bg-white dark:text-zinc-950">
          Order custom furniture!
        </span>
      </motion.a>
    </div>
  );
};

export default FloatingControls;
