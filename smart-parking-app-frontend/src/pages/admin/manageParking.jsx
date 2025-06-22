import React, { useState } from 'react'

const sampleLocations = [
  {
    id: 1,
    name: 'Main Parking Lot',
    address: '123 Main Street',
    slots: {
      standard: {
        count: 12,
        rate: 40,
        type: 'Open Space',
        description: 'Ideal for sedans and hatchbacks.',
      },
      covered: {
        count: 6,
        rate: 50,
        type: 'Covered',
        description: 'Covered slots for protection from sun and rain.',
      },
      premium: {
        count: 3,
        rate: 70,
        type: 'Premium',
        description: 'Closest to entrance, shaded and secure.',
      },
    },
  },
  {
    id: 2,
    name: 'Annex Parking',
    address: '456 Side Road',
    slots: {
      standard: {
        count: 10,
        rate: 35,
        type: 'Open Space',
        description: 'Best for compact cars and motorcycles.',
      },
      covered: {
        count: 4,
        rate: 45,
        type: 'Covered',
        description: 'Secure and shaded slots.',
      },
      premium: {
        count: 2,
        rate: 65,
        type: 'Premium',
        description: 'Convenient and safe.',
      },
    },
  },
]

const ManageParking = () => {
  const [locations, setLocations] = useState(sampleLocations)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    address: '',
    slots: {
      standard: { count: '', rate: '', type: '', description: '' },
      covered: { count: '', rate: '', type: '', description: '' },
      premium: { count: '', rate: '', type: '', description: '' },
    },
  })

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      slots: {
        standard: { count: '', rate: '', type: '', description: '' },
        covered: { count: '', rate: '', type: '', description: '' },
        premium: { count: '', rate: '', type: '', description: '' },
      },
    })
    setEditingId(null)
    setIsModalOpen(false)
  }

  const handleChange = (e, type) => {
    const { name, value } = e.target
    if (type) {
      setForm((prev) => ({
        ...prev,
        slots: {
          ...prev.slots,
          [type]: { ...prev.slots[type], [name]: value },
        },
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newLoc = {
      id: editingId || Date.now(),
      ...form,
      slots: {
        standard: {
          ...form.slots.standard,
          count: Number(form.slots.standard.count),
          rate: Number(form.slots.standard.rate),
        },
        covered: {
          ...form.slots.covered,
          count: Number(form.slots.covered.count),
          rate: Number(form.slots.covered.rate),
        },
        premium: {
          ...form.slots.premium,
          count: Number(form.slots.premium.count),
          rate: Number(form.slots.premium.rate),
        },
      },
    }

    if (editingId) {
      setLocations((prev) => prev.map((l) => (l.id === editingId ? newLoc : l)))
    } else {
      setLocations((prev) => [...prev, newLoc])
    }
    resetForm()
  }

  const handleEdit = (loc) => {
    setForm(loc)
    setEditingId(loc.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this parking location?')) {
      setLocations((prev) => prev.filter((l) => l.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extralight text-gray-900">Manage Parking</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Location
        </button>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-md shadow-sm p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{loc.name}</h2>
                <p className="text-sm text-gray-500">{loc.address}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(loc)}
                  className="text-yellow-600 hover:text-yellow-800"
                  aria-label="Edit location"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Delete location"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {Object.entries(loc.slots).map(([key, s]) => (
                <div key={key} className="py-3 flex flex-col gap-1">
                  <span className="uppercase tracking-wider font-semibold text-gray-600">
                    {key} slot
                  </span>
                  <p className="text-gray-700">
                    <strong>Count:</strong> {s.count} &nbsp;&nbsp;
                    <strong>Rate:</strong> ₱{s.rate}/hr
                  </p>
                  <p className="text-gray-700">
                    <strong>Type:</strong> {s.type}
                  </p>
                  <p className="text-gray-600 italic text-sm">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 py-12 bg-white/30 backdrop-blur-sm"
          onClick={resetForm}
        >
          <div
            className="relative bg-white rounded-md shadow-lg max-w-lg w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-gray-900">
                {editingId ? 'Edit' : 'Add'} Parking
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-900 text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Location Name"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 py-2"
                required
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 py-2"
                required
              />

              {['standard', 'covered', 'premium'].map((type) => (
                <fieldset key={type} className="pt-4 border-t border-gray-200">
                  <legend className="text-gray-600 font-medium uppercase tracking-wide mb-2">
                    {type} Slot
                  </legend>
                  <div className="space-y-3">
                    <input
                      name="count"
                      type="number"
                      placeholder="Slot Count"
                      value={form.slots[type].count}
                      onChange={(e) => handleChange(e, type)}
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 py-2"
                      required
                    />
                    <input
                      name="rate"
                      type="number"
                      placeholder="Rate per hour"
                      value={form.slots[type].rate}
                      onChange={(e) => handleChange(e, type)}
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 py-2"
                      required
                    />
                    <input
                      name="type"
                      placeholder="Slot Type"
                      value={form.slots[type].type}
                      onChange={(e) => handleChange(e, type)}
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 py-2"
                    />
                    <input
                      name="description"
                      placeholder="Description"
                      value={form.slots[type].description}
                      onChange={(e) => handleChange(e, type)}
                      className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 py-2"
                    />
                  </div>
                </fieldset>
              ))}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="submit"
                  className="text-white bg-blue-600 px-5 py-2 rounded hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-600 px-5 py-2 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageParking