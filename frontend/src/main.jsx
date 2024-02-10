import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
