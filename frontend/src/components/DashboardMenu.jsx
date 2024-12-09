import { useNavigate, useLocation } from "react-router-dom";
import { FaQuestionCircle, FaHome, FaBatteryFull, FaCar, FaUtensils, FaCog } from 'react-icons/fa'; // Adding some icons
import { RiQuestionAnswerFill } from "react-icons/ri";

export default function DashboardMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route) => location.pathname === route;

  return (
    <div className="flex flex-col bg-base-200 p-4 transition-all min-w-48">
      <ul className="menu space-y-6">
        <li>
          <button
            className={`btn btn-primary rounded-lg transition-all duration-300 ${isActive('/dashboard') ? 'text-white btn-active border border-white' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <FaHome className="text-xl" />
            General
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary rounded-lg transition-all duration-300 ${isActive('/dashboard/energy') ? 'text-white btn-active border border-white' : ''}`}
            onClick={() => navigate('/dashboard/energy')}
          >
            <FaBatteryFull className="text-xl" />
            Energy
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary rounded-lg transition-all duration-300 ${isActive('/dashboard/transport') ? 'text-white btn-active border border-white' : ''}`}
            onClick={() => navigate('/dashboard/transport')}
          >
            <FaCar className="text-xl" />
            Transport
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary rounded-lg transition-all duration-300 ${isActive('/dashboard/diet') ? 'text-white btn-active border border-white' : ''}`}
            onClick={() => navigate('/dashboard/diet')}
          >
            <FaUtensils className="text-xl" />
            Diet
          </button>
        </li>
      </ul>
      <div className="divider mt-auto mb-2" />
      <ul className="menu w-full gap-3">
        <li>
          <button
            className={`btn btn-primary w-full rounded-lg transition-all duration-300 ${isActive('/dashboard/tutorial') ? 'text-white btn-active border border-white' : ''}`}
            onClick={() => navigate('/dashboard/faq')}
          >
            <RiQuestionAnswerFill className="text-xl" />
            FAQ
          </button>
        </li>
        <li>
          <button
            className={`btn btn-primary w-full rounded-lg transition-all duration-300 ${isActive('/dashboard/tutorial') ? 'text-white btn-active border border-white' : ''}`}
            onClick={() => navigate('/dashboard/tutorial')}
          >
            <FaQuestionCircle className="text-xl" />
            Tutorial
          </button>
        </li>
      </ul>
    </div>
  );
}
