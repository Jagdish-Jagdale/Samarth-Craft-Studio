import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { userProfile, setUserProfile, orders, loadingAuth, cancelOrder, requestOrderCancellation } = useApp()
  const currentUser = userProfile

  // Navigation Tabs: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('login')

  // Login Type: 'password' | 'otp'
  const [loginType, setLoginType] = useState('password')

  // OTP Flow States (Mobicomm API integration)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(120) // 120s countdown like Android timer
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [serverOtp, setServerOtp] = useState('')

  // Profile Editing States
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAvatar, setEditAvatar] = useState('')

  // Address Directory states
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [addrPincode, setAddrPincode] = useState('')
  const [addrArea, setAddrArea] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrTaluka, setAddrTaluka] = useState('')
  const [addrDistrict, setAddrDistrict] = useState('')
  const [addrState, setAddrState] = useState('')
  const [loadingPincode, setLoadingPincode] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)

  // Fields state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPhone, setSignUpPhone] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)

  // Notifications
  const [notification, setNotification] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [otpSent, timer])

  // Handle Google Redirect Result on mount (in case popup was blocked and fallback redirect was used)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result && result.user) {
          const user = result.user
          setNotification('Google Authentication Successful!')

          const userDocRef = doc(db, 'users', user.uid)
          const userDocSnap = await getDoc(userDocRef)

          let profile;
          if (userDocSnap.exists()) {
            const existingData = userDocSnap.data()
            profile = {
              ...existingData,
              uid: user.uid,
              name: existingData.name || user.displayName || 'Bespoke Customer',
              email: existingData.email || user.email || '',
              avatar: existingData.avatar || user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            }
          } else {
            profile = {
              uid: user.uid,
              name: user.displayName || 'Bespoke Customer',
              email: user.email || '',
              phone: user.phoneNumber || '',
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            }
          }

          await setDoc(userDocRef, profile, { merge: true })
          setNotification('Logged in successfully with Google!')
          setTimeout(() => setNotification(''), 1500)
        }
      } catch (err) {
        console.error("Google Redirect Result Error: ", err)
        setErrorMsg(err.message || 'Google redirection authentication failed.')
      }
    }
    handleRedirectResult()
  }, [])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!phone) {
      setErrorMsg('Please enter a valid mobile number.')
      return
    }
    setErrorMsg('')

    const cleanPhone = phone.trim().replace(/[^\d]/g, '')
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.')
      return
    }

    // Generate 6-digit secure random OTP code
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000))
    setServerOtp(generatedOtp)

    const smsMessage = `Your Verification Code for login is ${generatedOtp}. - Expertskill Technology.`
    const encodedMessage = encodeURIComponent(smsMessage)

    // Mobicomm secure API gateway URL matching Java setup
    const url = `https://mobicomm.dove-sms.com/submitsms.jsp?user=Experts&key=ba9dcdcdfcXX&mobile=+91${cleanPhone}&message=${encodedMessage}&accusage=1&senderid=EXTSKL`

    setNotification('Sending secure OTP code...')

    try {
      // Hitting mobicomm.dove-sms.com gateway (mode: 'no-cors' fallback to bypass CORS headers)
      await fetch(url, { mode: 'cors' }).catch(async () => {
        return await fetch(url, { mode: 'no-cors' })
      })

      setOtpSent(true)
      setTimer(120)
      setNotification('OTP code sent successfully!')
      setTimeout(() => setNotification(''), 4000)
      // OTP sent via SMS - check your phone for verification code
    } catch (err) {
      console.error("SMS Gateway Error: ", err)
      setErrorMsg('Failed to send OTP. Please check your connection or try again.')
      setNotification('')
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const codeStr = otpCode.join('')

    if (!codeStr || codeStr.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.')
      return
    }

    if (codeStr === serverOtp) {
      setOtpSuccess(true)
      setErrorMsg('')
      setNotification('OTP Verified successfully!')

      try {
        const cleanPhone = phone.trim().replace(/[^\d]/g, '')
        const virtualEmail = `otp_${cleanPhone}@samartha.com`
        let user;
        let isNewUser = false;

        try {
          const cred = await signInWithEmailAndPassword(auth, virtualEmail, 'otpSecret123')
          user = cred.user
        } catch (authErr) {
          // Register them if user profile doesn't exist
          const cred = await createUserWithEmailAndPassword(auth, virtualEmail, 'otpSecret123')
          user = cred.user
          isNewUser = true
        }

        // Check if user profile already exists in Firestore
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)

        let profile;
        if (userDocSnap.exists() && !isNewUser) {
          // User exists - preserve their existing name and email, only update phone if needed
          const existingData = userDocSnap.data()
          profile = {
            ...existingData,
            uid: user.uid,
            phone: '+91 ' + cleanPhone, // Update phone number
            // Keep existing name and email
            name: existingData.name || 'CUSTOMER ' + cleanPhone.substring(6),
            email: existingData.email || virtualEmail
          }
        } else {
          // New user - create default profile
          profile = {
            uid: user.uid,
            name: 'CUSTOMER ' + cleanPhone.substring(6),
            email: virtualEmail,
            phone: '+91 ' + cleanPhone,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
          }
        }

        await setDoc(userDocRef, profile, { merge: true })
        setNotification('Customer Session Authenticated!')
      } catch (err) {
        console.error("OTP login database entry failed: ", err)
        setErrorMsg('Authentication error. Please try again.')
      }

      setTimeout(() => {
        setNotification('')
      }, 1500)
    } else {
      setErrorMsg('Invalid OTP. Please check the code and try again.')
    }
  }

  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStartEditProfile = () => {
    if (currentUser) {
      setEditName(currentUser.name || '')
      setEditEmail(currentUser.email || '')
      setEditPhone(currentUser.phone || '')
      setEditAvatar(currentUser.avatar || '')
      setIsEditingProfile(true)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!editName.trim()) {
      setErrorMsg('Name field is required.')
      return
    }

    setNotification('Saving profile modifications...')
    setErrorMsg('')

    try {
      const updatedProfile = {
        ...currentUser,
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        avatar: editAvatar.trim()
      }

      // Save modified profile to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true })

      // Synchronize context and local storage
      setUserProfile(updatedProfile)
      localStorage.setItem('samartha_user', JSON.stringify(updatedProfile))

      setNotification('Profile updated successfully!')
      setIsEditingProfile(false)
      setTimeout(() => setNotification(''), 3000)
    } catch (err) {
      console.error("Failed to save profile changes: ", err)
      setErrorMsg('Failed to save profile. Please try again.')
      setNotification('')
    }
  }

  // Pincode auto-lookup hook
  useEffect(() => {
    const lookupPincode = async () => {
      const cleanPin = addrPincode.trim().replace(/[^\d]/g, '')
      if (cleanPin.length === 6) {
        setLoadingPincode(true)
        setErrorMsg('')
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`)
          const data = await res.json()
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffices = data[0].PostOffice
            if (postOffices && postOffices.length > 0) {
              const po = postOffices[0]
              setAddrState(po.State || '')
              setAddrDistrict(po.District || '')
              setAddrTaluka(po.Block || po.Taluk || po.Name || '')
              setAddrCity(po.Division || po.Circle || po.Name || '')
              setNotification('Pincode details fetched successfully!')
              setTimeout(() => setNotification(''), 3000)
            }
          } else {
            setErrorMsg('Invalid Pincode. Please enter a valid 6-digit postal code.')
          }
        } catch (e) {
          console.error("Pincode lookup error:", e)
        } finally {
          setLoadingPincode(false)
        }
      }
    }
    lookupPincode()
  }, [addrPincode])

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    if (!addrPincode || !addrArea || !addrCity) {
      setErrorMsg('Pincode, Area/Street, and City are required fields.')
      return
    }

    setNotification(editingAddressId ? 'Updating address...' : 'Adding address to directory...')
    setErrorMsg('')

    try {
      const newAddress = {
        id: editingAddressId || Date.now().toString(),
        area: addrArea.trim(),
        city: addrCity.trim(),
        taluka: addrTaluka.trim(),
        district: addrDistrict.trim(),
        state: addrState.trim(),
        pincode: addrPincode.trim()
      }

      const existingAddresses = Array.isArray(currentUser?.addresses) ? currentUser.addresses : []

      let updatedAddresses
      if (editingAddressId) {
        updatedAddresses = existingAddresses.map(addr => addr.id === editingAddressId ? newAddress : addr)
      } else {
        updatedAddresses = [...existingAddresses, newAddress]
      }

      const updatedProfile = {
        ...currentUser,
        addresses: updatedAddresses
      }

      // Update Firestore document
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true })

      // Update local context
      setUserProfile(updatedProfile)
      localStorage.setItem('samartha_user', JSON.stringify(updatedProfile))

      // Clear form inputs
      setAddrPincode('')
      setAddrArea('')
      setAddrCity('')
      setAddrTaluka('')
      setAddrDistrict('')
      setAddrState('')
      setIsAddingAddress(false)
      setEditingAddressId(null)
      setNotification(editingAddressId ? 'Address updated successfully!' : 'Address added successfully to your profile!')
      setTimeout(() => setNotification(''), 3500)
    } catch (err) {
      console.error("Failed to add address:", err)
      setErrorMsg('Failed to save address. Please try again.')
      setNotification('')
    }
  }

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id)
    setAddrPincode(addr.pincode || '')
    setAddrArea(addr.area || '')
    setAddrCity(addr.city || '')
    setAddrTaluka(addr.taluka || '')
    setAddrDistrict(addr.district || '')
    setAddrState(addr.state || '')
    setIsAddingAddress(true)
    setErrorMsg('')
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    setNotification('Removing address...')

    try {
      const existingAddresses = Array.isArray(currentUser?.addresses) ? currentUser.addresses : []
      const updatedAddresses = existingAddresses.filter(addr => addr.id !== addressId)

      const updatedProfile = {
        ...currentUser,
        addresses: updatedAddresses
      }

      // Update Firestore document
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true })

      // Update local context
      setUserProfile(updatedProfile)
      localStorage.setItem('samartha_user', JSON.stringify(updatedProfile))

      setNotification('Address deleted successfully!')
      setTimeout(() => setNotification(''), 3000)
    } catch (err) {
      console.error("Failed to delete address:", err)
      setErrorMsg('Failed to delete address. Please try again.')
      setNotification('')
    }
  }

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    if (email && password) {
      try {
        setNotification('Authenticating...')
        setErrorMsg('')
        await signInWithEmailAndPassword(auth, email, password)
        setNotification('Logged in successfully!')
        setTimeout(() => setNotification(''), 1500)
      } catch (err) {
        console.error("Firebase Login Error: ", err)
        setErrorMsg(err.message.includes('auth/invalid-credential') ? 'Invalid email or password.' : err.message)
        setNotification('')
      }
    } else {
      setErrorMsg('Please fill in all fields.')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (name && signUpEmail && signUpPhone && signUpPassword) {
      try {
        setNotification('Registering account with Firebase...')
        setErrorMsg('')

        const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        const user = userCredential.user

        // Save custom profile data to Firestore
        const profile = {
          uid: user.uid,
          name: name,
          email: signUpEmail,
          phone: signUpPhone,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        }
        await setDoc(doc(db, 'users', user.uid), profile)

        setNotification('Account registered successfully! Welcome to Samartha Studio.')
        setTimeout(() => setNotification(''), 1500)
      } catch (err) {
        console.error("Firebase SignUp Error: ", err)
        setErrorMsg(err.message)
        setNotification('')
      }
    } else {
      setErrorMsg('Please fill in all required registration fields.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setNotification('Initiating Google Authentication...')
      setErrorMsg('')

      const provider = new GoogleAuthProvider()

      let result;
      try {
        result = await signInWithPopup(auth, provider)
      } catch (popupErr) {
        if (popupErr.code === 'auth/popup-blocked') {
          setNotification('Popup blocked. Redirecting to Google Login...')
          await signInWithRedirect(auth, provider)
          return
        } else {
          throw popupErr
        }
      }

      const user = result.user

      // Check if user profile already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)

      let profile;
      if (userDocSnap.exists()) {
        const existingData = userDocSnap.data()
        profile = {
          ...existingData,
          uid: user.uid,
          name: existingData.name || user.displayName || 'Bespoke Customer',
          email: existingData.email || user.email || '',
          avatar: existingData.avatar || user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }
      } else {
        profile = {
          uid: user.uid,
          name: user.displayName || 'Bespoke Customer',
          email: user.email || '',
          phone: user.phoneNumber || '',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        }
      }

      await setDoc(userDocRef, profile, { merge: true })
      setNotification('Logged in successfully with Google!')
      setTimeout(() => setNotification(''), 1500)
    } catch (err) {
      console.error("Google Login Error: ", err)
      setErrorMsg(err.message || 'Google authentication failed.')
      setNotification('')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setNotification('Logged out successfully.')
      setTimeout(() => setNotification(''), 1500)
    } catch (e) {
      console.error(e)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to request cancellation for this order? A confirmation message will be sent to your WhatsApp. You must reply "Yes" on WhatsApp to complete the cancellation.')) {
      return
    }

    setNotification('Sending cancellation request to WhatsApp...')
    try {
      const order = orders.find(o => o.id === orderId)
      const phone = order?.phone || currentUser?.phone || ''
      const customerName = order?.customerName || order?.customer || currentUser?.name || 'Customer'

      const success = await requestOrderCancellation(orderId, phone, customerName)
      if (success) {
        setNotification('Request sent! Please check your WhatsApp to confirm.')
        setTimeout(() => setNotification(''), 5000)
      } else {
        setErrorMsg('Failed to send cancellation request. Please try again.')
      }
    } catch (err) {
      console.error('Error requesting order cancellation:', err)
      setErrorMsg('Failed to send cancellation request. Please try again.')
    }
  }

  const canCancelOrder = (orderDate) => {
    // Check if order was placed within last 2 hours
    try {
      // Parse the date string (format: "18 May 2026, 10:30")
      const orderDateStr = orderDate.replace(',', '')
      const orderTime = new Date(orderDateStr)
      const now = new Date()
      const diffInHours = (now - orderTime) / (1000 * 60 * 60)
      return diffInHours <= 2
    } catch (e) {
      console.error('Error parsing order date:', e)
      return false
    }
  }

  const handleOtpInputChange = (index, value) => {
    if (isNaN(value)) return
    const nextOtp = [...otpCode]
    nextOtp[index] = value
    setOtpCode(nextOtp)

    // Auto-focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasteData = e.clipboardData.getData('text')
    const numbersOnly = pasteData.replace(/[^\d]/g, '')
    if (numbersOnly.length === 6) {
      const otpArray = numbersOnly.split('')
      setOtpCode(otpArray)

      // Focus the last input field
      const lastInput = document.getElementById('otp-5')
      if (lastInput) lastInput.focus()
    }
  }

  // Filter orders related to this user dynamically from Firestore!
  const userOrders = orders.filter(o => {
    if (!currentUser) return false;

    // Safe phone comparison with null checks and string conversion
    const phoneMatch = o.phone && currentUser.phone
      ? String(o.phone).replace(/[^\d]/g, '') === String(currentUser.phone).replace(/[^\d]/g, '')
      : false;

    // Safe name comparison with null checks and string conversion
    const nameMatch = (o.customerName && currentUser.name && String(o.customerName).toLowerCase() === String(currentUser.name).toLowerCase()) ||
      (o.customer && currentUser.name && String(o.customer).toLowerCase() === String(currentUser.name).toLowerCase());

    // Safe email comparison with null checks and string conversion
    const emailMatch = o.customerEmail && currentUser.email
      ? String(o.customerEmail).toLowerCase() === String(currentUser.email).toLowerCase()
      : false;

    return phoneMatch || nameMatch || emailMatch;
  })

  const downloadInvoice = (order) => {
    if (!order) return
    const invoiceWindow = window.open('', '_blank')
    if (!invoiceWindow) {
      alert('Pop-up blocked! Please allow popups to download your invoice.')
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
                  Udyam Reg: <strong>\${order.udyamReg || 'UDYAM-MH-15-0128444'}</strong><br/>
                  GST No: <strong>27CKEPJ8626F1Z1</strong><br/>
                  Founder: Shri Nikhil Shivaji Jadhav (Est. 2019)
                </div>
              </td>
              <td style="text-align: right;">
                <div style="font-size: 12px; color: #1a1208; margin-top: 10px;">
                  Invoice No: <strong>\${order.id}</strong><br/>
                  Date: \${order.date}
                </div>
              </td>
            </tr>
          </table>

          <table class="meta-section">
            <tr>
              <td style="width: 50%;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 15px; margin: 0 0 10px 0; color: #c9982a; border-left: 2px solid #c9982a; padding-left: 8px;">CURATED CUSTOMER DETAIL</h3>
                <strong>\${order.customerName || order.customer || 'Bespoke Customer'}</strong><br/>
                Mobile: \${order.phone || '+91 99000 12345'}<br/>
                Delivery Destination:<br/>
                \${order.address || 'Handcrafted Curation Cluster, India'}
              </td>
              <td style="width: 50%; text-align: right;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 15px; margin: 0 0 10px 0; color: #c9982a;">PAYMENT REGISTRY</h3>
                Method: <strong>\${order.paymentMethod || 'Paid Securely Online'}</strong><br/>
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
              \${itemsRows}
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
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right;">₹\${order.total.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #666;">Artisan Packaging</td>
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right; color: #10b981;">Complimentary</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #666;">Express Cargo</td>
                    <td style="padding: 5px 0; font-size: 12px; font-weight: 600; text-align: right; color: #10b981;">Free Shipping</td>
                  </tr>
                  <tr style="border-top: 1px solid #c9982a;">
                    <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #c9982a;">Total Invoice</td>
                    <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #c9982a; text-align: right;">₹\${order.total.toLocaleString()}</td>
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

  if (loadingAuth) {
    return (
      <div className="bg-cream min-h-screen text-dark flex items-center justify-center font-serif text-lg pb-16 md:pb-0">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-dark/50">Establishing Secure Session...</p>
        </div>
      </div>
    )
  }

  if (currentUser) {
    /* ─── RENDERS LUXURY AUTHENTICATED CUSTOMER ACCOUNT DASHBOARD ─── */
    return (
      <div className="bg-cream min-h-screen text-dark flex flex-col justify-between pb-16 md:pb-0">
        <Navbar />

        <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex-1 w-full space-y-12">
          {/* Header Profile card */}
          <div className="bg-white border border-dark/5 p-8 rounded-2xl shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -z-10"></div>

            {!isEditingProfile ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Profile Photo Display */}
                  <div className="relative group cursor-pointer" onClick={handleStartEditProfile}>
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                      alt={currentUser.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gold-500/25 shadow-lg group-hover:scale-105 transition-transform duration-300 bg-stone-100"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-[10px] font-bold font-sans">
                      CHANGE
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block mb-1">Authenticated Bespoke Customer</span>
                    <h2 className="font-serif text-3xl font-bold text-dark">{currentUser.name}</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-dark/50">
                      <span>📧 {currentUser.email}</span>
                      <span>📞 {currentUser.phone}</span>
                      <span>✦ Member since {currentUser.joined || 'May 2026'}</span>
                    </div>

                    {/* Edit profile trigger */}
                    <button
                      onClick={handleStartEditProfile}
                      className="text-[10px] font-bold text-gold-600 hover:text-gold-500 underline mt-4 block"
                    >
                      ✏️ EDIT PROFILE DETAILS
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-xs font-bold tracking-widest border border-dark/25 px-6 py-3 hover:bg-[#faf8f5] transition-all rounded-lg"
                >
                  DISCONNECT SESSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                <div>
                  <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block mb-4">Modify Bespoke Profile</span>

                  {/* Profile Photo Selector */}
                  <div className="mb-6 space-y-3">
                    <label className="block text-[10px] font-bold tracking-widest text-dark/60 uppercase mb-1">Bespoke Profile Photo</label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#faf8f5] p-4 rounded-xl border border-dark/5">
                      <img
                        src={editAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gold-500/20 shadow-md bg-stone-100"
                      />
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editAvatar.startsWith('data:image/') ? '[Uploaded File]' : editAvatar}
                            onChange={(e) => setEditAvatar(e.target.value)}
                            disabled={editAvatar.startsWith('data:image/')}
                            className="flex-1 bg-white border border-dark/10 rounded-lg px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500 font-medium disabled:opacity-55"
                          />
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dark/25 hover:border-gold-600 hover:text-gold-600 text-[10px] font-bold px-4 py-2.5 transition-all rounded-lg uppercase tracking-wider flex items-center gap-1.5 shrink-0 bg-white"
                          >
                            📤 Upload File
                          </button>
                          {editAvatar.startsWith('data:image/') && (
                            <button
                              type="button"
                              onClick={() => setEditAvatar('')}
                              className="text-red-500 hover:text-red-700 text-[10px] font-bold px-2 py-2 transition-colors uppercase"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Premium presets */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] text-dark/40 font-bold uppercase tracking-wide">Or choose a luxury preset:</span>
                          <div className="flex gap-1.5">
                            {[
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
                              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
                              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
                            ].map((presetUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setEditAvatar(presetUrl)}
                                className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${editAvatar === presetUrl ? 'border-gold-500 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                                  }`}
                              >
                                <img src={presetUrl} className="w-full h-full object-cover" alt={`Preset ${idx + 1}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-dark/60 uppercase mb-1">Customer Full Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 rounded-lg px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-gold-500 font-serif font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-dark/60 uppercase mb-1">Contact Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 rounded-lg px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold tracking-widest text-dark/60 uppercase mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 rounded-lg px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-dark text-white text-[10px] font-bold tracking-widest px-6 py-3 hover:bg-gold-600 transition-colors uppercase rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="border border-dark/20 text-dark text-[10px] font-bold tracking-widest px-6 py-3 hover:bg-stone-50 transition-colors uppercase rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Orders Panel Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border-b border-dark/5 pb-3">
                <h3 className="font-serif text-xl font-bold">Customer Order Registry</h3>
                <p className="text-xs text-dark/40">Real-time status updates and handcrafted dispatch histories.</p>
              </div>

              {userOrders.length === 0 ? (
                <div className="bg-white border border-dark/5 rounded-2xl p-10 text-center space-y-4">
                  <span className="text-3xl">📦</span>
                  <h4 className="font-serif text-base font-bold">No Orders Registered</h4>
                  <p className="text-xs text-dark/40 max-w-xs mx-auto">
                    You have not placed any custom handcrafted orders yet. Discover our master collection to begin.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block bg-dark text-white text-xs font-bold tracking-widest px-6 py-3 hover:bg-gold-600 transition-colors"
                  >
                    EXPLORE COLLECTIONS
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((o, index) => {
                    const status = o.orderStatus || o.status || 'Processing';

                    // Simple steps logic
                    const steps = ['Processing', 'In Transit', 'Delivered'];
                    const displayStatus = (status === 'Cancellation Pending') ? 'Processing' : status;
                    const currentStepIdx = steps.indexOf(displayStatus);

                    return (
                      <div key={`${o.id}-${index}-${status}`} className="bg-white border border-dark/5 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                        <div className="flex justify-between items-start border-b border-dark/5 pb-4">
                          <div>
                            <strong className="text-sm font-bold text-dark font-serif">{o.id}</strong>
                            <span className="text-[10px] text-dark/40 block mt-0.5">Placed on {o.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gold-700 block">₹{o.total.toLocaleString()}</span>
                            <span className="text-[9px] text-dark/40 font-medium">{o.paymentMethod || 'Simulated Card'}</span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-3">
                          {Array.isArray(o.items) ? (
                            o.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <img src={item.img || item.image} className="w-12 h-12 object-cover border border-dark/5 rounded bg-stone-50" alt="" />
                                <div className="text-xs">
                                  <h5 className="font-bold text-dark">{item.name}</h5>
                                  <p className="text-[10px] text-dark/40 mt-0.5">Quantity: {item.quantity} {item.size ? `· Size IND ${item.size}` : ''}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-dark/65 font-medium">
                              {o.items}
                            </div>
                          )}
                        </div>

                        {/* tracking timeline (hide if cancelled) */}
                        {status !== 'Cancelled' && (
                          <div className="bg-[#faf8f5] p-4 rounded-xl border border-dark/5 space-y-4">
                            <span className="block text-[9px] text-dark/45 font-bold uppercase tracking-wider">Cargo Transit Status Tracker</span>
                            <div className="flex justify-between items-center relative">
                              {/* Horizontal timeline bar */}
                              <div className="absolute left-2 right-2 top-2 h-0.5 bg-dark/5 -z-0"></div>

                              {steps.map((st, i) => {
                                const isCompleted = i <= currentStepIdx;
                                const isActive = i === currentStepIdx;
                                return (
                                  <div key={st} className="flex flex-col items-center relative z-10 text-center w-24">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${isCompleted
                                      ? 'bg-gold-500 border-gold-600 text-white'
                                      : 'bg-white border-dark/10 text-dark/30'
                                      }`}>
                                      {isCompleted && <span className="text-[9px]">✓</span>}
                                    </div>
                                    <span className={`text-[9px] mt-2 font-bold tracking-wide uppercase ${isActive ? 'text-gold-600' : isCompleted ? 'text-dark/80' : 'text-dark/30'
                                      }`}>{st}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Invoice download trigger button */}
                        <div className="flex justify-between items-center pt-2 gap-3">
                          {/* Cancel Order Button (only if within 2 hours and not cancelled/delivered/pending) */}
                          {canCancelOrder(o.date) && status !== 'Cancelled' && status !== 'Cancellation Pending' && status !== 'Delivered' && (
                            <button
                              onClick={() => handleCancelOrder(o.id)}
                              className="bg-red-50 border border-red-200 hover:border-red-400 hover:bg-red-100 text-red-700 text-[10px] font-bold tracking-widest px-4 py-2.5 rounded transition-all flex items-center gap-1.5"
                            >
                              ❌ CANCEL ORDER
                            </button>
                          )}

                          {status === 'Cancelled' && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                              ⚠️ ORDER CANCELLED
                            </span>
                          )}

                          {status === 'Cancellation Pending' && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded border border-amber-200 animate-pulse">
                              ⏳ CANCELLATION PENDING (CHECK WHATSAPP)
                            </span>
                          )}

                          <button
                            onClick={() => downloadInvoice(o)}
                            className="bg-cream/40 border border-dark/10 hover:border-gold-500 hover:bg-white text-dark text-[10px] font-bold tracking-widest px-4 py-2.5 rounded transition-all flex items-center gap-1.5 ml-auto"
                          >
                            📥 DOWNLOAD TAX INVOICE
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Atelier details Sidebar Column */}
            <div className="space-y-6">
              {/* Address Directory Manager Card */}
              <div className="bg-white border border-dark/5 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="border-b border-dark/5 pb-2">
                  <h4 className="font-serif font-bold text-dark text-base">Address Directory</h4>
                  <p className="text-[10px] text-dark/40">Manage your shipping destinations for faster checkout curations.</p>
                </div>

                {/* List saved addresses */}
                {(!currentUser?.addresses || currentUser.addresses.length === 0) ? (
                  <p className="text-xs text-dark/40 italic text-center py-2">
                    No saved addresses found. Click below to add your first address!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {currentUser.addresses.map((addr) => (
                      <div key={addr.id} className="border border-dark/10 p-3 rounded-lg flex justify-between items-start text-xs bg-[#faf8f5]">
                        <div className="space-y-1">
                          <p className="font-serif font-bold text-dark">{addr.area}</p>
                          <p className="text-[10px] text-dark/60">
                            {addr.taluka ? `${addr.taluka}, ` : ''}{addr.city}, {addr.district}, {addr.state} - <span className="font-semibold text-dark/80">{addr.pincode}</span>
                          </p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            className="text-blue-500 hover:text-blue-700 p-1 text-xs transition-colors"
                            title="Edit Address"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 p-1 text-xs transition-colors"
                            title="Remove Address"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address button or Inline Form */}
                {!isAddingAddress ? (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="w-full border border-dark/20 text-dark text-[10px] font-bold tracking-widest py-3 hover:bg-stone-50 transition-colors uppercase rounded flex items-center justify-center gap-1"
                  >
                    ➕ ADD NEW ADDRESS
                  </button>
                ) : (
                  <form onSubmit={handleSaveAddress} className="space-y-3 pt-2 border-t border-dark/5">
                    <p className="text-[9px] text-gold-600 font-bold uppercase tracking-wider">{editingAddressId ? 'Edit Shipping Destination' : 'New Shipping Destination'}</p>

                    <div>
                      <label className="block text-[9px] font-bold tracking-widest text-dark/60 uppercase mb-0.5">Pincode (Auto-Lookup)</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addrPincode}
                          onChange={(e) => setAddrPincode(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-dark/10 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500"
                        />
                        {loadingPincode && (
                          <div className="absolute right-3 top-2.5 w-3.5 h-3.5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold tracking-widest text-dark/60 uppercase mb-0.5">Area / Street Address</label>
                      <input
                        type="text"
                        required
                        value={addrArea}
                        onChange={(e) => setAddrArea(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold tracking-widest text-dark/60 uppercase mb-0.5">City</label>
                        <input
                          type="text"
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-dark/10 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold tracking-widest text-dark/60 uppercase mb-0.5">Taluka</label>
                        <input
                          type="text"
                          value={addrTaluka}
                          onChange={(e) => setAddrTaluka(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-dark/10 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold tracking-widest text-dark/60 uppercase mb-0.5">District</label>
                        <input
                          type="text"
                          value={addrDistrict}
                          onChange={(e) => setAddrDistrict(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-dark/10 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold tracking-widest text-dark/60 uppercase mb-0.5">State</label>
                        <input
                          type="text"
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-dark/10 rounded px-3 py-2 text-xs text-dark focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1.5">
                      <button
                        type="submit"
                        className="flex-1 bg-dark text-white text-[9px] font-bold tracking-widest py-2.5 hover:bg-gold-600 transition-colors uppercase rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAddress(false)
                          setEditingAddressId(null)
                          setAddrPincode('')
                          setAddrArea('')
                          setAddrCity('')
                          setAddrTaluka('')
                          setAddrDistrict('')
                          setAddrState('')
                        }}
                        className="flex-1 border border-dark/20 text-dark text-[9px] font-bold tracking-widest py-2.5 hover:bg-stone-50 transition-colors uppercase rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="bg-white border border-dark/5 p-6 rounded-2xl shadow-sm space-y-4 text-center">
                <span className="text-3xl">🛡️</span>
                <h4 className="font-serif font-bold text-dark text-base">Bespoke Curation Authenticity</h4>
                <p className="text-xs text-dark/50 leading-relaxed">
                  Every product dispatched by Samartha Craft Studio holds full geographical identification clusters (GI registry) and natural plant tanning certifications.
                </p>
                <div className="h-[1px] bg-dark/5 my-2"></div>
                <p className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">
                  Verified Udyam: UDYAM-MH-15-0128444
                </p>
              </div>

              <div className="bg-white border border-dark/5 p-6 rounded-2xl shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-dark text-base">Customer Support Desk</h4>
                <p className="text-xs text-dark/50 leading-relaxed">
                  Have inquiries regarding size alterations or customization? Connect directly with Nikhil Jadhav's workshop.
                </p>
                <Link
                  to="/contact"
                  className="block text-center w-full bg-dark text-white text-[10px] font-bold tracking-widest py-3 hover:bg-gold-600 transition-colors uppercase rounded"
                >
                  TRANSMIT WORKSHOP INQUIRY
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  /* ─── RENDERS LOGIN / SIGN UP FORM FOR UNAUTHENTICATED CUSTOMERS ─── */
  return (
    <div className="min-h-screen bg-cream text-dark flex font-sans overflow-hidden pb-16 md:pb-0">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-xs text-dark/60 hover:text-gold-600 transition-colors uppercase tracking-widest font-semibold"
      >
        ← Return to Gallery
      </Link>

      {/* Split layout: Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative justify-center items-center p-12 border-r border-dark/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/kolhapuri_chappal_bg.png"
            className="w-full h-full object-cover opacity-90"
            alt="Heritage Background"
          />
          {/* Deep dark warm chocolate tint for beautiful elegant contrast inside the left panel */}
          <div className="absolute inset-0 bg-dark/75 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg space-y-6">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center border border-gold-500/20 shadow-[0_0_30px_rgba(201,152,42,0.15)] p-2">
            <img
              src="/logo.png"
              className="w-full h-full object-contain mix-blend-multiply"
              alt="Samartha Brand Emblem"
            />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white italic tracking-wide">
            "Heritage in every thread. Crafted for royalty."
          </h2>
          <div className="h-0.5 w-24 bg-gold-500/50 mx-auto"></div>
          <p className="text-sm text-gray-300 font-medium tracking-wide">
            Explore and curate your collection of premium vegetable-tanned Kolhapuris and royal Polki jewelry.
          </p>
        </div>
      </div>

      {/* Split layout: Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-cream">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-md bg-white border border-dark/5 rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(26,18,8,0.06)] relative">

          {/* Notifications area */}
          {notification && (
            <div className="absolute top-4 left-4 right-4 bg-gold-500/10 border border-gold-500/20 text-gold-700 text-xs px-4 py-3 rounded-lg text-center font-medium animate-pulse z-20">
              {notification}
            </div>
          )}

          {errorMsg && (
            <div className="absolute top-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs px-4 py-3 rounded-lg text-center font-medium z-20 animate-pulse">
              {errorMsg}
            </div>
          )}

          {/* Heading */}
          <div className="text-center mb-6 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Samartha Craft Studio"
              className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Main Tabs */}
          <div className="flex border-b border-dark/5 mb-8">
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setNotification(''); }}
              className={`flex-1 pb-3 text-sm font-bold tracking-wide uppercase border-b-2 transition-all ${activeTab === 'login' ? 'border-gold-500 text-gold-600' : 'border-transparent text-dark/40 hover:text-dark/60'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); setNotification(''); }}
              className={`flex-1 pb-3 text-sm font-bold tracking-wide uppercase border-b-2 transition-all ${activeTab === 'signup' ? 'border-gold-500 text-gold-600' : 'border-transparent text-dark/40 hover:text-dark/60'
                }`}
            >
              Create Account
            </button>
          </div>

          {/* Render forms dynamically */}
          {activeTab === 'login' ? (
            <div className="space-y-6">
              {/* Login Type selectors */}
              <div className="flex bg-cream rounded-lg p-1 border border-dark/5">
                <button
                  onClick={() => { setLoginType('password'); setOtpSent(false); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${loginType === 'password' ? 'bg-white text-gold-600 border border-dark/5 shadow-sm' : 'text-dark/40 hover:text-dark/70'
                    }`}
                >
                  Password
                </button>
                <button
                  onClick={() => setLoginType('otp')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${loginType === 'otp' ? 'bg-white text-gold-600 border border-dark/5 shadow-sm' : 'text-dark/40 hover:text-dark/70'
                    }`}
                >
                  OTP / Mobile
                </button>
              </div>

              {/* Password Login Form */}
              {loginType === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div>
                    <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-3 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider">Password</label>
                      <button type="button" className="text-[10px] text-gold-600 hover:text-gold-500 underline font-medium">Forgot?</button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-dark/10 pl-4 pr-12 py-3 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold-600 hover:text-gold-500 uppercase tracking-widest transition-colors select-none"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-white font-bold py-3.5 text-sm hover:bg-gold-600 transition-colors mt-6 rounded-xl shadow-[0_4px_15px_rgba(201,152,42,0.2)]"
                  >
                    Authenticate
                  </button>
                </form>
              )}

              {/* OTP Login Form */}
              {loginType === 'otp' && (
                <div className="space-y-6">
                  {!otpSent ? (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                      <div>
                        <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider mb-2">Mobile Number</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-sm text-dark/60 font-bold">+91</span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-dark/10 pl-14 pr-4 py-3 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gold-500 text-white font-bold py-3.5 text-sm hover:bg-gold-600 transition-colors mt-6 rounded-xl shadow-[0_4px_15px_rgba(201,152,42,0.2)]"
                      >
                        Request Secure OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                      <div className="text-center">
                        <p className="text-xs text-dark/60 mb-2">OTP code sent to <span className="font-bold text-dark">+91 {phone}</span></p>
                        <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] text-gold-600 hover:underline">Change phone number</button>
                      </div>

                      <div className="flex gap-2 justify-center">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength="1"
                            value={digit}
                            onPaste={handleOtpPaste}
                            onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                            className="w-12 h-12 bg-[#faf8f5] border border-dark/10 rounded-xl text-center text-lg font-bold text-gold-600 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all"
                          />
                        ))}
                      </div>

                      <div className="text-center">
                        {timer > 0 ? (
                          <p className="text-[10px] text-dark/60">Resend OTP in <span className="font-semibold text-dark/80">{timer}s</span></p>
                        ) : (
                          <button type="button" onClick={handleSendOTP} className="text-[10px] text-gold-600 hover:text-gold-500 font-bold underline">Resend Code</button>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gold-500 text-white font-bold py-3.5 text-sm hover:bg-gold-600 transition-colors rounded-xl shadow-[0_4px_15px_rgba(201,152,42,0.2)]"
                      >
                        Verify & Secure Login
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-2.5 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-2.5 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-dark/10 px-4 py-2.5 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-dark/60 font-bold uppercase tracking-wider mb-1.5">Create Password</label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-dark/10 pl-4 pr-12 py-2.5 text-sm rounded-xl outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all text-dark placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold-600 hover:text-gold-500 uppercase tracking-widest transition-colors select-none"
                  >
                    {showSignUpPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  className="mt-1 accent-gold-500"
                />
                <label htmlFor="terms" className="text-[10px] text-dark/50 leading-normal font-medium">
                  I agree to the Samartha Atelier Terms of Curation and Privacy Agreement.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gold-500 text-white font-bold py-3 text-sm hover:bg-gold-600 transition-colors mt-4 rounded-xl shadow-[0_4px_15px_rgba(201,152,42,0.2)]"
              >
                Register Account
              </button>
            </form>
          )}

          {/* Google Sign-In Divider & Button */}
          <div className="pt-2 border-t border-dark/5">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-dark/5"></div>
              <span className="flex-shrink mx-4 text-[10px] text-dark/40 font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-dark/5"></div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-dark/15 text-dark font-bold py-3 text-xs hover:bg-[#faf8f5] transition-colors rounded-xl shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </div>

          {/* Privacy Note */}
          <div className="text-center mt-6 pt-4 border-t border-dark/5">
            <span className="text-[10px] text-dark/40 font-semibold tracking-wider uppercase">100% Secure Encrypted Connection</span>
          </div>

        </div>
      </div>
    </div>
  )
}
