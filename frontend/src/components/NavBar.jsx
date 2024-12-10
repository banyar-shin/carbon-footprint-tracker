import { Link, useNavigate, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function NavBar({ toggleMenu }) {
  const navigate = useNavigate()
  const location = useLocation()

  const showSideBarButton = location.pathname.includes('/dashboard')

  return (
    <div className="w-full navbar bg-base-200 px-4 h-20">
      <div className="navbar-start">
        {showSideBarButton && (
          <button onClick={toggleMenu} className="btn btn-ghost btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        )}
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl" onClick={() => navigate('/')}>CarbonWise</a>
      </div>
      <div className="navbar-end">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-10 h-10',
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">
            <button className='btn btn-primary'>Sign In</button>
          </Link>
        </SignedOut>
      </div>
    </div>
  )
}
