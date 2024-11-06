import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

import ErrorPage from './routes/ErrorPage'
import LandingPage from './routes/LandingPage'
import SignInPage from './routes/SignInPage'
import SignUpPage from './routes/SignUpPage'
import DashboardPage from './routes/DashboardPage'
import Energy from './routes/Energy'
import Transport from './routes/Transport'
import Diet from './routes/Diet'
import Settings from './routes/Settings'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: 'dashboard',
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
            children: [
              { path: '/dashboard/energy', element: <Energy /> },
              { path: '/dashboard/transport', element: <Transport /> },
              { path: '/dashboard/diet', element: <Diet /> },
              { path: '/dashboard/settings', element: <Settings /> },
            ]
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
