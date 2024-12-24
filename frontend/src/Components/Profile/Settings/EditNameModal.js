import React from "react";
import "./EditNameModal.css";

export default function EditNameModal({ show, handleClose, type }) {
    if (!show) return null; // Do not render the modal if `show` is false

    // Determine the content based on the `type` prop
    const contentMap = {
        name: {
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

    const content = contentMap[type] || contentMap.name; // Fallback to 'name' if `type` is not provided

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-container p-3">
                <div className="modal-header">
                    <h5 className="modal-title mb-3">{content.title}</h5>
                </div>
                <p>{content.paragraph}</p>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label className="form-label mb-3">{content.label}</label>
                            <input
                                type="text"
                                className="form-control rounded-2 w-100"
                                placeholder={content.placeholder}
                            />
                        </div>

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
