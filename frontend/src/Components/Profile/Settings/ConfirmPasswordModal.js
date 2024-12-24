import React from "react";

export default function ConfirmPasswordModal({ show, handleClose }) {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)",backdropFilter: "blur(5px)" }}>
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
                        />
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
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
