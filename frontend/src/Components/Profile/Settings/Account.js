import React, { useState } from "react";
import ChangePassModal from "./ChangePassModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ConfirmPasswordModal from "./ConfirmPasswordModal";

export default function Account() {
    const [showChangePassModal, setShowChangePassModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const openChangePassModal = () => setShowChangePassModal(true);
    const closeChangePassModal = () => setShowChangePassModal(false);

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);

    const openPasswordModal = () => {
        setShowDeleteModal(false); // Close the first modal
        setShowPasswordModal(true);
    };
    const closePasswordModal = () => setShowPasswordModal(false);

    return (
        <div className="container">
            <div className="card border border-light">
                <div className="card-body">
                    <h5 className="card-title mb-4 p-2">Account Settings</h5>
                    <hr />

                    {/* Change Password Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mt-2">Password</h6>
                        <p className="mb-1 text-wrap">
                            We suggest you use a password you don't use anywhere else to help keep your account secure.
                        </p>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary btn-sm" onClick={openChangePassModal}>
                                Change Password
                            </button>
                        </div>
                    </div>
                    <hr />

                    {/* Delete Account Section */}
                    <div className="mb-4 p-2">
                        <h6 className="mt-2 mb-3">Delete Your Account</h6>
                        <p>Are you sure you want to delete your account?</p>
                        <span>
                            <strong>Please note: </strong>If you delete your account, you won't be able to reactivate it later.
                        </span>
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={openDeleteModal}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangePassModal show={showChangePassModal} handleClose={closeChangePassModal} />
            <DeleteConfirmationModal
                show={showDeleteModal}
                handleClose={closeDeleteModal}
                handleContinue={openPasswordModal}
            />
            <ConfirmPasswordModal
                show={showPasswordModal}
                handleClose={closePasswordModal}
            />
        </div>
    );
}
