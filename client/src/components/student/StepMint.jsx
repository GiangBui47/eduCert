import React, { useEffect, useState } from 'react'

const StepMint = () => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
        Blockchain Certification
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">NFT Certificate Minting Process</h2>
      <div className="flex flex-wrap items-center justify-between max-w-3xl mx-auto gap-5">
        {[
          'Course Completion',
          'Generate Certificate',
          'Create Metadata',
          'Mint NFT',
          'Transfer to Student'
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center mb-4">
            {/* Step Circle */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full text-white font-semibold transition-all duration-500 shadow-md ${currentStep >= index
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse'
                : 'bg-gray-300'
                }`}
            >
              {index + 1}
            </div>
            {/* Step Label */}
            <span className="mt-3 text-gray-700 text-center text-sm font-medium">{step}</span>
          </div>
        ))}
      </div>
      {/* Progress Line */}
      <div className="relative max-w-3xl mx-auto mt-4">
        <div className="h-1.5 bg-gray-200 rounded-full"></div>
        <div
          className="absolute top-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      {/* Status Messages */}
      <div className="mt-6 text-gray-700 bg-white/80 rounded-xl p-4 max-w-xl mx-auto shadow-sm">
        {currentStep === 0 && (
          <p className="flex items-center justify-center">
            <span className="w-6 h-6 mr-3 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              ✓
            </span>
            Student completes all course requirements
          </p>
        )}
        {currentStep === 1 && (
          <p className="flex items-center justify-center">
            <span className="w-6 h-6 mr-3 bg-blue-500 rounded-full animate-spin flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            Generating unique certificate with student data
          </p>
        )}
        {currentStep === 2 && (
          <p className="flex items-center justify-center">
            <span className="w-6 h-6 mr-3 bg-blue-500 rounded-full animate-spin flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            Creating NFT metadata with course & achievement details
          </p>
        )}
        {currentStep === 3 && (
          <p className="flex items-center justify-center">
            <span className="w-6 h-6 mr-3 bg-blue-500 rounded-full animate-spin flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            Minting NFT on Cardano blockchain
          </p>
        )}
        {currentStep === 4 && (
          <p className="flex items-center justify-center">
            <span className="w-6 h-6 mr-3 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              ✓
            </span>
            NFT Certificate transferred to student's wallet
          </p>
        )}
      </div>
    </div>
  )
}

export default StepMint
