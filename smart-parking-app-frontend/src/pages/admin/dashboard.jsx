import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaCalendarAlt, FaParking, FaClock } from 'react-icons/fa'
import { fetchDashboardSummary } from '../../services/reservationService'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const Dashboard = () => {
  const location = useLocation()
  const email = location.state?.email || 'Admin'

  // State to hold summary data and loading status
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load dashboard data on mount
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchDashboardSummary()
        setSummary(data)  // Store API response object directly
      } catch (err) {
        console.error('Failed to load dashboard summary:', err)
      } finally {
        setLoading(false)  // Hide loading indicator when done
      }
    }
    loadSummary()
  }, [])

  // Top-level stats (exclude cancellations here)
  const stats = [
    {
      label: "Today's Reservations",
      value: summary?.total_reservations_today || 0,
      icon: <FaCalendarAlt className="text-blue-600" />,
    },
    {
      label: 'Pending Approvals',
      value: summary?.pending_approvals || 0,
      icon: <FaClock className="text-red-600" />,
    },
    {
      label: 'Currently Parked',
      value: summary?.currently_parked || 0,
      icon: <FaParking className="text-yellow-600" />,
    },
  ]

  // Format daily reservations data for line chart
  const chartData = summary?.daily_reservations?.map(day => {
    const dateObj = new Date(day.date)
    const label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    return { date: label, count: day.count }
  }) || []

  // Format payment distribution data for bar chart
  const paymentData = summary?.payment_distribution
    ? Object.entries(summary.payment_distribution).map(([method, count]) => ({
        method,
        count,
      }))
    : []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, <strong>{email}</strong>
        </p>
      </div>

      {loading ? (
        // Loading spinner/text
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white rounded-md px-5 py-4 shadow-sm hover:shadow-md transition"
              >
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-xl font-semibold text-gray-900">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Approval Funnel Section (includes cancelled) */}
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Approval Funnel</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {summary?.approval_funnel &&
                // Render all funnel keys dynamically, including "cancelled"
                Object.entries(summary.approval_funnel).map(([status, count]) => (
                  <div key={status} className="bg-white rounded-md p-4 shadow-sm text-center">
                    {/* Format status label */}
                    <p className="capitalize text-sm text-gray-500">{status.replace('_', ' ')}</p>
                    <p className="text-lg font-semibold text-gray-800">{count}</p>
                  </div>
                ))}
            </div>
          </section>

          {/* Charts Section */}
          <section className="mb-8 bg-white rounded-md p-6 shadow-sm flex flex-col md:flex-row md:space-x-6">
            {/* Daily Reservations Line Chart */}
            <div
              className="flex-grow min-w-[300px]"
              style={{ height: 300, flexBasis: '65%' }}
            >
              <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Reservations (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
                  <CartesianGrid stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Distribution Bar Chart */}
            <div
              className="flex-grow min-w-[200px] mt-8 md:mt-0"
              style={{ height: 300, flexBasis: '35%' }}
            >
              <h2 className="text-base font-semibold text-gray-800 mb-4">Payment Distribution</h2>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
                  <CartesianGrid stroke="#f0f0f0" />
                  <XAxis dataKey="method" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" barSize={30} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard