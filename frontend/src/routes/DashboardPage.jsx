import { Outlet } from 'react-router-dom'
import DashboardMenu from '../components/DashboardMenu'

export default function DashboardPage() {
  return (
    <div className="max-h-[92vh] flex justify-start gap-5">
      <DashboardMenu />
      <Outlet />
    </div>
  )
}
