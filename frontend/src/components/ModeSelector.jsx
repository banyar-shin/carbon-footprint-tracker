import { useLocation } from 'react-router-dom';

export default function ModeSelector() {
  const route = useLocation()

  return (
    <ul className="menu bg-base-300/75 w-25 rounded-3xl">
      <li>
        <button
          className={`btn btn-primary m-3 ${route.pathname === '/dashboard' ? 'btn-active' : ''}`}>
          Home
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${route.pathname === '/dashboard/power' ? 'btn-active' : ''}`}>
          Power
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${route.pathname === '/dashboard/diet' ? 'btn-active' : ''}`}>
          Diet
        </button>
      </li>
      <li>
        <button
          className={`btn btn-primary m-3 ${route.pathname === '/dashboard/transport' ? 'btn-active' : ''}`}>
          Transport
        </button>
      </li>
    </ul>
  )
}
