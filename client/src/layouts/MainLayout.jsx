import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingControls from '../components/WhatsAppButton';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../context/LanguageContext';
import { FiX, FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { t } = useTranslation();
  
  // Checkout Form States
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    setLoading(true);
    try {
      // Structure checkout payloads
      const orderData = {
        customerDetails: { name, phone, address },
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0] || ''
        })),
        totalPrice: cartTotal
      };

      // Call API
      const response = await api.post('/orders/public', orderData);

      if (response.data.success) {
        setOrderSuccess(true);
        
        // Build Whatsapp summary
        let summaryText = `Hello Novus Furniture, I placed an order!\n\n`;
        summaryText += `*Name:* ${name}\n`;
        summaryText += `*Phone:* ${phone}\n`;
        summaryText += `*Delivery Address:* ${address}\n\n`;
        summaryText += `*Items Ordered:*\n`;
        cartItems.forEach(item => {
          summaryText += `- ${t('products.' + item.product.name) || item.product.name} (x${item.quantity}) - ${(item.product.price * item.quantity).toLocaleString()} ETB\n`;
        });
        summaryText += `\n*Total Amount:* ${cartTotal.toLocaleString()} ETB\n\n`;
        summaryText += `Please contact me to confirm the delivery timeline.`;
        
        const waLink = `https://wa.me/251911000000?text=${encodeURIComponent(summaryText)}`;

        // Clear cart and redirect
        setTimeout(() => {
          clearCart();
          window.open(waLink, '_blank');
          setIsCartOpen(false);
          setShowCheckout(false);
          setOrderSuccess(false);
          setName('');
          setPhone('');
          setAddress('');
        }, 1500);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Order submission failed. Proceeding to direct WhatsApp order.');
      // Direct WhatsApp order fallback
      let summaryText = `Hello, I want to order:\n` + cartItems.map(i => `- ${t('products.' + i.product.name) || i.product.name} (x${i.quantity})`).join('\n') + `\nTotal: ${cartTotal} ETB`;
      window.open(`https://wa.me/251911000000?text=${encodeURIComponent(summaryText)}`, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50">
      
      {/* Sticky Header Navbar */}
      <Navbar onCartToggle={() => setIsCartOpen(true)} />

      {/* Main Pages Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Buttons */}
      <FloatingControls />

      {/* Slide-out Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCartOpen(false); setShowCheckout(false); }}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />

            {/* Slider Sheet */}
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-screen max-w-md bg-white shadow-luxury dark:bg-zinc-900 flex flex-col"
              >
                
                {/* Header */}
                <div className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white">{t('cart.title')}</h2>
                  <button 
                    onClick={() => { setIsCartOpen(false); setShowCheckout(false); }}
                    className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {orderSuccess ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                        <FaWhatsapp size={32} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">{t('cart.submittingOrder')}</h3>
                      <p className="text-sm text-zinc-500 mt-2">{t('cart.openingWhatsApp')}</p>
                    </div>
                  ) : showCheckout ? (
                    // Checkout details form
                    <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                      <h3 className="font-display font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 pb-2 dark:border-zinc-800">
                        {t('cart.deliveryDetails')}
                      </h3>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{t('labels.name')}</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Abebe Kebede"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{t('labels.phone')}</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251 9..."
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{t('labels.address') || "Delivery Address"}</label>
                        <textarea
                          required
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Bole Subcity, Woreda 3, H.No 450, Addis Ababa"
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                        />
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowCheckout(false)}
                          className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                        >
                          {t('buttons.back')}
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                        >
                          <FaWhatsapp size={16} />
                          <span>{loading ? t('buttons.submitting') : t('buttons.orderWhatsApp')}</span>
                        </button>
                      </div>
                    </form>
                  ) : cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <p className="text-zinc-400 dark:text-zinc-500">{t('cart.empty')}</p>
                      <Link
                        to="/products"
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                      >
                        {t('buttons.shopNow')}
                      </Link>
                    </div>
                  ) : (
                    // Cart List
                    <div className="space-y-4">
                      {cartItems.map((item) => {
                        const productImg = item.product.images?.[0]?.startsWith('http') 
                          ? item.product.images[0] 
                          : `http://localhost:5000${item.product.images?.[0]}`;
                        return (
                          <div 
                            key={item.product._id} 
                            className="flex gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800 items-start"
                          >
                            <img
                              src={productImg}
                              alt={item.product.name}
                              className="h-20 w-20 rounded-xl object-cover object-center bg-zinc-50"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-display font-medium text-zinc-950 dark:text-white line-clamp-1">
                                {t('products.' + item.product.name) || item.product.name}
                              </h4>
                              <p className="text-xs text-zinc-400 mt-0.5">{t('categories.' + item.product.category) || item.product.category}</p>
                              
                              {/* Quantity counter */}
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center border border-zinc-200 rounded-full dark:border-zinc-800">
                                  <button
                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                    className="p-1.5 hover:text-wood-600 text-zinc-500"
                                  >
                                    <FiMinus size={12} />
                                  </button>
                                  <span className="text-xs font-semibold px-2 w-6 text-center text-zinc-800 dark:text-white">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                    className="p-1.5 hover:text-wood-600 text-zinc-500"
                                  >
                                    <FiPlus size={12} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.product._id)}
                                  className="text-zinc-400 hover:text-rose-500 p-1"
                                  aria-label="Remove item"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-display font-bold text-sm text-zinc-950 dark:text-white">
                                {(item.product.price * item.quantity).toLocaleString()} <span className="text-[10px] font-normal">ETB</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Subtotal / Actions */}
                {!showCheckout && cartItems.length > 0 && !orderSuccess && (
                  <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between text-zinc-900 dark:text-white">
                      <span className="text-sm font-semibold">{t('cart.subtotal')}</span>
                      <span className="font-display font-bold text-lg">
                        {cartTotal.toLocaleString()} <span className="text-xs font-normal">ETB</span>
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{t('cart.vatInstallation')}</p>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
                    >
                      <span>{t('buttons.checkoutOrder')}</span>
                      <FiArrowRight size={16} />
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
