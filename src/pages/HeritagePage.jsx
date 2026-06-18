import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'
import { useApp } from '../context/AppContext'

export default function HeritagePage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSubCategory, setActiveSubCategory] = useState(null)
  const [checkedMaterials, setCheckedMaterials] = useState([])
  const [price, setPrice] = useState(200000)
  const [sortBy, setSortBy] = useState('FEATURED')
  const [hovered, setHovered] = useState(null)
  const [headerRef, headerInView] = useInView()
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, products: productsList } = useApp()

  // Generate dynamic categories from actual products
  const categories = useMemo(() => {
    const categoryMap = {}
    productsList.forEach(p => {
      if (p.category) {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1
      }
    })
    return Object.entries(categoryMap).map(([label, count]) => ({ label, count }))
  }, [productsList])

  // Generate dynamic subcategories based on selected categoryii
  const subCategories = useMemo(() => {
    if (!activeCategory) return []

    const subCategoryMap = {}
    productsList
      .filter(p => {
        if (activeCategory === 'Kolhapuri Footwear') {
          return p.category === 'Kolhapuri Footwear' || p.category === 'Kolhapuri Chappal'
        }
        if (activeCategory === 'Temple Jewellery') {
          return p.category === 'Temple Jewellery' || p.category === 'Jewellery'
        }
        return p.category === activeCategory
      })
      .forEach(p => {
        const subCat = p.subCategory || p.collection || 'Other'
        if (subCat) {
          subCategoryMap[subCat] = (subCategoryMap[subCat] || 0) + 1
        }
      })

    return Object.entries(subCategoryMap).map(([label, count]) => ({ label, count }))
  }, [productsList, activeCategory])

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const subCategoryParam = searchParams.get('subcategory')

    if (categoryParam) {
      setActiveCategory(categoryParam)
    } else {
      setActiveCategory(null)
    }

    if (subCategoryParam) {
      setActiveSubCategory(subCategoryParam)
    } else {
      setActiveSubCategory(null)
    }
  }, [searchParams])

  const sortedAndFilteredProducts = useMemo(() => {
    let items = activeCategory
      ? productsList.filter(p => {
        if (activeCategory === 'Kolhapuri Footwear') {
          return p.category === 'Kolhapuri Footwear' || p.category === 'Kolhapuri Chappal'
        }
        if (activeCategory === 'Temple Jewellery') {
          return p.category === 'Temple Jewellery' || p.category === 'Jewellery'
        }
        return p.category === activeCategory
      })
      : productsList

    // Subcategory Filter
    if (activeSubCategory) {
      items = items.filter(p => {
        const subCat = p.subCategory || p.collection || 'Other'
        return subCat === activeSubCategory
      })
    }

    // Price Filter
    items = items.filter(p => {
      const getProductPrice = (product) => {
        const base = typeof product.price === 'number' ? product.price : (parseFloat(String(product.price).replace(/[^\d.]/g, '')) || 0);
        if (product.discount && Number(product.discount) > 0) {
          return Math.round(base * (1 - Number(product.discount) / 100));
        }
        return base;
      }
      return getProductPrice(p) <= price;
    })

    // Sorting
    return [...items].sort((a, b) => {
      const getProductPrice = (product) => {
        const base = typeof product.price === 'number' ? product.price : (parseFloat(String(product.price).replace(/[^\d.]/g, '')) || 0);
        if (product.discount && Number(product.discount) > 0) {
          return Math.round(base * (1 - Number(product.discount) / 100));
        }
        return base;
      }
      const priceA = getProductPrice(a);
      const priceB = getProductPrice(b);

      if (sortBy === 'PRICE: LOW TO HIGH') {
        return priceA - priceB;
      } else if (sortBy === 'PRICE: HIGH TO LOW') {
        return priceB - priceA;
      } else if (sortBy === 'NEWEST FIRST') {
        return b.id - a.id;
      } else {
        // FEATURED
        return b.id - a.id;
      }
    })
  }, [productsList, activeCategory, activeSubCategory, price, sortBy])

  const toggleMaterial = (m) =>
    setCheckedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  // Function to update URL with filter parameters
  const updateFilters = (category, subCategory) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (subCategory) params.set('subcategory', subCategory)

    const newUrl = params.toString() ? `?${params.toString()}` : '/heritage'
    window.history.pushState({}, '', newUrl)
  }

  // Handle category change
  const handleCategoryChange = (category) => {
    const newCategory = activeCategory === category ? null : category
    setActiveCategory(newCategory)
    setActiveSubCategory(null) // Reset subcategory when category changes
    updateFilters(newCategory, null)
  }

  // Handle subcategory change
  const handleSubCategoryChange = (subCategory) => {
    const newSubCategory = activeSubCategory === subCategory ? null : subCategory
    setActiveSubCategory(newSubCategory)
    updateFilters(activeCategory, newSubCategory)
  }

  return (
    <div className="bg-cream min-h-screen pb-16 md:pb-0 font-times">
      <Navbar />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Mobile Filters */}
        <div className="lg:hidden mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-dark/10">
            {/* Category Filter */}
            <div className="mb-6">
              <p className="text-xs font-medium tracking-widest text-dark/40 mb-3">CATEGORY</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${!activeCategory
                    ? 'bg-gold-500 text-white'
                    : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
                    }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => handleCategoryChange(cat.label)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${activeCategory === cat.label
                      ? 'bg-gold-500 text-white'
                      : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
                      }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory Filter - Mobile */}
            {activeCategory && subCategories.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium tracking-widest text-dark/40 mb-3">SUBCATEGORY</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSubCategoryChange(null)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${!activeSubCategory
                      ? 'bg-gold-500 text-white'
                      : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
                      }`}
                  >
                    All {activeCategory}
                  </button>
                  {subCategories.map((subCat) => (
                    <button
                      key={subCat.label}
                      onClick={() => handleSubCategoryChange(subCat.label)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${activeSubCategory === subCat.label
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-dark/70 hover:bg-gray-200'
                        }`}
                    >
                      {subCat.label} ({subCat.count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range - Mobile */}
            <div>
              <p className="text-xs font-medium tracking-widest text-dark/40 mb-3">PRICE RANGE</p>
              <input
                type="range"
                min={2500}
                max={200000}
                step={500}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-dark/50 mt-2">
                <span>₹2,500</span>
                <span>₹{price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">

          {/* ─── Sidebar ─── */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            {/* Category filter */}
            <div className="mb-8">
              <p className="text-xs font-medium tracking-widest text-dark/40 mb-4">CATEGORY</p>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.label}
                    whileHover={{ x: 4 }}
                    onClick={() => handleCategoryChange(cat.label)}
                    className={`w-full text-left flex items-center justify-between text-sm py-1.5 transition-colors ${activeCategory === cat.label ? 'text-gold-600 font-medium' : 'text-dark/70 hover:text-dark'
                      }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-dark/30">{cat.count}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Subcategory filter - Only show when a category is selected */}
            {activeCategory && subCategories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium tracking-widest text-dark/40">SUBCATEGORY</p>
                  {activeSubCategory && (
                    <button
                      onClick={() => handleSubCategoryChange(null)}
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {subCategories.map((subCat) => (
                    <motion.button
                      key={subCat.label}
                      whileHover={{ x: 4 }}
                      onClick={() => handleSubCategoryChange(subCat.label)}
                      className={`w-full text-left flex items-center justify-between text-sm py-1.5 transition-colors ${activeSubCategory === subCat.label ? 'text-gold-600 font-medium' : 'text-dark/70 hover:text-dark'
                        }`}
                    >
                      <span>{subCat.label}</span>
                      <span className="text-xs text-dark/30">{subCat.count}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Material filter - Hidden since no material data available */}
            {/* 
            <div className="mb-8">
              <p className="text-xs font-medium tracking-widest text-dark/40 mb-4">MATERIAL</p>
              <div className="space-y-3">
                {materials.map((mat) => (
                  <label key={mat} className="flex items-center gap-3 text-sm text-dark/70 cursor-pointer group">
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleMaterial(mat)}
                      className={`w-4 h-4 border transition-all duration-200 flex items-center justify-center ${
                        checkedMaterials.includes(mat)
                          ? 'bg-dark border-dark'
                          : 'border-dark/30 group-hover:border-dark'
                      }`}
                    >
                      {checkedMaterials.includes(mat) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </motion.div>
                    {mat}
                  </label>
                ))}
              </div>
            </div>
                  {/* Price range */}
            <div>
              <p className="text-xs font-medium tracking-widest text-dark/40 mb-4">PRICE RANGE</p>
              <input
                type="range"
                min={2500}
                max={200000}
                step={500}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-dark/50 mt-2">
                <span>₹2,500</span>
                <span>₹{price.toLocaleString()}</span>
              </div>
            </div>
          </motion.aside>

          {/* ─── Product Grid ─── */}
          <div>
            {/* Active Filters Breadcrumb */}
            {(activeCategory || activeSubCategory) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-dark/40">Filters:</span>
                  {activeCategory && (
                    <div className="flex items-center gap-2">
                      <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                        {activeCategory}
                        <button
                          onClick={() => handleCategoryChange(null)}
                          className="hover:text-gold-900 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                      {activeSubCategory && <span className="text-dark/30">→</span>}
                    </div>
                  )}
                  {activeSubCategory && (
                    <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                      {activeSubCategory}
                      <button
                        onClick={() => handleSubCategoryChange(null)}
                        className="hover:text-gold-900 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-dark/50"
              >
                SHOWING {sortedAndFilteredProducts.length} PRODUCT{sortedAndFilteredProducts.length !== 1 ? 'S' : ''}
                {activeCategory && (
                  <span className="text-gold-600 font-medium">
                    {' '}in {activeCategory}
                    {activeSubCategory && ` → ${activeSubCategory}`}
                  </span>
                )}
              </motion.p>
              <div className="flex items-center gap-2 text-sm text-dark/50">
                <span>SORT BY:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-b border-dark/20 outline-none text-dark py-1 cursor-pointer"
                >
                  <option value="FEATURED">FEATURED</option>
                  <option value="PRICE: LOW TO HIGH">PRICE: LOW TO HIGH</option>
                  <option value="PRICE: HIGH TO LOW">PRICE: HIGH TO LOW</option>
                  <option value="NEWEST FIRST">NEWEST FIRST</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedAndFilteredProducts.map((p, i) => {
                  const isWishlisted = wishlist.some(item => item.id === p.id)

                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      onHoverStart={() => setHovered(p.id)}
                      onHoverEnd={() => setHovered(null)}
                      className="group cursor-pointer"
                    >
                      <Link to={`/product?id=${p.id}`}>
                        <div className="relative overflow-hidden mb-3 bg-transparent flex items-center justify-center aspect-square w-full">
                          {/* Wishlist Heart Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (isWishlisted) {
                                removeFromWishlist(p.id)
                              } else {
                                addToWishlist(p)
                              }
                            }}
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            {isWishlisted ? (
                              <svg className="w-4 h-4 text-red-500 fill-red-500" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-dark/50 hover:text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                              </svg>
                            )}
                          </button>

                          <img
                            src={p.images?.[0] || p.image || p.img}
                            alt={p.name}
                            className="w-full h-full object-contain mix-blend-multiply p-2"
                          />
                          {Number(p.stock || 0) <= 0 ? (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-3 left-3 bg-stone-500 text-white text-xs px-2 py-1 tracking-widest font-sans uppercase"
                            >
                              SOLD OUT
                            </motion.div>
                          ) : p.badge ? (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-3 left-3 bg-dark text-white text-xs px-2 py-1 tracking-widest font-sans"
                            >
                              {p.badge}
                            </motion.div>
                          ) : null}
                          <AnimatePresence>
                            {hovered === p.id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-dark/10 flex items-end justify-center pb-4"
                              >
                                <motion.button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (Number(p.stock || 0) > 0) {
                                      addToCart(p, 8)
                                    }
                                  }}
                                  disabled={Number(p.stock || 0) <= 0}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: 20, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className={`text-xs tracking-widest px-6 py-2.5 transition-colors shadow-sm font-bold ${Number(p.stock || 0) > 0
                                    ? 'bg-dark text-white hover:bg-gold-600'
                                    : 'bg-stone-300 text-stone-500 cursor-not-allowed border-stone-200'
                                    }`}
                                >
                                  {Number(p.stock || 0) > 0 ? 'ADD TO CART' : 'SOLD OUT'}
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <h3 className="font-serif text-base font-semibold mb-1 group-hover:text-gold-600 transition-colors duration-300">{p.name}</h3>
                        <p className="text-xs text-dark/50 mb-2">{p.sub || p.subCategory || p.collection || ''}</p>
                        <div className="flex items-center gap-2">
                          {p.discount && Number(p.discount) > 0 ? (
                            <>
                              <span className="text-dark/40 line-through text-xs">
                                ₹{p.price.toLocaleString()}
                              </span>
                              <span className="text-gold-700 font-medium text-sm">
                                ₹{Math.round(p.price * (1 - Number(p.discount) / 100)).toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-gold-700 font-medium text-sm">
                              {typeof p.price === 'number' ? `₹${p.price.toLocaleString()}` : p.price}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mt-16"
            >
              {['←', '01', '02', '03', '...', '98', '→'].map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 text-xs flex items-center justify-center border transition-all ${item === '01'
                    ? 'bg-dark text-white border-dark'
                    : 'border-dark/15 text-dark/60 hover:border-dark hover:text-dark'
                    }`}
                >
                  {item}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
