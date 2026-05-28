import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import HomePage from './pages/HomePage'
import HeritagePage from './pages/HeritagePage'
import ProductPage from './pages/ProductPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ResellerLoginPage from './pages/ResellerLoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import ReturnPolicyPage from './pages/ReturnPolicyPage'
import CopyrightPolicyPage from './pages/CopyrightPolicyPage'
import CheckoutPage from './pages/CheckoutPage'
import BottomNavigation from './components/BottomNavigation'
import { AppProvider } from './context/AppContext'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll on navigation
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Backup scroll after DOM paints (fixes issues where dynamic content pushes the page down)
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <div className="grain pb-[70px] md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/heritage" element={<HeritagePage />} />
            <Route path="/shop" element={<HeritagePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reseller-login" element={<ResellerLoginPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/copyright-policy" element={<CopyrightPolicyPage />} />
          </Routes>
          <BottomNavigation />
          
          {/* Floating WhatsApp Button */}
          <a 
            href="https://wa.me/918806889793" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-[80px] md:bottom-8 left-4 md:left-8 z-[100] bg-[#25D366] hover:bg-[#20b858] text-white p-3.5 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 flex items-center justify-center"
            title="Chat with us on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.556 4.186 1.61 5.99L.416 23.5l5.63-1.477a11.96 11.96 0 0 0 5.985 1.603h.004c6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm0 21.607h-.003c-1.802 0-3.567-.483-5.114-1.401l-.367-.217-3.805.998.998-3.71-.238-.378a9.982 9.982 0 0 1-1.526-5.263c0-5.522 4.492-10.015 10.015-10.015 5.523 0 10.015 4.493 10.015 10.015 0 5.522-4.492 10.014-10.014 10.014zm5.495-7.51c-.301-.151-1.785-.882-2.062-.983-.277-.101-.478-.151-.679.151-.201.302-.779.983-.955 1.184-.176.201-.352.226-.653.075-1.425-.716-2.585-1.558-3.415-2.923-.213-.35-.022-.54.129-.689.136-.135.302-.351.452-.527.151-.176.201-.301.302-.502.101-.201.05-.377-.025-.527-.075-.151-.679-1.637-.93-2.239-.245-.589-.494-.509-.679-.518-.175-.008-.376-.01-.577-.01-.201 0-.527-.075-.803.376-.276.301-1.054 1.03-1.054 2.51s1.079 2.912 1.23 3.113c.151.201 2.122 3.24 5.138 4.538 2.012.868 2.825.938 3.843.784.825-.125 2.535-1.03 2.887-2.035.352-1.004.352-1.857.247-2.035-.105-.178-.381-.278-.683-.429z" />
            </svg>
          </a>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
