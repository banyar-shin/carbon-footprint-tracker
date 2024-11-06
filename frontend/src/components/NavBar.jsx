import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function NavBar() {
  return (
    <div className="w-full">
      <div className="navbar bg-base-200 p-3">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a>Homepage</a></li>
              <li><a>Portfolio</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">CarbonWise</a>
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
    </div>
  )
}
