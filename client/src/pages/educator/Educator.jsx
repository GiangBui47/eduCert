import React from 'react'
import Sidebar from '../../components/educator/Sidebar'
import { Outlet } from 'react-router'

const Educator = () => {
    return (
        <div className='relative min-h-screen w-screen'>
            <div className='relative z-10 flex'>
                <Sidebar />
                <div className="flex-1 p-5 md:p-10 bg-gradient-to-b from-cyan-100/40">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Educator
