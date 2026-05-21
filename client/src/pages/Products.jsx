import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiSliders, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSkeleton';
import { mockProducts, mockCategories } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import api from '../api/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  
  // State variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All', ...mockCategories.map(c => c.name)]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters from search params or state
  const searchInput = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const sortFilter = searchParams.get('sort') || '-createdAt';
  const minPriceFilter = searchParams.get('minPrice') || '';
  const maxPriceFilter = searchParams.get('maxPrice') || '';
  const pageFilter = Number(searchParams.get('page')) || 1;

  // Local Form Inputs
  const [searchVal, setSearchVal] = useState(searchInput);
  const [minPrice, setMinPrice] = useState(minPriceFilter);
  const [maxPrice, setMaxPrice] = useState(maxPriceFilter);

  // Synchronize local states when search parameters change
  useEffect(() => {
    setSearchVal(searchInput);
    setMinPrice(minPriceFilter);
    setMaxPrice(maxPriceFilter);
  }, [searchInput, minPriceFilter, maxPriceFilter]);

  // Fetch from Server API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchInput,
        category: categoryFilter,
        sort: sortFilter,
        minPrice: minPriceFilter,
        maxPrice: maxPriceFilter,
        page: pageFilter,
        limit: 8
      };

      const response = await api.get('/products', { params });
      
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
        setTotalCount(response.data.pagination.total);
      }
    } catch (err) {
      console.warn('API error fetching products, running in-memory mock filters:', err);
      // Run mock filtering fallback
      let filtered = [...mockProducts];

      if (searchInput) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchInput.toLowerCase()) || 
          p.description.toLowerCase().includes(searchInput.toLowerCase())
        );
      }

      if (categoryFilter && categoryFilter !== 'All') {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }

      if (minPriceFilter) {
        filtered = filtered.filter(p => p.price >= Number(minPriceFilter));
      }

      if (maxPriceFilter) {
        filtered = filtered.filter(p => p.price <= Number(maxPriceFilter));
      }

      // Sort
      if (sortFilter === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortFilter === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortFilter === 'rating') {
        filtered.sort((a, b) => b.ratings - a.ratings);
      } else {
        // default latest
      }

      const limit = 8;
      const skip = (pageFilter - 1) * limit;
      setProducts(filtered.slice(skip, skip + limit));
      setTotalPages(Math.ceil(filtered.length / limit));
      setTotalCount(filtered.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load categories dynamically
    const fetchCats = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data.success && response.data.categories.length > 0) {
          setCategories(['All', ...response.data.categories.map(c => c.name)]);
        }
      } catch (err) {
        // Fallback already set
      }
    };
    fetchCats();
  }, [searchParams]);

  // Update query parameters
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    
    // Default page reset on filter update
    if (newParams.page === undefined && (newParams.search !== undefined || newParams.category !== undefined || newParams.minPrice !== undefined || newParams.maxPrice !== undefined)) {
      updated.set('page', '1');
    }

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });

    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchVal });
  };

  const clearFilters = () => {
    setSearchVal('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Title Header */}
      <div className="border-b border-zinc-100 pb-8 dark:border-zinc-800">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {t('products.shopTitle') || "Shop Our Collection"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-xl">
          {t('products.shopDesc') || "Browse luxury custom sofas, bed frames, dining sets, kitchen cabinetry, and executive office workstations in Addis Ababa."}
        </p>
      </div>

      {/* Control Bar (Search, Category Tags, Sorting) */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={t('labels.searchPlaceholder') || "Search items..."}
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
          />
        </form>

        {/* Categories tag horizontal strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const transCatLabel = t('categories.' + cat) || cat;
            return (
              <button
                key={cat}
                onClick={() => updateParams({ category: cat })}
                className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
                  categoryFilter === cat
                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-900 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-white'
                }`}
              >
                {transCatLabel}
              </button>
            );
          })}
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:border-zinc-900 md:hidden dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-white"
          >
            <FiSliders size={14} />
            <span>{t('labels.filters') || "Filters"}</span>
          </button>

          <select
            value={sortFilter}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 focus:border-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="-createdAt">{t('sort.newest') || "Newest"}</option>
            <option value="price-asc">{t('sort.priceAsc') || "Price: Low to High"}</option>
            <option value="price-desc">{t('sort.priceDesc') || "Price: High to Low"}</option>
            <option value="rating">{t('sort.topRated') || "Top Rated"}</option>
            <option value="oldest">{t('sort.oldest') || "Oldest"}</option>
          </select>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block bg-white border border-zinc-100 p-6 rounded-2xl shadow-soft dark:bg-zinc-900 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="font-display font-bold text-zinc-900 dark:text-white">{t('labels.refineSearch') || "Refine Search"}</h3>
            <button 
              onClick={clearFilters}
              className="text-xs font-semibold text-zinc-400 hover:text-rose-500"
            >
              {t('buttons.clearAll') || "Clear All"}
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('labels.priceRange') || "Price Range (ETB)"}</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={t('labels.min') || "Min"}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
              <input
                type="number"
                placeholder={t('labels.max') || "Max"}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs focus:border-zinc-900 focus:bg-white outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <button
              onClick={() => updateParams({ minPrice, maxPrice })}
              className="w-full rounded-xl bg-zinc-900 py-2 text-xs font-semibold text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-950 transition-colors"
            >
              {t('buttons.applyFilter') || "Apply Filter"}
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">{t('products.noResults') || "No furniture matches your criteria."}</p>
              <button 
                onClick={clearFilters}
                className="mt-4 rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
              >
                {t('buttons.resetAll') || "Reset Filters"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">
                    {t('labels.showing') || "Showing"}{' '}
                    <span className="font-semibold text-zinc-900 dark:text-white">{products.length}</span>{' '}
                    {t('labels.of') || "of"}{' '}
                    <span className="font-semibold text-zinc-900 dark:text-white">{totalCount}</span>{' '}
                    {t('labels.items') || "items"}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      disabled={pageFilter === 1}
                      onClick={() => updateParams({ page: pageFilter - 1 })}
                      className="p-2 border border-zinc-200 rounded-full text-zinc-650 hover:border-zinc-900 disabled:opacity-40 disabled:pointer-events-none dark:border-zinc-800 dark:text-zinc-400"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateParams({ page: i + 1 })}
                        className={`h-8 w-8 text-xs font-semibold rounded-full flex items-center justify-center border transition-all ${
                          pageFilter === i + 1
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950'
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={pageFilter === totalPages}
                      onClick={() => updateParams({ page: pageFilter + 1 })}
                      className="p-2 border border-zinc-200 rounded-full text-zinc-655 hover:border-zinc-900 disabled:opacity-40 disabled:pointer-events-none dark:border-zinc-800 dark:text-zinc-400"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Mobile filter slider sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-zinc-900 p-6 shadow-luxury flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <h3 className="font-display font-bold text-zinc-900 dark:text-white">{t('labels.filters') || "Filters"}</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <FiX size={20} />
                </button>
              </div>

              {/* Price Range mobile */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('labels.priceRange') || "Price Range (ETB)"}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder={t('labels.min') || "Min"}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder={t('labels.max') || "Max"}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <button
                onClick={() => {
                  updateParams({ minPrice, maxPrice });
                  setShowMobileFilters(false);
                }}
                className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-950"
              >
                {t('buttons.applyFilter') || "Apply Filters"}
              </button>
              <button
                onClick={() => {
                  clearFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full rounded-xl border border-zinc-200 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800"
              >
                {t('buttons.resetAll') || "Reset All"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
