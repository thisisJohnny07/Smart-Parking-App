import React, { useState } from 'react'
import { FaCar } from 'react-icons/fa'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const SignIn = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form state for username and password
  const [formData, setFormData] = useState({ username: '', password: '' })

  // To hold and display error messages
  const [error, setError] = useState('')

  // Update form input values and clear error
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, password } = formData

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    try {
      const userData = await login(username, password)

      // Only allow admin (superuser) to access
      if (!userData?.is_superuser) {
        setError('Access denied: Only admin can access this page.')
        return
      }

      // Navigate to admin home on success
      navigate('/admin/home', { state: { username } })
    } catch (err) {
      // Handle login failure
      setError('Invalid credentials or server error.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        {/* Logo and heading */}
        <div className="flex items-center justify-center mb-6">
          <FaCar className="text-gray-900 text-2xl mr-2" />
          <h1 className="text-xl font-bold uppercase text-gray-900">SmartSpot</h1>
        </div>

        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Admin Sign In</h2>

        {/* Sign in form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            id="username"
            name="username"
            type="text"
            label="Username"
            placeholder="admin"
            value={formData.username}
            onChange={handleChange}
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {/* Error message */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <PrimaryButton type="submit">Sign In</PrimaryButton>
        </form>
      </div>
    </div>
  )
}

export default SignIn