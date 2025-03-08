import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";


export default function Navbar({ setUser, setShowNavbar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-userId", {
                    withCredentials: true,
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Error fetching current user data:", error);
            }
        };

        fetchCurrentUser();
    }, []);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/notifications/${currentUser?.user_id}`,{withCredentials:true});

                setNotifications(response.data);
                const unseenNotifications = response.data.filter(notification => !notification.seen);
                setUnseenCount(unseenNotifications.length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (currentUser) {
            fetchNotifications();
        }
    }, [currentUser,notifications]);


    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            searchUsers(query);
        } else {
            setSearchResults([]); 
        }
    };


    const searchUsers = async (query) => {
        try {
            const response = await axios.get(`http://localhost:3001/search-users`, {
                params: { name: query },
                withCredentials: true,
            });
            setSearchResults(response.data); 
        } catch (error) {
            console.error('Error fetching users:', error);
            setSearchResults([]); 
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/view-profile/${userId}`);
    };



    const handleNotificationClick = async() => {
        try {
            await axios.post(
                "http://localhost:3001/mark-notifications-as-seen",
                { user_id: currentUser?.user_id },
                { withCredentials: true }
            );
            setUnseenCount(0);
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };

    const handleSettings = () => {
        navigate("/settings");
    };

    const handleViewProfile = () => {
        const userId = currentUser.user_id;
        navigate(`/view-profile/${userId}`);
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

    const handleAddNewClick = () => {
        if (currentUser) {
            navigate(`/view-profile/${currentUser.user_id}?tab=Research`);
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
                            <div className="position-relative w-100"> {/* Wrap input and dropdown in a relative container */}
                                <input
                                    className="form-control w-100" // Use w-100 to fill the container
                                    type="search"
                                    placeholder="Search for research, journals, people, etc."
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{ outline: "none", boxShadow: "none" }}
                                />
                                {searchResults.length > 0 && (
                                    <ul className="dropdown-menu position-absolute w-100 mt-1" style={{ display: 'block', zIndex: 1000 }}>
                                        {searchResults.map((user) => (
                                            <button key={user.user_id} className="dropdown-item" onClick={() => handleUserClick(user.user_id)}>
                                                <span>{user.full_name}</span>
                                            </button>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button type="submit" className="btn btn-light ms-2" onClick={handleSearchChange}>
                                <i className="bx bx-search"></i>
                            </button>
                        </form>

                        <form className="d-none d-md-flex flex-grow-1 align-items-center justify-content-center">
                            <div className="position-relative w-50"> {/* Wrap input and dropdown in a relative container */}
                                <input
                                    className="form-control w-100" // Use w-100 to fill the container
                                    type="search"
                                    placeholder="Search for research, journals, people, etc."
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{ outline: "none", boxShadow: "none" }}
                                />
                                {searchResults.length > 0 && (
                                    <ul className="dropdown-menu position-absolute w-100 mt-1" style={{ display: 'block', zIndex: 1000 }}>
                                        {searchResults.map((user) => (
                                            <button key={user.user_id} className="dropdown-item" onClick={() => handleUserClick(user.user_id)}>
                                                <span>{user.full_name}</span>
                                            </button>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button type="submit" className="btn btn-light ms-2" onClick={handleSearchChange}>
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
                                {unseenCount > 0 && <span className="notification-badge">!</span>}
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


                            <button className="btn btn-primary" onClick={handleAddNewClick}>Add New</button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
