import React from 'react'
import Hero from '../../components/student/Hero'
import StepMint from '../../components/student/StepMint'
import CourseSection from '../../components/student/CourseSection'
import CheckCertificate from '../../components/student/CheckCertificate'
import TopCourseSection from '../../components/student/TopCourseSection'
import Footer from '../../components/student/Footer'


const Home = () => {
  return (
    <div className='w-full space-y-15 md:space-y-25'>
      <Hero />
      <StepMint />
      <CourseSection />
      <CheckCertificate />
      <TopCourseSection />

    </div>
  )
}

export default Home
