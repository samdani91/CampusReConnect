import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { NotificationContext } from "../Context/NotificationContext";

export default function Navbar({ setUser, setShowNavbar }) {
    const { hasUnseenNotifications, markNotificationsAsSeen } = useContext(NotificationContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(null);

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location]);


    const handleNotificationClick = () => {
        markNotificationsAsSeen();
    };

    const handleSettings = () => {
        navigate("/settings");
    };

    const handleViewProfile = () => {
        navigate("/view-profile");
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });

            setUser(false);
            setShowNavbar(false);

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
                    <Link className="navbar-brand fw-bold fs-4 me-5" to="/feed">
                        CampusReConnect
                    </Link>

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


                    <div className="collapse navbar-collapse" id="navbarContent">
                        <div className="nav-links">
                            <NavLink
                                className={`nav-item  ${activeLink === "/feed" ? "active" : ""}`}
                                to="/feed"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                className={`nav-item  ${activeLink === "/community" ? "active" : ""}`}
                                to="/community"
                            >
                                Community
                            </NavLink>
                        </div>
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

                        <form className="d-none d-md-flex flex-grow-1 align-items-center  justify-content-center">
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


                        <div className="d-flex align-items-center">
                            <NavLink
                                className={`nav-item me-4 ${activeLink === "/notifications" ? "active" : ""}`}
                                to="/notifications"
                                onClick={handleNotificationClick}
                            >
                                <i className="bx bx-bell"></i>
                                {hasUnseenNotifications && <span className="notification-badge">!</span>}
                            </NavLink>

                            <NavLink
                                className={`nav-item me-4 ${activeLink === "/message" ? "active" : ""}`}
                                to="/message"
                            >
                                <i className="bx bx-envelope"></i>
                            </NavLink>

                            <div className="dropdown me-2">
                                <button className={`btn me-3 nav-item ${activeLink === "/settings" || activeLink === "/view-profile" ? "active" : ""}`}
                                    id="userDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
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


                            <button className="btn btn-primary">Add New</button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
