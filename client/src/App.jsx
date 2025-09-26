import { Route, Routes, useMatch } from 'react-router'
import Home from './pages/student/Home.jsx'
import Navbar from './components/student/Navbar.jsx'
import CourseList from './pages/student/CourseList.jsx'
import Footer from './components/student/Footer.jsx'
import CourseDetail from './pages/student/CourseDetail.jsx'
import ProfilePage from './pages/student/ProfilePage.jsx'
import MyEnrollment from './pages/student/MyEnrollment.jsx'
import Educator from './pages/educator/Educator.jsx'
import Dashboard from './pages/educator/Dashboard.jsx'
import AddCourse from './pages/educator/AddCourse.jsx'
import StudentsEnrolled from './pages/educator/StudentsEnrolled.jsx'
import Notification from './pages/educator/Notification.jsx'

function App() {

  const isEducatorRoute = useMatch('/educator/*');
  return (
    <div className='min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetail />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/my-enrollment' element={<MyEnrollment />} />

        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
          <Route path='notification' element={<Notification />} />
        </Route>

      </Routes>
      {!isEducatorRoute && <Footer />}


    </div>
  )
}

export default App