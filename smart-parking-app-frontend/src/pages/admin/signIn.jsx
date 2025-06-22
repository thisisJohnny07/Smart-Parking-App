import React, { useState } from 'react'
import { FaCar } from 'react-icons/fa'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = formData

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    // TODO: Add real authentication logic here

    navigate('/admin/sidebar', { state: { email } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <FaCar className="text-gray-900 text-2xl mr-2" />
          <h1 className="text-xl font-bold uppercase text-gray-900">SmartSpot</h1>
        </div>

        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Admin Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="admin@example.com"
            value={formData.email}
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <PrimaryButton type="submit">Sign In</PrimaryButton>
        </form>
      </div>
    </div>
  )
}

export default SignIn