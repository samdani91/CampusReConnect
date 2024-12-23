import React from "react";
import "./profile.css"

export default function Profile() {
    return (
        <div className="container">
            <div className="card border border-light">
                <div className="card-body">
                    <h5 className="card-title mb-4 p-2">Profile settings</h5>
                    <hr></hr>

                    {/* Name Information Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mb-3">Name information</h6>
                        <p className="mb-1 text">
                            Edit your name. We ask that you use your real identity on CampusReConnect.
                        </p>
                        <h6 className="mt-2">Name</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>A. M Samdani Mozumder</span>
                            <button className="btn btn-primary btn-sm ms-3">Edit name</button>
                        </div>
                    </div>
                    <hr />

                    {/* Degree Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mt-2">Degree</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Bsc</span>
                            <button className="btn btn-primary btn-sm ms-3">Edit Degree</button>
                        </div>
                    </div>

                    <hr />

                    {/* Institution Details Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mt-2 mb-3">Institution details</h6>
                        <div className="mb-2">
                            <strong>Institution</strong>
                            <br />
                            <span>University of Dhaka</span>
                        </div>
                        <div className="mb-3 ">
                            <strong>Department</strong>
                            <br />
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Institute of Information Technology</span>
                                <button className="btn btn-primary btn-sm ms-3">Edit details</button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

