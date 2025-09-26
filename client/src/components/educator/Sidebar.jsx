import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import { Link, NavLink } from 'react-router';
import { UserButton, useUser } from '@clerk/clerk-react';

const Sidebar = () => {
    const { isEducator } = useContext(AppContext);
    const { user } = useUser()
    const menuItems = [
        { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
        { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
        { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
        { name: 'Notification', path: '/educator/notification', icon: assets.notification_icon },
    ];
    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 flex flex-col shadow md:shadow-2xl z-20'>
            <div className='border-b border-gray-400'>
                <div className='flex flex-col items-center px-4 md:px-10 py-3.5'>
                    <Link to='/' >
                        <img src={assets.logo} alt="" className='w-10 lg:w-20' />
                    </Link>
                    <div className='flex items-center gap-2 text-blue-800 relative'>
                        {user ? <UserButton /> : <img className='max-w-8' src={assets.profile_img} />}
                        <p className='md:block hidden'>Hi! {user ? user.fullName : 'Developers'}</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                {menuItems.map((item) => (
                    <NavLink
                        className={({ isActive }) => `flex items-center md:flex-row
                    flex-col md:justify-start justify-center py-3.5 md:px-10  gap-3 
                    ${isActive ? 'bg-indigo-600/20 border-r-[6px] border-indigo-500/90'
                                : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
                        to={item.path} key={item.name} end={item.path === '/educator'}>
                        <img src={item.icon} alt=""
                            className='w-6 h-6' />
                        <p className='md:block hidden text-center'>{item.name}</p>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
