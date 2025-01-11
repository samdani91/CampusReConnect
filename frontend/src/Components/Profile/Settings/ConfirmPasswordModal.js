import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmPasswordModal = ({ show, handleClose }) => {
    const [password, setPassword] = useState(""); // Store the password input
    const [message, setMessage] = useState(""); // Store success/error messages
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            setPassword("");
            setMessage(""); // Clear the input field
        }
    }, [show]);
    if (!show) return null;

    const handleDeleteAccount = () => {
        if (!password) {
            setMessage("Password is required");
            return;
        }

        axios
            .delete("http://localhost:3001/delete-account", {
                data: { password }, // Pass the password in the request body
                withCredentials: true, // Include cookies in the request
            })
            .then((response) => {
                setMessage(response.data.message); // Display success message
                setTimeout(() => {
                    handleClose(); // Close the modal
                    navigate("/"); // Redirect to the root page
                }, 2000);
            })
            .catch((error) => {
                setMessage(
                    error.response?.data?.message || "An error occurred. Please try again."
                ); // Display error message
            });
    };

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(5px)",
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Your Password</h5>
                    </div>
                    <div className="modal-body">
                        <p>If you still want to delete your account, please confirm your password.</p>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {message && (
                            <p
                                className={`mt-3 ${message.toLowerCase().includes("success")
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPasswordModal;
