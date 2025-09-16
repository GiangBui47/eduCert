import React from 'react'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full pt-20 md:pt-30 px-5 md:px-0 space-y-7
    bg-gradient-to-b from-cyan-100/70'>
      <p className='border rounded-full border-indigo-100  bg-indigo-100 px-3 py-2 
      text-indigo-700 text-sm font-medium'>Blockchain-powered Learning Platform</p>

      <h1 className="text-3xl md:text-[60px] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
      bg-clip-text text-transparent mt-10">
        Welcome to EduCert
      </h1>

      <div className="max-w-2xl rounded-xl p-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transform hover:scale-105 
      transition-all duration-300 mt-10">
        <div className="rounded-xl bg-white/80 shadow-md p-4">
          <p className="text-gray-700 text-lg">
            We bring together top instructors, interactive content, and Cardano blockchain
            technology to provide a secure, transparent, and trusted learning experience.
          </p>
        </div>
      </div>

    </div>

  )
}

export default Hero 
