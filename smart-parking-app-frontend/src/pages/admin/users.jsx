import React, { useState, useEffect, useMemo } from 'react'
import { getUsers, deactivateUser, activateUser } from '../../services/userService'

const Users = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Unable to load users. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(lowerSearch) ||
        u.username.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch)
    )
  }, [users, searchTerm])

  const toggleActive = async (id, isActive) => {
    try {
      if (isActive) {
        await deactivateUser(id)
      } else {
        await activateUser(id)
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isActive: !isActive } : user
        )
      )
    } catch (err) {
      console.error(`Failed to ${isActive ? 'deactivate' : 'activate'} user:`, err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Users</h1>

      <input
        type="text"
        placeholder="Search users by name, email, or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      {loading ? (
        <div className="text-center text-gray-600">Loading users...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Username</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(user.id, user.isActive)}
                        className={`px-4 py-2 rounded font-semibold ${
                          user.isActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Users