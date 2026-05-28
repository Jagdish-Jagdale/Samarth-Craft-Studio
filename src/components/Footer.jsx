import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

export default function Footer() {
  const [ref, inView] = useInView()

  const getHref = (link) => {
    switch (link) {
      case 'Privacy Policy': return '/privacy-policy'
      case 'Returns': return '/return-policy'
      case 'Terms & Conditions': return '/terms-of-service'
      case 'Contact':
      case 'CONTACT US':
        return '/contact'
      case 'Shipping': return '/return-policy'
      case 'ABOUT US': return '/about'
      case 'SHOP': return '/shop'
      case 'KOLHAPURI CHAPPAL': return '/shop?category=Kolhapuri%20Footwear'
      case 'JEWELLERY': return '/shop?category=Temple%20Jewellery'
      default: return '/shop'
    }
  }

  const columns = [
    {
      title: 'COLLECTIONS',
      links: ['SHOP', 'KOLHAPURI CHAPPAL', 'JEWELLERY', 'ABOUT US', 'CONTACT US'],
    },
    {
      title: 'CLIENT SERVICE',
      links: [
        'Shipping',
        'Returns',
        'Privacy Policy',
        'Terms & Conditions',
        'Contact'
      ],
    },
    {
      title: 'DOCUMENTS',
      links: [
        'Download Udyam Certificate',
        'Download GST Registration'
      ],
    }
  ]

  return (
    <>
      {/* ─── ARTISAN & SERVICE HIGHLIGHTS ─── */}
      <div className="bg-[#faf8f5] py-12 border-t border-b border-dark/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 bg-white p-6 rounded-xl border border-dark/5 shadow-xs transition-shadow duration-300 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center text-2xl">
                🚚
              </div>
              <div>
                <h4 className="font-serif font-bold text-dark text-base">Free / Fast Shipping</h4>
                <p className="text-[11px] text-dark/50 mt-0.5 tracking-wider uppercase font-semibold">Complimentary Cargo Nationwide</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 bg-white p-6 rounded-xl border border-dark/5 shadow-xs transition-shadow duration-300 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center text-2xl">
                🔁
              </div>
              <div>
                <h4 className="font-serif font-bold text-dark text-base">Easy Return / Exchange</h4>
                <p className="text-[11px] text-dark/50 mt-0.5 tracking-wider uppercase font-semibold">Hassle-Free Satisfaction Guarantee</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 bg-white p-6 rounded-xl border border-dark/5 shadow-xs transition-shadow duration-300 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center text-2xl">
                🖐️
              </div>
              <div>
                <h4 className="font-serif font-bold text-dark text-base">Handmade Product</h4>
                <p className="text-[11px] text-dark/50 mt-0.5 tracking-wider uppercase font-semibold">100% Certified Authentic Artisan Craft</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-cream/80 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center justify-center max-w-[200px] mb-4">
              <img
                src="/logo.png"
                alt="Samartha Craft Studio"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-cream/60 mb-6 font-medium">
              Creating India's finest heritage craftsmanship for the modern world.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://www.instagram.com/samartha_craft_studio1"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="inline-flex items-center justify-center transition-all duration-300"
                title="Instagram"
              >
                <svg
                  className="w-6 h-6 hover:brightness-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="url(#instagram-gradient)" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instagram-gradient)" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="url(#instagram-gradient)" />
                </svg>
              </motion.a>

              <motion.a
                href="https://www.facebook.com/profile.php?id=61590120367121"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="inline-flex items-center justify-center transition-all duration-300 text-[#1877F2] hover:brightness-110"
                title="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>

              <motion.a
                href="https://wa.me/918806889793"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="inline-flex items-center justify-center transition-all duration-300 text-[#25D366] hover:brightness-110"
                title="WhatsApp"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.556 4.186 1.61 5.99L.416 23.5l5.63-1.477a11.96 11.96 0 0 0 5.985 1.603h.004c6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm0 21.607h-.003c-1.802 0-3.567-.483-5.114-1.401l-.367-.217-3.805.998.998-3.71-.238-.378a9.982 9.982 0 0 1-1.526-5.263c0-5.522 4.492-10.015 10.015-10.015 5.523 0 10.015 4.493 10.015 10.015 0 5.522-4.492 10.014-10.014 10.014zm5.495-7.51c-.301-.151-1.785-.882-2.062-.983-.277-.101-.478-.151-.679.151-.201.302-.779.983-.955 1.184-.176.201-.352.226-.653.075-1.425-.716-2.585-1.558-3.415-2.923-.213-.35-.022-.54.129-.689.136-.135.302-.351.452-.527.151-.176.201-.301.302-.502.101-.201.05-.377-.025-.527-.075-.151-.679-1.637-.93-2.239-.245-.589-.494-.509-.679-.518-.175-.008-.376-.01-.577-.01-.201 0-.527-.075-.803.376-.276.301-1.054 1.03-1.054 2.51s1.079 2.912 1.23 3.113c.151.201 2.122 3.24 5.138 4.538 2.012.868 2.825.938 3.843.784.825-.125 2.535-1.03 2.887-2.035.352-1.004.352-1.857.247-2.035-.105-.178-.381-.278-.683-.429z" />
                </svg>
              </motion.a>

              <motion.a
                href="mailto:samarthacraftstudio@gmail.com"
                whileHover={{ scale: 1.2, color: '#c9982a' }}
                className="inline-flex items-center justify-center text-cream/50 transition-colors"
                title="Email"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {columns.map((col, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * (ci + 1) }}
            >
              <div className="text-xs font-medium tracking-widest text-cream/40 mb-5">{col.title}</div>
              {col.links ? (
                <ul className="space-y-3">
                  {col.links.map((link) => {
                    const isPdf = link.includes('Download')
                    const pdfHref = link === 'Download Udyam Certificate' ? '/P45.pdf' : '/AA270526003652E_RC01052026.pdf'
                    
                    return (
                      <li key={link}>
                        {isPdf ? (
                          <a 
                            href={pdfHref} 
                            download 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-cream/60 hover:text-gold-400 transition-colors group flex items-center gap-2"
                          >
                            <span className="w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-3" />
                            <span className="text-xs">📄</span> {link}
                          </a>
                        ) : (
                          <Link to={getHref(link)} className="text-sm text-cream/60 hover:text-gold-400 transition-colors group flex items-center gap-2">
                            <span className="w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-3" />
                            {link}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div>
                  <p className="text-sm text-cream/60 mb-4">Subscribe for exclusive early access to new collections.</p>
                  <div className="flex border-b border-cream/20">
                    <input
                      className="flex-1 bg-transparent text-sm text-cream placeholder-cream/30 py-2 outline-none"
                    />
                    <motion.button
                      whileHover={{ x: 3 }}
                      className="text-gold-400 ml-2"
                    >
                      →
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/30">© 2025 SAMARTHA CRAFT STUDIO. PRESERVING INDIAN HERITAGE.</p>
          <div className="flex gap-6 text-xs text-cream/30">
            <span>MADE IN MAHARASHTRA</span>
            <span>GLOBAL EXCELLENCE</span>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
