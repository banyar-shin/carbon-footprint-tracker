import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

import LandingPage from "./routes/LandingPage"
import ErrorPage from "./routes/ErrorPage"
import AuthPage from "./routes/AuthPage"
import SettingsPage from "./routes/SettingsPage"
import DashboardPage from "./routes/DashboardPage"
import Home from "./routes/Home"
import Transport from "./routes/Transport"
import Diet from "./routes/Diet"
import Power from "./routes/Power"
import Login from "./routes/Login"
import Signup from "./routes/Signup"

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "transport",
        element: <Transport />,
      },
      {
        path: "diet",
        element: <Diet />,
      },
      {
        path: "power",
        element: <Power />,
      },
    ]
  },
  {
    path: "settings",
    element: <SettingsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "auth",
    element: <AuthPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
