import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Home/Footer.js';

export default function ResetPassword({ email, onPasswordReset }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        axios.post('http://localhost:3001/reset-password', { email, newPassword })
            .then((response) => {
                if (response.data === 'Password updated') {
                    setMessage('Password successfully updated.');
                    onPasswordReset(); // Redirect or show a success message
                } else {
                    setMessage(response.data.error || 'An error occurred.');
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
                        <p className="text-danger mt-3">{message}</p>
                    </form>
                </div>

            </div>
            <Footer />
        </>

    );
}
