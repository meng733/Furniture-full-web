import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('10');
  const [dimensions, setDimensions] = useState('');
  const [materials, setMaterials] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageUrlStr, setImageUrlStr] = useState(''); // comma-separated image URLs

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?limit=100');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    setCategory(categories[0]?.name || '');
    setStock('10');
    setDimensions('');
    setMaterials('');
    setFeatured(false);
    setImageUrlStr('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setCategory(product.category || categories[0]?.name || '');
    setStock((product.stock || 0).toString());
    setDimensions(product.dimensions || '');
    setMaterials(product.materials || '');
    setFeatured(product.featured || false);
    setImageUrlStr(product.images ? product.images.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert('Please fill in required fields.');
      return;
    }

    const imageArray = imageUrlStr
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const productPayload = {
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      dimensions,
      materials,
      featured,
      images: imageArray.length > 0 ? imageArray : ['/uploads/default-furniture.jpg']
    };

    try {
      if (editingProduct) {
        // Edit Mode
        const response = await api.put(`/products/${editingProduct._id}`, productPayload);
        if (response.data.success) {
          setProducts(products.map(p => p._id === editingProduct._id ? response.data.product : p));
          setIsModalOpen(false);
        }
      } else {
        // Add Mode
        const response = await api.post('/products', productPayload);
        if (response.data.success) {
          setProducts([response.data.product, ...products]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Operation failed. Please try again.');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">Products Catalog</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage showroom items, pricing, stock, and descriptions.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-soft"
        >
          <FiPlus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-soft">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-700 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 transition-all cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Catalog View */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-soft">
          <p className="text-zinc-400 dark:text-zinc-500">No products found matching the search/filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Product</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Category</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Price</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Stock</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-center">Featured</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {filteredProducts.map((p) => {
                  const productImg = p.images?.[0]?.startsWith('http') 
                    ? p.images[0] 
                    : `http://localhost:5000${p.images?.[0]}`;
                  return (
                    <tr key={p._id} className="text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={productImg}
                          alt={p.name}
                          className="h-12 w-12 rounded-xl object-cover bg-zinc-50"
                        />
                        <div>
                          <p className="font-semibold text-zinc-850 dark:text-white leading-tight">{p.name}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">{p.dimensions || 'No Dimensions'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400 font-medium">
                        {p.category}
                      </td>
                      <td className="p-4 font-bold text-zinc-950 dark:text-white">
                        {p.price?.toLocaleString()} ETB
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock <= 2 ? 'text-rose-500' : 'text-zinc-600 dark:text-zinc-300'}`}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {p.featured ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/20">
                            Featured
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 rounded-lg border border-zinc-200 text-rose-600 hover:bg-rose-50 dark:border-zinc-800 dark:text-rose-450 dark:hover:bg-rose-950/20 transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />

            {/* Modal Sheet */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-luxury z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Leather L-Shape Sofa"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-700 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Price (ETB) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="45000"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Dimensions & Materials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Dimensions</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="210 x 95 x 85 cm"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Materials</label>
                    <input
                      type="text"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="Mahogany wood, Italian top grain leather"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of the furniture piece's style, build quality, comfort..."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all resize-none"
                  />
                </div>

                {/* Image URLs */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Image URLs (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={imageUrlStr}
                    onChange={(e) => setImageUrlStr(e.target.value)}
                    placeholder="https://example.com/sofa1.jpg, https://example.com/sofa2.jpg"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white transition-all"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">If blank, a default placeholder furniture cover will be applied.</p>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-5 w-5 rounded-md border-zinc-200 text-zinc-950 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                    Feature on Home page
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3 justify-end border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
