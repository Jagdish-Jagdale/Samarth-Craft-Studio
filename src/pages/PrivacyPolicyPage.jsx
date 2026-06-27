import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicyPage() {
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
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-xs text-dark/45 mt-2">Last Updated: May 17, 2026</p>
          </div>

          <div className="text-sm text-dark/70 space-y-4 leading-relaxed font-medium">
            <p>
              Welcome toak <strong>SAMARTHA CRAFT STUDIO</strong> (Udyam Registration: <code>UDYAM-MH-15-0128444</code>). We hold the privacy of our customers and collectors in the highest esteem. This Privacy Policy details how we collect, safeguard, and leverage information provided to us under the direct stewardship of our proprietor, <strong>Shri Nikhil Shivaji Jadhav</strong>.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">1. Information We Collect</h3>
            <p>
              To process your customized order for authentic Kolhapuri footwear or gold-vermeil Temple jewellery, we capture crucial logistics and personalization metrics, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Personal Identifiers</strong>: Full name, delivery coordinates, billing information, contact number (<code>+91 8856889793</code> or your personal line), and email address.</li>
              <li><strong>Sizing Dimensions</strong>: EU/UK footwear sizing configurations and wrist/neck measurements for customized jewels.</li>
              <li><strong>Business Indicators</strong>: GSTIN (for reseller onboarding profiles) and business registration details.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">2. Lawful Basis and Manufacturing Use</h3>
            <p>
              Our manufacturing center situated at <strong>263, Shivaji Jadhav Building, Rohidas Chowk, Near Old Bus Stop, Pattan Kadoli, Kolhapur, Maharashtra (Pin 416202)</strong> uses this data exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Craft, size-verify, and dispatch bespoke custom-ordered products.</li>
              <li>Authenticate reseller onboarding contracts.</li>
              <li>Validate payment details securely through the State Bank of India ledger system.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">3. Data Integrity & Safeguarding</h3>
            <p>
              Your data is fully protected under local and national electronic data protection standards. We do not sell, rent, or lease customer data to third-party list brokers. Customer inquiries are securely stored and monitored under the strict governance of our data team.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">4. Customer Rights and Direct Access</h3>
            <p>
              Under Indian Electronic Information Protection protocols, you hold complete access rights to request correction or removal of your records. For any inquiries, please contact our administrator directly:
            </p>
            <div className="bg-[#faf8f5] p-5 border border-dark/5 font-sans space-y-1 text-xs text-dark/80">
              <p className="font-bold text-dark">SAMARTHA CRAFT STUDIO Concierge Desk</p>
              <p>Proprietor: Shri Nikhil Shivaji Jadhav</p>
              <p>Address: 263, Rohidas Chowk, Pattan Kadoli, Kolhapur, MH 416202</p>
              <p>Support Email: <code>nikhiljadhav2632002@gmail.com</code></p>
              <p>Concierge Phone: <code>+91 8856889793</code></p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
