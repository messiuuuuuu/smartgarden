// Home.js
import React from 'react';
import GardenList from './GardenList'; 
import Sidebar from './sidebar'
import { Navigate, Outlet } from 'react-router-dom'

const Home = () => {
    return (
        <div className='flex w-full h-screen flex-auto'>
            <div className="flex-shrink-0">
                 <Sidebar />
            </div>
            <div className='flex-auto bg-white shadow-md h-full p-4 overflow-y-scroll'>
                <Outlet />
            </div>
        </div>
    )
};

export default Home;
