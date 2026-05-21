import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp, FaStar, FaTelegramPlane, FaFacebookMessenger } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { getWhatsAppLink } from '../utils/whatsapp';
import { useTranslation } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { t } = useTranslation();
  
  const favorited = isInWishlist(product._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (favorited) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const transName = t('products.' + product.name) || product.name;
  const transDesc = t('products.' + product.name + '_desc') || product.description;
  const transCat = t('categories.' + product.category) || product.category;

  const imageUrl = product.images?.[0]?.startsWith('http') 
    ? product.images[0] 
    : product.images?.[0] 
      ? `http://localhost:5000${product.images[0]}` 
      : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-100 p-3 shadow-soft hover:shadow-luxury dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800">
        <img
          src={imageUrl}
          alt={transName}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Floating Quick Action Buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleFavoriteClick}
            className={`rounded-full p-2.5 shadow-soft border transition-all ${
              favorited 
                ? 'bg-rose-500 border-rose-500 text-white' 
                : 'bg-white border-zinc-100 text-zinc-600 hover:text-rose-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300'
            }`}
            aria-label="Add to Wishlist"
          >
            <FiHeart size={16} fill={favorited ? 'currentColor' : 'none'} />
          </button>
          
          <Link
            to={`/products/${product._id}`}
            className="rounded-full bg-white border border-zinc-100 p-2.5 text-zinc-650 shadow-soft hover:text-wood-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-wood-400 transition-all"
            aria-label="View Details"
          >
            <FiEye size={16} />
          </Link>
        </div>

        {/* Featured Tag */}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase dark:bg-white dark:text-zinc-900 shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Content Details */}
      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-wider text-zinc-400 dark:text-zinc-500 uppercase font-medium">
            {transCat}
          </span>
          {/* Ratings */}
          <div className="flex items-center gap-1">
            <FaStar className="text-amber-400" size={12} />
            <span className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">{product.ratings || 5}</span>
          </div>
        </div>

        <Link to={`/products/${product._id}`} className="mt-2 block">
          <h3 className="font-display font-medium text-zinc-900 hover:text-wood-600 dark:text-white dark:hover:text-wood-400 transition-colors line-clamp-1">
            {transName}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {transDesc}
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <span className="font-display font-bold text-zinc-900 dark:text-white">
            {product.price?.toLocaleString()} <span className="text-xs font-normal text-zinc-500">ETB</span>
          </span>
        </div>

        {/* Primary WhatsApp Order & Secondary Social Buttons */}
        <div className="mt-4 space-y-2">
          <a
            href={getWhatsAppLink(transName, product.price, product._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 shadow-soft transition-all"
          >
            <FaWhatsapp size={16} />
            <span>{t('buttons.orderWhatsApp')}</span>
          </a>
          
          <div className="grid grid-cols-4 gap-1.5">
            {/* Telegram */}
            <a
              href={`https://t.me/novusfurniture`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 py-2 text-zinc-650 hover:bg-sky-50 hover:text-sky-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-sky-950/20 dark:hover:text-sky-400 transition-colors"
              title="Telegram"
            >
              <FaTelegramPlane size={14} />
            </a>

            {/* Facebook Messenger */}
            <a
              href={`https://m.me/novusfurniture`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 py-2 text-zinc-650 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 transition-colors"
              title="Facebook Messenger"
            >
              <FaFacebookMessenger size={14} />
            </a>

            {/* SMS Option */}
            <a
              href={`sms:+251911000000?body=${encodeURIComponent(
                `Hello, I want to order "${transName}" for ${product.price?.toLocaleString()} ETB. Please contact me.`
              )}`}
              className="flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 py-2 text-zinc-650 hover:bg-amber-50 hover:text-amber-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-amber-950/20 dark:hover:text-amber-400 transition-colors"
              title="SMS Order"
            >
              <FiMessageSquare size={14} />
            </a>

            {/* Details page link */}
            <Link
              to={`/products/${product._id}`}
              className="flex items-center justify-center rounded-xl bg-zinc-900 py-2 text-[10px] font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
              title="View Details"
            >
              <span>{t('buttons.details')}</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
