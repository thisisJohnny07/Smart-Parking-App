import React, { useState, useEffect } from 'react'
import {
  FaCar,
  FaHome,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import useAuth from '../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './dashboard'
import Users from './users'
import ManageParking from './manageParking'
import Bookings from './bookings'

// Sidebar menu config
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
  { id: 'bookings', label: 'Bookings', icon: <FaCar /> },
  { id: 'manage-parking', label: 'Manage Parking', icon: <FaCog /> },
  { id: 'users', label: 'Users', icon: <FaUsers /> },
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Get initial tab from URL, fallback to dashboard
  const searchParams = new URLSearchParams(location.search)
  const initialTab = searchParams.get('tab') || 'dashboard'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''
  }, [isSidebarOpen])

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/sign-in')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'bookings':
        return <Bookings />
      case 'manage-parking':
        return <ManageParking />
      case 'users':
        return <Users />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-4 py-3 z-50">
        <div className="flex items-center">
          <FaCar className="text-2xl mr-2" />
          <h1 className="text-lg font-bold uppercase tracking-wider">SmartSpot</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-xl focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      {/* Sidebar (mobile/desktop) */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >
        <div className="flex items-center px-6 py-4 border-b border-gray-700">
          <FaCar className="text-2xl mr-2" />
          <h1 className="text-xl font-bold uppercase tracking-wider">SmartSpot</h1>
        </div>

        {/* Navigation buttons */}
        <nav className="mt-6">
          {menuItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id)
                setIsSidebarOpen(false) // Close sidebar on mobile
              }}
              className={`w-full text-left flex items-center px-6 py-3 hover:bg-gray-800 transition ${
                activeTab === id ? 'bg-gray-800 font-semibold' : ''
              }`}
            >
              <span className="mr-3 text-lg">{icon}</span> {label}
            </button>
          ))}

          {/* Logout button */}
          <hr className="border-gray-700 my-4 mx-6" />
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-6 py-3 hover:bg-gray-800 transition"
          >
            <span className="mr-3 text-lg">
              <FaSignOutAlt />
            </span>{' '}
            Logout
          </button>
        </nav>
      </aside>

      {/* Main view area */}
      <main className="flex-1 overflow-y-auto bg-gray-100 mt-14 md:mt-0">
        {renderContent()}
      </main>
    </div>
  )
}

export default Sidebar