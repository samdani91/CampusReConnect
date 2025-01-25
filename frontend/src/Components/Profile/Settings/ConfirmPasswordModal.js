import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmPasswordModal = ({ show, handleClose }) => {
    const [password, setPassword] = useState(""); 
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            setPassword("");
            setMessage(""); 
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
                data: { password }, 
                withCredentials: true,
            })
            .then((response) => {
                setMessage(response.data.message); 
                setTimeout(() => {
                    handleClose();
                    navigate("/"); 
                }, 2000);
            })
            .catch((error) => {
                setMessage(
                    error.response?.data?.message || "An error occurred. Please try again."
                ); 
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
