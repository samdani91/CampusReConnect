import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Footer from '../../Home/Footer';
import Account from './Account';

export default function Setting() {
    const [activeComponent, setActiveComponent] = useState('Profile'); // State to manage active component

    return (
        <>
            <div className="container-md mt-3 d-flex justify-content-center vh-100">
                <div className="w-40">
                    {/* Pass setActiveComponent to Sidebar */}
                    <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
                </div>
                <div className="w-70">
                    {/* Conditionally render components */}
                    {activeComponent === 'Profile' && <Profile />}
                    {activeComponent === 'Account' && <Account />}
                </div>
            </div>
            <Footer />
        </>
    );
}
