import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore'

const AppContext = createContext()

const initialProducts = []

const initialOrders = []

const initialResellers = [
  { id: 1, name: 'Demo Reseller', business: 'Samartha Demo Store', representative: 'Demo Representative', location: 'Mumbai, MH', status: 'Active', sales: 50000, margin: 10000, joined: '01 Jan 2026', email: 'reseller@samartha.com', password: 'Reseller123', phone: '+91 99000 12345', commissionModel: 'Percentage (%)', commissionValue: '20' },
  { id: 2, name: 'Ananya Mehta', business: 'Mehta Luxury Crafts', representative: 'Ananya Mehta', location: 'Mumbai, MH', status: 'Active', sales: 420000, margin: 84000, joined: '12 Jan 2026', email: 'ananya@mehtaluxury.com', password: 'Ananya123', phone: '+91 98765 43210', commissionModel: 'Percentage (%)', commissionValue: '15' },
  { id: 3, name: 'Rahul Joshi', business: 'Royal Footwear & Co', representative: 'Rahul Joshi', location: 'Pune, MH', status: 'Onboarding', sales: 0, margin: 0, joined: '15 May 2026', email: 'rahul@royalfootwear.com', password: 'Rahul123', phone: '+91 87654 32109', commissionModel: 'Percentage (%)', commissionValue: '12' },
  { id: 4, name: 'Sneha Deshmukh', business: 'Ethnic Glitz Jewellery', representative: 'Sneha Deshmukh', location: 'Kolhapur, MH', status: 'Active', sales: 185000, margin: 37000, joined: '08 Feb 2026', email: 'sneha@ethnicglitz.com', password: 'Sneha123', phone: '+91 76543 21098', commissionModel: 'Percentage (%)', commissionValue: '18' },
  { id: 5, name: 'Vikrant Patil', business: 'Patels Heritage Emporium', representative: 'Vikrant Patil', location: 'Surat, GJ', status: 'Suspended', sales: 92000, margin: 18400, joined: '22 Oct 2025', email: 'vikrant@patelsheritage.com', password: 'Vikrant123', phone: '+91 65432 10987', commissionModel: 'Percentage (%)', commissionValue: '10' }
]

export function AppProvider({ children }) {
  // Navigation Drawers
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  // Local storage cache for offline checkout cart/wishlist
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('samartha_cart')
    return saved ? JSON.parse(saved) : []
  })

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('samartha_wishlist')
    return saved ? JSON.parse(saved) : []
  })

  // Firebase Authentication States
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Firestore Collection States
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [resellers, setResellers] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [reviews, setReviews] = useState([])
  const [videoTestimonials, setVideoTestimonials] = useState([])
  const [loadingFirestore, setLoadingFirestore] = useState(true)

  // Cache cart & wishlist in local storage
  useEffect(() => {
    localStorage.setItem('samartha_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('samartha_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // ─── FIREBASE AUTHENTICATION MONITOR ───
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        // Fetch custom profile data (e.g. phone, address) from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const profile = userDoc.data()
            setUserProfile(profile)
            localStorage.setItem('samartha_user', JSON.stringify(profile))
          } else {
            // Fallback object matching metadata schema
            const fallbackProfile = {
              uid: user.uid,
              name: user.displayName || user.email.split('@')[0].toUpperCase(),
              email: user.email,
              phone: user.phoneNumber || '+91 99887 76655',
              joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            }
            setUserProfile(fallbackProfile)
            localStorage.setItem('samartha_user', JSON.stringify(fallbackProfile))
          }
        } catch (e) {
          console.error("Error reading user profile doc: ", e)
        }
      } else {
        setUserProfile(null)
        localStorage.removeItem('samartha_user')
      }
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  // ─── FIRESTORE DATABASE SYNCHRONIZER ───
  useEffect(() => {
    const syncFirestoreData = async () => {
      try {
        setLoadingFirestore(true)

        // 1. Load / Seed Products
        const productsCol = collection(db, 'products')
        const productsSnapshot = await getDocs(productsCol)
        let fetchedProducts = productsSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))

        // Proactively clean up demo products (IDs 1 to 6) from Firestore
        const demoIds = [1, 2, 3, 4, 5, 6]
        const hasDemo = fetchedProducts.some(p => demoIds.includes(Number(p.id)))
        if (hasDemo) {
          console.log("Removing demo products from live Firestore database...")
          for (const id of demoIds) {
            try {
              await deleteDoc(doc(db, 'products', String(id)))
            } catch (err) {
              console.error(`Failed to delete demo product ${id}: `, err)
            }
          }
          fetchedProducts = fetchedProducts.filter(p => !demoIds.includes(Number(p.id)))
        }

        if (fetchedProducts.length === 0 && initialProducts.length > 0) {
          console.log("Seeding Firestore products collection with heritage catalog...")
          for (const item of initialProducts) {
            await setDoc(doc(db, 'products', String(item.id)), item)
          }
          fetchedProducts = initialProducts
        }
        // Sync back sorted by id desc
        setProducts(fetchedProducts.sort((a, b) => b.id - a.id))
        localStorage.setItem('samartha_products', JSON.stringify(fetchedProducts))

        // Orders are now synchronized in a separate real-time onSnapshot listener below.

        // 3. Load / Seed Resellers
        const resellersCol = collection(db, 'resellers')
        const resellersSnapshot = await getDocs(resellersCol)
        let fetchedResellers = resellersSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            docId: doc.id,
            ...data,
            id: data.id || doc.id // Fallback to doc ID if id field is not set
          }
        })

        console.log('Fetched resellers from Firestore:', fetchedResellers)

        if (fetchedResellers.length === 0) {
          console.log("Seeding Firestore resellers collection with demo accounts...")
          for (const reseller of initialResellers) {
            await setDoc(doc(db, 'resellers', String(reseller.id)), reseller)
          }
          fetchedResellers = initialResellers
          console.log('Seeded resellers:', fetchedResellers)
        }
        setResellers(fetchedResellers)

        // 4. Load Support Inquiries
        const inquiriesCol = collection(db, 'inquiries')
        const inquiriesSnapshot = await getDocs(inquiriesCol)
        const fetchedInquiries = inquiriesSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
        setInquiries(fetchedInquiries)
        localStorage.setItem('samartha_inquiries', JSON.stringify(fetchedInquiries))

        // 5. Load / Seed Reviews
        const reviewsCol = collection(db, 'reviews')
        const reviewsSnapshot = await getDocs(reviewsCol)
        let fetchedReviews = reviewsSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
        
        if (fetchedReviews.length === 0) {
          const initialReviews = [
            {
              id: 'rev-1',
              rating: 5,
              review: "The custom-fit Kolhapuri Chappals are an absolute masterpiece. I wore them to a family wedding and received endless compliments. The leather is premium and fits like a second skin!",
              customerName: "Aditi Deshmukh",
              location: "Mumbai, MH",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
              verified: true,
              date: "19 May 2026"
            },
            {
              id: 'rev-2',
              rating: 5,
              review: "Highly impressed by the Temple Jewellery collection! The Nakashi detailing is incredibly intricate, reminiscent of royal family heirlooms. Shipping was incredibly fast.",
              customerName: "Rajesh Nair",
              location: "Bengaluru, KA",
              avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
              verified: true,
              date: "18 May 2026"
            },
            {
              id: 'rev-3',
              rating: 5,
              review: "Being a reseller with Samartha Craft Studio has been an amazing journey. The products are so authentic, and my customers love the rich craftsmanship. Best handmade brand in India!",
              customerName: "Priyanka Sen",
              location: "Pune, MH",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
              verified: true,
              date: "17 May 2026"
            }
          ]
          for (const rev of initialReviews) {
            await setDoc(doc(db, 'reviews', rev.id), rev)
          }
          fetchedReviews = initialReviews
        }
        setReviews(fetchedReviews.sort((a, b) => b.id.localeCompare(a.id)))
        localStorage.setItem('samartha_reviews', JSON.stringify(fetchedReviews))

        // 6. Load / Seed Video Testimonials
        const videoCol = collection(db, 'video_testimonials')
        const videoSnapshot = await getDocs(videoCol)
        let fetchedVideos = videoSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))

        if (fetchedVideos.length === 0) {
          const initialVideos = [
            {
              id: 'vid-1',
              title: 'Exquisite Heritage Temple Jewellery!',
              customerName: 'Ananya Deshmukh',
              location: 'Mumbai, MH',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-jewelry-41718-large.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
              date: '20 May 2026'
            },
            {
              id: 'vid-2',
              title: 'Incredible comfort & perfect custom fit footwear!',
              customerName: 'Sneha Patil',
              location: 'Kolhapur, MH',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-posing-41719-large.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
              date: '19 May 2026'
            },
            {
              id: 'vid-3',
              title: 'Best handmade Kolhapuris in India.',
              customerName: 'Rohit Shinde',
              location: 'Pune, MH',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-gold-ring-with-a-red-gemstone-34446-large.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
              date: '18 May 2026'
            }
          ]
          for (const vid of initialVideos) {
            await setDoc(doc(db, 'video_testimonials', vid.id), vid)
          }
          fetchedVideos = initialVideos
        }
        setVideoTestimonials(fetchedVideos.sort((a, b) => b.id.localeCompare(a.id)))
        localStorage.setItem('samartha_video_testimonials', JSON.stringify(fetchedVideos))

      } catch (err) {
        console.error("Firestore database fetching failed: ", err)
      } finally {
        setLoadingFirestore(false)
      }
    }

    syncFirestoreData()
  }, [])

  // ─── REAL-TIME ORDERS SYNCHRONIZER ───
  useEffect(() => {
    const ordersCol = collection(db, 'orders')
    const unsubscribe = onSnapshot(ordersCol, async (snapshot) => {
      let fetchedOrders = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))

      // Proactively clean up demo orders from Firestore
      const demoOrderIds = ['SM-ORD-9041', 'SM-ORD-9042', 'SM-ORD-9043', 'SM-ORD-9044', 'SM-ORD-9045']
      const hasDemoOrders = fetchedOrders.some(o => demoOrderIds.includes(o.id))
      if (hasDemoOrders) {
        console.log("Removing demo orders from live Firestore database...")
        for (const id of demoOrderIds) {
          try {
            await deleteDoc(doc(db, 'orders', id))
          } catch (err) {
            console.error(`Failed to delete demo order ${id}: `, err)
          }
        }
        fetchedOrders = fetchedOrders.filter(o => !demoOrderIds.includes(o.id))
      }

      if (fetchedOrders.length === 0 && initialOrders.length > 0) {
        console.log("Seeding Firestore orders collection with sample logs...")
        for (const ord of initialOrders) {
          await setDoc(doc(db, 'orders', ord.id), ord)
        }
        fetchedOrders = initialOrders
      }
      
      // Deduplicate by order id to prevent duplicate key warnings
      // Also ensure we have valid order objects with required fields
      const seen = new Set()
      const uniqueOrders = fetchedOrders.filter(o => {
        if (!o || !o.id || seen.has(o.id)) return false
        seen.add(o.id)
        return true
      })
      
      // Sort by timestamp if available, otherwise by id
      const sortedOrders = uniqueOrders.sort((a, b) => {
        // Try to sort by timestamp first
        if (a.timestamp && b.timestamp) {
          return b.timestamp - a.timestamp
        }
        // Fallback to id comparison
        return (b.id > a.id ? 1 : -1)
      })
      
      setOrders(sortedOrders)
      localStorage.setItem('samartha_orders', JSON.stringify(sortedOrders))
    }, (error) => {
      console.error("Firestore orders snapshot failed: ", error)
    })

    return () => unsubscribe()
  }, [])

  // ─── FIRESTORE INTERACTIVE DB OPERATIONS ───

  // Add Product (saves dynamically to Firestore & triggers hook)
  const addFirestoreProduct = async (productData) => {
    console.log('Adding product to Firestore:', {
      id: productData.id,
      name: productData.name,
      imageCount: productData.images?.length || 0,
      colorVariantCount: productData.colorVariants?.length || 0
    })
    
    try {
      const docRef = doc(db, 'products', String(productData.id))
      await setDoc(docRef, productData)
      const updatedProducts = [productData, ...products.filter(p => p.id !== productData.id)]
      setProducts(updatedProducts)
      
      // Update localStorage immediately for consistency
      localStorage.setItem('samartha_products', JSON.stringify(updatedProducts))
      
      console.log('Product added successfully. New products count:', updatedProducts.length)
      
      return true
    } catch (e) {
      console.error("Error writing product to Firestore: ", e)
      
      // Provide more specific error messages
      if (e.message && e.message.includes('payload size exceeds')) {
        throw new Error('Product data is too large. Please use fewer or smaller images.')
      } else if (e.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your Firestore security rules.')
      } else if (e.code === 'unavailable') {
        throw new Error('Firestore is temporarily unavailable. Please try again.')
      } else {
        throw new Error('Failed to save product. Please try again.')
      }
    }
  }

  // Delete Product
  const deleteFirestoreProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', String(id)))
      setProducts(prev => prev.filter(p => p.id !== id))
      return true
    } catch (e) {
      console.error("Error deleting product from Firestore: ", e)
      return false
    }
  }

  // Checkout / Create Custom Order
  const addFirestoreOrder = async (orderData) => {
    try {
      const docRef = doc(db, 'orders', orderData.id)
      await setDoc(docRef, orderData)
      setOrders(prev => [orderData, ...prev])
      
      // Update local storage instantly for immediate profile tab reactivity
      const current = JSON.parse(localStorage.getItem('samartha_orders') || '[]')
      localStorage.setItem('samartha_orders', JSON.stringify([orderData, ...current]))

      // Deduct stock for each purchased item
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          try {
            const productRef = doc(db, 'products', String(item.id))
            const productSnap = await getDoc(productRef)
            if (productSnap.exists()) {
              const productVal = productSnap.data()
              if (productVal.category === 'Kolhapuri Chappal') {
                const currentSizes = productVal.sizes || {}
                const purchasedSize = String(item.size)
                const currentSizeStock = Number(currentSizes[purchasedSize] || 0)
                const newSizeStock = Math.max(0, currentSizeStock - Number(item.quantity || 1))
                
                const newSizes = {
                  ...currentSizes,
                  [purchasedSize]: newSizeStock
                }
                const newTotalStock = Object.values(newSizes).reduce((sum, val) => sum + Number(val), 0)
                
                await updateDoc(productRef, {
                  sizes: newSizes,
                  stock: newTotalStock
                })
                
                // Update local React state for products
                setProducts(prev => prev.map(p => String(p.id) === String(item.id) ? { ...p, sizes: newSizes, stock: newTotalStock } : p))
              } else {
                const currentStock = Number(productVal.stock || 0)
                const newStock = Math.max(0, currentStock - Number(item.quantity || 1))
                
                await updateDoc(productRef, {
                  stock: newStock
                })
                
                // Update local React state for products
                setProducts(prev => prev.map(p => String(p.id) === String(item.id) ? { ...p, stock: newStock } : p))
              }
            }
          } catch (err) {
            console.error(`Failed to deduct stock for product ${item.id}:`, err)
          }
        }
      }

      return true
    } catch (e) {
      console.error("Error writing order to Firestore: ", e)
      return false
    }
  }

  // Update Order Status
  const updateFirestoreOrderStatus = async (orderId, newStatus) => {
    try {
      const docRef = doc(db, 'orders', orderId)
      await updateDoc(docRef, { orderStatus: newStatus, status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus, status: newStatus } : o))
      return true
    } catch (e) {
      console.error("Error updating order status in Firestore: ", e)
      return false
    }
  }

  // Update Payment Status
  const updateFirestorePaymentStatus = async (orderId, newStatus) => {
    try {
      const docRef = doc(db, 'orders', orderId)
      await updateDoc(docRef, { paymentStatus: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o))
      return true
    } catch (e) {
      console.error("Error updating payment status in Firestore: ", e)
      return false
    }
  }

  // Delete Order
  const deleteFirestoreOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId))
      setOrders(prev => prev.filter(o => o.id !== orderId))
      return true
    } catch (e) {
      console.error("Error deleting order from Firestore: ", e)
      return false
    }
  }

  // Cancel Order (within 2 hours)
  const cancelOrder = async (orderId) => {
    try {
      const docRef = doc(db, 'orders', orderId)
      await updateDoc(docRef, { 
        orderStatus: 'Cancelled', 
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
      })
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, orderStatus: 'Cancelled', status: 'Cancelled', cancelledAt: new Date().toISOString() } 
          : o
      ))
      
      // Update local storage
      const current = JSON.parse(localStorage.getItem('samartha_orders') || '[]')
      const updated = current.map(o => 
        o.id === orderId 
          ? { ...o, orderStatus: 'Cancelled', status: 'Cancelled', cancelledAt: new Date().toISOString() }
          : o
      )
      localStorage.setItem('samartha_orders', JSON.stringify(updated))
      
      return true
    } catch (e) {
      console.error("Error cancelling order in Firestore: ", e)
      return false
    }
  }

  // Request Order Cancellation (triggers WhatsApp message confirmation)
  // Order is only cancelled when user clicks YES on WhatsApp (triggers incoming webhook)
  const requestOrderCancellation = async (orderId, phone, customerName) => {
    try {
      console.log(`[AppContext] Requesting cancellation for order ${orderId}`);

      // 1. Update Firestore order doc status to 'Cancellation Pending'
      const docRef = doc(db, 'orders', orderId)
      await updateDoc(docRef, { 
        orderStatus: 'Cancellation Pending', 
        status: 'Cancellation Pending'
      })

      // 2. Call backend function to record request and send WhatsApp (with YES/NO buttons)
      const { requestWhatsAppOrderCancellation } = await import('../utils/whatsappWebhook')
      const result = await requestWhatsAppOrderCancellation({ orderId, phone, customerName })

      return result.success
    } catch (e) {
      console.error("[AppContext] Error requesting order cancellation: ", e)
      return false
    }
  }

  // Submit support inquiry
  const addFirestoreInquiry = async (inquiryData) => {
    try {
      const colRef = collection(db, 'inquiries')
      const docRef = await addDoc(colRef, inquiryData)
      const fullInquiry = { id: docRef.id, ...inquiryData }
      setInquiries(prev => [fullInquiry, ...prev])
      return true
    } catch (e) {
      console.error("Error posting inquiry to Firestore: ", e)
      return false
    }
  }

  // Add review to Firestore
  const addFirestoreReview = async (reviewData) => {
    try {
      const docRef = doc(db, 'reviews', reviewData.id)
      await setDoc(docRef, reviewData)
      setReviews(prev => [reviewData, ...prev])
      
      const current = JSON.parse(localStorage.getItem('samartha_reviews') || '[]')
      localStorage.setItem('samartha_reviews', JSON.stringify([reviewData, ...current]))
      return true
    } catch (e) {
      console.error("Error posting review to Firestore: ", e)
      return false
    }
  }

  // Add registered reseller
  const addFirestoreReseller = async (resellerData) => {
    try {
      console.log('Adding reseller to Firestore:', resellerData)
      // Use setDoc with the provided ID to ensure ID synchronization
      const docRef = doc(db, 'resellers', String(resellerData.id))
      await setDoc(docRef, resellerData)
      console.log('Reseller added with ID:', resellerData.id)
      
      const fullReseller = { docId: String(resellerData.id), ...resellerData }
      setResellers(prev => {
        const updated = [fullReseller, ...prev]
        console.log('Updated resellers list:', updated)
        return updated
      })
      return true
    } catch (e) {
      console.error("Error posting reseller to Firestore: ", e)
      return false
    }
  }

  // Approve reseller
  const approveFirestoreReseller = async (resellerId, updatedData) => {
    try {
      // Find doc first
      const resellersCol = collection(db, 'resellers')
      const snapshot = await getDocs(resellersCol)
      const matchDoc = snapshot.docs.find(doc => doc.data().name === updatedData.name)
      if (matchDoc) {
        await updateDoc(doc(db, 'resellers', matchDoc.id), { status: 'Active' })
      }
      setResellers(prev => prev.map(r => r.name === updatedData.name ? { ...r, status: 'Active' } : r))
      return true
    } catch (e) {
      console.error("Error approving reseller in Firestore: ", e)
      return false
    }
  }

  // Update reseller details
  const updateFirestoreReseller = async (resellerId, updatedData) => {
    try {
      // Find doc by ID or name
      const resellersCol = collection(db, 'resellers')
      const snapshot = await getDocs(resellersCol)
      const matchDoc = snapshot.docs.find(doc => 
        doc.data().id === resellerId || 
        doc.data().name === updatedData.originalName ||
        doc.id === resellerId
      )
      
      if (matchDoc) {
        await updateDoc(doc(db, 'resellers', matchDoc.id), updatedData)
        setResellers(prev => prev.map(r => 
          (r.id === resellerId || r.name === updatedData.originalName) 
            ? { ...r, ...updatedData } 
            : r
        ))
        return true
      }
      return false
    } catch (e) {
      console.error("Error updating reseller in Firestore: ", e)
      return false
    }
  }

  // Save or Add User Address to Firestore
  const saveUserAddress = async (uid, newAddress) => {
    try {
      const userRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userRef)
      let currentProfile = {}
      if (userDoc.exists()) {
        currentProfile = userDoc.data()
      } else {
        currentProfile = {
          uid,
          name: firebaseUser?.displayName || firebaseUser?.email?.split('@')[0].toUpperCase() || 'CUSTOMER',
          email: firebaseUser?.email || '',
          phone: firebaseUser?.phoneNumber || '+91 99887 76655',
          joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        }
      }
      
      const existingAddresses = Array.isArray(currentProfile.addresses) ? currentProfile.addresses : []
      const isDuplicate = existingAddresses.some(addr => 
        addr.area === newAddress.area &&
        addr.city === newAddress.city &&
        addr.taluka === newAddress.taluka &&
        addr.district === newAddress.district &&
        addr.state === newAddress.state &&
        addr.pincode === newAddress.pincode
      )
      
      let updatedAddresses = [...existingAddresses]
      if (!isDuplicate) {
        updatedAddresses.push({
          id: Date.now().toString(),
          ...newAddress
        })
      }
      
      const updatedProfile = {
        ...currentProfile,
        addresses: updatedAddresses
      }
      
      await setDoc(userRef, updatedProfile)
      setUserProfile(updatedProfile)
      localStorage.setItem('samartha_user', JSON.stringify(updatedProfile))
      return updatedProfile
    } catch (e) {
      console.error("Error saving user address to Firestore: ", e)
      return null
    }
  }

  // Add Video Testimonial
  const addFirestoreVideoTestimonial = async (videoData) => {
    try {
      const docRef = doc(db, 'video_testimonials', videoData.id)
      await setDoc(docRef, videoData)
      setVideoTestimonials(prev => [videoData, ...prev.filter(v => v.id !== videoData.id)])
      
      const current = JSON.parse(localStorage.getItem('samartha_video_testimonials') || '[]')
      localStorage.setItem('samartha_video_testimonials', JSON.stringify([videoData, ...current.filter(v => v.id !== videoData.id)]))
      return true
    } catch (e) {
      console.error("Error posting video testimonial to Firestore: ", e)
      return false
    }
  }

  // Delete Video Testimonial
  const deleteFirestoreVideoTestimonial = async (id) => {
    try {
      await deleteDoc(doc(db, 'video_testimonials', String(id)))
      setVideoTestimonials(prev => prev.filter(v => v.id !== id))
      
      const current = JSON.parse(localStorage.getItem('samartha_video_testimonials') || '[]')
      localStorage.setItem('samartha_video_testimonials', JSON.stringify(current.filter(v => v.id !== id)))
      return true
    } catch (e) {
      console.error("Error deleting video testimonial from Firestore: ", e)
      return false
    }
  }

  // ─── CART AND WISHLIST LOGIC ───
  const addToCart = (product, size = 40) => {
    // Debug: Log product image data before adding to cart
    console.log('🛒 Adding to cart - Product image data:', {
      productId: product.id,
      productName: product.name,
      hasImages: !!product.images,
      imagesCount: product.images?.length || 0,
      hasColorVariants: !!product.colorVariants,
      colorVariantsCount: product.colorVariants?.length || 0,
      hasImg: !!product.img,
      hasImage: !!product.image,
      firstImage: product.images?.[0] || product.image || product.img || 'NONE'
    })
    
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      const newCartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        // FIX: Use images[0] as primary source — standardized image field priority
        img: product.images?.[0] || product.image || product.img,
        image: product.images?.[0] || product.image || product.img,
        images: product.images || [],
        colorVariants: product.colorVariants || [],
        shortImageUrl: product.shortImageUrl || null,
        size,
        quantity: 1,
        category: product.category,
        // Include reseller info if present
        referralCode: product.referralCode || null,
        resellerId: product.resellerId || null,
        resellerName: product.resellerName || null,
      }
      
      // Debug: Log cart item image data
      console.log('✅ Cart item created with image data:', {
        itemId: newCartItem.id,
        hasImages: !!newCartItem.images,
        imagesCount: newCartItem.images?.length || 0,
        hasColorVariants: !!newCartItem.colorVariants,
        colorVariantsCount: newCartItem.colorVariants?.length || 0,
        firstImage: newCartItem.images?.[0] || newCartItem.image || newCartItem.img || 'NONE'
      })
      
      return [
        ...prev,
        newCartItem
      ]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
  }

  const updateCartQty = (id, size, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.size === size) {
            const newQty = item.quantity + delta
            return { ...item, quantity: newQty }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) return prev
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img || product.image,
          category: product.category,
        },
      ]
    })
    setWishlistOpen(true)
  }

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <AppContext.Provider
      value={{
        // Local state
        cart,
        wishlist,
        cartOpen,
        setCartOpen,
        wishlistOpen,
        setWishlistOpen,
        addToCart,
        removeFromCart,
        updateCartQty,
        addToWishlist,
        removeFromWishlist,
        clearCart,

        // Firebase Auth
        firebaseUser,
        userProfile,
        setUserProfile,
        loadingAuth,

        // Firestore Data
        products,
        orders,
        resellers,
        inquiries,
        reviews,
        videoTestimonials,
        loadingFirestore,

        // Firestore operations
        addProduct: addFirestoreProduct,
        deleteProduct: deleteFirestoreProduct,
        addOrder: addFirestoreOrder,
        updateOrderStatus: updateFirestoreOrderStatus,
        updatePaymentStatus: updateFirestorePaymentStatus,
        deleteOrder: deleteFirestoreOrder,
        cancelOrder,
        requestOrderCancellation,
        addInquiry: addFirestoreInquiry,
        addReview: addFirestoreReview,
        addReseller: addFirestoreReseller,
        approveReseller: approveFirestoreReseller,
        updateReseller: updateFirestoreReseller,
        saveUserAddress,
        addVideoTestimonial: addFirestoreVideoTestimonial,
        deleteVideoTestimonial: deleteFirestoreVideoTestimonial
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
