import React from 'react'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'

const SignIn = () => {
  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col" >
      <TopBar />
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 my-16">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg max-w-md w-full p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
          <form className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email:"
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              label="Password:"
            />
            <PrimaryButton type="submit" children="Sign In" onClick={() => {}} />
          </form>

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