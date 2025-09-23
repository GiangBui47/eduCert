import React, { useState } from 'react'
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets';
import { HiOutlineUserGroup } from "react-icons/hi";
import { NavLink } from 'react-router';

const CourseInformationCard = ({ courseData, playerData, isAlreadyEnrolled, rating, duration, lecture, courseId }) => {

    return (
        <div className='max-w-2 z-10 border border-gray-200 shadow md:shadow-2xl 
        overflow-hidden rounded-md  bg-white min-w-[300px] sm:min-w-[420px]'>
            {playerData ? (
                <YouTube
                    videoId={playerData.videoId}
                    opts={{ playerVars: { autoplay: 1 } }}
                    iframeClassName='w-full aspect-video' />
            ) : (
                <img src={courseData.courseThumbnail} alt="courseThumbnail" />
            )}
            <div className='p-5'>
                <h1 className='font-bold text-3xl mb-5 text-gray-800 block md:hidden'>{courseData.courseTitle}</h1>
                <div className='flex items-center gap-2'>
                    <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
                    <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
                </div>
                <div className='flex gap-3 items-center pt-2'>
                    <p className='text-gray-800 md:text-2xl text-xl font-semibold'>
                        ${(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
                    </p>
                    <p className='md:text-lg text-gray-500 line-through'>
                        ${courseData.coursePrice}
                    </p>
                    <p className='md:text-lg text-gray-500'>
                        {courseData.discount}% off
                    </p>
                </div>
                <div className='flex flex-wrap  items-center text-sm md:text-default 
            gap-4 pt-2 md:pt-4 text-gray-500'>
                    <div className='flex items-center gap-1 border border-gray-300 px-2 py-3 rounded-lg'>
                        <img src={assets.star} alt="star icon" />
                        <p>{rating} rating</p>
                    </div>

                    <div className='flex items-center gap-1 border border-gray-300 px-2 py-3 rounded-lg'>
                        <img src={assets.time_clock_icon} alt="clock icon" />
                        <p>{duration}</p>
                    </div>

                    <div className='flex items-center gap-1 border border-gray-300 px-2 py-3 rounded-lg'>
                        <img src={assets.lesson_icon} alt="lesson icon" />
                        <p>{lecture} lessons</p>
                    </div>

                    <div className='flex items-center gap-1 border border-gray-300 px-2 py-3 rounded-lg'>
                        <HiOutlineUserGroup className='w-[25px] h-[20px]' />
                        <p> <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'} enrolled</p></p>
                    </div>
                </div>

                <NavLink to={isAlreadyEnrolled ? '#' : `#`}>
                    <button
                        disabled={isAlreadyEnrolled}
                        // onClick={}
                        className={`md:mt-6 mt-4 w-full py-3 rounded font-medium text-white ${isAlreadyEnrolled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                    </button>
                </NavLink>

                <div className='pt-10'>
                    <p className='md:text-xl text-lg font-medium text-gray-800'>
                        What's in the course?
                    </p>
                    <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                        <li>Lifetime access with free updates.</li>
                        <li>Step-by-step, hands-on project guidance.</li>
                        <li>Downloadable resources and source code.</li>
                        <li>Quizzes to test your knowledge.</li>
                        <li>Certificate of completion.</li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default CourseInformationCard
