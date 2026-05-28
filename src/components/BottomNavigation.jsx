import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BottomNavigation() {
  const location = useLocation()

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Products',
      path: '/heritage',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Profile',
      path: '/login',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center py-2 px-4 min-w-0 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                  active 
                    ? 'text-gold-600' 
                    : 'text-gray-500'
                }`}
              >
                <div className="mb-1">
                  {item.icon(active)}
                </div>
                <span className="text-xs font-medium">
                  {item.name}
                </span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gold-600 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}