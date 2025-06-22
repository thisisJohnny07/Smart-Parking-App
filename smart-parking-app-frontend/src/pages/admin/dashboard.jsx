import React from 'react'
import { useLocation } from 'react-router-dom'
import { FaCalendarAlt, FaUsers, FaParking, FaClock } from 'react-icons/fa'

const Dashboard = () => {
  const location = useLocation()
  const email = location.state?.email || 'Admin'

  const stats = [
    { label: "Today's Reservations", value: 34, icon: <FaCalendarAlt />, color: 'bg-blue-100', text: 'text-blue-700' },
    { label: 'Total Users', value: 128, icon: <FaUsers />, color: 'bg-green-100', text: 'text-green-700' },
    { label: 'Available Slots', value: 45, icon: <FaParking />, color: 'bg-yellow-100', text: 'text-yellow-700' },
    { label: 'Pending Approvals', value: 5, icon: <FaClock />, color: 'bg-red-100', text: 'text-red-700' },
  ]

  const recentReservations = [
    { id: 'RES-2025-001', user: 'John D.', slot: 'Premium', date: '2025-06-21', time: '10:00 AM' },
    { id: 'RES-2025-002', user: 'Maria C.', slot: 'Standard', date: '2025-06-21', time: '11:30 AM' },
    { id: 'RES-2025-003', user: 'Alex T.', slot: 'Covered', date: '2025-06-20', time: '02:00 PM' },
  ]

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, <strong>{email}</strong></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center p-5 bg-white rounded-xl shadow">
            <div className={`p-3 rounded-full ${stat.color} mr-4 text-xl ${stat.text}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 pr-6">Reservation ID</th>
                <th className="py-2 pr-6">User</th>
                <th className="py-2 pr-6">Slot Type</th>
                <th className="py-2 pr-6">Date</th>
                <th className="py-2 pr-6">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-6">{res.id}</td>
                  <td className="py-2 pr-6">{res.user}</td>
                  <td className="py-2 pr-6">{res.slot}</td>
                  <td className="py-2 pr-6">{res.date}</td>
                  <td className="py-2 pr-6">{res.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard