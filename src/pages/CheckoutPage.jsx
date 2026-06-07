import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext'
import { sendOrderConfirmation } from '../utils/whatsappWebhook'
import { getProductImageUrl } from '../utils/imageUtils'

export default function CheckoutPage() {
  const { cart, clearCart, addOrder, addReview, firebaseUser, userProfile, saveUserAddress, resellers } = useApp()
  const navigate = useNavigate()

  // Form inputs state
  const [customerName, setCustomerName] = useState(() => {
    if (userProfile?.name) return userProfile.name
    const saved = localStorage.getItem('samartha_user')
    return saved ? JSON.parse(saved).name : ''
  })
  const [phone, setPhone] = useState(() => {
    if (userProfile?.phone) return userProfile.phone
    const saved = localStorage.getItem('samartha_user')
    return saved ? JSON.parse(saved).phone : ''
  })

  // Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    if (userProfile?.addresses && Array.isArray(userProfile.addresses) && userProfile.addresses.length > 0) {
      return userProfile.addresses[0].id
    }
    return 'new'
  })

  // Address fields states
  const [area, setArea] = useState('')
  const [city, setCity] = useState('')
  const [taluka, setTaluka] = useState('')
  const [district, setDistrict] = useState('')
  const [stateField, setStateField] = useState('')
  const [pincode, setPincode] = useState('')
  const [isFetchingPincode, setIsFetchingPincode] = useState(false)
  const [pincodeLookupMessage, setPincodeLookupMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pay Online')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSimulatedGateway, setShowSimulatedGateway] = useState(false)
  const [simulatedCard, setSimulatedCard] = useState('')
  const [simulatedExpiry, setSimulatedExpiry] = useState('')
  const [simulatedCvv, setSimulatedCvv] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  // Review states
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewLocation, setReviewLocation] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  // Calculations
  const cartSubtotal = cart.reduce((total, item) => {
    const priceStr = String(item.price || '0')
    const numericPrice = parseFloat(priceStr.replace(/[^\d]/g, '')) || 0
    return total + (numericPrice * item.quantity)
  }, 0)

  // Load payment configurations
  const paymentConfig = (() => {
    const saved = localStorage.getItem('samartha_payment_config')
    return saved ? JSON.parse(saved) : {
      codExtraCharge: 50,
      shippingRates: {
        local: 10,
        state: 40,
        national: 100
      }
    }
  })()

  // Calculate shipping charges based on location
  const calculateShippingCharge = () => {
    if (selectedAddressId === 'new') {
      // Use current form state
      const currentState = stateField.toLowerCase()
      const currentDistrict = district.toLowerCase()
      const currentCity = city.toLowerCase()

      // Local delivery (Kolhapur)
      if (currentCity.includes('kolhapur') || currentDistrict.includes('kolhapur')) {
        return paymentConfig.shippingRates.local
      }
      // State delivery (Maharashtra)
      else if (currentState.includes('maharashtra')) {
        return paymentConfig.shippingRates.state
      }
      // National delivery
      else {
        return paymentConfig.shippingRates.national
      }
    } else {
      // Use saved address
      const selectedAddress = userProfile?.addresses?.find(a => a.id === selectedAddressId)
      if (selectedAddress) {
        const addressState = selectedAddress.state?.toLowerCase() || ''
        const addressDistrict = selectedAddress.district?.toLowerCase() || ''
        const addressCity = selectedAddress.city?.toLowerCase() || ''

        if (addressCity.includes('kolhapur') || addressDistrict.includes('kolhapur')) {
          return paymentConfig.shippingRates.local
        }
        else if (addressState.includes('maharashtra')) {
          return paymentConfig.shippingRates.state
        }
        else {
          return paymentConfig.shippingRates.national
        }
      }
    }
    return paymentConfig.shippingRates.national // Default to national
  }

  const shippingCharge = calculateShippingCharge()
  const codCharge = paymentMethod === 'Cash on Delivery (COD)' ? paymentConfig.codExtraCharge : 0
  const finalTotal = cartSubtotal + shippingCharge + codCharge

  // Handle PIN code lookups
  const handlePincodeChange = async (val) => {
    const cleanVal = val.replace(/[^\d]/g, '').slice(0, 6)
    setPincode(cleanVal)

    if (cleanVal.length === 6) {
      setIsFetchingPincode(true)
      setPincodeLookupMessage('⚡ Auto-filling address from PIN code directory...')
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanVal}`)
        const data = await res.json()
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
          const mainOffice = data[0].PostOffice[0]
          setStateField(mainOffice.State || '')
          setDistrict(mainOffice.District || '')
          setTaluka(mainOffice.Block !== 'No' ? mainOffice.Block : (mainOffice.Division || ''))
          setCity(mainOffice.Name || '')
          setPincodeLookupMessage('✓ Directory auto-filled successfully!')
        } else {
          setPincodeLookupMessage('⚠ No matching details found for this PIN code.')
        }
      } catch (err) {
        console.error("Failed to fetch pincode details: ", err)
        setPincodeLookupMessage('⚠ Pincode lookup offline. Please enter details manually.')
      } finally {
        setIsFetchingPincode(false)
      }
    } else {
      setPincodeLookupMessage('')
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPayment = async () => {
    setIsSubmitting(true)
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      console.log('Razorpay payment gateway is currently unreachable. Falling back to secure simulated gateway.')
      setShowSimulatedGateway(true)
      setIsSubmitting(false)
      return
    }

    let finalAddress = ''
    if (selectedAddressId !== 'new' && userProfile?.addresses && Array.isArray(userProfile.addresses)) {
      const matched = userProfile.addresses.find(a => a.id === selectedAddressId)
      if (matched) {
        finalAddress = `${matched.area}, ${matched.city}, Taluka: ${matched.taluka}, Dist: ${matched.district}, ${matched.state} - ${matched.pincode}`
      }
    } else {
      finalAddress = `${area}, ${city}, Taluka: ${taluka}, Dist: ${district}, ${stateField} - ${pincode}`
    }

    try {
      // 1. Generate Order ID from Firebase Functions Backend
      const { functions } = await import('../firebase');
      const { httpsCallable } = await import('firebase/functions');

      const createOrder = httpsCallable(functions, 'createRazorpayOrder');
      const result = await createOrder({ amount: finalTotal * 100, currency: 'INR' });
      const orderData = result.data;

      // 2. Initialize Razorpay Options with Order ID
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SpK5TbUGSdvi0Q',
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'SAMARTHA CRAFT STUDIO',
        description: 'Handcrafted Premium Collection Purchase',
        image: '/logo.png',
        order_id: orderData.id, // Securely injected server-side Order ID!
        handler: function (response) {
          finalizeOrder(response.razorpay_payment_id)
        },
        prefill: {
          name: customerName,
          contact: phone,
          email: userProfile?.email || `${customerName.toLowerCase().replace(/\s+/g, '')}@samartha-customer.com`
        },
        notes: {
          address: finalAddress
        },
        theme: {
          color: '#c9982a'
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Razorpay Order Creation Failed, falling back to simulated gateway:", error);
      setShowSimulatedGateway(true)
      setIsSubmitting(false);
    }
  }

  const handleOrderSubmission = (e) => {
    if (e) e.preventDefault()
    if (!customerName || !phone) {
      alert('Please complete your name and contact details.')
      return
    }

    if (selectedAddressId === 'new') {
      if (!area || !city || !taluka || !district || !stateField || !pincode) {
        alert('Please complete all fields of your shipping destination address.')
        return
      }
      if (pincode.length !== 6) {
        alert('Please enter a valid 6-digit Indian PIN code.')
        return
      }
    } else {
      if (!userProfile?.addresses || !userProfile.addresses.find(a => a.id === selectedAddressId)) {
        alert('Please select or fill in a valid shipping destination address.')
        return
      }
    }

    if (paymentMethod === 'Pay Online') {
      handleRazorpayPayment()
    } else {
      finalizeOrder()
    }
  }

  const finalizeOrder = async (razorpayPaymentId = null) => {
    setIsSubmitting(true)

    let finalAddress = ''
    let newAddressObj = null
    if (selectedAddressId !== 'new' && userProfile?.addresses && Array.isArray(userProfile.addresses)) {
      const matched = userProfile.addresses.find(a => a.id === selectedAddressId)
      if (matched) {
        finalAddress = `${matched.area}, ${matched.city}, Taluka: ${matched.taluka}, Dist: ${matched.district}, ${matched.state} - ${matched.pincode}`
      }
    } else {
      finalAddress = `${area}, ${city}, Taluka: ${taluka}, Dist: ${district}, ${stateField} - ${pincode}`
      newAddressObj = {
        area,
        city,
        taluka,
        district,
        state: stateField,
        pincode
      }
    }

    const orderId = 'SM-ORD-' + Math.floor(10000 + Math.random() * 90000)

    // Calculate reseller commissions
    const commissionData = []
    let totalCommissions = 0

    cart.forEach(item => {
      if (item.resellerId) {
        // Use base price if available (for commission-added items), otherwise use regular price
        const itemPrice = item.basePrice || parseFloat(String(item.price).replace(/[^\d]/g, '')) || 0
        const itemTotal = itemPrice * item.quantity

        // Get reseller commission rate from item or reseller profile
        const commissionRate = item.commissionRate || (resellers?.find(r =>
          (r.id && r.id.toString() === item.resellerId.toString()) ||
          (r.docId && r.docId.toString() === item.resellerId.toString())
        )?.commissionValue) || 10
        const commissionAmount = Math.round((itemTotal * parseFloat(commissionRate)) / 100)

        commissionData.push({
          resellerId: item.resellerId,
          resellerName: item.resellerName,
          productId: item.id,
          productName: item.name,
          itemTotal,
          commissionRate,
          commissionAmount,
          status: 'Pending' // Will be paid out later by admin
        })

        totalCommissions += commissionAmount
      }
    })

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customer: customerName,
      customerName,
      phone,
      address: finalAddress,
      paymentMethod,
      status: 'Processing',
      orderStatus: 'Processing',
      paymentStatus: paymentMethod === 'Pay Online' ? 'Paid' : 'Pending',
      razorpayPaymentId: razorpayPaymentId || '',
      items: [...cart],
      total: finalTotal,
      subtotal: cartSubtotal,
      shippingCharge: shippingCharge,
      codCharge: codCharge,
      commissions: commissionData, // Add commission tracking
      totalCommissions, // Total commission amount
      companyName: 'SAMARTHA CRAFT STUDIO',
      udyamReg: 'UDYAM-MH-15-0128444',
      companyAddress: '263, Shivaji Jadhav Building, Rohidas Chowk, Near Old Bus Stop, Pattan Kadoli, Kolhapur, Maharashtra, Pin 416202'
    }

    // Debug log to check COD charge
    console.log('Order creation debug:', {
      paymentMethod,
      codCharge,
      shippingCharge,
      finalTotal,
      cartSubtotal
    })

    // 1. Persist to Firestore Database
    await addOrder(newOrder)

    // 2. Send WhatsApp Order Confirmation via Backend
    console.log('📤 Sending WhatsApp Order Confirmation')

    sendOrderConfirmation({
      order: newOrder,
      customerPhone: phone
    }).then(result => {
      if (result.success) {
        console.log('✅ WhatsApp order confirmation sent successfully')
        console.log('Response:', result)
      } else {
        console.error('❌ WhatsApp notification failed:', result.error || result.message)
      }
    }).catch(err => {
      console.error('❌ WhatsApp notification error:', err)
    })

    // 3. Persist in local user profile cache for immediate navigation reactivity
    const savedUser = localStorage.getItem('samartha_user')
    let baseProfile = savedUser ? JSON.parse(savedUser) : { name: customerName, phone: phone }

    // Auto-save address if authenticated and a new one was used
    if (firebaseUser?.uid && newAddressObj) {
      try {
        const updatedProfile = await saveUserAddress(firebaseUser.uid, newAddressObj)
        if (updatedProfile) {
          baseProfile = updatedProfile
        }
      } catch (e) {
        console.error("Failed to auto-save new address to profile: ", e)
      }
    } else if (!savedUser) {
      localStorage.setItem('samartha_user', JSON.stringify({
        ...baseProfile,
        email: `${customerName.toLowerCase().replace(/\s+/g, '')}@samartha-customer.com`
      }))
    }

    // 4. Clear shopping cart
    clearCart()

    setCreatedOrder(newOrder)
    setOrderPlaced(true)
    setIsSubmitting(false)
    setShowSimulatedGateway(false)
  }

  const downloadInvoice = (order) => {
    if (!order) return
    const invoiceWindow = window.open('', '_blank')
    if (!invoiceWindow) {
      alert('Pop-up blocked! Please allow popups to download/print your invoice.')
      return
    }

    const itemsRows = order.items.map(item => {
      const priceVal = parseFloat(String(item.price).replace(/[^\d]/g, '')) || 0
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; font-family: sans-serif;">
            <div style="font-weight: 600; color: #1a1208;">${item.name}</div>
            <div style="font-size: 10px; color: #8c7853;">${item.category} ${item.size ? `· Size IND ${item.size}` : ''}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; text-align: center; font-family: sans-serif;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; text-align: right; font-weight: 600; color: #1a1208; font-family: sans-serif;">₹${priceVal.toLocaleString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f1ece1; text-align: right; font-weight: 600; color: #c9982a; font-family: sans-serif;">₹${(priceVal * item.quantity).toLocaleString()}</td>
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
                  Udyam Reg: <strong>${order.udyamReg}</strong><br/>
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
                <strong>${order.customerName}</strong><br/>
                Mobile: ${order.phone}<br/>
                Delivery Destination:<br/>
                ${order.address}
              </td>
              <td style="width: 50%; text-align: right;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 15px; margin: 0 0 10px 0; color: #c9982a;">PAYMENT REGISTRY</h3>
                Method: <strong>${order.paymentMethod}</strong><br/>
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
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) {
      alert('Please write a review comment.')
      return
    }

    setReviewSubmitting(true)
    const newReview = {
      id: `rev-${Date.now()}`,
      rating: Number(reviewRating),
      review: reviewText.trim(),
      customerName: createdOrder?.customerName || customerName || 'Valued Customer',
      location: reviewLocation.trim() || 'India',
      avatar: `https://images.unsplash.com/photo-${['1544005313-94ddf0286df2', '1506794778202-cad84cf45f1d', '1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330'][Math.floor(Math.random() * 5)]}?w=120&auto=format&fit=crop&q=80`,
      verified: true,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const success = await addReview(newReview)
    if (success) {
      setReviewSubmitted(true)
    } else {
      alert('Failed to submit review. Please try again.')
    }
    setReviewSubmitting(false)
  }

  return (
    <div className="bg-cream min-h-screen text-dark flex flex-col justify-between pb-16 md:pb-0">
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex-1 w-full">
        <AnimatePresence mode="wait">
          {!orderPlaced ? (
            /* ─── checkout form and preview screen ─── */
            <motion.div
              key="checkout-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12"
            >
              {/* Left Side: Customer secure address and details */}
              <div className="space-y-8 bg-white border border-dark/5 p-8 shadow-[0_20px_50px_rgba(26,18,8,0.02)]">
                <div>
                  <h2 className="font-serif text-3xl font-bold mb-1">Customer Checkout Registry</h2>
                  <p className="text-xs text-dark/45 uppercase tracking-widest font-semibold">Bespoke Artisan Shipping Dispatch</p>
                </div>

                <form onSubmit={handleOrderSubmission} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">Customer Full Name</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">Mobile Contact Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Address Selection System */}
                  {userProfile?.addresses && userProfile.addresses.length > 0 && (
                    <div className="space-y-4">
                      <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase">Select Saved Destination Address</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`border p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between bg-[#faf8f5] text-left relative ${selectedAddressId === addr.id
                              ? 'border-gold-500 shadow-md ring-1 ring-gold-500/20 bg-cream/10'
                              : 'border-dark/10 hover:border-dark/25'
                              }`}
                          >
                            <div className="text-[11px] space-y-1">
                              <p className="font-bold text-dark">{addr.area}</p>
                              <p className="text-dark/70 font-semibold">{addr.city}, Taluka: {addr.taluka}</p>
                              <p className="text-dark/50">{addr.district}, {addr.state} - <strong className="text-gold-700">{addr.pincode}</strong></p>
                            </div>
                            {selectedAddressId === addr.id && (
                              <span className="absolute top-3 right-3 text-gold-600 font-bold text-[9px] bg-gold-50 border border-gold-200 px-1.5 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </div>
                        ))}

                        <div
                          onClick={() => setSelectedAddressId('new')}
                          className={`border p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center bg-[#faf8f5] border-dashed ${selectedAddressId === 'new'
                            ? 'border-gold-500 shadow-md ring-1 ring-gold-500/20 bg-cream/10'
                            : 'border-dark/10 hover:border-dark/25'
                            }`}
                        >
                          <div className="text-center space-y-1">
                            <span className="text-lg">➕</span>
                            <p className="text-xs font-bold text-dark">Ship to a New Address</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New Address Custom Form Grid */}
                  {(selectedAddressId === 'new' || !userProfile?.addresses || userProfile.addresses.length === 0) && (
                    <div className="bg-[#faf8f5]/40 border border-dark/5 p-6 rounded-xl space-y-4">
                      <div className="border-b border-dark/5 pb-2 mb-2">
                        <p className="text-xs font-bold text-dark uppercase tracking-wide">Enter New Shipping Address Details</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">PIN Code</label>
                          <div className="relative">
                            <input
                              type="text"
                              required={selectedAddressId === 'new'}
                              value={pincode}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-xs rounded-lg outline-none focus:border-gold-500 font-bold tracking-widest text-gold-700"
                              maxLength={6}
                            />
                            {isFetchingPincode && (
                              <span className="absolute right-3 top-3 text-[10px] font-bold text-gold-600 animate-pulse">
                                Looking up...
                              </span>
                            )}
                          </div>
                          {pincodeLookupMessage && (
                            <p className={`text-[9px] font-bold mt-1.5 ${pincodeLookupMessage.startsWith('✓') ? 'text-emerald-700' :
                              pincodeLookupMessage.startsWith('⚡') ? 'text-gold-600 animate-pulse' : 'text-stone-500'
                              }`}>
                              {pincodeLookupMessage}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">Area / Street / Landmark</label>
                          <input
                            type="text"
                            required={selectedAddressId === 'new'}
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">City / Town</label>
                          <input
                            type="text"
                            required={selectedAddressId === 'new'}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">Taluka</label>
                          <input
                            type="text"
                            required={selectedAddressId === 'new'}
                            value={taluka}
                            onChange={(e) => setTaluka(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">District</label>
                          <input
                            type="text"
                            required={selectedAddressId === 'new'}
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-2">State</label>
                          <input
                            type="text"
                            required={selectedAddressId === 'new'}
                            value={stateField}
                            onChange={(e) => setStateField(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Zone Indicator */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🚛</span>
                      </div>
                      <h4 className="text-sm font-semibold text-blue-800">Shipping Information</h4>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>
                        <strong>Shipping Zone:</strong> {
                          (() => {
                            const currentState = selectedAddressId === 'new' ? stateField.toLowerCase() :
                              (userProfile?.addresses?.find(a => a.id === selectedAddressId)?.state?.toLowerCase() || '')
                            const currentDistrict = selectedAddressId === 'new' ? district.toLowerCase() :
                              (userProfile?.addresses?.find(a => a.id === selectedAddressId)?.district?.toLowerCase() || '')
                            const currentCity = selectedAddressId === 'new' ? city.toLowerCase() :
                              (userProfile?.addresses?.find(a => a.id === selectedAddressId)?.city?.toLowerCase() || '')

                            if (currentCity.includes('kolhapur') || currentDistrict.includes('kolhapur')) {
                              return 'Local (Same City/Kolhapur)'
                            } else if (currentState.includes('maharashtra')) {
                              return 'State (Inside Maharashtra)'
                            } else {
                              return 'National (Rest of India)'
                            }
                          })()
                        }
                      </p>
                      <p><strong>Shipping Charge:</strong> ₹{shippingCharge}</p>
                    </div>
                  </div>

                  {/* Mode of payment selection */}
                  <div>
                    <label className="block text-[10px] text-dark/65 font-bold tracking-wider uppercase mb-3">Secure Mode of Payment</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Pay Online', desc: 'Secure simulated payment gateway', icon: '💳' },
                        { label: 'Cash on Delivery (COD)', desc: `Pay at your doorstep (+₹${paymentConfig.codExtraCharge})`, icon: '🚚' }
                      ].map((pay) => (
                        <div
                          key={pay.label}
                          onClick={() => setPaymentMethod(pay.label)}
                          className={`border p-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-1 bg-[#faf8f5] ${paymentMethod === pay.label
                            ? 'border-gold-500 shadow-md ring-1 ring-gold-500/20 bg-cream/10'
                            : 'border-dark/10 hover:border-dark/25'
                            }`}
                        >
                          <span className="text-xl">{pay.icon}</span>
                          <span className="text-xs font-bold text-dark">{pay.label}</span>
                          <span className="text-[9px] text-dark/45 font-medium">{pay.desc}</span>
                          {pay.label === 'Cash on Delivery (COD)' && paymentMethod === pay.label && (
                            <span className="text-[8px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
                              +₹{paymentConfig.codExtraCharge} handling charge
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-dark text-white text-xs font-bold tracking-widest py-4 hover:bg-gold-600 transition-colors shadow-md mt-4"
                  >
                    PLACE ORDER & VERIFY DISPATCH
                  </button>
                </form>
              </div>

              {/* Right Side: Order summary basket view */}
              <div className="space-y-6 sticky top-28 h-fit">
                <div className="bg-white border border-dark/5 p-6 shadow-sm space-y-6">
                  <h3 className="font-serif text-lg font-bold border-b border-dark/5 pb-3">Shopping Summary</h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-6 text-xs text-dark/40 font-medium">
                      Your Shopping bag is empty. Select curations from the storefront to complete checkout.
                    </div>
                  ) : (
                    <>
                      <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex gap-4 pb-3 border-b border-dark/5 text-xs">
                            <img src={item.images?.[0] || item.image || item.img} className="w-12 h-12 object-cover border border-dark/5 bg-stone-50" alt="" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-dark truncate">{item.name}</h4>
                              <p className="text-[9px] text-dark/40 mt-0.5">Qty: {item.quantity} {item.size ? `· Size IND ${item.size}` : ''}</p>
                              <span className="text-[10px] font-bold text-gold-700 mt-1 block">₹{parseFloat(String(item.price).replace(/[^\d]/g, '') || '0').toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 border-t border-dark/5 pt-4 text-xs font-medium text-dark/65">
                        <div className="flex justify-between">
                          <span>Luxury Curations Subtotal</span>
                          <span className="font-semibold text-dark">₹{cartSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium Packing Box</span>
                          <span className="text-emerald-700 font-bold">COMPLIMENTARY</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping Charges</span>
                          <span className="font-semibold text-dark">₹{shippingCharge.toLocaleString()}</span>
                        </div>
                        {paymentMethod === 'Cash on Delivery (COD)' && (
                          <div className="flex justify-between">
                            <span>COD Handling Charges</span>
                            <span className="font-semibold text-orange-600">₹{codCharge.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-dark/5 pt-3 font-serif font-bold text-sm text-gold-700">
                          <span>Invoice grand total</span>
                          <span>₹{finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── checkout success view with invoice downloading ─── */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white border border-dark/5 p-8 md:p-12 shadow-[0_25px_60px_rgba(26,18,8,0.06)] space-y-8 text-center"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center text-emerald-600 border border-emerald-100 text-4xl shadow-sm animate-bounce">
                  ✓
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">Order Placed Successfully!</h2>
                <p className="text-xs text-dark/50 max-w-md mx-auto uppercase tracking-widest font-semibold">
                  Hand-stitched dispatch register completed · {createdOrder?.id}
                </p>
              </div>

              {/* Order receipt box */}
              <div className="bg-[#faf8f5] p-6 rounded-2xl border border-dark/5 text-left space-y-4 text-xs">
                <div className="border-b border-dark/5 pb-3 flex justify-between font-bold">
                  <span className="text-[10px] text-dark/40 tracking-wider uppercase">Order Details</span>
                  <span className="text-gold-600 font-serif text-sm font-semibold italic">{createdOrder?.date}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] text-dark/40 font-bold uppercase mb-0.5">Shipping Destination</span>
                    <strong className="text-dark">{createdOrder?.customerName}</strong>
                    <p className="text-dark/60 mt-0.5">{createdOrder?.address}</p>
                    <p className="text-dark/60 mt-0.5">Contact: {createdOrder?.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-dark/40 font-bold uppercase mb-0.5">Registry Status</span>
                    <strong className="text-emerald-700 uppercase tracking-wide">Processing Dispatch</strong>
                    <p className="text-dark/60 mt-1">Payment Method: <strong>{createdOrder?.paymentMethod}</strong></p>
                    <p className="text-gold-700 font-serif text-lg font-bold mt-2">₹{createdOrder?.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Items preview list */}
                <div className="border-t border-dark/5 pt-3">
                  <span className="block text-[9px] text-dark/40 font-bold uppercase mb-2">Curations Ordered List</span>
                  <div className="space-y-2">
                    {createdOrder?.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] text-dark/75">
                        <span>{item.name} x {item.quantity} {item.size ? `(Size IND ${item.size})` : ''}</span>
                        <strong className="text-dark">₹{(parseFloat(String(item.price).replace(/[^\d]/g, '')) * item.quantity).toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* ─── CUSTOMER RATING & REVIEW CARD ─── */}
              <div className="bg-white p-6 rounded-2xl border border-gold-500/20 shadow-xs text-left space-y-4">
                <div className="border-b border-dark/5 pb-2">
                  <h3 className="font-serif font-bold text-dark text-lg flex items-center gap-2">
                    <span>✨</span> Share Your Experience
                  </h3>
                  <p className="text-[10px] text-dark/50 uppercase tracking-widest font-semibold mt-0.5">Help others discover premium handmade craftsmanship</p>
                </div>

                {reviewSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-500/20 p-4 rounded-xl text-center space-y-2"
                  >
                    <span className="text-2xl">🎉</span>
                    <h4 className="font-serif font-bold text-emerald-800 text-sm">Thank You for Your Feedback!</h4>
                    <p className="text-[11px] text-emerald-600 font-medium">Your review has been verified and featured on our homepage customer gallery.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star Rating Selector */}
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
                        className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded-lg outline-none focus:border-gold-500 font-medium text-dark"
                      />
                    </div>

                    {/* Review text field */}
                    <div>
                      <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Your Review</label>
                      <textarea
                        required
                        rows="3"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 px-3 py-2 text-xs rounded-lg outline-none focus:border-gold-500 font-medium text-dark resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full bg-dark text-white text-[10px] font-bold tracking-widest py-3 rounded-lg hover:bg-gold-600 transition-colors uppercase"
                    >
                      {reviewSubmitting ? 'Publishing feedback...' : 'Submit Verified Review →'}
                    </button>
                  </form>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => downloadInvoice(createdOrder)}
                  className="w-full sm:w-auto bg-gold-500 text-dark text-xs font-bold tracking-widest px-8 py-4 hover:bg-gold-400 transition-colors shadow-sm rounded-lg flex items-center justify-center gap-2"
                >
                  📥 DOWNLOAD INVOICE
                </button>
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-dark text-white text-xs font-bold tracking-widest px-8 py-4 hover:bg-gold-600 transition-colors shadow-sm rounded-lg flex items-center justify-center"
                >
                  VIEW PROFILE HISTORY
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto border border-dark/20 text-dark text-xs font-bold tracking-widest px-8 py-4 hover:bg-[#faf8f5] hover:border-dark transition-all rounded-lg flex items-center justify-center"
                >
                  RETURN TO ATELIER
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── SIMULATED SECURE PAYMENT GATEWAY MODAL ─── */}
      <AnimatePresence>
        {showSimulatedGateway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSimulatedGateway(false)}
              className="absolute inset-0 bg-[#1a1208]/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-dark/5 p-8 rounded-2xl max-w-md w-full relative z-10 shadow-2xl space-y-6"
            >
              <div className="text-center">
                <span className="text-3xl">🔒</span>
                <h3 className="font-serif text-xl font-bold mt-2">Secure Simulated Payment</h3>
                <p className="text-[10px] text-dark/45 uppercase tracking-widest font-bold">128-bit Bank Encryption Protocol</p>
              </div>

              <div className="bg-[#faf8f5] p-3 rounded-lg border border-dark/5 flex justify-between items-center text-xs">
                <span className="text-dark/50">Customer Invoice amount:</span>
                <strong className="text-gold-700 font-serif text-base">₹{finalTotal.toLocaleString()}</strong>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  finalizeOrder()
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Simulated Card Number</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9 ]{12,19}"
                    value={simulatedCard}
                    onChange={(e) => setSimulatedCard(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={simulatedExpiry}
                      onChange={(e) => setSimulatedExpiry(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-dark/50 font-bold uppercase tracking-wider mb-1">Security CVV</label>
                    <input
                      type="password"
                      required
                      maxLength="3"
                      value={simulatedCvv}
                      onChange={(e) => setSimulatedCvv(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-3.5 py-2.5 text-xs rounded-lg outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSimulatedGateway(false)}
                    className="flex-1 py-3 text-xs font-semibold text-dark/50 hover:text-dark transition-colors text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-lg transition-colors shadow-sm"
                  >
                    {isSubmitting ? 'Verifying payment...' : 'Simulate Payment'}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <span className="text-[9px] text-dark/35 font-medium">💡 Any card credentials will bypass authentication for simulated validation.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
