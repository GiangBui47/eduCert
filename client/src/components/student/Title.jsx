import React from 'react'

const Title = ({ title, subTitle, intro }) => {
  return (
    <div className='flex flex-col justify-center items-center text-center px-5 py-5 gap-5'>
      <p className='border rounded-full border-indigo-100  bg-indigo-100 px-3 py-2 
      text-indigo-700 text-sm font-medium'>{title}</p>
      <h1 className={`text-4xl md:text-[40px] font-bold `}>{subTitle}</h1>
      <p className='text-sm text-gray-500'>{intro}</p>
    </div>
  )
}

export default Title
