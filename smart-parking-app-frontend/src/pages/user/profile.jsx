import React, { useEffect, useState } from 'react'
import { fetchUserProfile, updateUserProfile } from '../../services/profileService'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import EditProfileModal from '../../components/editProfileModal'
import ChangePasswordModal from '../../components/changePasswordModal'
import { FaUserCircle } from 'react-icons/fa'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchUserProfile()
        setProfile(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }
    getProfile()
  }, [])

  const handleUpdate = async (updatedFields) => {
    try {
      setLoading(true)
      const payload = {
        first_name: updatedFields.first_name,
        last_name: updatedFields.last_name,
        username: updatedFields.username
      }
      await updateUserProfile(payload)
      const refreshedProfile = await fetchUserProfile()
      setProfile(refreshedProfile)
      setEditOpen(false)
    } catch {
      alert('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TopBar />
      <Navbar />
      {/* Remove min-h-screen, just use padding top and bottom */}
      <div className="bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-start px-4 pt-6 pb-6 min-w-full">
        <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md relative">
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-gray-300 text-6xl mb-3" />
            <h2 className="text-2xl font-bold text-gray-800 text-center">User Profile</h2>
            <p className="text-xs text-gray-500 mt-1">Manage your account information</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="space-y-4 text-gray-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Full Name</p>
                  <p className="text-lg font-semibold">{profile.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                  <p className="text-lg font-semibold">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Username</p>
                  <p className="text-lg font-semibold">{profile.username}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEditOpen(true)}
                  className="w-full py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition duration-200 text-sm"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setPasswordOpen(true)}
                  className="w-full py-2 border border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition duration-200 text-sm"
                >
                  Change Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onUpdate={handleUpdate}
      />

      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </>
  )
}

export default Profile