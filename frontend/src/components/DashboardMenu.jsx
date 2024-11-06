import { useNavigate, useLocation } from "react-router-dom";

export default function DashboardMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (route) => location.pathname === route

  return (
    <ul className="menu bg-base-200 min-w-[15vw]">
      <li>
        <button
          className={`btn btn-primary m-3 ${isActive('/dashboard') ? 'btn-active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          General
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${isActive('/dashboard/energy') ? 'btn-active' : ''}`}
          onClick={() => navigate('/dashboard/energy')}
        >
          Energy
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${isActive('/dashboard/transport') ? 'btn-active' : ''}`}
          onClick={() => navigate('/dashboard/transport')}
        >
          Transport
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${isActive('/dashboard/diet') ? 'btn-active' : ''}`}
          onClick={() => navigate('/dashboard/diet')}
        >
          Diet
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${isActive('/dashboard/settings') ? 'btn-active' : ''}`}
          onClick={() => navigate('/dashboard/settings')}
        >
          Settings
        </button>
      </li>
    </ul>
  );
}
