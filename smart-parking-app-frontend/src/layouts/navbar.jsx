import React, { useState } from 'react'
import { FaCar } from "react-icons/fa";
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white text-black py-3 px-4 lg:px-30 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <FaCar className="text-gray-900 text-2xl mr-2" />
          <h1 className="text-xl font-bold uppercase text-gray-900">SmartSpot</h1>
        </Link>

        {/* Spacer to push right side content */}
        <div className="flex-grow" />

        {/* Desktop nav links */}
        <div className="hidden lg:flex space-x-6">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <Link to="/about" className="hover:text-gray-900">Reservations</Link>
          <Link to="/courses" className="hover:text-gray-900">Pricing</Link>
          <Link to="/contact" className="hover:text-gray-900">Locations</Link>
        </div>

        {/* Right side on desktop and mobile */}
        <div className="flex items-center ml-10">
          {/* Sign Up Button */}
          <Link
            to="/sign-in"
            className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            Sign In
          </Link>

          {/* Hamburger for mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden focus:outline-none ml-5"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu with nav links */}
      <div className={`${menuOpen ? 'block' : 'hidden'} lg:hidden mt-4`}>
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <Link to="/about" className="hover:text-gray-900">About</Link>
          <Link to="/courses" className="hover:text-gray-900">Courses</Link>
          <Link to="/contact" className="hover:text-gray-900">Contact</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar