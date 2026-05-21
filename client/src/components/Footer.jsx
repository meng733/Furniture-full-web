import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaTelegramPlane } from 'react-icons/fa';
import { useTranslation } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400">
      
      {/* Top Banner/CTA */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-wider text-zinc-900 dark:text-white">
              NOVUS
            </span>
            <span className="h-2 w-2 rounded-full bg-wood-500"></span>
          </Link>
          <p className="text-sm leading-relaxed mt-2 text-zinc-500 dark:text-zinc-400">
            {t('labels.brandDescription') || "Addis Ababa's premium custom furniture designer. Creating exquisite, high-quality wood and metal installations for elegant homes, corporate offices, and luxury apartments."}
          </p>
          <div className="flex gap-3 mt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-white dark:hover:text-zinc-950 transition-all">
              <FiInstagram size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-white dark:hover:text-zinc-950 transition-all">
              <FiFacebook size={16} />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-900 hover:text-white dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-white dark:hover:text-zinc-950 transition-all">
              <FaTelegramPlane size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-white mb-6">
            {t('labels.quickLinks') || "Quick Links"}
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/" className="hover:text-wood-600 dark:hover:text-wood-400 transition-colors">{t('nav.home')}</Link></li>
            <li><Link to="/products" className="hover:text-wood-600 dark:hover:text-wood-400 transition-colors">{t('nav.products')}</Link></li>
            <li><Link to="/gallery" className="hover:text-wood-600 dark:hover:text-wood-400 transition-colors">{t('nav.gallery')}</Link></li>
            <li><Link to="/about" className="hover:text-wood-600 dark:hover:text-wood-400 transition-colors">{t('nav.about')}</Link></li>
            <li><Link to="/contact" className="hover:text-wood-600 dark:hover:text-wood-400 transition-colors">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 text-sm">
          <h4 className="font-display text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-white mb-2">
            {t('labels.contactUs') || "Contact Us"}
          </h4>
          <div className="flex items-start gap-3">
            <FiMapPin className="text-wood-500 mt-1 flex-shrink-0" size={16} />
            <span>{t('footer.address') || "Bole, Around Atlas Hotel, Addis Ababa, Ethiopia"}</span>
          </div>
          <div className="flex items-center gap-3">
            <FiPhone className="text-wood-500 flex-shrink-0" size={16} />
            <span>+251 911 000 000 / +251 912 000 000</span>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-wood-500 flex-shrink-0" size={16} />
            <span>info@novusfurniture.com</span>
          </div>
          <div className="flex items-start gap-3">
            <FiClock className="text-wood-500 mt-1 flex-shrink-0" size={16} />
            <div>
              <p>{t('footer.businessHours') || "Mon - Sat: 8:30 AM - 6:30 PM"}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{t('footer.sunday') || "Sunday: Closed"}</p>
            </div>
          </div>
        </div>

        {/* Google Maps / Office Location */}
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-sm font-semibold tracking-wider text-zinc-900 uppercase dark:text-white mb-4">
            {t('labels.showroom') || "Our Showroom"}
          </h4>
          <div className="w-full h-36 rounded-xl overflow-hidden shadow-inner-soft border border-zinc-200 dark:border-zinc-800">
            <iframe 
              title={t('footer.showroomTitle') || "Novus Showroom Addis Ababa"}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762.66579309831!2d38.77583641774026!3d9.002871142512686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85aaf5b6cf71%3A0x6e9f2eb5fbcd23f!2sBole%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1716200000000!5m2!1sen!2set" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Copyright Banner */}
      <div className="bg-zinc-100 py-6 dark:bg-zinc-950 dark:border-t dark:border-zinc-900 text-center text-xs text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} NOVUS. {t('labels.allRightsReserved') || "All rights reserved."}</span>
          <span className="flex gap-4">
            <Link to="/about" className="hover:underline">{t('labels.privacyPolicy') || "Privacy Policy"}</Link>
            <Link to="/contact" className="hover:underline">{t('labels.termsOfService') || "Terms of Service"}</Link>
          </span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
