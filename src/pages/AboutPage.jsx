import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'

export default function AboutPage() {
  const [headerRef, headerInView] = useInView()
  const [visionRef, visionInView] = useInView()
  const [historyRef, historyInView] = useInView()
  const [udyamRef, udyamInView] = useInView()

  return (
    <div className="bg-cream min-h-screen text-dark flex flex-col justify-between pb-16 md:pb-0">
      <Navbar />

      {/* ─── HERO HEADERas ─── */}
      <section ref={headerRef} className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-semibold tracking-[0.4em] text-gold-600 uppercase mb-3 block">
              Our Atelier Story
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
              Generations of <span className="italic font-normal text-gold-600">Kolhapuri</span> Craftsmanship.
            </h1>
            <p className="text-dark/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium">
              Samartha Craft Studio represents the absolute pinnacle of Indian hand-stitched leatherwork and gold-vermeil Temple jewellery. Founded in Kolhapur, Maharashtra, our studio is dedicated to preserving generational craft methods and delivering true micro-enterprise luxury to the global stage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="border border-gold-300/30 p-2 rounded-xs bg-white shadow-xl">
              <img
                src="/kolhapuri_chappal_bg.png"
                alt="Bespoke Handcrafted Kolhapuri Chappal"
                className="w-full h-80 lg:h-[450px] object-contain rounded-xs bg-[#fdfcfb]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white border border-gold-200 p-4 shadow-xl hidden md:block">
              <p className="font-serif text-xs font-bold uppercase tracking-widest text-gold-600">Established</p>
              <p className="font-serif text-2xl font-bold text-dark">01/04/2019</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MEET OUR FOUNDER ─── */}
      <section className="py-24 px-6 bg-white border-b border-dark/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column: Image (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative border border-gold-300/30 p-3 rounded-2xl bg-[#faf8f5] shadow-2xl overflow-hidden group">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src="/IMG_9824.PNG"
                    alt="Shri Nikhil Shivaji Jadhav - Founder of Samartha Craft Studio"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute top-8 left-8 bg-gold-600 text-white text-[9px] font-bold tracking-[0.25em] px-4 py-2 uppercase shadow-lg rounded-full">
                  Founder & Proprietor
                </div>
              </div>
              {/* Decorative backgrounds */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-gold-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-36 h-36 bg-gold-500/5 rounded-full blur-3xl -z-10" />
            </motion.div>

            {/* Right Column: Founder Info (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="text-[10px] font-bold tracking-[0.3em] text-gold-600 uppercase">
                THE VISIONARY
              </span>

              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-dark">
                Preserving Legacy,
                <br />
                <span className="italic font-normal text-gold-600">Empowering Artisans.</span>
              </h2>

              <div className="h-0.5 w-16 bg-gold-500 rounded-full" />

              <p className="text-dark/80 text-sm md:text-base leading-relaxed font-medium">
                Shri Nikhil Shivaji Jadhav founded Samartha Craft Studio in 2019 in Pattan Kadoli, Kolhapur with a simple yet powerful mission: to protect, preserve, and elevate the generational heritage of handcrafted Kolhapuri leather shoes and exquisite traditional jewellery.
              </p>

              <p className="text-dark/70 text-xs md:text-sm leading-relaxed">
                By bridging the gap between ancestral artisan craftsmanship and the contemporary global marketplace, Nikhil has constructed an ethical production model. Today, Samartha Craft Studio operates as a certified government MSME manufacturing hub that guarantees local craftsmen fair wages, safe work environments, and financial empowerment, ensuring this timeless Indian art form continues to flourish for generations.
              </p>

              <div className="border-l-2 border-gold-500 pl-6 py-2 italic font-serif text-sm text-dark/70 bg-[#faf8f5] rounded-r-lg">
                "Our mission is to ensure that the pride of Kolhapuri craftsmanship does not fade in history, but walks forward with modern elegance."
              </div>

              <div className="pt-4 flex items-center gap-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-dark">Nikhil Shivaji Jadhav</h4>
                  <p className="text-[10px] tracking-widest text-dark/40 font-bold uppercase mt-0.5">Proprietor, Samartha Craft Studio</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── GOVERNMENT UDYAM REGISTRATION ACCREDITATION ─── */}
      <section ref={udyamRef} className="py-16 px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={udyamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white border border-gold-500/20 p-8 md:p-12 shadow-[0_15px_50px_rgba(26,18,8,0.04)] relative overflow-hidden"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-gold-400/20 m-4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-gold-400/20 m-4 pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Indian Govt MSME Seal representation */}
            <div className="flex-shrink-0 w-full lg:w-[280px] bg-stone-50 border border-dark/5 p-6 text-center space-y-4 rounded-xs">
              <div className="text-3xl font-serif text-gold-600 font-bold">MSME</div>
              <div className="text-[10px] font-bold tracking-widest text-dark/45 uppercase border-y border-dark/5 py-2 leading-relaxed">
                MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES
              </div>
              <p className="text-[10px] text-dark/70 font-medium leading-relaxed">
                Government of India certified Micro-Manufacturing Enterprise under registration schema.
              </p>
              <div className="bg-gold-500/10 border border-gold-500/25 py-2.5 text-xs text-gold-700 font-bold tracking-wider rounded-xs">
                UDYAM REGISTERED
              </div>
            </div>

            {/* Certificate Details */}
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-[9px] font-bold tracking-[0.3em] text-gold-600 uppercase block mb-1">
                  OFFICIAL GOVERNMENT OF INDIA REGISTRY
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold">
                  SAMARTHA CRAFT STUDIO
                </h2>
                <p className="text-xs text-dark/40 font-semibold mt-1">
                  Registration Number: <span className="text-dark bg-stone-100 px-2 py-0.5 border border-dark/5 rounded font-mono font-bold select-all">UDYAM-MH-15-0128444</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-dark/5 pt-6 font-medium">
                <div>
                  <p className="text-[10px] tracking-widest text-dark/40 font-bold uppercase mb-1">FOUNDER & PROPRIETOR</p>
                  <p className="text-dark text-sm font-bold">Shri Nikhil Shivaji Jadhav</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-dark/40 font-bold uppercase mb-1">DATE OF INCORPORATION</p>
                  <p className="text-dark text-sm font-bold">April 1, 2019</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
                <div>
                  <p className="text-[10px] tracking-widest text-dark/40 font-bold uppercase mb-1">MAIN MANUFACTURING ATELIER</p>
                  <p className="text-dark leading-relaxed">
                    263, Shivaji Jadhav Building, Rohidas Chowk,<br />
                    Near Old Bus Stop, Pattan Kadoli, Kolhapur,<br />
                    Maharashtra, Pin 416202, India
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-dark/40 font-bold uppercase mb-1">NIC CLASSIFICATION CODES</p>
                  <p className="text-dark leading-relaxed">
                    <strong>32111</strong> · Gold & Silver Jewellery Manufacturing<br />
                    <strong>32120</strong> · Imitation Jewelry Accessories<br />
                    <strong>15201</strong> · Handcrafted Premium Leather Sandal Atelier
                  </p>
                </div>
              </div>

              <div className="bg-[#faf8f5] p-4 border border-gold-300/10 text-[11px] font-semibold text-dark/70 rounded-xs">
                💡 <strong>Customer Safety Ledger:</strong> Samartha Craft Studio operates in complete transparency. Our payments and transactions clear via the <strong>State Bank of India (SBI)</strong> treasury ledger system under account number <code>36176540370</code> (IFSC: <code>SBIN0018647</code>).
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── PHILOSOPHY & VISION ─── */}
      <section ref={visionRef} className="bg-white border-y border-dark/5 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="text-gold-500 text-2xl">✦</div>
            <h3 className="font-serif text-xl font-bold">100% Ethical Sourcing</h3>
            <p className="text-xs text-dark/60 leading-relaxed font-medium">
              We pay our master artisans 2.5x the local industry baseline average, guaranteeing complete financial autonomy, fully subsidized healthcare, and state-certified workshop infrastructure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="text-gold-500 text-2xl">✦</div>
            <h3 className="font-serif text-xl font-bold">Ancestral Preservation</h3>
            <p className="text-xs text-dark/60 leading-relaxed font-medium">
              Every Royal Kolhapuri sandal and Temple jewellery ornament is handcrafted using century-old patterns passed down across 4+ generations, preserving true cultural inheritance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="text-gold-500 text-2xl">✦</div>
            <h3 className="font-serif text-xl font-bold">Gold-Thread Mastery</h3>
            <p className="text-xs text-dark/60 leading-relaxed font-medium">
              We employ the complex "Zardozi" stitch style using genuine gold-vermeil dipped metal wires and raw organic silk to detail the borders of our signature collector sandals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HANDCRAFTING KOLHAPURI CHAPPALS ─── */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="text-[10px] font-bold tracking-[0.3em] text-gold-600 uppercase">
                OUR HERITAGE
              </span>

              <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
                Handcrafted in India,
                <br />
                <span className="italic font-normal text-gold-600">Curated for the World.</span>
              </h2>

              <p className="text-dark/70 text-sm leading-relaxed max-w-xl">
                Samartha Craft Studio bridges the gap between ancient artisanal mastery and contemporary minimalist luxury. Each piece is a testament to thousands of years of heritage, brought to life through the hands of master craftsmen who use history in every weave and gold thread.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-dark/10">
                <div>
                  <p className="font-serif text-4xl font-bold text-dark">12<span className="text-gold-500">+</span></p>
                  <p className="text-[10px] font-bold tracking-wider text-dark/50 uppercase mt-1">Craft Studios</p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-bold text-dark">500<span className="text-gold-500">+</span></p>
                  <p className="text-[10px] font-bold tracking-wider text-dark/50 uppercase mt-1">Artisans</p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-bold text-dark">100<span className="text-gold-500">%</span></p>
                  <p className="text-[10px] font-bold tracking-wider text-dark/50 uppercase mt-1">Handmade</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="bg-white p-6 shadow-2xl rounded-lg">
                <img
                  src="/kolhapuri_category.png"
                  alt="Handcrafting Kolhapuri Chappals"
                  className="w-full h-[400px] object-cover rounded"
                />
                <div className="absolute bottom-10 left-10 bg-white/95 backdrop-blur-sm px-6 py-3 shadow-xl border border-gold-200/50 rounded">
                  <p className="font-serif text-xs italic text-dark/70">"A Legacy in every stitch."</p>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HISTORICAL TIMELINE ─── */}
      <section ref={historyRef} className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-16">
          Our Journey of Preservation
        </h2>

        <div className="relative border-l border-gold-300/40 pl-8 space-y-12">
          {/* Milestone 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={historyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-[37px] top-1.5 w-4 h-4 bg-gold-500 rounded-full border border-cream" />
            <span className="text-xs font-bold text-gold-600 tracking-wider">APRIL 2019</span>
            <h4 className="font-serif text-lg font-bold text-dark mt-1">Official Inception & Registration</h4>
            <p className="text-xs text-dark/60 leading-relaxed mt-2 font-medium">
              Incorporated under our owner Shri Nikhil Shivaji Jadhav in Pattan Kadoli, Kolhapur. Gathered generational leather weavers to build our flagship manufacturing workspace.
            </p>
          </motion.div>

          {/* Milestone 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={historyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-[37px] top-1.5 w-4 h-4 bg-gold-500 rounded-full border border-cream" />
            <span className="text-xs font-bold text-gold-600 tracking-wider">SEPTEMBER 2023</span>
            <h4 className="font-serif text-lg font-bold text-dark mt-1">Expansion of Jewelry Manufacturing</h4>
            <p className="text-xs text-dark/60 leading-relaxed mt-2 font-medium">
              Formally scaled gold and imitation jewellery production workshops, adding complex filigree, ruby clusters, and gold-vermeil claddings.
            </p>
          </motion.div>

          {/* Milestone 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={historyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -left-[37px] top-1.5 w-4 h-4 bg-gold-500 rounded-full border border-cream" />
            <span className="text-xs font-bold text-gold-600 tracking-wider">MAY 2026</span>
            <h4 className="font-serif text-lg font-bold text-dark mt-1">Simulated Global Partner Network</h4>
            <p className="text-xs text-dark/60 leading-relaxed mt-2 font-medium">
              Launched the digital Onboarding portal for worldwide resellers and secure concierge inquiry management system.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
