import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'
import { useApp } from '../context/AppContext'

const mainImg = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
const thumbs = [
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=80',
]

const reviews = [
  {
    name: 'Aditi R.',
    tag: 'VERIFIED COLLECTOR',
    date: 'Sept 2023',
    quote: '"A masterpiece for the feet."',
    text: 'The level of detail in the gold threads is staggering. These aren\'t just shoes; they are wearable art. Surprisingly comfortable for all-day wear at a wedding.',
  },
  {
    name: 'Vikram S.',
    tag: 'VERIFIED COLLECTOR',
    date: 'Aug 2023',
    quote: '"Exceeded all expectations."',
    text: 'I\'ve bought many luxury brands, but the artisanal soul of Samartha is unmatched. The delivery experience was also incredibly premium.',
  },
]

const defaultSizes = [6, 7, 8, 9, 10]

export default function ProductPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('id')
  const referralCode = searchParams.get('ref') // Get reseller referral code
  const [activeThumb, setActiveThumb] = useState(0)
  const [selectedSize, setSelectedSize] = useState(8)
  const [expandedSection, setExpandedSection] = useState('craftsmanship')
  const [addedToCart, setAddedToCart] = useState(false)
  const [reviewsRef, reviewsInView] = useInView()
  const [heroRef, heroInView] = useInView()
  
  // Image zoom state
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showFullscreenZoom, setShowFullscreenZoom] = useState(false)
  
  // Color variants state
  const [selectedColorVariant, setSelectedColorVariant] = useState(0)
  const [fullscreenZoomLevel, setFullscreenZoomLevel] = useState(1)
  const imageRef = useRef(null)
  
  // Touch/Swipe/Scroll refs for mobile
  const mobileScrollRef = useRef(null)
  const isProgrammaticScroll = useRef(false)
  
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, resellers, products, addReview } = useApp()

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewLocation, setReviewLocation] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Ring size chart state
  const [showRingSizeChart, setShowRingSizeChart] = useState(false)
  const [selectedRingSize, setSelectedRingSize] = useState(16) // Default Indian ring size

  // Ring size chart data (Indian sizes with international conversions)
  const ringSizeChart = [
    { indian: 8, us: 4, uk: 'H', diameter: '14.9mm', circumference: '46.8mm' },
    { indian: 9, us: 4.5, uk: 'I', diameter: '15.3mm', circumference: '48.0mm' },
    { indian: 10, us: 5, uk: 'J', diameter: '15.7mm', circumference: '49.3mm' },
    { indian: 11, us: 5.5, uk: 'K', diameter: '16.1mm', circumference: '50.6mm' },
    { indian: 12, us: 6, uk: 'L', diameter: '16.5mm', circumference: '51.9mm' },
    { indian: 13, us: 6.5, uk: 'M', diameter: '16.9mm', circumference: '53.1mm' },
    { indian: 14, us: 7, uk: 'N', diameter: '17.3mm', circumference: '54.4mm' },
    { indian: 15, us: 7.5, uk: 'O', diameter: '17.7mm', circumference: '55.7mm' },
    { indian: 16, us: 8, uk: 'P', diameter: '18.1mm', circumference: '57.0mm' },
    { indian: 17, us: 8.5, uk: 'Q', diameter: '18.5mm', circumference: '58.3mm' },
    { indian: 18, us: 9, uk: 'R', diameter: '18.9mm', circumference: '59.5mm' },
    { indian: 19, us: 9.5, uk: 'S', diameter: '19.4mm', circumference: '60.8mm' },
    { indian: 20, us: 10, uk: 'T', diameter: '19.8mm', circumference: '62.1mm' },
    { indian: 21, us: 10.5, uk: 'U', diameter: '20.2mm', circumference: '63.4mm' },
    { indian: 22, us: 11, uk: 'V', diameter: '20.6mm', circumference: '64.6mm' },
    { indian: 23, us: 11.5, uk: 'W', diameter: '21.0mm', circumference: '65.9mm' },
    { indian: 24, us: 12, uk: 'X', diameter: '21.4mm', circumference: '67.2mm' },
    { indian: 25, us: 12.5, uk: 'Y', diameter: '21.8mm', circumference: '68.5mm' },
    { indian: 26, us: 13, uk: 'Z', diameter: '22.2mm', circumference: '69.7mm' }
  ]

  // Kolhapuri Chappal size chart state
  const [showChappalSizeChart, setShowChappalSizeChart] = useState(false)

  // Kolhapuri Chappal size chart data
  const chappalSizeChart = [
    { our: 5, indiaUk: 5, us: 6, footLength: '24.7', euro: 39 },
    { our: 6, indiaUk: 6, us: 7, footLength: '25.3', euro: 40 },
    { our: 7, indiaUk: 7, us: 8, footLength: '26.0', euro: 41 },
    { our: 8, indiaUk: 8, us: 9, footLength: '26.7', euro: 42 },
    { our: 9, indiaUk: 9, us: 10, footLength: '27.3', euro: 43 },
    { our: 10, indiaUk: 10, us: 11, footLength: '28.0', euro: 44 },
    { our: 11, indiaUk: 11, us: 12, footLength: '28.7', euro: 45 }
  ]

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewText.trim()) {
      alert('Please fill out all required fields.')
      return
    }

    setReviewSubmitting(true)
    const newReview = {
      id: `rev-${Date.now()}`,
      rating: Number(reviewRating),
      review: reviewText.trim(),
      customerName: reviewName.trim(),
      location: reviewLocation.trim() || 'India',
      avatar: `https://images.unsplash.com/photo-${['1544005313-94ddf0286df2', '1506794778202-cad84cf45f1d', '1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330'][Math.floor(Math.random() * 5)]}?w=120&auto=format&fit=crop&q=80`,
      verified: true,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const success = await addReview(newReview)
    if (success) {
      setReviewSubmitted(true)
      setTimeout(() => {
        setShowReviewModal(false)
        setReviewSubmitted(false)
        setReviewName('')
        setReviewLocation('')
        setReviewText('')
        setReviewRating(5)
      }, 2000)
    } else {
      alert('Failed to submit review. Please try again.')
    }
    setReviewSubmitting(false)
  }

  // Use products from AppContext (Firestore) with proper fallback
  const productsList = products || []

  // Debug logging
  console.log('ProductPage Debug:', {
    productId,
    productIdType: typeof productId,
    productsLength: productsList.length,
    availableProductIds: productsList.map(p => ({ id: p.id, idType: typeof p.id, name: p.name })),
    products: productsList.map(p => ({ 
      id: p.id, 
      name: p.name, 
      hasImages: !!p.images, 
      imageCount: p.images?.length || 0,
      hasColorVariants: !!p.colorVariants,
      colorVariantCount: p.colorVariants?.length || 0
    }))
  })

  // Lookup matching product or fall back to default
  const matchedProduct = productsList.find(p => p.id.toString() === productId) || {
    id: 1,
    name: 'The Royal Gold Kolhapuri',
    price: 18500,
    discount: 10,
    category: 'Kolhapuri Chappal',
    badge: 'LIMITED EDITION',
    description: 'Imperial hand-braided tan sandals with royal gold-thread embroidery and natural vegetable-tanned buffalo leather cushioning.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80']
  }

  // Debug logging for matched product
  console.log('Matched Product Debug:', {
    productId,
    found: !!productsList.find(p => p.id.toString() === productId),
    matchedProduct: {
      id: matchedProduct.id,
      name: matchedProduct.name,
      images: matchedProduct.images,
      colorVariants: matchedProduct.colorVariants
    }
  })

  // FIX: Standardized image priority — images[0] is always the primary source
  // Color variant images take over only when a specific variant is selected
  const productImages = matchedProduct.colorVariants && matchedProduct.colorVariants.length > 0
    ? (matchedProduct.colorVariants[selectedColorVariant]?.images?.length > 0
        ? matchedProduct.colorVariants[selectedColorVariant].images
        : matchedProduct.images?.length > 0
          ? matchedProduct.images
          : [matchedProduct.image || matchedProduct.img || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'])
    : matchedProduct.images && matchedProduct.images.length > 0
    ? matchedProduct.images
    : [matchedProduct.image || matchedProduct.img || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80']

  // Debug product images
  console.log('Product Images Debug:', {
    hasColorVariants: !!(matchedProduct.colorVariants && matchedProduct.colorVariants.length > 0),
    selectedColorVariant,
    colorVariantImages: matchedProduct.colorVariants?.[selectedColorVariant]?.images,
    mainImages: matchedProduct.images,
    singleImage: matchedProduct.image || matchedProduct.img,
    finalProductImages: productImages
  })

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current || isProgrammaticScroll.current) return
    const container = mobileScrollRef.current
    const index = Math.round(container.scrollLeft / container.clientWidth)
    if (index !== activeThumb && index >= 0 && index < productImages.length) {
      setActiveThumb(index)
    }
  }

  const handleActiveImageChange = (index) => {
    setActiveThumb(index)
    if (mobileScrollRef.current) {
      const container = mobileScrollRef.current
      isProgrammaticScroll.current = true
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: 'smooth'
      })
      setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 500)
    }
  }

  // Find reseller if referral code exists
  const referringReseller = referralCode 
    ? resellers.find(r => {
        const cleanRef = referralCode.trim()
        return (r.id && r.id.toString().trim() === cleanRef) ||
               (r.docId && r.docId.toString().trim() === cleanRef)
      }) 
    : null

  // Calculate commission-added price if referred by reseller
  const basePrice = typeof matchedProduct.price === 'number' 
    ? matchedProduct.price 
    : parseFloat(String(matchedProduct.price || '0').replace(/[^\d.]/g, '')) || 0
  const commissionRate = referringReseller ? parseFloat(referringReseller.commissionValue || 10) : 0
  const commissionAmount = Math.round((basePrice * commissionRate) / 100)
  // Calculate discounted price
  const discountedPrice = Number(matchedProduct.discount) > 0 
    ? Math.round(basePrice * (1 - Number(matchedProduct.discount) / 100))
    : basePrice
  
  const finalPrice = referringReseller ? discountedPrice + commissionAmount : discountedPrice

  const isSelectedSizeInStock = (() => {
    if (matchedProduct.category === 'Kolhapuri Chappal') {
      const sizesObj = matchedProduct.sizes || {}
      const sizeStock = sizesObj[selectedSize]
      return sizeStock !== undefined ? Number(sizeStock) > 0 : false
    } else {
      // Jewellery or other
      return Number(matchedProduct.stock || 0) > 0
    }
  })()

  const currentProduct = {
    id: matchedProduct.id,
    name: matchedProduct.name,
    price: finalPrice, // Store as number for cart calculations
    basePrice: basePrice, // Store original price
    discountedPrice: discountedPrice, // Store discounted price
    commissionAmount: commissionAmount, // Store commission
    img: productImages[activeThumb] || productImages[0],
    image: productImages[0], // First image for fallback
    images: matchedProduct.images || productImages, // Complete images array
    colorVariants: matchedProduct.colorVariants || [], // Color variants with images
    category: matchedProduct.category
  }

  const isWishlisted = wishlist.some(item => item.id === currentProduct.id)

  const handleAddToCart = () => {
    // Add reseller info to cart item if referred
    const cartItem = referringReseller 
      ? { 
          ...currentProduct, 
          referralCode, 
          resellerId: referringReseller.id, 
          resellerName: referringReseller.name,
          commissionRate: commissionRate
        }
      : currentProduct
    
    // Add size information based on product category
    const sizeInfo = matchedProduct.category === 'Kolhapuri Chappal' 
      ? selectedSize 
      : (matchedProduct.category === 'Jewellery' && matchedProduct.name.toLowerCase().includes('ring'))
        ? selectedRingSize
        : null
    
    // Add color variant information
    const selectedColor = matchedProduct.colorVariants && matchedProduct.colorVariants.length > 0
      ? matchedProduct.colorVariants[selectedColorVariant]
      : null
    
    const cartItemWithDetails = {
      ...cartItem,
      selectedColor: selectedColor ? {
        colorName: selectedColor.colorName,
        colorCode: selectedColor.colorCode
      } : null
    }
    
    addToCart(cartItemWithDetails, sizeInfo)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Image zoom handlers
  const handleMouseMove = (e) => {
    if (!imageRef.current) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsZooming(true)
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  const handleZoomIn = () => {
    setFullscreenZoomLevel(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setFullscreenZoomLevel(prev => Math.max(prev - 0.5, 1))
  }

  const handleResetZoom = () => {
    setFullscreenZoomLevel(1)
  }

  const handleCloseFullscreen = () => {
    setShowFullscreenZoom(false)
    setFullscreenZoomLevel(1)
  }

  return (
    <div className="bg-cream min-h-screen pb-16 md:pb-0 font-times">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-6 pb-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-dark/40 tracking-widest mb-10"
        >
          {['HOME', matchedProduct.category === 'Kolhapuri Chappal' ? 'FOOTWEAR' : 'JEWELLERY', matchedProduct.name.toUpperCase()].map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              <Link to={i === 0 ? '/' : '/heritage'} className="hover:text-dark transition-colors">{c}</Link>
            </span>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ─── Left: Images (Amazon/Flipkart Mobile Slider & Desktop View) ─── */}
          <div className="flex flex-col w-full">
            {/* Mobile Touch-Swipe Image Slider (Amazon/Flipkart Style) */}
            <div className="block lg:hidden w-full relative mb-4">
              {/* Controls Row (Wishlist & Zoom) Above Image Slider */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-dark/40 tracking-widest font-semibold uppercase">PREVIEW</span>
                <div className="flex gap-2">
                  {/* Wishlist Icon */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isWishlisted) {
                        removeFromWishlist(currentProduct.id)
                      } else {
                        addToWishlist(currentProduct)
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white border border-dark/15 rounded-full flex items-center justify-center shadow-md hover:border-dark/30 transition-all duration-300 text-dark"
                    title="Add to wishlist"
                  >
                    <AnimatePresence mode="wait">
                      {isWishlisted ? (
                        <motion.svg
                          key="filled"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-5 h-5 text-red-500 fill-red-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          key="outline"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Zoom Icon Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFullscreenZoom(true)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white border border-dark/15 rounded-full flex items-center justify-center shadow-md hover:border-dark/30 transition-all duration-300 text-dark"
                    title="Click to zoom"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="relative w-full overflow-hidden bg-stone-100 border border-dark/5 rounded-lg">
                {/* Horizontal Scroll Snap Container */}
                <div
                  ref={mobileScrollRef}
                  onScroll={handleMobileScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-[350px] sm:h-[450px] scroll-smooth"
                >
                  {productImages.map((img, i) => (
                    <div key={i} className="w-full h-full flex-shrink-0 snap-center snap-always relative">
                      <img
                        src={img}
                        alt={`${matchedProduct.name} - View ${i + 1}`}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => setShowFullscreenZoom(true)}
                      />
                    </div>
                  ))}
                </div>


              </div>

              {/* Dot Indicators (Amazon/Flipkart Premium Style) */}
              <div className="flex justify-center items-center gap-2 mt-3">
                {productImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleActiveImageChange(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeThumb === i 
                        ? 'w-6 bg-gold-600' 
                        : 'w-1.5 bg-dark/20 hover:bg-dark/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Stock Badge - Moved below image gallery & dot indicators */}
              {isSelectedSizeInStock ? (
                <div className="mt-3 bg-emerald-50/60 border border-emerald-100 px-4 py-2.5 rounded text-xs text-emerald-800 font-medium flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{matchedProduct.name} · {matchedProduct.category === 'Kolhapuri Chappal' ? `Size ${selectedSize}` : 'Free Size'} · {matchedProduct.colorVariants && matchedProduct.colorVariants[selectedColorVariant] ? matchedProduct.colorVariants[selectedColorVariant].colorName : ''} · ✓ In Stock</span>
                </div>
              ) : (
                <div className="mt-3 bg-red-50/60 border border-red-100 px-4 py-2.5 rounded text-xs text-red-800 font-medium flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>{matchedProduct.name} · {matchedProduct.category === 'Kolhapuri Chappal' ? `Size ${selectedSize}` : 'Free Size'} · {matchedProduct.colorVariants && matchedProduct.colorVariants[selectedColorVariant] ? matchedProduct.colorVariants[selectedColorVariant].colorName : ''} · Out of Stock</span>
                </div>
              )}
            </div>

            {/* Desktop Side-by-Side Image Gallery with Hover Zoom */}
            <div className="hidden lg:flex flex-row gap-4 w-full">
              {/* Main Image */}
              <div className="order-1 lg:order-2 flex-1 flex flex-col gap-3">
                {/* Premium Controls Row (Wishlist & Zoom) Above Main Image Container */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-dark/40 tracking-widest font-semibold uppercase">PREVIEW</span>
                  <div className="flex gap-2">
                    {/* Wishlist Icon */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isWishlisted) {
                          removeFromWishlist(currentProduct.id)
                        } else {
                          addToWishlist(currentProduct)
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white border border-dark/15 rounded-full flex items-center justify-center shadow-md hover:border-dark/30 transition-all duration-300 text-dark"
                      title="Add to wishlist"
                    >
                      <AnimatePresence mode="wait">
                        {isWishlisted ? (
                          <motion.svg
                            key="filled"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-5 h-5 text-red-500 fill-red-500"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </motion.svg>
                        ) : (
                          <motion.svg
                            key="outline"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Zoom Icon Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowFullscreenZoom(true)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white border border-dark/15 rounded-full flex items-center justify-center shadow-md hover:border-dark/30 transition-all duration-300 text-dark"
                      title="Click to zoom"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden bg-stone-100 border border-dark/5 rounded-lg group cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setShowFullscreenZoom(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeThumb}
                      ref={imageRef}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full h-[550px]"
                    >
                      <img
                        src={productImages[activeThumb] || productImages[0]}
                        alt={matchedProduct.name}
                        className="w-full h-full object-cover"
                        style={{
                          transform: isZooming ? 'scale(2)' : 'scale(1)',
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transition: isZooming ? 'none' : 'transform 0.3s ease-out'
                        }}
                      />
                      
                      {/* Zoom Indicator */}
                      {!isZooming && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                          <span>Hover to zoom</span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Stock Badge - Moved below image container */}
                {isSelectedSizeInStock ? (
                  <div className="bg-emerald-50/60 border border-emerald-100 px-4 py-2.5 rounded text-xs text-emerald-800 font-medium flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{matchedProduct.name} · {matchedProduct.category === 'Kolhapuri Chappal' ? `Size ${selectedSize}` : 'Free Size'} · {matchedProduct.colorVariants && matchedProduct.colorVariants[selectedColorVariant] ? matchedProduct.colorVariants[selectedColorVariant].colorName : ''} · ✓ In Stock</span>
                  </div>
                ) : (
                  <div className="bg-red-50/60 border border-red-100 px-4 py-2.5 rounded text-xs text-red-800 font-medium flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>{matchedProduct.name} · {matchedProduct.category === 'Kolhapuri Chappal' ? `Size ${selectedSize}` : 'Free Size'} · {matchedProduct.colorVariants && matchedProduct.colorVariants[selectedColorVariant] ? matchedProduct.colorVariants[selectedColorVariant].colorName : ''} · Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Thumbnails - Vertical on Desktop */}
              <div className="order-2 lg:order-1 flex flex-col gap-3 w-16 xl:w-20">
                {productImages.map((t, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleActiveImageChange(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative overflow-hidden border-2 transition-all duration-300 aspect-square flex-shrink-0 w-full ${
                      activeThumb === i ? 'border-gold-500 shadow-md' : 'border-dark/10 hover:border-dark/30'
                    }`}
                  >
                    <img src={t} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    {activeThumb === i && (
                      <div className="absolute inset-0 bg-gold-500/10"></div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right: Details ─── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            {matchedProduct.badge && (
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-xs text-red-600 font-medium tracking-wide">{matchedProduct.badge}</span>
              </div>
            )}

            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3">{matchedProduct.name}</h1>
            <p className="text-dark/60 italic mb-6 flex items-center gap-2 flex-wrap">
              <span>{matchedProduct.subCategory || matchedProduct.collection || matchedProduct.category}</span>
              {matchedProduct.weight && (
                <span className="inline-flex items-center bg-gold-50 border border-gold-200/50 px-2 py-0.5 text-xs text-gold-700 font-medium tracking-wide rounded font-sans">
                  {matchedProduct.weight}
                </span>
              )}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 mb-3">
              {Number(matchedProduct.discount) > 0 ? (
                <>
                  <span className="text-dark/40 line-through text-lg">
                    ₹{basePrice.toLocaleString()}
                  </span>
                  <span className="font-serif text-3xl font-bold text-gold-600">
                    ₹{discountedPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="font-serif text-3xl font-bold text-gold-600">₹{basePrice.toLocaleString()}</span>
              )}
              {Number(matchedProduct.discount) > 0 && (
                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 font-medium border border-green-200 rounded">{Number(matchedProduct.discount)}% OFF</span>
              )}
              {referringReseller && (
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 font-medium border border-emerald-200 rounded">
                  +{commissionRate}% commission (₹{commissionAmount})
                </span>
              )}
            </div>

            {/* Rare find */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 border-l-2 border-gold-500 pl-3 mb-8"
            >
              <span className="text-gold-600 text-sm">⚡</span>
              <span className="text-sm text-dark/70 font-medium italic">
                {matchedProduct.category === 'Kolhapuri Chappal' 
                  ? 'Genuine Leather Ledger: Crafted by master artisans in Pattan Kadoli.' 
                  : `Exclusive release: Only a few pieces remaining in stock.`}
              </span>
            </motion.div>

            {/* Color Variants Selector */}
            {matchedProduct.colorVariants && matchedProduct.colorVariants.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium tracking-widest text-dark/60">SELECT COLOR</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {matchedProduct.colorVariants.map((variant, index) => (
                    <motion.button
                      key={variant.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedColorVariant(index)
                        setActiveThumb(0) // Reset to first image of selected color
                      }}
                      className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all duration-200 ${
                        selectedColorVariant === index
                          ? 'border-dark bg-dark/5'
                          : 'border-dark/20 hover:border-dark/40'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      <span className={`text-xs font-medium ${
                        selectedColorVariant === index ? 'text-dark' : 'text-dark/60'
                      }`}>
                        {variant.colorName}
                      </span>
                    </motion.button>
                  ))}
                </div>
                {/* Display selected color name below the product image */}
                <div className="mt-3 text-center">
                  <span className="text-sm font-medium text-dark/70">
                    Color: {matchedProduct.colorVariants[selectedColorVariant]?.colorName || 'Default'}
                  </span>
                </div>
              </div>
            )}

            {/* Size selector */}
            {matchedProduct.category === 'Kolhapuri Chappal' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium tracking-widest text-dark/60">SELECT SIZE (IND)</p>
                  <button 
                    onClick={() => setShowChappalSizeChart(true)}
                    className="text-xs text-gold-600 underline hover:text-gold-700 transition-colors"
                  >
                    SIZE GUIDE
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(matchedProduct.sizes && Object.keys(matchedProduct.sizes).length > 0 
                    ? Object.keys(matchedProduct.sizes).map(Number) 
                    : defaultSizes
                  ).map((s) => {
                    const isSizeInStock = matchedProduct.sizes ? Number(matchedProduct.sizes[s] || 0) > 0 : true
                    return (
                      <motion.button
                        key={s}
                        whileHover={isSizeInStock ? { scale: 1.05 } : {}}
                        whileTap={isSizeInStock ? { scale: 0.95 } : {}}
                        onClick={() => setSelectedSize(s)}
                        className={`w-12 h-12 text-sm border transition-all duration-200 relative ${
                          selectedSize === s
                            ? 'bg-dark text-white border-dark'
                            : isSizeInStock
                              ? 'border-dark/20 hover:border-dark text-dark'
                              : 'border-dark/10 text-dark/30 bg-stone-100/50'
                        }`}
                      >
                        {s}
                        {!isSizeInStock && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                            <div className="w-[140%] h-[1px] bg-red-500/40 rotate-45 transform origin-center"></div>
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Ring Size selector for Jewellery */}
            {matchedProduct.category === 'Jewellery' && matchedProduct.name.toLowerCase().includes('ring') && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium tracking-widest text-dark/60">SELECT RING SIZE (IND)</p>
                  <button 
                    onClick={() => setShowRingSizeChart(true)}
                    className="text-xs text-gold-600 underline hover:text-gold-700 transition-colors"
                  >
                    SIZE CHART
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ringSizeChart.map((size) => (
                    <motion.button
                      key={size.indian}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRingSize(size.indian)}
                      className={`w-12 h-12 text-sm border transition-all duration-200 ${
                        selectedRingSize === size.indian
                          ? 'bg-dark text-white border-dark'
                          : 'border-dark/20 hover:border-dark text-dark'
                      }`}
                    >
                      {size.indian}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-dark/50">
                  Selected: Size {selectedRingSize} (US {ringSizeChart.find(s => s.indian === selectedRingSize)?.us}, UK {ringSizeChart.find(s => s.indian === selectedRingSize)?.uk})
                </div>
              </div>
            )}

            {/* Expandable section */}
            <div className="mb-8 border-t border-dark/10">
              {[
                { key: 'craftsmanship', label: 'CRAFTSMANSHIP & MATERIALS' },
                { key: 'care', label: 'CARE INSTRUCTIONS' },
                { key: 'shipping', label: 'SHIPPING & RETURNS' },
              ].map((section) => (
                <div key={section.key} className="border-b border-dark/10">
                  <button
                    onClick={() => setExpandedSection(prev => prev === section.key ? null : section.key)}
                    className="w-full flex items-center justify-between py-4 text-xs font-medium tracking-widest text-dark/70 hover:text-dark transition-colors"
                  >
                    {section.label}
                    <motion.span
                      animate={{ rotate: expandedSection === section.key ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ∨
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {expandedSection === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-sm text-dark/60 leading-relaxed">
                          {section.key === 'craftsmanship' && (
                            <>
                              <p className="mb-3">{matchedProduct.description || 'Constructed from premium materials that soften and shine with age. Every detail is hand-executed by a third-generation master artisan from the Kolhapur cluster.'}</p>
                              {matchedProduct.category === 'Kolhapuri Chappal' && (
                                <ul className="space-y-1.5">
                                  {['Hand-braided silk thread accents', 'Double-layered cushioned leather footbed'].map(b => (
                                    <li key={b} className="flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-gold-500" />
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {matchedProduct.category === 'Jewellery' && (
                                <div className="mt-4 border-t border-dark/5 pt-3">
                                  <p className="text-[10px] font-bold text-dark/70 tracking-wider mb-2 uppercase font-sans">Specifications</p>
                                  <table className="w-full text-xs text-dark/65 border-collapse">
                                    <tbody>
                                      {matchedProduct.weight && (
                                        <tr className="border-b border-dark/5">
                                          <td className="py-2 font-medium w-1/3">Net Weight</td>
                                          <td className="py-2 text-dark font-semibold">{matchedProduct.weight}</td>
                                        </tr>
                                      )}
                                      {matchedProduct.metal && (
                                        <tr className="border-b border-dark/5">
                                          <td className="py-2 font-medium w-1/3">Metal</td>
                                          <td className="py-2 text-dark font-semibold">{matchedProduct.metal}</td>
                                        </tr>
                                      )}
                                      {matchedProduct.gemstone && (
                                        <tr className="border-b border-dark/5">
                                          <td className="py-2 font-medium w-1/3">Gemstones</td>
                                          <td className="py-2 text-dark font-semibold">{matchedProduct.gemstone}</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </>
                          )}
                          {section.key === 'care' && <p>Clean with a soft dry cloth. Avoid exposure to water. Store in the provided dust bag away from direct sunlight.</p>}
                          {section.key === 'shipping' && <p>Free shipping across India. Delivered within 5-7 business days. 14-day returns accepted for unworn items.</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-3 mb-6">
              <div>
                <p className="text-xs text-dark/40 tracking-widest mb-1">TOTAL PRICE</p>
                <p className="font-serif text-2xl font-bold">₹{finalPrice.toLocaleString()}</p>
                {referringReseller && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Base: ₹{discountedPrice.toLocaleString()} + Commission: ₹{commissionAmount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <motion.button
                onClick={handleAddToCart}
                disabled={!isSelectedSizeInStock}
                whileHover={isSelectedSizeInStock ? { scale: 1.02 } : {}}
                whileTap={isSelectedSizeInStock ? { scale: 0.98 } : {}}
                className={`flex-1 text-white text-sm font-medium tracking-widest py-4 relative overflow-hidden transition-all duration-300 ${
                  isSelectedSizeInStock 
                    ? 'bg-dark hover:bg-gold-600 hover:text-dark' 
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed border-stone-200'
                }`}
              >
                <AnimatePresence mode="wait">
                  {!isSelectedSizeInStock ? (
                    <motion.span
                      key="outofstock"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      OUT OF STOCK
                    </motion.span>
                  ) : addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      ✓ ADDED TO BAG
                    </motion.span>
                  ) : (
                    <motion.span
                      key="buy"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      BUY NOW
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                onClick={() => {
                  if (isWishlisted) {
                    removeFromWishlist(currentProduct.id)
                  } else {
                    addToWishlist(currentProduct)
                  }
                }}
                whileHover={{ scale: 1.05, backgroundColor: '#f5f0e8' }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 border border-dark/20 flex items-center justify-center transition-all duration-300"
              >
                {isWishlisted ? (
                  <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-dark/70 hover:text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Purchase Assurances */}
            <div className="mb-6 bg-[#faf8f5] border border-dark/5 p-5 rounded-xl space-y-3">
              <div className="flex flex-col gap-2.5 text-xs text-dark/80 font-semibold font-sans">
                <div className="flex items-center gap-2.5">
                  <span>✅</span>
                  <span>COD Available</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>✅</span>
                  <span>Secure Payment (Razorpay)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>✅</span>
                  <span>All India Shipping</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>✅</span>
                  <span>WhatsApp Support</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>✅</span>
                  <span>Easy Exchange <span className="text-dark/50 text-[10px] font-normal font-serif">(जर देणार असशील)</span></span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-between text-center">
              {[
                { icon: '✓', label: 'AUTHENTIC & TAGGED' },
                { icon: '◈', label: 'COMPLIMENTARY SHIPPING' },
                { icon: '◉', label: 'ETHICAL WORKSHOP' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1">
                  <span className="text-gold-500 text-xl">{badge.icon}</span>
                  <span className="text-xs text-dark/40 tracking-wide">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Reviews ─── */}
        <div ref={reviewsRef} className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-4xl font-bold mb-2">Customer Stories</h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold-400 text-sm">★</span>
                  ))}
                </div>
                <span className="text-sm text-dark/60">4.9 out of 5 (124 Reviews)</span>
              </div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={reviewsInView ? { opacity: 1 } : {}}
              whileHover={{ scale: 1.03 }}
              onClick={() => setShowReviewModal(true)}
              className="text-xs tracking-widest border border-dark/20 px-5 py-2.5 hover:border-dark transition-colors"
            >
              WRITE A REVIEW
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-white p-6 border border-dark/8 hover:border-gold-200 transition-colors duration-300 radial-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-gold-600 tracking-widest">{r.tag}</p>
                  </div>
                  <span className="text-xs text-dark/40">{r.date}</span>
                </div>
                <p className="font-serif text-lg italic mb-3">{r.quote}</p>
                <p className="text-sm text-dark/60 leading-relaxed">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Heritage CTA ─── */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=1600&q=80"
            alt="Heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div ref={heroRef} className="relative z-10 text-center text-white px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            className="text-xs tracking-widest text-gold-400 mb-4 uppercase"
          >
            Our Heritage
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl italic mb-6"
          >
            Each stitch tells a story of a thousand years.
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="border border-white text-white text-xs tracking-widest px-8 py-3"
          >
            EXPLORE THE ATELIER
          </motion.button>
        </div>
      </section>

      {/* Fullscreen Zoom Modal for Mobile */}
      <AnimatePresence>
        {showFullscreenZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={handleCloseFullscreen}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseFullscreen}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Zoom In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Zoom Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleResetZoom()
                }}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Reset Zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm z-10">
              {Math.round(fullscreenZoomLevel * 100)}%
            </div>
            
            {/* Zoomable Image */}
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={productImages[activeThumb] || productImages[0]}
              alt={matchedProduct.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{
                transform: `scale(${fullscreenZoomLevel})`,
                cursor: fullscreenZoomLevel > 1 ? 'move' : 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              Use controls to zoom • Drag to pan
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── WRITE A REVIEW POPUP MODAL ─── */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-[#1a1208]/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-dark/5 p-8 rounded-2xl max-w-md w-full relative z-10 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center relative">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="absolute right-0 top-0 text-dark/40 hover:text-dark text-lg focus:outline-none"
                >
                  ✕
                </button>
                <span className="text-3xl">✍️</span>
                <h3 className="font-serif text-xl font-bold mt-2 text-dark">Write a Customer Review</h3>
                <p className="text-[10px] text-dark/45 uppercase tracking-widest font-bold">Featured in our customer stories</p>
              </div>

              {reviewSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-500/20 p-4 rounded-xl text-center space-y-2"
                >
                  <span className="text-2xl">🎉</span>
                  <h4 className="font-serif font-bold text-emerald-800 text-sm">Review Submitted Successfully!</h4>
                  <p className="text-[11px] text-emerald-600 font-medium">Thank you for sharing your experience. Your feedback is now live!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-medium text-dark"
                    />
                  </div>

                  {/* Rating Field */}
                  <div>
                    <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-2xl transition-transform hover:scale-125 focus:outline-none text-gold-500"
                        >
                          {star <= reviewRating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Field */}
                  <div>
                    <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Your Location (City, State)</label>
                    <input
                      type="text"
                      value={reviewLocation}
                      onChange={(e) => setReviewLocation(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-medium text-dark"
                    />
                  </div>

                  {/* Review Text Area */}
                  <div>
                    <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Your Review</label>
                    <textarea
                      required
                      rows="4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-medium text-dark resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full bg-dark hover:bg-gold-600 text-white text-xs font-bold py-3.5 rounded-lg transition-colors shadow-sm uppercase tracking-widest"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review →'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ring Size Chart Modal */}
      <AnimatePresence>
        {showRingSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRingSizeChart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark">Ring Size Chart</h3>
                      <p className="text-sm text-dark/60">Find your perfect ring size</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRingSizeChart(false)}
                    className="p-2 rounded-lg text-dark/40 hover:text-dark hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-dark text-base mb-3">How to Measure Ring Size:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-dark/70">
                    <div className="space-y-2">
                      <p className="font-medium text-dark">Method 1 - Existing Ring:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Measure inner diameter of a well-fitting ring</li>
                        <li>• Use a ruler to measure across the inside</li>
                        <li>• Compare with diameter column below</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-dark">Method 2 - Finger Measurement:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Wrap string around finger base</li>
                        <li>• Mark overlap point and measure length</li>
                        <li>• Compare with circumference column</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <thead>
                      <tr className="bg-gold-50 border-b border-gold-100">
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Indian Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">US Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">UK Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Diameter</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Circumference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ringSizeChart.map((size, index) => (
                        <tr 
                          key={size.indian} 
                          className={`border-b border-gray-100 hover:bg-gold-25 transition-colors cursor-pointer ${
                            selectedRingSize === size.indian ? 'bg-gold-100' : index % 2 === 0 ? 'bg-gray-25' : 'bg-white'
                          }`}
                          onClick={() => {
                            setSelectedRingSize(size.indian)
                            setShowRingSizeChart(false)
                          }}
                        >
                          <td className="px-4 py-3 text-sm font-bold text-gold-600">{size.indian}</td>
                          <td className="px-4 py-3 text-sm text-dark/70">{size.us}</td>
                          <td className="px-4 py-3 text-sm text-dark/70">{size.uk}</td>
                          <td className="px-4 py-3 text-sm text-dark/70 font-medium">{size.diameter}</td>
                          <td className="px-4 py-3 text-sm text-dark/70 font-medium">{size.circumference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-2">Important Notes:</p>
                      <ul className="space-y-1 text-amber-700">
                        <li>• Ring sizes can vary by ±0.5 sizes depending on finger width and knuckle size</li>
                        <li>• Measure at room temperature (fingers swell in heat, shrink in cold)</li>
                        <li>• For wide bands (&gt;6mm), consider going up 0.5-1 size</li>
                        <li>• Custom sizing available for all temple jewellery pieces</li>
                        <li>• Click on any size above to select it for your order</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kolhapuri Chappal Size Chart Modal */}
      <AnimatePresence>
        {showChappalSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowChappalSizeChart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark font-serif">Kolhapuri Chappal Size Chart</h3>
                      <p className="text-sm text-dark/60">Find your perfect fit for handcrafted leather footwear</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChappalSizeChart(false)}
                    className="p-2 rounded-lg text-dark/40 hover:text-dark hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-dark text-base mb-3">How to Measure Foot Length:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-dark/70">
                    <div className="space-y-2">
                      <p className="font-medium text-dark">Step-by-step measurement:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Place a piece of paper on a flat floor against a wall</li>
                        <li>• Stand on it with your heel lightly touching the wall</li>
                        <li>• Mark the longest part of your foot (tip of the big toe) on the paper</li>
                        <li>• Measure that distance with a ruler in centimeters (cm)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-dark">Finding your size:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Compare your measured length against the "Foot Length (cm)" column</li>
                        <li>• If your length is in between sizes, we recommend selecting the larger size</li>
                        <li>• True Kolhapuri chappals stretch slightly and mold to your feet over time</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <thead>
                      <tr className="bg-gold-50 border-b border-gold-100">
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Our Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">India / UK Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">US Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Foot Length (cm)</th>
                        <th className="px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Euro Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chappalSizeChart.map((size, index) => (
                        <tr 
                          key={size.our} 
                          className={`border-b border-gray-100 hover:bg-gold-25 transition-colors cursor-pointer ${
                            selectedSize === size.indiaUk ? 'bg-gold-100 font-bold' : index % 2 === 0 ? 'bg-gray-25' : 'bg-white'
                          }`}
                          onClick={() => {
                            setSelectedSize(size.indiaUk)
                            setShowChappalSizeChart(false)
                          }}
                        >
                          <td className="px-4 py-3 text-sm text-gold-600 font-bold">{size.our}</td>
                          <td className="px-4 py-3 text-sm text-dark/70">{size.indiaUk}</td>
                          <td className="px-4 py-3 text-sm text-dark/70">{size.us}</td>
                          <td className="px-4 py-3 text-sm text-dark/70 font-medium">{size.footLength} cm</td>
                          <td className="px-4 py-3 text-sm text-dark/70 font-medium">{size.euro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-2">Artisanal Fit Notes:</p>
                      <ul className="space-y-1 text-amber-700">
                        <li>• Handcrafted leather footwear naturally takes the shape of your foot within a few wearings</li>
                        <li>• To soften them faster, apply a light coat of castor oil or coconut oil to the inner leather straps</li>
                        <li>• Avoid exposing leather chappals to direct water or moisture</li>
                        <li>• Click on any row above to select that size for your order</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
