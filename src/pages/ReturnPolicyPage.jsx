import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ReturnPolicyPage() {
  return (
    <div className="bg-cream min-h-screen text-dark flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-dark/5 p-8 lg:p-12 shadow-[0_4px_30px_rgba(26,18,8,0.02)] space-y-6"
        >
          <div className="border-b border-dark/5 pb-5">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-2 block">
              ATELIER SERVICE
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Return & Exchange Policy</h1>
            <p className="text-xs text-dark/45 mt-2">Last Updated: May 17, 2026</p>
          </div>

          <div className="text-sm text-dark/70 space-y-4 leading-relaxed font-medium">
            <p>
              At <strong>SAMARTHA CRAFT STUDIO</strong> (Udyam Registration: <code>UDYAM-MH-15-0128444</code>), we are deeply dedicated to absolute quality and customer satisfaction. If you are not completely pleased with your artisanal purchase, we are here to assist with exchanges and returns under our simplified policy guidelines.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">1. Return Window</h3>
            <p>
              Customers may request an exchange or refund within **7 business days** of receiving their order. The product must remain completely unworn, undamaged, and shipped inside its original designer box with packaging tags fully intact.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">2. Customized and Bespoke Orders</h3>
            <p>
              Please note that **customized orders** (specifically made-to-measure footwear or personalized temple jewelry made to special dimensions) **cannot be returned or refunded**, as they are crafted to individual specifications. We do, however, offer complimentary alterations to guarantee a perfect fit!
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">3. Exchange & Return Process</h3>
            <p>
              To initiate a return or alteration request, please contact our concierge team:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Send an email to <code>nikhiljadhav2632002@gmail.com</code> containing your Order ID and photographs showing the unused condition of the items.</li>
              <li>Once verified, packages must be securely wrapped and sent to our atelier office:</li>
            </ul>

            <div className="bg-[#faf8f5] p-5 border border-dark/5 font-sans space-y-1 text-xs text-dark/80 max-w-md">
              <p className="font-bold text-dark">SAMARTHA CRAFT STUDIO returns</p>
              <p>263, Shivaji Jadhav Building,</p>
              <p>Rohidas Chowk, Near Old Bus Stop,</p>
              <p>Pattan Kadoli, Kolhapur, MH 416202</p>
              <p>Mobile Concierge: <code>+91 8856889793</code></p>
            </div>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">4. Refund Settlements</h3>
            <p>
              Approved refunds are credited directly back to the original source within **5–7 business days** from receipt and inspection at our workshop.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
