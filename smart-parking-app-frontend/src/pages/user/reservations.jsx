import React, { useEffect, useState } from 'react'
import { getMyReservations, cancelMyReservation } from '../../services/reservationService'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'

const statusBadge = (label, color) => (
  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white ${color}`}>
    {label}
  </span>
)

const approvalBadge = (isApproved) =>
  isApproved
    ? statusBadge('Approved', 'bg-green-600')
    : statusBadge('Pending Approval', 'bg-yellow-500')

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getMyReservations()

        const sorted = [...data].sort((a, b) => {
          const aIsUpcoming = !a.is_cancelled && !a.has_exited
          const bIsUpcoming = !b.is_cancelled && !b.has_exited

          if (aIsUpcoming && !bIsUpcoming) return -1
          if (!aIsUpcoming && bIsUpcoming) return 1

          const aDateTime = new Date(`${a.date}T${a.time}`)
          const bDateTime = new Date(`${b.date}T${b.time}`)

          return bDateTime - aDateTime
        })

        setReservations(sorted)
      } catch (err) {
        setError('Failed to load reservations.')
        console.error(err)
      }
      setLoading(false)
    }

    fetchReservations()
  }, [])

  const handleCancel = async (id) => {
    const confirm = window.confirm('❗ Are you sure you want to cancel this reservation?')
    if (!confirm) return

    try {
      await cancelMyReservation(id)
      alert('✅ Reservation cancelled!')
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, is_cancelled: true } : res
        )
      )
    } catch (err) {
      alert('❌ Failed to cancel reservation.')
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[250px] text-gray-600 text-lg font-medium">
        Loading your reservations...
      </div>
    )

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold my-10 text-lg">
        {error}
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-10 w-full">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-900 tracking-wide">
          My Reservations
        </h1>

        {reservations.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium mt-12">
            You have no reservations yet.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reservations.map((r) => {
              const {
                id,
                location,
                slot_type,
                vehicle_type,
                date,
                time,
                duration_hours,
                plate_number,
                vehicle_make,
                vehicle_model,
                color,
                mode_of_payment,
                is_paid,
                is_cancelled,
                has_arrived,
                has_exited,
                is_approved,
              } = r

              return (
                <article
                  key={id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col"
                >
                  <header className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 truncate max-w-[70%]">
                      {location.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs select-none justify-end">
                      {is_cancelled
                        ? statusBadge('Cancelled', 'bg-red-600')
                        : has_exited
                        ? statusBadge('Exited', 'bg-gray-500')
                        : has_arrived
                        ? statusBadge('Arrived', 'bg-green-600')
                        : statusBadge('Upcoming', 'bg-blue-600')}
                      {!is_cancelled && approvalBadge(is_approved)}
                    </div>
                  </header>

                  <p className="text-sm italic text-gray-600 mb-5 truncate">
                    {location.address}
                  </p>

                  <section className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-gray-700 text-sm font-medium">
                    <div>
                      <span className="block mb-1 text-gray-500">Date</span>
                      {date}
                    </div>
                    <div>
                      <span className="block mb-1 text-gray-500">Time</span>
                      {time}
                    </div>
                    <div>
                      <span className="block mb-1 text-gray-500">Duration</span>
                      {duration_hours} hour{duration_hours > 1 ? 's' : ''}
                    </div>
                    <div>
                      <span className="block mb-1 text-gray-500">Slot</span>
                      {slot_type.name}
                    </div>
                    <div>
                      <span className="block mb-1 text-gray-500">Vehicle Type</span>
                      {vehicle_type.name}
                    </div>
                    <div>
                      <span className="block mb-1 text-gray-500">Payment</span>
                      {mode_of_payment}
                      {is_paid && (
                        <span className="text-green-600 font-semibold"> (Paid)</span>
                      )}
                    </div>
                  </section>

                  <section className="mt-auto pt-4 border-t border-gray-200 text-gray-800 text-sm space-y-1 font-medium">
                    <div>
                      <span className="text-gray-600">Plate Number: </span> {plate_number}
                    </div>
                    <div>
                      <span className="text-gray-600">Make: </span> {vehicle_make}
                    </div>
                    <div>
                      <span className="text-gray-600">Model: </span> {vehicle_model}
                    </div>
                    <div>
                      <span className="text-gray-600">Color: </span> {color}
                    </div>
                  </section>

                  {!is_cancelled && !has_exited && new Date(`${date}T${time}`) > new Date() && (
                    <button
                      onClick={() => handleCancel(id)}
                      className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Reservations