import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New journal uploaded to your course." },
        { id: 2, message: "Your profile was viewed by John Doe." },
    ]);
    const [unread, setUnread] = useState(notifications.length > 0);

    const handleDropdownOpen = () => {
        setUnread(false);
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container-fluid">
                    {/* Brand */}
                    <a className="navbar-brand fw-bold fs-3" href="#">
                        CampusReConnect
                    </a>

                    {/* Toggler Button */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                        aria-controls="navbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar Content */}
                    <div className="collapse navbar-collapse" id="navbarContent">
                        {/* Centered Search Bar */}
                        <form className="d-flex d-md-none w-100 my-3">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search for research, journals, people, etc."
                                aria-label="Search"
                                style={{ outline: 'none', boxShadow: 'none' }}
                            />
                            <button type="submit" className="btn btn-light ms-2">
                                <i className="bx bx-search"></i>
                            </button>
                        </form>

                        {/* Search Bar for Larger Screens */}
                        <form className="d-none d-md-flex flex-grow-1 me-2 align-items-center justify-content-center">
                            <input
                                className="form-control w-75"
                                type="search"
                                placeholder="Search for research, journals, people, etc."
                                aria-label="Search"
                                style={{ outline: 'none', boxShadow: 'none' }}
                            />
                            <button type="submit" className="btn btn-light ms-2">
                                <i className="bx bx-search"></i>
                            </button>
                        </form>

                        {/* Right Side Elements */}
                        <div className="d-flex align-items-center">
                            {/* Notification */}
                            <div className="dropdown position-relative me-2">
                                <button
                                    className="btn position-relative"
                                    type="button"
                                    id="notificationsDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={handleDropdownOpen}
                                >
                                    <i className="bx bx-bell"></i>
                                    {unread && <span className="notification-badge">!</span>}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-start">
                                    <li className="dropdown-item fw-bold">Updates</li>
                                    <hr className="m-0" />
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <li key={notification.id} className="dropdown-item">
                                                {notification.message}
                                                <hr className="mt-3 mb-2"/>
                                            </li>
                                            
                                        ))
                                    ) : (
                                        <li className="dropdown-item text-center">
                                            You currently have no new notifications
                                        </li>
                                    )}
                                    <hr className="m-0" />
                                    <li className="text-center">
                                        <a href="#" className="text-primary">
                                            View all
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Other Icons */}
                            <button className="btn me-2">
                                <i className="bx bx-envelope"></i>
                            </button>
                            <button className="btn me-2">
                                <i className="bx bx-comment-detail"></i>
                            </button>

                            {/* User Dropdown */}
                            <div className="dropdown me-2">
                                <button className="btn" id="userDropdown" data-bs-toggle="dropdown">
                                    <i className="bx bx-user-circle"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Your Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Settings
                                        </a>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="btn btn-danger ms-3">Log Out</button>
                                    </li>
                                </ul>
                            </div>

                            {/* Add New */}
                            <button className="btn btn-primary">Add New</button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
