import React,{ useState } from "react";
import axios from "axios";
import "./EditNameModal.css";

export default function ChangePassModal({ show, handleClose }) {
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [message, setMessage] = useState("");
    if (!show) return null; 

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (password !== password2) {
            setMessage("Passwords do not match");
        }else{

            axios.put(
                "http://localhost:3001/change-password",
                {
                    passwords: password2
                },
                {
                    withCredentials: true,
                }
            )
                .then((response) => {
                    setMessage(response.data.message);
                    setTimeout(() => {
                        setMessage("");
                        handleClose();
                    }, 2000);
                })
                .catch((error) => {
                    setMessage(
                        error.response?.data?.message || "An error occurred. Please try again."
                    );
                });
        }

        
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-container p-3">
                <div className="modal-header">
                    <h5 className="modal-title mb-3">Change Password</h5>
                    
                </div>

                <div className="modal-body">
                    <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                            <label className="form-label mb-3">New Password</label>
                            <input
                                type="password"
                                className="form-control rounded-2 w-100"
                                placeholder="Enter New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label mb-3">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control rounded-2 w-100"
                                placeholder="Enter New Password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                        </div>

                        {message && (
                            <p
                                className={`mt-3 ${
                                    message.toLowerCase().includes("success")
                                        ? "text-success"
                                        : "text-danger"
                                }`}
                            >
                                {message}
                            </p>
                        )}

                        <div className="d-flex justify-content-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-danger me-2"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    );
}