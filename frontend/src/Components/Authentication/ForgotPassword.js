import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');
    const navigate = useNavigate();

    // Handle Forgot Password submission
    const handleForgotPassword = (e) => {
        e.preventDefault();

        // Call backend API to send the verification code
        axios.post('http://localhost:3001/forgot-password', { email })
            .then((result) => {
                if (result.data === 'Verification email sent') {
                    setVerificationMessage('A verification code has been sent to your email.');
                    navigate('/verify-code');
                } else {
                    setVerificationMessage("User doesn't exist or an error occurred.");
                }
            })
            .catch((err) => {
                console.error(err);
                setVerificationMessage('Error sending verification email. Please try again.');
            });
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="bg-white p-3 rounded-2 mx-3">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Enter Registered Email</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                autoComplete="off"
                                name="email"
                                className="form-control-lg rounded-2 w-100 custom-input"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 rounded-0">
                            Send Verification Code
                        </button>
                        <p className="text-success mt-3">{verificationMessage}</p>

                        <button
                            type="button"
                            className="btn btn-secondary w-100 rounded-0 mt-3"
                            onClick={onBack}
                        >
                            Back to Login
                        </button>
                    </form>
                </div>
            </div>

        </>

    );
}
