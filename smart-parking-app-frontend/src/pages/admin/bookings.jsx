import React, { useState, useEffect } from 'react'
import {
  getReservations,
  cancelReservation,
  checkInReservation,
  checkOutReservation,
  approveReservation,
  markPaidReservation,
} from '../../services/reservationService'
import { FaCheck, FaSignOutAlt, FaTimes, FaMoneyBillWave, FaThumbsUp } from 'react-icons/fa'

const Bookings = () => {
  const [allReservations, setAllReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRes, setSelectedRes] = useState(null)
  const [activeTab, setActiveTab] = useState('ongoing')

  const now = new Date()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getReservations()
        setAllReservations(data)
      } catch (err) {
        console.error('Failed to load reservations', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const toDateTime = (res) => {
    const start = new Date(`${res.date}T${res.time}`)
    const end = new Date(start.getTime() + res.duration_hours * 60 * 60 * 1000)
    return { start, end }
  }

  const filterAndSearch = (filterFn, includeCancelled = false) =>
    allReservations.filter((res) => {
      const isMatch =
        res.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.slot_type?.toLowerCase().includes(searchTerm.toLowerCase())

      const cancelledCondition = includeCancelled ? res.is_cancelled : !res.is_cancelled

      return isMatch && cancelledCondition && filterFn(res)
    })

  const reservationsByTab = () => {
    switch (activeTab) {
      case 'ongoing': {
        return filterAndSearch((res) => {
          const { start, end } = toDateTime(res)
          // Exclude checked out reservations from ongoing
          return now >= start && now <= end && !res.has_exited
        })
      }
      case 'incoming': {
        return filterAndSearch((res) => {
          const { start } = toDateTime(res)
          return now < start
        })
      }
      case 'past': {
        return filterAndSearch((res) => {
          const { end } = toDateTime(res)
          // Include those that ended OR have checked out
          return now > end || res.has_exited
        })
      }
      case 'cancelled': {
        return filterAndSearch(() => true, true)
      }
      default:
        return []
    }
  }

  // Handlers for API actions:
  const handleCancelReservation = async (res) => {
    try {
      await cancelReservation(res.id)
      setAllReservations((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, is_cancelled: true } : r))
      )
      setSelectedRes(null)
    } catch (err) {
      console.error('Cancellation failed:', err)
    }
  }

  const handleCheckIn = async (res) => {
    try {
      await checkInReservation(res.id)
      setAllReservations((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, has_arrived: true } : r))
      )
      setSelectedRes((prev) => ({ ...prev, has_arrived: true }))
    } catch (err) {
      console.error('Check-in failed:', err)
    }
  }

  const handleCheckOut = async (res) => {
    try {
      await checkOutReservation(res.id)
      setAllReservations((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, has_exited: true } : r))
      )
      setSelectedRes((prev) => ({ ...prev, has_exited: true }))
    } catch (err) {
      console.error('Check-out failed:', err)
    }
  }

  const handleApproveReservation = async (res) => {
    try {
      await approveReservation(res.id)
      setAllReservations((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, is_approved: true } : r))
      )
      setSelectedRes((prev) => ({ ...prev, is_approved: true }))
    } catch (err) {
      console.error('Approval failed:', err)
    }
  }

  const handleMarkPaid = async (res) => {
    try {
      await markPaidReservation(res.id)
      setAllReservations((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, is_paid: true } : r))
      )
      setSelectedRes((prev) => ({ ...prev, is_paid: true }))
    } catch (err) {
      console.error('Mark paid failed:', err)
    }
  }

  // Table component with extra columns for paid and approved status
  const ReservationTable = ({ reservations }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-100">
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Time</th>
            <th className="p-4 text-left">Slot</th>
            <th className="p-4 text-left">Paid</th>
            {(activeTab === 'ongoing' || activeTab === 'incoming') && (
              <th className="p-4 text-left">Approved</th>
            )}
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td
                colSpan={activeTab === 'ongoing' || activeTab === 'incoming' ? 6 : 5}
                className="py-6 text-center text-gray-500"
              >
                No reservations found.
              </td>
            </tr>
          ) : (
            reservations.map((res) => (
              <tr
                key={res.id}
                onClick={() => setSelectedRes(res)}
                className="cursor-pointer hover:bg-gray-50 transition"
              >
                <td className="p-4">{res.user}</td>
                <td className="p-4">{res.date}</td>
                <td className="p-4">{res.time}</td>
                <td className="p-4">{res.slot_type}</td>
                <td className="p-4">
                  {res.is_paid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Unpaid</span>
                  )}
                </td>
                {(activeTab === 'ongoing' || activeTab === 'incoming') && (
                  <td className="p-4">
                    {res.is_approved ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Pending</span>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  const activeReservations = reservationsByTab()

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bookings</h1>

      <input
        type="text"
        placeholder="Search by user, slot, or plate number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <div className="flex gap-2 mb-6">
        {['ongoing', 'incoming', 'past', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <ReservationTable reservations={activeReservations} />
      )}

      {selectedRes && (
        <>
          <div className="fixed inset-0 bg-black opacity-30 z-40" />
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => setSelectedRes(null)}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedRes(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &#x2715;
              </button>

              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Reservation Details</h2>

              <div className="grid grid-cols-2 gap-4 text-gray-700 mb-4">
                <div>
                  <strong>Name:</strong> {selectedRes.user}
                </div>
                <div>
                  <strong>Location:</strong> {selectedRes.location}
                </div>
                <div>
                  <strong>Date:</strong> {selectedRes.date}
                </div>
                <div>
                  <strong>Time:</strong> {selectedRes.time}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedRes.duration_hours} hr(s)
                </div>
                <div>
                  <strong>Slot Type:</strong> {selectedRes.slot_type}
                </div>
                <div>
                  <strong>Vehicle:</strong> {selectedRes.vehicle_type}
                </div>
                <div>
                  <strong>Plate #:</strong> {selectedRes.plate_number}
                </div>
                <div>
                  <strong>Make:</strong> {selectedRes.vehicle_make}
                </div>
                <div>
                  <strong>Model:</strong> {selectedRes.vehicle_model}
                </div>
                <div>
                  <strong>Color:</strong> {selectedRes.color}
                </div>
                <div>
                  <strong>Payment Mode:</strong> {selectedRes.mode_of_payment}
                </div>
                <div>
                  <strong>Approved:</strong> {selectedRes.is_approved ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 mt-4">
                {/* Approve button for ongoing and incoming if NOT approved */}
                {(activeTab === 'ongoing' || activeTab === 'incoming') && !selectedRes.is_approved && (
                  <button
                    onClick={() => handleApproveReservation(selectedRes)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    <FaThumbsUp /> Approve Reservation
                  </button>
                )}

                {/* Mark Checked In only if approved and ongoing */}
                {activeTab === 'ongoing' && selectedRes.is_approved && !selectedRes.has_arrived && !selectedRes.is_cancelled && (
                  <button
                    onClick={() => handleCheckIn(selectedRes)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    <FaCheck /> Mark Checked In
                  </button>
                )}

                {/* Mark Checked Out only if paid, in 'ongoing' or 'past' tabs, if checked in but not yet checked out */}
                {(activeTab === 'ongoing' || activeTab === 'past') &&
                  selectedRes.has_arrived &&
                  !selectedRes.has_exited &&
                  selectedRes.is_paid && (
                    <button
                      onClick={() => handleCheckOut(selectedRes)}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      <FaSignOutAlt /> Mark Checked Out
                    </button>
                )}

                {/* Cancel button only if approved, not cancelled, ongoing or incoming */}
                {(activeTab === 'incoming') &&
                  selectedRes.is_approved &&
                  !selectedRes.is_cancelled &&
                  !selectedRes.has_exited &&
                  new Date(`${selectedRes.date}T${selectedRes.time}`) > new Date() && (
                    <button
                      onClick={() => handleCancelReservation(selectedRes)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      <FaTimes /> Cancel
                    </button>
                )}

                {/* Mark Paid only if ongoing or incoming, approved, unpaid */}
                {(activeTab === 'ongoing' || activeTab === 'incoming') && selectedRes.is_approved && !selectedRes.is_paid && !selectedRes.is_cancelled && (
                  <button
                    onClick={() => handleMarkPaid(selectedRes)}
                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                  >
                    <FaMoneyBillWave /> Mark Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Bookings