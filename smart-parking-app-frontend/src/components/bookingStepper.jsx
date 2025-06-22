import React from 'react'

const steps = ['Date/Location', 'Slot', 'Vehicle', 'Review', 'Payment']

const BookingStepper = ({ currentStep = 1 }) => {
  return (
    <div className="w-full px-4 mb-10">
      <ol className="flex items-center justify-between max-w-4xl mx-auto w-full text-sm font-medium text-gray-500 relative">
        {steps.map((label, index) => {
          const stepNum = index + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          const isLast = stepNum === steps.length

          return (
            <li key={label} className="relative flex-1 flex flex-col items-center text-center">
              {/* Circle */}
              <div
                className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                  ${isCompleted ? 'bg-gray-900 text-white' :
                    isCurrent ? 'border-2 border-gray-900 text-gray-900 bg-white' :
                    'bg-gray-300 text-white'}`}
              >
                {stepNum}
              </div>
              {/* Label */}
              <span className={`mt-2 ${isCurrent ? 'font-semibold text-gray-900' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                    isCompleted ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default BookingStepper