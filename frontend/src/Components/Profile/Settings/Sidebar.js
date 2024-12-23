import React from 'react';
import './sidebar.css';

const Sidebar = ({ setActiveComponent, activeComponent }) => {
    return (
        <div className="sidebar p-3 bg-light rounded">
            <h5 className="mb-4 p-2">Settings</h5>
            <hr />
            <ul className="list-unstyled">
                <li className={`mb-3 ${activeComponent === 'Profile' ? 'active' : ''}`}>
                    <button
                        className="btn text-start w-100"
                        onClick={() => setActiveComponent('Profile')}
                    >
                        <i className="bx bx-user-circle"></i> <span className="p-2">Profile</span>
                    </button>
                </li>
                <li className={`${activeComponent === 'Account' ? 'active' : ''}`}>
                    <button
                        className="btn text-start w-100"
                        onClick={() => setActiveComponent('Account')}
                    >
                        <i className="bx bxs-key"></i> <span className="p-2">Account</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
