import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function Navbar({ dark = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const {
    cart,
    wishlist,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    addToCart,
    removeFromCart,
    updateCartQty,
    removeFromWishlist,
    userProfile
  } = useApp()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menus/drawers on page navigate
  useEffect(() => {
    setMobileMenuOpen(false)
    setCartOpen(false)
    setWishlistOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'SHOP', href: '/shop' },
    { label: 'KOLHAPURI CHAPPAL', href: '/shop?category=Kolhapuri%20Footwear' },
    { label: 'JEWELLERY', href: '/shop?category=Temple%20Jewellery' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'RESELLER LOGIN', href: '/reseller-login' },
  ]

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cart.reduce((total, item) => {
    const priceStr = String(item.price || '0')
    const numericPrice = parseFloat(priceStr.replace(/[^\d]/g, '')) || 0
    return total + (numericPrice * item.quantity)
  }, 0)

  const handleCheckout = () => {
    if (!userProfile) {
      alert('Please login first to proceed to checkout.')
      setCartOpen(false)
      navigate('/login')
      return
    }
    setCartOpen(false)
    navigate('/checkout')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="group flex items-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              src="/logo.png"
              alt="Samartha Craft Studio"
              className="h-16 sm:h-22 w-auto object-contain mix-blend-multiply transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              // Custom logic to check active route
              const isActive = location.pathname === link.href || 
                               (link.href.includes('?') && location.pathname + location.search === link.href)
              
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative text-xs font-semibold tracking-widest transition-colors duration-300 group ${
                    dark && !scrolled ? 'text-white/80 hover:text-white' : 'text-dark/70 hover:text-dark'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${
                    dark && !scrolled ? 'bg-white' : 'bg-gold-500'
                  }`} />
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute -bottom-1 left-0 right-0 h-[1.5px] ${
                        dark && !scrolled ? 'bg-white' : 'bg-gold-500'
                      }`}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop Right Side Icons */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Wishlist Icon with Badge */}
            <motion.button
              onClick={() => setWishlistOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative transition-colors duration-300 p-1.5 ${
                dark && !scrolled ? 'text-white/80 hover:text-white' : 'text-dark/70 hover:text-dark'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-dark font-sans font-bold text-[9px] flex items-center justify-center rounded-full ring-2 ring-cream">
                  {wishlist.length}
                </span>
              )}
            </motion.button>

            {/* Cart Icon with Badge */}
            <motion.button
              onClick={() => setCartOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative transition-colors duration-300 p-1.5 ${
                dark && !scrolled ? 'text-white/80 hover:text-white' : 'text-dark/70 hover:text-dark'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {cartTotalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-dark text-white font-sans font-bold text-[9px] flex items-center justify-center rounded-full ring-2 ring-cream">
                  {cartTotalItems}
                </span>
              )}
            </motion.button>

            {/* User Profile */}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors duration-300 ${
                  userProfile?.avatar ? 'p-0.5' : 'p-1.5'
                } ${
                  dark && !scrolled ? 'text-white/80 hover:text-white' : 'text-dark/70 hover:text-dark'
                }`}
              >
                {userProfile?.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-gold-500/35 bg-stone-100"
                  />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu & Icon Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Wishlist Button Mobile */}
            <button
              onClick={() => setWishlistOpen(true)}
              className={`relative p-1.5 ${dark && !scrolled ? 'text-white' : 'text-dark'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gold-500 text-dark text-[8px] font-bold flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button Mobile */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-1.5 ${dark && !scrolled ? 'text-white' : 'text-dark'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {cartTotalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-dark text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 transition-colors ${
                dark && !scrolled ? 'text-white hover:text-white/80' : 'text-dark hover:text-dark/70'
              }`}
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold font-sans">✕</span>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-cream border-b border-dark/5 shadow-lg z-40 py-6 px-6 lg:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-semibold tracking-widest text-dark hover:text-gold-600 transition-colors py-2 border-b border-dark/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 mt-2">
              <Link to="/login" className="w-full text-center bg-dark text-white py-2.5 text-xs font-bold tracking-widest">
                USER PROFILE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CART SLIDE-IN DRAWER ─── */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !checkoutSuccess && setCartOpen(false)}
              className="absolute inset-0 bg-[#1a1208]/60 backdrop-blur-xs"
            />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-dark/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-dark">Shopping Bag</h3>
                    <span className="text-xs bg-dark/5 text-dark/65 px-2 py-0.5 rounded-full font-bold">
                      {cartTotalItems}
                    </span>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-dark/45 hover:text-dark text-lg font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {checkoutSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 text-3xl animate-bounce">
                        ✓
                      </div>
                      <h4 className="font-serif text-xl font-bold text-dark">Order Confirmed!</h4>
                      <p className="text-xs text-dark/50 max-w-xs">
                        Thank you for your order. An invitation to track your customized luxury packaging batch has been sent to your email.
                      </p>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20">
                      <span className="text-4xl text-dark/30">✦</span>
                      <div>
                        <h4 className="font-serif text-base font-bold text-dark mb-1">Your Shopping Bag is Empty</h4>
                        <p className="text-xs text-dark/40 max-w-[200px]">Discover our masterpiece handcrafted collections to fill it.</p>
                      </div>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="bg-dark text-white text-xs font-bold tracking-widest px-6 py-3 hover:bg-gold-600 transition-colors"
                      >
                        BROWSE SHOP
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-dark/5">
                          <img
                            src={item.images?.[0] || item.image || item.img || item.imageUrls?.[0]}
                            alt={item.name}
                            className="w-20 h-20 object-cover border border-dark/5 rounded bg-stone-50"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-bold text-dark font-serif line-clamp-1">{item.name}</h4>
                                <button
                                  onClick={() => removeFromCart(item.id, item.size)}
                                  className="text-[10px] text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                              <p className="text-[10px] text-dark/40 mt-0.5">
                                Category: {item.category} {item.size ? `· Size: IND ${item.size}` : ''}
                                {item.resellerName && (
                                  <span className="block text-blue-600 font-medium mt-1">
                                    👤 Recommended by {item.resellerName}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              {/* Qty controller */}
                              <div className="flex items-center border border-dark/10 rounded overflow-hidden bg-cream/10">
                                <button
                                  onClick={() => updateCartQty(item.id, item.size, -1)}
                                  className="px-2 py-0.5 text-xs text-dark/50 hover:bg-dark/5"
                                >
                                  -
                                </button>
                                <span className="px-3 text-xs font-bold text-dark">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQty(item.id, item.size, 1)}
                                  className="px-2 py-0.5 text-xs text-dark/50 hover:bg-dark/5"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs font-bold text-gold-700">
                                {typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer summary */}
                {!checkoutSuccess && cart.length > 0 && (
                  <div className="bg-[#faf8f5] p-6 pb-[90px] md:pb-6 border-t border-dark/5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-dark/60">
                        <span>Bag Subtotal</span>
                        <span>₹{cartSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-dark/60">
                        <span>Express Delivery</span>
                        <span className="text-emerald-600 font-semibold uppercase">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-dark pt-2 border-t border-dark/5">
                        <span>Estimated Total</span>
                        <span>₹{cartSubtotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-dark text-white py-4 text-xs font-bold tracking-widest hover:bg-gold-600 transition-colors shadow-md"
                    >
                      PROCEED TO SECURE CHECKOUT
                    </button>
                    <p className="text-[10px] text-center text-dark/40 font-medium">
                      🔒 Secure payment options · Authenticity certificate guaranteed
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── WISHLIST SLIDE-IN DRAWER ─── */}
      <AnimatePresence>
        {wishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
              className="absolute inset-0 bg-[#1a1208]/60 backdrop-blur-xs"
            />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-dark/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-dark">My Wishlist</h3>
                    <span className="text-xs bg-gold-500/10 text-gold-600 border border-gold-500/20 px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="text-dark/45 hover:text-dark text-lg font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {wishlist.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20">
                      <span className="text-4xl text-gold-500/60">♥</span>
                      <div>
                        <h4 className="font-serif text-base font-bold text-dark mb-1">Your Wishlist is Empty</h4>
                        <p className="text-xs text-dark/40 max-w-[200px]">Save your favorite masterpiece creations here for later purchase.</p>
                      </div>
                      <button
                        onClick={() => setWishlistOpen(false)}
                        className="border border-dark/20 text-dark text-xs font-bold tracking-widest px-6 py-3 hover:bg-cream hover:border-dark transition-colors"
                      >
                        EXPLORE COLLECTIONS
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-dark/5">
                          <img
                            src={item.images?.[0] || item.image || item.img || item.imageUrls?.[0]}
                            alt={item.name}
                            className="w-20 h-20 object-cover border border-dark/5 rounded bg-stone-50"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-bold text-dark font-serif line-clamp-1">{item.name}</h4>
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="text-[10px] text-dark/40 hover:text-red-500 transition-colors"
                                >
                                  ✕ Remove
                                </button>
                              </div>
                              <p className="text-[10px] text-gold-600 mt-0.5 font-semibold">
                                {typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}
                              </p>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => {
                                  addToCart(item, 8)
                                  removeFromWishlist(item.id)
                                }}
                                className="flex-1 bg-dark text-white text-[10px] py-2 font-bold tracking-widest hover:bg-gold-600 transition-all text-center"
                              >
                                ADD TO BAG
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer close */}
                <div className="bg-[#faf8f5] p-6 pb-[90px] md:pb-6 border-t border-dark/5">
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="w-full border border-dark/20 text-dark py-3.5 text-xs font-bold tracking-widest hover:bg-cream hover:border-dark transition-colors"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
