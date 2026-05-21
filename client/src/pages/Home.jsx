import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight, FiCheckCircle, FiAward, FiTruck, FiScissors, FiDollarSign } from 'react-icons/fi';
import { mockCategories, mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';
import { useTranslation } from '../context/LanguageContext';
import api from '../api/api';

const Home = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=4')
        ]);
        
        if (catRes.data.success && catRes.data.categories.length > 0) {
          setCategories(catRes.data.categories);
        }
        if (prodRes.data.success && prodRes.data.products.length > 0) {
          setProducts(prodRes.data.products.filter(p => p.featured));
        }
      } catch (err) {
        console.warn('API error on Home load, falling back to mockData:', err);
        setCategories(mockCategories);
        setProducts(mockProducts.filter(p => p.featured));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      title: t('features.title1') || 'Premium Hardwood',
      desc: t('features.desc1') || 'We utilize premium Mahogany, Oak, and Walnut hardwood for maximum lifespan.',
      icon: FiAward
    },
    {
      title: t('features.title2') || 'Expert Craftsmanship',
      desc: t('features.desc2') || 'Handcrafted by expert carpenters in our state-of-the-art Addis Ababa workshop.',
      icon: FiScissors
    },
    {
      title: t('features.title3') || 'Reliable Delivery',
      desc: t('features.desc3') || 'Free assembly and secure transport directly to your home or office.',
      icon: FiTruck
    },
    {
      title: t('features.title4') || 'Customized Fit',
      desc: t('features.desc4') || 'Tailor-made designs that match your specific dimensions and style preference.',
      icon: FiCheckCircle
    },
    {
      title: t('features.title5') || 'Reasonable Pricing',
      desc: t('features.desc5') || 'Luxury aesthetics at manufacturer direct prices. No middleman fees.',
      icon: FiDollarSign
    }
  ];

  const testimonials = [
    {
      name: t('testimonials.name1') || 'Helen Tesfaye',
      role: t('testimonials.role1') || 'Homeowner, Bole',
      comment: t('testimonials.comment1') || 'The velvet sectional sofa is a masterpiece! Fits perfectly in our living room and the fabric is extremely durable. The custom service was highly professional.',
      rating: 5
    },
    {
      name: t('testimonials.name2') || 'Dr. Dawit Alamu',
      role: t('testimonials.role2') || 'Clinic Director, Kazanchis',
      comment: t('testimonials.comment2') || 'Ordered custom office tables and cabinet sets for our clinic reception. Excellent finish, modern aesthetic, and quick installation.',
      rating: 5
    },
    {
      name: t('testimonials.name3') || 'Tewodros Kassaye',
      role: t('testimonials.role3') || 'Apartment Owner, Old Airport',
      comment: t('testimonials.comment3') || 'Stunning floating bed and TV console! Highly recommended. They paid attention to the millimeter details of the measurements.',
      rating: 5
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Background Image with darken & cinematic layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Living Room furniture background" 
            className="w-full h-full object-cover opacity-45"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=80'; }}
          />
          {/* Cinematic brightness and gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-900/35"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.08),transparent_50%)]"></div>
          
          {/* Subtle green nature aesthetic background accents */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-950/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-green-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-wood-400">
              {t('hero.subtitle')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none drop-shadow-sm">
              {t('hero.title')}
            </h1>
            <p className="text-zinc-200 text-base sm:text-lg max-w-xl leading-relaxed font-light drop-shadow-sm">
              {t('hero.desc')}
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                to="/products"
                className="rounded-full bg-wood-500 px-8 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-wood-400 shadow-soft transition-all duration-300 flex items-center gap-2"
              >
                <span>{t('hero.viewProducts')}</span>
                <FiArrowRight size={16} />
              </Link>
              <a 
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-white hover:bg-white hover:text-zinc-950 transition-all duration-300 flex items-center gap-2"
              >
                <FaWhatsapp size={18} className="text-emerald-400" />
                <span>{t('hero.whatsapp')}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-wood-500">{t('labels.category')}</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {t('home.exploreCollections') || "Explore Handcrafted Collections"}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-light">
            {t('home.exploreCollectionsDesc') || "Each category represents a core expertise in custom woodworking and interior installation."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-baseline border-b border-zinc-100 pb-6 dark:border-zinc-800 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-wood-500">{t('home.newArrivals') || "New Arrivals"}</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {t('labels.signatureCreations')}
            </h2>
          </div>
          <Link 
            to="/products"
            className="text-sm font-semibold text-wood-600 hover:text-wood-500 flex items-center gap-2 group dark:text-wood-400"
          >
            <span>{t('labels.seeAll')}</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-wood-500">{t('home.ourValue') || "Our Value"}</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {t('labels.whyNovus')}
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-soft flex flex-col items-center text-center gap-4"
              >
                <div className="p-3 bg-wood-50 dark:bg-wood-950/20 text-wood-600 dark:text-wood-400 rounded-full">
                  <feat.icon size={24} />
                </div>
                <h3 className="font-display font-semibold text-zinc-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-wood-500">{t('labels.reviews')}</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t('labels.successStories')}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-soft flex flex-col justify-between"
            >
              <p className="text-sm italic leading-relaxed text-zinc-600 dark:text-zinc-400">
                "{test.comment}"
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div>
                  <h4 className="font-display font-bold text-zinc-900 dark:text-white text-sm">{test.name}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{test.role}</p>
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  ★★★★★
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-zinc-950 text-white overflow-hidden relative py-20 px-8 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,143,112,0.15),transparent_40%)]"></div>
          <div className="space-y-4 max-w-lg z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-wood-400">{t('home.interiorInstallations') || "Interior Installations"}</span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t('labels.beautifulWork')}
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              {t('home.galleryDesc') || "Explore high-resolution installation photography showing how our custom kitchen cabinetry, custom beds, and conference tables fit inside local villas and offices."}
            </p>
          </div>
          <Link
            to="/gallery"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-150 transition-all z-10 whitespace-nowrap flex items-center gap-2"
          >
            <span>{t('labels.exploreWorkGallery')}</span>
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
