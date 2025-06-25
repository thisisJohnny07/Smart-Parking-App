import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  useEffect(() => {
    if (
      !passedState ||
      !passedState.locationId ||
      !passedState.locationLabel ||
      !passedState.vehicleTypeId ||
      !passedState.vehicleTypeLabel ||
      !passedState.date ||
      !passedState.time
    ) {
      navigate('/')
    }
  }, [passedState, navigate])

  const [currentStep, setCurrentStep] = useState(2)

  const [locationId] = useState(passedState.locationId || '')
  const [locationLabel] = useState(passedState.locationLabel || '')
  const [vehicleTypeId] = useState(passedState.vehicleTypeId || '')
  const [vehicleTypeLabel] = useState(passedState.vehicleTypeLabel || '')
  const [date] = useState(passedState.date || '')
  const [time] = useState(passedState.time || '')

  const [selectedSlot, setSelectedSlot] = useState(null)

  const [vehicleInfo, setVehicleInfo] = useState({
    plateNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    color: '',
    hours: 1
  })

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 2) setCurrentStep(prev => prev - 1)
  }

  const isNextDisabled = () => {
    if (currentStep === 2) return selectedSlot === null
    if (currentStep === 3) {
      return !vehicleInfo.plateNumber ||
        !vehicleInfo.vehicleMake ||
        !vehicleInfo.vehicleModel ||
        !vehicleInfo.color ||
        !vehicleInfo.hours
    }
    return false
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 2:
        return (
          <StepSlot 
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            locationId={locationId}
            vehicleTypeId={vehicleTypeId}
            date={date}
            time={time}
          />
        )
      case 3:
        return <StepVehicle vehicleInfo={vehicleInfo} setVehicleInfo={setVehicleInfo} />
      case 4:
        return (
          <StepReview
            location={locationLabel}
            vehicleType={vehicleTypeLabel}
            date={date}
            time={time}
            selectedSlot={selectedSlot}
            vehicleInfo={vehicleInfo}
          />
        )
      case 5:
        return (
          <StepPayment
            locationId={locationId}
            vehicleTypeId={vehicleTypeId}
            selectedSlot={selectedSlot}
            date={date}
            time={time}
            vehicleInfo={vehicleInfo}
            totalAmount={vehicleInfo.hours * selectedSlot?.price || 0}
          />
        )
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