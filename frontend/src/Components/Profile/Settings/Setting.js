import React from 'react'
import Sidebar from './Sidebar'
import Navbar from '../../Navbar/Navbar'
import Profile from './Profile'
import Footer from '../../Home/Footer';

export default function Setting() {
    return (
        <>
            <Navbar />
            <div className='container-md mt-3 d-flex justify-content-center vh-100'>
                <div className='w-40'>
                    <Sidebar />
                </div>
                <div className='w-70'>
                    <Profile />
                </div>

            </div>
            <Footer/>
        </>
    )
};