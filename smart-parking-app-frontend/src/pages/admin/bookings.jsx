import React, { useState, useMemo } from 'react'

const initialReservations = [
  {
    id: 1,
    user: 'Juan Dela Cruz',
    email: 'juan@example.com',
    date: '2024-06-21',
    time: '10:00 AM',
    slot: 'Premium Slot',
    status: 'reserved', // reserved, arrived, checked_out
    isPaid: false,
    vehicle: {
      plateNumber: 'ABC123',
      make: 'Toyota',
      model: 'Vios',
      color: 'Silver',
    },
  },
  {
    id: 2,
    user: 'Maria Clara',
    email: 'maria@example.com',
    date: '2024-06-22',
    time: '11:00 AM',
    slot: 'Standard Slot',
    status: 'arrived',
    isPaid: true,
    vehicle: {
      plateNumber: 'XYZ789',
      make: 'Honda',
      model: 'Civic',
      color: 'Blue',
    },
  },
  // Add more reservations as needed
]

const Bookings = () => {
  const [allReservations, setAllReservations] = useState(initialReservations)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRes, setSelectedRes] = useState(null)

  // Filter out checked_out reservations
  const filteredReservations = useMemo(() => {
    return allReservations.filter(
      (res) =>
        res.status !== 'checked_out' &&
        (res.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
         res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         res.slot.toLowerCase().includes(searchTerm.toLowerCase()) ||
         res.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [allReservations, searchTerm])

  const closeModal = () => setSelectedRes(null)

  const updateStatus = (id, newStatus) => {
    setAllReservations(prev =>
      prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
    )
    closeModal()
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Bookings</h1>

      <input
        type="text"
        placeholder="Search by user, email, slot, or plate number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full max-w-md px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Slot</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Paid</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No reservations found.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => (
                <tr
                  key={res.id}
                  onClick={() => setSelectedRes(res)}
                  className="cursor-pointer hover:bg-gray-100 transition"
                >
                  <td className="p-4">{res.user}</td>
                  <td className="p-4">{res.date}</td>
                  <td className="p-4">{res.time}</td>
                  <td className="p-4">{res.slot}</td>
                  <td className="p-4 capitalize">{res.status.replace('_', ' ')}</td>
                  <td className="p-4">
                    {res.isPaid ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Unpaid</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRes && (
        <>
          <div className="fixed inset-0 bg-gray-200 opacity-70 z-40" aria-hidden="true" />
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                aria-label="Close modal"
              >
                &#x2715;
              </button>

              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Reservation Details</h2>

              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">User Information</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div><span className="font-semibold">Name:</span> {selectedRes.user}</div>
                  <div><span className="font-semibold">Email:</span> {selectedRes.email}</div>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Reservation Info</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div><span className="font-semibold">Date:</span> {selectedRes.date}</div>
                  <div><span className="font-semibold">Time:</span> {selectedRes.time}</div>
                  <div><span className="font-semibold">Slot:</span> {selectedRes.slot}</div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        selectedRes.status === 'arrived'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedRes.status === 'checked_out'
                          ? 'bg-gray-300 text-gray-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedRes.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Payment:</span>{' '}
                    {selectedRes.isPaid ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Unpaid</span>
                    )}
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div><span className="font-semibold">Plate Number:</span> {selectedRes.vehicle.plateNumber}</div>
                  <div><span className="font-semibold">Make:</span> {selectedRes.vehicle.make}</div>
                  <div><span className="font-semibold">Model:</span> {selectedRes.vehicle.model}</div>
                  <div><span className="font-semibold">Color:</span> {selectedRes.vehicle.color}</div>
                </div>
              </section>

              <div className="flex justify-end space-x-4">
                {!selectedRes.isPaid && (
                  <button
                    onClick={() => {
                      setAllReservations(prev =>
                        prev.map(r =>
                          r.id === selectedRes.id ? { ...r, isPaid: true } : r
                        )
                      )
                      closeModal()
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Mark as Paid
                  </button>
                )}

                {selectedRes.status !== 'arrived' && selectedRes.status !== 'checked_out' && (
                  <button
                    onClick={() => updateStatus(selectedRes.id, 'arrived')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Mark Arrived
                  </button>
                )}

                {selectedRes.status === 'arrived' && (
                  <button
                    onClick={() => updateStatus(selectedRes.id, 'checked_out')}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
                  >
                    Mark Checked Out
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