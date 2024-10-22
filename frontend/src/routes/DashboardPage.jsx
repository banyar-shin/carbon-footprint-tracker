import { Outlet } from "react-router-dom"

import NavBar from "../components/NavBar"
import ModeSelector from "../components/ModeSelector"
import Footer from "../components/Footer"

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <NavBar />

      <div className="w-full px-3 flex items-center gap-3">
        <ModeSelector />

        <div className="" id="detail">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}
