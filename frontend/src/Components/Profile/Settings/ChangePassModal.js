import React from "react";
import "./EditNameModal.css";

export default function ChangePassModal({ show, handleClose }) {
    if (!show) return null; // Do not render the modal if show is false

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-container p-3">
                <div className="modal-header">
                    <h5 className="modal-title mb-3">Change Password</h5>
                    
                </div>

                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label className="form-label mb-3">New Password</label>
                            <input
                                type="text"
                                className="form-control rounded-2 w-100"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label mb-3">Confirm New Password</label>
                            <input
                                type="text"
                                className="form-control rounded-2 w-100"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={handleClose}
                                >
                                    Close
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