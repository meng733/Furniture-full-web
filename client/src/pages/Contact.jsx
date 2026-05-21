import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from '../context/LanguageContext';
import api from '../api/api';

const Contact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/messages', {
        name,
        email,
        phone,
        subject,
        message
      });

      if (response.data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg(t('alerts.messageFailed') || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrorMsg(error.response?.data?.message || t('alerts.somethingWrong') || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMapPin className="text-wood-600 dark:text-wood-400" size={20} />,
      title: t('labels.showroom') || 'Our Showroom',
      details: t('footer.address') || 'Bole, Around Atlas Hotel, Addis Ababa, Ethiopia'
    },
    {
      icon: <FiPhone className="text-wood-600 dark:text-wood-400" size={20} />,
      title: t('contact.callUs') || 'Call Us',
      details: '+251 911 000 000 / +251 912 000 000'
    },
    {
      icon: <FiMail className="text-wood-600 dark:text-wood-400" size={20} />,
      title: t('contact.emailSupport') || 'Email Support',
      details: 'info@novusfurniture.com'
    },
    {
      icon: <FiClock className="text-wood-600 dark:text-wood-400" size={20} />,
      title: t('footer.showroomTitle') || 'Business Hours',
      details: t('footer.businessHours') || 'Mon - Sat: 8:30 AM - 6:30 PM (Sunday Closed)'
    }
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-[85vh] transition-colors duration-300">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-zinc-900 py-16 sm:py-24 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wood-600 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            {t('labels.getInTouch')}
          </motion.h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-light leading-relaxed">
            {t('contact.headerDesc') || 'Have questions about customized dimensions, designs, or delivery? Reach out to our design consultants today.'}
          </p>
        </div>
      </section>

      {/* Content Form & Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Info Details Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex gap-5 hover:shadow-luxury transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-wood-50 dark:bg-wood-950/20 flex items-center justify-center flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{info.title}</h3>
                  <p className="text-zinc-800 dark:text-white mt-1.5 text-sm sm:text-base font-semibold leading-relaxed">{info.details}</p>
                </div>
              </motion.div>
            ))}

            {/* Micro Showroom Iframe */}
            <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-64 shadow-soft">
              <iframe 
                title="Novus Contact Map"
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

          {/* Contact Input Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-luxury"
            >
              <h2 className="font-display text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
                {t('labels.contactUs')}
              </h2>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl bg-emerald-50 border border-emerald-100 p-8 text-center dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                >
                  <div className="flex justify-center mb-4">
                    <FiCheckCircle size={48} className="text-emerald-500 animate-bounce" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">
                    {t('contact.successTitle') || 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-sm">
                    {t('contact.successDesc') || 'Thank you for reaching out. Our design consultants will contact you within 24 hours.'}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 rounded-full border border-emerald-200 dark:border-emerald-900/30 px-6 py-2 text-sm font-semibold hover:bg-emerald-100/55 transition-colors"
                  >
                    {t('contact.sendAnother') || 'Send Another Message'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">{t('labels.name')}</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Abebe Kebede"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">{t('labels.phone')}</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">{t('labels.email')}</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">{t('labels.subject')}</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Custom Dining Table Inquiry"
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">{t('labels.message')}</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, I am looking to customize a 6-seater dining table..."
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-wood-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-wood-400 dark:focus:bg-zinc-900 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-soft disabled:opacity-50"
                  >
                    <FiSend size={16} />
                    <span>{loading ? t('buttons.submitting') : t('buttons.sendMessage')}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
