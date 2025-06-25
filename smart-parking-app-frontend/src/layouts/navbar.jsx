import React, { useState, useEffect } from 'react'
import { FaCar, FaUserCircle, FaBell } from "react-icons/fa"
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import {
  fetchNotificationCount,
  fetchUnreadNotifications,
  markAllNotificationsRead
} from '../services/notificationService'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifCount, setNotifCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const { user, logout } = useAuth()

  useEffect(() => {
    const loadCount = async () => {
      if (user && !user.is_superuser) {
        try {
          const count = await fetchNotificationCount()
          setNotifCount(count)
        } catch (err) {
          console.error('Failed to fetch notification count', err)
        }
      }
    }
    loadCount()
  }, [user])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  const handleNotificationClick = async () => {
    try {
      if (!notifOpen) {
        const unread = await fetchUnreadNotifications()
        setNotifications(unread)
      }
      setNotifOpen(!notifOpen)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifCount(0)
      setNotifications([])
      setNotifOpen(false)
    } catch (err) {
      console.error('Failed to mark notifications as read', err)
    }
  }

  return (
    <nav className="bg-white text-black py-3 px-4 lg:px-30 shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <FaCar className="text-gray-900 text-2xl mr-2" />
          <h1 className="text-xl font-bold uppercase text-gray-900">SmartSpot</h1>
        </Link>

        <div className="flex-grow" />

        <div className="hidden lg:flex space-x-6">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          {user && !user.is_superuser && (
            <Link to="/reservations" className="hover:text-gray-900">Reservations</Link>
          )}
          <Link to="/pricing" className="hover:text-gray-900">Pricing</Link>
          <Link to="/locations" className="hover:text-gray-900">Locations</Link>
        </div>

        <div className="flex items-center ml-10 relative gap-4">
          {user && !user.is_superuser && (
            <div className="relative">
              <button onClick={handleNotificationClick} className="relative p-2 rounded-full hover:bg-gray-100">
                <FaBell className="text-xl text-gray-700" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <ul className="max-h-80 overflow-y-auto divide-y text-sm">
                    {notifications.length === 0 ? (
                      <li className="p-4 text-gray-500 text-center">No notifications</li>
                    ) : (
                      notifications.map((n) => (
                        <li key={n.id} className="p-4 hover:bg-gray-50">
                          <p className="text-gray-800 mb-1">{n.message}</p>
                          <p className="text-xs text-gray-500">
                            {n.reservation_date} @ {n.reservation_time} — {n.location}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!user || user.is_superuser ? (
            <Link
              to="/sign-in"
              className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaUserCircle className="text-2xl text-gray-700" />
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  {user.username}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-44 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${menuOpen ? 'block' : 'hidden'} lg:hidden mt-4`}>
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          {user && !user.is_superuser && (
            <Link to="/reservations" className="hover:text-gray-900">Reservations</Link>
          )}
          <Link to="/pricing" className="hover:text-gray-900">Pricing</Link>
          <Link to="/locations" className="hover:text-gray-900">Locations</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar