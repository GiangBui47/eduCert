import React from 'react'
import { assets } from "../../assets/assets.js";
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Navbar = () => {

  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUser()
  return (
    <div className='flex  justify-between items-center px-5 sm:px-10 md:px-14 lg:px-36 border-b border-blue-100/50 
    py-4 shadow-md sticky top-0 transition-all duration-300 bg-cyan-100/70 backdrop-blur-md z-20'>
      <img src={assets.logo} alt="logo" className='w-10 lg:w-20 cursor-pointer' onClick={() => navigate('/')} />

      {/* desktop */}
      <div className='hidden md:flex items-center text-gray-500 gap-5'>
        <div className='flex items-center gap-5'>
          {user &&
            <>
              <Link to='/my-enrollment'
                className={`${location.pathname === '/my-enrollment' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-cyan-600'}`}>My Enrollments</Link>

              <Link to='/profile'
                className={`${location.pathname === '/profile' ? 'text-blue-600 font-semibold '
                  : 'text-gray-600 hover:text-cyan-600'}`}>My profile</Link>
            </>
          }

          {user ? <UserButton /> :
            <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full
           hover:to-indigo-700 transition-all duration-300 cursor-pointer'>Create Account</button>
          }
        </div>
      </div>

      {/* mobile */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs '>
          {user &&
            <>
              <Link to='/my-enrollment'
                className={`${location.pathname === '/my-enrollment' ? 'text-blue-600 font-semibold '
                  : 'text-gray-600 hover:text-cyan-600'}`}>My Enrollments</Link>

              <Link to='/profile'
                className={`${location.pathname === '/profile' ? 'text-blue-600 font-semibold '
                  : 'text-gray-600 hover:text-cyan-600'}`}>My profile</Link>
            </>
          }

          {user ? UserButton :
            <button onClick={() => openSignIn()} ><img src={assets.user_icon} alt="" /></button>
          }

        </div>
      </div>
    </div>
  )
}

export default Navbar
