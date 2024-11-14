import { Outlet, useOutletContext } from 'react-router-dom'
import DashboardMenu from '../components/DashboardMenu'

export default function DashboardPage() {
  // Access showMenu from RootLayout context
  const { showMenu } = useOutletContext()

  return (
    <div className="max-h-[92vh] flex">
      {/* Adjust the width of the sidebar based on showMenu */}
      <div className={`flex transition-all duration-300 ${showMenu ? 'w-64' : 'w-0'} overflow-hidden`}>
        <DashboardMenu />
      </div>

      {/* Content area */}
      <div className={`flex-grow transition-all duration-300`}>
        <Outlet />
      </div>
    </div>
  )
}
