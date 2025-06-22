import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa'

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-white w-full">
      <div className="flex flex-col lg:flex-row justify-between items-center py-2 px-4 lg:px-30 text-sm">
        
        {/* Left: Contact Info */}
        <div className="flex items-center space-x-4 mb-2 lg:mb-0">
          <div className="flex items-center space-x-1">
            <FaPhoneAlt />
            <span>+012 345 6789</span>
          </div>
          <span>|</span>
          <div className="flex items-center space-x-1">
            <FaEnvelope />
            <span>info@example.com</span>
          </div>
        </div>

        {/* Right: Social Media Links */}
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-blue-500">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-blue-600">
            <FaLinkedinIn />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-red-500">
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar