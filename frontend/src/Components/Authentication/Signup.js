import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import Footer from '../Home/Footer.js';

export default function Signup() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [department, setDepartment] = useState();
    const [role, setRole] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [error, setError] = useState();
    const [message, setMessage] = useState('');
    const [code, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError("Passwords do not match");
        } else {
            setError("");

            axios.post('http://localhost:3001/send-otp', { email })
                .then(() => {
                    setMessage('OTP sent to your email');
                    setStep(2);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.message) {
                        setMessage(error.response.data.message);
                    } else {
                        setMessage("An unexpected error occurred. Please try again.");
                    }
                });
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/verify-code', { email, code })
            .then(() => {
                axios.post('http://localhost:3001/register', { name, email, department, role, password })
                    .then(response => {
                        setMessage(response.data.message);
                        setTimeout(() => {
                            navigate('/login');
                        }, 1000);
                    })
                    .catch(error => {
                        if (error.response && error.response.data && error.response.data.message) {
                            setMessage(error.response.data.message);
                        } else {
                            setMessage("An unexpected error occurred. Please try again.");
                        }
                    });
            })
            .catch((error) => {
                setMessage(error.response?.data?.message || 'Error verifying OTP');
            });
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center  vh-100">
                <div className="bg-white p-3 rounded-2 mx-3">
                    <h2>Registration</h2>
                    {step === 1 ? (
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong>Name</strong>
                                </label>
                                <input type="text" placeholder="Enter name" autoComplete="off" name="name" className="form-control-sm rounded-2 w-100 custom-input" required onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong>Email</strong>
                                </label>
                                <input type="text" placeholder="Enter instituional email" autoComplete="off" name="email" className="form-control-sm rounded-2 w-100 custom-input" required onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong>Department</strong>
                                </label>
                                <input type="text" placeholder="Enter Department Name" autoComplete="off" name="department" className="form-control-sm rounded-2 w-100 custom-input" required onChange={(e) => setDepartment(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label>
                                    <strong>Role</strong>
                                </label>
                                <div className="d-flex">
                                    <div className="form-check me-3">
                                        <input
                                            type="radio"
                                            id="student"
                                            name="role"
                                            value="Student"
                                            className="form-check-input"
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="student" className="form-check-label">Student</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            id="faculty"
                                            name="role"
                                            value="Faculty"
                                            className="form-check-input"
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="faculty" className="form-check-label">Faculty</label>
                                    </div>
                                </div>
                            </div>


                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong>Password</strong>
                                </label>
                                <input type="password" placeholder="Enter password" autoComplete="off" name="password" className="form-control-sm rounded-2 w-100 custom-input" required onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong>Confirm Password</strong>
                                </label>
                                <input type="password" placeholder="Re enter password" autoComplete="off" name="password" className="form-control-sm rounded-2 w-100 custom-input" required onChange={(e) => setPassword2(e.target.value)} />
                            </div>

                            <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-3">
                                <label htmlFor="otpCode">
                                    <strong>Verification Code</strong>
                                </label>
                                <input
                                    type="text"
                                    id="otpCode"
                                    placeholder="Enter the code"
                                    name="otpCode"
                                    autoComplete="off"
                                    className="form-control-sm rounded-2 w-100 custom-input"
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100 rounded-0">
                                Verify Code
                            </button>
                            <p className="mt-3">Didn't receive a code?</p>
                            <button type="submit" onClick={handleRegister} className="btn btn-danger w-100 rounded-0">
                                Resend Code
                            </button>
                        </form>
                    )}


                    <p className={`mt-3 ${(message === 'Registration Successful' || message === 'OTP sent to your email' || message === 'Code Matched!') ? 'text-success' : 'text-danger'}`}>{message}</p>


                    {step === 1 && (
                        <>
                            <p>Already have an account?</p>
                            <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Login</Link>
                        </>
                    )}



                </div>
            </div>

            <Footer />

        </>
    )
}
