import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBatteryFull, FaCar, FaUtensils, FaCog } from 'react-icons/fa'; // Adding some icons

export default function DashboardMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => location.pathname === route;

  return (
    <div className="flex flex-col bg-base-200 shadow-md p-4 transition-all min-w-[13vw]">
      <ul className="menu space-y-6">
        <li>
          <button
            className={`btn btn-primary p-2 rounded-lg transition-all duration-300 ${isActive('/dashboard') ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
            onClick={() => navigate('/dashboard')}
          >
            <FaHome className="text-2xl" />
            General
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary p-2 rounded-lg transition-all duration-300 ${isActive('/dashboard/energy') ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
            onClick={() => navigate('/dashboard/energy')}
          >
            <FaBatteryFull className="text-2xl" />
            Energy
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary p-2 rounded-lg transition-all duration-300 ${isActive('/dashboard/transport') ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
            onClick={() => navigate('/dashboard/transport')}
          >
            <FaCar className="text-2xl" />
            Transport
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary p-2 rounded-lg transition-all duration-300 ${isActive('/dashboard/diet') ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
            onClick={() => navigate('/dashboard/diet')}
          >
            <FaUtensils className="text-2xl" />
            Diet
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary gap-2 p-2 rounded-lg transition-all duration-300 ${isActive('/dashboard/settings') ? 'bg-primary text-white' : 'hover:bg-primary/50'}`}
            onClick={() => navigate('/dashboard/settings')}
          >
            <FaCog className="text-2xl" />
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
}
