import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { useState } from 'react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const showNavBar = !location.pathname.includes('/sign-in') && !location.pathname.includes('/sign-up')
  const showFooter = !location.pathname.includes('/sign-in') && !location.pathname.includes('/sign-up') && !location.pathname.includes('/dashboard')

  const [showMenu, setShowMenu] = useState(true)
  const toggleMenu = () => setShowMenu((prev) => !prev)

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <header className="header">
        {showNavBar && (
          <NavBar toggleMenu={toggleMenu} />
        )}
      </header>
      <main className='max-h-[92vh]'>
        <Outlet context={{ showMenu }} />
      </main>
      {showFooter && (
        <Footer />
      )}
    </ClerkProvider>
  )
}
