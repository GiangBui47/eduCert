import React, { useContext, useState } from 'react'
import { FaBook } from 'react-icons/fa'
import { MdPeople } from "react-icons/md";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import Table from '../../components/student/Table'
import { assets } from '../../assets/assets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import SearchBar from '../../components/student/Searchbar';
import { AppContext } from '../../context/AppContext';
const Dashboard = () => {
    const { handleSearch, filteredCourses, calculateNoOfLectures } = useContext(AppContext)
    const [activeTab, setActiveTab] = useState('totalEarning');

    // Dữ liệu giả cho Total Earning
    const [totalEarning, setTotalEarning] = useState([
        {
            Course: 'React Fundamentals',
            Date: '2024-01-15',
            Status: 'Active',
            Amount: '$150',
            Month: 'Jan'
        },
        {
            Course: 'JavaScript Advanced',
            Date: '2024-02-10',
            Status: 'Active',
            Amount: '$200',
            Month: 'Feb'
        },
        {
            Course: 'Node.js Backend',
            Date: '2024-03-05',
            Status: 'Active',
            Amount: '$250',
            Month: 'Mar'
        },
        {
            Course: 'Database Design',
            Date: '2024-03-20',
            Status: 'Active',
            Amount: '$120',
            Month: 'Mar'
        },
        {
            Course: 'Python Basics',
            Date: '2024-09-05',
            Status: 'Active',
            Amount: '$180',
            Month: 'Apr'
        },
        {
            Course: 'Vue.js Essentials',
            Date: '2024-04-20',
            Status: 'Inactive',
            Amount: '$160',
            Month: 'Apr'
        }
    ]);

    // Dữ liệu giả cho Total Enrollment
    const [totalEnrollment, setTotalEnrollment] = useState([
        {
            imageUrl: assets.profile_img,
            Student: 'Alice Cooper',
            Date: '2024-01-10',
            Purchase: '$150',
            Status: 'Online'
        },
        {
            imageUrl: assets.profile_img,
            Student: 'Bob Wilson',
            Date: '2024-01-12',
            Purchase: '$150',
            Status: 'Online'
        },
        {
            imageUrl: assets.profile_img,
            Student: 'Carol Davis',
            Date: '2024-02-01',
            Purchase: '$150',
            Status: 'Online'
        },
        {
            imageUrl: assets.profile_img,
            Student: 'Daniel Lee',
            Date: '2024-02-15',
            Purchase: '$150',
            Status: 'Offline'
        },
        {
            imageUrl: assets.profile_img,
            Student: 'Emma Taylor',
            Date: '2024-03-01',
            Purchase: '$150',
            Status: 'Online'
        },
        {
            imageUrl: assets.profile_img,
            Student: 'Frank Miller',
            Date: '2024-03-10',
            Purchase: '$150',
            Status: 'Offline'
        }
    ]);

    // Tính toán thống kê
    const totalEarningAmount = totalEarning.reduce((sum, item) => {
        const amount = parseInt(item.Amount.replace('$', ''));
        return sum + amount;
    }, 0);

    const totalEnrollmentCount = totalEnrollment.length;

    const handleCardClick = (tabName) => {
        setActiveTab(activeTab === tabName ? null : tabName);
    };

    const handleEditCourse = (courseData) => {
        console.log('Edit course:', courseData);
        alert(`Edit course: ${courseData.Course}`);
    };

    // Chuyển đổi dữ liệu từ assets sang format Dashboard
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

    // Sử dụng dữ liệu từ filteredCourses
    const dashboardCourses = convertCoursesToDashboardFormat(filteredCourses);

    // Tính toán totalCourseCount sau khi dashboardCourses được định nghĩa
    const totalCourseCount = dashboardCourses.length;

    const prepareChartData = () => {
        // Dữ liệu cho biểu đồ cột theo tháng
        const monthlyData = totalEarning.reduce((acc, item) => {
            const month = item.Month;
            const amount = parseInt(item.Amount.replace('$', ''));

            const existingMonth = acc.find(m => m.month === month);
            if (existingMonth) {
                existingMonth.earning += amount;
                existingMonth.courses += 1;
            } else {
                acc.push({
                    month,
                    earning: amount,
                    courses: 1
                });
            }
            return acc;
        }, []);

        // Dữ liệu cho biểu đồ đường theo khóa học
        const courseEarningData = totalEarning.map(item => ({
            course: item.Course,
            amount: parseInt(item.Amount.replace('$', ''))
        }));

        return {
            monthlyData,
            courseEarningData
        };
    };

    const { monthlyData, courseEarningData } = prepareChartData();

    return (
        <div className='flex flex-col relative w-full'>
            <h1 className='text-2xl md:text-4xl font-semibold mb-3'>Dashboard</h1>
            <p className='text-[14px] font-normal text-gray-500'>Overview of your teaching activity</p>

            {/* Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Earning */}
                <div
                    onClick={() => handleCardClick('totalEarning')}
                    className={`flex items-center border ${activeTab === 'totalEarning' ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-300'}
                     shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg gap-4 z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <RiMoneyEuroCircleLine className={`w-[20px] h-[20px] md:w-[40px] md:h-[40px] ${activeTab === 'totalEarning' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-gray-500 text-xs md:text-xl">Total Earning</h4>
                        <p className="font-bold text-xs md:text-xl text-green-600">${totalEarningAmount}</p>
                    </div>
                </div>

                {/* Total Course */}
                <div
                    onClick={() => handleCardClick('course')}
                    className={`flex items-center border ${activeTab === 'course' ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-300'}
                 shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg gap-4 z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <FaBook className={`w-[20px] h-[20px] md:w-[40px] md:h-[40px] ${activeTab === 'course' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-gray-500 text-xs md:text-xl">Total Course</h4>
                        <p className="font-bold text-xs md:text-xl text-purple-600">{totalCourseCount}</p>
                    </div>
                </div>

                {/* Total Enrollment */}
                <div onClick={() => handleCardClick('totalEnrollment')}
                    className={`flex items-center border ${activeTab === 'totalEnrollment' ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-300'} 
                    shadow-lg md:shadow-2xl bg-white px-5 py-5 rounded-lg gap-4 z-10 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <MdPeople className={`w-[20px] h-[20px] md:w-[40px] md:h-[40px] ${activeTab === 'totalEnrollment' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-gray-500 text-xs md:text-xl">Total Enrollment</h4>
                        <p className="font-bold text-xs md:text-xl text-orange-600">{totalEnrollmentCount}</p>
                    </div>
                </div>
            </div>

            {/* Total Earning Tab */}
            {activeTab === 'totalEarning' && (
                <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                      bg-clip-text text-transparent">Earning Details</h2>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">${totalEarningAmount}</p>
                        </div>
                    </div>

                    {totalEarning.length > 0 ? (
                        <div>
                            {/* Statistics Cards */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="text-green-600 font-semibold">Active Courses</h4>
                                    <p className="text-2xl font-bold text-green-700">
                                        {totalEarning.filter(item => item.Status === 'Active').length}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <h4 className="text-yellow-600 font-semibold">Inactive Courses</h4>
                                    <p className="text-2xl font-bold text-yellow-700">
                                        {totalEarning.filter(item => item.Status === 'Inactive').length}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="text-blue-600 font-semibold">Average per Course</h4>
                                    <p className="text-2xl font-bold text-blue-700">
                                        ${Math.round(totalEarningAmount / totalEarning.length)}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <h4 className="text-purple-600 font-semibold">This Month</h4>
                                    <p className="text-2xl font-bold text-purple-700">
                                        ${totalEarning.filter(item => new Date(item.Date).getMonth() === new Date().getMonth()).reduce((sum, item) => sum + parseInt(item.Amount.replace('$', '')), 0)}
                                    </p>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="mb-6">
                                {/* Monthly Earning Chart */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Earnings</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`$${value}`, 'Earning']} />
                                            <Bar dataKey="earning" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>

                            {/* Course Earnings Line Chart */}
                            <div className="mb-6">
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Earnings by Course</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={courseEarningData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="course" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                                            <Line
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#8B5CF6"
                                                strokeWidth={3}
                                                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                                                activeDot={{ r: 8, fill: '#8B5CF6' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Detailed Earnings Data</h3>
                                <Table
                                    columns={['Course', 'Date', 'Amount', 'Status']}
                                    rows={totalEarning}
                                    itemsPerPage={5}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-blue-700 mt-5">No Earning data available.</p>
                    )}
                </div>
            )}

            {/* Course Tab */}
            {activeTab === 'course' && (
                <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <SearchBar onSearch={handleSearch} />
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                      bg-clip-text text-transparent">Course Management</h2>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Active Courses</p>
                            <p className="text-2xl font-bold text-purple-600">{totalCourseCount}</p>
                        </div>
                    </div>

                    {dashboardCourses.length > 0 ? (
                        <div>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="text-green-600 font-semibold">Active Courses</h4>
                                    <p className="text-2xl font-bold text-green-700">
                                        {dashboardCourses.filter(item => item.Status === 'Active').length}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <h4 className="text-yellow-600 font-semibold">Inactive Courses</h4>
                                    <p className="text-2xl font-bold text-yellow-700">
                                        {dashboardCourses.filter(item => item.Status === 'Inactive').length}
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h4 className="text-orange-600 font-semibold">Most Popular</h4>
                                    <p className="text-lg font-bold text-orange-400">
                                        {dashboardCourses.sort((a, b) => b.Students - a.Students)[0]?.Course || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <Table
                                columns={['Course', 'Lectures', 'Students', "Status"]}
                                rows={dashboardCourses}
                                showEditButton={true}
                                onEdit={handleEditCourse}
                                itemsPerPage={5}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-blue-700 mt-5">No Course found.</p>
                    )}
                </div>
            )}

            {/* Total Enrollment Tab */}
            {activeTab === 'totalEnrollment' && (
                <div className="px-5 py-5 mt-10 md:mt-20 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                      bg-clip-text text-transparent">Student Enrollments</h2>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-2xl font-bold text-orange-600">{totalEnrollmentCount}</p>
                        </div>
                    </div>

                    {totalEnrollment.length > 0 ? (
                        <div>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="text-green-600 font-semibold">Online</h4>
                                    <p className="text-2xl font-bold text-green-700">
                                        {totalEnrollment.filter(item => item.Status === 'Online').length}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="text-blue-600 font-semibold">Offline</h4>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {totalEnrollment.filter(item => item.Status === 'Offline').length}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="text-blue-600 font-semibold">Total Students</h4>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {totalEnrollment.length}
                                    </p>
                                </div>
                            </div>
                            <Table
                                columns={['Student', 'Date', 'Purchase', 'Status']}
                                rows={totalEnrollment}
                                itemsPerPage={5}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-blue-700 mt-5">No Student found.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard