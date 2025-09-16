
import { Route, Routes } from 'react-router'
import Home from './pages/student/Home.jsx'
import Navbar from './components/student/Navbar.jsx'

function App() {


  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
