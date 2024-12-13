export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom shadow-sm">
                <div className="container-fluid">

                    {/* Brand Name */}
                    <a className="navbar-brand fw-bold fs-3" href="#">CampusReConnect</a>

                    {/* Hamburger Menu Button */}
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

                    {/* Collapsible Navbar Content */}
                    <div className="collapse navbar-collapse" id="navbarContent">

                        {/* Search Bar for Small Screens */}
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

                        {/* Right Side Content */}
                        <div className="ms-auto d-flex align-items-center flex-wrap">
                            {/* Icons */}
                            <button className="btn" type="button">
                                <i className="bx bx-bell"></i>
                            </button>
                            <button className="btn" type="button">
                                <i className="bx bx-envelope"></i>
                            </button>
                            <button className="btn" type="button">
                                <i className="bx bx-comment-detail"></i>
                            </button>

                            {/* User Dropdown */}
                            <div className="dropdown me-3">
                                <button
                                    className="btn"
                                    type="button"
                                    id="userDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-user-circle"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li><a className="dropdown-item" href="#">Your Profile</a></li>
                                    <li><a className="dropdown-item" href="#">Your Saved List</a></li>
                                    <li><a className="dropdown-item" href="#">Settings</a></li>
                                    <li><a className="dropdown-item" href="#">Help Center</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Log Out</a></li>
                                </ul>
                            </div>

                            {/* Add New Button */}
                            <button className="btn btn-primary">Add New</button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
