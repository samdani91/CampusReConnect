import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from './Carousel';
import Footer from './Footer';
import TopicSection from './TopicSection';

export default function Landing() {
    return (
        <>
            <nav className="navbar navbar-expand-sm bg-body-tertiary py-2">
                <div className="container-md">
                    <a className="navbar-brand fw-bold fs-3" href="#" >CampusReConnect</a>
                    <button className="navbar-toggler " type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
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

            <section>
                <div className="container-md mt-5 vh-100">
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-section">
                            <h1 className="fs-3 fw-bold projectDes">
                            A Platform For Research Activities within the <span className='text-secondary'>University of Dhaka</span>.
                            Empowering you with scientific knowledge and a vibrant community of researchers.
                            </h1>
                            <Link className="btn btn-success btn-lg mt-4 mb-3" to="/register">
                                Register
                            </Link>
                        </div>
                        <div className="col-lg-6">
                            <Carousel/>
                        </div>
                    </div>
                </div>
            </section>

            <section>
            <div className="container-md my-5 bg-body-tertiary">
                    {/* <TopicSection></TopicSection> */}
                </div>
            </section>
            <Footer/>
        </>
    );
}
