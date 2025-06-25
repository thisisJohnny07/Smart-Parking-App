import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormInput from '../../components/formInput'
import PrimaryButton from '../../components/primaryButton'
// Adjust imports as needed for your project
import { getLocations, createLocation, updateLocation } from '../../services/locationService'
import { ArrowLeft } from 'lucide-react' // If you don't have this, replace with any icon or button

const vehicleTypes = [
  { id: 1, name: 'Car' },
  { id: 2, name: 'Motorcycle' },
  { id: 3, name: 'Van' },
]

const slotTypes = [
  { id: 1, name: 'Standard Slot' },
  { id: 2, name: 'Covered Slot' },
  { id: 3, name: 'Premium Slot' },
]

const getVehicleTypeId = (name) => {
  const v = vehicleTypes.find((v) => v.name === name)
  return v ? v.id : null
}

const getSlotTypeId = (name) => {
  const s = slotTypes.find((s) => s.name === name)
  return s ? s.id : null
}

const AddEditLocation = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    address: '',
    slot_pricings: [],
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchLocation = async () => {
        try {
          const locations = await getLocations()
          const existing = locations.find((loc) => String(loc.id) === id)
          if (existing) {
            // Map string vehicle_type and slot_type names to their IDs for the form state
            const normalizedSlots = existing.slot_pricings.map((s) => ({
              vehicle_type_id: getVehicleTypeId(s.vehicle_type),
              slot_type_id: getSlotTypeId(s.slot_type),
              rate_per_hour: s.rate_per_hour ?? '',
              available_slots: s.available_slots ?? '',
            }))

            setForm({
              name: existing.name,
              address: existing.address,
              slot_pricings: normalizedSlots,
            })
          } else {
            setError('Location not found.')
          }
        } catch (err) {
          console.error(err)
          setError('Failed to fetch location data.')
        }
      }
      fetchLocation()
    } else {
      // New location: initialize all vehicle-type + slot-type combinations with empty values
      const defaultSlots = []
      vehicleTypes.forEach((vehicle) => {
        slotTypes.forEach((slot) => {
          defaultSlots.push({
            vehicle_type_id: vehicle.id,
            slot_type_id: slot.id,
            rate_per_hour: '',
            available_slots: '',
          })
        })
      })
      setForm((prev) => ({ ...prev, slot_pricings: defaultSlots }))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSlotChange = (index, key, value) => {
    setForm((prev) => {
      const updated = [...prev.slot_pricings]
      updated[index] = { ...updated[index], [key]: value }
      return { ...prev, slot_pricings: updated }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (id) {
        await updateLocation(id, form)
      } else {
        await createLocation(form)
      }
      navigate('/admin/home?tab=manage-parking')
    } catch (err) {
      console.error(err)
      setError('Failed to save location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 max-w-3xl mx-auto font-sans text-gray-900">
      <div className="flex items-center gap-4 mb-6">
        <ArrowLeft
          className="cursor-pointer"
          size={24}
          onClick={() => navigate('/admin/home?tab=manage-parking')}
          title="Back"
        />
        <h1 className="text-2xl font-semibold">{id ? 'Edit Location' : 'Add New Location'}</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="name"
          name="name"
          label="Location Name"
          placeholder="Enter location name"
          value={form.name}
          onChange={handleChange}
        />
        <FormInput
          id="address"
          name="address"
          label="Address"
          placeholder="Enter address"
          value={form.address}
          onChange={handleChange}
        />

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Slot Pricing</h2>
          {vehicleTypes.map((vehicle) => (
            <div key={vehicle.id} className="mb-6">
              <p className="font-medium text-gray-800 mb-2">{vehicle.name}</p>
              {slotTypes.map((slot) => {
                const index = form.slot_pricings.findIndex(
                  (s) => s.vehicle_type_id === vehicle.id && s.slot_type_id === slot.id
                )
                const slotData = form.slot_pricings[index] || {
                  rate_per_hour: '',
                  available_slots: '',
                }
                return (
                  <div key={slot.id} className="grid grid-cols-3 gap-4 mb-2">
                    <div className="col-span-1 flex items-center text-sm text-gray-700">
                      {slot.name}
                    </div>
                    <FormInput
                      id={`rate-${vehicle.id}-${slot.id}`}
                      type="number"
                      placeholder="Rate/hr"
                      value={slotData.rate_per_hour}
                      onChange={(e) => handleSlotChange(index, 'rate_per_hour', e.target.value)}
                    />
                    <FormInput
                      id={`available-${vehicle.id}-${slot.id}`}
                      type="number"
                      placeholder="Available slots"
                      value={slotData.available_slots}
                      onChange={(e) => handleSlotChange(index, 'available_slots', e.target.value)}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <PrimaryButton type="submit">
          {loading ? 'Saving...' : id ? 'Update Location' : 'Add Location'}
        </PrimaryButton>
      </form>
    </div>
  )
}

export default AddEditLocation