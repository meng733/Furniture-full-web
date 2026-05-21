import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiCheckCircle, FiHeart, FiSettings } from 'react-icons/fi';
import { useTranslation } from '../context/LanguageContext';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('stats.experience') || 'Years of Experience', value: '12+' },
    { label: t('stats.projects') || 'Completed Projects', value: '1,500+' },
    { label: t('stats.artisans') || 'Skilled Artisans', value: '45+' },
    { label: t('stats.clients') || 'Happy Clients', value: '99%' }
  ];

  const values = [
    {
      icon: <FiAward size={24} className="text-wood-600 dark:text-wood-400" />,
      title: t('values.title1') || 'Premium Craftsmanship',
      description: t('values.desc1') || 'We use the finest local and imported hardwoods combined with state-of-the-art joinery techniques to create pieces that last generations.'
    },
    {
      icon: <FiSettings size={24} className="text-wood-600 dark:text-wood-400" />,
      title: t('values.title2') || 'Bespoke Customization',
      description: t('values.desc2') || 'Every space is unique. We collaborate closely with you to tailor dimensions, materials, finishes, and fabrics to your exact lifestyle.'
    },
    {
      icon: <FiHeart size={24} className="text-wood-600 dark:text-wood-400" />,
      title: t('values.title3') || 'Sustainable Sourcing',
      description: t('values.desc3') || 'We prioritize environmental responsibility by obtaining our timber from sustainably managed forests and using eco-friendly varnishes.'
    },
    {
      icon: <FiCheckCircle size={24} className="text-wood-600 dark:text-wood-400" />,
      title: t('values.title4') || 'Guaranteed Quality',
      description: t('values.desc4') || 'We stand by our work. Every furniture piece comes with a comprehensive warranty and dedicated after-sales maintenance support.'
    }
  ];

  const steps = [
    { number: '01', title: t('process.step1_title') || 'Consultation & Sketching', text: t('process.step1_desc') || 'We discuss your ideas, take dimensions, and prepare initial concept drafts.' },
    { number: '02', title: t('process.step2_title') || '3D Visualization', text: t('process.step2_desc') || 'We render the design in 3D so you can preview how the furniture fits your space.' },
    { number: '03', title: t('process.step3_title') || 'Material Selection', text: t('process.step3_desc') || 'Choose from our range of premium hardwoods (mahogany, oak, walnut) and luxury textiles.' },
    { number: '04', title: t('process.step4_title') || 'Precision Handcrafting', text: t('process.step4_desc') || 'Our master carpenters construct your order using traditional mortise-and-tenon joints.' },
    { number: '05', title: t('process.step5_title') || 'White-Glove Delivery', text: t('process.step5_desc') || 'We deliver, assemble, and perfectly install the furniture directly in your home.' }
  ];

  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wood-600 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
          >
            {t('about.title') || 'Crafting Timeless Spaces'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg leading-8 text-zinc-300 max-w-2xl mx-auto"
          >
            {t('about.subtitle') || 'At Novus Furniture, we blend contemporary design aesthetics with traditional woodworking craftsmanship to build spaces of luxury and comfort in Addis Ababa.'}
          </motion.p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury bg-zinc-100 dark:bg-zinc-800">
              <img 
                src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80" 
                alt="Woodworking workshop" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:flex flex-col bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl p-6 border border-zinc-800 shadow-xl max-w-[200px]">
              <span className="font-display text-4xl font-black text-wood-400">100%</span>
              <span className="text-xs text-zinc-400 mt-1 uppercase font-semibold tracking-wider">{t('about.ethiopianCrafted') || 'Ethiopian Crafted & Designed'}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-wood-600 dark:text-wood-400">{t('about.story') || 'Our Story'}</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {t('about.storyTitle') || 'From a Tiny Workshop to Premium Showrooms'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
              {t('about.storyDesc1') || 'Novus began in 2014 with just two master carpenters and a vision to challenge the low-quality imports flooding the market. We believed that Ethiopian homes deserved premium, solid-hardwood furniture designed with a modern perspective.'}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
              {t('about.storyDesc2') || 'Today, our state-of-the-art facility in Addis Ababa houses dozens of dedicated artisans, woodcarvers, and engineers. We source premium mahogany, wanza, and oak to construct dining suites, living spaces, and bedroom collections that represent the pinnacle of durability and elegance.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-zinc-50 border-y border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-wood-600 dark:text-wood-400">{t('about.philosophy') || 'Our Philosophy'}</span>
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl mt-3">
            {t('about.philosophyTitle') || 'Built on Integrity and Passion'}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            {t('about.philosophyDesc') || 'We hold ourselves to the highest standards, ensuring every cut, sand, and stitch reflects our dedication to design perfection.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex gap-6 hover:shadow-luxury transition-all"
            >
              <div className="h-12 w-12 rounded-2xl bg-wood-50 dark:bg-wood-950/20 flex items-center justify-center flex-shrink-0">
                {val.icon}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">{val.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Development / Creation Process Timeline */}
      <section className="bg-zinc-50 border-t border-zinc-100 dark:bg-zinc-900/20 dark:border-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-wood-600 dark:text-wood-400">{t('process.title') || 'Our Process'}</span>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl mt-3">
              {t('process.titleLong') || 'How We Create Your Furniture'}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
              {t('process.desc') || 'A comprehensive journey from the initial creative concept to placement in your room.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-3xl font-black text-wood-200 dark:text-zinc-800">{step.number}</span>
                  <h3 className="font-display font-bold text-zinc-900 dark:text-white mt-3">{step.title}</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
