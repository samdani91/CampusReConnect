import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Home/Footer.js';
import { useNavigate } from 'react-router-dom';

export default function EnterVerificationCode({ email, onCodeVerified }) {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleCodeSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/verify-code', { email, code })
            .then((response) => {
                if (response.data.message === 'Code verified') {
                    navigate('/reset-password'); // Navigate only after code is verified
                } else {
                    setMessage('Invalid code. Please try again.');
                }
            })
            .catch((err) => {
                console.error(err);
                setMessage('An error occurred. Please try again.');
            });

    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="bg-white p-3 rounded-2 mx-3">
                    <h2>Enter Verification Code</h2>
                    <form onSubmit={handleCodeSubmit}>
                        <div className="mb-3">
                            <label htmlFor="code">
                                <strong>Verification Code</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter the code"
                                autoComplete="off"
                                name="code"
                                className="form-control-sm rounded-2 w-100 custom-input"
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 rounded-0">
                            Verify Code
                        </button>
                        <p className="text-danger mt-3">{message}</p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
