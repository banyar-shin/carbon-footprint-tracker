import { Outlet, useOutletContext } from 'react-router-dom'
import DashboardMenu from '../components/DashboardMenu'

export default function DashboardPage() {
  // Access showMenu from RootLayout context
  const { showMenu } = useOutletContext()

  return (
    <div className="max-h-[92vh] flex">
      {/* Adjust the width of the sidebar based on showMenu */}
      <div className={`flex transition-all duration-200 ${showMenu ? 'w-48' : 'w-0'} overflow-hidden`}>
        <DashboardMenu />
      </div>

      {/* Content area */}
      <div className={`flex-grow h-[92vh] transition-all duration-200 ${!showMenu ? 'w-[calc(100%-12rem)]' : 'w-0'}`}>
        <Outlet />
      </div>
    </div>
  )
}
