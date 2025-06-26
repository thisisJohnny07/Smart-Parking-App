import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'
import useAuth from '../../hooks/useAuth'

const SignIn = () => {
  // State variables for form inputs and UI state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ username: '', password: '', general: '' })
  const [loading, setLoading] = useState(false)

  const { login } = useAuth() // Custom authentication hook
  const navigate = useNavigate() // For redirecting after login

  // Client-side validation
  const validate = () => {
    const newErrors = { username: '', password: '', general: '' }
    let isValid = true

    if (!username.trim()) {
      newErrors.username = 'Username is required.'
      isValid = false
    }
    if (!password) {
      newErrors.password = 'Password is required.'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ username: '', password: '', general: '' })

    if (!validate()) return

    setLoading(true)
    try {
      // Attempt login, restrict superusers
      await login(username, password, { restrictSuperuser: true })
      navigate('/') // Redirect to home on success
    } catch (err) {
      // Handle login error cases
      if (err.message.includes('Admins are not allowed')) {
        setErrors(prev => ({ ...prev, general: 'Admins are not allowed to sign in here.' }))
      } else {
        setErrors(prev => ({ ...prev, general: 'Invalid credentials. Please try again.' }))
      }
    } finally {
      setLoading(false) // Always stop loading state
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col">
      <TopBar />
      <Navbar />

      {/* Sign-in form container */}
      <div className="flex-grow flex items-center justify-center px-4 my-16">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg max-w-md w-full p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

          {/* Sign-in form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              {/* Username input */}
              <FormInput
                id="username"
                name="username"
                type="text"
                placeholder="yourusername"
                label="Username:"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              {/* Password input */}
              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                label="Password:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Display general errors */}
            {errors.general && <p className="text-red-600 text-sm mt-1 text-center">{errors.general}</p>}

            {/* Submit button */}
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </PrimaryButton>
          </form>

          {/* Sign-up link */}
          <p className="mt-6 text-center text-gray-700">
            Don’t have an account?{' '}
            <a href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignIn