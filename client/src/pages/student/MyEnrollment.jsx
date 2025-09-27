import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import Table from '../../components/student/Table'

const MyEnrollment = () => {
    const { enrolledCourses, calculateCourseDuration } = useContext(AppContext)

    return (
        <div className="w-full relative">
            <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-cyan-100/40"></div>
            <div className="flex flex-col md:px-35 px-15 md:pt-20 pt-20">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
          bg-clip-text text-transparent">
                    My Enrollment
                </h1>

                <Table
                    columns={['Course', 'Duration', 'Progress', 'Status']}
                    rows={enrolledCourses.map((course) => ({
                        thumbnail: course.courseThumbnail,
                        Course: course.courseTitle,
                        Duration: calculateCourseDuration(course),
                        Progress: `4/10 Lectures`,
                        Status: (
                            <button className='cursor-pointer'>On going</button>
                        ),
                    }))}
                />
            </div>
        </div>
    )
}

export default MyEnrollment
