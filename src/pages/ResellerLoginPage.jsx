import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'
import { useApp } from '../context/AppContext'

export default function ResellerLoginPage() {
  const { resellers, addReseller, loadingFirestore, products } = useApp()
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [resellerUser, setResellerUser] = useState(null) // holds logged in reseller
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Onboarding Formag
  const [onboardForm, setOnboardForm] = useState({
    boutiqueName: '',
    repName: '',
    email: '',
    phone: '',
    gstin: '',
    annualVolume: '100 - 500 pairs'
  })

  const handleLogin = (e) => {
    e.preventDefault()

    // Check if data is still loading
    if (loadingFirestore) {
      setErrorMsg('Loading reseller data, please wait...')
      return
    }

    // Debug: Log available resellers
    console.log('Available resellers:', resellers)
    console.log('Trying to login with:', { email: loginEmail, password: loginPass })

    // More robust matching with null checks and trimmed string matching
    const match = resellers.find(r => {
      // Safely convert stored email & password to trimmed strings
      const cleanEmail = r.email ? String(r.email).trim().toLowerCase() : ''
      const cleanPassword = r.password !== undefined && r.password !== null ? String(r.password).trim() : ''

      const targetEmail = loginEmail ? loginEmail.trim().toLowerCase() : ''
      const targetPassword = loginPass ? loginPass.trim() : ''

      console.log('Checking reseller:', {
        name: r.name,
        email: r.email,
        password: r.password,
        status: r.status,
        cleanEmail,
        cleanPassword,
        targetEmail,
        targetPassword
      })

      if (!cleanEmail || !cleanPassword) {
        console.log('Skipping reseller due to missing email or password fields')
        return false
      }

      const emailMatch = cleanEmail === targetEmail
      const passwordMatch = cleanPassword === targetPassword

      console.log('Match results:', { emailMatch, passwordMatch })

      return emailMatch && passwordMatch
    })

    if (match) {
      console.log('Login successful for:', match)
      console.log('Reseller ID:', match.id)
      // Ensure the reseller has all required fields including ID
      const completeReseller = {
        ...match,
        id: match.id || match.docId, // Explicitly include ID or fallback to docId
        representative: match.representative || match.name,
        phone: match.phone || '+91 99000 12345'
      }
      console.log('Complete reseller object:', completeReseller)
      setResellerUser(completeReseller)
      setErrorMsg('')
    } else {
      console.log('No matching reseller found')
      console.log('Available emails:', resellers.map(r => r.email).filter(Boolean))
      setErrorMsg('Invalid reseller credentials. Access denied.')
    }
  }

  const handleOnboardSubmit = async (e) => {
    e.preventDefault()

    // Check if email already exists
    if (resellers.some(r => r.email.toLowerCase() === onboardForm.email.toLowerCase())) {
      setErrorMsg('An application or account with this email already exists.')
      return
    }

    const newReseller = {
      id: 'reseller_' + Date.now().toString(),
      name: onboardForm.boutiqueName,
      representative: onboardForm.repName,
      email: onboardForm.email,
      password: 'ResellerTempPass123', // temporary default password
      phone: onboardForm.phone,
      gstin: onboardForm.gstin,
      volume: onboardForm.annualVolume,
      status: 'Pending', // pending admin approval!
      payouts: '₹0',
      payoutRequests: []
    }

    await addReseller(newReseller)
    setSuccessMsg('Your application has been registered successfully! Admin review in progress.')
    setErrorMsg('')

    // Reset form
    setOnboardForm({
      boutiqueName: '',
      repName: '',
      email: '',
      phone: '',
      gstin: '',
      annualVolume: '100 - 500 pairs'
    })

    // Switch tab
    setTimeout(() => {
      setSuccessMsg('')
      setTab('login')
    }, 4500)
  }

  return (
    <div className="bg-cream min-h-screen text-dark flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex-1 w-full">
        {resellerUser ? (
          /* ─── RESELLER EXCLUSIVE PORTAL DASHBOARD ─── */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Header banner */}
            <div className="bg-white border border-dark/5 p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-serif text-3xl font-bold">{resellerUser.name}</h2>
                  <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-full ${resellerUser.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                    {resellerUser.status}
                  </span>
                </div>
                <p className="text-xs text-dark/50">Representative: {resellerUser.representative} · Email: {resellerUser.email}</p>
                <p className="text-xs text-blue-600 font-mono mt-1">Reseller ID: {resellerUser.id || 'NOT SET'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log('Current resellerUser:', resellerUser)
                    alert(`Reseller ID: ${resellerUser.id || 'NOT SET'}\nName: ${resellerUser.name}\nEmail: ${resellerUser.email}`)
                  }}
                  className="text-xs font-bold tracking-widest border border-blue-500 text-blue-600 px-4 py-2.5 hover:bg-blue-50 transition-colors"
                >
                  DEBUG INFO
                </button>
                <button
                  onClick={() => setResellerUser(null)}
                  className="text-xs font-bold tracking-widest border border-dark/25 px-5 py-2.5 hover:bg-cream transition-colors"
                >
                  DISCONNECT PORTAL
                </button>
              </div>
            </div>

            {resellerUser.status === 'Pending' ? (
              <div className="bg-amber-50/50 border border-amber-200/50 p-8 text-center space-y-4">
                <span className="text-2xl">⏳</span>
                <h3 className="font-serif text-xl font-bold text-amber-800">Your Reseller Application is Under Review</h3>
                <p className="text-xs text-dark/60 max-w-md mx-auto leading-relaxed">
                  Your boutique profile is currently being audited by our verification registry. Wholesale inventory allocation is restricted during review. We will contact you at {resellerUser.phone}.
                </p>
              </div>
            ) : (
              /* Approved active reseller workspace */
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">

                {/* Product Link Sharing */}
                <div className="space-y-6">
                  <div className="border-b border-dark/5 pb-4">
                    <h3 className="font-serif text-xl font-bold">Product Link Sharing</h3>
                    <p className="text-xs text-dark/40">Share product links with your referral code to earn {resellerUser.commissionValue}% commission on sales.</p>
                  </div>

                  {/* Products Grid */}
                  <div className="space-y-4">
                    {/* Search and Filter */}
                    <div className="bg-white border border-dark/5 p-4 rounded shadow-sm">
                      <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full border border-dark/10 px-3 py-2 text-sm rounded outline-none focus:border-gold-500"
                            onChange={(e) => {
                              const searchTerm = e.target.value.toLowerCase()
                              const productCards = document.querySelectorAll('[data-product-card]')
                              productCards.forEach(card => {
                                const productName = card.getAttribute('data-product-name').toLowerCase()
                                const productCategory = card.getAttribute('data-product-category').toLowerCase()
                                if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                                  card.style.display = 'flex'
                                } else {
                                  card.style.display = 'none'
                                }
                              })
                            }}
                          />
                        </div>
                        <select
                          className="border border-dark/10 px-3 py-2 text-sm rounded outline-none focus:border-gold-500"
                          onChange={(e) => {
                            const filterCategory = e.target.value
                            const productCards = document.querySelectorAll('[data-product-card]')
                            productCards.forEach(card => {
                              const productCategory = card.getAttribute('data-product-category')
                              if (filterCategory === 'all' || productCategory === filterCategory) {
                                card.style.display = 'flex'
                              } else {
                                card.style.display = 'none'
                              }
                            })
                          }}
                        >
                          <option value="all">All Categories</option>
                          <option value="Kolhapuri Chappal">Kolhapuri Chappal</option>
                          <option value="Jewellery">Jewellery</option>
                        </select>
                      </div>
                    </div>

                    {/* Inventory Products */}
                    {products.map(product => (
                      <div
                        key={`inv-${product.id}`}
                        data-product-card
                        data-product-name={product.name}
                        data-product-category={product.category}
                        className="bg-white border border-dark/5 p-5 flex gap-5 rounded shadow-[0_2px_15px_rgba(26,18,8,0.01)]"
                      >
                        <div className="relative">
                          <img
                            src={product.image || product.img || product.images?.[0] || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80'}
                            alt={product.name}
                            className="w-24 h-24 object-cover border border-dark/5 rounded"
                          />
                          {product.badge && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                              {product.badge}
                            </span>
                          )}
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[8px] px-1 py-0.5 rounded font-bold">
                            RETAIL
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-serif text-base font-bold">{product.name}</h4>
                              <div className="text-right">
                                <p className="text-sm font-bold text-blue-700">
                                  Customer Pays: ₹{(product.price + Math.round((product.price * parseFloat(resellerUser.commissionValue || 10)) / 100)).toLocaleString()}
                                </p>
                                <p className="text-xs font-bold text-emerald-700">
                                  You Earn: ₹{Math.round((product.price * parseFloat(resellerUser.commissionValue || 10)) / 100).toLocaleString()}
                                </p>
                                <p className="text-xs text-dark/50">Base: ₹{product.price.toLocaleString()} + {resellerUser.commissionValue}%</p>
                              </div>
                            </div>
                            <p className="text-xs text-dark/50 mb-3">
                              Category: {product.category} • Commission: {resellerUser.commissionValue}% • Stock: {product.stock || 'Available'}
                            </p>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const referralLink = `${window.location.origin}/product?id=${product.id}&ref=${resellerUser.id}`
                                  navigator.clipboard.writeText(referralLink).then(() => {
                                    alert('Referral link copied to clipboard!')
                                  }).catch(() => {
                                    const textArea = document.createElement('textarea')
                                    textArea.value = referralLink
                                    document.body.appendChild(textArea)
                                    textArea.select()
                                    document.execCommand('copy')
                                    document.body.removeChild(textArea)
                                    alert('Referral link copied to clipboard!')
                                  })
                                }}
                                className="bg-blue-500 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-blue-400 transition-colors"
                              >
                                📋 Copy Link
                              </button>
                              <button
                                onClick={() => {
                                  const referralLink = `${window.location.origin}/product?id=${product.id}&ref=${resellerUser.id}`
                                  const commission = Math.round((product.price * parseFloat(resellerUser.commissionValue || 10)) / 100)
                                  const customerPrice = product.price + commission
                                  const message = `🌟 Check out this amazing ${product.name}! 

💰 Only ₹${customerPrice.toLocaleString()} - handcrafted with premium quality
✨ ${product.category} | ${product.badge || 'Premium Quality'}

Shop now: ${referralLink}

#SamarthaCraft #HandmadeInIndia #PremiumQuality`
                                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
                                  window.open(whatsappUrl, '_blank')
                                }}
                                className="bg-green-500 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-green-400 transition-colors"
                              >
                                📱 WhatsApp
                              </button>
                              <button
                                onClick={() => {
                                  window.open(`/product?id=${product.id}&ref=${resellerUser.id}`, '_blank')
                                }}
                                className="bg-gray-500 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-400 transition-colors"
                              >
                                👁️ Preview
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Link Generator */}
                  <div className="bg-gradient-to-r from-gold-50 to-yellow-50 border border-gold-200 p-6 rounded-lg">
                    <h4 className="font-medium mb-4 text-gold-800">Quick Link Generator</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gold-700 mb-2">Product ID or URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border border-gold-300 px-3 py-2 text-sm rounded outline-none focus:border-gold-500 bg-white"
                            id="productInput"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('productInput')
                              const value = input.value.trim()
                              if (!value) {
                                alert('Please enter a product ID or URL')
                                return
                              }

                              // Extract product ID from URL or use direct ID
                              let productId = value
                              if (value.includes('product?id=')) {
                                productId = value.split('product?id=')[1].split('&')[0]
                              }

                              const referralLink = `${window.location.origin}/product?id=${productId}&ref=${resellerUser.id}`

                              // Copy to clipboard
                              navigator.clipboard.writeText(referralLink).then(() => {
                                alert('Referral link copied to clipboard!')
                                input.value = '' // Clear input
                              }).catch(() => {
                                // Fallback for older browsers
                                const textArea = document.createElement('textarea')
                                textArea.value = referralLink
                                document.body.appendChild(textArea)
                                textArea.select()
                                document.execCommand('copy')
                                document.body.removeChild(textArea)
                                alert('Referral link copied to clipboard!')
                                input.value = '' // Clear input
                              })
                            }}
                            className="bg-gold-500 text-dark px-4 py-2 text-sm font-medium rounded hover:bg-gold-400 transition-colors"
                          >
                            Generate & Copy
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded text-xs border border-gold-200">
                        <p className="font-medium mb-1 text-gold-800">How it works:</p>
                        <ul className="space-y-1 text-gold-700">
                          <li>• Click "Copy Link" on any product above for instant sharing</li>
                          <li>• Use "WhatsApp" button to share with pre-written message</li>
                          <li>• Or enter any product ID manually in the generator above</li>
                          <li>• Earn {resellerUser.commissionValue}% commission on every sale through your links</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sales Tips */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-6 rounded-lg">
                    <h4 className="font-medium mb-4 text-indigo-800">💡 Sales Tips & Best Practices</h4>
                    <div className="space-y-3 text-sm text-indigo-700">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">📱</span>
                        <div>
                          <p className="font-medium">Share on WhatsApp Status</p>
                          <p className="text-xs">Post product images with your referral links on WhatsApp status for maximum reach</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">👥</span>
                        <div>
                          <p className="font-medium">Target the Right Audience</p>
                          <p className="text-xs">Share Kolhapuri Chappals with fashion enthusiasts, Jewellery with wedding planners</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">⏰</span>
                        <div>
                          <p className="font-medium">Best Sharing Times</p>
                          <p className="text-xs">Share during evening hours (6-9 PM) when people are most active on social media</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">💬</span>
                        <div>
                          <p className="font-medium">Personal Touch</p>
                          <p className="text-xs">Add your personal recommendation: "I personally love this design!" increases conversion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bulk Checkout Box */}
                <div>
                  {/* Commission Summary */}
                  <div className="bg-white border border-dark/5 p-6 rounded shadow-sm mb-6">
                    <h4 className="font-medium mb-4">Commission Summary</h4>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">₹{(resellerUser.margin || 0).toLocaleString()}</p>
                        <p className="text-xs text-green-700">Total Earned</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{resellerUser.commissionValue}%</p>
                        <p className="text-xs text-blue-700">Commission Rate</p>
                      </div>
                    </div>

                    {/* Recent Commissions */}
                    <div className="border-t pt-4">
                      <h5 className="text-sm font-medium mb-3">Recent Commissions</h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                          <span>Order #SM-ORD-9041</span>
                          <span className="font-medium text-green-600">+₹1,850</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                          <span>Order #SM-ORD-9038</span>
                          <span className="font-medium text-green-600">+₹2,400</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                          <span>Order #SM-ORD-9035</span>
                          <span className="font-medium text-green-600">+₹3,200</span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert('Detailed commission history feature coming soon!')}
                        className="w-full mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        View Full History
                      </button>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded shadow-sm mb-6">
                    <h5 className="text-sm font-medium mb-3 text-purple-800">This Month's Performance</h5>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white p-3 rounded">
                        <p className="text-lg font-bold text-purple-600">12</p>
                        <p className="text-xs text-purple-700">Links Shared</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="text-lg font-bold text-purple-600">5</p>
                        <p className="text-xs text-purple-700">Sales Made</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-white p-2 rounded text-center">
                      <p className="text-xs text-purple-600">Conversion Rate: <span className="font-bold">41.7%</span></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        ) : (
          /* ─── RESELLER LOGIN & APPLY TABS ─── */
          <div className="max-w-md mx-auto">
            {/* Tabs selector */}
            <div className="flex border-b border-dark/10 mb-8">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 text-center py-3 text-xs font-bold tracking-widest transition-colors ${tab === 'login' ? 'border-b-2 border-gold-500 text-gold-600' : 'text-dark/45 hover:text-dark'
                  }`}
              >
                RESELLER PORTAL LOGIN
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 text-center py-3 text-xs font-bold tracking-widest transition-colors ${tab === 'register' ? 'border-b-2 border-gold-500 text-gold-600' : 'text-dark/45 hover:text-dark'
                  }`}
              >
                APPLY AS RESELLER
              </button>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 mb-6 font-medium rounded-xs">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 mb-6 font-medium rounded-xs">
                {successMsg}
              </div>
            )}

            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                /* 1. Reseller Login Form */
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border border-dark/5 p-8 shadow-sm"
                >
                  <form onSubmit={handleLogin} className="space-y-5">
                    <h3 className="font-serif text-lg font-bold border-b border-dark/5 pb-3">Reseller Portal Sign In</h3>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">PARTNER EMAIL</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">SECURITY ACCESS PASS</label>
                      <input
                        type="password"
                        required
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingFirestore}
                      className="w-full bg-dark text-white text-xs font-bold tracking-widest py-3.5 hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingFirestore ? 'LOADING RESELLER DATA...' : 'ENTER SECURE PORTAL'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* 2. Onboarding Application Form */
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border border-dark/5 p-8 shadow-sm"
                >
                  <form onSubmit={handleOnboardSubmit} className="space-y-4">
                    <h3 className="font-serif text-lg font-bold border-b border-dark/5 pb-3">Reseller Onboarding Registration</h3>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">BOUTIQUE/STORE NAME</label>
                      <input
                        type="text"
                        required
                        value={onboardForm.boutiqueName}
                        onChange={e => setOnboardForm({ ...onboardForm, boutiqueName: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">REPRESENTATIVE NAME</label>
                      <input
                        type="text"
                        required
                        value={onboardForm.repName}
                        onChange={e => setOnboardForm({ ...onboardForm, repName: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">BOUTIQUE EMAIL ID</label>
                      <input
                        type="email"
                        required
                        value={onboardForm.email}
                        onChange={e => setOnboardForm({ ...onboardForm, email: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">MOBILE CONTACT</label>
                      <input
                        type="tel"
                        required
                        value={onboardForm.phone}
                        onChange={e => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">GSTIN/TAX REGISTRATION</label>
                        <input
                          type="text"
                          required
                          value={onboardForm.gstin}
                          onChange={e => setOnboardForm({ ...onboardForm, gstin: e.target.value })}
                          className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-1">EXPECTED ANNUAL VOLUME</label>
                        <select
                          value={onboardForm.annualVolume}
                          onChange={e => setOnboardForm({ ...onboardForm, annualVolume: e.target.value })}
                          className="w-full bg-cream/10 border border-dark/15 px-3.5 py-2.5 text-xs outline-none focus:border-gold-500 transition-colors cursor-pointer"
                        >
                          <option>50 - 100 pairs</option>
                          <option>100 - 500 pairs</option>
                          <option>500+ pairs</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold-500 text-white text-xs font-bold tracking-widest py-3.5 hover:bg-gold-600 transition-colors"
                    >
                      SUBMIT ONBOARDING PACKET
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
