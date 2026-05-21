import React, { useState } from 'react';
import { FiX, FiMaximize2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { mockGallery } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';

const galleryImages = [
  ...mockGallery,
  { id: 7, title: 'Executive Office Lounge', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', category: 'Office' },
  { id: 8, title: 'Luxury Bedroom Suite', image: 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=800&q=80', category: 'Bedroom' },
  { id: 9, title: 'Open Plan Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', category: 'Kitchen' },
  { id: 10, title: 'Minimalist Reading Nook', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', category: 'Living Room' },
  { id: 11, title: 'Penthouse Dining Room', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', category: 'Dining Room' },
  { id: 12, title: 'Hotel Lobby Sofas', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80', category: 'Living Room' },
];

const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Dining Room'];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const { t } = useTranslation();

  const filtered = activeFilter === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-wood-500">{t('labels.portfolio') || "Portfolio"}</span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {t('gallery.title') || "Our Installation Gallery"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed">
          {t('gallery.desc') || "Explore real-world furniture installations completed for homes, offices, hotels, and luxury apartments across Addis Ababa."}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full px-5 py-2 text-xs font-semibold transition-all border ${
              activeFilter === cat
                ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950'
                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-white'
            }`}
          >
            {t('categories.' + cat) || cat}
          </button>
        ))}
      </div>

      {/* Masonry Image Grid */}
      <motion.div 
        layout
        className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
      >
        <AnimatePresence>
          {filtered.map((item) => {
            const transTitle = t('gallery.' + item.title) || item.title;
            const transCat = t('categories.' + item.category) || item.category;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 break-inside-avoid cursor-pointer shadow-soft hover:shadow-luxury transition-shadow duration-300"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.image}
                  alt={transTitle}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="text-white font-display font-bold text-sm">{transTitle}</p>
                  <span className="text-zinc-300 text-xs mt-0.5">{transCat}</span>
                </div>
                {/* Maximize icon */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMaximize2 size={14} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-luxury"
            >
              <img
                src={selectedImage.image}
                alt={t('gallery.' + selectedImage.title) || selectedImage.title}
                className="w-full object-cover max-h-[80vh]"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 to-transparent p-6">
                <p className="text-white font-display font-bold text-lg">
                  {t('gallery.' + selectedImage.title) || selectedImage.title}
                </p>
                <span className="text-zinc-400 text-xs">
                  {t('categories.' + selectedImage.category) || selectedImage.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-sm p-2.5 text-white hover:bg-white hover:text-zinc-950 transition-all"
              >
                <FiX size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
