import React, { useContext } from "react";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { NotificationContext } from "../Context/NotificationContext";

export default function Navbar({ setUser,setShowNavbar }) {
    const { hasUnseenNotifications, markNotificationsAsSeen } = useContext(NotificationContext);
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        markNotificationsAsSeen();
        navigate("/notifications");
    };

    const handleMessageClick = () => {
        navigate("/message");
    };

    const handleSettings = () => {
        navigate("/settings");
    };

    const handleViewProfile = () => {
        navigate("/view-profile");
    };

    const handleLogout = async () => {
        try {
            // Call API to clear the cookie on the server
            await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });

            // Update the user state to indicate the user is logged out
            setUser(false);
            setShowNavbar(false);

            // Redirect to the landing page
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container-fluid">
                    {/* Brand */}
                    <Link className="navbar-brand fw-bold fs-3 me-5" to="/feed">
                        CampusReConnect
                    </Link>

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
                                style={{ outline: "none", boxShadow: "none" }}
                            />
                            <button type="submit" className="btn btn-light ms-2">
                                <i className="bx bx-search"></i>
                            </button>
                        </form>

                        {/* Search Bar for Larger Screens */}
                        <form className="d-none d-md-flex flex-grow-1 me-2 align-items-center justify-content-center">
                            <input
                                className="form-control w-50"
                                type="search"
                                placeholder="Search for research, journals, people, etc."
                                aria-label="Search"
                                style={{ outline: "none", boxShadow: "none" }}
                            />
                            <button type="submit" className="btn btn-light ms-2">
                                <i className="bx bx-search"></i>
                            </button>
                        </form>

                        {/* Right Side Elements */}
                        <div className="d-flex align-items-center">
                            {/* Notification */}
                            <button
                                className="btn position-relative me-2"
                                onClick={handleNotificationClick}
                            >
                                <i className="bx bx-bell"></i>
                                {hasUnseenNotifications && <span className="notification-badge">!</span>}
                            </button>

                            {/* Other Icons */}
                            <button className="btn me-2" onClick={handleMessageClick}>
                                <i className="bx bx-envelope"></i>
                            </button>

                            {/* User Dropdown */}
                            <div className="dropdown me-2">
                                <button className="btn" id="userDropdown" data-bs-toggle="dropdown">
                                    <i className="bx bx-user-circle"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <button className="dropdown-item" onClick={handleViewProfile}>
                                            Your Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleSettings}>
                                            Settings
                                        </button>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="btn btn-danger ms-3" onClick={handleLogout}>
                                            Log Out
                                        </button>
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
