import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'
import useAuth from '../../hooks/useAuth'

const SignUp = () => {
  // Form state for user input fields
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
  })

  // Error state for each field + submission error
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { register } = useAuth() // Custom auth hook to call register API

  // Handle input field changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' })) // Clear error on field update
    setSubmitError('') // Reset submission error
  }

  // Validate form before submission
  const validate = () => {
    const newErrors = {}

    if (!form.username.trim()) newErrors.username = 'Username is required.'
    if (!form.email.trim()) newErrors.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid.'
    if (!form.password) newErrors.password = 'Password is required.'
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required.'
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.'
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required.'
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required.'

    return newErrors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setSubmitError('')

    const payload = {
      username: form.username,
      password: form.password,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
    }

    try {
      await register(payload)
      navigate('/sign-in') // Redirect on successful registration
    } catch (error) {
      // Handle backend validation or generic errors
      if (error.response?.data) {
        const apiErrors = error.response.data
        const newErrors = {}
        for (const key in apiErrors) {
          newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key].join(' ') : apiErrors[key]
        }
        setErrors(newErrors)
      } else {
        setSubmitError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col">
      <TopBar />
      <Navbar />

      {/* Sign Up Form Container */}
      <div className="flex-grow flex items-center justify-center px-4 my-16">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg max-w-2xl w-full p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

          {/* Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div>
              <FormInput
                id="username"
                name="username"
                type="text"
                placeholder="Your username"
                label="Username:"
                value={form.username}
                onChange={handleChange}
                required
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                label="Email:"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* First Name */}
            <div>
              <FormInput
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                label="First Name:"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div>
              <FormInput
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Rey"
                label="Last Name:"
                value={form.last_name}
                onChange={handleChange}
                required
              />
              {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>}
            </div>

            {/* Password */}
            <div>
              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                label="Password:"
                value={form.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                label="Confirm Password:"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submission */}
            <div className="md:col-span-2">
              {submitError && <p className="text-red-600 mb-2 text-center">{submitError}</p>}
              <PrimaryButton type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </PrimaryButton>
            </div>
          </form>

          {/* Redirect to Sign In */}
          <p className="mt-6 text-center text-gray-700 md:col-span-2">
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignUp