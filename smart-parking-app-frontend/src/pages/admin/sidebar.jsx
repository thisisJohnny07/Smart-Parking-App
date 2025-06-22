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
import Dashboard from './dashboard'
import Users from './users'
import ManageParking from './manageParking'
import Bookings from './bookings'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
  { id: 'bookings', label: 'Bookings', icon: <FaCar /> },
  { id: 'manage-parking', label: 'Manage Parking', icon: <FaCog /> },
  { id: 'users', label: 'Users', icon: <FaUsers /> },
]

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const handleLogout = () => {
    // Replace with actual logout logic (e.g., Firebase signOut, token removal, redirect, etc.)
    console.log('Logout clicked')
  }

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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-4 py-3 z-50">
        <div className="flex items-center">
          <FaCar className="text-2xl mr-2" />
          <h1 className="text-lg font-bold uppercase tracking-wider">SmartSpot</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-xl focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

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

        <nav className="mt-6">
          {menuItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id)
                setIsSidebarOpen(false)
              }}
              className={`w-full text-left flex items-center px-6 py-3 hover:bg-gray-800 transition ${
                activeTab === id ? 'bg-gray-800 font-semibold' : ''
              }`}
            >
              <span className="mr-3 text-lg">{icon}</span> {label}
            </button>
          ))}

          <hr className="border-gray-700 my-4 mx-6" />

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-6 py-3 hover:bg-gray-800 transition"
          >
            <span className="mr-3 text-lg"><FaSignOutAlt /></span> Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-100 mt-14 md:mt-0">
        {renderContent()}
      </main>
    </div>
  )
}

export default Sidebar