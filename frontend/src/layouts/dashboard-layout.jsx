import * as React from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'

export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()

  const { showMenu } = useOutletContext()

  React.useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in')
    }
  }, [isLoaded])

  if (!isLoaded) return (
    <div id="error-page" className="flex flex-col w-full h-screen items-center justify-center text-center text-base-content">
      <h1 className="text-3xl font-bold">Loading...</h1>
      <p className="text-xl">Thank you for your patience.</p>
    </div>
  );

  return <Outlet context={{ showMenu }} />
}
