import React, { useState,useEffect } from "react";
import "./EditNameModal.css";
import axios from "axios";

export default function EditNameModal({ show, handleClose, type, onSave }) {
    const [newValue, setNewValue] = useState(""); // State to store the updated value
    const [message, setMessage] = useState(""); // State to store success/error messages

    useEffect(() => {
        if (show) {
            setNewValue(""); // Clear the input field
        }
    }, [show, type]);
    if (!show) return null;

    const contentMap = {
        full_name: {
            title: "Edit Name",
            label: "Full Name",
            placeholder: "Enter your full name",
        },
        degree: {
            title: "Edit Degree",
            label: "Degree",
            placeholder: "Enter your degree",
        },
        department: {
            title: "Edit Department",
            label: "Department",
            placeholder: "Enter your department",
        },
    };

    const content = contentMap[type] || contentMap.full_name;

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        try {
            // Send update request to backend
            const response = await axios.put(
                "http://localhost:3001/update-user-details",
                { field: type, value: newValue },
                { withCredentials: true }
            );
            setMessage(response.data.message); // Display success message

            // Call onSave to update the parent component
            onSave(type, newValue);

            setTimeout(() => {
                setMessage("");
                handleClose(); // Close the modal after success
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-container p-3">
                <div className="modal-header">
                    <h5 className="modal-title mb-3">{content.title}</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSaveChanges}>
                        <div className="mb-3">
                            <label className="form-label mb-3">{content.label}</label>
                            <input
                                type="text"
                                className="form-control rounded-2 w-100"
                                placeholder={content.placeholder}
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
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

                        <div className="d-flex justify-content-end mt-5">
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
