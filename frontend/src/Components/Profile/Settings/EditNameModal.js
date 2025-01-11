import React, { useState,useEffect } from "react";
import axios from "axios";
import "./EditNameModal.css";

export default function EditNameModal({ show, handleClose, type }) {
    const [newValue, setNewValue] = useState(""); // State to store the updated value
    const [message, setMessage] = useState(""); // State to store success/error messages

    useEffect(() => {
        if (show) {
            setNewValue(""); // Clear the input field
        }
    }, [show, type]);

    if (!show) return null; // Do not render the modal if `show` is false

    // Determine the content based on the `type` prop
    const contentMap = {
        full_name: {
            title: "Edit Name",
            paragraph: "Enter your full name without academic titles or abbreviations.",
            label: "Full Name",
            placeholder: "Enter full name",
        },
        degree: {
            title: "Edit Degree",
            paragraph: "Enter your degree. This information will be displayed on your profile.",
            label: "Degree",
            placeholder: "Enter your degree",
        },
        department: {
            title: "Edit Department",
            paragraph: "Enter your department. This helps us provide relevant connections.",
            label: "Department",
            placeholder: "Enter your department",
        },
    };

    const content = contentMap[type] || contentMap.full_name; // Fallback to 'name' if `type` is not provided

    // Handle form submission
    const handleSaveChanges = (e) => {
        e.preventDefault();

        axios.put(
            "http://localhost:3001/update-user-details",
            {
                field: type, // Field being updated (e.g., 'name', 'degree', 'department')
                value: newValue, // New value entered by the user
            },
            {
                withCredentials: true, // Include cookies in the request
            }
        )
            .then((response) => {
                setMessage(response.data.message); // Display success message
                setTimeout(() => {
                    setMessage("");
                    handleClose(); // Close the modal after success
                }, 2000);
            })
            .catch((error) => {
                setMessage(
                    error.response?.data?.message || "An error occurred. Please try again."
                ); // Display error message
            });
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-container p-3">
                <div className="modal-header">
                    <h5 className="modal-title mb-3">{content.title}</h5>
                </div>
                <p>{content.paragraph}</p>
                <div className="modal-body">
                    <form onSubmit={handleSaveChanges}>
                        <div className="mb-3">
                            <label className="form-label mb-3">{content.label}</label>
                            <input
                                type="text"
                                className="form-control rounded-2 w-100"
                                placeholder={content.placeholder}
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)} // Update state with input value
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
