import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'
import { useApp } from '../context/AppContext'

// Hero images from Unsplash (Indian crafts/jewelry)
const HERO_BG = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80'
const CRAFT_IMG = '/kolhapuri_crafting.png'
const NECKLACE = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'
const FOOTWEAR = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'
const FABRIC = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80'
const JEWELRY2 = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'
const BRACELET = 'https://images.unsplash.com/photo-1573408301185-9519f94d71f5?w=600&q=80'
const SANDAL = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'

const products = [
  { name: 'Aura Ruby Necklace', price: '₹1,42,000', img: NECKLACE, tag: '' },
  { name: 'Celestial Suede Slides', price: '₹13,500', img: FOOTWEAR, tag: 'NEW' },
  { name: 'Kundan Heritage Set', price: '₹85,000', img: JEWELRY2, tag: '' },
  { name: 'Artisan Gold Bangle', price: '₹38,500', img: BRACELET, tag: 'LIMITED' },
]

function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = (end / duration) * 16
    const interval = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(interval) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(interval)
  }, [inView, end])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

function AnimatedText({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const heroRef = useRef(null)
  const [activeProduct, setActiveProduct] = useState(null)
  const [statsRef, statsInView] = useInView()
  const [marqRef, marqInView] = useInView()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Load homepage settings from localStorage
  const [homepageSettings, setHomepageSettings] = useState(() => {
    const saved = localStorage.getItem('samartha_homepage_settings')
    return saved ? JSON.parse(saved) : {
      hero: {
        title: 'SAMARTHA',
        subtitle: 'Handcrafted Heritage',
        description: 'Timeless Indian artistry meets modern elegance. Discover authentic Kolhapuri chappals and heritage jewelry, crafted by master artisans.',
        backgroundImage: '/bannersamartha.png',
        ctaText: 'SHOP NOW'
      },
      about: {
        title: 'Crafted with Soul',
        description: 'Every piece tells a story of tradition, skill, and passion passed down through generations.',
        image: '/kolhapuri_crafting.png'
      },
      stats: {
        artisans: 150,
        products: 500,
        customers: 2000
      },
      marquee: {
        enabled: true,
        text: '★ FINE LEATHER ★ TRADITIONAL ARTISANS ★ TIMELESS ELEGANCE ★ ETHNIC & MODERN ★ HANDCRAFTED'
      }
    }
  })

  const { products, addToCart, wishlist, addToWishlist, removeFromWishlist, reviews, addReview, videoTestimonials } = useApp()
  const [activeVideo, setActiveVideo] = useState(null)

  const isYouTubeUrl = (url) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getEmbedUrl = (url) => {
    if (!url) return ''
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return url;
  }
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewLocation, setReviewLocation] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Reviews slider states
  const [reviewIndex, setReviewIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [isReviewsHovered, setIsReviewsHovered] = useState(false)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cardsToShow = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3
  const gap = 32 // gap-8 is 32px

  const nextReview = () => {
    if (!reviews || reviews.length === 0) return
    const maxIndex = Math.max(0, reviews.length - cardsToShow)
    setReviewIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevReview = () => {
    if (!reviews || reviews.length === 0) return
    const maxIndex = Math.max(0, reviews.length - cardsToShow)
    setReviewIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  // Autoplay for reviews slider
  useEffect(() => {
    if (!reviews || reviews.length <= 3 || isReviewsHovered) return
    const maxIndex = Math.max(0, reviews.length - cardsToShow)
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews, cardsToShow, isReviewsHovered])

  // Reset index if it exceeds maxIndex due to screen size changes
  useEffect(() => {
    if (!reviews) return
    const maxIndex = Math.max(0, reviews.length - cardsToShow)
    if (reviewIndex > maxIndex) {
      setReviewIndex(maxIndex)
    }
  }, [cardsToShow, reviews, reviewIndex])

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
  const productsList = products || []

  // Identify best sellers - products with "BEST SELLER" badge or top products
  const bestSellers = productsList
    .filter(p => {
      const badge = (p.badge || p.tag || '').toUpperCase()
      return badge.includes('BEST') || badge.includes('TOP') || badge.includes('POPULAR')
    })
    .slice(0, 4)

  // If no products have best seller badge, show top 4 products by ID (newest/featured)
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : productsList.slice(0, 4)

  const marqueePhrases = homepageSettings.marquee.text.split('★').map(s => s.trim()).filter(Boolean).map(s => `★ ${s}`)

  const heroSlides = [
    {
      id: 1,
      label: 'TRADITIONAL',
      title1: 'Kolhapuri',
      title2: 'CHAPPALS',
      subtitle: 'Authentic Kolhapuri Paytaan & Premium Jewellery',
      ctaText: homepageSettings.hero.ctaText,
      link: '/heritage?category=Kolhapuri Chappal',
      bgImage: homepageSettings.hero.backgroundImage
    },
    {
      id: 2,
      label: 'EXQUISITE',
      title1: 'Kolhapuri',
      title2: 'JEWELLERY',
      subtitle: 'Authentic Kolhapuri Paytaan & Premium Jewellery',
      ctaText: homepageSettings.hero.ctaText,
      link: '/heritage?category=Jewellery',
      bgImage: '/IMG_4422.PNG'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <div className="bg-cream min-h-screen pb-16 md:pb-0">
      <Navbar dark />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden bg-black font-inter">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: 'linear' }}
              src={heroSlides[currentSlide].bgImage}
              alt="Samartha Craft Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            
            {/* Hero content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center text-left text-white px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full z-10 pt-20">
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, letterSpacing: '0.5em' }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-sm md:text-base font-medium tracking-[0.4em] text-gold-300 mb-2 sm:mb-4 md:mb-6 uppercase"
              >
                {heroSlides[currentSlide].label}
              </motion.div>

              {/* Main title */}
              <div className="overflow-hidden py-1 sm:py-2 mb-2 sm:mb-3 md:mb-4">
                <motion.h1
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-gold-300 drop-shadow-lg"
                >
                  {heroSlides[currentSlide].title1}
                </motion.h1>
              </div>
              <div className="overflow-hidden py-1 sm:py-2 mb-4 sm:mb-6 md:mb-8">
                <motion.h1
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-gold-300 tracking-wider drop-shadow-lg"
                >
                  {heroSlides[currentSlide].title2}
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xs sm:text-sm md:text-base font-medium tracking-[0.15em] sm:tracking-[0.3em] text-gold-300 mb-6 sm:mb-8 md:mb-10 uppercase drop-shadow-md"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.div>

              {/* Description */}
              {homepageSettings.hero.description && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="hidden sm:block text-xs sm:text-sm md:text-base text-white/80 max-w-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed font-sans drop-shadow-md"
                >
                  {homepageSettings.hero.description}
                </motion.p>
              )}

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 flex-wrap"
              >
                <Link to={heroSlides[currentSlide].link}>
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(201,152,42,0.9)' }}
                    whileTap={{ scale: 0.97 }}
                    className="border border-gold-400 bg-[#c17a2e] text-white text-sm font-bold tracking-widest px-10 py-4 transition-all duration-300 backdrop-blur-sm rounded-md"
                  >
                    {heroSlides[currentSlide].ctaText}
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-gold-400 w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10"
        >
          <span className="text-xs tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── MARQUEE ─── */}
      {homepageSettings.marquee.enabled && (
        <div className="bg-dark py-3 overflow-hidden" ref={marqRef}>
          <div className="marquee-track">
            {[...marqueePhrases, ...marqueePhrases].map((phrase, i) => (
              <span key={i} className="text-xs tracking-[0.3em] text-gold-400 mx-8 whitespace-nowrap font-medium">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── HERO ADDITIONAL INFO BANNER ─── */}
      <div className="bg-white border-b border-dark/5 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#c9982a_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            {/* Title Block */}
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-dark/5 pb-4 lg:pb-0 lg:pr-6 text-center lg:text-left">
              <span className="text-[10px] text-gold-600 font-bold uppercase tracking-[0.2em] block mb-1">Samartha Atelier</span>
              <h3 className="font-serif text-base lg:text-lg font-bold text-dark leading-snug">
                Authentic Kolhapuri Paytaan & Premium Jewellery
              </h3>
            </div>
            
            {/* Trust Points Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:pl-6">
              {/* Point 1 */}
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl border border-dark/5 hover:border-gold-500/30 transition-all duration-300">
                <div className="w-10 h-10 bg-gold-500/5 rounded-full flex items-center justify-center text-lg text-gold-600 font-bold shrink-0">
                  💳
                </div>
                <div>
                  <h4 className="font-serif font-bold text-dark text-xs tracking-wider uppercase">COD Available</h4>
                  <p className="text-[10px] text-dark/50 mt-0.5 leading-normal">Pay on delivery across pin codes</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl border border-dark/5 hover:border-gold-500/30 transition-all duration-300">
                <div className="w-10 h-10 bg-gold-500/5 rounded-full flex items-center justify-center text-lg text-gold-600 font-bold shrink-0">
                  🚚
                </div>
                <div>
                  <h4 className="font-serif font-bold text-dark text-xs tracking-wider uppercase">All India Shipping</h4>
                  <p className="text-[10px] text-dark/50 mt-0.5 leading-normal">Secure insured cargo dispatch</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl border border-dark/5 hover:border-gold-500/30 transition-all duration-300">
                <div className="w-10 h-10 bg-gold-500/5 rounded-full flex items-center justify-center text-lg text-gold-600 font-bold shrink-0">
                  🖐️
                </div>
                <div>
                  <h4 className="font-serif font-bold text-dark text-xs tracking-wider uppercase">Handmade Quality</h4>
                  <p className="text-[10px] text-dark/50 mt-0.5 leading-normal">100% certified heritage crafts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <AnimatedText>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-4">
                Shop by Category
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.1}>
              <p className="text-dark/60 text-base">
                Product for every style and occasion
              </p>
            </AnimatedText>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-4xl mx-auto">
            {/* Footwear Category */}
            <Link to="/heritage?category=Kolhapuri Chappal">
              <AnimatedText delay={0.2}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-6">
                    {/* Circular Image Container */}
                    <div className="w-full aspect-square rounded-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                        <img
                          src="/kolhapuri_category.png"
                          alt="Footwear"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Label */}
                  <div className="text-center">
                    <h3 className="font-serif text-2xl font-bold text-dark group-hover:text-gold-600 transition-colors">
                      Footwear
                    </h3>
                  </div>
                </motion.div>
              </AnimatedText>
            </Link>

            {/* Jewellery Category */}
            <Link to="/heritage?category=Jewellery">
              <AnimatedText delay={0.3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-6">
                    {/* Circular Image Container */}
                    <div className="w-full aspect-square rounded-full overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                        <img
                          src="/jewellery_category.png"
                          alt="Jewellery"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Label */}
                  <div className="text-center">
                    <h3 className="font-serif text-2xl font-bold text-dark group-hover:text-gold-600 transition-colors">
                      Jewellery
                    </h3>
                  </div>
                </motion.div>
              </AnimatedText>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <AnimatedText>
              <p className="text-xs font-medium tracking-widest text-gold-600 mb-4">OUR PHILOSOPHY</p>
            </AnimatedText>
            <AnimatedText delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {homepageSettings.about.title}
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.2}>
              <p className="text-dark/60 leading-relaxed mb-10 max-w-md">
                {homepageSettings.about.description}
              </p>
            </AnimatedText>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-8">
              {[
                { num: homepageSettings.stats.artisans, suffix: '+', label: 'Master Artisans' },
                { num: homepageSettings.stats.products, suffix: '+', label: 'Handcrafted Products' },
                { num: homepageSettings.stats.customers, suffix: '+', label: 'Happy Customers' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                >
                  <div className="font-serif text-3xl font-bold text-dark">
                    {statsInView ? <Counter end={stat.num} suffix={stat.suffix} /> : '0' + stat.suffix}
                  </div>
                  <div className="text-xs text-dark/50 tracking-wide mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image with quote */}
          <div className="relative">
            <AnimatedText delay={0.15}>
              <div className="image-reveal rounded-sm overflow-hidden">
                <img
                  src={homepageSettings.about.image}
                  alt="Indian crafts"
                  className="w-full h-80 lg:h-96 object-cover"
                />
              </div>
            </AnimatedText>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-cream border border-gold-200 px-6 py-4 shadow-xl"
            >
              <p className="font-serif italic text-dark/70 text-lg">"Heritage in every single step."</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#faf8f5] to-cream">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <AnimatedText>
              <div className="inline-block">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-12 bg-gold-500"></div>
                  <span className="text-xs tracking-[0.3em] text-gold-600 font-bold uppercase">Customer Favorites</span>
                  <div className="h-px w-12 bg-gold-500"></div>
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl font-bold text-dark mb-4 text-center">
                  Best Sellers
                </h2>
                <p className="text-dark/60 text-lg max-w-2xl mx-auto text-center">
                  Discover our most loved pieces, handpicked by customers who appreciate authentic craftsmanship
                </p>
              </div>
            </AnimatedText>
          </div>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayBestSellers.map((p, i) => {
              const isWishlisted = wishlist.some(item => item.id === p.id)
              const discountedPrice = p.discount && Number(p.discount) > 0
                ? Math.round(p.price * (1 - Number(p.discount) / 100))
                : null

              return (
                <motion.div
                  key={p.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  {/* Best Seller Badge - Ribbon Style */}
                  <div className="absolute -top-2 -left-2 z-20">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-[9px] px-4 py-1.5 tracking-wider uppercase font-bold shadow-lg flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        BEST SELLER
                      </div>
                      <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-gold-700 -translate-y-full"></div>
                    </div>
                  </div>

                  {/* Product Card */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gold-200 hover:border-gold-400">
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-white aspect-square flex items-center justify-center p-4">
                      <Link to={`/product?id=${p.id}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={p.images?.[0] || p.image || p.img || p.colorVariants?.[0]?.images?.[0]}
                          alt={p.name}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>

                      {/* Stock Badge */}
                      {Number(p.stock || 0) <= 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] px-3 py-1 tracking-wider uppercase font-bold rounded-full">
                          SOLD OUT
                        </div>
                      )}

                      {/* Wishlist & Quick View Icons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault()
                            if (isWishlisted) {
                              removeFromWishlist(p.id)
                            } else {
                              addToWishlist({
                                id: p.id,
                                name: p.name,
                                price: discountedPrice || p.price,
                                image: p.images?.[0] || p.image || p.img,
                                category: p.category
                              })
                            }
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-colors"
                        >
                          {isWishlisted ? (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 bg-gradient-to-b from-white to-gold-50/30">
                      <Link to={`/product?id=${p.id}`}>
                        <h3 className="font-medium text-dark mb-2 group-hover:text-gold-600 transition-colors line-clamp-2 min-h-[3rem]">
                          {p.name}
                        </h3>
                        
                        {/* Category */}
                        <p className="text-xs text-dark/50 mb-3 uppercase tracking-wider">
                          {p.category || 'Handcrafted'}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          {discountedPrice ? (
                            <>
                              <span className="text-xl font-bold text-gold-600">
                                ₹{discountedPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-dark/40 line-through">
                                ₹{typeof p.price === 'number' ? p.price.toLocaleString() : p.price}
                              </span>
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                {p.discount}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-gold-600">
                              ₹{typeof p.price === 'number' ? p.price.toLocaleString() : p.price}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.preventDefault()
                            addToCart({
                              id: p.id,
                              name: p.name,
                              price: discountedPrice || p.price,
                              image: p.img || p.image || p.images?.[0],
                              quantity: 1,
                              category: p.category
                            })
                          }}
                          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </motion.button>
                      </Link>
                    </div>
                  </div>

                  {/* Popularity Indicator */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg border-2 border-gold-300 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, idx) => (
                        <svg key={idx} className="w-3 h-3 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-dark/70">Trending</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link to="/heritage">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-dark text-white px-8 py-4 rounded-full font-medium hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Explore All Best Sellers</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <AnimatedText>
            <h2 className="font-serif text-4xl font-bold">New Arrivals</h2>
          </AnimatedText>
          <div className="flex gap-2">
            {['←', '→'].map((arrow, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: '#c9982a', color: 'white' }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-dark/20 flex items-center justify-center text-sm transition-colors duration-200"
              >
                {arrow}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {productsList.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id || i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-white aspect-square flex items-center justify-center">
                <Link to={`/product?id=${p.id}`} className="w-full h-full flex items-center justify-center">
                  <img
                    src={p.images?.[0] || p.image || p.img || p.imageUrls?.[0]}
                    alt={p.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                
                {/* Badge */}
                {Number(p.stock || 0) <= 0 ? (
                  <div className="absolute top-3 left-3 bg-stone-500 text-white text-[10px] px-2 py-1 tracking-wider uppercase font-bold rounded">
                    SOLD OUT
                  </div>
                ) : (p.tag || p.badge) ? (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] px-2 py-1 tracking-wider uppercase font-bold rounded">
                    {p.tag || p.badge}
                  </div>
                ) : null}

                {/* Hover Action Icons */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault()
                      const isWishlisted = wishlist.some(item => item.id === p.id)
                      if (isWishlisted) {
                        removeFromWishlist(p.id)
                      } else {
                        const productToAdd = {
                          id: p.id,
                          name: p.name,
                          price: typeof p.price === 'number' ? `₹${p.price.toLocaleString()}` : p.price,
                          img: p.img || p.image || p.imageUrls?.[0],
                          category: p.category
                        }
                        addToWishlist(productToAdd)
                      }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                      wishlist.some(item => item.id === p.id)
                        ? 'bg-gold-500 text-white'
                        : 'bg-white hover:bg-gold-500 hover:text-white'
                    }`}
                    title={wishlist.some(item => item.id === p.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <svg className="w-5 h-5" fill={wishlist.some(item => item.id === p.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </motion.button>
                  
                  {Number(p.stock || 0) > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        const productToAdd = {
                          id: p.id,
                          name: p.name,
                          price: typeof p.price === 'number' ? `₹${p.price.toLocaleString()}` : p.price,
                          img: p.img || p.image || p.imageUrls?.[0],
                          category: p.category
                        }
                        addToCart(productToAdd)
                      }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-colors"
                      title="Add to Cart"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </motion.button>
                  )}
                  
                  <Link to={`/product?id=${p.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-colors"
                      title="Quick View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 text-center">
                <Link to={`/product?id=${p.id}`}>
                  <h3 className="font-medium text-sm text-dark/80 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2 min-h-[40px]">
                    {p.name}
                  </h3>
                </Link>
                
                {/* Price */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  {p.discount && Number(p.discount) > 0 ? (
                    <>
                      <span className="text-dark/40 line-through text-xs">
                        ₹{p.price.toLocaleString()}
                      </span>
                      <span className="text-gold-600 font-bold text-base">
                        ₹{Math.round(p.price * (1 - Number(p.discount) / 100)).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-gold-600 font-bold text-base">
                      {typeof p.price === 'number' ? `₹${p.price.toLocaleString()}` : p.price}
                    </span>
                  )}
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center gap-1 text-gold-500">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-4 h-4 ${idx < (p.rating || 4) ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-dark/50 ml-1">({p.reviews || 26} reviews)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── INFO IMAGE SECTION ─── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <img
            src="/info.png"
            alt="Samartha Craft Studio Information"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </motion.div>
      </section>

      {/* ─── VIDEO TESTIMONIALS (9:16 Reels Style) ─── */}
      {videoTestimonials && videoTestimonials.length > 0 && (
        <section className="py-20 overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-14 px-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold tracking-[0.25em] text-gold-600 uppercase mb-3"
            >
              ✦ Customer Stories
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-5xl font-bold text-dark mb-5"
            >
              Real Reviews, Real People
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              className="h-[3px] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 mx-auto rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-dark/50 mt-4 max-w-md mx-auto"
            >
              Hear directly from our customers about their experience with Samartha craftsmanship.
            </motion.p>
          </div>

          {/* Horizontal scroll container */}
          <div className="flex gap-6 overflow-x-auto px-6 md:px-10 pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {videoTestimonials.map((vid, idx) => (
              <motion.div
                key={vid.id || idx}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="group cursor-pointer relative flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] aspect-[9/16] rounded-3xl overflow-hidden snap-center"
                onClick={() => setActiveVideo(vid)}
                style={{ boxShadow: '0 20px 60px rgba(26,18,8,0.12)' }}
              >
                {/* Full-bleed Cover Image */}
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                />

                {/* Cinematic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />

                {/* Top badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Video Review
                  </span>
                </div>

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(201,152,42,0.9) 0%, rgba(201,152,42,0.6) 100%)',
                      boxShadow: '0 0 0 0 rgba(201,152,42,0.4)'
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ boxShadow: ['0 0 0 0px rgba(201,152,42,0.4)', '0 0 0 20px rgba(201,152,42,0)', '0 0 0 0px rgba(201,152,42,0)'] }}
                    transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeOut' } }}
                  >
                    <svg className="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>

                {/* Bottom info overlay - Glassmorphism */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white font-serif text-sm font-bold leading-snug line-clamp-2 mb-3">
                      "{vid.title}"
                    </h3>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gold-500/80 flex items-center justify-center text-white font-serif font-bold text-xs shadow-lg">
                        {vid.customerName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-bold text-xs">{vid.customerName}</p>
                        <p className="text-white/60 text-[10px] font-medium tracking-wide">{vid.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── HAPPY CUSTOMERS (TESTIMONIALS) ─── */}
      <section className="py-24 bg-[#faf8f5] border-t border-b border-dark/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold tracking-widest text-gold-600 uppercase mb-3 font-serif italic"
            >
              Voices of Samartha
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold text-dark mb-4"
            >
              Our Happy Customers
            </motion.h2>
             <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              className="h-1 bg-gold-500 mx-auto rounded-full"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewModal(true)}
              className="mt-6 border border-dark/20 text-dark/70 text-xs font-bold tracking-widest px-6 py-2.5 hover:bg-dark hover:text-white hover:border-dark transition-all uppercase rounded inline-flex items-center gap-1.5"
            >
              ✍️ Write a Review
            </motion.button>
          </div>

          {reviews && reviews.length > 3 ? (
            <div className="relative w-full">
              {/* Slider Controls */}
              <div className="flex justify-end gap-3 mb-6">
                <button
                  onClick={prevReview}
                  className="w-10 h-10 border border-dark/20 rounded-full flex items-center justify-center text-dark/70 hover:bg-dark hover:text-white transition-all text-sm font-bold"
                  aria-label="Previous reviews"
                >
                  ←
                </button>
                <button
                  onClick={nextReview}
                  className="w-10 h-10 border border-dark/20 rounded-full flex items-center justify-center text-dark/70 hover:bg-dark hover:text-white transition-all text-sm font-bold"
                  aria-label="Next reviews"
                >
                  →
                </button>
              </div>

              {/* Slider Viewport */}
              <div 
                className="overflow-hidden w-full px-1 py-4"
                onMouseEnter={() => setIsReviewsHovered(true)}
                onMouseLeave={() => setIsReviewsHovered(false)}
              >
                <div
                  className="flex"
                  style={{
                    gap: `${gap}px`,
                    transform: `translate3d(calc(-${reviewIndex} * (${100 / cardsToShow}% + ${gap / cardsToShow}px)), 0, 0)`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {reviews.map((rev, idx) => (
                    <motion.div
                      key={rev.id || idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (idx % cardsToShow) * 0.15 }}
                      whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(26,18,8,0.06)' }}
                      className="bg-white p-8 rounded-2xl border border-dark/5 shadow-xs transition-shadow duration-300 relative flex flex-col justify-between"
                      style={{
                        width: `calc(${100 / cardsToShow}% - ${(gap * (cardsToShow - 1)) / cardsToShow}px)`,
                        flexShrink: 0
                      }}
                    >
                      <div>
                        <div className="absolute top-6 right-8 text-gold-500/10 font-serif text-8xl pointer-events-none select-none">“</div>
                        <div className="flex gap-1 text-gold-500 mb-4">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-dark/70 text-sm leading-relaxed mb-6 font-medium italic">
                          "{rev.review}"
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <img 
                          src={rev.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/20" 
                          alt={rev.customerName} 
                        />
                        <div>
                          <h4 className="font-serif font-bold text-dark text-sm flex items-center gap-2">
                            {rev.customerName}
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded font-sans font-bold uppercase">Verified</span>
                            )}
                          </h4>
                          <p className="text-xs text-dark/40 font-semibold tracking-wide">{rev.location}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center items-center gap-2 mt-8">
                {Array.from({ length: reviews.length - cardsToShow + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      reviewIndex === i 
                        ? 'w-8 bg-gold-500' 
                        : 'w-2 bg-dark/20 hover:bg-dark/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews && reviews.map((rev, idx) => (
                <motion.div
                  key={rev.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(26,18,8,0.06)' }}
                  className="bg-white p-8 rounded-2xl border border-dark/5 shadow-xs transition-shadow duration-300 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="absolute top-6 right-8 text-gold-500/10 font-serif text-8xl pointer-events-none select-none">“</div>
                    <div className="flex gap-1 text-gold-500 mb-4">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-dark/70 text-sm leading-relaxed mb-6 font-medium italic">
                      "{rev.review}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img 
                      src={rev.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/20" 
                      alt={rev.customerName} 
                    />
                    <div>
                      <h4 className="font-serif font-bold text-dark text-sm flex items-center gap-2">
                        {rev.customerName}
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded font-sans font-bold uppercase">Verified</span>
                        )}
                      </h4>
                      <p className="text-xs text-dark/40 font-semibold tracking-wide">{rev.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── DARK CTA ─── */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="absolute inset-0">
          <img
            src="/jewellery_category.png"
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-center text-white">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-widest text-gold-400 mb-6 uppercase"
          >
            Preserving the Craft
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl italic mb-10"
          >
            Crafting Silence into Perfection.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/heritage?category=Jewellery">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(201,152,42,0.1)' }}
                whileTap={{ scale: 0.97 }}
                className="border border-white text-white text-xs tracking-widest px-10 py-4 uppercase"
              >
                DISCOVER JEWELLERY →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── VIDEO LIGHTBOX MODAL (9:16 Portrait) ─── */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            {/* Vertical 9:16 Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-[360px] flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              {/* Video Frame */}
              <div className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/5">
                {/* Close Button */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm hover:bg-white/20 text-white/90 flex items-center justify-center text-sm border border-white/10 transition-all focus:outline-none"
                  title="Close"
                >
                  ✕
                </button>

                {/* Video Player */}
                {isYouTubeUrl(activeVideo.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.videoUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={activeVideo.title}
                  />
                ) : (
                  <video
                    src={activeVideo.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    playsInline
                  />
                )}

                {/* Bottom Gradient for info overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Customer Info Overlay inside video */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-sm shadow-lg border-2 border-white/30">
                      {activeVideo.customerName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{activeVideo.customerName}</p>
                      <p className="text-white/50 text-[11px] font-semibold tracking-wider">{activeVideo.location}</p>
                    </div>
                  </div>
                  <p className="text-white/80 font-serif text-xs mt-3 italic leading-relaxed line-clamp-2">
                    "{activeVideo.title}"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
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
                <h3 className="font-serif text-xl font-bold mt-2">Write a Customer Review</h3>
                <p className="text-[10px] text-dark/45 uppercase tracking-widest font-bold">Featured in our Happy Customer gallery</p>
              </div>

              {reviewSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-500/20 p-4 rounded-xl text-center space-y-2"
                >
                  <span className="text-2xl">🎉</span>
                  <h4 className="font-serif font-bold text-emerald-800 text-sm">Review Submitted Successfully!</h4>
                  <p className="text-[11px] text-emerald-600 font-medium">Thank you for sharing your experience. Your feedback is now live on our home page!</p>
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

      <Footer />
    </div>
  )
}
