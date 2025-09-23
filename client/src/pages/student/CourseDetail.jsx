import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { assets, dummyCourses, dummyDashboardData, dummyEducatorData } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import humanizeDuration from 'humanize-duration';
import CourseInformationCard from '../../components/student/CourseInformationCard';
import { HiOutlineUserGroup } from 'react-icons/hi';
import Loading from '../../components/student/Loading';

const CourseDetail = () => {

    const { calculateRating, calculateChapterTime,
        calculateCourseDuration, calculateNoOfLectures, calculateTeacherRating } = useContext(AppContext);
    const { id } = useParams();

    const [playerData, setPlayerData] = useState(null);

    const [openSection, setOpenSection] = useState({});

    const [courseData, setCourseData] = useState(null);

    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

    const [dashboard, setDashboard] = useState(null)
    const [educator, setEducator] = useState(null)
    const fetchCourseData = async () => {
        setCourseData(dummyCourses?.find(course => course._id === id));

    }
    useEffect(() => {
        fetchCourseData();
    }, [])

    const toggleSection = (index) => {
        setOpenSection((prev) => (
            {
                ...prev,
                [index]: !prev[index]
            }
        ))
    }

    const fecthEducator = async () => {
        setEducator(dummyEducatorData)
    }

    const fecthDashboard = async () => {
        setDashboard(dummyDashboardData)
    }
    useEffect(() => {
        fecthEducator()
        fecthDashboard()
    }, [])


    return courseData ? (
        <div className='flex md:flex-row flex-col-reverse relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 '>
            <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-100/40'>
            </div>
            <div className='text-gray-500 max-w-xl z-10'>
                <h1 className='font-bold text-3xl md:text-[40px] text-gray-800 hidden md:block'>{courseData.courseTitle}</h1>
                <p className='text-sm md:text-base pt-4'
                    dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}>
                </p>
                <div className='flex items-center gap-2 mt-4 mb-3'>
                    <div className='flex'>
                        {[...Array(5)].map((_, i) => <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />)}
                    </div>
                    <p className='text-blue-600'>{courseData.courseRatings.length}
                        {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'}</p>
                    <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
                </div>

                {/* chapter content */}
                <div className='flex flex-col border border-gray-300 rounded-lg mt-20 px-5  py-5 '>
                    <h2 className='font-semibold text-2xl md:text-[30px] text-gray-800'>Course Structure</h2>
                    <div className='pt-5'>
                        {courseData.courseContent.map((chapter, index) => (
                            <div key={index} className='border border-gray-300 mb-3 px-3 py-4 '>
                                <div
                                    className='flex items-center justify-between cursor-pointer'
                                    onClick={() => toggleSection(index)}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            className={`transform transition-transform ${openSection[index] ? 'rotate-180' : ''}`}
                                            src={assets.down_arrow_icon}
                                            alt="arrow icon"
                                        />
                                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                    </div>
                                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300
                                     ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                                    <ul>
                                        {chapter.chapterContent.map((lecture, index) => (
                                            <li className='flex items-start gap-2 py-2' key={index}>
                                                <img src={assets.play_icon} alt="play icon"
                                                    className='w-4 h-4 ' />
                                                <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                    <p className=''>{lecture.lectureTitle}</p>
                                                    <div className='flex gap-2'>
                                                        {lecture.isPreviewFree && <p
                                                            onClick={() => setPlayerData({
                                                                videoId: lecture.lectureUrl.split('/').pop()
                                                            })}
                                                            className='text-blue-500 cursor-pointer'>Preview</p>}
                                                        <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* information educator */}
                <div className=' flex flex-col border border-gray-300 rounded-lg mt-20 px-5  py-5'>
                    <h2 className='font-semibold text-2xl md:text-[30px] text-gray-800 pb-5'>Information Educator</h2>
                    <div className='flex items-center gap-1'>
                        <img src={educator.imageUrl} alt="" className='w-[20px] h-[20px] md:w-[35px] md:h-[35px]' />
                        <h3 className='text-xl font-bold text-gray-700'>{educator.name}</h3>
                    </div>
                    <div className='flex flex-wrap  items-center justify-between text-sm md:text-default 
                                gap-4 pt-2 md:pt-4 text-gray-500'>
                        <div className='space-y-1 md:space-y-3'>
                            <h4 className='font-semibold text-lg md:text-xl text-gray-600'>Total Rating</h4>
                            <div className='flex items-center gap-1 '>
                                <img src={assets.star} alt="star icon" />
                                <p>{calculateTeacherRating(educator._id)} rating</p>
                            </div>
                        </div>

                        <div className='space-y-1 md:space-y-3'>
                            <h4 className='font-semibold text-lg md:text-xl text-gray-600'>Total Course</h4>
                            <div className='flex items-center gap-1 '>
                                <img src={assets.lesson_icon} alt="lesson icon" />
                                <p>{dashboard.totalCourses} courses</p>
                            </div>
                        </div>

                        <div className='space-y-1 md:space-y-3'>
                            <h4 className='font-semibold text-lg md:text-xl text-gray-600'>Total Student</h4>
                            <div className='flex items-center gap-1 '>
                                <HiOutlineUserGroup className='w-[25px] h-[20px]' />
                                <p>{dashboard.enrolledStudentsData.length} {dashboard.enrolledStudentsData.length > 1 ? 'students' : 'student'} enrolled</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <CourseInformationCard
                courseData={courseData}
                playerData={playerData}
                isAlreadyEnrolled={isAlreadyEnrolled}
                rating={calculateRating(courseData)}
                duration={calculateCourseDuration(courseData)}
                lecture={calculateNoOfLectures(courseData)}
                courseId={id}
            />
        </div >
    ) : <Loading />
}

export default CourseDetail
