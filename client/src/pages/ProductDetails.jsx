import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTruck, FiShield, FiRotateCcw, FiPlus, FiMinus, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp, FaStar, FaTelegramPlane, FaFacebookMessenger } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getWhatsAppLink } from '../utils/whatsapp';
import { useTranslation } from '../context/LanguageContext';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Zoom Effect States
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  // Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
        setReviews(response.data.reviews || []);
        setActiveImage(response.data.product.images?.[0] || '');
        
        // Fetch related products under the same category
        const relRes = await api.get(`/products?category=${encodeURIComponent(response.data.product.category)}&limit=4`);
        if (relRes.data.success) {
          setRelatedProducts(relRes.data.products.filter(p => p._id !== id));
        }
      }
    } catch (err) {
      console.warn('API error fetching product details, loading from mockData:', err);
      // Fallback to mockData
      const foundProduct = mockProducts.find(p => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.images?.[0] || '');
        setReviews([
          { _id: 'r1', name: 'Almaz K.', rating: 5, comment: 'Exceptional details and wood finishing. Exceeded our expectations!', createdAt: new Date() }
        ]);
        
        // Mock related products
        setRelatedProducts(mockProducts.filter(p => p.category === foundProduct.category && p._id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // Scroll back to top on product switch
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    setSubmittingReview(true);
    try {
      const response = await api.post(`/products/${id}/reviews`, {
        name: reviewerName,
        rating: reviewRating,
        comment: reviewComment
      });

      if (response.data.success) {
        setReviews([response.data.review, ...reviews]);
        if (product) {
          setProduct({ ...product, ratings: response.data.productRatings });
        }
        setReviewerName('');
        setReviewComment('');
        setReviewRating(5);
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Review submit error:', error);
      // Fallback local insert
      const newReview = {
        _id: `mock-r-${Date.now()}`,
        name: reviewerName,
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date()
      };
      setReviews([newReview, ...reviews]);
      setReviewerName('');
      setReviewComment('');
      setReviewRating(5);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage.startsWith('http') ? activeImage : `http://localhost:5000${activeImage}`})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block underline font-semibold">Back to Catalog</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const activeImgUrl = activeImage.startsWith('http') 
    ? activeImage 
    : `http://localhost:5000${activeImage}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-20">
      
      {/* Upper Grid (Images + Config details) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Image Showcase */}
        <div className="space-y-4">
          
          {/* Main Zoomable Image Display */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 cursor-crosshair">
            <img
              src={activeImgUrl}
              alt={product.name}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Magnifying Glass Window */}
            <div 
              style={zoomStyle} 
              className="absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-150"
            />
          </div>

          {/* Thumbnails list */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => {
                const imgUrl = img.startsWith('http') ? img : `http://localhost:5000${img}`;
                return (
                  <button
                    key={img}
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-20 rounded-xl overflow-hidden bg-zinc-50 border-2 transition-all flex-shrink-0 ${
                      activeImage === img ? 'border-zinc-900 dark:border-white' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt="Product Thumbnail" 
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Technical Specs / Ordering details */}
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-wood-500">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.floor(product.ratings || 5) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs font-semibold text-zinc-500">({reviews.length} {t('labels.reviews')})</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-display font-extrabold text-zinc-900 dark:text-white">
            {product.price?.toLocaleString()} <span className="text-lg font-normal text-zinc-500">ETB</span>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Technical Specs List */}
          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span className="font-semibold">{t('labels.dimensions')}:</span>
              <span>{product.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('labels.materials')}:</span>
              <span>{product.materials}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('labels.stockStatus')}:</span>
              <span className={product.stock > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'}>
                {product.stock > 0 ? `${product.stock} ${t('labels.inStock')}` : t('labels.outOfStock')}
              </span>
            </div>
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('labels.quantity')}</span>
            <div className="flex items-center border border-zinc-200 rounded-full dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-zinc-500 hover:text-zinc-800"
              >
                <FiMinus size={14} />
              </button>
              <span className="px-4 font-semibold text-sm w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-zinc-500 hover:text-zinc-800"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Add to Shopping Cart */}
              <button
                onClick={() => { addToCart(product, quantity); alert('Added to cart!'); }}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
              >
                <FiShoppingBag size={18} />
                <span>{t('buttons.addToCart')}</span>
              </button>

              {/* WhatsApp Direct Order */}
              <a
                href={getWhatsAppLink(product.name, product.price * quantity, product._id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors shadow-soft"
              >
                <FaWhatsapp size={18} />
                <span>{t('buttons.orderWhatsApp')}</span>
              </a>
            </div>

            {/* Secondary Contact Channels */}
            <div className="grid grid-cols-3 gap-3">
              {/* Telegram */}
              <a
                href={`https://t.me/novusfurniture`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-sky-50 hover:text-sky-600 dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-sky-950/20 dark:hover:text-sky-400 transition-colors"
              >
                <FaTelegramPlane size={16} />
                <span>Telegram</span>
              </a>

              {/* Facebook Messenger */}
              <a
                href={`https://m.me/novusfurniture`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 transition-colors"
              >
                <FaFacebookMessenger size={16} />
                <span>Messenger</span>
              </a>

              {/* SMS Option */}
              <a
                href={`sms:+251911000000?body=${encodeURIComponent(`Hello, I want to order "${product.name}" (Quantity: ${quantity}) for ${(product.price * quantity).toLocaleString()} ETB. Please contact me.`)}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-amber-50 hover:text-amber-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-amber-950/20 dark:hover:text-amber-400 transition-colors"
              >
                <FiMessageSquare size={16} />
                <span>SMS Order</span>
              </a>
            </div>
          </div>

          {/* Wishlist toggle */}
          <button
            onClick={() => isFavorited ? removeFromWishlist(product._id) : addToWishlist(product)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors"
          >
            <FiHeart size={16} className={isFavorited ? 'text-rose-500 fill-rose-500' : ''} />
            <span>{isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
          </button>

          {/* Value Badges */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-4 text-center text-[10px] text-zinc-400">
            <div className="flex flex-col items-center gap-1.5">
              <FiTruck size={18} className="text-zinc-500" />
              <span>Addis Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <FiShield size={18} className="text-zinc-500" />
              <span>5-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <FiRotateCcw size={18} className="text-zinc-500" />
              <span>Custom Adjustments</span>
            </div>
          </div>

        </div>

      </div>

      {/* Reviews section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-zinc-100 pt-16 dark:border-zinc-800">
        
        {/* Left: Review form */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">{t('labels.leaveReview')}</h3>
          
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{t('labels.name')}</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Tsion Girma"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Good)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="2">2 Stars (Fair)</option>
                <option value="1">1 Star (Poor)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{t('labels.message')}</label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full rounded-xl bg-zinc-900 py-3 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-250 transition-colors"
            >
              {submittingReview ? t('buttons.submitting') : t('labels.submitReview')}
            </button>
          </form>
        </div>

        {/* Right: Review List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">{t('labels.feedback')}</h3>
          
          {reviews.length === 0 ? (
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-zinc-100 pb-4 dark:border-zinc-800 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-white">{rev.name}</span>
                    <span className="text-[10px] text-zinc-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-100 pt-16 dark:border-zinc-800 space-y-8">
          <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{t('labels.related')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
