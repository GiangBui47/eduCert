import React, { useContext } from 'react'
import { Link } from 'react-router'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';

const CourseCard = ({ course }) => {

  const { calculateRating } = useContext(AppContext)
  return (
    <Link
      to={'/course/' + course._id}
      className='bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-2xl 
             cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden pb-5
             flex flex-col'
    >
      {/* Ảnh */}
      <div className='relative'>
        <img src={course.courseThumbnail} alt="courseThumbnail" className='w-full' />
        {course.discount > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {course.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className='p-2 space-y-2 flex-1'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>

        <div className='flex items-center gap-2'>
          {calculateRating(course)}
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt=''
                className='w-3.5 h-3.5'
              />
            ))}
            <span className='ms-2'>{course.courseRatings.length} reviews</span>
          </div>
        </div>
      </div>

      {/* Giá */}
      <div className='flex items-center justify-between px-2 mt-auto'>
        <p className='text-base font-semibold text-gray-800'>
          ${(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}
        </p>
        <p className='text-sm line-through font-light text-gray-500'>
          ${(course.coursePrice).toFixed(2)}
        </p>
      </div>
    </Link>


  )
}

export default CourseCard
