// CourseList.jsx
import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../../components/student/Searchbar'
import { AppContext } from '../../context/AppContext';
import CourseCard from '../../components/student/CourseCard';
import Footer from '../../components/student/Footer';

const CourseList = () => {
    const { allCourses, navigate, filteredCourses, handleSearch } = useContext(AppContext);


    return (
        <>
            <div className='w-full px-8 pt-10 md:pt-15'>
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                        <p className='text-gray-500'>
                            <span onClick={() => navigate('/')} className='text-blue-600 cursor-pointer'>Home</span> /
                            <span>Course List</span></p>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-5 md:gap-8 px-2 '>
                    {filteredCourses.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </div>

            </div>
        </>


    );
};

export default CourseList;
