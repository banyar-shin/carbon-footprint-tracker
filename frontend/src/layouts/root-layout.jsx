import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const showNavBar = location.pathname === '/dashboard' || location.pathname === '/'

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <header className="header">
        {showNavBar && (
          <NavBar />
        )}
      </header>
      <main>
        <Outlet />
      </main>
      {showNavBar && (
          <Footer />
        )}
    </ClerkProvider>
  )
}
