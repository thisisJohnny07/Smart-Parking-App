import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaBehance, FaDribbble, FaPlay } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="w-full px-4 lg:px-30 mx-auto">
        {/* Logo & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-2xl font-bold mb-4 md:mb-0">
            <a href="#" className="text-white hover:text-blue-400">SmartSpot</a>
          </div>
          <ul className="flex space-x-4 text-white">
            <li><a href="#"><FaFacebookF className="hover:text-blue-500" /></a></li>
            <li><a href="#"><FaTwitter className="hover:text-blue-400" /></a></li>
            <li><a href="#"><FaInstagram className="hover:text-pink-500" /></a></li>
            <li><a href="#"><FaBehance className="hover:text-blue-600" /></a></li>
            <li><a href="#"><FaDribbble className="hover:text-pink-400" /></a></li>
            <li><a href="#"><FaPlay className="hover:text-red-500" /></a></li>
          </ul>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <ul className="flex space-x-6 mb-4 md:mb-0">
            <li><a href="#" className="hover:text-gray-300">Privacy</a></li>
            <li><a href="#" className="hover:text-gray-300">Policy</a></li>
          </ul>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">Our Works</a></li>
            <li><a href="#" className="hover:text-gray-300">About</a></li>
            <li><a href="#" className="hover:text-gray-300">Blog</a></li>
            <li><a href="#" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SmartSpot. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer