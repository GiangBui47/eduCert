import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { FaBook, FaBookOpen, FaEnvelope, FaMoneyCheckAlt } from 'react-icons/fa'
import Table from '../../components/student/Table'

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState(null)

    const [purchaseHistory, setPurchaseHistory] = useState([
        {
            courseThumbnail: assets.course_1_thumbnail,
            Course: 'Java Programming Fundamentals',
            Date: '15/12/2024',
            Price: '$25',
            Status: 'Completed',
        },
        {
            courseThumbnail: assets.course_2_thumbnail,
            Course: 'React.js Complete Guide',
            Date: '10/12/2024',
            Price: '$35',
            Status: 'Completed',
        },
        {
            courseThumbnail: assets.course_3_thumbnail,
            Course: 'Python Data Science',
            Date: '05/12/2024',
            Price: '$30',
            Status: 'Completed',
        },
        {
            courseThumbnail: assets.course_4_thumbnail,
            Course: 'Machine Learning Basics',
            Date: '01/12/2024',
            Price: '$45',
            Status: 'Pending',
        },
    ])

    const [course, setCourse] = useState([
        {
            courseThumbnail: assets.course_1_thumbnail,
            Course: 'Java Programming Fundamentals',
            Duration: '25h 45m',
            Lectures: '15 Lectures',
            Educator: 'Dr. Sarah Johnson',
        },
        {
            courseThumbnail: assets.course_2_thumbnail,
            Course: 'React.js Complete Guide',
            Duration: '18h 30m',
            Lectures: '12 Lectures',
            Educator: 'Mike Chen',
        },
        {
            courseThumbnail: assets.course_3_thumbnail,
            Course: 'Python Data Science',
            Duration: '32h 15m',
            Lectures: '20 Lectures',
            Educator: 'Prof. Emily Davis',
        },
        {
            courseThumbnail: assets.course_4_thumbnail,
            Course: 'Machine Learning Basics',
            Duration: '28h 20m',
            Lectures: '18 Lectures',
            Educator: 'Dr. Alex Rodriguez',
        },
        {
            courseThumbnail: assets.course_1_thumbnail,
            Course: 'Web Development Bootcamp',
            Duration: '40h 00m',
            Lectures: '25 Lectures',
            Educator: 'Lisa Wang',
        },
    ])

    const [courseCompleted, setCourseCompleted] = useState([
        {
            courseThumbnail: assets.course_1_thumbnail,
            Course: 'Java Programming Fundamentals',
            Duration: '25h 45m',
            Date: '15/12/2024',
            Completed: '15/15 Lectures',
        },
        {
            courseThumbnail: assets.course_2_thumbnail,
            Course: 'React.js Complete Guide',
            Duration: '18h 30m',
            Date: '10/12/2024',
            Completed: '12/12 Lectures',
        },
        {
            courseThumbnail: assets.course_3_thumbnail,
            Course: 'Web Development Basics',
            Duration: '22h 15m',
            Date: '05/12/2024',
            Completed: '14/14 Lectures',
        },
    ])

    return (
        <div className="relative w-full">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-100/40"></div>
            <div className="flex flex-col md:px-35 px-15 md:pt-20 pt-20 ">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
          bg-clip-text text-transparent">
                    My Profile
                </h1>

                {/* User Info */}
                <div className="flex md:flex-row flex-col mt-10 items-center  md:justify-between border-4 border-white  
          shadow-lg md:shadow-2xl bg-white px-5 py-10 rounded-lg z-10 mb-20">
                    <div className="flex items-center gap-2">
                        <img src={assets.profile_img2} alt="avatar" className="w-full" />
                        <div className="flex flex-col ms-5">
                            <h3 className="text-lg md:text-2xl font-bold mb-2">Name</h3>
                            <p className="text-gray-600 flex items-center gap-1">
                                <FaEnvelope /> Email
                            </p>
                        </div>
                    </div>
                    <button className="bg-blue-400 rounded-full px-1 py-1 md:px-5 md:py-5 cursor-pointer
            hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        Connect Wallet
                    </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Course Completed */}
                    <div
                        onClick={() =>
                            setActiveTab(activeTab === 'courseCompleted' ? null : 'courseCompleted')
                        }
                        className={`flex items-center border ${activeTab === 'courseCompleted'
                            ? 'border-2 border-blue-500'
                            : 'border-gray-300'
                            } shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg justify-between 
              z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                        <div className="flex flex-col items-start space-y-1">
                            <h4 className="text-gray-500 text-xs md:text-xl">Course Completed</h4>
                            <p className="font-bold text-xs md:text-xl">3</p>
                        </div>
                        <FaBookOpen className="w-[20px] h-[20px] md:w-[40px] md:h-[40px]" />
                    </div>

                    {/* Total Course */}
                    <div
                        onClick={() => setActiveTab(activeTab === 'course' ? null : 'course')}
                        className={`flex items-center border ${activeTab === 'course'
                            ? 'border-2 border-blue-500'
                            : 'border-gray-300'
                            } shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg justify-between 
              z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                        <div className="flex flex-col items-start space-y-1">
                            <h4 className="text-gray-500 text-xs md:text-xl">Total Course</h4>
                            <p className="font-bold text-xs md:text-xl">5</p>
                        </div>
                        <FaBook className="w-[20px] h-[20px] md:w-[40px] md:h-[40px]" />
                    </div>

                    {/* Total Purchase */}
                    <div
                        onClick={() => setActiveTab(activeTab === 'purchase' ? null : 'purchase')}
                        className={`flex items-center border ${activeTab === 'purchase'
                            ? 'border-2 border-blue-500'
                            : 'border-gray-300'
                            } shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg justify-between 
              z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                        <div className="flex flex-col items-start space-y-1">
                            <h4 className="text-gray-500 text-xs md:text-xl">Total Purchase</h4>
                            <p className="font-bold text-xs md:text-xl">4</p>
                        </div>
                        <FaMoneyCheckAlt className="w-[20px] h-[20px] md:w-[40px] md:h-[40px]" />
                    </div>
                </div>

                {/* Course Completed Tab */}
                {activeTab === 'courseCompleted' && (
                    <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg">
                        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent">
                            Course Completed
                        </h2>
                        {courseCompleted.length > 0 ? (
                            <Table
                                columns={['Course', 'Duration', 'Date', 'Completed']}
                                rows={courseCompleted}
                            />
                        ) : (
                            <p className="text-sm text-blue-700 mt-5">No Course found.</p>
                        )}
                    </div>
                )}

                {/* Course Tab */}
                {activeTab === 'course' && (
                    <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg">
                        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent">
                            Course
                        </h2>
                        {course.length > 0 ? (
                            <Table
                                columns={['Course', 'Duration', 'Lectures', 'Educator']}
                                rows={course}
                            />
                        ) : (
                            <p className="text-sm text-blue-700 mt-5">No Course found.</p>
                        )}
                    </div>
                )}

                {/* Purchase Tab */}
                {activeTab === 'purchase' && (
                    <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg">
                        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent">
                            Purchase History
                        </h2>
                        {purchaseHistory.length > 0 ? (
                            <Table
                                columns={['Course', 'Date', 'Price', 'Status']}
                                rows={purchaseHistory}
                            />
                        ) : (
                            <p className="text-sm text-blue-700 mt-5">No purchase history found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage
