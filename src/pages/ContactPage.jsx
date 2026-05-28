import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'
import { useApp } from '../context/AppContext'

export default function ContactPage() {
  const [formRef, formInView] = useInView()
  const { addInquiry } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Bespoke Order',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newInquiry = {
      ...formData,
      status: 'Unread',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    await addInquiry(newInquiry)
    
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', interest: 'Bespoke Order', message: '' })
    }, 4000)
  }

  return (
    <div className="bg-cream min-h-screen text-dark pb-16 md:pb-0">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16">
          
          {/* ─── LEFT COLUMN: DETAILS ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.4em] text-gold-600 uppercase mb-3 block">
                Connect With Us
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                Customer Inquiry & Concierge
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-600 uppercase mb-1">ATELIER WORKSHOP & SHOWROOM</p>
                <p className="text-xs leading-relaxed text-dark/70 font-medium">
                  263, Shivaji Jadhav Building,<br />
                  Rohidas Chowk, Near Old Bus Stop,<br />
                  Pattan Kadoli, Kolhapur, MH 416202, India
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-600 uppercase mb-1">DIRECT CONCIERGE</p>
                <p className="text-xs leading-relaxed text-dark/70 font-medium">
                  nikhiljadhav2632002@gmail.com<br />
                  +91 8856889793
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gold-600 uppercase mb-1">REGISTRATION INDEX</p>
                <p className="text-xs leading-relaxed text-dark/70 font-medium font-mono font-bold">
                  UDYAM-MH-15-0128444
                </p>
              </div>
            </div>

            {/* Custom Ornament */}
            <div className="pt-6 border-t border-dark/10">
              <p className="font-serif italic text-dark/40 text-sm">
                "Each masterpiece sandal and piece of Kundan heritage is individually numbered and tracked."
              </p>
            </div>
          </motion.div>

          {/* ─── RIGHT COLUMN: ELEVATED CONTACT FORM ─── */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white border border-dark/5 p-8 lg:p-12 shadow-[0_4px_30px_rgba(26,18,8,0.03)] relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 space-y-5"
                >
                  <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/20 text-gold-600 text-3xl rounded-full flex items-center justify-center animate-pulse">
                    ✦
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-dark mb-2">Concierge Ticket Created</h3>
                    <p className="text-xs text-dark/50 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting the Atelier. A dedicated Samartha curator has received your dossier and will reach out within 12 business hours.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-xl font-bold text-dark border-b border-dark/5 pb-4 mb-4">
                    Atelier Concierge Register
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-2">FULL NAME</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-4 py-3 text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-2">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-4 py-3 text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-2">CONTACT PHONE</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-4 py-3 text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-2">PRIMARY INTEREST</label>
                      <select
                        value={formData.interest}
                        onChange={e => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-cream/10 border border-dark/15 px-4 py-3 text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors cursor-pointer"
                      >
                        <option>Bespoke Order</option>
                        <option>Kolhapuri Footwear Sizing</option>
                        <option>Temple Gold Customization</option>
                        <option>Wholesale Partnerships</option>
                        <option>Other General inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-dark/50 block mb-2">CONCIERGE INSTRUCTION</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-cream/10 border border-dark/15 px-4 py-3 text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: '#c9982a' }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full bg-dark text-white text-xs font-bold tracking-widest py-4 transition-colors"
                  >
                    SUBMIT TO CONCIERGE ATELIER
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
