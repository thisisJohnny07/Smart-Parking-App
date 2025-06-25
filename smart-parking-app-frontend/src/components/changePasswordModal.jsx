import React, { useState } from 'react'
import FormInput from './formInput'
import PrimaryButton from './primaryButton'
import { changePassword } from '../services/profileService'

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.new_password !== form.confirm_password) {
      setError("New password and confirm password don't match.")
      return
    }

    try {
      await changePassword({
        old_password: form.old_password,
        new_password: form.new_password,
      })
      setSuccess('Password changed successfully!')
      setForm({ old_password: '', new_password: '', confirm_password: '' })

      // Close modal immediately or after a short delay
      onClose() // closes immediately
      // Or use a delay to show the success message briefly:
      // setTimeout(() => onClose(), 1000)
    } catch (err) {
      const data = err.response?.data
      if (data?.old_password && Array.isArray(data.old_password)) {
        setError(data.old_password.join(' '))
      } else if (typeof data === 'string') {
        setError(data)
      } else {
        setError('Failed to change password.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
          >
            &times;
          </button>
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Change Password</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="old_password"
              name="old_password"
              label="Old Password"
              type="password"
              value={form.old_password}
              onChange={handleChange}
              placeholder="Enter current password"
            />
            <FormInput
              id="new_password"
              name="new_password"
              label="New Password"
              type="password"
              value={form.new_password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <FormInput
              id="confirm_password"
              name="confirm_password"
              label="Confirm New Password"
              type="password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="Confirm new password"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <PrimaryButton type="submit" className="w-32 py-2 text-sm">
              Save
            </PrimaryButton>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChangePasswordModal