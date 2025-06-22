import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import BookingStepper from '../../components/bookingStepper'

import StepSlot from '../../components/bookingSteps/stepSlot'
import StepVehicle from '../../components/bookingSteps/stepVehicle'
import StepReview from '../../components/bookingSteps/stepReview'
import StepPayment from '../../components/bookingSteps/stepPayment'

const BookParking = () => {
  const locationHook = useLocation()
  const passedState = locationHook.state || {}

  // Force start at Step 2
  const [currentStep, setCurrentStep] = useState(2)

  // Booking form values passed from Header
  const [location] = useState(passedState.location || '')
  const [vehicleType] = useState(passedState.vehicleType || '')
  const [date] = useState(passedState.date || '')
  const [time] = useState(passedState.time || '')

  const [selectedSlotId, setSelectedSlotId] = useState(null)

  const [vehicleInfo, setVehicleInfo] = useState({
    plateNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    color: '',
  })

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 2) setCurrentStep(prev => prev - 1)
  }

  const isNextDisabled = () => {
    if (currentStep === 2) return selectedSlotId === null
    if (currentStep === 3) {
      return !vehicleInfo.plateNumber ||
        !vehicleInfo.vehicleMake ||
        !vehicleInfo.vehicleModel ||
        !vehicleInfo.color
    }
    return false
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 2:
        return <StepSlot selectedId={selectedSlotId} setSelectedId={setSelectedSlotId} />
      case 3:
        return <StepVehicle vehicleInfo={vehicleInfo} setVehicleInfo={setVehicleInfo} />
      case 4:
        return (
          <StepReview
            location={location}
            vehicleType={vehicleType}
            date={date}
            time={time}
            selectedSlotId={selectedSlotId}
            vehicleInfo={vehicleInfo}
          />
        )
      case 5:
        return <StepPayment />
      default:
        return null
    }
  }

  return (
    <>
      <TopBar />
      <Navbar />

      <h1 className="text-3xl font-bold text-center my-6">Book a Parking Spot</h1>
      <BookingStepper currentStep={currentStep} />

      <div className="max-w-3xl mx-auto px-4">
        {renderStepContent()}

        <div className="flex justify-between my-6">
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
            disabled={currentStep === 2}
          >
            Previous
          </button>

          {currentStep < 5 && (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
              disabled={isNextDisabled()}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default BookParking