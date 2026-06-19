import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsPage() {
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
              LEGAL REGISTRY
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Terms and Conditions</h1>
            <p className="text-xs text-dark/45 mt-2">Last Updated: May 17, 2026</p>
          </div>

          <div className="text-sm text-dark/70 space-y-4 leading-relaxed font-medium">
            <p>
              Welcome to <strong>SAMARTHA CRAFT STUDIOoo</strong> (Udyam Registration: <code>UDYAM-MH-15-0128444</code>). These Terms and Conditions govern your engagement, customer relationship, and transactions with our studio under the proprietorship of <strong>Shri Nikhil Shivaji Jadhav</strong>.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">1. Product Integrity & Customization</h3>
            <p>
              Every pair of signature Kolhapuri footwear and gold/silver-vermeil Temple jewellery is individually manufactured at our headquarters in Kolhapur, Maharashtra. Because these are hand-molded and hand-threaded using ancient artisanal techniques:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Minor variations in grain alignment, natural leather marks, or gem facet structures are inherent characteristics of genuine handcraft.</li>
              <li>Customers are strictly advised to follow our sizing guide to ensure optimal comfort.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">2. Pricing, Ledger and Payment Terms</h3>
            <p>
              All prices shown are subject to adjustment without prior notification. Orders are approved once payments clear our official banking system:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Official Bank</strong>: STATE BANK OF INDIA</li>
              <li><strong>IFS Code</strong>: SBIN0018647</li>
              <li><strong>A/C</strong>: 36176540370</li>
              <li>Transactions are processed securely through certified gateways. Wholesale accounts must align with our minimum order quantities (MOQ) rules to retain reseller billing rates.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">3. Geographical Operations</h3>
            <p>
              We operate and dispatch directly from <strong>263, Shivaji Jadhav Building, Rohidas Chowk, Near Old Bus Stop, Pattan Kadoli, Kolhapur, Maharashtra (Pin 416202)</strong>. Disputes are subject to the exclusive jurisdiction of the courts of Kolhapur, Maharashtra, India.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">4. Reachability</h3>
            <p>
              For legal notifications or terms adjustment queries, direct requests to:
            </p>
            <div className="bg-[#faf8f5] p-5 border border-dark/5 font-sans space-y-1 text-xs text-dark/80">
              <p className="font-bold text-dark">SAMARTHA CRAFT STUDIO Registry</p>
              <p>Owner: Shri Nikhil Shivaji Jadhav</p>
              <p>Email: <code>nikhiljadhav2632002@gmail.com</code></p>
              <p>Phone: <code>+91 8856889793</code></p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
