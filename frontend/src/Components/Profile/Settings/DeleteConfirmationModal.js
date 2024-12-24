import React from "react";

export default function DeleteConfirmationModal({ show, handleClose, handleContinue }) {
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)",backdropFilter: "blur(5px)"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Are you sure you want to delete your account?</h5>
                    </div>
                    <div className="modal-body">
                        <p>
                            Deleting your account means that your profile will be deleted, including
                            your profile information, stats, and connections. You also won't be able
                            to reactivate your account later.
                        </p>
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
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
