import React, { useState, useEffect } from 'react'
import FormInput from './formInput'
import PrimaryButton from './primaryButton'

const EditProfileModal = ({ isOpen, onClose, profile, onUpdate }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: ''
  })

  useEffect(() => {
    if (profile) {
      const parts = profile.full_name.split(' ')
      setForm({
        first_name: parts.slice(0, -1).join(' ') || '',
        last_name: parts.slice(-1).join('') || '',
        username: profile.username || ''
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(form)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Translucent white background */}
      <div
        className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
          >
            &times;
          </button>

          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Edit Profile</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="first_name"
              name="first_name"
              label="First Name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First name"
            />
            <FormInput
              id="last_name"
              name="last_name"
              label="Last Name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last name"
            />
            <FormInput
              id="username"
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />

            
              
              <PrimaryButton type="submit" className="w-32 py-2 text-sm">
                Save
              </PrimaryButton>
          
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProfileModal