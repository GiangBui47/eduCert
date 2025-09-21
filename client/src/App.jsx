
import { Route, Routes } from 'react-router'
import Home from './pages/student/Home.jsx'
import Navbar from './components/student/Navbar.jsx'
import CourseList from './pages/student/CourseList.jsx'
import Footer from './components/student/Footer.jsx'
import CourseDetail from './pages/student/CourseDetail.jsx'

function App() {


  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetail />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
