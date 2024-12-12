import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Home/Footer.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword({ onPasswordReset }) {
    const location = useLocation();
    const email = location.state?.email || '';
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        axios.post('http://localhost:3001/reset-password', { email, newPassword })
            .then((response) => {
                if (response.data.message === 'Password updated') {
                    setMessage('Password successfully updated.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            })
            .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 400) {
                    setMessage(err.response.data.message)
                }
                else setMessage('An error occurred. Please try again.');
            });
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="bg-white p-3 rounded-2 mx-3">
                    <h2>Reset Password</h2>
                    <form onSubmit={handlePasswordReset}>
                        <div className="mb-3">
                            <label htmlFor="newPassword">
                                <strong>New Password</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                autoComplete="off"
                                name="newPassword"
                                className="form-control-sm rounded-2 w-100 custom-input"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword">
                                <strong>Confirm New Password</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                autoComplete="off"
                                name="confirmPassword"
                                className="form-control-sm rounded-2 w-100 custom-input"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100 rounded-0">
                            Update Password
                        </button>
                        <p className={`mt-3 ${message === 'Password successfully updated.' ? 'text-success' : 'text-danger'}`}>{message}</p>
                    </form>
                </div>

            </div>
            <Footer />
        </>

    );
}
