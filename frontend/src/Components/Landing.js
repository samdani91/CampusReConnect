import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
                <div className="container-md">
                    <a className="navbar-brand fw-bold fs-3" href="#" >CampusReConnect</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link text-success fw-bold fs-5 hover-underline" to="/register">Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-bold fs-5 hover-underline" to="/login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
