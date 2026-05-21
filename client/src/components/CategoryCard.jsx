import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from '../context/LanguageContext';

const CategoryCard = ({ category }) => {
  const { t } = useTranslation();

  const translatedName = t(`categories.${category.name}`) || category.name;
  const translatedDesc = t(`categories.${category.name}_desc`) || category.description;

  return (
    <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
      <motion.div 
        whileHover={{ y: -6 }}
        className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 shadow-soft cursor-pointer"
      >
        {/* Background Image */}
        <img
          src={category.image}
          alt={translatedName}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300"></div>

        {/* Text Details */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-white">
          <div>
            <h3 className="font-display text-xl font-bold tracking-wide">
              {translatedName}
            </h3>
            {category.description && (
              <p className="text-xs text-zinc-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                {translatedDesc}
              </p>
            )}
          </div>
          <div className="rounded-full bg-white/20 p-2 text-white group-hover:bg-white group-hover:text-zinc-950 transition-colors backdrop-blur-sm">
            <FiArrowRight size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
