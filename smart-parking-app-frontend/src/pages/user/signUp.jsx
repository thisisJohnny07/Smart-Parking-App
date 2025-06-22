import React from 'react'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'

const SignUp = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your sign-up logic here
    console.log('Sign up submitted')
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col">
      <TopBar />
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 my-16">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg max-w-md w-full p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              id="username"
              name="username"
              type="text"
              placeholder="Your username"
              label="Username:"
            />
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email:"
            />
            <FormInput
              id="password1"
              name="password1"
              type="password"
              placeholder="••••••••"
              label="Password:"
            />
            <FormInput
              id="password2"
              name="password2"
              type="password"
              placeholder="••••••••"
              label="Confirm Password:"
            />

            <PrimaryButton type="submit">Sign Up</PrimaryButton>
          </form>

          <p className="mt-6 text-center text-gray-700">
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