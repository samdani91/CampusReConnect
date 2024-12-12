import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Home/Footer.js';
import ForgotPassword from './ForgotPassword';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();

    // Login handler
    const handleLogin = (e) => {
        e.preventDefault();
    
        axios.post('http://localhost:3001/login', { email, password })
            .then((result) => {
                if (result.data.message === 'Login Successful') {
                    setMessage('Login Successful');
                    setTimeout(() => {
                        navigate('/home');
                    }, 1000);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    // Handle credentials mismatch specifically
                    setMessage('Credentials Mismatch');
                } else {
                    // Handle all other errors
                    // console.error(err);
                    setMessage('An error occurred during login.');
                }
            });
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="bg-white p-3 rounded-2 mx-3">
                    {showForgotPassword ? (
                        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
                    ) : (
                        <>
                            <h2>Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email">
                                        <strong>Email</strong>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter institutional email"
                                        autoComplete="off"
                                        name="email"
                                        className="form-control-sm rounded-2 w-100 custom-input"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password">
                                        <strong>Password</strong>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        autoComplete="off"
                                        name="password"
                                        className="form-control-sm rounded-2 w-100 custom-input"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="btn btn-success w-100 rounded-0">
                                    Login
                                </button>

                                <p className={`mt-3 ${message === 'Login Successful' ? 'text-success' : 'text-danger'}`}>{message}</p>

                                <button
                                    type="button"
                                    className="btn btn-link w-100 mt-0 text-center"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot Password?
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
