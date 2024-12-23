import React from "react";
import "./profile.css"

export default function Account() {
    return (
        <div className="container">
            <div className="card border border-light">
                <div className="card-body">
                    <h5 className="card-title mb-4 p-2">Account settings</h5>
                    <hr></hr>

                    {/* Name Information Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mb-3">Email Address</h6>
                        <p className="mb-1 text">
                            This is your email address is where you will receive email notifications.
                        </p>
                        <h6 className="mt-2">Email</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>xyz@it.du.ac.bd</span>
                        </div>
                    </div>
                    <hr />

                    {/* Degree Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mt-2">Password</h6>
                        <p className="mb-1 text-wrap">
                            We suggest you use a password you don't use anywhere else to help keep your account secure.
                        </p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary btn-sm">Change Password</button>
                        </div>


                    </div>

                    <hr />

                    {/* Institution Details Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mt-2 mb-3">Delete your account</h6>
                        <div className="mb-2">
                            <p>Are you sure you want to delete your account?</p>
                        </div>
                        <div className="mb-3 ">
                        <span><strong>Please note: </strong>If you delete your account, you won't be able to reactivate it later.</span>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-danger btn-sm">Delete Account</button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

