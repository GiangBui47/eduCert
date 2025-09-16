import React, { useContext } from 'react'
import Title from './Title'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
import { Link } from 'react-router'

const CourseSection = () => {

  const { allCourses } = useContext(AppContext)
  return (
    <div className=' w-full'>
      <Title title="Explore Our Course" subTitle='Popular Course'
        intro='Join thousands of satisfied students in our highest-rated courses on the Cardano blockchain' />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-5 sm:px-10 md:px-14 lg:px-36 py-5'>
        {allCourses.slice(0, 4).map((course, index) => {
          return <CourseCard key={index} course={course} />
        })}
      </div>

      <div className='flex justify-center '>
        <Link
          className='border bg-blue-600
               text-white rounded-lg px-10 py-3 hover:translate-y-0.5 transition-all transform hover:shadow-md'
          to=''
        >
          Show all course
        </Link>
      </div>

    </div>

  )
}

export default CourseSection
