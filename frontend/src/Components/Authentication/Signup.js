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
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError("Passwords do not match");
        }  else {
            setError(""); // Clear any previous errors
    
            axios.post('http://localhost:3001/register', { name, email, department, role, password })
                .then(response => {
                    alert(response.data.message); // Display the success message from backend
                    navigate('/home'); // Redirect to login on successful registration
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.message) {
                        alert(error.response.data.message); // Display the error message from backend
                    } else {
                        alert("An unexpected error occurred. Please try again.");
                    }
                });
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center  vh-100">
                <div className="bg-white p-3 rounded-2 mx-3">
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Name</strong>
                            </label>
                            <input type="text" placeholder="Enter name" autoComplete="off" name="name" className="form-control-sm rounded-2 w-100 custom-input" onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Email</strong>
                            </label>
                            <input type="text" placeholder="Enter instituional email" autoComplete="off" name="email" className="form-control-sm rounded-2 w-100 custom-input" onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Department</strong>
                            </label>
                            <input type="text" placeholder="Enter Department Name" autoComplete="off" name="department" className="form-control-sm rounded-2 w-100 custom-input" onChange={(e) => setDepartment(e.target.value)} />
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
                                    />
                                    <label htmlFor="faculty" className="form-check-label">Faculty</label>
                                </div>
                            </div>
                        </div>


                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Password</strong>
                            </label>
                            <input type="password" placeholder="Enter password" autoComplete="off" name="password" className="form-control-sm rounded-2 w-100 custom-input" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Confirm Password</strong>
                            </label>
                            <input type="password" placeholder="Re enter password" autoComplete="off" name="password" className="form-control-sm rounded-2 w-100 custom-input" onChange={(e) => setPassword2(e.target.value)} />
                        </div>

                        {error && <p className="text-danger">{error}</p>}

                        <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
                    </form>
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Login</Link>


                </div>
            </div>

            <Footer />

        </>
    )
}
