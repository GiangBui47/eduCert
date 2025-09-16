import React, { useContext } from 'react'
import Title from './Title'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
import { Link } from 'react-router'

const TopCourseSection = () => {
    const { allCourses, calculateRating } = useContext(AppContext)

    const topCourses = [...allCourses]
        .sort((a, b) => calculateRating(b) - calculateRating(a))
        .slice(0, 3)

    return (
        <div className='w-full'>
            <Title
                title="Explore Our Course"
                subTitle="Top Rated Courses"
                intro="Join thousands of satisfied students in our highest-rated courses on the Cardano blockchain"
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5 sm:px-10 md:px-14 lg:px-36 py-5'>
                {topCourses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>

        </div>
    )
}

export default TopCourseSection
