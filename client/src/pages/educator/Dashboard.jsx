import React, { useState } from 'react'
import { FaBook } from 'react-icons/fa'
import { MdPeople } from "react-icons/md";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import Table from '../../components/student/Table'
import { assets } from '../../assets/assets';
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('totalEarning');

    const [totalEarning, setTotalEarning] = useState([])
    const [course, setCourse] = useState([])
    const [totalEnrollment, setTotalEnrollment] = useState([])

    return (
        <div className='flex flex-col relative w-full'>
            <h1 className='text-2xl md:text-4xl font-semibold mb-3'>Dashboard</h1>
            <p className='text-[14px] font-normal text-gray-500'>Overview of your teaching activity</p>

            {/* Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Earning */}
                <div
                    onClick={() => setActiveTab(activeTab === 'totalEarning' ? null : 'totalEarning')}
                    className={`flex items-center border ${activeTab === 'totalEarning' ? 'border-2 border-blue-500' : 'border-gray-300'}
                     shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg gap-4 z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <RiMoneyEuroCircleLine className="w-[20px] h-[20px] md:w-[40px] md:h-[40px]" />
                    <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-gray-500 text-xs md:text-xl">Total Earning</h4>
                        <p className="font-bold text-xs md:text-xl">0</p>
                    </div>
                </div>

                {/* Total Course */}
                <div
                    onClick={() => setActiveTab(activeTab === 'course' ? null : 'course')}
                    className={`flex items-center border ${activeTab === 'course' ? 'border-2 border-blue-500' : 'border-gray-300'}
                 shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg gap-4 z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <FaBook className="w-[20px] h-[20px] md:w-[40px] md:h-[40px]" />
                    <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-gray-500 text-xs md:text-xl">Total Course</h4>
                        <p className="font-bold text-xs md:text-xl">0</p>
                    </div>
                </div>

                {/* Total Enrollment */}
                <div onClick={() => setActiveTab(activeTab === 'totalEnrollment' ? null : 'totalEnrollment')}
                    className={`flex items-center border ${activeTab === 'purchase' ? 'border-2 border-blue-500' : 'border-gray-300'} 
                    shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg gap-4 z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <MdPeople className="w-[20px] h-[20px] md:w-[40px] md:h-[40px]" />
                    <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-gray-500 text-xs md:text-xl">Total Enrollment</h4>
                        <p className="font-bold text-xs md:text-xl">0</p>
                    </div>
                </div>
            </div>

            {/* Total Earning Tab */}
            {activeTab === 'totalEarning' && (
                <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg">
                    <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent"> Earning </h2>
                    {totalEarning.length > 0 ? (
                        <Table
                            columns={['Course', 'Duration', 'Date', 'Completed']}
                            rows={totalEarning}
                        />
                    ) : (
                        <p className="text-sm text-blue-700 mt-5">No Earning.</p>
                    )}
                </div>
            )}

            {/* Course Tab */}
            {activeTab === 'course' && (
                <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg">
                    <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent"> Course </h2>
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
            {activeTab === 'totalEnrollment' && (
                <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg">
                    <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent"> List Student </h2>
                    {totalEnrollment.length > 0 ? (
                        <Table
                            columns={['Course', 'Date', 'Price', 'Status']}
                            rows={totalEnrollment}
                        />
                    ) : (
                        <p className="text-sm text-blue-700 mt-5">No Student found.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard
