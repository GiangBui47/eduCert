import React, { useContext, useState } from 'react'
import Table from '../../components/student/Table'
import { AppContext } from '../../context/AppContext'
import { assets, dummyStudentEnrolled } from '../../assets/assets'
import StudentsModal from '../../components/educator/StudentsModal'

const MyCourses = () => {
    const { allCourses, calculateNoOfLectures } = useContext(AppContext);
    const convertCoursesToDashboardFormat = (courses) => {
        return courses.map(course => ({
            Course: course.courseTitle,
            Lectures: calculateNoOfLectures(course),
            Students: course.enrolledStudents ? course.enrolledStudents.length : 0,
            Status: course.isPublished ? 'Active' : 'Inactive',
            courseThumbnail: course.courseThumbnail,
            _id: course._id
        }));
    };

    const MyCourse = convertCoursesToDashboardFormat(allCourses);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showStudentsModal, setShowStudentsModal] = useState(false);

    const handleCourseClick = (row) => {
        setSelectedCourse(row);
        setShowStudentsModal(true);
    }
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 '>
            <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3'>
                    My Courses
                </h1>
                <Table
                    columns={['Course', 'Lectures', 'Students', "Status"]}
                    rows={MyCourse}
                    onRowClick={handleCourseClick}
                    itemsPerPage={5}
                />
                <StudentsModal
                    isOpen={showStudentsModal}
                    onClose={() => setShowStudentsModal(false)}
                    course={selectedCourse}
                    students={dummyStudentEnrolled || []}
                    totalLectures={selectedCourse?.Lectures || 0}
                />
            </div>
        </div>
    )
}

export default MyCourses
