import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CopyrightPolicyPage() {
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
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold-600 uppercase mb-2 block font-sans">
              LEGAL REGISTRY
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-dark">
              Product Image Copyright Policy
            </h1>
            <p className="text-xs text-dark/45 mt-2 font-sans">Last Updated: May 23, 2026</p>
          </div>

          <div className="text-sm text-dark/70 space-y-4 leading-relaxed font-medium">
            <p>
              Welcome to <strong>SAMARTHA CRAFT STUDIO</strong> (Udyam Registration: <code>UDYAM-MH-15-0128444</code>). We take great pride in our artisanal heritage, hand-crafting process, and original creative assets. This Copyright Policy outlines the ownership, protection, and restricted usage of all visual elements displayed on our digital showcase.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">1. Ownership of Visual Content</h3>
            <p>
              All product photographs, lifestyle images, catalog graphics, brand emblems, and visual assets displayed on this website are the exclusive intellectual property of <strong>SAMARTHA CRAFT STUDIO</strong>, registered under the sole proprietorship of <strong>Shri Nikhil Shivaji Jadhav</strong> in Kolhapur, Maharashtra, India.
            </p>
            <p>
              These visual assets are protected under the <strong>Indian Copyright Act, 1957</strong> and international intellectual property treaties.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">2. Strict Commercial Restrictions</h3>
            <p>
              Except as explicitly authorized in writing by our proprietor:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>No Commercial Redistribution</strong>: No individual, business, or third-party e-commerce merchant may download, scrape, copy, modify, distribute, or otherwise use our product images to list, advertise, or sell products on their own platforms (including Amazon, Flipkart, Myntra, Etsy, Shopify, Instagram, or Facebook).</li>
              <li><strong>No Counterfeiting or Misrepresentation</strong>: Presenting our high-resolution artisan photography as representing goods manufactured or sold by any seller other than Samartha Craft Studio is strictly prohibited and constitutes copyright infringement, passing off, and unfair trade practices.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">3. Authorized Partner Exceptions</h3>
            <p>
              Registered partners of the <strong>Samartha Reseller Network</strong> who have active, verified affiliate accounts and are in good standing are granted a limited, revocable, non-exclusive license to share product links and associated product images solely to generate referral sales. 
            </p>
            <p>
              This license is strictly governed by the Reseller Agreement and will immediately terminate upon suspension or closure of the partner account.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">4. Enforcement & Legal Remedies</h3>
            <p>
              We actively monitor digital marketplaces and search engines for unauthorized image redistribution. SAMARTHA CRAFT STUDIO reserves the right to take immediate legal actions, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Filing Digital Millennium Copyright Act (DMCA) and local legal takedown notices with platforms hosting infringing images.</li>
              <li>Seeking injunctions, damages, and legal costs against offending parties under the jurisdiction of the courts of Kolhapur, Maharashtra, India.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">5. Permissible Personal Sharing</h3>
            <p>
              Customers and supporters are welcome to share our photographs on social media platforms for personal, non-commercial purposes, provided that appropriate credit is given to <strong>@samartha_craft_studio1</strong> or a hyperlink back to our official domain is clearly displayed.
            </p>

            <h3 className="font-serif text-lg font-bold text-dark pt-4">6. Contact for Image Requests</h3>
            <p>
              For inquiries regarding commercial image licensing, editorial use, or partner authorization, please contact our legal desk:
            </p>
            <div className="bg-[#faf8f5] p-5 border border-dark/5 font-sans space-y-1 text-xs text-dark/80 rounded-xl">
              <p className="font-bold text-dark">SAMARTHA CRAFT STUDIO Legal Desk</p>
              <p>Proprietor: Shri Nikhil Shivaji Jadhav</p>
              <p>Address: 263, Shivaji Jadhav Building, Rohidas Chowk, Pattan Kadoli, Kolhapur, MH 416202</p>
              <p>Support Email: <code>nikhiljadhav2632002@gmail.com</code></p>
              <p>Contact Phone: <code>+91 8856889793</code></p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
