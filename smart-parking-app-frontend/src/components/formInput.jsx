import React from 'react'

const FormInput = ({ id, name, type = 'text', placeholder, label, onChange, value }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        autoComplete="off"
      />
    </div>
  )
}

export default FormInput