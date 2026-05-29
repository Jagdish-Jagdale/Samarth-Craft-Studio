import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

// Initial Datasets for full statefulness
const initialProducts = [
  {
    id: 1,
    name: 'The Royal Gold Kolhapuri',
    sku: 'SM-KOL-001',
    category: 'Kolhapuri Chappaloo',
    collection: 'Royal Atelier',
    subCategory: 'Royal Atelier',
    price: 18500,
    discount: 10,
    statusColor: 'green',
    sizes: { 6: 5, 7: 8, 8: 3, 9: 12, 10: 6, 11: 4, 12: 2 },
    stock: 40,
    badge: 'LIMITED EDITION',
    description: 'Imperial hand-braided tan sandals with royal gold-thread embroidery and natural vegetable-tanned buffalo leather cushioning.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80']
  },
  {
    id: 2,
    name: 'Midnight Zardosi Silk Jutti',
    sku: 'SM-JUT-082',
    category: 'Kolhapuri Chappal',
    collection: 'Heritage Earth',
    subCategory: 'Heritage Earth',
    price: 12400,
    discount: 0,
    statusColor: 'yellow',
    sizes: { 6: 2, 7: 0, 8: 4, 9: 1, 10: 0, 11: 3, 12: 1 },
    stock: 11,
    badge: 'NEW ARRIVAL',
    description: 'Generational midnight black silk footwear with hand-dyed dark outlines and premium comfort-cushioned soles.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80']
  },
  {
    id: 3,
    name: 'Ancient Indigo Terracotta Sandal',
    sku: 'SM-TER-042',
    category: 'Kolhapuri Chappal',
    collection: 'Heritage Earth',
    subCategory: 'Heritage Earth',
    price: 8500,
    discount: 15,
    statusColor: 'red',
    sizes: { 6: 1, 7: 2, 8: 0, 9: 0, 10: 1, 11: 0, 12: 0 },
    stock: 4,
    badge: 'CLEARANCE SALE',
    description: 'Hand-tooled organic indigo vegetable leather sandal with anti-slip crepe outsole and fine border-stitch finish.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80']
  },
  {
    id: 4,
    name: '24K Polki Kundan Necklace',
    sku: 'SM-JWL-991',
    category: 'Jewellery',
    collection: 'Imperial Gems',
    subCategory: 'Imperial Gems',
    price: 145000,
    discount: 5,
    statusColor: 'green',
    weight: '45g',
    gemstone: 'Polki Diamond, Ruby',
    metal: '24K Gold',
    stock: 3,
    badge: 'LIMITED EDITION',
    description: 'Exquisite 24K gold temple necklace with hand-laid Polki raw diamonds, Burmese rubies, and premium green spinels.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80']
  },
  {
    id: 5,
    name: 'Temple Craft Ruby Bangles',
    sku: 'SM-JWL-882',
    category: 'Jewellery',
    collection: 'Royal Atelier',
    subCategory: 'Royal Atelier',
    price: 78000,
    discount: 0,
    statusColor: 'yellow',
    weight: '28g',
    gemstone: 'Natural Ruby, Emerald',
    metal: '22K Gold',
    stock: 1,
    badge: 'BEST SELLER',
    description: 'Set of two detailed gold bangles depicting historic carvings from western ghat shrines, clad with deep natural rubies.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80']
  },
  {
    id: 6,
    name: 'Heritage Filigree Ring',
    sku: 'SM-JWL-103',
    category: 'Jewellery',
    collection: 'Imperial Gems',
    subCategory: 'Imperial Gems',
    price: 32000,
    discount: 0,
    statusColor: 'green',
    weight: '12g',
    gemstone: 'Basra Pearl',
    metal: '18K Gold',
    stock: 8,
    badge: 'TOP SELLING',
    description: 'Fine filigree ring in 18K yellow gold, featuring an authentic central Basra saltwater pearl.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80']
  }
]

const initialOrders = [
  { id: 'SM-ORD-9041', customer: 'Priya Sharma', date: '17 May 2026', total: 18500, paymentStatus: 'Paid', orderStatus: 'Delivered', items: 'The Royal Gold Kolhapuri (Qty: 1)' },
  { id: 'SM-ORD-9042', customer: 'Aditya Birla', date: '16 May 2026', total: 145000, paymentStatus: 'Paid', orderStatus: 'Processing', items: '24K Polki Kundan Necklace (Qty: 1)' },
  { id: 'SM-ORD-9043', customer: 'Meera Nair', date: '15 May 2026', total: 24800, paymentStatus: 'Pending', orderStatus: 'Processing', items: 'Midnight Zardosi Silk Jutti (Qty: 2)' },
  { id: 'SM-ORD-9044', customer: 'Rajesh Khanna', date: '14 May 2026', total: 32000, paymentStatus: 'Paid', orderStatus: 'In Transit', items: 'Heritage Filigree Ring (Qty: 1)' },
  { id: 'SM-ORD-9045', customer: 'Kavita Iyer', date: '12 May 2026', total: 8500, paymentStatus: 'Refunded', orderStatus: 'Canceled', items: 'Ancient Indigo Terracotta Sandal (Qty: 1)' }
]

const initialPayouts = [
  { id: 1, reseller: 'Ananya Mehta', business: 'Mehta Luxury Crafts', balance: 42000, amount: 25000, bank: 'HDFC Bank - A/C ...8842', date: '17 May 2026', status: 'Pending' },
  { id: 2, reseller: 'Sneha Deshmukh', business: 'Ethnic Glitz Jewellery', balance: 17000, amount: 15000, bank: 'ICICI Bank - A/C ...1093', date: '15 May 2026', status: 'Paid' },
  { id: 3, reseller: 'Ananya Mehta', business: 'Mehta Luxury Crafts', balance: 67000, amount: 20000, bank: 'HDFC Bank - A/C ...8842', date: '10 May 2026', status: 'Paid' }
]

const initialInquiries = [
  { id: 1, name: 'Aarav Singhania', email: 'aarav.singh@gmail.com', topic: 'Custom Bridal Order', message: 'Hello, I wanted to inquire if you can design custom wedding Kolhapuris with silver filigree instead of gold thread for a size 41. Please let me know the pricing and timeline.', date: '17 May 2026', status: 'Unread' },
  { id: 2, name: 'Divya Rao', email: 'divya.rao@outlook.com', topic: 'Bulk Order / Reselling', message: 'I run a boutique online jewelry store based in Delhi and would love to bulk order your Imperial Gems collection. What are the terms for reseller margins?', date: '16 May 2026', status: 'Replied' },
  { id: 3, name: 'Karan Malhotra', email: 'karan.m@gmail.com', topic: 'Shipping Delay', message: 'Hi, my order ID SM-ORD-9044 is showing as in transit since the last 4 days. Can I get an update on the delivery schedule?', date: '15 May 2026', status: 'Resolved' }
]

const initialPayments = [
  { txnId: 'TXN-8941094', customer: 'Priya Sharma', method: 'UPI (GPay)', date: '17 May 2026', amount: 18500, status: 'Successful' },
  { txnId: 'TXN-8941095', customer: 'Aditya Birla', method: 'Credit Card (HDFC)', date: '16 May 2026', amount: 145000, status: 'Successful' },
  { txnId: 'TXN-8941096', customer: 'Meera Nair', method: 'UPI (PhonePe)', date: '15 May 2026', amount: 24800, status: 'Pending' },
  { txnId: 'TXN-8941097', customer: 'Rajesh Khanna', method: 'Net Banking (SBI)', date: '14 May 2026', amount: 32000, status: 'Successful' },
  { txnId: 'TXN-8941098', customer: 'Kavita Iyer', method: 'Debit Card (ICICI)', date: '12 May 2026', amount: 8500, status: 'Successful' }
]

const topAteliers = [
  { name: 'Kanchipuram Silk', sub: 'Master Weaver Union', value: '₹4.8L' },
  { name: 'Bagru Handblock', sub: 'Terracotta Collective', value: '₹3.2L' },
  { name: 'Agra Leather', sub: 'Bespoke Workshop', value: '₹2.9L' },
]

function RevenueChart() {
  const chartData = [
    { x: 0, y: 60 }, { x: 1, y: 45 }, { x: 2, y: 70 }, { x: 3, y: 55 },
    { x: 4, y: 80 }, { x: 5, y: 65 }, { x: 6, y: 95 },
  ]
  const projData = [
    { x: 5, y: 65 }, { x: 6, y: 95 }, { x: 7, y: 88 }, { x: 8, y: 110 },
  ]

  const w = 400, h = 140
  const xScale = (i) => (i / 6) * (w - 40) + 20
  const yScale = (v) => h - (v / 110) * (h - 20) - 10

  const pathD = chartData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ')
  const projD = projData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9982a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9982a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 50, 80, 110].map(v => (
        <line key={v} x1={20} y1={yScale(v)} x2={w - 20} y2={yScale(v)} stroke="rgba(26,18,8,0.08)" strokeWidth={1} />
      ))}
      <path
        d={`${pathD} L ${xScale(6)} ${h} L ${xScale(0)} ${h} Z`}
        fill="url(#chartGrad)"
      />
      <path d={pathD} fill="none" stroke="#c9982a" strokeWidth={2.5} strokeLinecap="round" />
      <path d={projD} fill="none" stroke="#c9982a" strokeWidth={2} strokeDasharray="5,5" strokeLinecap="round" />
      {chartData.map((p, i) => (
        <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={3.5} fill="#c9982a" />
      ))}
    </svg>
  )
}

function BarChart() {
  const bars = [45, 65, 90, 70, 55]
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className={`flex-1 rounded-sm ${i === 2 ? 'bg-gold-400' : 'bg-gold-400/40'}`}
        />
      ))}
    </div>
  )
}

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [activeSubCategory, setActiveSubCategory] = useState('All')

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true'
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // State Management for Interactive Components
  // State Management for Interactive Components (Fully Bound to Firestore)
  const {
    products,
    orders,
    resellers,
    inquiries,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    addReseller,
    updateReseller,
    videoTestimonials,
    addVideoTestimonial,
    deleteVideoTestimonial
  } = useApp()

  const [newVideo, setNewVideo] = useState({
    title: '',
    customerName: '',
    location: '',
    videoUrl: '',
    thumbnailUrl: ''
  })
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false)

  const handleAddVideoTestimonial = async (e) => {
    e.preventDefault()
    if (!newVideo.customerName || !newVideo.videoUrl || !newVideo.title) {
      alert("Please fill in the Customer Name, Video URL, and Title/Review Highlight.")
      return
    }

    setIsSubmittingVideo(true)

    // Generate a default thumbnail if none provided
    let finalThumbnail = newVideo.thumbnailUrl.trim()
    if (!finalThumbnail) {
      const fallbacks = [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80'
      ]
      finalThumbnail = fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }

    const payload = {
      id: 'vid-' + Date.now(),
      title: newVideo.title.trim(),
      customerName: newVideo.customerName.trim(),
      location: newVideo.location.trim() || 'India',
      videoUrl: newVideo.videoUrl.trim(),
      thumbnailUrl: finalThumbnail,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    try {
      const success = await addVideoTestimonial(payload)
      if (success) {
        alert("Video testimonial published successfully!")
        setNewVideo({
          title: '',
          customerName: '',
          location: '',
          videoUrl: '',
          thumbnailUrl: ''
        })
      } else {
        alert("Failed to publish video testimonial. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmittingVideo(false)
    }
  }

  const [payouts, setPayouts] = useState(initialPayouts)
  const [payments, setPayments] = useState(initialPayments)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)

  // Reseller Onboarding State
  const [showResellerForm, setShowResellerForm] = useState(false)
  const [newReseller, setNewReseller] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    commissionModel: 'Percentage (%)',
    commissionValue: '10'
  })

  // Reseller Editing State
  const [showEditResellerModal, setShowEditResellerModal] = useState(false)
  const [editingReseller, setEditingReseller] = useState(null)
  const [editResellerData, setEditResellerData] = useState({
    name: '',
    business: '',
    location: '',
    email: '',
    phone: '',
    password: '',
    commissionModel: 'Percentage (%)',
    commissionValue: '10',
    status: 'Active'
  })

  // Payment Configuration State
  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = localStorage.getItem('samartha_payment_config')
    return saved ? JSON.parse(saved) : {
      codExtraCharge: 50,
      shippingRates: {
        local: 10,
        state: 40,
        national: 100
      }
    }
  })

  // Homepage Settings State
  const [homepageSettings, setHomepageSettings] = useState(() => {
    const saved = localStorage.getItem('samartha_homepage_settings')
    return saved ? JSON.parse(saved) : {
      hero: {
        title: 'SAMARTHA',
        subtitle: 'Handcrafted Heritage',
        description: 'Timeless Indian artistry meets modern elegance. Discover authentic Kolhapuri chappals and heritage jewelry, crafted by master artisans.',
        backgroundImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80',
        ctaText: 'EXPLORE COLLECTION'
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

  const handleCreateResellerAccount = async () => {
    if (!newReseller.name || !newReseller.email || !newReseller.password) {
      alert("Please fill required fields (Name, Email, Password)");
      return;
    }

    // Construct DB payload
    const newPartnerData = {
      id: Date.now(), // Add unique ID
      name: newReseller.name,
      business: `${newReseller.name} Enterprise`,
      representative: newReseller.name, // Add representative field
      location: 'Online',
      status: 'Active',
      sales: 0,
      margin: 0,
      joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      email: newReseller.email,
      phone: newReseller.phone,
      password: newReseller.password, // Add password field
      commissionModel: newReseller.commissionModel,
      commissionValue: newReseller.commissionValue
    }

    // Save to Firestore Context
    console.log('Creating reseller with data:', newPartnerData)
    const success = await addReseller(newPartnerData)

    if (success) {
      console.log('Reseller created successfully')
      alert(`Reseller partner account securely created for ${newReseller.name}! Credentials established.`);
      setShowResellerForm(false);
      setNewReseller({
        name: '',
        email: '',
        phone: '',
        password: '',
        commissionModel: 'Percentage (%)',
        commissionValue: '10'
      });
    } else {
      console.log('Failed to create reseller')
      alert("Failed to create reseller account. Please try again.");
    }
  }

  // Start editing reseller
  const startEditReseller = (reseller) => {
    setEditingReseller(reseller)
    setEditResellerData({
      name: reseller.name || '',
      business: reseller.business || '',
      location: reseller.location || '',
      email: reseller.email || '',
      phone: reseller.phone || '',
      password: reseller.password || '',
      commissionModel: reseller.commissionModel || 'Percentage (%)',
      commissionValue: reseller.commissionValue || '10',
      status: reseller.status || 'Active'
    })
    setShowEditResellerModal(true)
  }

  // Handle updating reseller
  const handleUpdateReseller = async () => {
    if (!editResellerData.name || !editResellerData.business) {
      alert("Please fill required fields (Name, Business Name)");
      return;
    }

    const updatedData = {
      ...editResellerData,
      originalName: editingReseller.name // Keep track of original name for finding the document
    }

    const success = await updateReseller(editingReseller.id, updatedData)

    if (success) {
      alert(`Reseller details updated successfully for ${editResellerData.name}!`);
      setShowEditResellerModal(false);
      setEditingReseller(null);
      setEditResellerData({
        name: '',
        business: '',
        location: '',
        email: '',
        phone: '',
        password: '',
        commissionModel: 'Percentage (%)',
        commissionValue: '10',
        status: 'Active'
      });
    } else {
      alert("Failed to update reseller details. Please try again.");
    }
  }

  // Modals / Form overlays
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [localPreviews, setLocalPreviews] = useState([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [customSubCategory, setCustomSubCategory] = useState('')
  const [isCustomSubCategoryActive, setIsCustomSubCategoryActive] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Kolhapuri Chappal',
    subCategory: 'Heritage Earth',
    price: '',
    discount: 0,
    stock: 5,
    sizes: { 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5 },
    badge: 'None',
    description: '',
    imageInput: '',
    weight: '',
    metal: '',
    gemstone: '',
    colorVariants: [
      {
        id: 1,
        colorName: 'Default',
        colorCode: '#8B4513',
        images: []
      }
    ]
  })

  // Start Editing product helper
  const startEditProduct = (p) => {
    // CRITICAL: Clear ALL upload states before loading new product
    // localPreviews and colorVariantPreviews are UPLOAD-ONLY states
    // They must NEVER be pre-populated with existing product images (which may be Base64)
    setLocalPreviews([])
    setColorVariantPreviews({})
    setActiveColorVariant(0)

    setIsEditing(true)
    setEditingProductId(p.id)

    const cat = p.category || 'Kolhapuri Chappal'
    const sub = p.subCategory || p.collection || ''

    let dropdownVal = sub
    let isCustom = false
    let customVal = ''

    if (cat === 'Kolhapuri Chappal') {
      if (['Mens', 'Womens', 'Kids'].includes(sub)) {
        dropdownVal = sub
        isCustom = false
      } else {
        dropdownVal = 'custom'
        isCustom = true
        customVal = sub
      }
    } else {
      if (['Necklace', 'Rings', 'Earrings', 'Earings', 'Mangalsutra'].includes(sub)) {
        dropdownVal = sub === 'Earings' ? 'Earrings' : sub
        isCustom = false
      } else {
        dropdownVal = 'custom'
        isCustom = true
        customVal = sub
      }
    }

    // Get existing Firebase Storage URLs (filter out any Base64 that may exist from old saves)
    const existingFirebaseUrls = (p.images || []).filter(url =>
      url && typeof url === 'string' && url.startsWith('https://')
    )
    const singleUrl = (p.image || p.img || '')
    const fallbackUrl = singleUrl.startsWith('https://') ? singleUrl : ''
    const existingUrls = existingFirebaseUrls.length > 0
      ? existingFirebaseUrls
      : (fallbackUrl ? [fallbackUrl] : [])

    setNewProduct({
      name: p.name || '',
      category: cat,
      subCategory: dropdownVal,
      price: p.price || '',
      discount: p.discount || 0,
      stock: p.stock || 5,
      sizes: p.sizes || { 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5 },
      badge: p.badge || 'None',
      description: p.description || '',
      // Store existing Firebase URLs for display — used if no new upload happens
      imageInput: existingUrls.join('\n'),
      weight: p.weight || '',
      metal: p.metal || '',
      gemstone: p.gemstone || '',
      // Store existing URLs in colorVariants for display only
      colorVariants: p.colorVariants
        ? p.colorVariants.map(v => ({
          ...v,
          // Filter out Base64 from existing variant images
          images: (v.images || []).filter(url => url && url.startsWith('https://'))
        }))
        : [
          {
            id: 1,
            colorName: 'Default',
            colorCode: '#8B4513',
            images: existingUrls
          }
        ]
    })

    setIsCustomSubCategoryActive(isCustom)
    setCustomSubCategory(customVal)

    // NOTE: localPreviews and colorVariantPreviews stay EMPTY
    // They will only be populated when the admin uploads NEW images
    // Existing images are preserved via newProduct.colorVariants[].images and newProduct.imageInput

    setShowAddProductModal(true)
  }

  // Clear modal and edit state
  const resetProductForm = () => {
    setIsEditing(false)
    setEditingProductId(null)
    setShowAddProductModal(false)
    setLocalPreviews([])
    setNewProduct({
      name: '',
      category: 'Kolhapuri Chappal',
      subCategory: 'Womens',
      price: '',
      discount: 0,
      stock: 5,
      sizes: { 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5 },
      badge: 'None',
      description: '',
      imageInput: '',
      weight: '',
      metal: '',
      gemstone: '',
      colorVariants: [
        {
          id: 1,
          colorName: 'Default',
          colorCode: '#8B4513',
          images: []
        }
      ]
    })
    setIsCustomSubCategoryActive(false)
    setCustomSubCategory('')
    setActiveColorVariant(0)
    setColorVariantPreviews({})
  }

  // Search/Filters State
  const [invSearch, setInvSearch] = useState('')
  const [invCategoryFilter, setInvCategoryFilter] = useState('All')

  // Ring Size Chart State
  const [showRingSizeChart, setShowRingSizeChart] = useState(false)

  // Kolhapuri Chappal Size Chart State
  const [showChappalSizeChart, setShowChappalSizeChart] = useState(false)

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Color Variants State
  const [activeColorVariant, setActiveColorVariant] = useState(0)
  const [colorVariantPreviews, setColorVariantPreviews] = useState({})

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === 'samartha123@gmail.com' && password === 'samartha123') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Invalid email or password.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  // ─── FIREBASE STORAGE IMAGE UPLOAD PIPELINE ───
  // Compress image file → upload to Firebase Storage → return download URL
  // NO Base64 anywhere. Firestore only receives lightweight https:// URLs.
  const uploadImageToStorage = async (file) => {
    const { storage } = await import('../firebase')
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const imageCompression = (await import('browser-image-compression')).default

    // Step 1: Compress the image (output is a File/Blob, NOT base64)
    const isHeic =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif')

    let fileToUpload = file
    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 2000,
        initialQuality: 0.92,
        fileType: 'image/webp',
        useWebWorker: true,
        maxSizeMB: 1.5,
      })
      fileToUpload = compressed
    } catch (err) {
      console.error('Compression failed, uploading original:', err)
      if (isHeic) {
        throw new Error(
          'Could not process this HEIC file.\n\nTo fix: On your iPhone, go to Settings → Camera → Formats → set to "Most Compatible" (JPEG). Then retake or re-export the photo.'
        )
      }
      // If compression fails, try uploading original
    }

    // Step 2: Upload compressed file to Firebase Storage
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const ext = 'webp'
    const storagePath = `products/${timestamp}_${randomId}.${ext}`
    const storageRef = ref(storage, storagePath)

    await uploadBytes(storageRef, fileToUpload, { contentType: 'image/webp' })

    // Step 3: Get the permanent public download URL
    const downloadUrl = await getDownloadURL(storageRef)

    // Strict validation — must be a Firebase Storage URL
    if (!downloadUrl.startsWith('https://')) {
      throw new Error('Invalid download URL returned from Firebase Storage')
    }

    console.log('✅ Uploaded to Firebase Storage:', downloadUrl)
    return downloadUrl
  }

  // Legacy compressImage kept only for homepage settings (non-product images)
  const compressImage = async (file, maxWidth = 2000, quality = 0.92) => {
    const imageCompression = (await import('browser-image-compression')).default
    const options = {
      maxWidthOrHeight: maxWidth,
      initialQuality: quality,
      fileType: 'image/webp',
      useWebWorker: true,
      maxSizeMB: 1.5,
    }
    try {
      const compressedFile = await imageCompression(file, options)
      return await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = () => reject(new Error('Failed to read compressed image'))
        reader.readAsDataURL(compressedFile)
      })
    } catch (err) {
      console.error('Image compression failed:', err)
      throw new Error(`Could not process "${file.name}". Please try a different image.`)
    }
  }

  // Master product image upload — uploads to Firebase Storage, stores URLs (NOT base64)
  const handleLocalImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files || files.length === 0) return
    e.target.value = ''

    setIsUploadingImages(true)
    const results = []
    for (const file of files) {
      try {
        const url = await uploadImageToStorage(file)
        results.push(url)
      } catch (error) {
        console.error('Error uploading file:', file.name, error)
        alert(`⚠️ Could not upload "${file.name}":\n\n${error.message}`)
      }
    }
    setIsUploadingImages(false)

    if (results.length > 0) {
      // Replace previews entirely — never append stale old images
      setLocalPreviews(results)
      // Sync the active color variant's images
      const activeVariant = newProduct.colorVariants?.[activeColorVariant]
      if (activeVariant) {
        setColorVariantPreviews(prev => ({
          ...prev,
          [activeVariant.id]: results
        }))
      }
      console.log('FINAL IMAGES (Firebase Storage URLs):', results)
    }
  }

  const removeLocalImage = (idx) => {
    setLocalPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  // Color Variants Functions
  const addColorVariant = () => {
    const newVariant = {
      id: Date.now(),
      colorName: '',
      colorCode: '#000000',
      images: []
    }
    setNewProduct(prev => ({
      ...prev,
      colorVariants: [...(prev.colorVariants || []), newVariant]
    }))
  }

  const removeColorVariant = (variantId) => {
    if ((newProduct.colorVariants || []).length <= 1) {
      alert('At least one color variant is required')
      return
    }
    setNewProduct(prev => ({
      ...prev,
      colorVariants: (prev.colorVariants || []).filter(v => v.id !== variantId)
    }))
    // Remove previews for this variant
    setColorVariantPreviews(prev => {
      const updated = { ...prev }
      delete updated[variantId]
      return updated
    })
    // Reset active variant if needed
    if (activeColorVariant >= (newProduct.colorVariants || []).length - 1) {
      setActiveColorVariant(0)
    }
  }

  const updateColorVariant = (variantId, field, value) => {
    setNewProduct(prev => ({
      ...prev,
      colorVariants: (prev.colorVariants || []).map(v =>
        v.id === variantId ? { ...v, [field]: value } : v
      )
    }))
  }

  const handleColorVariantImageUpload = async (variantId, files) => {
    // Upload each file to Firebase Storage — returns https:// URLs, never base64
    const promises = Array.from(files).map(file => uploadImageToStorage(file))

    try {
      const uploadedUrls = await Promise.all(promises)
      // Replace variant images entirely with newly uploaded Firebase Storage URLs
      setColorVariantPreviews(prev => ({
        ...prev,
        [variantId]: uploadedUrls
      }))
      // If this is the active variant, also sync localPreviews
      const activeVariant = newProduct.colorVariants?.[activeColorVariant]
      if (activeVariant && activeVariant.id === variantId) {
        setLocalPreviews(uploadedUrls)
      }
      console.log('FINAL IMAGES (variant Firebase Storage URLs):', uploadedUrls)
    } catch (error) {
      console.error('Error uploading variant images:', error)
      alert('Error uploading images: ' + error.message)
    }
  }

  const removeColorVariantImage = (variantId, imageIndex) => {
    setColorVariantPreviews(prev => ({
      ...prev,
      [variantId]: prev[variantId]?.filter((_, i) => i !== imageIndex) || []
    }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    // ─── DETERMINE FINAL IMAGE URLS ───
    // Priority order (strict — no Base64 ever reaches Firestore):
    // 1. Newly uploaded Firebase Storage URLs from colorVariantPreviews (upload happened this session)
    // 2. Newly uploaded Firebase Storage URLs from localPreviews (upload happened this session)
    // 3. Existing Firebase Storage URLs from newProduct.colorVariants[0].images (edit mode, no new upload)
    // 4. Existing Firebase Storage URLs from newProduct.imageInput (edit mode fallback)
    // 5. Default placeholder (last resort)

    // Collect new uploads from colorVariantPreviews — these are always Firebase URLs
    const newVariantUploads = colorVariantPreviews[newProduct.colorVariants?.[0]?.id] || []
    const newLegacyUploads = localPreviews

    // Collect existing Firebase URLs from the product's stored colorVariants
    const existingVariantUrls = (newProduct.colorVariants?.[0]?.images || [])
      .filter(url => url && typeof url === 'string' && url.startsWith('https://'))

    // Collect existing Firebase URLs from imageInput field
    const existingInputUrls = (newProduct.imageInput || '')
      .split('\n')
      .map(x => x.trim())
      .filter(url => url && url.startsWith('https://'))

    let imageUrls = []

    if (newVariantUploads.length > 0) {
      // New upload via color variant section — use these
      imageUrls = [...newVariantUploads]
    } else if (newLegacyUploads.length > 0) {
      // New upload via legacy section — use these
      imageUrls = [...newLegacyUploads]
    } else if (existingVariantUrls.length > 0) {
      // Edit mode, no new upload — keep existing Firebase URLs from colorVariants
      imageUrls = [...existingVariantUrls]
    } else if (existingInputUrls.length > 0) {
      // Edit mode fallback — keep existing Firebase URLs from imageInput
      imageUrls = [...existingInputUrls]
    } else {
      // Last resort placeholder
      imageUrls = ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80']
    }

    // Deduplicate
    imageUrls = [...new Set(imageUrls)].filter(Boolean)

    // STRICT VALIDATION: Block any Base64 from reaching Firestore
    const base64Found = imageUrls.some(url => typeof url === 'string' && url.startsWith('data:'))
    if (base64Found) {
      alert('⚠️ Image upload error: Base64 data detected instead of Firebase Storage URL.\n\nPlease re-upload your images using the upload button and try again.')
      console.error('🚨 BASE64 BLOCKED — imageUrls:', imageUrls.map(u => u.substring(0, 80)))
      return
    }

    console.log('✅ FINAL IMAGES (Firebase Storage URLs):', imageUrls)

    // Process color variants — use new uploads if available, else keep existing Firebase URLs
    const processedColorVariants = (newProduct.colorVariants || []).map((variant, index) => {
      // New uploads for this variant
      const newUploads = colorVariantPreviews[variant.id] || []
      if (newUploads.length > 0) {
        return { ...variant, images: newUploads }
      }
      // Keep existing Firebase URLs (filter out any Base64)
      const existingClean = (variant.images || []).filter(url => url && url.startsWith('https://'))
      // First variant fallback: use main imageUrls if no variant images
      if (index === 0 && existingClean.length === 0) {
        return { ...variant, images: imageUrls }
      }
      return { ...variant, images: existingClean }
    })

    const finalSubCategory = newProduct.subCategory === 'custom'
      ? (customSubCategory ? customSubCategory.trim() : 'Custom Collection')
      : newProduct.subCategory

    let productObj;
    if (isEditing) {
      const parsedStock = newProduct.category === 'Kolhapuri Chappal'
        ? Object.values(newProduct.sizes || {}).reduce((a, b) => Number(a) + Number(b), 0)
        : Number(newProduct.stock)

      productObj = {
        ...products.find(p => p.id === editingProductId),
        name: newProduct.name,
        category: newProduct.category,
        collection: finalSubCategory,
        subCategory: finalSubCategory,
        price: Number(newProduct.price),
        discount: Number(newProduct.discount),
        stock: parsedStock,
        sizes: newProduct.sizes,
        badge: newProduct.badge === 'None' ? null : newProduct.badge,
        description: newProduct.description,
        images: imageUrls,
        image: imageUrls[0],
        img: imageUrls[0],
        colorVariants: processedColorVariants,
        weight: newProduct.category === 'Jewellery' && newProduct.weight ? newProduct.weight.trim() : null,
        metal: newProduct.category === 'Jewellery' && newProduct.metal ? newProduct.metal.trim() : null,
        gemstone: newProduct.category === 'Jewellery' && newProduct.gemstone ? newProduct.gemstone.trim() : null
      }
    } else {
      const parsedStock = newProduct.category === 'Kolhapuri Chappal'
        ? Object.values(newProduct.sizes || {}).reduce((a, b) => Number(a) + Number(b), 0)
        : Number(newProduct.stock)

      productObj = {
        id: Date.now(),
        name: newProduct.name,
        category: newProduct.category,
        collection: finalSubCategory,
        subCategory: finalSubCategory,
        price: Number(newProduct.price),
        discount: Number(newProduct.discount),
        statusColor: 'green',
        stock: parsedStock,
        sizes: newProduct.sizes,
        badge: newProduct.badge === 'None' ? null : newProduct.badge,
        description: newProduct.description,
        images: imageUrls,
        image: imageUrls[0],
        img: imageUrls[0],
        colorVariants: processedColorVariants,
        weight: newProduct.category === 'Jewellery' && newProduct.weight ? newProduct.weight.trim() : null,
        metal: newProduct.category === 'Jewellery' && newProduct.metal ? newProduct.metal.trim() : null,
        gemstone: newProduct.category === 'Jewellery' && newProduct.gemstone ? newProduct.gemstone.trim() : null
      }
    }

    console.log('Product object being saved:', {
      id: productObj.id,
      name: productObj.name,
      images: productObj.images,
      colorVariants: productObj.colorVariants?.map(v => ({
        id: v.id,
        colorName: v.colorName,
        imageCount: v.images?.length || 0,
        firstImage: v.images?.[0]
      }))
    })

    try {
      await addProduct(productObj)
      if (productObj.category) {
        setActiveNav(productObj.category)
      }
      if (productObj.subCategory) {
        setActiveSubCategory(productObj.subCategory)
      }
      resetProductForm()
    } catch (error) {
      console.error('Error adding product:', error)
      alert(error.message || 'Error saving product. Please try again.')
    }
  }

  // Size wise inventory editor
  const handleSizeStockChange = async (productId, size, value) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      const updatedSizes = {
        ...product.sizes,
        [size]: Number(value)
      }
      const updatedProduct = {
        ...product,
        sizes: updatedSizes,
        stock: Object.values(updatedSizes).reduce((a, b) => Number(a) + Number(b), 0)
      }
      await addProduct(updatedProduct)
    }
  }

  // Jewellery stock changer
  const handleJewelleryStockChange = async (productId, amt) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      const nextStock = Math.max(0, (product.stock || 0) + amt)
      const updatedProduct = {
        ...product,
        stock: nextStock,
        statusColor: nextStock > 5 ? 'green' : nextStock > 0 ? 'yellow' : 'red'
      }
      await addProduct(updatedProduct)
    }
  }

  // Order status editor mapping to context operations
  const handleOrderStatusChange = async (orderId, nextStatus) => {
    await updateOrderStatus(orderId, nextStatus)
  }

  // Payment status editor mapping to context operations
  const handlePaymentStatusChange = async (orderId, nextStatus) => {
    await updatePaymentStatus(orderId, nextStatus)
  }

  // Payment Configuration Handlers
  const handleSavePaymentConfig = () => {
    localStorage.setItem('samartha_payment_config', JSON.stringify(paymentConfig))
    alert('Payment configuration saved successfully!')
  }

  const handleSaveShippingRates = () => {
    localStorage.setItem('samartha_payment_config', JSON.stringify(paymentConfig))
    alert('Shipping rates saved successfully!')
  }

  // Homepage Settings Handlers
  const handleSaveHomepageSettings = () => {
    localStorage.setItem('samartha_homepage_settings', JSON.stringify(homepageSettings))
    alert('Homepage settings saved successfully! Refresh the homepage to see changes.')
  }

  const downloadInvoice = (order) => {
    if (!order) return
    const invoiceWindow = window.open('', '_blank')
    if (!invoiceWindow) {
      alert('Pop-up blocked! Please allow popups to view the invoice.')
      return
    }

    const orderItems = Array.isArray(order.items)
      ? order.items
      : [{ name: order.items || 'Handcrafted Curation Selection', category: 'Handcrafted Heritage', price: order.total, quantity: 1 }]

    const itemsRows = orderItems.map(item => {
      const priceVal = parseFloat(String(item.price).replace(/[^\d]/g, '')) || 0
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; font-family: sans-serif;">
            <div style="font-weight: 600; color: #1a1208;">${item.name}</div>
            <div style="font-size: 10px; color: #8c7853;">${item.category || ''} ${item.size ? `· Size IND ${item.size}` : ''}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; text-align: center; font-family: sans-serif;">${item.quantity || 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; text-align: right; font-weight: 600; color: #1a1208; font-family: sans-serif;">₹${priceVal.toLocaleString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; text-align: right; font-weight: 600; color: #c9982a; font-family: sans-serif;">₹${(priceVal * (item.quantity || 1)).toLocaleString()}</td>
        </tr>
      `
    }).join('')

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Samartha Craft Studio - Invoice ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
            body {
              background-color: #fff;
              color: #1a1208;
              font-family: 'Outfit', sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #c9982a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-title {
              font-family: 'Playfair Display', serif;
              font-size: 26px;
              font-weight: bold;
              letter-spacing: 1px;
              margin: 0;
            }
            .invoice-label {
              font-family: 'Playfair Display', serif;
              font-size: 32px;
              color: #c9982a;
              text-align: right;
              font-style: italic;
              margin: 0;
            }
            .meta-section {
              width: 100%;
              margin-bottom: 40px;
              font-size: 13px;
              line-height: 1.6;
            }
            .meta-section td {
              vertical-align: top;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-table th {
              background-color: #1a1208;
              color: #fff;
              text-transform: uppercase;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 1px;
              padding: 12px;
              text-align: left;
            }
            .summary-table {
              width: 100%;
              margin-top: 20px;
              border-top: 1px solid #1a1208;
              padding-top: 15px;
            }
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                padding: 0;
                margin: 0;
                width: 100%;
                max-width: 100%;
              }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <h1 class="company-title">SAMARTHA CRAFT STUDIO</h1>
                <div style="font-size: 11px; color: #666; margin-top: 5px;">
                  Udyam Reg: <strong>${order.udyamReg || 'UDYAM-MH-15-0128444'}</strong><br/>
                  GST No: <strong>27CKEPJ8626F1Z1</strong><br/>
                  Founder: Shri Nikhil Shivaji Jadhav (Est. 2019)
                </div>
              </td>
              <td style="text-align: right;">
                <div style="font-size: 12px; color: #1a1208; margin-top: 10px;">
                  Invoice No: <strong>${order.id}</strong><br/>
                  Date: ${order.date}
                </div>
              </td>
            </tr>
          </table>

          <table class="meta-section">
            <tr>
              <td style="width: 50%;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 15px; margin: 0 0 10px 0; color: #c9982a; border-left: 2px solid #c9982a; padding-left: 8px;">CURATED CUSTOMER DETAIL</h3>
                <strong>${order.customerName || order.customer || 'Bespoke Customer'}</strong><br/>
                Mobile: ${order.phone || '+91 99000 12345'}<br/>
                Delivery Destination:<br/>
                ${order.address || 'Handcrafted Curation Cluster, India'}
              </td>
              <td style="width: 50%; text-align: right;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 15px; margin: 0 0 10px 0; color: #c9982a;">PAYMENT REGISTRY</h3>
                Method: <strong>${order.paymentMethod || 'Paid Securely Online'}</strong><br/>
                Status: <span style="color: #10b981; font-weight: bold;">Paid / COD Confirmed</span><br/>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>Handcrafted Curation</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="font-size: 11px; color: #888; width: 60%;">
                * Handcrafted with certified vegetable-tanned full-grain leather. Certified premium brass components.<br/>
                * Natural dyes and traditional manual artisan stitching - slight shade variations reflect authenticity.
              </td>
              <td style="width: 40%; text-align: right;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #666;">Bag Subtotal</td>
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right;">₹${order.subtotal ? order.subtotal.toLocaleString() : order.total.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #666;">Artisan Packaging</td>
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right; color: #10b981;">Complimentary</td>
                  </tr>
                  ${order.shippingCharge && order.shippingCharge > 0 ? `
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #666;">Shipping Charges</td>
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right;">₹${order.shippingCharge.toLocaleString()}</td>
                  </tr>` : ''}
                  ${order.codCharge && order.codCharge > 0 ? `
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #666;">COD Handling Charges</td>
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right; color: #f59e0b;">₹${order.codCharge.toLocaleString()}</td>
                  </tr>` : ''}
                  <tr style="border-top: 1px solid #c9982a;">
                    <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #c9982a;">Total Invoice</td>
                    <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #c9982a; text-align: right;">₹${order.total.toLocaleString()}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div class="footer">
            <p>Thank you for supporting traditional Indian artisans in Patan Kadoli Cluster, Kolhapur.</p>
            <p>Samartha Craft Studio © 2019 - 2026. Certified Authentic Handcrafted Kolhapuris and Temple Jewellery.</p>
            <button class="no-print" onclick="window.print()" style="margin-top: 20px; background: #1a1208; color: #fff; border: none; padding: 10px 20px; font-family: sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">Print Official Invoice</button>
          </div>
        </body>
      </html>
    `)
    invoiceWindow.document.close()
  }

  // Reseller approval
  const approveReseller = (id) => {
    const updated = resellers.map(r => r.id === id ? { ...r, status: 'Active' } : r)
    setResellers(updated)
    syncResellersToStorage(updated)
  }

  // Reseller payout approval
  const handlePayoutStatus = (id, newStatus) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: newStatus } : p))
  }

  // Support inquiry resolver
  const resolveInquiry = (id) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'Resolved' } : i))
  }

  // Payout management functions
  const viewResellerDetails = (payout) => {
    const details = `
Reseller: ${payout.resellerName}
Total Pending: ₹${payout.totalPending.toLocaleString()}
Orders: ${payout.orders.length}

Recent Orders:
${payout.orders.slice(-5).map(order =>
      `• ${order.orderId} - ${order.date} - ₹${order.amount} (${order.productName})`
    ).join('\n')}
    `
    alert(details)
  }

  const processPayment = async (payout) => {
    const confirmed = confirm(`Process payment of ₹${payout.totalPending.toLocaleString()} to ${payout.resellerName}?`)
    if (!confirmed) return

    try {
      // Mark all commissions as paid for this reseller
      const updatedOrders = orders.map(order => {
        if (order.commissions && Array.isArray(order.commissions)) {
          const updatedCommissions = order.commissions.map(commission => {
            if (commission.resellerId === payout.resellerId && commission.status === 'Pending') {
              return { ...commission, status: 'Paid', paidDate: new Date().toISOString() }
            }
            return commission
          })
          return { ...order, commissions: updatedCommissions }
        }
        return order
      })

      // Update orders in context (this would normally update Firestore)
      // For now, we'll just show success message
      alert(`Payment of ₹${payout.totalPending.toLocaleString()} processed successfully for ${payout.resellerName}!`)

      // In a real implementation, you would:
      // 1. Update all related orders in Firestore
      // 2. Create a payout record
      // 3. Send notification to reseller

    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Failed to process payment. Please try again.')
    }
  }

  const generatePayoutReport = () => {
    // Calculate monthly data
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.date)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const resellerData = {}
    monthlyOrders.forEach(order => {
      if (order.commissions && Array.isArray(order.commissions)) {
        order.commissions.forEach(commission => {
          const resellerId = commission.resellerId
          if (!resellerData[resellerId]) {
            resellerData[resellerId] = {
              name: commission.resellerName,
              totalSales: 0,
              totalCommission: 0,
              orderCount: 0,
              products: []
            }
          }
          resellerData[resellerId].totalSales += commission.itemTotal
          resellerData[resellerId].totalCommission += commission.commissionAmount
          resellerData[resellerId].orderCount += 1
          resellerData[resellerId].products.push({
            name: commission.productName,
            amount: commission.commissionAmount,
            orderId: order.id
          })
        })
      }
    })

    generatePayoutPDF(resellerData, currentMonth, currentYear)
  }

  const generatePayoutPDF = (resellerData, month, year) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']

    const reportWindow = window.open('', '_blank')
    if (!reportWindow) {
      alert('Pop-up blocked! Please allow popups to generate the report.')
      return
    }

    const resellerRows = Object.values(resellerData).map(reseller => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; font-weight: 600;">${reseller.name}</td>
        <td style="padding: 12px; text-align: center;">${reseller.orderCount}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600;">₹${reseller.totalSales.toLocaleString()}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #059669;">₹${reseller.totalCommission.toLocaleString()}</td>
      </tr>
    `).join('')

    const totalSales = Object.values(resellerData).reduce((sum, r) => sum + r.totalSales, 0)
    const totalCommissions = Object.values(resellerData).reduce((sum, r) => sum + r.totalCommission, 0)

    reportWindow.document.write(`
      <html>
        <head>
          <title>Reseller Commission Report - ${monthNames[month]} ${year}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #c9982a; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #c9982a; margin-bottom: 10px; }
            .report-title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .report-period { color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f9fafb; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
            .summary { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
            .summary-item { background: white; padding: 15px; border-radius: 6px; }
            .summary-value { font-size: 24px; font-weight: bold; color: #c9982a; }
            .summary-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">SAMARTHA CRAFT STUDIO</div>
            <div class="report-title">Reseller Commission Report</div>
            <div class="report-period">${monthNames[month]} ${year}</div>
          </div>

          <div class="summary">
            <h3 style="margin-top: 0;">Monthly Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">₹${totalSales.toLocaleString()}</div>
                <div class="summary-label">Total Sales</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">₹${totalCommissions.toLocaleString()}</div>
                <div class="summary-label">Total Commissions</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${Object.keys(resellerData).length}</div>
                <div class="summary-label">Active Resellers</div>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Reseller Name</th>
                <th style="text-align: center;">Orders</th>
                <th style="text-align: right;">Total Sales</th>
                <th style="text-align: right;">Commission Earned</th>
              </tr>
            </thead>
            <tbody>
              ${resellerRows}
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 40px; color: #6b7280; font-size: 12px;">
            <p>Generated on ${new Date().toLocaleDateString('en-IN')} | Samartha Craft Studio Admin Panel</p>
            <button onclick="window.print()" style="background: #c9982a; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Print Report</button>
          </div>
        </body>
      </html>
    `)
    reportWindow.document.close()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] text-dark flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-dark/5 p-10 rounded-xl shadow-[0_4px_25px_rgba(26,18,8,0.06)]">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold text-gold-600 mb-2">Samartha Admin</h1>
            <p className="text-sm text-dark/50 font-medium">Secure access to your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm text-center rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs text-dark/60 font-semibold tracking-wider mb-2 uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-sm rounded-lg outline-none focus:border-gold-500 transition-colors text-dark placeholder-stone-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-dark/60 font-semibold tracking-wider mb-2 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-sm rounded-lg outline-none focus:border-gold-500 transition-colors text-dark placeholder-stone-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-dark text-white font-bold py-3 text-sm hover:bg-gold-600 transition-colors mt-4 rounded-lg shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Sidebar Menu mapping from the user's provided list
  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      )
    },
    {
      label: 'All Inventory',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      )
    },
    {
      label: 'Kolhapuri Chappal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
      )
    },
    {
      label: 'Jewellery',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L12 4l6 8-6 8-6-8zM12 4v16M6 12h12"></path>
        </svg>
      )
    },
    {
      label: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      )
    },
    {
      label: 'Resellers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    },
    {
      label: 'Payout Requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      )
    },
    {
      label: 'Inquiries',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      )
    },

    {
      label: 'Payment Configurations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      )
    },
    {
      label: 'Video Testimonials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      label: 'Homepage Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      )
    }
  ]

  // Render Functions for Sub-pages
  const renderDashboardView = () => {
    // 1. Dynamic Total Revenue based on orders
    const completedOrders = orders.filter(o => o.paymentStatus === 'Paid' || o.paymentMethod === 'Pay Online' || o.orderStatus === 'Delivered' || o.paymentMethod?.includes('Online'));
    const totalRevenue = completedOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    // 2. Active Orders
    const activeOrdersCount = orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'In Transit').length;

    // 3. Average Basket
    const avgBasket = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

    // 4. Recent Transactions from real orders
    const recentTransactions = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

    // 5. Dynamic Top Collections (Ateliers) based on inventory
    const collectionStats = {};
    products.forEach(p => {
      const col = p.collection || p.subCategory || 'Other';
      if (!collectionStats[col]) collectionStats[col] = { count: 0, value: 0 };
      collectionStats[col].count += 1;
      collectionStats[col].value += (Number(p.price) || 0);
    });
    const dynamicAteliers = Object.entries(collectionStats)
      .map(([name, stats]) => ({
        name,
        sub: `${stats.count} Products`,
        value: `₹${stats.value.toLocaleString()}`
      }))
      .sort((a, b) => Number(b.value.replace(/[^0-9.-]+/g, "")) - Number(a.value.replace(/[^0-9.-]+/g, "")))
      .slice(0, 3);

    return (
      <div className="space-y-6 lg:space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white border border-dark/5 rounded-xl p-4 lg:p-6 shadow-[0_4px_20px_rgba(26,18,8,0.03)] relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 lg:mb-4 relative z-10">
              <p className="text-[10px] lg:text-[11px] text-dark/55 font-semibold uppercase tracking-wider">TOTAL REVENUE</p>
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-dark/5 flex items-center justify-center text-dark/70 border border-dark/5 font-bold text-sm lg:text-base">₹</div>
            </div>
            <p className="font-serif text-2xl lg:text-3xl font-bold text-dark mb-2">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-1 py-0.5 rounded text-[10px]">↑</span> +12.4% this month
            </p>
          </div>

          <div className="bg-white border border-dark/5 rounded-xl p-4 lg:p-6 shadow-[0_4px_20px_rgba(26,18,8,0.03)] relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 lg:mb-4 relative z-10">
              <p className="text-[10px] lg:text-[11px] text-dark/55 font-semibold uppercase tracking-wider">ACTIVE ORDERS</p>
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-dark/5 flex items-center justify-center text-dark/70 border border-dark/5 text-sm lg:text-base">📦</div>
            </div>
            <p className="font-serif text-2xl lg:text-3xl font-bold text-dark mb-2">{activeOrdersCount}</p>
            <p className="text-xs text-dark/40 font-medium">Awaiting shipment & processing</p>
          </div>

          <div className="bg-white border border-dark/5 rounded-xl p-4 lg:p-6 shadow-[0_4px_20px_rgba(26,18,8,0.03)] relative overflow-hidden group sm:col-span-2 lg:col-span-1">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 lg:mb-4 relative z-10">
              <p className="text-[10px] lg:text-[11px] text-dark/55 font-semibold uppercase tracking-wider">AVERAGE BASKET</p>
              <div className="w-16 lg:w-24"><BarChart /></div>
            </div>
            <p className="font-serif text-2xl lg:text-3xl font-bold text-dark mb-2">₹{avgBasket.toLocaleString()}</p>
            <p className="text-xs text-dark/40 font-medium">Per completed order</p>
          </div>
        </div>

        {/* Charts and Side Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="bg-white border border-dark/5 rounded-xl p-4 lg:p-6 shadow-[0_4px_20px_rgba(26,18,8,0.03)] flex flex-col">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="font-bold text-dark text-sm lg:text-base">Revenue Forecast</h3>
              <div className="flex items-center gap-3 lg:gap-5 text-[10px] lg:text-[11px] text-dark/50 font-medium tracking-wide">
                <span className="flex items-center gap-1 lg:gap-2"><span className="w-2 lg:w-3 h-1 bg-gold-600 rounded-full" /> ACTUAL</span>
                <span className="flex items-center gap-1 lg:gap-2"><span className="w-2 lg:w-3 h-1 bg-gold-600/40 rounded-full border border-gold-400/50" /> PROJECTION</span>
              </div>
            </div>
            <div className="flex-1 min-h-[180px] lg:min-h-[200px] w-full">
              <RevenueChart />
            </div>
            <div className="flex justify-between mt-3 lg:mt-4 px-2">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                <span key={d} className="text-[9px] lg:text-[10px] text-dark/40 font-semibold tracking-wider">{d}</span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-dark/5 rounded-xl p-4 lg:p-6 shadow-[0_4px_20px_rgba(26,18,8,0.03)] flex flex-col">
            <h3 className="font-bold text-dark mb-4 lg:mb-6 text-sm lg:text-base">Top Collections</h3>
            <div className="space-y-4 lg:space-y-5 flex-1">
              {dynamicAteliers.map((a, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-dark/10">
                    <img
                      src={`https://images.unsplash.com/photo-${['1544735716', '1558769132', '1606107557'][i]}-${['0cdf7f2fc700', '3cb1aea458c5e', '195-0e29a4b5b4aa'][i]}?w=100&q=80`}
                      className="w-full h-full object-cover grayscale-[0.3]"
                      alt={a.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-dark truncate">{a.name}</p>
                    <p className="text-xs text-dark/40 truncate">{a.sub}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gold-600">{a.value}</p>
                    <p className="text-[9px] text-dark/45 uppercase tracking-wider font-semibold">Inventory Value</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions list */}
        <div className="bg-white border border-dark/5 rounded-xl shadow-[0_4px_20px_rgba(26,18,8,0.03)] p-6">
          <h3 className="font-bold text-dark mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((o, i) => {
              const paymentVal = o.paymentStatus || (o.paymentMethod === 'Pay Online' ? 'Paid' : 'Pending');
              const isPaid = paymentVal === 'Paid';
              return (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-dark/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <div>
                      <p className="text-sm font-semibold text-dark">{o.customer || o.customerName}</p>
                      <p className="text-xs text-dark/40 font-medium">{o.id} · {o.paymentMethod || 'Online'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gold-600">₹{o.total.toLocaleString()}</p>
                    <p className="text-[10px] text-dark/45 font-semibold">{o.date}</p>
                  </div>
                </div>
              )
            })}
            {recentTransactions.length === 0 && (
              <p className="text-xs text-dark/40 text-center py-4">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderAllInventoryView = () => {
    const filteredProducts = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(invSearch.toLowerCase())
      const matchesCategory = invCategoryFilter === 'All' || p.category === invCategoryFilter
      return matchesSearch && matchesCategory
    })

    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-gold-500 text-dark text-sm font-bold px-4 lg:px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gold-400 transition-colors shadow-sm w-full sm:w-auto justify-center sm:justify-start"
            >
              + Add Product
            </button>
            <div className="flex border border-dark/10 rounded-lg overflow-hidden bg-white w-full sm:w-auto">
              {['All', 'Kolhapuri Chappal', 'Jewellery'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setInvCategoryFilter(cat)}
                  className={`px-3 lg:px-4 py-2 text-xs font-semibold flex-1 sm:flex-none ${invCategoryFilter === cat ? 'bg-gold-500 text-dark' : 'text-dark/50 hover:text-dark hover:bg-cream/20'}`}
                >
                  {cat === 'Kolhapuri Chappal' ? 'Kolhapuri' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white border border-dark/10 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark/40"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              value={invSearch}
              onChange={(e) => setInvSearch(e.target.value)}
              className="bg-transparent outline-none w-full sm:w-48 text-dark placeholder-stone-400"
            />
          </div>
        </div>

        <div className="bg-white border border-dark/5 rounded-xl shadow-[0_4px_25px_rgba(26,18,8,0.03)] overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="p-4 space-y-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="border border-dark/10 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={p.images?.[0] || p.image || p.img} className="w-16 h-16 object-cover rounded-lg border border-dark/10" alt={p.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-dark text-sm truncate">{p.name}</h4>
                      <p className="text-xs text-dark/50">{p.category}</p>
                      <p className="text-xs text-gold-600 font-medium">₹{Number(p.price).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark/50">Stock: <span className="font-semibold text-dark">{p.stock}</span></span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditProduct(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-gold-700 bg-gold-50 border border-gold-200 rounded hover:bg-gold-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark/5 bg-[#faf8f5]">
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Collection</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Stock Level</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const stockSum = p.category === 'Kolhapuri Chappal'
                    ? Object.values(p.sizes || {}).reduce((a, b) => a + b, 0)
                    : (p.stock || 0)

                  return (
                    <tr key={p.id} className="border-b border-dark/5 hover:bg-cream/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.images?.[0] || p.image || p.img} className="w-10 h-10 rounded-lg object-cover border border-dark/10" alt="" />
                          <div>
                            <p className="text-sm font-bold text-dark">{p.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-dark/60">{p.category}</td>
                      <td className="px-6 py-4 text-xs font-medium text-dark/40">{p.collection}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gold-600">₹{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stockSum === 0 ? 'bg-red-500' : stockSum < 5 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <span className="text-xs font-semibold text-dark/70">
                            {stockSum} units
                            {p.category === 'Kolhapuri Chappal' && ' (Size-wise)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="px-3 py-1.5 text-[10px] font-bold text-gold-700 border border-gold-200 rounded bg-gold-50 hover:bg-gold-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="px-3 py-1.5 text-[10px] font-bold text-red-600 border border-red-200 rounded bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderKolhapuriView = () => {
    const shoeProducts = products.filter(p => p.category === 'Kolhapuri Chappal')

    // Get unique subcategories dynamically
    const subCategories = ['All', ...new Set(shoeProducts.map(p => p.subCategory || p.collection || 'Womens'))]

    const filteredShoeProducts = shoeProducts.filter(p => {
      const sub = p.subCategory || p.collection || 'Womens'
      return activeSubCategory === 'All' || sub === activeSubCategory
    })

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

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between bg-white border border-dark/5 rounded-xl p-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl text-dark font-bold">Kolhapuri Chappals Curation</h3>
            <p className="text-xs text-dark/50 mt-1">Manage and publish custom handcrafted premium leather footwear.</p>
          </div>
          <button
            onClick={() => {
              setNewProduct({
                name: '',
                category: 'Kolhapuri Chappal',
                subCategory: 'Womens',
                price: '',
                discount: 0,
                stock: 5,
                sizes: { 6: 5, 7: 5, 8: 5, 9: 5, 10: 5 },
                badge: 'None',
                description: '',
                imageInput: ''
              })
              setIsCustomSubCategoryActive(false)
              setCustomSubCategory('')
              setIsEditing(false)
              setEditingProductId(null)
              setShowAddProductModal(true)
            }}
            className="bg-gold-500 hover:bg-gold-400 text-dark text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            + Add Kolhapuri Chappal
          </button>
        </div>

        {/* Subcategory Filters */}
        <div className="flex items-center gap-2 border-b border-dark/5 pb-3 overflow-x-auto">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${activeSubCategory === sub
                  ? 'bg-gold-500 text-dark border-gold-500 shadow-sm'
                  : 'bg-white text-dark/60 border-dark/10 hover:border-dark/20 hover:text-dark'
                }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredShoeProducts.map((p) => {
            return (
              <div key={p.id} className="bg-white border border-dark/5 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <img src={p.images?.[0] || p.image || p.img} className="w-24 h-24 rounded-xl object-cover border border-dark/10" alt={p.name} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] bg-gold-500/10 border border-gold-500/20 text-gold-600 font-semibold px-2 py-0.5 rounded uppercase">{p.collection || p.subCategory}</span>
                    {p.badge && (
                      <span className="text-[10px] bg-dark text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{p.badge}</span>
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-dark mb-1">{p.name}</h4>
                  <p className="text-sm font-bold text-gold-600">
                    ₹{p.price.toLocaleString()} {p.discount > 0 && <span className="text-xs text-red-500 font-medium">({p.discount}% OFF)</span>}
                  </p>
                  <p className="text-xs text-dark/50 mt-2 line-clamp-2 max-w-xl">{p.description}</p>
                </div>

                {/* Sizes breakdown table */}
                <div className="flex gap-2 bg-[#faf8f5] p-3 rounded-lg border border-dark/5">
                  {Object.keys(p.sizes || {}).map((size) => (
                    <div key={size} className="flex flex-col items-center bg-white border border-dark/5 rounded-lg p-2 w-14 text-center">
                      <span className="text-[9px] text-dark/45 font-bold uppercase tracking-wider mb-1">IND {size}</span>
                      <input
                        type="number"
                        min="0"
                        value={p.sizes[size]}
                        onChange={(e) => handleSizeStockChange(p.id, size, e.target.value)}
                        className="bg-transparent border-b border-dark/10 focus:border-gold-600 text-center text-xs font-bold w-8 text-dark outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="flex flex-col gap-2 md:pl-6 border-t md:border-t-0 md:border-l border-dark/5 w-full md:w-auto">
                  <button
                    onClick={() => startEditProduct(p)}
                    className="w-full md:w-28 px-3 py-2 text-xs font-bold text-gold-700 border border-gold-200 rounded-lg bg-gold-50 hover:bg-gold-100 transition-colors"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="w-full md:w-28 px-3 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Delete Chappal
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Kolhapuri Chappal Size Chart Section */}
        <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
          <div
            className="p-4 lg:p-6 cursor-pointer hover:bg-cream/20 transition-colors"
            onClick={() => setShowChappalSizeChart(!showChappalSizeChart)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-base lg:text-lg text-dark font-bold">Kolhapuri Chappal Size Chart</h3>
                  <p className="text-xs text-dark/50 mt-0.5 hidden sm:block">Standard sizes with international conversions and foot length measurements</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark/40 font-medium hidden sm:inline">
                  {showChappalSizeChart ? 'Hide Chart' : 'View Chart'}
                </span>
                <svg
                  className={`w-4 h-4 lg:w-5 lg:h-5 text-dark/40 transition-transform ${showChappalSizeChart ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {showChappalSizeChart && (
            <div className="border-t border-dark/5 p-4 lg:p-6 bg-cream/10">
              <div className="mb-4">
                <h4 className="font-semibold text-dark text-sm mb-2">How to Measure Foot Length:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-dark/60">
                  <div className="space-y-1">
                    <p>• Place a piece of paper on a flat floor against a wall.</p>
                    <p>• Stand on it with your heel lightly touching the wall.</p>
                  </div>
                  <div className="space-y-1">
                    <p>• Mark the longest part of your foot (tip of the big toe) and measure the distance in cm.</p>
                    <p>• True Kolhapuri chappals stretch slightly and mold to your feet over time.</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gold-50 border-b border-gold-100">
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Our Size</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">India / UK Size</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">US Size</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Foot Length (cm)</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Euro Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chappalSizeChart.map((size, index) => (
                      <tr key={size.our} className={`border-b border-gray-100 hover:bg-gold-25 transition-colors ${index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}`}>
                        <td className="px-3 lg:px-4 py-3 text-sm font-bold text-gold-600">{size.our}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70">{size.indiaUk}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70">{size.us}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70 font-medium">{size.footLength} cm</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70 font-medium">{size.euro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderJewelleryView = () => {
    const jewProducts = products.filter(p => p.category === 'Jewellery')

    // Get unique subcategories dynamically
    const subCategories = ['All', ...new Set(jewProducts.map(p => p.subCategory || p.collection || 'Necklace'))]

    const filteredJewProducts = jewProducts.filter(p => {
      const sub = p.subCategory || p.collection || 'Necklace'
      return activeSubCategory === 'All' || sub === activeSubCategory
    })

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

    return (
      <div className="space-y-6">
        {/* Ring Size Chart Section */}
        <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
          <div
            className="p-4 lg:p-6 cursor-pointer hover:bg-cream/20 transition-colors"
            onClick={() => setShowRingSizeChart(!showRingSizeChart)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-base lg:text-lg text-dark font-bold">Ring Size Chart</h3>
                  <p className="text-xs text-dark/50 mt-0.5 hidden sm:block">Indian sizes with international conversions and measurements</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark/40 font-medium hidden sm:inline">
                  {showRingSizeChart ? 'Hide Chart' : 'View Chart'}
                </span>
                <svg
                  className={`w-4 h-4 lg:w-5 lg:h-5 text-dark/40 transition-transform ${showRingSizeChart ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {showRingSizeChart && (
            <div className="border-t border-dark/5 p-4 lg:p-6 bg-cream/10">
              <div className="mb-4">
                <h4 className="font-semibold text-dark text-sm mb-2">How to Measure Ring Size:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-dark/60">
                  <div className="space-y-1">
                    <p><strong>Method 1 - Existing Ring:</strong></p>
                    <p>• Measure inner diameter of a well-fitting ring</p>
                    <p>• Compare with diameter column below</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Method 2 - Finger Measurement:</strong></p>
                    <p>• Wrap string around finger base</p>
                    <p>• Mark overlap point and measure length</p>
                    <p>• Compare with circumference column</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gold-50 border-b border-gold-100">
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Indian Size</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">US Size</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">UK Size</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Diameter</th>
                      <th className="px-3 lg:px-4 py-3 text-xs font-bold text-dark/70 uppercase tracking-wider">Circumference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ringSizeChart.map((size, index) => (
                      <tr key={size.indian} className={`border-b border-gray-100 hover:bg-gold-25 transition-colors ${index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}`}>
                        <td className="px-3 lg:px-4 py-3 text-sm font-bold text-gold-600">{size.indian}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70">{size.us}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70">{size.uk}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70 font-medium">{size.diameter}</td>
                        <td className="px-3 lg:px-4 py-3 text-sm text-dark/70 font-medium">{size.circumference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 lg:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div className="text-xs text-amber-800">
                    <p className="font-semibold mb-1">Important Notes:</p>
                    <ul className="space-y-0.5 text-amber-700">
                      <li>• Ring sizes can vary by ±0.5 sizes depending on finger width and knuckle size</li>
                      <li>• Measure at room temperature (fingers swell in heat, shrink in cold)</li>
                      <li>• For wide bands (&gt;6mm), consider going up 0.5-1 size</li>
                      <li>• Custom sizing available for all temple jewellery pieces</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between bg-white border border-dark/5 rounded-xl p-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl text-dark font-bold">Temple Jewellery Curation</h3>
            <p className="text-xs text-dark/50 mt-1">Manage and publish custom handcrafted premium temple jewelry.</p>
          </div>
          <button
            onClick={() => {
              setNewProduct({
                name: '',
                category: 'Jewellery',
                subCategory: 'Necklace',
                price: '',
                discount: 0,
                stock: 5,
                sizes: { 38: 5, 39: 5, 40: 5, 41: 5, 42: 5 },
                badge: 'None',
                description: '',
                imageInput: ''
              })
              setIsCustomSubCategoryActive(false)
              setCustomSubCategory('')
              setIsEditing(false)
              setEditingProductId(null)
              setShowAddProductModal(true)
            }}
            className="bg-gold-500 hover:bg-gold-400 text-dark text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            + Add Jewellery
          </button>
        </div>

        {/* Subcategory Filters */}
        <div className="flex items-center gap-2 border-b border-dark/5 pb-3 overflow-x-auto">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${activeSubCategory === sub
                  ? 'bg-gold-500 text-dark border-gold-500 shadow-sm'
                  : 'bg-white text-dark/60 border-dark/10 hover:border-dark/20 hover:text-dark'
                }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJewProducts.map((p) => (
            <div key={p.id} className="bg-white border border-dark/5 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full border-b border-dark/5">
                  <img src={p.images?.[0] || p.image || p.img} className="w-full h-full object-cover grayscale-[0.1]" alt={p.name} />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-dark text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-dark/10 text-gold-600 text-xs font-bold px-2 py-1 rounded">
                    {p.collection || p.subCategory || 'Temple Craft'}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {p.weight && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gold-600"></span>
                          <span className="text-[10px] text-dark/45 font-semibold">{p.weight}</span>
                        </>
                      )}
                    </div>
                    <h4 className="font-serif text-base font-bold text-dark mt-1">{p.name}</h4>
                  </div>

                  <p className="text-xs text-dark/50 line-clamp-3 leading-relaxed">{p.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between mb-4 border-t border-dark/5 pt-3">
                  <span className="text-sm font-bold text-gold-600">
                    ₹{p.price.toLocaleString()} {p.discount > 0 && <span className="text-[10px] text-red-500 font-bold">({p.discount}% OFF)</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.stock > 5 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-dark/70 font-semibold">{p.stock} in Stock</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-dark/5">
                  <span className="text-[10px] text-dark/45 font-bold uppercase">Update Stock</span>
                  <div className="flex items-center bg-[#faf8f5] rounded-lg border border-dark/10 overflow-hidden">
                    <button
                      onClick={() => handleJewelleryStockChange(p.id, -1)}
                      className="px-2.5 py-1 text-xs text-dark/50 hover:bg-cream/45 hover:text-dark font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-dark">{p.stock}</span>
                    <button
                      onClick={() => handleJewelleryStockChange(p.id, 1)}
                      className="px-2.5 py-1 text-xs text-dark/50 hover:bg-cream/45 hover:text-dark font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark/5 gap-2">
                  <button
                    onClick={() => startEditProduct(p)}
                    className="flex-1 px-3 py-2 text-xs font-bold text-gold-700 border border-gold-200 rounded-lg bg-gold-50 hover:bg-gold-100 transition-colors text-center"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex-1 px-3 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderOrdersView = () => {
    // Monthly report generation functions
    const generateMonthlyPDFReport = () => {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const currentDate = new Date().toLocaleDateString();

      // Filter orders for current month
      const currentMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const currentDate = new Date();
        return orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear();
      });

      // Calculate totals
      const totalRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = currentMonthOrders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const paidOrders = currentMonthOrders.filter(o => o.paymentStatus === 'Paid' || o.paymentMethod === 'Pay Online').length;
      const pendingOrders = currentMonthOrders.filter(o => o.paymentStatus === 'Pending').length;

      const reportWindow = window.open('', '_blank');
      if (!reportWindow) {
        alert('Please allow popups to generate the report');
        return;
      }

      const ordersRows = currentMonthOrders.map(order => {
        const displayItems = Array.isArray(order.items)
          ? order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')
          : order.items;

        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px;">${order.id}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px;">${order.customer || order.customerName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px;">${order.date}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px; max-width: 200px; word-wrap: break-word;">${displayItems}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px; text-align: right; font-weight: 600;">₹${order.total.toLocaleString()}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px; text-align: center;">
              <span style="padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; ${(order.paymentStatus === 'Paid' || order.paymentMethod === 'Pay Online')
            ? 'background: #dcfce7; color: #166534;'
            : 'background: #fef3c7; color: #92400e;'
          }">${order.paymentStatus || (order.paymentMethod === 'Pay Online' ? 'Paid' : 'Pending')}</span>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 11px; text-align: center;">${order.orderStatus || order.status}</td>
          </tr>
        `;
      }).join('');

      reportWindow.document.write(`
        <html>
          <head>
            <title>Monthly Orders Report - ${currentMonth}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              body { 
                font-family: 'Inter', sans-serif; 
                margin: 40px; 
                color: #1f2937; 
                line-height: 1.5;
              }
              .header { 
                text-align: center; 
                margin-bottom: 40px; 
                border-bottom: 2px solid #c9982a; 
                padding-bottom: 20px; 
              }
              .company-title { 
                font-size: 28px; 
                font-weight: 700; 
                color: #1a1208; 
                margin: 0; 
                letter-spacing: 1px; 
              }
              .report-title { 
                font-size: 18px; 
                color: #c9982a; 
                margin: 10px 0 5px 0; 
                font-weight: 600; 
              }
              .report-period { 
                font-size: 14px; 
                color: #6b7280; 
                margin: 0; 
              }
              .summary-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 20px; 
                margin: 30px 0; 
              }
              .summary-card { 
                background: #f9fafb; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                padding: 20px; 
                text-align: center; 
              }
              .summary-value { 
                font-size: 24px; 
                font-weight: 700; 
                color: #c9982a; 
                margin: 0; 
              }
              .summary-label { 
                font-size: 12px; 
                color: #6b7280; 
                margin: 5px 0 0 0; 
                text-transform: uppercase; 
                font-weight: 600; 
                letter-spacing: 0.5px; 
              }
              .orders-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 30px; 
                background: white; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                overflow: hidden; 
              }
              .orders-table th { 
                background: #f3f4f6; 
                padding: 12px 8px; 
                text-align: left; 
                font-size: 11px; 
                font-weight: 600; 
                color: #374151; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
                border-bottom: 2px solid #e5e7eb; 
              }
              .footer { 
                margin-top: 40px; 
                text-align: center; 
                font-size: 12px; 
                color: #6b7280; 
                border-top: 1px solid #e5e7eb; 
                padding-top: 20px; 
              }
              @media print {
                @page { size: A4 landscape; margin: 15mm; }
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="company-title">SAMARTHA CRAFT STUDIO</h1>
              <h2 class="report-title">Monthly Orders Report</h2>
              <p class="report-period">${currentMonth} • Generated on ${currentDate}</p>
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <p class="summary-value">₹${totalRevenue.toLocaleString()}</p>
                <p class="summary-label">Total Revenue</p>
              </div>
              <div class="summary-card">
                <p class="summary-value">${totalOrders}</p>
                <p class="summary-label">Total Orders</p>
              </div>
              <div class="summary-card">
                <p class="summary-value">₹${Math.round(avgOrderValue).toLocaleString()}</p>
                <p class="summary-label">Avg Order Value</p>
              </div>
              <div class="summary-card">
                <p class="summary-value">${paidOrders}/${pendingOrders}</p>
                <p class="summary-label">Paid/Pending</p>
              </div>
            </div>

            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th style="text-align: right;">Amount</th>
                  <th style="text-align: center;">Payment</th>
                  <th style="text-align: center;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${ordersRows}
              </tbody>
            </table>

            <div class="footer">
              <p>Samartha Craft Studio © 2019 - 2026 • Authentic Handcrafted Kolhapuris and Temple Jewellery</p>
              <button class="no-print" onclick="window.print()" style="margin-top: 15px; background: #1a1208; color: white; border: none; padding: 10px 20px; font-size: 12px; font-weight: 600; cursor: pointer; border-radius: 4px;">Print Report</button>
            </div>
          </body>
        </html>
      `);
      reportWindow.document.close();
    };

    const generateMonthlyExcelReport = () => {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

      // Filter orders for current month
      const currentMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const currentDate = new Date();
        return orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear();
      });

      // Prepare CSV data
      const csvHeaders = ['Order ID', 'Customer', 'Date', 'Items', 'Subtotal', 'Shipping', 'COD Charge', 'Total', 'Payment Status', 'Payment Method', 'Order Status'];

      const csvRows = currentMonthOrders.map(order => {
        const displayItems = Array.isArray(order.items)
          ? order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join('; ')
          : order.items;

        return [
          order.id,
          order.customer || order.customerName,
          order.date,
          `"${displayItems}"`, // Wrap in quotes to handle commas
          order.subtotal || order.total,
          order.shippingCharge || 0,
          order.codCharge || 0,
          order.total,
          order.paymentStatus || (order.paymentMethod === 'Pay Online' ? 'Paid' : 'Pending'),
          order.paymentMethod || 'N/A',
          order.orderStatus || order.status
        ].join(',');
      });

      // Create CSV content
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Samartha_Orders_Report_${currentMonth.replace(' ', '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-6">
        {/* Export Controls */}
        <div className="bg-white border border-dark/5 rounded-xl p-4 lg:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg lg:text-xl text-dark font-bold">Orders Management</h3>
              <p className="text-xs text-dark/50 mt-1">Track and manage customer orders with monthly reporting.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full sm:w-auto">
              <button
                onClick={generateMonthlyPDFReport}
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] lg:text-[11px] font-bold px-3 lg:px-4 py-2.5 rounded flex items-center justify-center gap-2 transition-colors uppercase tracking-widest shadow-sm"
              >
                <svg className="w-3 lg:w-4 h-3 lg:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                PDF Report
              </button>
              <button
                onClick={generateMonthlyExcelReport}
                className="bg-green-600 hover:bg-green-700 text-white text-[10px] lg:text-[11px] font-bold px-3 lg:px-4 py-2.5 rounded flex items-center justify-center gap-2 transition-colors uppercase tracking-widest shadow-sm"
              >
                <svg className="w-3 lg:w-4 h-3 lg:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Excel Report
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="p-4 space-y-4">
              {orders.map((o) => {
                const displayItems = Array.isArray(o.items)
                  ? o.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')
                  : o.items;
                const paymentVal = o.paymentStatus || (o.paymentMethod === 'Pay Online' ? 'Paid' : 'Pending');

                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrderDetails(o)}
                    className="border border-dark/10 rounded-lg p-4 space-y-3 hover:border-gold-500/50 hover:bg-cream/5 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-dark text-sm">{o.id}</h4>
                        <p className="text-xs text-dark/60 font-semibold">{o.customer || o.customerName}</p>
                        <p className="text-xs text-dark/45 mt-1">{o.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gold-600">₹{o.total.toLocaleString()}</div>
                        {(o.subtotal || o.shippingCharge || o.codCharge) && (
                          <div className="text-[10px] text-dark/40 mt-1 space-y-0.5">
                            {o.subtotal && <div>Subtotal: ₹{o.subtotal.toLocaleString()}</div>}
                            {o.shippingCharge && o.shippingCharge > 0 && <div>Shipping: ₹{o.shippingCharge.toLocaleString()}</div>}
                            {o.codCharge && o.codCharge > 0 && <div className="text-orange-600 font-medium">COD: ₹{o.codCharge.toLocaleString()}</div>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-dark/45 font-medium line-clamp-2">{displayItems}</div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          value={paymentVal}
                          onChange={(e) => handlePaymentStatusChange(o.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#faf8f5] border border-dark/10 text-[10px] rounded px-2 py-1 text-dark outline-none font-bold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                        {o.paymentMethod && (
                          <span className="text-[9px] text-dark/40 font-medium">
                            {o.paymentMethod === 'Cash on Delivery (COD)' ? (
                              <span className="text-orange-600 font-bold">COD</span>
                            ) : (
                              <span>Online</span>
                            )}
                          </span>
                        )}
                      </div>

                      <select
                        value={o.orderStatus || o.status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#faf8f5] border border-dark/10 text-xs rounded px-2 py-1 text-dark outline-none font-medium"
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-dark/10">
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadInvoice(o); }}
                        className="flex-1 px-3 py-2 text-xs font-bold text-gold-700 bg-gold-50 border border-gold-200 rounded hover:bg-gold-100 transition-colors text-center"
                      >
                        Invoice
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteOrder(o.id); }}
                        className="flex-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark/5 bg-[#faf8f5]">
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Items</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const displayItems = Array.isArray(o.items)
                    ? o.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')
                    : o.items;

                  const paymentVal = o.paymentStatus || (o.paymentMethod === 'Pay Online' ? 'Paid' : 'Pending');

                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrderDetails(o)}
                      className="border-b border-dark/5 hover:bg-cream/20 hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-bold text-dark">{o.id}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-dark/60">{o.customer || o.customerName}</td>
                      <td className="px-6 py-4 text-xs text-dark/45 font-medium line-clamp-1 max-w-[200px]">{displayItems}</td>
                      <td className="px-6 py-4 text-xs text-dark/45">{o.date}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-gold-600">₹{o.total.toLocaleString()}</div>
                        {(o.subtotal || o.shippingCharge || o.codCharge) && (
                          <div className="text-[10px] text-dark/40 mt-1 space-y-0.5">
                            {o.subtotal && <div>Subtotal: ₹{o.subtotal.toLocaleString()}</div>}
                            {o.shippingCharge && o.shippingCharge > 0 && <div>Shipping: ₹{o.shippingCharge.toLocaleString()}</div>}
                            {o.codCharge && o.codCharge > 0 && <div className="text-orange-600 font-medium">COD: ₹{o.codCharge.toLocaleString()}</div>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <select
                            value={paymentVal}
                            onChange={(e) => handlePaymentStatusChange(o.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#faf8f5] border border-dark/10 text-[10px] rounded px-2 py-1 text-dark outline-none font-bold w-full"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                          {o.paymentMethod && (
                            <div className="text-[9px] text-dark/40 font-medium">
                              {o.paymentMethod === 'Cash on Delivery (COD)' ? (
                                <span className="text-orange-600 font-bold">COD</span>
                              ) : (
                                <span>Online</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={o.orderStatus || o.status}
                          onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#faf8f5] border border-dark/10 text-xs rounded px-2 py-1 text-dark outline-none font-medium"
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadInvoice(o); }}
                            className="px-2.5 py-1 text-[10px] font-bold text-gold-700 bg-gold-50 border border-gold-200 rounded hover:bg-gold-100 transition-colors"
                          >
                            Invoice
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteOrder(o.id); }}
                            className="px-2.5 py-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal Overlay */}
        <AnimatePresence>
          {selectedOrderDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderDetails(null)}
              className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-dark/10 w-full max-w-2xl rounded-2xl shadow-[0_20px_50px_rgba(26,18,8,0.15)] overflow-hidden flex flex-col my-8 max-h-[85vh]"
              >
                {/* Modal Header */}
                <div className="bg-[#faf8f5] border-b border-dark/5 px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest bg-gold-50 border border-gold-200/50 px-2 py-0.5 rounded">
                      Order Details
                    </span>
                    <h3 className="font-serif text-lg font-bold text-dark mt-1 flex items-center gap-2">
                      {selectedOrderDetails.id}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="text-dark/45 hover:text-dark text-xl p-1 bg-dark/5 hover:bg-dark/10 rounded-full transition-colors leading-none"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
                  {/* Status & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-cream/10 border border-dark/5 p-4 rounded-xl">
                    <div>
                      <p className="text-[10px] text-dark/45 font-bold uppercase tracking-wide">Placed On</p>
                      <p className="text-xs font-semibold text-dark mt-0.5">{selectedOrderDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark/45 font-bold uppercase tracking-wide">Delivery Status</p>
                      <select
                        value={selectedOrderDetails.orderStatus || selectedOrderDetails.status || 'Processing'}
                        onChange={(e) => handleOrderStatusChange(selectedOrderDetails.id, e.target.value)}
                        className="bg-[#faf8f5] border border-dark/10 text-[10px] rounded px-2 py-1 text-dark outline-none font-bold mt-0.5"
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark/45 font-bold uppercase tracking-wide">Payment Status</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <select
                          value={selectedOrderDetails.paymentStatus || (selectedOrderDetails.paymentMethod === 'Pay Online' ? 'Paid' : 'Pending')}
                          onChange={(e) => handlePaymentStatusChange(selectedOrderDetails.id, e.target.value)}
                          className="bg-[#faf8f5] border border-dark/10 text-[10px] rounded px-2 py-1 text-dark outline-none font-bold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                        <span className="text-[10px] text-dark/50 font-medium">
                          ({selectedOrderDetails.paymentMethod || 'Online'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-dark/5 pb-6">
                    <div>
                      <h4 className="text-[10px] text-dark/50 font-bold uppercase tracking-widest mb-3">Customer Details</h4>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-dark">{selectedOrderDetails.customerName || selectedOrderDetails.customer || 'Bespoke Customer'}</p>
                        {selectedOrderDetails.phone && (
                          <p className="text-xs text-dark/65 font-medium flex items-center gap-1.5">
                            <span>📞</span> {selectedOrderDetails.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] text-dark/50 font-bold uppercase tracking-widest mb-3">Shipping Address</h4>
                      <p className="text-xs text-dark/70 font-semibold leading-relaxed">
                        {selectedOrderDetails.address || 'Handcrafted Curation Cluster, India'}
                      </p>
                    </div>
                  </div>

                  {/* Product items list */}
                  <div>
                    <h4 className="text-[10px] text-dark/50 font-bold uppercase tracking-widest mb-4">Purchased Items</h4>
                    <div className="space-y-4">
                      {Array.isArray(selectedOrderDetails.items) ? (
                        selectedOrderDetails.items.map((item, index) => {
                          const itemImg = item.img || item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';
                          const itemPrice = parseFloat(String(item.price || '0').replace(/[^\d]/g, '')) || 0;
                          return (
                            <div key={index} className="flex items-center gap-4 border border-dark/5 p-3 rounded-xl hover:bg-cream/5 transition-all">
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-dark/10 flex-shrink-0 bg-[#faf8f5]">
                                <img
                                  src={itemImg}
                                  alt={item.name}
                                  className="w-full h-full object-cover grayscale-[0.1]"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-dark truncate">{item.name}</p>
                                <p className="text-[10px] text-dark/50 font-semibold mt-0.5">
                                  {item.category || ''} {item.size ? `· Size IND ${item.size}` : ''}
                                </p>
                                <p className="text-xs font-bold text-gold-600 mt-1">
                                  ₹{itemPrice.toLocaleString()} <span className="text-dark/40 font-medium">x {item.quantity || 1}</span>
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold text-dark">
                                  ₹{(itemPrice * (item.quantity || 1)).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        // If it's a string description (legacy format from initialOrders)
                        <div className="border border-dark/5 p-4 rounded-xl bg-[#faf8f5]">
                          <p className="text-sm font-semibold text-dark leading-relaxed">
                            {selectedOrderDetails.items || 'Handcrafted Curation Selection'}
                          </p>
                          <p className="text-xs text-dark/45 mt-2">
                            * Items summary converted from custom registry description.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial calculation breakdown */}
                  <div className="bg-[#faf8f5] border border-dark/5 p-4 rounded-xl space-y-2">
                    <h4 className="text-[10px] text-dark/50 font-bold uppercase tracking-widest mb-2">Invoice Summary</h4>
                    <div className="flex justify-between text-xs text-dark/65">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold">₹{(selectedOrderDetails.subtotal || selectedOrderDetails.total).toLocaleString()}</span>
                    </div>
                    {selectedOrderDetails.shippingCharge && selectedOrderDetails.shippingCharge > 0 ? (
                      <div className="flex justify-between text-xs text-dark/65">
                        <span>Shipping Charges</span>
                        <span className="font-semibold">₹{selectedOrderDetails.shippingCharge.toLocaleString()}</span>
                      </div>
                    ) : null}
                    {selectedOrderDetails.codCharge && selectedOrderDetails.codCharge > 0 ? (
                      <div className="flex justify-between text-xs text-dark/65">
                        <span>COD Handling Charges</span>
                        <span className="font-semibold text-orange-600">₹{selectedOrderDetails.codCharge.toLocaleString()}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-sm font-bold text-gold-600 border-t border-dark/5 pt-2.5 mt-2">
                      <span>Final Total</span>
                      <span className="text-base">₹{selectedOrderDetails.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-[#faf8f5] border-t border-dark/5 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => downloadInvoice(selectedOrderDetails)}
                    className="bg-gold-50 border border-gold-200 text-gold-700 hover:bg-gold-100 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>📄</span> Download Invoice
                  </button>
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="bg-dark hover:bg-gold-600 text-white hover:text-dark px-4 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }


  const renderResellersView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white border border-dark/5 rounded-xl p-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl text-dark font-bold">Resellers Network</h3>
            <p className="text-xs text-dark/50 mt-1">Manage partner accounts and sales operations.</p>
          </div>
          <button
            onClick={() => setShowResellerForm(true)}
            className="bg-dark hover:bg-gold-600 text-white hover:text-dark text-[11px] font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-colors uppercase tracking-widest shadow-sm"
          >
            + Add Partner Account
          </button>
        </div>

        {showResellerForm && (
          <div className="bg-white border border-dark/5 rounded-xl p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-dark/5">
              <h3 className="font-serif text-lg font-bold text-dark flex items-center gap-2">
                <span className="text-xl">👥</span> Reseller Onboarding
              </h3>
              <button
                onClick={() => setShowResellerForm(false)}
                className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-dark/20 text-dark rounded hover:bg-[#faf8f5] transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
              <div>
                <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={newReseller.name}
                  onChange={(e) => setNewReseller({ ...newReseller, name: e.target.value })}
                  className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Email Address (For Login)</label>
                <input
                  type="email"
                  value={newReseller.email}
                  onChange={(e) => setNewReseller({ ...newReseller, email: e.target.value })}
                  className="w-full text-xs font-medium border border-[#b8daff] bg-[#eef6ff] rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Mobile Number</label>
                <input
                  type="text"
                  value={newReseller.phone}
                  onChange={(e) => setNewReseller({ ...newReseller, phone: e.target.value })}
                  className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Set Password (min 6 chars)</label>
                <input
                  type="password"
                  value={newReseller.password}
                  onChange={(e) => setNewReseller({ ...newReseller, password: e.target.value })}
                  className="w-full text-xs font-medium border border-[#b8daff] bg-[#eef6ff] rounded-lg px-3 py-2 outline-none focus:border-blue-400 tracking-widest"
                />
              </div>
              <div>
                <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Commission Model</label>
                <select
                  value={newReseller.commissionModel}
                  onChange={(e) => setNewReseller({ ...newReseller, commissionModel: e.target.value })}
                  className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500 bg-white"
                >
                  <option value="Percentage (%)">Percentage (%)</option>
                  <option value="Flat Rate">Flat Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Commission Value</label>
                <input
                  type="number"
                  value={newReseller.commissionValue}
                  onChange={(e) => setNewReseller({ ...newReseller, commissionValue: e.target.value })}
                  className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleCreateResellerAccount}
                className="bg-[#386c55] hover:bg-[#254738] text-white text-[11px] font-bold tracking-widest px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                🚀 Create Partner Account
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark/5 bg-[#faf8f5]">
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Reseller</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Business Name</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Sales Generated</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Margin Earned</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resellers.map((r) => (
                  <tr key={r.id} className="border-b border-dark/5 hover:bg-cream/10 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-dark">{r.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${r.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                            r.status === 'Onboarding' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700'
                          }`}>
                          {r.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-dark/60">{r.business}</td>
                    <td className="px-6 py-4 text-xs text-dark/45">{r.location}</td>
                    <td className="px-6 py-4 text-xs text-dark/45">{r.joined}</td>
                    <td className="px-6 py-4 text-xs font-bold text-dark/70">₹{r.sales.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gold-600">₹{r.margin.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => startEditReseller(r)}
                          className="px-3 py-1.5 text-[10px] font-bold text-dark bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors shadow-sm"
                        >
                          Edit Details
                        </button>
                        {r.status === 'Onboarding' && (
                          <button
                            onClick={() => approveReseller(r.id)}
                            className="px-3 py-1.5 text-[10px] font-bold text-white bg-dark rounded hover:bg-gold-600 transition-colors shadow-sm"
                          >
                            Approve Partner
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderPayoutRequestsView = () => {
    // Calculate pending commissions for each reseller
    const resellerCommissions = {}

    orders.forEach(order => {
      if (order.commissions && Array.isArray(order.commissions)) {
        order.commissions.forEach(commission => {
          if (commission.status === 'Pending') {
            const resellerId = commission.resellerId
            if (!resellerCommissions[resellerId]) {
              resellerCommissions[resellerId] = {
                resellerId,
                resellerName: commission.resellerName,
                totalPending: 0,
                orders: []
              }
            }
            resellerCommissions[resellerId].totalPending += commission.commissionAmount
            resellerCommissions[resellerId].orders.push({
              orderId: order.id,
              date: order.date,
              amount: commission.commissionAmount,
              productName: commission.productName
            })
          }
        })
      }
    })

    const pendingPayouts = Object.values(resellerCommissions)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold">Reseller Payouts</h2>
            <p className="text-sm text-dark/60">Manage commission payments to reseller partners</p>
          </div>
          <button
            onClick={() => generatePayoutReport()}
            className="bg-gold-500 text-dark text-xs font-bold px-4 py-2 rounded hover:bg-gold-400 transition-colors"
          >
            Generate Monthly Report PDF
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white border border-dark/5 rounded-xl p-6">
            <h3 className="text-xs font-bold text-dark/40 uppercase tracking-wider mb-2">Total Pending</h3>
            <p className="font-serif text-2xl font-bold text-orange-600">
              ₹{pendingPayouts.reduce((sum, p) => sum + p.totalPending, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-dark/5 rounded-xl p-6">
            <h3 className="text-xs font-bold text-dark/40 uppercase tracking-wider mb-2">Resellers</h3>
            <p className="font-serif text-2xl font-bold text-blue-600">{pendingPayouts.length}</p>
          </div>
          <div className="bg-white border border-dark/5 rounded-xl p-6">
            <h3 className="text-xs font-bold text-dark/40 uppercase tracking-wider mb-2">This Month</h3>
            <p className="font-serif text-2xl font-bold text-green-600">
              ₹{orders.filter(o => {
                const orderDate = new Date(o.date)
                const currentDate = new Date()
                return orderDate.getMonth() === currentDate.getMonth() &&
                  orderDate.getFullYear() === currentDate.getFullYear()
              }).reduce((sum, o) => sum + (o.totalCommissions || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pending Payouts Table */}
        <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark/5 bg-[#faf8f5]">
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Reseller</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Pending Amount</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Orders Count</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Last Sale</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map((payout) => (
                  <tr key={payout.resellerId} className="border-b border-dark/5 hover:bg-cream/10 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-dark">{payout.resellerName}</p>
                        <p className="text-xs text-dark/50">ID: {payout.resellerId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">₹{payout.totalPending.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-dark/70">{payout.orders.length} orders</td>
                    <td className="px-6 py-4 text-xs text-dark/45">
                      {payout.orders.length > 0 ? payout.orders[payout.orders.length - 1].date : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => viewResellerDetails(payout)}
                          className="px-3 py-1.5 text-[10px] font-bold text-dark bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors shadow-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => processPayment(payout)}
                          className="px-3 py-1.5 text-[10px] font-bold text-white bg-green-600 rounded hover:bg-green-500 transition-colors shadow-sm"
                        >
                          Process Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayouts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-dark/40">
                      No pending payouts at this time
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legacy Payout Requests (if any) */}
        {payouts.length > 0 && (
          <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-dark/5">
              <h3 className="font-bold text-dark">Legacy Payout Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark/5 bg-[#faf8f5]">
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Reseller</th>
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Business Name</th>
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Total Balance</th>
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Payout Requested</th>
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Bank Details</th>
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Request Date</th>
                    <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest text-right">Status / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-dark/5 hover:bg-cream/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-dark">{p.reseller}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-dark/60">{p.business}</td>
                      <td className="px-6 py-4 text-xs font-bold text-dark/50">₹{p.balance.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gold-600">₹{p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-dark/45">{p.bank}</td>
                      <td className="px-6 py-4 text-xs text-dark/45">{p.date}</td>
                      <td className="px-6 py-4 text-right">
                        {p.status === 'Pending' ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handlePayoutStatus(p.id, 'Paid')}
                              className="px-2.5 py-1 text-[9px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePayoutStatus(p.id, 'Rejected')}
                              className="px-2.5 py-1 text-[9px] font-bold text-white bg-red-600 hover:bg-red-500 rounded transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[9px] font-bold px-2 py-1 rounded ${p.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {p.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderInquiriesView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white border border-dark/5 rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-dark">{inq.name}</h4>
                  <p className="text-xs text-dark/45 font-medium">{inq.email} · {inq.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${inq.status === 'Unread' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      inq.status === 'Replied' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                    {inq.status}
                  </span>
                  {inq.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveInquiry(inq.id)}
                      className="px-2.5 py-1 text-[10px] font-bold text-white bg-dark rounded hover:bg-gold-600 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3.5 bg-[#faf8f5] border border-dark/5 rounded-lg">
                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block mb-1">Subject: {inq.topic}</span>
                <p className="text-xs text-dark/60 leading-relaxed font-semibold">{inq.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPaymentsView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-dark/5 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark/5 bg-[#faf8f5]">
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Customer / Reseller</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Payment Method</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.txnId} className="border-b border-dark/5 hover:bg-cream/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-dark">{p.txnId}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-dark/60">{p.customer}</td>
                    <td className="px-6 py-4 text-xs text-dark/45">{p.method}</td>
                    <td className="px-6 py-4 text-xs text-dark/45">{p.date}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gold-600 font-sans">₹{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.status === 'Successful' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Payment Configurations View
  const renderPaymentConfigurationsView = () => {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Configurations</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cash on Delivery Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cash on Delivery</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Configure extra charges for Cash on Delivery orders. This amount will be added to the total during checkout.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  COD Extra Charge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={paymentConfig.codExtraCharge}
                    onChange={(e) => setPaymentConfig({
                      ...paymentConfig,
                      codExtraCharge: Number(e.target.value)
                    })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 border-dashed">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">CURRENT PREVIEW</span>
                </div>
                <p className="text-sm text-gray-600">
                  Orders with COD will have an additional <strong>₹{paymentConfig.codExtraCharge}</strong> fee.
                </p>
              </div>

              <button
                onClick={handleSavePaymentConfig}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Configuration
              </button>
            </div>
          </div>

          {/* Shipping Logistics Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🚛</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Shipping Logistics</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Define distance-wise shipping rates based on the customer's delivery location.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local (Same City/Kolhapur)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={paymentConfig.shippingRates.local}
                    onChange={(e) => setPaymentConfig({
                      ...paymentConfig,
                      shippingRates: {
                        ...paymentConfig.shippingRates,
                        local: Number(e.target.value)
                      }
                    })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State (Inside Maharashtra)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={paymentConfig.shippingRates.state}
                    onChange={(e) => setPaymentConfig({
                      ...paymentConfig,
                      shippingRates: {
                        ...paymentConfig.shippingRates,
                        state: Number(e.target.value)
                      }
                    })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National (Rest of India)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={paymentConfig.shippingRates.national}
                    onChange={(e) => setPaymentConfig({
                      ...paymentConfig,
                      shippingRates: {
                        ...paymentConfig.shippingRates,
                        national: Number(e.target.value)
                      }
                    })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveShippingRates}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Shipping Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Homepage Settings View
  const renderHomepageSettingsView = () => {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Homepage Settings</h2>
        </div>

        {/* Hero Section Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
              <input
                type="text"
                value={homepageSettings.hero.title}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  hero: { ...homepageSettings.hero, title: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={homepageSettings.hero.subtitle}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  hero: { ...homepageSettings.hero, subtitle: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
              <textarea
                value={homepageSettings.hero.description}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  hero: { ...homepageSettings.hero, description: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>

              {/* Image Upload Button */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Upload Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          try {
                            const compressedImage = await compressImage(file, 1200, 0.8) // Higher resolution for hero images
                            setHomepageSettings({
                              ...homepageSettings,
                              hero: { ...homepageSettings.hero, backgroundImage: compressedImage }
                            })
                          } catch (error) {
                            console.error('Error compressing hero image:', error)
                            alert('Error processing image. Please try with a smaller file.')
                          }
                        }
                      }}
                    />
                  </label>

                  {homepageSettings.hero.backgroundImage && (
                    <button
                      onClick={() => setHomepageSettings({
                        ...homepageSettings,
                        hero: { ...homepageSettings.hero, backgroundImage: '' }
                      })}
                      className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* URL Input Option */}
                <div className="relative">
                  <input
                    type="text"
                    value={homepageSettings.hero.backgroundImage.startsWith('data:') ? '' : homepageSettings.hero.backgroundImage}
                    onChange={(e) => setHomepageSettings({
                      ...homepageSettings,
                      hero: { ...homepageSettings.hero, backgroundImage: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {homepageSettings.hero.backgroundImage && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img
                    src={homepageSettings.hero.backgroundImage}
                    alt="Hero Background Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={homepageSettings.hero.ctaText}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  hero: { ...homepageSettings.hero, ctaText: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* About Section Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">About Section</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Title</label>
              <input
                type="text"
                value={homepageSettings.about.title}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  about: { ...homepageSettings.about, title: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Description</label>
              <textarea
                value={homepageSettings.about.description}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  about: { ...homepageSettings.about, description: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Image</label>

              {/* Image Upload Button */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-green-50">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Upload Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          try {
                            const compressedImage = await compressImage(file, 800, 0.8)
                            setHomepageSettings({
                              ...homepageSettings,
                              about: { ...homepageSettings.about, image: compressedImage }
                            })
                          } catch (error) {
                            console.error('Error compressing about image:', error)
                            alert('Error processing image. Please try with a smaller file.')
                          }
                        }
                      }}
                    />
                  </label>

                  {homepageSettings.about.image && (
                    <button
                      onClick={() => setHomepageSettings({
                        ...homepageSettings,
                        about: { ...homepageSettings.about, image: '' }
                      })}
                      className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* URL Input Option */}
                <div className="relative">
                  <input
                    type="text"
                    value={homepageSettings.about.image.startsWith('data:') ? '' : homepageSettings.about.image}
                    onChange={(e) => setHomepageSettings({
                      ...homepageSettings,
                      about: { ...homepageSettings.about, image: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {homepageSettings.about.image && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img
                    src={homepageSettings.about.image}
                    alt="About Image Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-lg">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Statistics Section</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Master Artisans</label>
              <input
                type="number"
                min="0"
                value={homepageSettings.stats.artisans}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  stats: { ...homepageSettings.stats, artisans: Number(e.target.value) }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Handcrafted Products</label>
              <input
                type="number"
                min="0"
                value={homepageSettings.stats.products}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  stats: { ...homepageSettings.stats, products: Number(e.target.value) }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Happy Customers</label>
              <input
                type="number"
                min="0"
                value={homepageSettings.stats.customers}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  stats: { ...homepageSettings.stats, customers: Number(e.target.value) }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Marquee Section Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-pink-600 text-lg">🎪</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Marquee Banner</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={homepageSettings.marquee.enabled}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  marquee: { ...homepageSettings.marquee, enabled: e.target.checked }
                })}
                className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label className="text-sm font-medium text-gray-700">Enable Marquee Banner</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marquee Text</label>
              <input
                type="text"
                value={homepageSettings.marquee.text}
                onChange={(e) => setHomepageSettings({
                  ...homepageSettings,
                  marquee: { ...homepageSettings.marquee, text: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                disabled={!homepageSettings.marquee.enabled}
              />
              <p className="mt-2 text-xs text-gray-500">Use ★ to separate phrases. Text will scroll continuously.</p>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveHomepageSettings}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save All Homepage Settings
          </button>
        </div>
      </div>
    )
  }

  const renderVideoTestimonialsView = () => {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center text-gold-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-dark">Video Testimonials Management</h2>
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-xl border border-dark/5 p-6 shadow-sm max-w-2xl">
          <h3 className="text-md font-bold text-dark mb-4">Add New Video Testimonial</h3>
          <form onSubmit={handleAddVideoTestimonial} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-dark/50 font-bold uppercase tracking-wider mb-1.5">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Deshmukh"
                  value={newVideo.customerName}
                  onChange={(e) => setNewVideo({ ...newVideo, customerName: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 text-dark placeholder-stone-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] text-dark/50 font-bold uppercase tracking-wider mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, MH"
                  value={newVideo.location}
                  onChange={(e) => setNewVideo({ ...newVideo, location: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 text-dark placeholder-stone-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-dark/50 font-bold uppercase tracking-wider mb-1.5">Title / Review Highlight</label>
              <input
                type="text"
                required
                placeholder="e.g. Breathtaking craftsmanship!"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 text-dark placeholder-stone-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] text-dark/50 font-bold uppercase tracking-wider mb-1.5">Video URL (Direct link to .mp4 or YouTube link)</label>
              <input
                type="url"
                required
                placeholder="e.g. https://example.com/video.mp4 or https://youtube.com/watch?v=..."
                value={newVideo.videoUrl}
                onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 text-dark font-mono placeholder-stone-400"
              />
            </div>

            <div>
              <label className="block text-[10px] text-dark/50 font-bold uppercase tracking-wider mb-1.5">Thumbnail Image URL (Optional)</label>
              <input
                type="url"
                placeholder="Leave blank for automatic sample placeholder"
                value={newVideo.thumbnailUrl}
                onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 text-dark font-mono placeholder-stone-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingVideo}
              className="bg-gold-500 text-dark text-xs font-bold px-6 py-3 rounded-lg hover:bg-gold-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingVideo ? 'Publishing...' : 'Publish Testimonial'}
            </button>
          </form>
        </div>

        {/* Existing Grid */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-dark">Active Video Testimonials ({videoTestimonials?.length || 0})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videoTestimonials && videoTestimonials.map((vid) => (
              <div key={vid.id} className="bg-white border border-dark/5 rounded-xl overflow-hidden shadow-sm flex flex-col group">
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-12 h-12 bg-gold-500 text-dark rounded-full flex items-center justify-center text-sm font-bold shadow-lg">▶</span>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-dark/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                    {vid.date || 'Recent'}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-dark line-clamp-1 mb-1">{vid.title}</h4>
                    <p className="text-xs text-dark/60 font-semibold">{vid.customerName}</p>
                    <p className="text-[10px] text-dark/40 font-medium">{vid.location}</p>
                    <p className="text-[9px] font-mono text-stone-400 mt-2 truncate">{vid.videoUrl}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this video testimonial?")) {
                        deleteVideoTestimonial(vid.id)
                      }
                    }}
                    className="mt-4 w-full border border-red-200 text-red-600 text-xs font-bold py-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    Delete Testimonial
                  </button>
                </div>
              </div>
            ))}
            {(!videoTestimonials || videoTestimonials.length === 0) && (
              <div className="col-span-full py-8 text-center text-dark/40 text-xs font-medium">
                No video testimonials found. Add a new one using the form above.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Switch Render view based on active tab
  const renderCurrentView = () => {
    switch (activeNav) {
      case 'Dashboard':
        return renderDashboardView()
      case 'All Inventory':
        return renderAllInventoryView()
      case 'Kolhapuri Chappal':
        return renderKolhapuriView()
      case 'Jewellery':
        return renderJewelleryView()
      case 'Orders':
        return renderOrdersView()
      case 'Resellers':
        return renderResellersView()
      case 'Payout Requests':
        return renderPayoutRequestsView()
      case 'Inquiries':
        return renderInquiriesView()
      case 'Payments':
        return renderPaymentsView()
      case 'Payment Configurations':
        return renderPaymentConfigurationsView()
      case 'Homepage Settings':
        return renderHomepageSettingsView()
      case 'Video Testimonials':
        return renderVideoTestimonialsView()
      default:
        return renderDashboardView()
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f0e8] text-dark font-sans selection:bg-gold-500/30 relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`w-64 bg-white border-r border-dark/5 flex flex-col fixed lg:relative h-full z-50 shadow-sm transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Logo */}
        <div className="p-6 border-b border-dark/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-dark rounded flex items-center justify-center text-white font-serif font-bold text-lg">S</div>
            <div>
              <div className="font-serif font-bold text-dark tracking-wide text-sm">SAMARTHA</div>
              <div className="text-[10px] text-dark/40 uppercase tracking-widest font-semibold">Admin Portal</div>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded text-dark/40 hover:text-dark"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveNav(item.label)
                setActiveSubCategory('All')
                setIsMobileMenuOpen(false) // Close mobile menu on selection
              }}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeNav === item.label
                  ? 'bg-gold-500/10 text-gold-600 border border-gold-500/20'
                  : 'text-dark/60 hover:text-dark hover:bg-cream/40 border border-transparent'
                }`}
            >
              <span className="opacity-80">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Topbar */}
        <header className="h-16 lg:h-20 border-b border-dark/5 bg-white/95 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-dark/40 hover:text-dark hover:bg-cream/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <div>
              <h1 className="font-serif text-lg lg:text-2xl font-bold text-dark">{activeNav}</h1>
              <p className="text-xs text-dark/50 mt-0.5 hidden sm:block">Welcome back, here's what's happening today.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-[#faf8f5] border border-dark/5 rounded-lg px-3 lg:px-4 py-2 text-xs lg:text-sm text-dark/70">
              <span className="opacity-50">📅</span>
              <span className="font-semibold tracking-wide">MAY 2026</span>
            </div>

            <div className="hidden sm:block h-8 w-px bg-dark/10"></div>

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-bold text-dark hidden lg:inline">Admin Panel</span>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg text-dark/40 hover:text-red-600 hover:bg-red-50 transition-colors" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="lg:w-[18px] lg:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20">
          {renderCurrentView()}
        </div>
      </main>

      {/* ─── Add/Edit Product Modal Overlay ─── */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-[#1a1208]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white border border-dark/5 rounded-xl p-4 lg:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-dark/5 pb-4">
              <h3 className="font-serif text-lg lg:text-xl font-bold text-gold-600">
                {isEditing ? 'Edit Existing Product' : 'List New Masterpiece'}
              </h3>
              <button onClick={resetProductForm} className="text-dark/40 hover:text-dark font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Product Name</label>
                <input
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark placeholder-stone-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value
                      const defaultSub = cat === 'Kolhapuri Chappal' ? 'Womens' : 'Necklace'
                      setNewProduct({ ...newProduct, category: cat, subCategory: defaultSub })
                      setIsCustomSubCategoryActive(false)
                      setCustomSubCategory('')
                    }}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-semibold cursor-pointer"
                  >
                    <option value="Kolhapuri Chappal">Kolhapuri Chappal</option>
                    <option value="Jewellery">Jewellery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Sub-Category (Collection)</label>
                  {newProduct.category === 'Kolhapuri Chappal' ? (
                    <select
                      value={newProduct.subCategory}
                      onChange={(e) => {
                        const val = e.target.value
                        setNewProduct({ ...newProduct, subCategory: val })
                        if (val === 'custom') {
                          setIsCustomSubCategoryActive(true)
                        } else {
                          setIsCustomSubCategoryActive(false)
                        }
                      }}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-semibold cursor-pointer"
                    >
                      <option value="Womens">Womens</option>
                      <option value="Mens">Mens</option>
                      <option value="Kids">Kids</option>
                      <option value="custom">+ List New Subcategory...</option>
                    </select>
                  ) : (
                    <select
                      value={newProduct.subCategory}
                      onChange={(e) => {
                        const val = e.target.value
                        setNewProduct({ ...newProduct, subCategory: val })
                        if (val === 'custom') {
                          setIsCustomSubCategoryActive(true)
                        } else {
                          setIsCustomSubCategoryActive(false)
                        }
                      }}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-semibold cursor-pointer"
                    >
                      <option value="Necklace">Necklace</option>
                      <option value="Rings">Rings</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Mangalsutra">Mangalsutra</option>
                      <option value="custom">+ List New Subcategory...</option>
                    </select>
                  )}
                </div>
              </div>

              {isCustomSubCategoryActive && (
                <div className="bg-gold-500/5 p-3 rounded-lg border border-gold-500/10 space-y-1">
                  <label className="block text-[9px] text-gold-600 font-bold uppercase tracking-wider">New Custom Sub-Category Name</label>
                  <input
                    required
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                    className="w-full bg-white border border-gold-500/20 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark placeholder-stone-400 font-semibold"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium placeholder-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Product Badge</label>
                  <select
                    value={newProduct.badge || 'None'}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-semibold cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="LIMITED EDITION">LIMITED EDITION</option>
                    <option value="CLEARANCE SALE">CLEARANCE SALE</option>
                    <option value="TOP SELLING">TOP SELLING</option>
                  </select>
                </div>
              </div>

              {/* Dynamic sizes stock / single quantity rendering */}
              {newProduct.category === 'Kolhapuri Chappal' ? (
                <div className="bg-[#faf8f5] p-4 rounded-lg border border-dark/5 space-y-2">
                  <span className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider">Sizes Inventory (Stock level per size)</span>
                  <div className="flex gap-2">
                    {[6, 7, 8, 9, 10, 11, 12].map(size => (
                      <div key={size} className="flex-1 text-center bg-white p-2 border border-dark/5 rounded shadow-xs">
                        <span className="text-[9px] text-dark/45 font-bold block mb-1">IND {size}</span>
                        <input
                          type="number"
                          min="0"
                          value={newProduct.sizes[size] || 0}
                          onChange={(e) => setNewProduct({
                            ...newProduct,
                            sizes: {
                              ...newProduct.sizes,
                              [size]: Number(e.target.value)
                            }
                          })}
                          className="bg-transparent text-center text-xs text-dark outline-none w-full border-b border-dark/10 focus:border-gold-600 font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : newProduct.category === 'Jewellery' && newProduct.subCategory === 'Rings' ? (
                <div className="space-y-3">
                  <div className="bg-[#faf8f5] p-4 rounded-lg border border-dark/5 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider">Ring Sizes Inventory</span>
                      <button
                        type="button"
                        onClick={() => setShowRingSizeChart(true)}
                        className="text-xs text-gold-600 underline hover:text-gold-700 transition-colors"
                      >
                        View Size Chart
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].map(size => (
                        <div key={size} className="text-center bg-white p-2 border border-dark/5 rounded shadow-xs">
                          <span className="text-[9px] text-dark/45 font-bold block mb-1">IND {size}</span>
                          <input
                            type="number"
                            min="0"
                            value={newProduct.sizes?.[size] || 0}
                            onChange={(e) => setNewProduct({
                              ...newProduct,
                              sizes: {
                                ...newProduct.sizes,
                                [size]: Number(e.target.value)
                              }
                            })}
                            className="bg-transparent text-center text-xs text-dark outline-none w-full border-b border-dark/10 focus:border-gold-600 font-bold"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-dark/50 mt-2">Enter stock quantity for each ring size (Indian sizing)</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium"
                  />
                </div>
              )}

              {/* Jewellery Specific Fields */}
              {newProduct.category === 'Jewellery' && (
                <div className="bg-[#faf8f5] p-4 rounded-lg border border-dark/5 space-y-3">
                  <span className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider">Jewellery Specifications</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Weight (e.g. 45g)</label>
                      <input
                        value={newProduct.weight || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                        className="w-full bg-white border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium placeholder-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Metal Type</label>
                      <input
                        value={newProduct.metal || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, metal: e.target.value })}
                        className="w-full bg-white border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium placeholder-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Gemstones</label>
                      <input
                        value={newProduct.gemstone || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, gemstone: e.target.value })}
                        className="w-full bg-white border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium placeholder-stone-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Product Description</label>
                <textarea
                  required
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark resize-none font-medium placeholder-stone-400"
                />
              </div>

              {/* Color Variants Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase">Color Variants</label>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="text-xs bg-gold-500 text-dark px-3 py-1 rounded hover:bg-gold-400 transition-colors font-medium"
                  >
                    + Add Color
                  </button>
                </div>

                <div className="space-y-4">
                  {newProduct.colorVariants && newProduct.colorVariants.map((variant, index) => (
                    <div key={variant.id} className="bg-[#faf8f5] border border-dark/10 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-dark/70">Color {index + 1}</span>
                        {newProduct.colorVariants && newProduct.colorVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColorVariant(variant.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Color Name</label>
                          <input
                            type="text"
                            value={variant.colorName}
                            onChange={(e) => updateColorVariant(variant.id, 'colorName', e.target.value)}
                            placeholder="e.g. Brown, Black, Red"
                            className="w-full bg-white border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium placeholder-stone-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Color Code</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={variant.colorCode}
                              onChange={(e) => updateColorVariant(variant.id, 'colorCode', e.target.value)}
                              className="w-12 h-8 border border-dark/10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={variant.colorCode}
                              onChange={(e) => updateColorVariant(variant.id, 'colorCode', e.target.value)}
                              placeholder="#000000"
                              className="flex-1 bg-white border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-medium placeholder-stone-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image Upload for this color variant */}
                      <div>
                        <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-2">Images for {variant.colorName || `Color ${index + 1}`}</label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dark/10 border-dashed rounded-lg cursor-pointer bg-white hover:bg-cream/20 hover:border-gold-500 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-2 pb-2">
                              <span className="text-sm mb-1">📸</span>
                              <p className="text-xs text-dark font-medium">Upload images for this color</p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleColorVariantImageUpload(variant.id, e.target.files)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Display images: new uploads take priority, else show existing Firebase URLs */}
                        {(() => {
                          const newUploads = colorVariantPreviews[variant.id] || []
                          const existingUrls = (variant.images || []).filter(url => url && url.startsWith('https://'))
                          const displayImages = newUploads.length > 0 ? newUploads : existingUrls
                          const isNewUpload = newUploads.length > 0
                          return displayImages.length > 0 ? (
                            <div className="mt-3">
                              {isNewUpload ? (
                                <p className="text-[9px] text-green-600 font-bold uppercase mb-1">✓ New upload — Firebase Storage</p>
                              ) : (
                                <p className="text-[9px] text-dark/40 font-bold uppercase mb-1">Current image — upload new to replace</p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {displayImages.map((src, imgIdx) => (
                                  <div key={imgIdx} className="relative group w-16 h-16 border border-dark/10 rounded overflow-hidden shadow-xs bg-white">
                                    <img src={src} className="w-full h-full object-cover" alt="" />
                                    {isNewUpload && (
                                      <button
                                        type="button"
                                        onClick={() => removeColorVariantImage(variant.id, imgIdx)}
                                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase mb-1">Upload Product Image</label>
                  <p className="text-xs text-dark/40 mb-2">
                    {isEditing
                      ? 'Upload a new image to replace the current one. Leave empty to keep existing image.'
                      : 'Upload product image. It will be stored in Firebase Storage.'}
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploadingImages
                        ? 'border-gold-400 bg-gold-50 cursor-wait'
                        : 'border-dark/10 bg-[#faf8f5] hover:bg-cream/20 hover:border-gold-500'
                      }`}>
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        {isUploadingImages ? (
                          <>
                            <svg className="animate-spin w-6 h-6 text-gold-500 mb-2" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <p className="text-xs text-gold-600 font-bold">Converting image…</p>
                            <p className="text-[9px] text-dark/40 mt-0.5">HEIC files may take a few seconds</p>
                          </>
                        ) : (
                          <>
                            <span className="text-xl mb-1">📸</span>
                            <p className="text-xs text-dark font-semibold">Click to upload product images</p>
                            <p className="text-[9px] text-dark/40">JPG, PNG, WebP, HEIC / HEIF supported · Auto-compressed</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        disabled={isUploadingImages}
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                        onChange={handleLocalImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Display uploaded local image previews OR existing images in edit mode */}
                {(() => {
                  const newUploads = localPreviews
                  const existingUrls = (newProduct.imageInput || '')
                    .split('\n').map(x => x.trim()).filter(url => url && url.startsWith('https://'))
                  const displayImages = newUploads.length > 0 ? newUploads : (isEditing ? existingUrls : [])
                  const isNewUpload = newUploads.length > 0
                  return displayImages.length > 0 ? (
                    <div className="bg-[#faf8f5] p-3 rounded-lg border border-dark/5 space-y-3">
                      <span className="block text-[8px] text-dark/40 font-bold uppercase mb-2">
                        {isNewUpload ? 'New Upload — Firebase Storage (First image = cover)' : 'Current Image — Upload new to replace'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {displayImages.map((src, idx) => (
                          <div key={idx} className="relative group w-14 h-14 border border-dark/10 rounded overflow-hidden shadow-xs bg-white">
                            <img src={src} className="w-full h-full object-cover" alt="" />
                            {isNewUpload && (
                              <button
                                type="button"
                                onClick={() => removeLocalImage(idx)}
                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {isNewUpload && (
                        <div className="flex items-center gap-2 text-xs p-2 rounded bg-green-50 border border-green-200 text-green-800">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="font-medium">
                            {displayImages.length} image{displayImages.length > 1 ? 's' : ''} uploaded to Firebase Storage ✓
                          </span>
                        </div>
                      )}
                    </div>
                  ) : null
                })()}

                <div className="border-t border-dark/5 pt-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[9px] text-dark/50 font-bold tracking-wider uppercase">Or Online Image URLs (One URL per line)</label>
                    <span className="text-[8px] text-gold-600 font-bold">Fallback option</span>
                  </div>
                  <textarea
                    rows={2}
                    value={newProduct.imageInput}
                    onChange={(e) => setNewProduct({ ...newProduct, imageInput: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded outline-none focus:border-gold-600 text-dark font-mono leading-relaxed placeholder-stone-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-dark/5 pt-4">
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="px-4 py-2 text-xs font-semibold text-dark/50 hover:text-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 text-dark text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-gold-400 transition-colors shadow-sm"
                >
                  {isEditing ? 'Save Product Changes' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Reseller Modal Overlay ─── */}
      {showEditResellerModal && (
        <div className="fixed inset-0 bg-[#1a1208]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white border border-dark/5 rounded-xl p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-dark">Edit Reseller Details</h3>
              <button
                onClick={() => setShowEditResellerModal(false)}
                className="w-8 h-8 rounded-full bg-dark/5 flex items-center justify-center text-dark/40 hover:text-dark hover:bg-dark/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateReseller(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Reseller Name</label>
                  <input
                    type="text"
                    required
                    value={editResellerData.name}
                    onChange={(e) => setEditResellerData({ ...editResellerData, name: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Business Name</label>
                  <input
                    type="text"
                    required
                    value={editResellerData.business}
                    onChange={(e) => setEditResellerData({ ...editResellerData, business: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Location</label>
                  <input
                    type="text"
                    value={editResellerData.location}
                    onChange={(e) => setEditResellerData({ ...editResellerData, location: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={editResellerData.status}
                    onChange={(e) => setEditResellerData({ ...editResellerData, status: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editResellerData.email}
                    onChange={(e) => setEditResellerData({ ...editResellerData, email: e.target.value })}
                    className="w-full text-xs font-medium border border-[#b8daff] bg-[#eef6ff] rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input
                    type="text"
                    value={editResellerData.phone}
                    onChange={(e) => setEditResellerData({ ...editResellerData, phone: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Login Password</label>
                  <input
                    type="password"
                    value={editResellerData.password}
                    onChange={(e) => setEditResellerData({ ...editResellerData, password: e.target.value })}
                    className="w-full text-xs font-medium border border-[#b8daff] bg-[#eef6ff] rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Commission Model</label>
                  <select
                    value={editResellerData.commissionModel}
                    onChange={(e) => setEditResellerData({ ...editResellerData, commissionModel: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="Percentage (%)">Percentage (%)</option>
                    <option value="Flat Rate">Flat Rate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[9px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Commission Value</label>
                  <input
                    type="number"
                    value={editResellerData.commissionValue}
                    onChange={(e) => setEditResellerData({ ...editResellerData, commissionValue: e.target.value })}
                    className="w-full text-xs font-medium border border-dark/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditResellerModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-dark/50 hover:text-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 text-dark text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-gold-400 transition-colors shadow-sm"
                >
                  Update Reseller Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
